"use client";

import { useCallback, useEffect, useRef } from "react";
import { hexToRgba } from "@/lib/theme";

interface Dot {
  rx: number;
  ry: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
}

export function ParticleField({ className, accent }: { className?: string; accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number>(0);

  const buildGrid = useCallback((width: number, height: number) => {
    const cols = Math.floor(width / 36);
    const rows = Math.floor(height / 36);
    const dots: Dot[] = [];

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const rx = (col + 0.5) / cols;
        const ry = (row + 0.5) / rows;
        dots.push({
          rx,
          ry,
          x: rx * width,
          y: ry * height,
          vx: 0,
          vy: 0,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    return dots;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      dotsRef.current = buildGrid(width, height);
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    let t = 0;
    const repelRadius = 90;
    const spring = 0.04;
    const damp = 0.82;
    const breath = 1.2;

    const tick = () => {
      t += 0.012;
      ctx.clearRect(0, 0, width, height);

      for (const dot of dotsRef.current) {
        const restX = dot.rx * width;
        const restY = dot.ry * height;
        const breathX = Math.sin(t + dot.phase) * breath;
        const breathY = Math.cos(t * 0.7 + dot.phase) * breath;
        const dx = dot.x - mouseRef.current.x;
        const dy = dot.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const repel = distance < repelRadius ? (repelRadius - distance) / repelRadius : 0;
        const forceX = (dx / distance) * repel * 22;
        const forceY = (dy / distance) * repel * 22;
        const springX = (restX + breathX - dot.x) * spring;
        const springY = (restY + breathY - dot.y) * spring;

        dot.vx = (dot.vx + springX + forceX) * damp;
        dot.vy = (dot.vy + springY + forceY) * damp;
        dot.x += dot.vx;
        dot.y += dot.vy;

        const proximity = Math.max(0, 1 - distance / 140);
        const alpha = 0.12 + proximity * 0.55;
        const size = 1.8 + proximity * 2.4;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(accent, alpha);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [accent, buildGrid]);

  return <canvas ref={canvasRef} className={className} style={{ display: "block", width: "100%", height: "100%" }} />;
}
