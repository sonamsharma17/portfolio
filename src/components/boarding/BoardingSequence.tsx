"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useJourneyContext } from "@/context/JourneyContext";
import { journeyStations } from "@/data/portfolio";
import { useSoundContext } from "@/context/SoundContext";

gsap.registerPlugin(ScrollTrigger);

type BoardingStep =
  | "idle"
  | "printing"
  | "ticket"
  | "qr-scan"
  | "verification"
  | "punched"
  | "gate"
  | "announcement"
  | "complete";

export default function BoardingSequence() {
  const { playSound } = useSoundContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<BoardingStep>("idle");
  const [printLines, setPrintLines] = useState<string[]>([]);
  const [verifyStep, setVerifyStep] = useState(0);
  const [ticketId, setTicketId] = useState("SE-00000000");
  const [qrPattern, setQrPattern] = useState<boolean[]>([]);
  const [barcodePattern, setBarcodePattern] = useState<boolean[]>([]);

  // Generate ticket details client-side to prevent hydration mismatch and visual reshuffling on step updates
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "SE-";
    for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
    setTicketId(id);

    // Generate QR patterns (8x8 = 64 modules)
    const qr: boolean[] = [];
    for (let i = 0; i < 64; i++) {
      qr.push(Math.random() > 0.5);
    }
    setQrPattern(qr);

    // Generate Barcode patterns (30 lines)
    const barcode: boolean[] = [];
    for (let i = 0; i < 30; i++) {
      barcode.push(Math.random() > 0.5);
    }
    setBarcodePattern(barcode);
  }, []);

  const { setBoarded } = useJourneyContext();

  // Start boarding when section comes into view
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        if (step === "idle") startPrinting();
      },
    });
  }, { scope: containerRef });

  const startPrinting = useCallback(() => {
    setStep("printing");
    const lines = [
      "INITIALIZING TICKET SYSTEM...",
      "CONNECTING TO DEVELOPER EXPRESS NETWORK...",
      "STATUS: CONNECTION ESTABLISHED ✓",
      "FETCHING PASSENGER DETAILS...",
      "PREPARING BOARDING PASS...",
      "PRINTING TICKET...",
    ];

    lines.forEach((line, i) => {
      setTimeout(() => {
        setPrintLines((prev) => [...prev, line]);
        playSound("click");
        if (i === lines.length - 1) {
          setTimeout(() => setStep("ticket"), 800);
        }
      }, (i + 1) * 600);
    });
  }, [playSound]);

  const handleQRClick = () => {
    setStep("qr-scan");
    playSound("scanner");
    // Start verification sequence
    setTimeout(() => {
      setStep("verification");
      const steps = [0, 1, 2, 3];
      steps.forEach((s, i) => {
        setTimeout(() => {
          setVerifyStep(s);
          playSound("click");
          if (s === 3) {
            setTimeout(() => setStep("punched"), 1000);
          }
        }, (i + 1) * 800);
      });
    }, 1500);
  };

  const handleGateOpen = () => {
    setStep("gate");
    playSound("steam");
    setTimeout(() => {
      setStep("announcement");
      playSound("announcement");
      setTimeout(() => {
         setStep("complete");
         playSound("departure");
         setBoarded();
      }, 4000);
    }, 2500);
  };

  // Animation when step changes to "punched"
  useEffect(() => {
    if (step === "punched") {
      playSound("punch");
      setTimeout(handleGateOpen, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <section
      ref={containerRef}
      id="boarding"
      className="relative min-h-screen flex items-center justify-center py-20 px-4"
      style={{
        background: "linear-gradient(180deg, var(--bg-primary) 0%, #0f1520 50%, var(--bg-primary) 100%)",
      }}
    >
      <div className="max-w-2xl w-full mx-auto">
        {/* ============ TICKET PRINTER ============ */}
        {(step === "idle" || step === "printing") && (
          <div className="space-y-6">
            {/* Printer machine */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #2a2a3a 0%, #1a1a2a 100%)",
                border: "2px solid #3a3a4a",
                boxShadow: "0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* Printer header */}
              <div
                className="flex items-center justify-between px-6 py-3"
                style={{
                  background: "linear-gradient(180deg, #333344 0%, #2a2a3a 100%)",
                  borderBottom: "1px solid #3a3a4a",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-xs text-green-400">ONLINE</span>
                </div>
                <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                  RESERVATION TERMINAL v3.7
                </span>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{ background: "#4a4a5a" }} />
                  ))}
                </div>
              </div>

              {/* CRT Screen */}
              <div
                className="mx-6 my-4 rounded-lg p-4 font-mono text-sm"
                style={{
                  background: "#0a0f0a",
                  border: "1px solid #1a2a1a",
                  boxShadow: "inset 0 0 30px rgba(0,255,0,0.03)",
                  minHeight: "200px",
                }}
              >
                {/* Scan lines */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-lg"
                  style={{
                    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
                  }}
                />

                {printLines.map((line, i) => (
                  <div
                    key={i}
                    className="mb-1"
                    style={{
                      color: line.includes("✓") ? "#4CAF50" : "#00FF41",
                      textShadow: "0 0 5px rgba(0,255,65,0.3)",
                      animation: "fade-in 0.3s ease forwards",
                    }}
                  >
                    <span style={{ color: "#666" }}>{">"} </span>
                    {line}
                  </div>
                ))}

                {step === "printing" && (
                  <span
                    className="inline-block w-2 h-4"
                    style={{
                      background: "#00FF41",
                      animation: "typewriter-cursor 0.5s step-end infinite",
                    }}
                  />
                )}
              </div>

              {/* Printer slot */}
              <div
                className="h-2 mx-8 mb-4 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #1a1a2a, #2a2a3a, #1a1a2a)",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
                }}
              />
            </div>
          </div>
        )}

        {/* ============ BOARDING TICKET ============ */}
        {(step === "ticket" || step === "qr-scan" || step === "verification" || step === "punched") && (
          <div
            className="relative rounded-xl overflow-hidden transition-all duration-700"
            style={{
              background: "#f5f0e8",
              boxShadow: "0 10px 40px rgba(0,0,0,0.4), 0 2px 10px rgba(0,0,0,0.2)",
              animation: step === "ticket" ? "scale-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" : undefined,
            }}
          >
            {/* Perforated top edge */}
            <div className="ticket-perforation h-3 w-full" />

            {/* Ticket Header */}
            <div
              className="px-6 py-4 text-center"
              style={{
                background: "linear-gradient(135deg, #1A3A8F 0%, #0f2460 100%)",
                borderBottom: "2px dashed #d4c5a0",
              }}
            >
              <div className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                Developer Railways • Premium Class
              </div>
              <h3
                className="text-2xl font-bold tracking-wider uppercase"
                style={{
                  color: "#F5B731",
                  fontFamily: "var(--font-heading)",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                DEVELOPER EXPRESS
              </h3>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                BOARDING PASS • {ticketId}
              </div>
            </div>

            {/* Ticket Body */}
            <div className="px-6 py-5 space-y-4" style={{ color: "#2a2a3a" }}>
              {/* Passenger & Train details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Loco Pilot
                  </div>
                  <div className="font-bold text-lg">Sonam Sharma</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Train
                  </div>
                  <div className="font-bold text-lg">Developer Express</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Licence
                  </div>
                  <div className="font-bold text-lg">Full Stack Developer</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Seat
                  </div>
                  <div className="font-bold">Front Row Experience</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Platform
                  </div>
                  <div className="font-bold">01</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Departure
                  </div>
                  <div className="font-bold text-green-700">Now Boarding</div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block border-t-2 border-dashed" style={{ borderColor: "#d4c5a0" }} />

              {/* Journey Route */}
              <div className="hidden sm:block">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Journey Route
                </div>
                <div className="flex flex-wrap gap-1 items-center text-xs font-mono">
                  {journeyStations.map((station, i) => (
                    <span key={station.id} className="flex items-center gap-1">
                      <span className="font-medium" style={{ color: "#1A3A8F" }}>
                        {station.icon} {station.name}
                      </span>
                      {i < journeyStations.length - 1 && (
                        <span className="text-gray-400 mx-1">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t-2 border-dashed" style={{ borderColor: "#d4c5a0" }} />

              {/* QR Code & Barcode */}
              <div className="flex items-center justify-between">
                {/* QR Code */}
                <button
                  onClick={step === "ticket" ? handleQRClick : undefined}
                  className="relative group"
                  data-cursor="pointer"
                  disabled={step !== "ticket"}
                >
                  <div
                    className="w-24 h-24 rounded-lg p-2 transition-all duration-300 group-hover:shadow-lg"
                    style={{
                      background: "white",
                      border: "2px solid #e0d8c8",
                    }}
                  >
                    {/* Simple QR pattern */}
                    <svg viewBox="0 0 80 80" className="w-full h-full">
                      {/* QR finder patterns */}
                      <rect x="0" y="0" width="24" height="24" fill="#333" />
                      <rect x="4" y="4" width="16" height="16" fill="white" />
                      <rect x="8" y="8" width="8" height="8" fill="#333" />
                      
                      <rect x="56" y="0" width="24" height="24" fill="#333" />
                      <rect x="60" y="4" width="16" height="16" fill="white" />
                      <rect x="64" y="8" width="8" height="8" fill="#333" />
                      
                      <rect x="0" y="56" width="24" height="24" fill="#333" />
                      <rect x="4" y="60" width="16" height="16" fill="white" />
                      <rect x="8" y="64" width="8" height="8" fill="#333" />
                      
                      {/* Data modules */}
                      {qrPattern.length > 0 && Array.from({ length: 8 }).map((_, row) =>
                        Array.from({ length: 8 }).map((_, col) => {
                          const x = 28 + col * 4;
                          const y = 28 + row * 4;
                          const index = row * 8 + col;
                          if (qrPattern[index]) {
                            return (
                              <rect
                                key={`${row}-${col}`}
                                x={x}
                                y={y}
                                width="3"
                                height="3"
                                fill="#333"
                              />
                            );
                          }
                          return null;
                        })
                      )}
                    </svg>

                    {/* Scan overlay on hover */}
                    {step === "ticket" && (
                      <div
                        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: "rgba(0,229,255,0.1)",
                          border: "2px solid rgba(0,229,255,0.5)",
                        }}
                      >
                        <div
                          className="absolute left-0 right-0 h-0.5"
                          style={{
                            background: "rgba(0,229,255,0.8)",
                            animation: "scan-line 1.5s ease-in-out infinite",
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {step === "ticket" && (
                    <div className="text-xs text-center mt-1 font-mono text-gray-500">
                      Click to Verify
                    </div>
                  )}
                </button>

                {/* Barcode */}
                <div className="text-right">
                  <div className="flex gap-px justify-end mb-1">
                    {barcodePattern.map((isWide, i) => (
                      <div
                        key={i}
                        style={{
                          width: `${isWide ? 2 : 1}px`,
                          height: "30px",
                          background: "#333",
                        }}
                      />
                    ))}
                  </div>
                  <div className="font-mono text-xs text-gray-500">{ticketId}</div>
                </div>
              </div>

              {/* Footer message */}
              <div className="text-center text-xs italic" style={{ color: "#8a8070" }}>
                Enjoy Your Journey Through My Developer Career.
              </div>
            </div>

            {/* Perforated bottom edge */}
            <div className="ticket-perforation h-3 w-full" />

            {/* BOARDING CONFIRMED stamp */}
            {step === "punched" && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  animation: "stamp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
                }}
              >
                <div
                  className="px-8 py-4 rounded-lg font-bold text-2xl uppercase tracking-wider"
                  style={{
                    color: "#4CAF50",
                    border: "4px solid #4CAF50",
                    transform: "rotate(-5deg)",
                    background: "rgba(76,175,80,0.1)",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  ✓ BOARDING CONFIRMED
                </div>
              </div>
            )}

            {/* Watermark */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] text-8xl font-bold"
              style={{ color: "#1A3A8F" }}
            >
              IR
            </div>
          </div>
        )}

        {/* ============ VERIFICATION POPUP ============ */}
        {(step === "qr-scan" || step === "verification") && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              animation: "fade-in 0.3s ease forwards",
            }}
          >
            <div
              className="glass-strong rounded-2xl p-8 max-w-md w-full text-center"
              style={{
                animation: "scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
              }}
            >
              {step === "qr-scan" && (
                <>
                  {/* Scanner animation */}
                  <div
                    className="w-20 h-20 mx-auto rounded-full border-4 mb-4 flex items-center justify-center"
                    style={{
                      borderColor: "var(--neon-cyan)",
                      boxShadow: "0 0 20px rgba(0,229,255,0.3)",
                      animation: "pulse-glow 1s ease-in-out infinite",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full border-2 border-dashed"
                      style={{
                        borderColor: "var(--neon-cyan)",
                        animation: "spin 2s linear infinite",
                      }}
                    />
                  </div>
                  <p className="font-mono text-sm" style={{ color: "var(--neon-cyan)" }}>
                    Scanning QR Code...
                  </p>
                </>
              )}

              {step === "verification" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
                    Boarding Verification
                  </h3>

                  {[
                    "Verifying Loco Pilot...",
                    "✔ Loco Pilot Verified",
                    "Checking Ticket...",
                    "✔ Boarding Confirmed",
                  ].map((msg, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 font-mono text-sm transition-all duration-300"
                      style={{
                        opacity: verifyStep >= i ? 1 : 0.2,
                        color: msg.includes("✔") ? "#4CAF50" : "var(--text-secondary)",
                        transform: verifyStep >= i ? "translateX(0)" : "translateX(-10px)",
                      }}
                    >
                      {verifyStep >= i && msg.includes("✔") ? (
                        <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                          {verifyStep >= i ? "•" : ""}
                        </span>
                      )}
                      {msg}
                    </div>
                  ))}

                  {verifyStep >= 3 && (
                    <div className="mt-6 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-left text-sm">
                        <div>
                          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Loco Pilot</div>
                          <div className="font-bold" style={{ color: "var(--text-primary)" }}>Sonam Sharma</div>
                        </div>
                        <div>
                          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Status</div>
                          <div className="font-bold text-green-400">Confirmed ✅</div>
                        </div>
                        <div>
                          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Licence</div>
                          <div className="font-bold" style={{ color: "var(--text-primary)" }}>Full Stack Developer</div>
                        </div>
                        <div>
                          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Journey Type</div>
                          <div className="font-bold" style={{ color: "var(--text-primary)" }}>Interactive Portfolio</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============ PLATFORM GATE ============ */}
        {step === "gate" && (
          <div className="text-center space-y-8">
            {/* Signal */}
            <div className="flex justify-center gap-4 mb-8">
              {["#FF3333", "#F5B731", "#4CAF50"].map((color, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full transition-all duration-500"
                  style={{
                    background: i === 2 ? color : "#333",
                    boxShadow: i === 2 ? `0 0 20px ${color}, 0 0 40px ${color}40` : "none",
                    transitionDelay: `${i * 500}ms`,
                  }}
                />
              ))}
            </div>

            {/* Gate */}
            <div className="relative mx-auto" style={{ maxWidth: "400px" }}>
              {/* Left gate */}
              <div
                className="absolute left-0 top-0 w-1/2 h-full rounded-l-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #4A4A5A, #3A3A4A)",
                  border: "2px solid #5A5A6A",
                  animation: "gate-open 1.5s ease-in-out forwards",
                  transformOrigin: "left center",
                }}
              >
                <div className="h-full flex items-center justify-center">
                  <span className="font-mono text-sm" style={{ color: "var(--text-muted)" }}>
                    GATE
                  </span>
                </div>
              </div>
              {/* Right gate */}
              <div
                className="absolute right-0 top-0 w-1/2 h-full rounded-r-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #3A3A4A, #4A4A5A)",
                  border: "2px solid #5A5A6A",
                  animation: "gate-open 1.5s ease-in-out forwards",
                  transformOrigin: "right center",
                  transform: "perspective(500px) rotateY(0deg)",
                }}
              >
                <div className="h-full flex items-center justify-center">
                  <span className="font-mono text-sm" style={{ color: "var(--text-muted)" }}>
                    OPEN
                  </span>
                </div>
              </div>
              {/* Gate frame */}
              <div
                className="h-40 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(180deg, rgba(76,175,80,0.1), transparent)",
                  border: "2px dashed rgba(76,175,80,0.3)",
                }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">🚪</div>
                  <div className="font-mono text-sm text-green-400">PLATFORM ACCESS GRANTED</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ STATION ANNOUNCEMENT ============ */}
        {step === "announcement" && (
          <div
            className="text-center space-y-6 py-12"
            style={{
              animation: "fade-in 0.8s ease forwards",
            }}
          >
            <div className="text-6xl mb-4">📢</div>
            <div
              className="glass-strong rounded-2xl p-8 max-w-lg mx-auto"
            >
              <div className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--golden-yellow)" }}>
                Station Announcement
              </div>
              <div
                className="font-mono text-sm leading-relaxed space-y-2"
                style={{ color: "var(--text-primary)" }}
              >
                <p
                  style={{
                    animation: "fade-in 0.5s ease forwards",
                    animationDelay: "0.3s",
                    opacity: 0,
                    animationFillMode: "forwards",
                  }}
                >
                  &ldquo;Attention Please...
                </p>
                <p
                  style={{
                    animation: "fade-in 0.5s ease forwards",
                    animationDelay: "1s",
                    opacity: 0,
                    animationFillMode: "forwards",
                  }}
                >
                  Developer Express is now ready for departure.
                </p>
                <p
                  style={{
                    animation: "fade-in 0.5s ease forwards",
                    animationDelay: "2s",
                    opacity: 0,
                    animationFillMode: "forwards",
                  }}
                >
                  All passengers are requested to board immediately.
                </p>
                <p
                  style={{
                    animation: "fade-in 0.5s ease forwards",
                    animationDelay: "3s",
                    opacity: 0,
                    animationFillMode: "forwards",
                  }}
                >
                  Please mind the gap and enjoy your journey.&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============ JOURNEY COMPLETE - DEPARTURE ============ */}
        {step === "complete" && (
          <div
            className="text-center space-y-6 py-12"
            style={{
              animation: "fade-in 1s ease forwards",
            }}
          >
            <div className="text-5xl mb-4">🚂</div>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--accent)",
                textShadow: "0 0 20px var(--accent-glow)",
              }}
            >
              Journey Begins!
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Scroll down to explore each station of my developer career.
            </p>
            <div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm"
              style={{
                background: "rgba(76,175,80,0.15)",
                color: "#4CAF50",
                border: "1px solid rgba(76,175,80,0.3)",
              }}
            >
              ✓ All Systems Go • Departure Confirmed
            </div>
          </div>
        )}
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Faint track pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-1 opacity-20">
          <div className="h-full" style={{ background: "var(--steel-gray)" }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
