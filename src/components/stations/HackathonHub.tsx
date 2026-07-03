"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hackathons } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

export default function HackathonHub() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileSwiperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Station sign
      gsap.from(".hack-sign", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".hack-sign",
          start: "top 85%",
        },
      });

      // Desktop stagged animations
      mm.add("(min-width: 768px)", () => {
        gsap.utils.toArray<HTMLElement>(".hack-card-desktop").forEach((card, i) => {
          gsap.from(card, {
            y: 50,
            opacity: 0,
            scale: 0.95,
            duration: 0.7,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
            },
          });

          // Scan line sweep on reveal
          const scanline = card.querySelector(".hack-scanline");
          if (scanline) {
            gsap.fromTo(
              scanline,
              { top: "0%" },
              {
                top: "100%",
                duration: 1.5,
                delay: i * 0.15 + 0.3,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top 88%",
                },
              }
            );
          }
        });

        // Tech pills stagger
        gsap.utils.toArray<HTMLElement>(".hack-pill").forEach((pill, i) => {
          gsap.from(pill, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            delay: i * 0.04 + 0.5,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: pill.closest(".hack-card-desktop"),
              start: "top 88%",
            },
          });
        });
      });

      // Mobile horizontal scroll section
      mm.add("(max-width: 767px)", () => {
        const swiper = mobileSwiperRef.current;
        if (!swiper) return;

        gsap.to(swiper, {
          x: () => -(swiper.scrollWidth - swiper.clientWidth),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${swiper.scrollWidth - swiper.clientWidth}`,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="hackathons"
      className="station-section min-h-screen flex flex-col justify-center"
      style={{
        background: "linear-gradient(180deg, #0A0A14 0%, #0D0820 40%, #0A0A14 100%)",
      }}
    >
      {/* Cyber grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,180,216,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,180,216,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl w-full">
        {/* Station sign */}
        <div className="hack-sign mb-12 flex justify-center">
          <h2
            className="station-sign"
            style={{
              borderColor: "#00B4D8",
              color: "#E0F7FF",
              background: "linear-gradient(180deg, #0D1829 0%, #0A0A14 100%)",
              boxShadow: "0 0 30px rgba(0,180,216,0.15), inset 0 0 30px rgba(0,180,216,0.05)",
            }}
          >
            Hackathon Hub
          </h2>
        </div>

        {/* Terminal header bar */}
        <div
          className="mx-auto mb-10 flex max-w-3xl items-center gap-2 rounded-t-lg px-4 py-2 font-mono text-xs"
          style={{
            background: "rgba(0,180,216,0.08)",
            borderBottom: "1px solid rgba(0,180,216,0.2)",
            color: "#00B4D8",
          }}
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#EC4899]" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#FACC15]" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#4CAF50]" />
          <span className="ml-3 opacity-60">mission_briefings.log — {hackathons.length} entries</span>
        </div>

        {/* === DESKTOP TIMELINE LAYOUT === */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {hackathons.map((hack, i) => (
            <article
              key={i}
              className="hack-card-desktop group relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(145deg, rgba(13,24,41,0.9) 0%, rgba(10,10,20,0.95) 100%)",
                border: "1px solid rgba(0,180,216,0.15)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              {/* Scan line overlay */}
              <div
                className="hack-scanline pointer-events-none absolute left-0 right-0 z-10 h-[2px] opacity-40"
                aria-hidden="true"
                style={{
                  background: "linear-gradient(90deg, transparent, #00B4D8, transparent)",
                  top: "0%",
                }}
              />

              {/* Glitch hover overlay */}
              <div
                className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                aria-hidden="true"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    0deg,
                    rgba(0,180,216,0.03) 0px,
                    rgba(0,180,216,0.03) 1px,
                    transparent 1px,
                    transparent 3px
                  )`,
                }}
              />

              {/* Card content */}
              <div className="relative z-20 p-6">
                {/* Mission number */}
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: "rgba(0,180,216,0.5)" }}
                  >
                    Mission #{String(i + 1).padStart(3, "0")}
                  </span>
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: "rgba(139,92,246,0.6)" }}
                  >
                    {hack.duration}
                  </span>
                </div>

                {/* Hackathon name */}
                <h3
                  className="mb-2 font-heading text-xl font-bold"
                  style={{ color: "#E0F7FF" }}
                >
                  {hack.name}
                </h3>

                {/* Position badge */}
                <div className="mb-4">
                  <span
                    className="inline-block rounded-sm px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider"
                    style={{
                      background: hack.position.includes("Winner")
                        ? "linear-gradient(90deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))"
                        : "rgba(0,180,216,0.12)",
                      color: hack.position.includes("Winner") ? "#EC4899" : "#00B4D8",
                      border: `1px solid ${
                        hack.position.includes("Winner")
                          ? "rgba(236,72,153,0.3)"
                          : "rgba(0,180,216,0.2)"
                      }`,
                      boxShadow: hack.position.includes("Winner")
                        ? "0 0 12px rgba(236,72,153,0.2)"
                        : "none",
                    }}
                  >
                    {hack.position}
                  </span>
                </div>

                {/* Problem statement */}
                <div className="mb-3">
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: "#8B5CF6" }}
                  >
                    Objective
                  </span>
                  <p className="mt-1 text-sm" style={{ color: "#8C99B3" }}>
                    {hack.problem}
                  </p>
                </div>

                {/* Team */}
                <div className="mb-3 font-mono text-xs" style={{ color: "#4D6080" }}>
                  <span style={{ color: "#00B4D8" }}>team:</span> {hack.team}
                </div>

                {/* Description */}
                <p className="mb-4 text-sm leading-relaxed" style={{ color: "#6B7B8D" }}>
                  {hack.description}
                </p>

                {/* Tech pills */}
                <div className="flex flex-wrap gap-2">
                  {hack.techUsed.map((tech, j) => (
                    <span
                      key={j}
                      className="hack-pill rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium"
                      style={{
                        background: "rgba(0,180,216,0.08)",
                        color: "#00B4D8",
                        border: "1px solid rgba(0,180,216,0.2)",
                        boxShadow: "0 0 6px rgba(0,180,216,0.1)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom accent line */}
              <div
                className="h-[2px]"
                style={{
                  background: `linear-gradient(90deg, #00B4D8, #8B5CF6, #EC4899)`,
                  opacity: 0.6,
                }}
              />
            </article>
          ))}
        </div>

        {/* === MOBILE HORIZONTAL SWIPER LAYOUT === */}
        <div className="md:hidden overflow-hidden w-full relative">
          <div
            ref={mobileSwiperRef}
            className="flex items-stretch gap-6 pb-6 px-4"
          >
            {hackathons.map((hack, i) => (
              <article
                key={i}
                className="hack-card group relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-[1.02] w-[85vw] shrink-0"
                style={{
                  background: "linear-gradient(145deg, rgba(13,24,41,0.9) 0%, rgba(10,10,20,0.95) 100%)",
                  border: "1px solid rgba(0,180,216,0.15)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
              >
                {/* Scan line overlay */}
                <div
                  className="hack-scanline pointer-events-none absolute left-0 right-0 z-10 h-[2px] opacity-40"
                  aria-hidden="true"
                  style={{
                    background: "linear-gradient(90deg, transparent, #00B4D8, transparent)",
                    top: "0%",
                  }}
                />

                {/* Glitch hover overlay */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  aria-hidden="true"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      0deg,
                      rgba(0,180,216,0.03) 0px,
                      rgba(0,180,216,0.03) 1px,
                      transparent 1px,
                      transparent 3px
                    )`,
                  }}
                />

                {/* Card content */}
                <div className="relative z-20 p-6 flex flex-col h-full justify-between">
                  <div>
                    {/* Mission number */}
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className="font-mono text-[10px] uppercase tracking-widest"
                        style={{ color: "rgba(0,180,216,0.5)" }}
                      >
                        Mission #{String(i + 1).padStart(3, "0")}
                      </span>
                      <span
                        className="font-mono text-[10px]"
                        style={{ color: "rgba(139,92,246,0.6)" }}
                      >
                        {hack.duration}
                      </span>
                    </div>

                    {/* Hackathon name */}
                    <h3
                      className="mb-2 font-heading text-xl font-bold"
                      style={{ color: "#E0F7FF" }}
                    >
                      {hack.name}
                    </h3>

                    {/* Position badge */}
                    <div className="mb-4">
                      <span
                        className="inline-block rounded-sm px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider"
                        style={{
                          background: hack.position.includes("Winner")
                            ? "linear-gradient(90deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))"
                            : "rgba(0,180,216,0.12)",
                          color: hack.position.includes("Winner") ? "#EC4899" : "#00B4D8",
                          border: `1px solid ${
                            hack.position.includes("Winner")
                              ? "rgba(236,72,153,0.3)"
                              : "rgba(0,180,216,0.2)"
                          }`,
                          boxShadow: hack.position.includes("Winner")
                            ? "0 0 12px rgba(236,72,153,0.2)"
                            : "none",
                        }}
                      >
                        {hack.position}
                      </span>
                    </div>
                  </div>

                  {/* Tech pills */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {hack.techUsed.map((tech, j) => (
                      <span
                        key={j}
                        className="hack-pill rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium"
                        style={{
                          background: "rgba(0,180,216,0.08)",
                          color: "#00B4D8",
                          border: "1px solid rgba(0,180,216,0.2)",
                          boxShadow: "0 0 6px rgba(0,180,216,0.1)",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className="h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, #00B4D8, #8B5CF6, #EC4899)`,
                    opacity: 0.6,
                  }}
                />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
