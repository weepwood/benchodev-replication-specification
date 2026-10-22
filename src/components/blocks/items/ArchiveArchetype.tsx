"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

export default function ArchiveArchetype({ tweaks, meta }: LiveBlockProps) {
  const accent = tweaks?.accent ?? meta?.accent ?? "#0d99ff";
  const stiffness = tweaks?.stiffness ?? 380;
  const damping = tweaks?.damping ?? 26;
  const kind = meta?.kind ?? "Press";

  const [toggled, setToggled] = useState(false);
  const [text, setText] = useState(meta?.title ?? "Token");

  if (kind === "Type") {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: "10px 14px",
          borderRadius: 12,
          background: "var(--board)",
          border: `1.5px solid ${accent}`,
        }}
      >
        <input
          value={text}
          onChange={(e) => {
            playUISound("keycap-pbt", { volume: 0.14 });
            setText(e.target.value);
          }}
          aria-label={meta?.title ?? "Interactive input"}
          style={{
            border: "none",
            background: "transparent",
            color: "var(--ink)",
            fontSize: 13,
            fontWeight: 600,
            outline: "none",
          }}
        />
      </div>
    );
  }

  if (kind === "Loading") {
    return (
      <motion.div
        onClick={(e) => {
          e.stopPropagation();
          playUISound("glass-tap");
          setToggled((v) => !v);
        }}
        animate={{ rotate: toggled ? 180 : 360 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "3px solid var(--rule)",
          borderTopColor: accent,
          cursor: "pointer",
        }}
      />
    );
  }

  return (
    <motion.button
      type="button"
      drag={kind === "Drag"}
      dragConstraints={{ left: -36, right: 36, top: -22, bottom: 22 }}
      dragElastic={0.35}
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness, damping }}
      onClick={(e) => {
        e.stopPropagation();
        playUISound(meta?.soundId ?? "micro-detent");
        setToggled((t) => !t);
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        padding: "11px 18px",
        borderRadius: 999,
        border: `1.5px solid ${toggled ? accent : "var(--rule-strong)"}`,
        background: toggled ? accent : "var(--board)",
        color: toggled ? "#fff" : "var(--ink)",
        fontSize: 13,
        fontWeight: 600,
        cursor: kind === "Drag" ? "grab" : "pointer",
        boxShadow: "0 8px 20px -10px rgba(0,0,0,0.18)",
        touchAction: kind === "Drag" ? "none" : "auto",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: toggled ? "#fff" : accent,
        }}
      />
      <span>{meta?.title ?? "Interactive Block"}</span>
    </motion.button>
  );
}
