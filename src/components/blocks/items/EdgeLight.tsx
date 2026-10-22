"use client";

import React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Cpu } from "lucide-react";
import type { LiveBlockProps } from "../types";

export default function EdgeLight({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#4c8dff";
  const mx = useMotionValue(105);
  const my = useMotionValue(60);

  const rimBg = useMotionTemplate`radial-gradient(120px circle at ${mx}px ${my}px, ${accent}, transparent 75%)`;
  const surfaceGlow = useMotionTemplate`radial-gradient(140px circle at ${mx}px ${my}px, ${accent}24, transparent 80%)`;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - rect.left);
        my.set(e.clientY - rect.top);
      }}
      style={{
        position: "relative",
        width: 214,
        height: 124,
        borderRadius: 16,
        padding: 1.5,
        background: "var(--rule)",
        overflow: "hidden",
        cursor: "crosshair",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: rimBg,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 14.5,
          background: "var(--board)",
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: surfaceGlow,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Cpu size={16} style={{ color: accent }} />
          <span className="bnc-mono" style={{ fontSize: 10.5, color: "var(--ink-4)" }}>
            SPECULAR 0.75
          </span>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 13.5, fontWeight: 650, color: "var(--ink)" }}>
            Machined Rim
          </div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
            Sweep pointer along edges
          </div>
        </div>
      </div>
    </div>
  );
}
