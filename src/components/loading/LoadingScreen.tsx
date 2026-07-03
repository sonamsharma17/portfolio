"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin();

interface LoadingScreenProps {
  onComplete: () => void;
}

interface Star {
  width: number;
  height: number;
  left: number;
  top: number;
  opacity: number;
  animationDuration: number;
  animationDelay: number;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const [stars, setStars] = useState<Star[]>([]);

  // Initialize stars on client only to prevent hydration mismatch and position jitter
  useEffect(() => {
    setStars(
      Array.from({ length: 50 }).map(() => ({
        width: 1 + Math.random() * 2,
        height: 1 + Math.random() * 2,
        left: Math.random() * 100,
        top: Math.random() * 60,
        opacity: 0.3 + Math.random() * 0.7,
        animationDuration: 2 + Math.random() * 3,
        animationDelay: Math.random() * 3,
      }))
    );
  }, []);

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      progressRef.current += Math.random() * 8 + 2;
      if (progressRef.current >= 100) {
        progressRef.current = 100;
        clearInterval(interval);
      }
      setProgress(Math.floor(progressRef.current));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Fade in from black
      tl.from(containerRef.current, {
        opacity: 0,
        duration: 0.5,
      });

      // Animate track lines
      tl.from(".track-line", {
        scaleX: 0,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.1,
      }, "-=0.3");

      // Animate the environment
      tl.from(".mountain-silhouette", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
      }, "-=0.8");

      // Stars twinkle in
      tl.from(".loading-star", {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        stagger: { each: 0.05, from: "random" },
      }, "-=0.5");
    },
    { scope: containerRef }
  );

  // Exit animation when progress hits 100
  useGSAP(
    () => {
      if (progress < 100) return;

      const exitTl = gsap.timeline({
        onComplete: () => {
          setTimeout(onComplete, 200);
        },
      });

      // Train moves off screen
      exitTl.to(".loading-locomotive", {
        x: "120vw",
        duration: 1.5,
        ease: "power2.in",
      });

      // Fade out everything
      exitTl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
        },
        "-=0.5"
      );
    },
    { scope: containerRef, dependencies: [progress] }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-end overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a0b1a 0%, #111327 40%, #1a1d35 70%, #0c0e1a 100%)",
      }}
    >
      {/* Stars */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="loading-star absolute rounded-full"
            style={{
              width: `${star.width}px`,
              height: `${star.height}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
              background: "white",
              opacity: star.opacity,
              animation: `twinkle ${star.animationDuration}s ease-in-out infinite`,
              animationDelay: `${star.animationDelay}s`,
            }}
          />
        ))}
      </div>

      {/* Mountain silhouettes */}
      <div className="mountain-silhouette absolute bottom-[25%] left-0 right-0">
        <svg viewBox="0 0 1440 200" className="w-full" preserveAspectRatio="none">
          <path
            d="M0,200 L0,120 Q100,40 200,100 Q300,30 400,80 Q500,10 600,60 Q700,0 800,50 Q900,20 1000,70 Q1100,30 1200,90 Q1300,50 1440,110 L1440,200 Z"
            fill="#1a1d35"
            opacity="0.6"
          />
          <path
            d="M0,200 L0,140 Q150,70 300,120 Q450,50 600,90 Q750,30 900,80 Q1050,50 1200,110 Q1350,80 1440,130 L1440,200 Z"
            fill="#111327"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Railway tracks */}
      <div className="absolute bottom-[12%] left-0 right-0 px-0">
        {/* Track sleepers */}
        <div className="relative h-4 overflow-hidden">
          <div
            className="absolute inset-0 flex gap-3"
            style={{
              animation: "track-scroll 4s linear infinite",
            }}
          >
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="track-line flex-shrink-0 h-full rounded-sm"
                style={{
                  width: "8px",
                  background: "linear-gradient(180deg, #5C4033 0%, #3D2B1F 100%)",
                }}
              />
            ))}
          </div>
        </div>
        {/* Rails */}
        <div className="relative">
          <div
            className="track-line absolute -top-5 left-0 right-0 h-[3px]"
            style={{
              background: "linear-gradient(90deg, transparent 0%, #8B8682 5%, #A0998F 50%, #8B8682 95%, transparent 100%)",
              boxShadow: "0 0 4px rgba(160,153,143,0.3)",
            }}
          />
          <div
            className="track-line absolute top-0 left-0 right-0 h-[3px]"
            style={{
              background: "linear-gradient(90deg, transparent 0%, #8B8682 5%, #A0998F 50%, #8B8682 95%, transparent 100%)",
              boxShadow: "0 0 4px rgba(160,153,143,0.3)",
            }}
          />
        </div>
      </div>

      {/* Locomotive */}
      <div
        className="loading-locomotive absolute"
        style={{
          bottom: "14%",
          left: `${Math.min(progress, 85)}%`,
          transform: "translateX(-50%)",
          transition: "left 0.3s ease-out",
        }}
      >
        <div className="relative">
          {/* Steam particles */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${6 + i * 4}px`,
                  height: `${6 + i * 4}px`,
                  background: "rgba(200,200,200,0.4)",
                  left: `${(i - 1) * 10}px`,
                  animation: `steam-rise ${1.5 + i * 0.3}s ease-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>

          {/* Engine body */}
          <svg width="80" height="50" viewBox="0 0 80 50">
            {/* Chimney */}
            <rect x="12" y="4" width="8" height="12" rx="2" fill="#4A3728" />
            <rect x="10" y="2" width="12" height="4" rx="1" fill="#5C4033" />
            {/* Boiler */}
            <rect x="5" y="16" width="45" height="20" rx="4" fill="#C45E2C" />
            <rect x="5" y="16" width="45" height="6" rx="2" fill="#E8722A" opacity="0.6" />
            {/* Cabin */}
            <rect x="50" y="10" width="22" height="26" rx="2" fill="#8B4513" />
            <rect x="54" y="14" width="14" height="10" rx="1" fill="#FFD700" opacity="0.3" />
            {/* Cab window glow */}
            <rect x="56" y="16" width="10" height="6" rx="1" fill="#FFD700" opacity="0.5" />
            {/* Cowcatcher */}
            <polygon points="0,36 5,26 5,36" fill="#6B7B8D" />
            {/* Headlight */}
            <circle cx="5" cy="24" r="3" fill="#FFD700" opacity="0.9">
              <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
            </circle>
            {/* Headlight beam */}
            <polygon points="0,22 5,22 5,26 -15,30" fill="url(#headlightGrad)" opacity="0.15" />
            <defs>
              <linearGradient id="headlightGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0" />
                <stop offset="100%" stopColor="#FFD700" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {/* Wheels */}
            <circle cx="15" cy="40" r="6" fill="#333" stroke="#666" strokeWidth="1.5">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 15 40"
                to="360 15 40"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="15" cy="40" r="2" fill="#888" />
            <circle cx="35" cy="40" r="6" fill="#333" stroke="#666" strokeWidth="1.5">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 35 40"
                to="360 35 40"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="35" cy="40" r="2" fill="#888" />
            <circle cx="60" cy="40" r="5" fill="#333" stroke="#666" strokeWidth="1.5">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 60 40"
                to="360 60 40"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="60" cy="40" r="1.5" fill="#888" />
            {/* Connecting rod */}
            <line x1="15" y1="40" x2="35" y2="40" stroke="#777" strokeWidth="2">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 2,-1; 0,0; -2,1; 0,0"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </line>
          </svg>

          {/* Progress text inside engine */}
          <div
            className="absolute top-[22px] left-[15px] font-mono text-xs font-bold"
            style={{
              color: "#FFD700",
              textShadow: "0 0 4px rgba(255,215,0,0.5)",
              fontSize: "10px",
            }}
          >
            {progress}%
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 text-center">
        <p
          className="font-mono text-sm tracking-[0.3em] uppercase"
          style={{ color: "var(--text-secondary)" }}
        >
          {progress < 100 ? "Preparing Your Journey..." : "All Aboard!"}
        </p>

        {/* Progress bar */}
        <div
          className="mt-3 h-1 rounded-full overflow-hidden mx-auto"
          style={{
            width: "200px",
            background: "rgba(255,255,255,0.1)",
          }}
        >
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #E8722A, #F5B731)",
              boxShadow: "0 0 10px rgba(232,114,42,0.5)",
            }}
          />
        </div>
      </div>

      {/* DEVELOPER EXPRESS branding */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <h1
          className="font-mono text-xl md:text-2xl font-bold tracking-[0.5em] uppercase"
          style={{
            color: "var(--accent)",
            textShadow: "0 0 20px var(--accent-glow)",
            opacity: progress > 10 ? 1 : 0,
            transition: "opacity 1s ease",
          }}
        >
          🚂 DEVELOPER EXPRESS
        </h1>
        <p
          className="mt-2 text-xs tracking-[0.2em] uppercase"
          style={{
            color: "var(--text-muted)",
            opacity: progress > 20 ? 1 : 0,
            transition: "opacity 1s ease 0.5s",
          }}
        >
          A Journey Through My Developer Career
        </p>
      </div>
    </div>
  );
}
