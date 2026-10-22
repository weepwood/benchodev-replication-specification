"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const DATA = [
  { day: "M", dns: 18, tls: 24, app: 34 },
  { day: "T", dns: 14, tls: 28, app: 42 },
  { day: "W", dns: 22, tls: 19, app: 30 },
  { day: "T", dns: 16, tls: 32, app: 46 },
  { day: "F", dns: 12, tls: 22, app: 38 },
  { day: "S", dns: 15, tls: 18, app: 26 },
];

export default function StackedBars({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#4c8dff";
  const [hoverIdx, setHoverIdx] = useState<number>(3);

  const current = DATA[hoverIdx];
  const total = current.dns + current.tls + current.app;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: 224,
        padding: "12px 14px",
        borderRadius: 14,
        background: "var(--board)",
        border: "1px solid var(--rule)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-2)" }}>
          p95 Latency
        </span>
        <span className="bnc-mono" style={{ fontSize: 12, fontWeight: 700, color: accent }}>
          {total}ms
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          height: 82,
          gap: 8,
        }}
      >
        {DATA.map((d, idx) => {
          const isFocus = idx === hoverIdx;
          return (
            <button
              key={idx}
              type="button"
              onMouseEnter={() => {
                setHoverIdx(idx);
                playUISound("vernier-tick", { pitch: 0.85 + idx * 0.08, volume: 0.14 });
              }}
              onClick={() => setHoverIdx(idx)}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                cursor: "pointer",
                opacity: isFocus ? 1 : 0.48,
                transition: "opacity 140ms ease",
              }}
            >
              <motion.span
                animate={{ height: d.app * 0.72, scaleX: isFocus ? 1.1 : 1 }}
                style={{ width: "100%", borderRadius: 4, background: accent, display: "block" }}
              />
              <motion.span
                animate={{ height: d.tls * 0.72 }}
                style={{ width: "100%", borderRadius: 4, background: "#ff3b6b", display: "block" }}
              />
              <motion.span
                animate={{ height: d.dns * 0.72 }}
                style={{ width: "100%", borderRadius: 4, background: "#1f9d55", display: "block" }}
              />
              <span className="bnc-mono" style={{ fontSize: 9.5, color: "var(--ink-4)" }}>
                {d.day}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
