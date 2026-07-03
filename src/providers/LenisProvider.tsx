"use client";

import { ReactLenis } from "lenis/react";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Update ScrollTrigger on Lenis scroll
    const updateScrollTrigger = () => {
      ScrollTrigger.update();
    };

    window.addEventListener("scroll", updateScrollTrigger);
    return () => {
      window.removeEventListener("scroll", updateScrollTrigger);
    };
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, syncTouch: true }}>
      {children}
    </ReactLenis>
  );
}
