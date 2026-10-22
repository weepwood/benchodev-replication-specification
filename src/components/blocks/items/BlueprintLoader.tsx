"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

export default function BlueprintLoader({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#0d99ff";
  const speed = tweaks?.speed ?? 1;
  const [cycle, setCycle] = useState(0);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        playUISound("micro-detent");
        setCycle((c) => c + 1);
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 196,
          height: 118,
          borderRadius: 12,
          background: "var(--board)",
          border: `1px solid ${accent}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Figma corner handles */}
        {[
          { top: -3, left: -3 },
          { top: -3, right: -3 },
          { bottom: -3, left: -3 },
          { bottom: -3, right: -3 },
        ].map((pos, idx) => (
          <span
            key={idx}
            style={{
              position: "absolute",
              ...pos,
              width: 6,
              height: 6,
              background: "#fff",
              border: `1.5px solid ${accent}`,
            }}
          />
        ))}

        <svg key={cycle} width="150" height="84" viewBox="0 0 150 84" fill="none">
          <motion.rect
            x="22"
            y="14"
            width="106"
            height="56"
            rx="10"
            stroke={accent}
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{
              duration: 2.8 / speed,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            cx="75"
            cy="42"
            r="18"
            stroke="#ff3b6b"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            animate={{ rotate: 360 }}
            transition={{ duration: 6 / speed, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "75px 42px" }}
          />
          <motion.line
            x1="10"
            y1="42"
            x2="140"
            y2="42"
            stroke={accent}
            strokeOpacity="0.35"
            strokeWidth="1"
          />
        </svg>

        <span
          className="bnc-mono"
          style={{
            position: "absolute",
            bottom: -9,
            padding: "1px 6px",
            borderRadius: 4,
            background: accent,
            color: "#fff",
            fontSize: 9.5,
            fontWeight: 600,
          }}
        >
          196 × 118
        </span>
      </div>

      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontSize: 10.5,
          color: "var(--ink-4)",
          marginTop: 4,
        }}
        className="bnc-mono"
      >
        <RotateCw size={10} /> click to redraft
      </span>
    </div>
  );
}
