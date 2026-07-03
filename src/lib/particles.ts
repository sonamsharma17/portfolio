// Lightweight Canvas Particle System for Developer Express
// Supports: steam, dust, pollen, sparks, gold particles

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
  decay: number;
}

export interface ParticleConfig {
  count: number;
  color: string | string[];
  minSize: number;
  maxSize: number;
  minSpeed: number;
  maxSpeed: number;
  direction: "up" | "down" | "left" | "right" | "random";
  spread: number;
  gravity: number;
  decay: number;
  opacity: number;
  spawnArea: { x: number; y: number; width: number; height: number };
}

export const PARTICLE_PRESETS: Record<string, Partial<ParticleConfig>> = {
  steam: {
    color: ["rgba(200,200,200,0.6)", "rgba(180,180,180,0.4)", "rgba(220,220,220,0.3)"],
    minSize: 3,
    maxSize: 12,
    minSpeed: 0.3,
    maxSpeed: 1.2,
    direction: "up",
    spread: 0.8,
    gravity: -0.02,
    decay: 0.005,
    opacity: 0.5,
  },
  dust: {
    color: ["rgba(200,180,150,0.3)", "rgba(180,160,130,0.2)"],
    minSize: 1,
    maxSize: 3,
    minSpeed: 0.1,
    maxSpeed: 0.5,
    direction: "random",
    spread: 2,
    gravity: 0.001,
    decay: 0.002,
    opacity: 0.3,
  },
  pollen: {
    color: ["rgba(255,220,100,0.4)", "rgba(255,200,80,0.3)"],
    minSize: 2,
    maxSize: 4,
    minSpeed: 0.05,
    maxSpeed: 0.3,
    direction: "random",
    spread: 3,
    gravity: -0.005,
    decay: 0.001,
    opacity: 0.4,
  },
  sparks: {
    color: ["rgba(255,150,50,0.8)", "rgba(255,200,50,0.6)", "rgba(255,100,30,0.7)"],
    minSize: 1,
    maxSize: 3,
    minSpeed: 1,
    maxSpeed: 4,
    direction: "up",
    spread: 1.5,
    gravity: 0.05,
    decay: 0.02,
    opacity: 0.9,
  },
  gold: {
    color: ["rgba(212,168,67,0.6)", "rgba(255,215,0,0.4)", "rgba(218,165,32,0.5)"],
    minSize: 1,
    maxSize: 3,
    minSpeed: 0.2,
    maxSpeed: 0.8,
    direction: "up",
    spread: 1,
    gravity: -0.01,
    decay: 0.008,
    opacity: 0.6,
  },
};

export class ParticleSystem {
  private particles: Particle[] = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: ParticleConfig;
  private animationId: number | null = null;
  private isRunning = false;

  constructor(canvas: HTMLCanvasElement, config: ParticleConfig) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.config = config;
    this.resize();
  }

  resize() {
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      this.canvas.width = rect.width * window.devicePixelRatio;
      this.canvas.height = rect.height * window.devicePixelRatio;
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }

  private createParticle(): Particle {
    const { minSize, maxSize, minSpeed, maxSpeed, direction, spread, decay, opacity, spawnArea } =
      this.config;
    const colors = Array.isArray(this.config.color) ? this.config.color : [this.config.color];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = minSize + Math.random() * (maxSize - minSize);
    const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);

    let vx = 0;
    let vy = 0;

    switch (direction) {
      case "up":
        vx = (Math.random() - 0.5) * spread;
        vy = -speed;
        break;
      case "down":
        vx = (Math.random() - 0.5) * spread;
        vy = speed;
        break;
      case "left":
        vx = -speed;
        vy = (Math.random() - 0.5) * spread;
        break;
      case "right":
        vx = speed;
        vy = (Math.random() - 0.5) * spread;
        break;
      case "random":
        vx = (Math.random() - 0.5) * speed * 2;
        vy = (Math.random() - 0.5) * speed * 2;
        break;
    }

    const maxLife = 60 + Math.random() * 120;

    return {
      x: spawnArea.x + Math.random() * spawnArea.width,
      y: spawnArea.y + Math.random() * spawnArea.height,
      vx,
      vy,
      size,
      opacity: opacity * (0.5 + Math.random() * 0.5),
      life: 0,
      maxLife,
      color,
      decay: decay * (0.8 + Math.random() * 0.4),
    };
  }

  private update() {
    const { gravity } = this.config;

    // Spawn new particles
    const spawnRate = Math.max(1, Math.floor(this.config.count / 60));
    if (this.particles.length < this.config.count) {
      for (let i = 0; i < spawnRate; i++) {
        this.particles.push(this.createParticle());
      }
    }

    // Update existing particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += gravity;
      p.life++;
      p.opacity -= p.decay;
      p.size *= 1.002; // Slowly grow

      if (p.opacity <= 0 || p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  private draw() {
    const w = this.canvas.width / window.devicePixelRatio;
    const h = this.canvas.height / window.devicePixelRatio;
    this.ctx.clearRect(0, 0, w, h);

    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${Math.max(0, p.opacity)})`);
      this.ctx.fill();
    }
  }

  private loop = () => {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  };

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy() {
    this.stop();
    this.particles = [];
  }

  updateConfig(config: Partial<ParticleConfig>) {
    Object.assign(this.config, config);
  }
}
