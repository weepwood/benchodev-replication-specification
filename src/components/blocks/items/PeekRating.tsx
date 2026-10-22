"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const LABELS = ["Rough", "Fair", "Solid", "Crisp", "Sublime"];
const FACES = ["·_·", "¬_¬", "°_°", "^_^", "★‿★"];

export default function PeekRating({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#e09a12";
  const stiffness = tweaks?.stiffness ?? 420;
  const damping = tweaks?.damping ?? 22;

  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number>(4);

  const active = hovered ?? selected;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        animate={{ y: hovered !== null ? -2 : 0 }}
        transition={{ type: "spring", stiffness, damping }}
        className="bnc-mono"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 10px",
          borderRadius: 999,
          background: "var(--board)",
          border: "1px solid var(--rule)",
          fontSize: 11.5,
          color: "var(--ink-2)",
        }}
      >
        <span style={{ color: accent, fontWeight: 700 }}>{FACES[active - 1]}</span>
        <span>{LABELS[active - 1]}</span>
        <span style={{ color: "var(--ink-4)" }}>{active}.0</span>
      </motion.div>

      <div
        onMouseLeave={() => setHovered(null)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          borderRadius: 14,
          background: "var(--board)",
          border: "1px solid var(--rule)",
          boxShadow: "0 6px 20px -10px rgba(0,0,0,0.12)",
        }}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const dist = hovered !== null ? Math.abs(hovered - star) : 99;
          const lift = dist === 0 ? -7 : dist === 1 ? -3 : 0;
          const scale = dist === 0 ? 1.24 : dist === 1 ? 1.08 : 1;
          const filled = star <= active;

          return (
            <motion.button
              key={star}
              type="button"
              aria-label={`Rate ${star} stars`}
              onMouseEnter={() => {
                setHovered(star);
                playUISound("vernier-tick", { pitch: 0.85 + star * 0.1, volume: 0.2 });
              }}
              onClick={() => {
                setSelected(star);
                playUISound("spring-pop", { pitch: 0.9 + star * 0.08 });
              }}
              animate={{ y: lift, scale, rotate: dist === 0 ? (star % 2 === 0 ? 6 : -6) : 0 }}
              transition={{ type: "spring", stiffness, damping }}
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                border: "none",
                background: filled ? `${accent}18` : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <Star
                size={18}
                fill={filled ? accent : "transparent"}
                color={filled ? accent : "var(--ink-4)"}
                strokeWidth={1.9}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
