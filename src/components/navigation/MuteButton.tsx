"use client";
 
import { useEffect, useRef } from "react";
import { useSoundContext } from "@/context/SoundContext";
 
export default function MuteButton() {
  const { isMuted, toggleMute, playSound } = useSoundContext();
 
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!isMuted) {
      playSound("click");
    }
  }, [isMuted, playSound]);
 
  return (
    <button
      onClick={toggleMute}
      className="fixed top-4 right-4 md:top-6 md:right-6 z-[100] p-2.5 md:p-4 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer glass"
      style={{
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 15px rgba(245, 183, 49, 0.15)",
        background: isMuted ? "rgba(30, 30, 40, 0.45)" : "rgba(245, 183, 49, 0.25)",
        border: isMuted ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(245, 183, 49, 0.5)",
      }}
      title={isMuted ? "Enable Sound" : "Mute Sound"}
      data-cursor="pointer"
    >
      <span className="text-sm md:text-xl leading-none transition-transform duration-300 group-hover:scale-110">
        {isMuted ? "🔇" : "🎵"}
      </span>
    </button>
  );
}
