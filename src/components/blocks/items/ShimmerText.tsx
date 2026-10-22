"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const STAGES = [
  "Synthesizing spring physics…",
  "Calibrating :root tokens…",
  "Bundling lazy chunk…",
];

export default function ShimmerText({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#9d7bf5";
  const [idx, setIdx] = useState(0);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        playUISound("velvet-hover");
        setIdx((i) => (i + 1) % STAGES.length);
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px",
        borderRadius: 999,
        border: "1px solid var(--rule-strong)",
        background: "var(--board)",
        cursor: "pointer",
      }}
    >
      <Sparkles size={14} style={{ color: accent }} />
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            backgroundImage: `linear-gradient(90deg, var(--ink-3) 0%, ${accent} 50%, var(--ink-3) 100%)`,
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "bnc-shimmer 2s infinite linear",
          }}
        >
          {STAGES[idx]}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
