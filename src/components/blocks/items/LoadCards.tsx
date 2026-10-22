"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const SPECIMENS = [
  { id: 0, title: "01 · Paper", badge: "#dcd9cf" },
  { id: 1, title: "02 · Pick", badge: "#0d99ff" },
  { id: 2, title: "03 · Guide", badge: "#ff3b6b" },
];

export default function LoadCards({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#1f9d55";
  const stiffness = tweaks?.stiffness ?? 360;
  const damping = tweaks?.damping ?? 23;
  // mode 0 = stacked, 1 = fanned arc, 2 = horizontal spread
  const [mode, setMode] = useState<number>(1);

  const cycleMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    playUISound("paper-flick");
    setMode((m) => (m + 1) % 3);
  };

  return (
    <div
      onClick={cycleMode}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 224,
          height: 108,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {SPECIMENS.map((card, i) => {
          const offset = i - 1;
          const x = mode === 0 ? 0 : mode === 1 ? offset * 38 : offset * 66;
          const y = mode === 0 ? i * 5 : mode === 1 ? Math.abs(offset) * 8 : 0;
          const rotate = mode === 0 ? offset * 2 : mode === 1 ? offset * 13 : 0;

          return (
            <motion.div
              key={card.id}
              animate={{ x, y, rotate, scale: mode === 0 ? 1 - i * 0.04 : 1 }}
              transition={{
                type: "spring",
                stiffness,
                damping,
                delay: i * 0.03,
              }}
              style={{
                position: "absolute",
                width: 84,
                height: 92,
                borderRadius: 12,
                padding: 9,
                background: "var(--board)",
                border: "1px solid var(--rule-strong)",
                boxShadow: "0 8px 20px -10px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                zIndex: 10 - i,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 6,
                  background: i === 1 ? accent : card.badge,
                }}
              />
              <span style={{ fontSize: 10.5, fontWeight: 650, color: "var(--ink)" }}>
                {card.title}
              </span>
            </motion.div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={cycleMode}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 11px",
          borderRadius: 999,
          border: "1px solid var(--rule-strong)",
          background: "var(--board)",
          color: "var(--ink-2)",
          fontSize: 11.5,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <Layers size={12} style={{ color: accent }} />
        {mode === 0 ? "Deal hand" : mode === 1 ? "Spread row" : "Stack deck"}
      </button>
    </div>
  );
}
