"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const TICKS = 29;

export default function WakeSlider({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#0d99ff";
  const stiffness = tweaks?.stiffness ?? 450;
  const damping = tweaks?.damping ?? 28;

  const [value, setValue] = useState(0.54);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const lastTickRef = useRef<number>(15);

  const updateFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const tickIdx = Math.round(next * (TICKS - 1));
    if (tickIdx !== lastTickRef.current) {
      lastTickRef.current = tickIdx;
      playUISound("vernier-tick", { pitch: 0.8 + next * 0.55, volume: 0.16 });
    }
    setValue(next);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: 232,
        padding: "16px 16px 14px",
        borderRadius: 14,
        background: "var(--board)",
        border: "1px solid var(--rule)",
        boxShadow: "0 8px 22px -12px rgba(0,0,0,0.14)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)" }}>
          Wake gain
        </span>
        <span className="bnc-mono" style={{ fontSize: 12.5, fontWeight: 700, color: accent }}>
          {Math.round(value * 100)}%
        </span>
      </div>

      <div
        ref={trackRef}
        onPointerDown={(e) => {
          e.stopPropagation();
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging) updateFromClientX(e.clientX);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        style={{
          position: "relative",
          height: 52,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          cursor: "ew-resize",
          touchAction: "none",
          paddingBottom: 6,
        }}
      >
        {Array.from({ length: TICKS }).map((_, idx) => {
          const norm = idx / (TICKS - 1);
          const dist = Math.abs(norm - value);
          const wake = Math.exp(-(dist * dist) / (dragging ? 0.014 : 0.009));
          const h = 8 + wake * (dragging ? 28 : 20);
          const isMajor = idx % 7 === 0;

          return (
            <motion.span
              key={idx}
              animate={{
                height: h,
                y: -wake * (dragging ? 6 : 3),
                backgroundColor: wake > 0.45 ? accent : isMajor ? "var(--ink-3)" : "var(--ink-5)",
              }}
              transition={{ type: "spring", stiffness, damping }}
              style={{
                width: 2,
                borderRadius: 99,
                display: "block",
                opacity: 0.45 + wake * 0.55,
              }}
            />
          );
        })}

        <motion.div
          animate={{
            left: `calc(${value * 100}% - 8px)`,
            scale: dragging ? 1.18 : 1,
          }}
          transition={{ type: "spring", stiffness: stiffness * 1.2, damping }}
          style={{
            position: "absolute",
            bottom: 0,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            border: `3px solid ${accent}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.22)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
