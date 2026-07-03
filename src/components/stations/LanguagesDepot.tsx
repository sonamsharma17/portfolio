"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { languages } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

function FlipChar({
  char,
  delay,
  triggerFlip,
}: {
  char: string;
  delay: number;
  triggerFlip: boolean;
}) {
  const [displayChar, setDisplayChar] = useState(" ");
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (!triggerFlip) return;

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -";
    const targetIdx = alphabet.indexOf(char.toUpperCase());
    let currentIdx = 0;
    const speed = 40;

    const timer = setTimeout(() => {
      setIsFlipping(true);
      const interval = setInterval(() => {
        if (currentIdx >= targetIdx || currentIdx >= alphabet.length - 1) {
          setDisplayChar(char.toUpperCase());
          setIsFlipping(false);
          clearInterval(interval);
          return;
        }
        setDisplayChar(alphabet[currentIdx]);
        currentIdx++;
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [triggerFlip, char, delay]);

  return (
    <span
      className="inline-flex items-center justify-center w-[1.4em] h-[1.8em] sm:w-[1.8em] sm:h-[2.2em] text-xs sm:text-base md:text-lg font-mono font-bold rounded-[3px] mx-[1px] transition-transform duration-75"
      style={{
        background: isFlipping
          ? "linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 49%, #0d0d0d 50%, #1a1a1a 100%)"
          : "linear-gradient(180deg, #1f1f1f 0%, #141414 49%, #0a0a0a 50%, #141414 100%)",
        color: "#FACC15",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 4px rgba(0,0,0,0.5)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(0,0,0,0.4)",
        transform: isFlipping ? "rotateX(-10deg)" : "rotateX(0deg)",
      }}
    >
      {displayChar}
    </span>
  );
}

function FlipText({
  text,
  startDelay = 0,
  triggerFlip,
  color,
}: {
  text: string;
  startDelay?: number;
  triggerFlip: boolean;
  color?: string;
}) {
  const padded = text.toUpperCase().padEnd(16, " ");
  return (
    <div className="flex">
      {padded.split("").map((ch, i) => (
        <span
          key={i}
          className={i >= 8 ? "hidden sm:inline-flex" : "inline-flex"}
          style={color ? { filter: `drop-shadow(0 0 4px ${color}40)` } : undefined}
        >
          <FlipChar char={ch} delay={startDelay + i * 30} triggerFlip={triggerFlip} />
        </span>
      ))}
    </div>
  );
}

export default function LanguagesDepot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [flipTriggered, setFlipTriggered] = useState(false);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Sign animation
      gsap.from(".lang-sign", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".lang-sign",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Trigger flip animation when board enters viewport
      ScrollTrigger.create({
        trigger: ".lang-board",
        start: "top 75%",
        onEnter: () => {
          if (!prefersReduced) {
            setFlipTriggered(true);
          } else {
            setFlipTriggered(true);
          }
        },
        onLeaveBack: () => setFlipTriggered(false),
      });

      // Board frame entrance
      gsap.from(".lang-board", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".lang-board",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Progress bars animate in
      gsap.from(".lang-progress-fill", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".lang-board",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: containerRef }
  );

  const getProficiencyLabel = useCallback((proficiency: number): string => {
    if (proficiency >= 90) return "FLUENT";
    if (proficiency >= 70) return "PROFICIENT";
    if (proficiency >= 50) return "INTERMEDIATE";
    return "BASIC";
  }, []);

  return (
    <section
      ref={containerRef}
      id="languages"
      className="station-section"
      style={{
        background: "var(--bg-primary)",
        minHeight: "auto",
        paddingTop: "4rem",
        paddingBottom: "4rem",
      }}
    >
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Station Sign */}
        <div className="station-header justify-center mb-10">
          <div
            className="lang-sign station-sign"
            style={{
              borderColor: "#FACC15",
              color: "var(--text-primary)",
              background: "rgba(250, 204, 21, 0.06)",
            }}
          >
            LANGUAGES DEPOT
          </div>
        </div>

        {/* Departure Board */}
        <div
          className="lang-board rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)",
            border: "2px solid #333",
            boxShadow:
              "0 0 0 4px #0a0a0a, 0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Board Header */}
          <div
            className="flex items-center justify-between px-4 sm:px-6 py-3"
            style={{
              background:
                "linear-gradient(180deg, #252525 0%, #1a1a1a 100%)",
              borderBottom: "2px solid #333",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: "#4CAF50",
                  boxShadow: "0 0 6px #4CAF5060",
                  animation: "signal-blink 2s infinite",
                }}
              />
              <span
                className="text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase"
                style={{ color: "rgba(250, 204, 21, 0.7)" }}
              >
                Departure Board
              </span>
            </div>
            <span
              className="text-[10px] font-mono"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              DEVELOPER EXPRESS
            </span>
          </div>

          {/* Board Header Row */}
          <div
            className="grid gap-2 px-4 sm:px-6 py-2 grid-cols-[auto_auto_1fr] sm:grid-cols-[2fr_1.5fr_3fr]"
            style={{
              borderBottom: "1px solid #222",
            }}
          >
            <span
              className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Language
            </span>
            <span
              className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Level
            </span>
            <span
              className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Proficiency
            </span>
          </div>

          {/* Language Rows */}
          <div className="divide-y divide-[#1a1a1a]">
            {languages.map((lang, idx) => (
              <div
                key={lang.name}
                className="grid gap-2 px-4 sm:px-6 py-4 items-center transition-colors grid-cols-[auto_auto_1fr] sm:grid-cols-[2fr_1.5fr_3fr]"
                style={{
                  background:
                    idx % 2 === 0
                      ? "rgba(255,255,255,0.01)"
                      : "transparent",
                }}
              >
                {/* Language Name (flip board) */}
                <div className="overflow-hidden">
                  <FlipText
                    text={lang.name}
                    startDelay={idx * 300}
                    triggerFlip={flipTriggered}
                  />
                </div>

                {/* Level */}
                <div>
                  <span
                    className="text-[10px] sm:text-xs font-mono font-semibold tracking-wider"
                    style={{
                      color:
                        lang.proficiency >= 90
                          ? "#4CAF50"
                          : lang.proficiency >= 70
                            ? "#FACC15"
                            : "#E8722A",
                    }}
                  >
                    {getProficiencyLabel(lang.proficiency)}
                  </span>
                  <p
                    className="text-[9px] font-mono mt-0.5"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {lang.level}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)",
                    }}
                  >
                    <div
                      className="lang-progress-fill h-full rounded-full"
                      style={{
                        width: `${lang.proficiency}%`,
                        background:
                          lang.proficiency >= 90
                            ? "linear-gradient(90deg, #4CAF50, #66BB6A)"
                            : lang.proficiency >= 70
                              ? "linear-gradient(90deg, #F59E0B, #FACC15)"
                              : "linear-gradient(90deg, #E8722A, #F59E0B)",
                        boxShadow:
                          lang.proficiency >= 90
                            ? "0 0 8px #4CAF5040"
                            : lang.proficiency >= 70
                              ? "0 0 8px #FACC1540"
                              : "0 0 8px #E8722A40",
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-mono font-bold min-w-[2.5rem] text-right"
                    style={{ color: "#FACC15" }}
                  >
                    {lang.proficiency}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Board Footer */}
          <div
            className="flex items-center justify-center px-4 sm:px-6 py-3"
            style={{
              background:
                "linear-gradient(180deg, #1a1a1a 0%, #151515 100%)",
              borderTop: "1px solid #222",
            }}
          >
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "#FACC15",
                    opacity: 0.4,
                    animation: `signal-blink ${1.5 + i * 0.3}s infinite ${i * 0.2}s`,
                  }}
                />
              ))}
              <span
                className="text-[9px] font-mono tracking-widest uppercase ml-2"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                multilingual ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
