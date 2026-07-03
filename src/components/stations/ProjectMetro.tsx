"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

const metroLineColors = [
  "#00E5FF",
  "#7C3AED",
  "#F43F5E",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
];

export default function ProjectMetro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      // Animate the station sign
      gsap.from(".metro-sign", {
        y: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".metro-sign",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate the metro line drawing itself
      gsap.from(".metro-line-track", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.4,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".metro-line-track",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Mobile: vertical line
      gsap.from(".metro-line-track-vertical", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1.4,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".metro-line-track-vertical",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Desktop: Staggered stop dots
      gsap.from(".desktop-only .metro-stop-dot", {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: ".metro-stops-container-desktop",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // Desktop: Staggered project cards
      gsap.from(".desktop-only .metro-card", {
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".metro-stops-container-desktop",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // Mobile: Staggered stop dots
      gsap.from(".mobile-only .metro-stop-dot", {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: ".metro-stops-container-mobile",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // Mobile: Staggered project cards
      gsap.from(".mobile-only .metro-card", {
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".metro-stops-container-mobile",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // Neon pulse on the metro line
      gsap.to(".metro-line-glow", {
        opacity: 0.6,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="projects"
      className="station-section"
      style={{ background: "var(--metro-dark)" }}
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,229,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Station Sign */}
        <div className="station-header justify-center mb-16">
          <div
            className="metro-sign station-sign"
            style={{
              borderColor: "var(--neon-cyan)",
              color: "var(--led-white)",
              background: "rgba(0, 229, 255, 0.08)",
              boxShadow: "0 0 30px rgba(0, 229, 255, 0.15)",
            }}
          >
            PROJECT METRO
          </div>
        </div>

        {/* === DESKTOP LAYOUT: Horizontal Metro Line === */}
        <div className="hidden lg:block desktop-only">
          {/* Metro Line */}
          <div className="relative mb-8">
            <div className="metro-stops-container-desktop relative px-8">
              {/* The track line */}
              <div
                className="metro-line-track absolute top-[18px] left-8 right-8 h-1 rounded-full"
                style={{ background: "var(--neon-cyan)" }}
              />
              <div
                className="metro-line-glow absolute top-[14px] left-8 right-8 h-[10px] rounded-full blur-sm"
                style={{ background: "var(--neon-cyan)", opacity: 0.3 }}
              />

              {/* Stop dots */}
              <div className="flex justify-between relative">
                {projects.map((project, idx) => (
                  <div
                    key={project.name}
                    className="flex flex-col items-center"
                    style={{ width: `${100 / projects.length}%` }}
                  >
                    {/* Stop dot */}
                    <button
                      onClick={() =>
                        setExpandedIdx(expandedIdx === idx ? null : idx)
                      }
                      className="metro-stop-dot relative z-10 w-9 h-9 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 hover:scale-125"
                      style={{
                        borderColor:
                          metroLineColors[idx % metroLineColors.length],
                        background:
                          expandedIdx === idx
                            ? metroLineColors[idx % metroLineColors.length]
                            : "var(--metro-dark)",
                        boxShadow: `0 0 12px ${metroLineColors[idx % metroLineColors.length]}60`,
                      }}
                      aria-label={`View project: ${project.name}`}
                    >
                      <span
                        className="text-xs font-bold font-mono"
                        style={{
                          color:
                            expandedIdx === idx
                              ? "var(--metro-dark)"
                              : metroLineColors[idx % metroLineColors.length],
                        }}
                      >
                        {idx + 1}
                      </span>
                    </button>

                    {/* Connector line */}
                    <div
                      className="w-px h-8"
                      style={{
                        background: `linear-gradient(to bottom, ${metroLineColors[idx % metroLineColors.length]}, transparent)`,
                      }}
                    />

                    {/* Category Label */}
                    <span
                      className="text-[10px] font-mono font-semibold tracking-wider uppercase mb-2"
                      style={{
                        color:
                          metroLineColors[idx % metroLineColors.length],
                      }}
                    >
                      {project.category}
                    </span>

                    {/* Project Card */}
                    <div
                      className="metro-card group w-full max-w-[220px] rounded-xl p-4 transition-[border-color,box-shadow] duration-300"
                      style={{
                        minHeight: 190,
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${metroLineColors[idx % metroLineColors.length]}30`,
                        boxShadow:
                          expandedIdx === idx
                            ? `0 8px 32px ${metroLineColors[idx % metroLineColors.length]}25`
                            : "none",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${metroLineColors[idx % metroLineColors.length]}80`;
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${metroLineColors[idx % metroLineColors.length]}30`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${metroLineColors[idx % metroLineColors.length]}30`;
                        if (expandedIdx !== idx) {
                          (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        }
                      }}
                    >
                      <h3
                        className="font-heading font-bold text-sm mb-2 leading-tight"
                        style={{ color: "var(--led-white)" }}
                      >
                        {project.name}
                      </h3>
                      <p
                        className="text-xs leading-relaxed mb-3 line-clamp-3"
                        style={{ color: "rgba(232, 240, 255, 0.6)" }}
                      >
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
                            style={{
                              background: `${metroLineColors[idx % metroLineColors.length]}18`,
                              color:
                                metroLineColors[idx % metroLineColors.length],
                              border: `1px solid ${metroLineColors[idx % metroLineColors.length]}30`,
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
                            style={{ color: "rgba(232,240,255,0.4)" }}
                          >
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Expanded highlights */}
                      {expandedIdx === idx && (
                        <div
                          className="mt-3 pt-3"
                          style={{
                            borderTop: `1px solid ${metroLineColors[idx % metroLineColors.length]}20`,
                          }}
                        >
                          <p
                            className="text-[10px] font-mono uppercase tracking-wider mb-2"
                            style={{
                              color:
                                metroLineColors[idx % metroLineColors.length],
                            }}
                          >
                            Highlights
                          </p>
                          {project.highlights.map((h) => (
                            <p
                              key={h}
                              className="text-[10px] mb-1 flex items-start gap-1"
                              style={{ color: "rgba(232,240,255,0.7)" }}
                            >
                              <span
                                style={{
                                  color:
                                    metroLineColors[
                                      idx % metroLineColors.length
                                    ],
                                }}
                              >
                                ▸
                              </span>
                              {h}
                            </p>
                          ))}
                          {/* All tech */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
                                style={{
                                  background: `${metroLineColors[idx % metroLineColors.length]}18`,
                                  color:
                                    metroLineColors[
                                      idx % metroLineColors.length
                                    ],
                                  border: `1px solid ${metroLineColors[idx % metroLineColors.length]}30`,
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* === MOBILE LAYOUT: Vertical Metro Line === */}
        <div className="lg:hidden mobile-only">
          <div className="metro-stops-container-mobile relative pl-12 sm:pl-16">
            {/* Vertical Track */}
            <div
              className="metro-line-track-vertical absolute left-5 sm:left-7 top-0 bottom-0 w-1 rounded-full"
              style={{ background: "var(--neon-cyan)" }}
            />
            <div
              className="metro-line-glow absolute left-[16px] sm:left-[24px] top-0 bottom-0 w-[10px] rounded-full blur-sm"
              style={{ background: "var(--neon-cyan)", opacity: 0.3 }}
            />

            {/* Mobile Stops */}
            <div className="space-y-8">
              {projects.map((project, idx) => (
                <div key={project.name} className="relative">
                  {/* Stop dot */}
                  <button
                    onClick={() =>
                      setExpandedIdx(expandedIdx === idx ? null : idx)
                    }
                    className="metro-stop-dot absolute -left-[46px] sm:-left-[56px] top-4 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[3px] flex items-center justify-center transition-all duration-300"
                    style={{
                      borderColor:
                        metroLineColors[idx % metroLineColors.length],
                      background:
                        expandedIdx === idx
                          ? metroLineColors[idx % metroLineColors.length]
                          : "var(--metro-dark)",
                      boxShadow: `0 0 16px ${metroLineColors[idx % metroLineColors.length]}50`,
                    }}
                    aria-label={`View project: ${project.name}`}
                  >
                    <span
                      className="text-xs font-bold font-mono"
                      style={{
                        color:
                          expandedIdx === idx
                            ? "var(--metro-dark)"
                            : metroLineColors[idx % metroLineColors.length],
                      }}
                    >
                      {idx + 1}
                    </span>
                  </button>

                  {/* Horizontal connector */}
                  <div
                    className="absolute top-[22px] h-px -left-[26px] sm:-left-[34px] w-[42px] sm:w-[50px]"
                    style={{
                      background:
                        metroLineColors[idx % metroLineColors.length],
                      opacity: 0.5,
                    }}
                  />

                  {/* Project Card */}
                  <div
                    className="metro-card group rounded-xl p-5 sm:p-6 ml-4 transition-[border-color,box-shadow] duration-300"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${metroLineColors[idx % metroLineColors.length]}30`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-mono font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full"
                        style={{
                          background: `${metroLineColors[idx % metroLineColors.length]}18`,
                          color:
                            metroLineColors[idx % metroLineColors.length],
                        }}
                      >
                        {project.category}
                      </span>
                    </div>

                    <h3
                      className="font-heading font-bold text-lg mb-2"
                      style={{ color: "var(--led-white)" }}
                    >
                      {project.name}
                    </h3>
                    {/* Expandable details wrapper - expands on click or hover */}
                    <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                      expandedIdx === idx
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr] group-hover:grid-rows-[1fr]"
                    }`}>
                      <div className="overflow-hidden">
                        <p
                          className="text-sm leading-relaxed mb-4 pt-2"
                          style={{ color: "rgba(232, 240, 255, 0.6)" }}
                        >
                          {project.description}
                        </p>
                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-1.5 mb-3 pt-2">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] font-mono px-2 py-1 rounded-full"
                              style={{
                                background: `${metroLineColors[idx % metroLineColors.length]}15`,
                                color:
                                  metroLineColors[idx % metroLineColors.length],
                                border: `1px solid ${metroLineColors[idx % metroLineColors.length]}30`,
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Highlights */}
                        <div
                          className="pt-3"
                          style={{
                            borderTop: `1px solid ${metroLineColors[idx % metroLineColors.length]}15`,
                          }}
                        >
                          {project.highlights.map((h) => (
                            <p
                              key={h}
                              className="text-xs mb-1.5 flex items-start gap-1.5"
                              style={{ color: "rgba(232,240,255,0.7)" }}
                            >
                              <span
                                className="mt-0.5"
                                style={{
                                  color:
                                    metroLineColors[idx % metroLineColors.length],
                                }}
                              >
                                ▸
                              </span>
                              {h}
                            </p>
                          ))}
                        </div>

                        {/* Links */}
                        <div className="flex gap-3 mt-3 pb-1">
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono uppercase tracking-wider transition-colors"
                            style={{
                              color: metroLineColors[idx % metroLineColors.length],
                            }}
                          >
                            ↗ GitHub
                          </a>
                          {project.live && (
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-mono uppercase tracking-wider transition-colors"
                              style={{
                                color:
                                  metroLineColors[idx % metroLineColors.length],
                              }}
                            >
                              ↗ Live
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metro Legend */}
        <div className="mt-16 flex justify-center">
          <div
            className="inline-flex items-center gap-4 px-6 py-3 rounded-full"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(0,229,255,0.15)",
            }}
          >
            <span
              className="text-xs font-mono"
              style={{ color: "rgba(232,240,255,0.5)" }}
            >
              {projects.length} STATIONS
            </span>
            <span style={{ color: "rgba(232,240,255,0.2)" }}>|</span>
            <span
              className="text-xs font-mono"
              style={{ color: "var(--neon-cyan)" }}
            >
              TAP A STOP TO EXPLORE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
