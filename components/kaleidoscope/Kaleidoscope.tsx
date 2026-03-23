"use client";

import { useRef, useEffect, useCallback } from "react";

interface KaleidoscopeProps {
  className?: string;
  /** Trigger a brief "crystallise" reaction */
  pulse?: number;
}

// Jewel-tone palette from design brief
const COLORS = [
  "#9B1B30", // crimson
  "#C62B45", // crimson light
  "#D4820A", // amber
  "#F0A030", // amber light
  "#1A7A7A", // teal
  "#2AA0A0", // teal light
  "#5B2D8E", // violet
  "#7B45B5", // violet light
];

const SEGMENTS = 8; // 8-fold radial symmetry
const PARTICLE_COUNT = 45;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotVel: number;
  size: number;
  alpha: number;
  colour: string;
  shape: number; // 0=triangle, 1=diamond, 2=hexagon, 3=shard
  life: number;
  age: number;
}

export default function Kaleidoscope({ className, pulse }: KaleidoscopeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef(0);
  const lightAngleRef = useRef(0);
  const pulseRef = useRef(0);
  const lastPulseRef = useRef(0);

  // React to pulse prop changes
  useEffect(() => {
    if (pulse && pulse !== lastPulseRef.current) {
      pulseRef.current = 1;
      lastPulseRef.current = pulse;
    }
  }, [pulse]);

  const spawnParticle = useCallback((size: number): Particle => {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 4;
    const r = Math.random() * radius * 0.85;
    const a = Math.random() * Math.PI * 2;

    return {
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotVel: (Math.random() - 0.5) * 0.008,
      size: Math.random() * 18 + 6,
      alpha: Math.random() * 0.4 + 0.12,
      colour: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.floor(Math.random() * 4),
      life: Math.random() * 350 + 150,
      age: 0,
    };
  }, []);

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.strokeStyle = p.colour;
    ctx.fillStyle = p.colour;
    ctx.lineWidth = 1.2;

    // Specular highlight on edges
    ctx.shadowColor = p.colour;
    ctx.shadowBlur = 6;

    const s = p.size;
    ctx.beginPath();

    switch (p.shape) {
      case 0: // Triangle (frosted glass shard)
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.75, s * 0.6);
        ctx.lineTo(-s * 0.75, s * 0.6);
        ctx.closePath();
        ctx.globalAlpha = p.alpha * 0.3;
        ctx.fill();
        ctx.globalAlpha = p.alpha * 0.8;
        ctx.stroke();
        break;

      case 1: // Diamond
        ctx.moveTo(0, -s * 0.9);
        ctx.lineTo(s * 0.5, 0);
        ctx.lineTo(0, s * 0.9);
        ctx.lineTo(-s * 0.5, 0);
        ctx.closePath();
        ctx.globalAlpha = p.alpha * 0.25;
        ctx.fill();
        ctx.globalAlpha = p.alpha * 0.7;
        ctx.stroke();
        break;

      case 2: // Hexagon
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const px = Math.cos(angle) * s;
          const py = Math.sin(angle) * s;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.globalAlpha = p.alpha * 0.2;
        ctx.fill();
        ctx.globalAlpha = p.alpha * 0.6;
        ctx.stroke();
        break;

      case 3: // Elongated shard
        ctx.moveTo(-s * 0.15, -s);
        ctx.lineTo(s * 0.15, -s * 0.8);
        ctx.lineTo(s * 0.1, s * 0.9);
        ctx.lineTo(-s * 0.1, s);
        ctx.closePath();
        ctx.globalAlpha = p.alpha * 0.35;
        ctx.fill();
        ctx.globalAlpha = p.alpha * 0.9;
        ctx.stroke();
        // Specular edge highlight
        ctx.beginPath();
        ctx.moveTo(s * 0.15, -s * 0.8);
        ctx.lineTo(s * 0.1, s * 0.9);
        ctx.strokeStyle = "rgba(255, 248, 220, 0.3)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
        break;
    }

    ctx.restore();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Detect reduced motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function setup() {
      const parent = canvas!.parentElement;
      if (!parent) return;

      const dim = Math.min(parent.clientWidth, parent.clientHeight);
      sizeRef.current = dim;
      canvas!.width = dim;
      canvas!.height = dim;

      // Offscreen canvas for source scene
      const off = document.createElement("canvas");
      off.width = dim;
      off.height = dim;
      offCanvasRef.current = off;

      // Initialize particles
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
        spawnParticle(dim)
      );
    }

    function drawScene() {
      const off = offCanvasRef.current;
      if (!off) return;
      const offCtx = off.getContext("2d");
      if (!offCtx) return;

      const size = sizeRef.current;
      const cx = size / 2;
      const cy = size / 2;
      const radius = size / 2;

      // Background
      offCtx.fillStyle = "#0D0B10";
      offCtx.fillRect(0, 0, size, size);

      // Warm light source — slowly orbiting
      lightAngleRef.current += 0.003;
      const lightX = cx + Math.cos(lightAngleRef.current) * radius * 0.3;
      const lightY = cy + Math.sin(lightAngleRef.current * 0.7) * radius * 0.3;

      const g = offCtx.createRadialGradient(
        lightX, lightY, 0,
        lightX, lightY, radius * 0.8
      );
      g.addColorStop(0, "rgba(212, 130, 10, 0.15)");
      g.addColorStop(0.4, "rgba(155, 27, 48, 0.08)");
      g.addColorStop(0.7, "rgba(91, 45, 142, 0.04)");
      g.addColorStop(1, "rgba(13, 11, 16, 0)");
      offCtx.fillStyle = g;
      offCtx.fillRect(0, 0, size, size);

      // Update and draw particles
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotVel;
        p.age++;

        if (p.age > p.life || p.x < 0 || p.x > size || p.y < 0 || p.y > size) {
          Object.assign(p, spawnParticle(size));
        }

        drawParticle(offCtx, p);
      }
    }

    function drawKaleido() {
      const size = sizeRef.current;
      const cx = size / 2;
      const cy = size / 2;
      const radius = size / 2;
      const off = offCanvasRef.current;
      if (!off || !ctx) return;

      ctx.clearRect(0, 0, size, size);

      const angle = (Math.PI * 2) / SEGMENTS;

      // Circular clip
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = "#0D0B10";
      ctx.fill();

      // Pulse effect — brief brightness boost
      if (pulseRef.current > 0) {
        pulseRef.current = Math.max(0, pulseRef.current - 0.015);
      }

      for (let i = 0; i < SEGMENTS; i++) {
        ctx.save();
        ctx.translate(cx, cy);

        // Clip to wedge
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, i * angle, (i + 1) * angle);
        ctx.closePath();
        ctx.clip();

        // Alternate: mirror odd segments
        if (i % 2 === 0) {
          ctx.rotate(i * angle);
        } else {
          ctx.rotate((i + 1) * angle);
          ctx.scale(1, -1);
        }

        ctx.translate(-cx, -cy);
        ctx.drawImage(off, 0, 0);
        ctx.restore();
      }

      // Pulse glow overlay
      if (pulseRef.current > 0) {
        const pg = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        pg.addColorStop(0, `rgba(212, 130, 10, ${pulseRef.current * 0.2})`);
        pg.addColorStop(0.5, `rgba(155, 27, 48, ${pulseRef.current * 0.1})`);
        pg.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = pg;
        ctx.fill();
      }

      // Vignette — fade edges
      const vg = ctx.createRadialGradient(cx, cy, radius * 0.6, cx, cy, radius);
      vg.addColorStop(0, "rgba(13, 11, 16, 0)");
      vg.addColorStop(1, "rgba(13, 11, 16, 0.6)");
      ctx.fillStyle = vg;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function loop() {
      drawScene();
      drawKaleido();
      rafRef.current = requestAnimationFrame(loop);
    }

    setup();

    if (prefersReduced) {
      drawScene();
      drawKaleido();
    } else {
      loop();
    }

    // Handle resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(rafRef.current);
        setup();
        if (!prefersReduced) loop();
        else {
          drawScene();
          drawKaleido();
        }
      }, 200);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [spawnParticle, drawParticle]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ borderRadius: "50%" }}
    />
  );
}
