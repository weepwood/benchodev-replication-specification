"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
}

const PALETTE = ["#0d99ff", "#ff3b6b", "#1f9d55", "#9d7bf5", "#e09a12"];

export default function InkBloom({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#0d99ff";
  const stiffness = tweaks?.stiffness ?? 380;
  const damping = tweaks?.damping ?? 26;

  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [count, setCount] = useState(12);
  const [inkFill, setInkFill] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const color = count % 3 === 0 ? accent : PALETTE[count % PALETTE.length];
    const id = Date.now() + Math.random();
    playUISound("warm-tact");
    setCount((c) => c + 1);
    setInkFill((v) => !v);
    setRipples((prev) => [...prev.slice(-4), { id, x, y, color }]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <motion.button
        type="button"
        onPointerDown={handlePointerDown}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness, damping }}
        style={{
          position: "relative",
          overflow: "hidden",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "13px 22px",
          borderRadius: 999,
          border: "1px solid var(--rule-strong)",
          background: inkFill ? "var(--solid)" : "var(--board)",
          color: inkFill ? "var(--solid-ink)" : "var(--ink)",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 8px 24px -10px rgba(0,0,0,0.18)",
        }}
      >
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.span
              key={r.id}
              initial={{ scale: 0, opacity: 0.65 }}
              animate={{ scale: 4.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.68 / (tweaks?.speed ?? 1), ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() =>
                setRipples((prev) => prev.filter((item) => item.id !== r.id))
              }
              style={{
                position: "absolute",
                left: r.x - 28,
                top: r.y - 28,
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: r.color,
                pointerEvents: "none",
              }}
            />
          ))}
        </AnimatePresence>

        <Sparkles size={15} style={{ position: "relative", zIndex: 2, color: accent }} />
        <span style={{ position: "relative", zIndex: 2 }}>Press to bloom</span>
        <motion.span
          key={count}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 24 }}
          className="bnc-mono"
          style={{
            position: "relative",
            zIndex: 2,
            fontSize: 11.5,
            padding: "2px 8px",
            borderRadius: 999,
            background: accent,
            color: "#fff",
          }}
        >
          {count}
        </motion.span>
      </motion.button>
      <span style={{ fontSize: 11, color: "var(--ink-4)" }} className="bnc-mono">
        pointer(x,y) pigment wave
      </span>
    </div>
  );
}
