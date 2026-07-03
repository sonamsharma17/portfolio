"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const posRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Detect touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const glow = glowRef.current;
    if (!cursor || !glow) return;

    // Use GSAP quickTo for butter-smooth follow
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power2.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power2.out" });
    const gxTo = gsap.quickTo(glow, "x", { duration: 0.35, ease: "power2.out" });
    const gyTo = gsap.quickTo(glow, "y", { duration: 0.35, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      xTo(e.clientX);
      yTo(e.clientY);
      gxTo(e.clientX);
      gyTo(e.clientY);
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[data-cursor='pointer']")
      ) {
        setIsPointer(true);
        setIsHovering(true);
      } else if (
        target.closest("[data-cursor='train']")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsPointer(false);
      setIsHovering(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Main cursor - train lantern */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform" }}
      >
        {/* Lantern body */}
        <div
          className="relative flex items-center justify-center transition-transform duration-200"
          style={{
            width: isHovering ? "28px" : "20px",
            height: isHovering ? "28px" : "20px",
            transform: isPointer ? "scale(1.3)" : "scale(1)",
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute rounded-full transition-all duration-300"
            style={{
              width: "100%",
              height: "100%",
              background: isHovering
                ? "radial-gradient(circle, rgba(232,114,42,1) 0%, rgba(232,114,42,0.6) 40%, transparent 70%)"
                : "radial-gradient(circle, rgba(232,114,42,0.9) 0%, rgba(232,114,42,0.4) 40%, transparent 70%)",
              boxShadow: isHovering
                ? "0 0 20px rgba(232,114,42,0.8), 0 0 40px rgba(232,114,42,0.4)"
                : "0 0 10px rgba(232,114,42,0.5), 0 0 20px rgba(232,114,42,0.2)",
            }}
          />
          {/* Lantern ring */}
          <div
            className="absolute rounded-full border-2 transition-all duration-300"
            style={{
              width: "70%",
              height: "70%",
              borderColor: isHovering
                ? "rgba(232,114,42,0.9)"
                : "rgba(232,114,42,0.5)",
            }}
          />
          {/* Center dot */}
          <div
            className="absolute rounded-full"
            style={{
              width: "4px",
              height: "4px",
              background: "#fff",
              boxShadow: "0 0 4px #fff",
            }}
          />
        </div>
      </div>

      {/* Ambient glow trail */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform" }}
      >
        <div
          className="rounded-full transition-all duration-500"
          style={{
            width: isHovering ? "120px" : "80px",
            height: isHovering ? "120px" : "80px",
            background: `radial-gradient(circle, rgba(232,114,42,${isHovering ? "0.08" : "0.04"}) 0%, transparent 70%)`,
          }}
        />
      </div>
    </>
  );
}
