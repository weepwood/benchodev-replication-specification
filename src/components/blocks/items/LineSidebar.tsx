"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const SECTIONS = [
  "01 · Overview",
  "02 · Tokens",
  "03 · Springs",
  "04 · Audio",
  "05 · Shaders",
  "06 · MCP CLI",
  "07 · License",
];

export default function LineSidebar({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#b8431c";
  const stiffness = tweaks?.stiffness ?? 460;
  const damping = tweaks?.damping ?? 27;
  const [hoverIdx, setHoverIdx] = useState<number | null>(2);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseLeave={() => setHoverIdx(2)}
      style={{
        width: 216,
        padding: "12px 14px",
        borderRadius: 14,
        background: "var(--board)",
        border: "1px solid var(--rule)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {SECTIONS.map((label, idx) => {
          const dist = hoverIdx !== null ? Math.abs(hoverIdx - idx) : 99;
          const width = dist === 0 ? 34 : dist === 1 ? 22 : 12;
          const isCurrent = hoverIdx === idx;
          return (
            <button
              key={label}
              type="button"
              onMouseEnter={() => {
                setHoverIdx(idx);
                playUISound("vernier-tick", { pitch: 0.9 + idx * 0.07, volume: 0.14 });
              }}
              onClick={() => setHoverIdx(idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "none",
                background: "transparent",
                padding: "2px 0",
                cursor: "pointer",
              }}
            >
              <motion.span
                animate={{
                  width,
                  height: isCurrent ? 2.5 : 1.5,
                  backgroundColor: isCurrent ? accent : "var(--ink-4)",
                }}
                transition={{ type: "spring", stiffness, damping }}
                style={{ borderRadius: 99, display: "block" }}
              />
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, textAlign: "right" }}>
        <div className="bnc-mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>
          ACTIVE RAIL
        </div>
        <motion.div
          key={hoverIdx}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 13, fontWeight: 650, color: "var(--ink)", marginTop: 2 }}
        >
          {SECTIONS[hoverIdx ?? 2]}
        </motion.div>
      </div>
    </div>
  );
}
