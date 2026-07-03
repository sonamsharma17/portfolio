"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { personalInfo } from "@/data/portfolio";
import { useSoundContext } from "@/context/SoundContext";

interface HeroStar {
  width: number;
  height: number;
  left: number;
  top: number;
  opacity: number;
  animationDuration: number;
  animationDelay: number;
}

interface DustParticle {
  width: number;
  height: number;
  left: number;
  top: number;
  animationDuration: number;
  animationDelay: number;
}

export default function HeroStation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const steamCanvasRef = useRef<HTMLCanvasElement>(null);
  const [stars, setStars] = useState<HeroStar[]>([]);
  const [dust, setDust] = useState<DustParticle[]>([]);

  // Initialize stars and dust particles client-side to prevent hydration mismatch and visual jitter
  useEffect(() => {
    setStars(
      Array.from({ length: 30 }).map(() => ({
        width: 1 + Math.random() * 2,
        height: 1 + Math.random() * 2,
        left: Math.random() * 100,
        top: Math.random() * 30,
        opacity: 0.4 + Math.random() * 0.6,
        animationDuration: 2 + Math.random() * 4,
        animationDelay: Math.random() * 5,
      }))
    );
    setDust(
      Array.from({ length: 20 }).map(() => ({
        width: 1 + Math.random() * 2,
        height: 1 + Math.random() * 2,
        left: Math.random() * 100,
        top: 40 + Math.random() * 50,
        animationDuration: 8 + Math.random() * 12,
        animationDelay: Math.random() * 10,
      }))
    );
  }, []);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const roles = personalInfo.roles;
    const role = roles[currentRole];
    let charIndex = 0;
    let deleting = false;
    let timerId: NodeJS.Timeout | null = null;

    const type = () => {
      if (!deleting) {
        setDisplayText(role.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex === role.length) {
          setIsTyping(false);
          timerId = setTimeout(() => {
            deleting = true;
            setIsTyping(true);
            typeLoop();
          }, 2000);
          return;
        }
      } else {
        setDisplayText(role.substring(0, charIndex));
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          setCurrentRole((prev) => (prev + 1) % roles.length);
          return;
        }
      }
      typeLoop();
    };

    const typeLoop = () => {
      const speed = !deleting ? (Math.random() * 50 + 60) : (Math.random() * 30 + 30);
      timerId = setTimeout(type, speed);
    };

    typeLoop();

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRole]);

  // Steam particle system on canvas
  useEffect(() => {
    const canvas = steamCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    interface SteamParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      life: number;
    }

    const particles: SteamParticle[] = [];
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    const createParticle = () => {
      const train = containerRef.current?.querySelector(".hero-train-anim-wrapper") as HTMLElement;
      if (train) {
        const rect = train.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        // The chimney center is at ~55px from the train's left edge
        const chimneyX = rect.left - canvasRect.left + 55;
        // The chimney top is at ~25px from the train's top edge
        const chimneyY = rect.top - canvasRect.top + 25;

        return {
          x: chimneyX + (Math.random() - 0.5) * 12,
          y: chimneyY,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -(Math.random() * 1.5 + 0.6),
          size: Math.random() * 6 + 3,
          opacity: Math.random() * 0.4 + 0.25,
          life: 0,
        };
      }

      // Fallback if train is not in DOM
      return {
        x: w * 0.42 + (Math.random() - 0.5) * 30,
        y: h * 0.45,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 1.5 + 0.5),
        size: Math.random() * 8 + 3,
        opacity: Math.random() * 0.4 + 0.2,
        life: 0,
      };
    };

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      if (particles.length < 40 && Math.random() > 0.5) {
        particles.push(createParticle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.01;
        p.size *= 1.01;
        p.opacity -= 0.004;
        p.life++;

        if (p.opacity <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,195,185,${p.opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // GSAP entrance animations
  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.05 });

      // Fade in layers
      tl.from(".hero-sky", { opacity: 0, duration: 1.5, ease: "power2.out" });
      tl.from(".hero-mountains", { opacity: 0, y: 50, duration: 1.2, ease: "power2.out" }, "-=1");
      tl.from(".hero-clouds", { opacity: 0, duration: 1, ease: "power2.out" }, "-=0.8");
      tl.from(".hero-platform", { opacity: 0, y: 30, duration: 1, ease: "power2.out" }, "-=0.6");
      tl.from(".hero-train", { x: -200, opacity: 0, duration: 1.5, ease: "power3.out" }, "-=0.8");
      tl.from(".hero-content", { opacity: 0, y: 30, duration: 1, ease: "power2.out" }, "-=0.5");
      tl.from(".hero-cta", { opacity: 0, scale: 0.8, duration: 0.8, ease: "back.out(2)" }, "-=0.3");

      // Bird animations
      gsap.to(".bird-group", {
        x: "random(-50, 50)",
        y: "random(-30, 30)",
        duration: "random(4, 8)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.5, from: "random" },
      });

      // Cloud drift
      gsap.to(".cloud", {
        x: "+=200",
        duration: "random(30, 60)",
        ease: "none",
        repeat: -1,
        stagger: { each: 5, from: "random" },
        modifiers: {
          x: (x: string) => `${parseFloat(x) % 300}px`,
        },
      });

      // Tree sway
      gsap.to(".tree", {
        rotation: "random(-2, 2)",
        duration: "random(2, 4)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.3 },
        transformOrigin: "bottom center",
      });

      // Signal blink
      gsap.to(".signal-light", {
        opacity: 0.3,
        duration: 1,
        ease: "steps(1)",
        repeat: -1,
        yoyo: true,
      });

      // Platform light flicker
      gsap.to(".platform-light-glow", {
        opacity: "random(0.5, 1)",
        duration: "random(0.1, 0.3)",
        repeat: -1,
        yoyo: true,
        ease: "none",
        stagger: { each: 0.2, from: "random" },
      });
    },
    { scope: containerRef }
  );

  const [isTrainAnimating, setIsTrainAnimating] = useState(false);
  const { playSound } = useSoundContext();

  const handleTrainClick = () => {
    if (isTrainAnimating) return;
    setIsTrainAnimating(true);

    playSound("indian_horn", true);
    setTimeout(() => {
      playSound("steam", true);
    }, 3000);
    setTimeout(() => {
      playSound("train_run", true);
    }, 4100);

    const wrapper = containerRef.current?.querySelector(".hero-train-anim-wrapper");
    if (!wrapper) {
      setIsTrainAnimating(false);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsTrainAnimating(false);
      },
    });

    // 1. Keep stationary for 3.0s while the horn blows
    tl.to(wrapper, {
      x: "0vw",
      duration: 3.0,
    });

    // 2. Jerk slightly backward (to the right) to overcome inertia
    tl.to(wrapper, {
      x: "2.5vw",
      duration: 0.6,
      ease: "power1.inOut",
    });

    // 3. Zoom forward to the left off-screen, speed up
    tl.to(wrapper, {
      x: "-120vw",
      duration: 1.4,
      ease: "power3.in",
    });

    // 4. Instant wrap around to the right off-screen
    tl.set(wrapper, {
      x: "120vw",
    });

    // 5. Return from the right to center
    tl.to(wrapper, {
      x: "0vw",
      duration: 1.8,
      ease: "power2.out",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #1a0f2e 0%, #0f1b3d 20%, #1a3a5c 45%, #4a7c9b 65%, #e8a87c 85%, #f5c99d 100%)",
      }}
    >
      {/* ============ SKY LAYER ============ */}
      <div
        className="hero-sky absolute inset-0"
        style={{
          transform: `translate(${mousePos.x * -5}px, ${mousePos.y * -3}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Stars (visible in dark areas) */}
        {stars.map((star, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full"
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

        {/* Sunrise glow */}
        <div
          className="absolute bottom-[25%] left-1/2 -translate-x-1/2"
          style={{
            width: "120%",
            height: "50%",
            background: "radial-gradient(ellipse at center bottom, rgba(245,185,100,0.4) 0%, rgba(232,114,42,0.1) 40%, transparent 70%)",
          }}
        />

        {/* Sun */}
        <div
          className="absolute rounded-full"
          style={{
            width: "80px",
            height: "80px",
            bottom: "32%",
            left: "50%",
            transform: `translateX(-50%) translate(${mousePos.x * -2}px, ${mousePos.y * -1}px)`,
            background: "radial-gradient(circle, #FFD700 0%, #F5B731 40%, rgba(245,183,49,0) 70%)",
            boxShadow: "0 0 60px rgba(255,215,0,0.4), 0 0 120px rgba(245,183,49,0.2)",
          }}
        />

        {/* Sun rays */}
        <div
          className="absolute"
          style={{
            bottom: "25%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "300px",
            height: "200px",
            background: "conic-gradient(from 0deg, transparent 0deg, rgba(255,215,0,0.05) 10deg, transparent 20deg, transparent 30deg, rgba(255,215,0,0.03) 40deg, transparent 50deg)",
            filter: "blur(2px)",
          }}
        />
      </div>

      {/* ============ MOUNTAINS ============ */}
      <div
        className="hero-mountains absolute bottom-[20%] left-0 right-0"
        style={{
          transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -4}px)`,
          transition: "transform 0.4s ease-out",
        }}
      >
        <svg viewBox="0 0 1440 300" className="w-full" preserveAspectRatio="none">
          {/* Far mountains (snow-capped) */}
          <path
            d="M0,300 L0,200 Q80,80 180,180 Q250,50 350,150 Q420,20 520,130 Q580,60 680,140 Q750,30 850,120 Q930,50 1020,140 Q1100,40 1200,130 Q1280,70 1380,160 Q1420,140 1440,170 L1440,300 Z"
            fill="#2a3f5f"
            opacity="0.7"
          />
          {/* Snow caps */}
          <path
            d="M250,50 Q280,48 300,65 L250,50 Z M420,20 Q445,18 465,40 L420,20 Z M750,30 Q775,28 800,50 L750,30 Z M1100,40 Q1125,38 1150,60 L1100,40 Z"
            fill="rgba(255,255,255,0.6)"
          />
          {/* Mid mountains */}
          <path
            d="M0,300 L0,220 Q120,140 250,200 Q380,120 500,190 Q620,110 750,180 Q880,100 1000,170 Q1120,120 1250,200 Q1350,160 1440,210 L1440,300 Z"
            fill="#1a2d4a"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* ============ CLOUDS ============ */}
      <div
        className="hero-clouds absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${mousePos.x * -12}px, ${mousePos.y * -2}px)`,
          transition: "transform 0.5s ease-out",
        }}
      >
        {[
          { x: "10%", y: "15%", w: 180, h: 40, o: 0.25, d: 35 },
          { x: "30%", y: "8%", w: 220, h: 50, o: 0.2, d: 45 },
          { x: "55%", y: "12%", w: 160, h: 35, o: 0.3, d: 40 },
          { x: "75%", y: "20%", w: 200, h: 45, o: 0.15, d: 50 },
          { x: "90%", y: "10%", w: 140, h: 30, o: 0.2, d: 38 },
          { x: "-5%", y: "25%", w: 250, h: 55, o: 0.18, d: 55 },
        ].map((cloud, i) => (
          <div
            key={i}
            className="cloud absolute rounded-full"
            style={{
              left: cloud.x,
              top: cloud.y,
              width: `${cloud.w}px`,
              height: `${cloud.h}px`,
              background: `radial-gradient(ellipse, rgba(255,255,255,${cloud.o}) 0%, transparent 70%)`,
              filter: "blur(8px)",
              animation: `drift ${cloud.d}s ease-in-out infinite`,
              animationDelay: `${i * 3}s`,
            }}
          />
        ))}
      </div>

      {/* ============ BIRDS ============ */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { x: "20%", y: "18%", s: 0.6, d: 6 },
          { x: "35%", y: "12%", s: 0.8, d: 7 },
          { x: "60%", y: "22%", s: 0.5, d: 5 },
          { x: "70%", y: "15%", s: 0.7, d: 8 },
          { x: "85%", y: "20%", s: 0.4, d: 6.5 },
        ].map((bird, i) => (
          <div
            key={i}
            className="bird-group absolute"
            style={{
              left: bird.x,
              top: bird.y,
              transform: `scale(${bird.s})`,
            }}
          >
            <svg width="24" height="8" viewBox="0 0 24 8">
              <path
                d="M0,4 Q6,0 12,4 Q18,0 24,4"
                stroke="rgba(30,30,50,0.6)"
                strokeWidth="1.5"
                fill="none"
              >
                <animate
                  attributeName="d"
                  values="M0,4 Q6,0 12,4 Q18,0 24,4;M0,4 Q6,6 12,4 Q18,6 24,4;M0,4 Q6,0 12,4 Q18,0 24,4"
                  dur={`${bird.d * 0.3}s`}
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
        ))}
      </div>

      {/* ============ LANDSCAPE (Trees, platform) ============ */}
      <div
        className="hero-platform absolute bottom-0 left-0 right-0"
        style={{
          height: "35%",
          transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -6}px)`,
          transition: "transform 0.4s ease-out",
        }}
      >
        {/* Ground / grass */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "100%",
            background: "linear-gradient(180deg, #2d5a27 0%, #1e4020 30%, #1a3018 100%)",
          }}
        />

        {/* Trees */}
        {[
          { x: "5%", h: 80, d: 3 },
          { x: "12%", h: 60, d: 4 },
          { x: "22%", h: 90, d: 2.5 },
          { x: "78%", h: 75, d: 3.5 },
          { x: "85%", h: 85, d: 2.8 },
          { x: "93%", h: 65, d: 3.2 },
        ].map((tree, i) => (
          <div
            key={i}
            className="tree absolute bottom-[55%]"
            style={{ left: tree.x }}
          >
            <svg width="40" height={tree.h} viewBox={`0 0 40 ${tree.h}`}>
              {/* Trunk */}
              <rect x="17" y={tree.h * 0.5} width="6" height={tree.h * 0.5} fill="#5C4033" />
              {/* Foliage */}
              <ellipse
                cx="20"
                cy={tree.h * 0.35}
                rx="18"
                ry={tree.h * 0.38}
                fill="#2d5a27"
                opacity="0.9"
              />
              <ellipse
                cx="20"
                cy={tree.h * 0.3}
                rx="14"
                ry={tree.h * 0.3}
                fill="#3a6b33"
                opacity="0.7"
              />
            </svg>
          </div>
        ))}

        {/* Railway platform */}
        <div
          className="absolute left-0 right-0"
          style={{
            bottom: "25%",
            height: "30%",
            background: "linear-gradient(180deg, #6B7B8D 0%, #555F6A 50%, #4A5259 100%)",
            borderTop: "3px solid #8B8682",
          }}
        >
          {/* Platform edge yellow line */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: "#F5B731" }}
          />

          {/* Platform benches */}
          {[25, 65].map((pos, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: `${pos}%`, top: "40%", transform: "translateX(-50%)" }}
            >
              <div
                className="rounded-sm"
                style={{
                  width: "40px",
                  height: "12px",
                  background: "#5C4033",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              />
              <div
                className="mx-auto mt-0.5"
                style={{ width: "4px", height: "10px", background: "#4A3728" }}
              />
              <div
                className="mx-auto"
                style={{ width: "4px", height: "10px", background: "#4A3728", marginLeft: "8px", marginTop: "-10px" }}
              />
            </div>
          ))}
        </div>

        {/* Railway tracks */}
        <div
          className="absolute left-0 right-0"
          style={{ bottom: "18%", height: "20px" }}
        >
          {/* Sleepers */}
          <div className="absolute inset-0 flex items-center">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 mx-1"
                style={{
                  width: "8px",
                  height: "16px",
                  background: "linear-gradient(180deg, #5C4033, #3D2B1F)",
                  borderRadius: "1px",
                }}
              />
            ))}
          </div>
          {/* Rails */}
          <div
            className="absolute top-[3px] left-0 right-0 h-[2px]"
            style={{
              background: "linear-gradient(90deg, #8B8682, #A0998F, #8B8682)",
              boxShadow: "0 0 3px rgba(160,153,143,0.4)",
            }}
          />
          <div
            className="absolute bottom-[3px] left-0 right-0 h-[2px]"
            style={{
              background: "linear-gradient(90deg, #8B8682, #A0998F, #8B8682)",
              boxShadow: "0 0 3px rgba(160,153,143,0.4)",
            }}
          />
        </div>

        {/* Signal */}
        <div
          className="absolute"
          style={{ right: "15%", bottom: "40%" }}
        >
          <svg width="20" height="60" viewBox="0 0 20 60">
            <rect x="9" y="10" width="3" height="50" fill="#4A4A4A" />
            <rect x="3" y="0" width="15" height="20" rx="3" fill="#333" />
            <circle className="signal-light" cx="10" cy="7" r="4" fill="#FF3333">
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="10" cy="15" r="4" fill="#333" opacity="0.3" />
          </svg>
        </div>

        {/* Platform lights */}
        {[20, 40, 60, 80].map((pos, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: `${pos}%`, bottom: "55%" }}
          >
            <div
              style={{
                width: "3px",
                height: "30px",
                background: "#6B7B8D",
                margin: "0 auto",
              }}
            />
            <div
              className="platform-light-glow absolute -top-1 left-1/2 -translate-x-1/2"
              style={{
                width: "12px",
                height: "8px",
                background: "#FFD700",
                borderRadius: "50% 50% 0 0",
                boxShadow: "0 -5px 15px rgba(255,215,0,0.3)",
              }}
            />
          </div>
        ))}
      </div>

      {/* ============ LOCOMOTIVE ============ */}
      <div
        className="hero-train-anim-wrapper absolute z-10 cursor-pointer"
        style={{
          bottom: "26%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        onClick={handleTrainClick}
      >
        <div
          className="hero-train"
          data-cursor="train"
          style={{
            transform: `translate(${mousePos.x * -3}px, 0)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          <svg width="280" height="120" viewBox="0 0 280 120" className="drop-shadow-2xl">
            {/* Chimney */}
            <rect x="45" y="15" width="20" height="30" rx="3" fill="#3D2B1F" />
            <rect x="40" y="8" width="30" height="10" rx="2" fill="#4A3728" />

            {/* Boiler */}
            <rect x="20" y="45" width="140" height="45" rx="8" fill="#C45E2C" />
            <rect x="20" y="45" width="140" height="15" rx="4" fill="#E8722A" opacity="0.5" />

            {/* Boiler bands */}
            <rect x="50" y="45" width="4" height="45" fill="#A04A20" opacity="0.5" />
            <rect x="90" y="45" width="4" height="45" fill="#A04A20" opacity="0.5" />
            <rect x="130" y="45" width="4" height="45" fill="#A04A20" opacity="0.5" />

            {/* Cabin */}
            <rect x="160" y="30" width="70" height="60" rx="4" fill="#8B4513" />
            <rect x="160" y="30" width="70" height="8" rx="2" fill="#A0592A" />
            <rect x="168" y="42" width="25" height="18" rx="2" fill="#87CEEB" opacity="0.3" />
            <rect x="198" y="42" width="25" height="18" rx="2" fill="#87CEEB" opacity="0.3" />

            {/* Window glow */}
            <rect x="170" y="44" width="21" height="14" rx="1" fill="#FFD700" opacity="0.3">
              <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
            </rect>
            <rect x="200" y="44" width="21" height="14" rx="1" fill="#FFD700" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0.5;0.3" dur="3s" repeatCount="indefinite" />
            </rect>

            {/* Roof */}
            <path d="M155,30 Q195,18 235,30" fill="#6B3A1F" />

            {/* Cowcatcher */}
            <polygon points="5,90 20,65 20,90" fill="#6B7B8D" />
            <line x1="5" y1="90" x2="20" y2="72" stroke="#888" strokeWidth="2" />
            <line x1="10" y1="90" x2="20" y2="78" stroke="#888" strokeWidth="2" />

            {/* Headlight */}
            <circle cx="18" cy="60" r="8" fill="#FFD700" opacity="0.9">
              <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="18" cy="60" r="5" fill="#FFF" opacity="0.5" />

            {/* Name plate */}
            <rect x="55" y="65" width="90" height="16" rx="2" fill="#1A1A2E" />
            <text x="100" y="77" textAnchor="middle" fill="#F5B731" fontSize="8" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
              DEVELOPER EXPRESS
            </text>

            {/* Wheels */}
            <g>
              <circle cx="50" cy="98" r="14" fill="#222" stroke="#555" strokeWidth="2">
                <animateTransform attributeName="transform" type="rotate" from="0 50 98" to="360 50 98" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="50" cy="98" r="4" fill="#888" />
              <line x1="50" y1="84" x2="50" y2="112" stroke="#555" strokeWidth="1.5">
                <animateTransform attributeName="transform" type="rotate" from="0 50 98" to="360 50 98" dur="3s" repeatCount="indefinite" />
              </line>
            </g>
            <g>
              <circle cx="100" cy="98" r="14" fill="#222" stroke="#555" strokeWidth="2">
                <animateTransform attributeName="transform" type="rotate" from="0 100 98" to="360 100 98" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="100" cy="98" r="4" fill="#888" />
              <line x1="100" y1="84" x2="100" y2="112" stroke="#555" strokeWidth="1.5">
                <animateTransform attributeName="transform" type="rotate" from="0 100 98" to="360 100 98" dur="3s" repeatCount="indefinite" />
              </line>
            </g>
            <g>
              <circle cx="145" cy="98" r="12" fill="#222" stroke="#555" strokeWidth="2">
                <animateTransform attributeName="transform" type="rotate" from="0 145 98" to="360 145 98" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="145" cy="98" r="3" fill="#888" />
            </g>
            <g>
              <circle cx="190" cy="98" r="10" fill="#222" stroke="#555" strokeWidth="2">
                <animateTransform attributeName="transform" type="rotate" from="0 190 98" to="360 190 98" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="190" cy="98" r="3" fill="#888" />
            </g>

            {/* Connecting rods */}
            <line x1="50" y1="98" x2="100" y2="98" stroke="#777" strokeWidth="3">
              <animate attributeName="y1" values="96;100;96" dur="0.8s" repeatCount="indefinite" />
              <animate attributeName="y2" values="100;96;100" dur="0.8s" repeatCount="indefinite" />
            </line>

            {/* Steam valve */}
            <rect x="35" y="42" width="6" height="6" rx="1" fill="#888" />

            {/* Bell */}
            <circle cx="70" cy="40" r="5" fill="#D4A843" />
            <rect x="69" y="34" width="3" height="6" fill="#B08930" />
          </svg>
        </div>
      </div>

      {/* Steam canvas overlay */}
      <canvas
        ref={steamCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      {/* ============ ATMOSPHERIC PARTICLES ============ */}
      <div className="absolute inset-0 pointer-events-none z-15">
        {dust.map((particle, i) => (
          <div
            key={`dust-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${particle.width}px`,
              height: `${particle.height}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              background: "rgba(245,185,100,0.3)",
              animation: `drift ${particle.animationDuration}s ease-in-out infinite`,
              animationDelay: `${particle.animationDelay}s`,
            }}
          />
        ))}
      </div>

      {/* ============ STATION CLOCK ============ */}
      <div
        className="absolute top-24 right-8 md:right-16 z-30"
        style={{
          transform: `translate(${mousePos.x * -5}px, ${mousePos.y * -2}px)`,
        }}
      >
        <div
          className="glass rounded-xl px-4 py-2 text-center"
        >
          <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
            Station Time
          </div>
          <div
            className="font-mono text-xl md:text-2xl font-bold tabular-nums"
            style={{
              color: "var(--golden-yellow)",
              textShadow: "0 0 10px rgba(245,183,49,0.3)",
            }}
          >
            {formatTime(currentTime)}
          </div>
        </div>
      </div>

      {/* ============ HERO CONTENT ============ */}
      <div className="hero-content absolute inset-0 flex flex-col items-center justify-center z-30 text-center px-4 pt-16 pointer-events-none">
        {/* Text Group - translated upward to prevent overlap with train */}
        <div className="transform -translate-y-12 flex flex-col items-center">
          <div className="mb-4">
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--text-primary)",
                textShadow: "0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(232,114,42,0.2)",
                lineHeight: 1,
              }}
            >
              DEVELOPER
              <br />
              <span style={{ color: "var(--accent)" }}>EXPRESS</span>
            </h1>
          </div>

          {/* Typewriter subtitle */}
          <div
            className="h-8 md:h-10 flex items-center justify-center"
          >
            <span
              className="font-mono text-base md:text-xl tracking-[0.15em] uppercase"
              style={{
                color: "var(--golden-yellow)",
                textShadow: "0 0 10px rgba(245,183,49,0.3)",
                borderRight: "2px solid var(--accent)",
                paddingRight: "4px",
                animation: "typewriter-cursor 1s step-end infinite",
              }}
            >
              {displayText}
            </span>
          </div>
        </div>



        {/* CTA Button */}
        <div className="hero-cta mt-16 md:mt-24">
          <button
            onClick={() => {
              const el = document.getElementById("boarding");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative px-8 py-4 md:px-12 md:py-5 rounded-2xl text-lg md:text-xl font-bold uppercase tracking-wider transition-all duration-500 pointer-events-auto"
            style={{
              background: "linear-gradient(135deg, #E8722A 0%, #C45E2C 100%)",
              color: "#FFF",
              boxShadow: "0 0 30px rgba(232,114,42,0.3), 0 4px 15px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.05,
                boxShadow: "0 0 50px rgba(232,114,42,0.5), 0 8px 25px rgba(0,0,0,0.4)",
                duration: 0.3,
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                boxShadow: "0 0 30px rgba(232,114,42,0.3), 0 4px 15px rgba(0,0,0,0.3)",
                duration: 0.3,
              });
            }}
            data-cursor="pointer"
          >
            {/* Glow effect */}
            <span
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "radial-gradient(ellipse at center, rgba(245,183,49,0.2) 0%, transparent 70%)",
              }}
            />
            <span className="relative z-10 flex items-center gap-3">
               BOARD THE JOURNEY
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
            {/* Pulse animation */}
            <span
              className="absolute inset-0 rounded-2xl"
              style={{
                animation: "pulse-glow 3s ease-in-out infinite",
              }}
            />
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Scroll to explore
          </span>
          <div
            className="w-5 h-8 rounded-full border-2 flex items-start justify-center p-1"
            style={{ borderColor: "var(--text-muted)" }}
          >
            <div
              className="w-1 h-2 rounded-full"
              style={{
                background: "var(--text-muted)",
                animation: "float 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* Fog overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[20%] pointer-events-none z-25"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(12,14,26,0.3) 60%, rgba(12,14,26,0.8) 100%)",
        }}
      />
    </section>
  );
}
