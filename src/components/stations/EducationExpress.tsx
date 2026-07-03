"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { education } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

function TrainIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="4" y="6" width="24" height="18" rx="4" fill="#1A3A8F" />
      <rect x="8" y="10" width="6" height="5" rx="1" fill="#BCC5D3" opacity="0.8" />
      <rect x="18" y="10" width="6" height="5" rx="1" fill="#BCC5D3" opacity="0.8" />
      <rect x="6" y="20" width="20" height="3" rx="1" fill="#0F2870" />
      <circle cx="10" cy="27" r="3" fill="#BCC5D3" />
      <circle cx="22" cy="27" r="3" fill="#BCC5D3" />
      <circle cx="10" cy="27" r="1.5" fill="#1A3A8F" />
      <circle cx="22" cy="27" r="1.5" fill="#1A3A8F" />
      <rect x="13" y="3" width="6" height="4" rx="1" fill="#BCC5D3" />
    </svg>
  );
}

export default function EducationExpress() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Station sign reveal
        gsap.from(".edu-sign", {
          y: -30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".edu-sign",
            start: "top 85%",
          },
        });

        // Track line draws in
        gsap.from(".edu-track-line", {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".edu-track-line",
            start: "top 80%",
          },
        });

        // Train icon moves along track
        const trainEl = containerRef.current?.querySelector(".edu-train");
        const trackEl = containerRef.current?.querySelector(".edu-timeline");
        if (trainEl && trackEl) {
          gsap.to(trainEl, {
            y: () => (trackEl as HTMLElement).offsetHeight - 40,
            ease: "none",
            scrollTrigger: {
              trigger: trackEl,
              start: "top 60%",
              end: "bottom 40%",
              scrub: 1,
            },
          });
        }

        // Cards slide in from alternating sides
        gsap.utils.toArray<HTMLElement>(".edu-card").forEach((card, i) => {
          const isEven = i % 2 === 0;
          gsap.from(card, {
            x: isEven ? -80 : 80,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          });
        });

        // Station dots pop in
        gsap.utils.toArray<HTMLElement>(".edu-dot").forEach((dot, i) => {
          gsap.from(dot, {
            scale: 0,
            duration: 0.4,
            delay: 0.2,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: dot,
              start: "top 85%",
            },
          });
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="education"
      className="station-section"
      style={{
        background: "linear-gradient(180deg, #080E1F 0%, #0B1530 40%, #0A1228 100%)",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle, #1A3A8F 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Station sign */}
        <div className="edu-sign mb-16 flex justify-center">
          <h2
            className="station-sign"
            style={{
              borderColor: "#1A3A8F",
              color: "#FAFBFF",
              background: "linear-gradient(180deg, #0F1D45 0%, #0B1530 100%)",
            }}
          >
            Education Express
          </h2>
        </div>

        {/* Timeline */}
        <div className="edu-timeline relative">
          {/* Vertical track line – centered on md+, left-aligned on mobile */}
          <div
            className="edu-track-line absolute top-0 bottom-0 left-5 w-[3px] md:left-1/2 md:-translate-x-1/2"
            style={{
              background: "linear-gradient(180deg, #1A3A8F 0%, #BCC5D3 50%, #1A3A8F 100%)",
            }}
          />

          {/* Dotted overlay on track */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 left-5 w-[3px] md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
            style={{
              backgroundImage: "repeating-linear-gradient(180deg, transparent 0px, transparent 8px, #0B1530 8px, #0B1530 14px)",
            }}
          />

          {/* Train icon on track */}
          <div
            className="edu-train absolute left-[6px] top-0 z-10 md:left-1/2 md:-translate-x-1/2"
            style={{ filter: "drop-shadow(0 0 8px rgba(26,58,143,0.6))" }}
          >
            <TrainIcon />
          </div>

          {/* Education entries */}
          <div className="relative space-y-16">
            {education.map((entry, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={i}
                  className="relative flex items-start gap-6 md:items-center"
                >
                  {/* Desktop: alternating layout */}
                  {/* Left container: automatically alternates sides on desktop via order-3 */}
                  <div
                    className={`hidden md:block md:w-1/2 ${
                      isEven ? "md:pr-12 md:text-right" : "md:order-3 md:pl-12"
                    }`}
                  >
                    <div
                      className={`edu-card rounded-xl p-6 ${isEven ? "md:ml-auto" : ""}`}
                      style={{
                        maxWidth: 480,
                        background: "rgba(26,58,143,0.08)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(26,58,143,0.2)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                      }}
                    >
                      <CardContent entry={entry} align={isEven ? "right" : "left"} />
                    </div>
                  </div>

                  {/* Center dot */}
                  <div
                    className={`absolute left-5 z-10 flex -translate-x-1/2 items-center justify-center md:relative md:left-auto md:order-2 md:translate-x-0`}
                    style={{ width: 0, flexShrink: 0 }}
                  >
                    <div
                      className="edu-dot flex h-5 w-5 items-center justify-center rounded-full md:h-6 md:w-6"
                      style={{
                        background: "#1A3A8F",
                        border: "3px solid #BCC5D3",
                        boxShadow: "0 0 12px rgba(26,58,143,0.5)",
                      }}
                    />
                  </div>

                  {/* Right container: empty layout placeholder on desktop */}
                  <div
                    className={`hidden md:block md:w-1/2 ${
                      isEven ? "md:order-3 md:pl-12" : "md:pr-12 md:text-right"
                    }`}
                  />

                  {/* Mobile card (always visible on small screens) */}
                  <div className="ml-8 flex-1 md:hidden">
                    <div
                      className="edu-card rounded-xl p-5"
                      style={{
                        background: "rgba(26,58,143,0.08)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(26,58,143,0.2)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                      }}
                    >
                      <CardContent entry={entry} align="left" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CardContent({
  entry,
  align,
}: {
  entry: (typeof education)[number];
  align: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "md:text-right" : ""}>
      {/* Year badge */}
      <span
        className="mb-3 inline-block rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider"
        style={{
          background: "rgba(26,58,143,0.3)",
          color: "#BCC5D3",
          border: "1px solid rgba(26,58,143,0.4)",
        }}
      >
        {entry.year}
      </span>

      <h3
        className="mb-1 font-heading text-lg font-bold leading-tight"
        style={{ color: "#FAFBFF" }}
      >
        {entry.degree}
      </h3>
      <p className="mb-1 text-sm" style={{ color: "#BCC5D3" }}>
        {entry.institution}
      </p>

      {/* Grade */}
      <div className="mb-3">
        <span
          className="inline-block rounded-md px-2 py-0.5 font-mono text-xs font-semibold"
          style={{
            background: "rgba(26,58,143,0.25)",
            color: "#5BB5E8",
            border: "1px solid rgba(91,181,232,0.2)",
          }}
        >
          {entry.grade}
        </span>
      </div>

      {/* Highlights */}
      <ul className="hidden md:block space-y-1.5">
        {entry.highlights.map((h, j) => (
          <li
            key={j}
            className={`flex items-start gap-2 text-sm ${align === "right" ? "md:justify-end" : ""}`}
            style={{ color: "#8C99B3" }}
          >
            <span style={{ color: "#1A3A8F" }} className="mt-0.5 shrink-0">
              ▸
            </span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
