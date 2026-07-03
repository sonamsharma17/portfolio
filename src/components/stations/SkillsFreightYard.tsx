"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills } from "@/data/portfolio";

gsap.registerPlugin(ScrollTrigger);

type SkillCategory = {
  key: keyof typeof skills;
  label: string;
  icon: string;
};

const categories: SkillCategory[] = [
  { key: "languages", label: "Languages", icon: "⚙️" },
  { key: "frameworks", label: "Frameworks", icon: "🏗️" },
  { key: "tools", label: "Tools", icon: "🔧" },
  { key: "databases", label: "Databases", icon: "🗄️" },
  { key: "cloud", label: "Cloud", icon: "☁️" },
];

function FreightCrane() {
  return (
    <svg
      className="freight-crane"
      viewBox="0 0 400 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: "100%", maxWidth: 400, height: "auto" }}
    >
      {/* Crane base */}
      <rect x="170" y="140" width="60" height="20" rx="2" fill="#5C4033" />
      {/* Vertical mast */}
      <rect x="195" y="20" width="10" height="120" fill="#6B7B8D" />
      {/* Horizontal boom */}
      <rect x="40" y="18" width="320" height="8" rx="2" fill="#6B7B8D" />
      {/* Boom support cables */}
      <line x1="200" y1="26" x2="80" y2="18" stroke="#C45E2C" strokeWidth="2" />
      <line x1="200" y1="26" x2="320" y2="18" stroke="#C45E2C" strokeWidth="2" />
      {/* Cabin */}
      <rect x="185" y="50" width="30" height="25" rx="3" fill="#C45E2C" />
      <rect x="190" y="55" width="8" height="8" rx="1" fill="#F5B731" opacity="0.7" />
      {/* Hook cable */}
      <line x1="100" y1="26" x2="100" y2="90" stroke="#6B7B8D" strokeWidth="2" className="crane-cable" />
      {/* Hook */}
      <path d="M 92 90 Q 92 105 100 105 Q 108 105 108 90" stroke="#C45E2C" strokeWidth="3" fill="none" className="crane-hook" />
      {/* Cargo block */}
      <rect x="85" y="108" width="30" height="22" rx="2" fill="#5C4033" className="crane-cargo" opacity="0.8" />
      {/* Wheels */}
      <circle cx="180" cy="155" r="6" fill="#6B7B8D" />
      <circle cx="220" cy="155" r="6" fill="#6B7B8D" />
    </svg>
  );
}

function Rivet({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full bg-[#6B7B8D] shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_1px_1px_rgba(0,0,0,0.5)] ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

function WarningStripe() {
  return (
    <div
      className="h-3 w-full"
      aria-hidden="true"
      style={{
        background: `repeating-linear-gradient(
          -45deg,
          #C45E2C,
          #C45E2C 10px,
          #1A1A2E 10px,
          #1A1A2E 20px
        )`,
      }}
    />
  );
}

export default function SkillsFreightYard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (key: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Crane animation
        gsap.to(".freight-crane .crane-cargo", {
          y: -5,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".freight-crane .crane-hook", {
          y: -5,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".freight-crane .crane-cable", {
          attr: { y2: 85 },
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Station sign reveal
        gsap.from(".freight-sign", {
          y: -40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".freight-sign",
            start: "top 85%",
          },
        });

        // Container cards stagger reveal
        gsap.utils.toArray<HTMLElement>(".freight-container").forEach((container, i) => {
          gsap.from(container, {
            y: 60,
            opacity: 0,
            scale: 0.92,
            duration: 0.7,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 88%",
            },
          });

          // Container lid opening effect
          const lid = container.querySelector(".container-lid");
          if (lid) {
            gsap.from(lid, {
              rotateX: -90,
              opacity: 0,
              duration: 0.6,
              delay: i * 0.12 + 0.3,
              ease: "power2.out",
              scrollTrigger: {
                trigger: container,
                start: "top 85%",
              },
            });
          }
        });

        // Proficiency bars animate
        gsap.utils.toArray<HTMLElement>(".skill-bar-fill").forEach((bar) => {
          const target = bar.getAttribute("data-level") || "0";
          gsap.fromTo(
            bar,
            { width: "0%" },
            {
              width: `${target}%`,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: bar,
                start: "top 92%",
              },
            }
          );
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="skills"
      className="station-section"
      style={{
        background: `linear-gradient(180deg, #1A1410 0%, #0F0D0A 40%, #151210 100%)`,
      }}
    >
      {/* Industrial background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='%236B7B8D' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Freight crane */}
        <div className="mb-8 flex justify-center">
          <FreightCrane />
        </div>

        {/* Station sign */}
        <div className="freight-sign mb-12 flex justify-center">
          <h2
            className="station-sign"
            style={{
              borderColor: "#C45E2C",
              color: "#F0ECE3",
              background: "linear-gradient(180deg, #2A1F16 0%, #1A1410 100%)",
            }}
          >
            Skills Freight Yard
          </h2>
        </div>

        {/* Warning stripe divider */}
        <div className="mx-auto mb-12 max-w-2xl">
          <WarningStripe />
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const items = skills[cat.key];
            return (
              <div
                key={cat.key}
                className="freight-container group relative rounded-sm"
                style={{
                  background: "linear-gradient(145deg, #2A2118 0%, #1C1612 100%)",
                  border: "2px solid #3D2E22",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(196,94,44,0.1)",
                }}
              >
                {/* Corner rivets */}
                <div className="absolute left-2 top-2"><Rivet /></div>
                <div className="absolute right-2 top-2"><Rivet /></div>
                <div className="absolute bottom-2 left-2"><Rivet /></div>
                <div className="absolute bottom-2 right-2"><Rivet /></div>
                <div
                  className="container-lid border-b px-5 py-4 cursor-pointer md:cursor-default select-none"
                  onClick={() => toggleCategory(cat.key)}
                  style={{
                    borderColor: "#3D2E22",
                    background: "linear-gradient(90deg, #C45E2C 0%, #A04B22 100%)",
                    transformOrigin: "top center",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <h3
                      className="font-heading text-lg font-bold uppercase tracking-wider"
                      style={{ color: "#F0ECE3" }}
                    >
                      {cat.label}
                    </h3>
                    <span
                      className="ml-auto font-mono text-xs flex items-center gap-1.5"
                      style={{ color: "rgba(240,236,227,0.6)" }}
                    >
                      <span>[{items.length}]</span>
                      <span className="md:hidden text-[10px] opacity-70">
                        {openCategories[cat.key] ? "▲" : "▼"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Content wrapper - folded/collapsed on mobile based on state */}
                <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                  openCategories[cat.key]
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr] group-hover:grid-rows-[1fr] md:grid-rows-[1fr]"
                }`}>
                  <div className="overflow-hidden">
                    {/* Metal panel separator */}
                    <WarningStripe />

                    {/* Skills inside the container */}
                    <div className="space-y-4 p-5">
                      {items.map((skill) => (
                        <div key={skill.name}>
                          <div className="mb-1.5 flex items-center justify-between">
                            <span
                              className="font-mono text-sm font-medium"
                              style={{ color: "#D4BFA6" }}
                            >
                              {skill.name}
                            </span>
                            <span
                              className="font-mono text-xs"
                              style={{ color: "#6B7B8D" }}
                            >
                              {skill.level}%
                            </span>
                          </div>
                          <div
                            className="h-2.5 overflow-hidden rounded-sm"
                            style={{ background: "#1A1410" }}
                          >
                            <div
                              className="skill-bar-fill h-full rounded-sm"
                              data-level={skill.level}
                              style={{
                                width: "0%",
                                background: `linear-gradient(90deg, #C45E2C 0%, #E8722A ${skill.level}%)`,
                                boxShadow: "0 0 8px rgba(196,94,44,0.4)",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom metal plate */}
                    <div
                      className="px-5 py-2 text-center font-mono text-[10px] uppercase tracking-widest"
                      style={{
                        color: "#4D3D30",
                        borderTop: "1px solid #3D2E22",
                        background: "linear-gradient(180deg, #1C1612 0%, #151210 100%)",
                      }}
                    >
                      Developer Express Cargo • #{cat.key.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
