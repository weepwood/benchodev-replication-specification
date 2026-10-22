"use client";

import React, { useEffect, useRef } from "react";
import type { LiveBlockProps } from "../types";

export default function LineSphere({ tweaks }: LiveBlockProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotRef = useRef({ rx: 0.35, ry: 0.4, tx: 0.35, ty: 0.4, autoSpin: true });
  const accent = tweaks?.accent ?? "#0d99ff";
  const speed = tweaks?.speed ?? 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 160;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let raf = 0;
    const R = 58;
    const cx = size / 2;
    const cy = size / 2;

    const project = (x: number, y: number, z: number, rx: number, ry: number) => {
      // Rotate Y
      const x1 = x * Math.cos(ry) - z * Math.sin(ry);
      const z1 = x * Math.sin(ry) + z * Math.cos(ry);
      // Rotate X
      const y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
      const z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
      return { px: cx + x1, py: cy + y2, z: z2 };
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const st = rotRef.current;
      if (st.autoSpin) {
        st.ty += 0.009 * speed;
      }
      st.rx += (st.tx - st.rx) * 0.1;
      st.ry += (st.ty - st.ry) * 0.1;

      ctx.lineWidth = 1.15;

      // Meridians
      for (let m = 0; m < 6; m++) {
        const phi = (m / 6) * Math.PI;
        ctx.beginPath();
        for (let s = 0; s <= 40; s++) {
          const t = (s / 40) * Math.PI * 2;
          const x = R * Math.sin(t) * Math.cos(phi);
          const y = R * Math.cos(t);
          const z = R * Math.sin(t) * Math.sin(phi);
          const p = project(x, y, z, st.rx, st.ry);
          if (s === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.strokeStyle = m === 0 ? accent : `${accent}55`;
        ctx.stroke();
      }

      // Parallels
      for (let pIdx = -2; pIdx <= 2; pIdx++) {
        const lat = (pIdx / 3) * (Math.PI / 2);
        const rLat = R * Math.cos(lat);
        const y = R * Math.sin(lat);
        ctx.beginPath();
        for (let s = 0; s <= 40; s++) {
          const t = (s / 40) * Math.PI * 2;
          const p = project(rLat * Math.cos(t), y, rLat * Math.sin(t), st.rx, st.ry);
          if (s === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.strokeStyle = pIdx === 0 ? "#ff3b6b99" : `${accent}44`;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [accent, speed]);

  return (
    <canvas
      ref={canvasRef}
      onClick={(e) => e.stopPropagation()}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        rotRef.current.autoSpin = false;
        rotRef.current.ty = nx * 3.2;
        rotRef.current.tx = -ny * 2.4;
      }}
      onPointerLeave={() => {
        rotRef.current.autoSpin = true;
      }}
      style={{ width: 160, height: 160, cursor: "grab", touchAction: "none" }}
    />
  );
}
