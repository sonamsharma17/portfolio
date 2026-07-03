"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { achievements } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Hackathon: { bg: "rgba(236,72,153,0.12)", text: "#EC4899", border: "rgba(236,72,153,0.25)" },
  Competition: { bg: "rgba(212,168,67,0.12)", text: "#D4A843", border: "rgba(212,168,67,0.25)" },
  Research: { bg: "rgba(0,180,216,0.12)", text: "#00B4D8", border: "rgba(0,180,216,0.25)" },
  Academic: { bg: "rgba(76,175,80,0.12)", text: "#4CAF50", border: "rgba(76,175,80,0.25)" },
  Coding: { bg: "rgba(124,58,237,0.12)", text: "#7C3AED", border: "rgba(124,58,237,0.25)" },
  Certification: { bg: "rgba(245,183,49,0.12)", text: "#F5B731", border: "rgba(245,183,49,0.25)" },
  "Open Source": { bg: "rgba(232,114,42,0.12)", text: "#E8722A", border: "rgba(232,114,42,0.25)" },
};

function getCategory(cat: string) {
  return categoryColors[cat] ?? { bg: "rgba(212,168,67,0.1)", text: "#D4A843", border: "rgba(212,168,67,0.2)" };
}

export default function AchievementStation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Sign reveal
        gsap.from(".achieve-sign", {
          y: -30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".achieve-sign",
            start: "top 85%",
          },
        });

        // Cards staggered scale + fade
        gsap.utils.toArray<HTMLElement>(".achieve-card").forEach((card, i) => {
          gsap.from(card, {
            y: 40,
            opacity: 0,
            scale: 0.9,
            duration: 0.7,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
            },
          });
        });

        // Icon pop
        gsap.utils.toArray<HTMLElement>(".achieve-icon").forEach((icon, i) => {
          gsap.from(icon, {
            scale: 0,
            rotation: -20,
            duration: 0.5,
            delay: i * 0.1 + 0.3,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: icon.closest(".achieve-card"),
              start: "top 90%",
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
      id="achievements"
      className="station-section"
      style={{
        background: "linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 30%, #12121F 100%)",
      }}
    >
      {/* Subtle radial gold ambient */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Station sign */}
        <div className="achieve-sign mb-14 flex justify-center">
          <h2
            className="station-sign"
            style={{
              borderColor: "#D4A843",
              color: "#F8F6F0",
              background: "linear-gradient(180deg, #1F1A2E 0%, #1A1A2E 100%)",
              boxShadow: "0 0 30px rgba(212,168,67,0.1)",
            }}
          >
            Achievement Station
          </h2>
        </div>

        {/* Ornamental divider */}
        <div className="mx-auto mb-12 flex max-w-xs items-center gap-3" aria-hidden="true">
          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, #D4A843)" }} />
          <span style={{ color: "#D4A843", fontSize: 12 }}>◆</span>
          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #D4A843, transparent)" }} />
        </div>

        {/* Achievement cards grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((item, i) => {
            const catStyle = getCategory(item.category);
            return (
              <article
                key={i}
                className="achieve-card group relative overflow-hidden rounded-xl transition-transform duration-300 hover:scale-[1.03]"
                style={{
                  background: "linear-gradient(145deg, rgba(26,26,46,0.8) 0%, rgba(15,15,26,0.9) 100%)",
                  border: "1px solid rgba(212,168,67,0.12)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
              >
                {/* Gold shimmer on hover */}
                <div
                  className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
                  aria-hidden="true"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.08), transparent)",
                    width: "100%",
                  }}
                />

                {/* Top gold accent line */}
                <div
                  className="h-[2px]"
                  style={{
                    background: "linear-gradient(90deg, transparent, #D4A843, transparent)",
                  }}
                />

                <div className="relative z-10 flex flex-col items-center p-6 text-center">
                  {/* Icon */}
                  <div
                    className="achieve-icon mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
                    style={{
                      background: "rgba(212,168,67,0.08)",
                      border: "2px solid rgba(212,168,67,0.15)",
                      boxShadow: "0 0 20px rgba(212,168,67,0.1)",
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Year */}
                  <span
                    className="mb-2 font-mono text-xs font-semibold tracking-wider"
                    style={{ color: "#D4A843" }}
                  >
                    {item.year}
                  </span>

                  {/* Title */}
                  <h3
                    className="mb-3 font-heading text-base font-bold leading-tight"
                    style={{ color: "#F8F6F0" }}
                  >
                    {item.title}
                  </h3>

                  {/* Category badge */}
                  <span
                    className="inline-block rounded-full px-3 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest"
                    style={{
                      background: catStyle.bg,
                      color: catStyle.text,
                      border: `1px solid ${catStyle.border}`,
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Bottom gold accent */}
                <div
                  className="h-px"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.2), transparent)",
                  }}
                />

                {/* Hover border glow */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                  style={{
                    boxShadow: "inset 0 0 0 1px rgba(212,168,67,0.25), 0 0 20px rgba(212,168,67,0.1)",
                  }}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
