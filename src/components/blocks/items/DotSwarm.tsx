"use client";

import React, { useEffect, useRef } from "react";
import type { LiveBlockProps } from "../types";

export default function DotSwarm({ tweaks }: LiveBlockProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -999,
    y: -999,
    active: false,
  });

  const accent = tweaks?.accent ?? "#0d99ff";
  const speed = tweaks?.speed ?? 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cols = 14;
    const rows = 9;
    const w = 240;
    const h = 160;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const dots: Array<{
      hx: number;
      hy: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
    }> = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const hx = 18 + (c / (cols - 1)) * (w - 36);
        const hy = 18 + (r / (rows - 1)) * (h - 36);
        dots.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0 });
      }
    }

    let raf = 0;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        (document.documentElement.getAttribute("data-theme") !== "light" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      const baseColor = isDark ? "rgba(243,242,238,0.34)" : "rgba(23,24,26,0.32)";
      const p = pointerRef.current;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        let fx = (d.hx - d.x) * 0.12 * speed;
        let fy = (d.hy - d.y) * 0.12 * speed;

        let near = 0;
        if (p.active) {
          const dx = d.x - p.x;
          const dy = d.y - p.y;
          const distSq = dx * dx + dy * dy;
          const radius = 64;
          if (distSq < radius * radius && distSq > 0.1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / radius) * 3.6;
            // Radial push + subtle tangential swirl
            fx += (dx / dist) * force - (dy / dist) * force * 0.35;
            fy += (dy / dist) * force + (dx / dist) * force * 0.35;
            near = 1 - dist / radius;
          }
        }

        d.vx = (d.vx + fx) * 0.78;
        d.vy = (d.vy + fy) * 0.78;
        d.x += d.vx;
        d.y += d.vy;

        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.8 + near * 2.1, 0, Math.PI * 2);
        ctx.fillStyle = near > 0.12 ? accent : baseColor;
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [accent, speed]);

  return (
    <canvas
      ref={canvasRef}
      onClick={(e) => e.stopPropagation()}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        pointerRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        };
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false;
      }}
      style={{
        width: 240,
        height: 160,
        borderRadius: 12,
        cursor: "crosshair",
        touchAction: "none",
      }}
    />
  );
}
