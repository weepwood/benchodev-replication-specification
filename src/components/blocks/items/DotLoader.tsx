"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const MODES = ["Wave", "Orbit", "Cross"];

export default function DotLoader({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#ff3b6b";
  const speed = tweaks?.speed ?? 1;
  const [mode, setMode] = useState(0);

  const getDelay = (idx: number) => {
    const r = Math.floor(idx / 3);
    const c = idx % 3;
    if (mode === 0) return (r + c) * 0.12;
    if (mode === 1) {
      const order = [0, 1, 2, 5, 8, 7, 6, 3, 4];
      return order.indexOf(idx) * 0.09;
    }
    return r === 1 || c === 1 ? 0 : 0.35;
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        playUISound("micro-detent");
        setMode((m) => (m + 1) % MODES.length);
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 14px)",
          gap: 8,
          padding: 16,
          borderRadius: 14,
          background: "var(--board)",
          border: "1px solid var(--rule)",
        }}
      >
        {Array.from({ length: 9 }).map((_, idx) => (
          <motion.span
            key={`${mode}-${idx}`}
            animate={{
              scale: [0.55, 1.18, 0.55],
              opacity: [0.25, 1, 0.25],
            }}
            transition={{
              duration: 1.05 / speed,
              delay: getDelay(idx) / speed,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: accent,
              display: "block",
            }}
          />
        ))}
      </div>

      <span className="bnc-mono" style={{ fontSize: 10.5, color: "var(--ink-4)" }}>
        {MODES[mode]} · click to switch
      </span>
    </div>
  );
}
