"use client";

import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalInfo, journeyStations } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const socialLinks = [
  {
    platform: "GitHub",
    url: personalInfo.github,
    icon: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    label: "Code Repository",
    color: "#E8F0FF",
  },
  {
    platform: "LinkedIn",
    url: personalInfo.linkedin,
    icon: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
      </svg>
    ),
    label: "Professional Network",
    color: "#0A66C2",
  },
  {
    platform: "Email",
    url: `https://mail.google.com/mail/?view=cm&fs=1&to=${personalInfo.email}`,
    icon: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
    label: "Direct Line",
    color: "#FACC15",
  },
];

export default function ContactTerminal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      // Station sign
      gsap.from(".contact-sign", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-sign",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Telegram form slides up
      gsap.from(".contact-telegram", {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-telegram",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Social boards stagger
      gsap.from(".social-board", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".social-boards-container",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Journey stats
      gsap.from(".journey-stats", {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".journey-stats",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Thank you message
      gsap.from(".journey-thankyou", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".journey-thankyou",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: containerRef }
  );

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Sender identity required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name too short for dispatch";
    }

    if (!form.email.trim()) {
      newErrors.email = "Return address required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid signal address format";
    }

    if (!form.message.trim()) {
      newErrors.message = "Telegram body cannot be empty";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message too brief (min 10 chars)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  // TO RECEIVE REAL EMAILS: Get a free Access Key from https://web3forms.com and paste it here:
  const WEB3FORMS_ACCESS_KEY = "6e660f52-c962-4689-b4aa-5e0972b65fb5";

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSending(true);

      // Steam animation on the button
      const btn = containerRef.current?.querySelector(".send-btn");
      if (btn) {
        gsap.to(btn, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
        });
      }

      if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") {
        // Fallback simulation if the key is not set yet
        setTimeout(() => {
          setIsSending(false);
          setIsSent(true);
          setForm({ name: "", email: "", message: "" });
          alert("Key not configured! Web3Forms Access Key is set to default placeholder. Telegram simulated successfully.");
        }, 1500);
        return;
      }

      // Real API post to Web3Forms
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `New Railway Telegram from ${form.name}`,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setIsSending(false);
          if (data.success) {
            setIsSent(true);
            setForm({ name: "", email: "", message: "" });
            // Reset success text after 5 seconds
            setTimeout(() => setIsSent(false), 5000);
          } else {
            alert("Failed to dispatch telegram: " + (data.message || "Unknown error"));
          }
        })
        .catch((err) => {
          console.error("Error dispatching telegram:", err);
          setIsSending(false);
          alert("Failed to connect to the telegraph network. Please try again.");
        });
    },
    [validate, form]
  );

  return (
    <section
      ref={containerRef}
      id="contact"
      className="station-section"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-primary) 0%, var(--dark-navy) 40%, #1a0f0a 100%)",
      }}
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Station Sign */}
        <div className="station-header justify-center mb-14">
          <div
            className="contact-sign station-sign"
            style={{
              borderColor: "var(--sunset-orange)",
              color: "var(--text-primary)",
              background: "rgba(232, 93, 58, 0.08)",
            }}
          >
           CONTACT TERMINAL
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* === LEFT: Telegram Form === */}
          <div className="contact-telegram">
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(180deg, rgba(232,93,58,0.06) 0%, rgba(15,23,42,0.8) 100%)",
                border: "1px solid rgba(232,93,58,0.2)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              {/* Telegram Header */}
              <div
                className="px-5 sm:px-6 py-3 flex items-center justify-between"
                style={{
                  background: "rgba(232, 93, 58, 0.1)",
                  borderBottom: "1px solid rgba(232,93,58,0.15)",
                }}
              >
                <div className="flex items-center gap-2">
                  
                  <span
                    className="text-xs font-mono tracking-[0.15em] uppercase font-semibold"
                    style={{ color: "var(--sunset-orange)" }}
                  >
                    Railway Telegram
                  </span>
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "var(--sunset-orange)",
                        opacity: 0.3 + i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="text-[10px] font-mono tracking-[0.2em] uppercase block mb-2"
                    style={{ color: "rgba(232,93,58,0.7)" }}
                  >
                    FROM (Sender)
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Your name..."
                    className="w-full px-4 py-3 rounded-lg text-sm font-mono transition-all duration-300 focus:outline-none"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: errors.name
                        ? "1px solid #F43F5E"
                        : "1px solid rgba(232,93,58,0.15)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={(e) => {
                      if (!errors.name) {
                        e.currentTarget.style.borderColor =
                          "rgba(232,93,58,0.5)";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 2px rgba(232,93,58,0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.name) {
                        e.currentTarget.style.borderColor =
                          "rgba(232,93,58,0.15)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  />
                  {errors.name && (
                    <p
                      className="text-[10px] font-mono mt-1.5 flex items-center gap-1"
                      style={{ color: "#F43F5E" }}
                    >
                      <span>⚠</span> {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="text-[10px] font-mono tracking-[0.2em] uppercase block mb-2"
                    style={{ color: "rgba(232,93,58,0.7)" }}
                  >
                    RETURN ADDRESS (Email)
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg text-sm font-mono transition-all duration-300 focus:outline-none"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: errors.email
                        ? "1px solid #F43F5E"
                        : "1px solid rgba(232,93,58,0.15)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={(e) => {
                      if (!errors.email) {
                        e.currentTarget.style.borderColor =
                          "rgba(232,93,58,0.5)";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 2px rgba(232,93,58,0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.email) {
                        e.currentTarget.style.borderColor =
                          "rgba(232,93,58,0.15)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  />
                  {errors.email && (
                    <p
                      className="text-[10px] font-mono mt-1.5 flex items-center gap-1"
                      style={{ color: "#F43F5E" }}
                    >
                      <span>⚠</span> {errors.email}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="text-[10px] font-mono tracking-[0.2em] uppercase block mb-2"
                    style={{ color: "rgba(232,93,58,0.7)" }}
                  >
                    MESSAGE BODY
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 rounded-lg text-sm font-mono resize-none transition-all duration-300 focus:outline-none"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: errors.message
                        ? "1px solid #F43F5E"
                        : "1px solid rgba(232,93,58,0.15)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={(e) => {
                      if (!errors.message) {
                        e.currentTarget.style.borderColor =
                          "rgba(232,93,58,0.5)";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 2px rgba(232,93,58,0.1)";
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.message) {
                        e.currentTarget.style.borderColor =
                          "rgba(232,93,58,0.15)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  />
                  {errors.message && (
                    <p
                      className="text-[10px] font-mono mt-1.5 flex items-center gap-1"
                      style={{ color: "#F43F5E" }}
                    >
                      <span>⚠</span> {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSending || isSent}
                  className="send-btn w-full py-3.5 rounded-lg font-mono font-bold text-sm tracking-[0.15em] uppercase transition-all duration-300 relative overflow-hidden group"
                  style={{
                    background: isSent
                      ? "linear-gradient(135deg, #4CAF50, #66BB6A)"
                      : "linear-gradient(135deg, var(--sunset-orange), #D84315)",
                    color: "white",
                    boxShadow: isSent
                      ? "0 4px 16px rgba(76,175,80,0.3)"
                      : "0 4px 16px rgba(232,93,58,0.3)",
                    opacity: isSending ? 0.8 : 1,
                  }}
                >
                  {/* Steam particles */}
                  {isSending && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            background: "rgba(255,255,255,0.6)",
                            animation: `steam-rise 1.2s ease-out infinite ${i * 0.2}s`,
                            left: `${20 + i * 15}%`,
                            bottom: "0",
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <span className="relative z-10">
                    {isSent
                      ? "✓ TELEGRAM DISPATCHED"
                      : isSending
                        ? "TRANSMITTING..."
                        : " SEND TELEGRAM"}
                  </span>
                  {!isSending && !isSent && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(135deg, #D84315, var(--sunset-orange))",
                      }}
                    />
                  )}
                  {!isSending && !isSent && (
                    <span className="relative z-10 hidden group-hover:inline">
                      {" "}
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* === RIGHT: Social Links + Journey Stats === */}
          <div className="space-y-8">
            {/* Social Platform Boards */}
            <div className="social-boards-container space-y-3">
              <h3
                className="text-xs font-mono tracking-[0.2em] uppercase mb-4"
                style={{ color: "rgba(232,93,58,0.6)" }}
              >
                Platform Directory
              </h3>

              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  onClick={(e) => {
                    if (social.platform === "Email") {
                      // Copy to clipboard for easy backup
                      navigator.clipboard.writeText(personalInfo.email);
                      setEmailCopied(true);
                      setTimeout(() => setEmailCopied(false), 3000);
                    }
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-board flex items-center gap-4 p-4 rounded-lg transition-[border-color,box-shadow,background-color] duration-300 group cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${social.color}40`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${social.color}15`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <span className="text-2xl">{social.icon}</span>
                  <div className="flex-1">
                    <p
                      className="font-mono font-semibold text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {social.platform}
                    </p>
                    <p
                      className="text-[10px] font-mono transition-colors duration-300"
                      style={{ color: emailCopied && social.platform === "Email" ? "#10B981" : "var(--text-muted)" }}
                    >
                      {emailCopied && social.platform === "Email" 
                        ? "Copied to clipboard!" 
                        : social.label}
                    </p>
                  </div>
                  <span
                    className="text-xs font-mono transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: social.color }}
                  >
                    →
                  </span>
                </a>
              ))}
            </div>

            {/* Journey Completion Stats */}
            <div
              className="journey-stats rounded-xl p-6"
              style={{
                background:
                  "linear-gradient(135deg, rgba(232,93,58,0.08) 0%, rgba(250,204,21,0.05) 100%)",
                border: "1px solid rgba(232,93,58,0.15)",
              }}
            >
              <div className="text-center mb-4">
                
                <h3
                  className="font-heading font-bold text-lg"
                  style={{ color: "var(--text-primary)" }}
                >
                  Journey Complete!
                </h3>
                <p
                  className="text-xs font-mono mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  You&apos;ve visited all the stations
                </p>
              </div>

              <div
                className="grid grid-cols-3 gap-3 py-4"
                style={{ borderTop: "1px solid rgba(232,93,58,0.1)" }}
              >
                <div className="text-center">
                  <p
                    className="text-2xl font-heading font-bold"
                    style={{ color: "var(--sunset-orange)" }}
                  >
                    {journeyStations.length}
                  </p>
                  <p
                    className="text-[9px] font-mono tracking-wider uppercase mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Stations
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className="text-2xl font-heading font-bold"
                    style={{ color: "var(--warm-yellow)" }}
                  >
                    ∞
                  </p>
                  <p
                    className="text-[9px] font-mono tracking-wider uppercase mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Possibilities
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className="text-2xl font-heading font-bold"
                    style={{ color: "#4CAF50" }}
                  >
                    1
                  </p>
                  <p
                    className="text-[9px] font-mono tracking-wider uppercase mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Journey
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === Thank You / Footer Area === */}
        <div
          className="journey-thankyou mt-16 text-center rounded-xl p-8 sm:p-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(232,93,58,0.1) 0%, rgba(250,204,21,0.06) 50%, rgba(232,93,58,0.08) 100%)",
            border: "1px solid rgba(232,93,58,0.1)",
          }}
        >
          <p
            className="text-4xl sm:text-5xl mb-4"
            aria-hidden="true"
          >
            🌅
          </p>
          <h3
            className="font-heading font-bold text-xl sm:text-2xl mb-3"
            style={{
              background:
                "linear-gradient(135deg, var(--sunset-orange), var(--warm-yellow))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Thank You for Riding the Developer Express
          </h3>

          <p
            className="text-xs font-mono tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            — {personalInfo.fullName} —
          </p>
        </div>
      </div>
    </section>
  );
}
