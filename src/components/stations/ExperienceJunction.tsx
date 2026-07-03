"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

const typeColors: Record<string, string> = {
  Internship: "#E8722A",
  Contribution: "#5BB5E8",
  Freelance: "#4CAF50",
  "Full-time": "#F5B731",
};

export default function ExperienceJunction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileSwiperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      const mm = gsap.matchMedia();

      // Station sign entrance
      gsap.from(".exp-sign", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".exp-sign",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Highlight items stagger
      gsap.from(".exp-highlight-item", {
        x: -15,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // Desktop track animations & card slide ins
      mm.add("(min-width: 768px)", () => {
        // Main vertical track line draws itself
        gsap.from(".exp-main-track", {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 1.6,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".exp-main-track",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        // Branch lines draw themselves
        gsap.from(".exp-branch-line", {
          scaleX: 0,
          duration: 0.6,
          stagger: 0.25,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".exp-timeline",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });

        // Track switch dots
        gsap.from(".exp-switch-dot", {
          scale: 0,
          duration: 0.4,
          stagger: 0.2,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: ".exp-timeline",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });

        // Experience cards slide in from alternating sides
        const cards = containerRef.current?.querySelectorAll(".exp-card-desktop");
        cards?.forEach((card, i) => {
          const direction = i % 2 === 0 ? 80 : -80;
          gsap.from(card, {
            x: direction,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse",
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
      id="experience"
      className="station-section min-h-screen flex flex-col justify-center"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-primary) 0%, #161824 50%, var(--bg-primary) 100%)",
      }}
    >
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Station Sign */}
        <div className="station-header justify-center mb-16">
          <div
            className="exp-sign station-sign"
            style={{
              borderColor: "var(--warm-orange)",
              color: "var(--text-primary)",
              background: "rgba(232, 114, 42, 0.06)",
            }}
          >
             EXPERIENCE JUNCTION
          </div>
        </div>

        {/* === DESKTOP TIMELINE LAYOUT === */}
        <div className="exp-timeline relative hidden md:block">
          {/* Main vertical track */}
          <div
            className="exp-main-track absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] rounded-full"
            style={{
              background:
                "linear-gradient(to bottom, var(--warm-orange), var(--steel-gray), var(--warm-orange))",
            }}
          />

          <div className="space-y-16">
            {experience.map((exp, idx) => {
              const isLeft = idx % 2 === 0;
              const accentColor = typeColors[exp.type] || "#E8722A";

              return (
                <div
                  key={exp.company + exp.role}
                  className="relative"
                >
                  <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-8">
                    {/* Left side */}
                    {isLeft ? (
                      <div className="exp-card-desktop flex justify-end">
                        <ExperienceCard
                          exp={exp}
                          accentColor={accentColor}
                          align="right"
                        />
                      </div>
                    ) : (
                      <div />
                    )}

                    {/* Center: Switch dot + branch lines */}
                    <div className="relative flex flex-col items-center">
                      <div
                        className="exp-switch-dot w-5 h-5 rounded-full border-[3px] z-10"
                        style={{
                          borderColor: accentColor,
                          background: "var(--bg-primary)",
                          boxShadow: `0 0 12px ${accentColor}40`,
                        }}
                      />
                      {/* Branch line going to the card side */}
                      <div
                        className="exp-branch-line absolute top-[8px] h-[3px] w-12"
                        style={{
                          background: accentColor,
                          [isLeft ? "right" : "left"]: "100%",
                          transformOrigin: isLeft
                            ? "right center"
                            : "left center",
                        }}
                      />
                    </div>

                    {/* Right side */}
                    {!isLeft ? (
                      <div className="exp-card-desktop">
                        <ExperienceCard
                          exp={exp}
                          accentColor={accentColor}
                          align="left"
                        />
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Terminal dot at bottom */}
          <div className="flex justify-center mt-8">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                background: "var(--warm-orange)",
                boxShadow: "0 0 16px rgba(232, 114, 42, 0.4)",
                position: "relative",
              }}
            />
          </div>
        </div>

        {/* === MOBILE HORIZONTAL SWIPER LAYOUT === */}
        <div className="md:hidden overflow-hidden w-full relative">
          <div
            ref={mobileSwiperRef}
            className="flex items-stretch gap-6 pb-6 px-4"
          >
            {experience.map((exp, idx) => {
              const accentColor = typeColors[exp.type] || "#E8722A";
              return (
                <div
                  key={exp.company + exp.role}
                  className="w-[80vw] shrink-0 flex flex-col"
                >
                  <ExperienceCard
                    exp={exp}
                    accentColor={accentColor}
                    align="left"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({
  exp,
  accentColor,
  align,
}: {
  exp: (typeof experience)[number];
  accentColor: string;
  align: "left" | "right";
}) {
  return (
    <div
      className="glass rounded-xl p-5 sm:p-6 max-w-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
      style={{
        borderColor: `${accentColor}30`,
        borderWidth: "1px",
        borderStyle: "solid",
        textAlign: align === "right" ? "right" : "left",
      }}
    >
      {/* Type badge */}
      <div
        className={`flex items-center gap-2 mb-3 ${align === "right" ? "justify-end" : "justify-start"}`}
      >
        <span
          className="text-[10px] font-mono font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full"
          style={{
            background: `${accentColor}18`,
            color: accentColor,
            border: `1px solid ${accentColor}30`,
          }}
        >
          {exp.type}
        </span>
      </div>

      {/* Role */}
      <h3
        className="font-heading font-bold text-lg sm:text-xl mb-1"
        style={{ color: "var(--text-primary)" }}
      >
        {exp.role}
      </h3>

      {/* Company */}
      <p
        className="font-heading font-medium text-sm mb-1"
        style={{ color: accentColor }}
      >
        {exp.company}
      </p>

      {/* Duration */}
      <p
        className="text-xs font-mono mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        {exp.duration}
      </p>

      {/* Highlights */}
      <div
        className={`space-y-2 flex-1 ${align === "right" ? "text-right" : "text-left"}`}
      >
        {exp.highlights.map((h) => (
          <p
            key={h}
            className={`exp-highlight-item text-xs sm:text-sm flex items-start gap-2 ${align === "right" ? "flex-row-reverse" : ""}`}
            style={{ color: "var(--text-secondary)" }}
          >
            <span
              className="mt-0.5 flex-shrink-0"
              style={{ color: accentColor }}
            >
              ●
            </span>
            <span>{h}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
