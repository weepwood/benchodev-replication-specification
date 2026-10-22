"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

export default function PagePeel({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#ff3b6b";
  const stiffness = tweaks?.stiffness ?? 320;
  const damping = tweaks?.damping ?? 26;

  const [peel, setPeel] = useState(46);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        playUISound("paper-flick");
        setPeel((p) => (p > 65 ? 36 : 92));
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
      }}
      onPointerMove={(e) => {
        if (!dragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const distFromTopRight = Math.max(
          24,
          Math.min(115, rect.right - e.clientX + (e.clientY - rect.top) * 0.5)
        );
        setPeel(distFromTopRight);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      style={{
        position: "relative",
        width: 196,
        height: 132,
        borderRadius: 12,
        overflow: "hidden",
        background: "#0e0f11",
        border: "1px solid var(--rule-strong)",
        cursor: "grab",
        touchAction: "none",
      }}
    >
      {/* Hidden blueprint underneath */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: 12,
          backgroundImage:
            "linear-gradient(rgba(13,153,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(13,153,255,0.22) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          color: "#f4f3f1",
        }}
      >
        <span className="bnc-mono" style={{ fontSize: 10, color: accent }}>
          SECRET SPEC
        </span>
        <span className="bnc-mono" style={{ fontSize: 11, fontWeight: 700 }}>
          spring(320, 26)
        </span>
      </div>

      {/* Top warm paper sheet clipped at top-right */}
      <motion.div
        animate={{
          clipPath: `polygon(0 0, calc(100% - ${peel}px) 0, 100% ${peel}px, 100% 100%, 0 100%)`,
        }}
        transition={{ type: "spring", stiffness, damping }}
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--board)",
          padding: 14,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <span className="bnc-mono" style={{ fontSize: 10.5, color: "var(--ink-4)" }}>
          NOTE 04
        </span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 650, color: "var(--ink)" }}>
            Peel corner ↙
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
            Drag or click sheet
          </div>
        </div>
      </motion.div>

      {/* Curled flap triangle */}
      <motion.div
        animate={{ width: peel, height: peel }}
        transition={{ type: "spring", stiffness, damping }}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "linear-gradient(225deg, transparent 49%, var(--paper) 51%, #fff 100%)",
          borderBottomLeftRadius: 8,
          boxShadow: "-4px 4px 10px rgba(0,0,0,0.24)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
