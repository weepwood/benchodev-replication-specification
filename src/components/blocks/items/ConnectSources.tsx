"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Database, GitBranch, Layers, Terminal } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const SOURCES = [
  { id: "git", label: "GitHub", y: 20, Icon: GitBranch },
  { id: "db", label: "Postgres", y: 60, Icon: Database },
  { id: "fig", label: "Figma", y: 100, Icon: Layers },
];

export default function ConnectSources({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#1f9d55";
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    git: true,
    db: true,
    fig: false,
  });

  const activeCount = Object.values(enabled).filter(Boolean).length;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "relative",
        width: 236,
        height: 128,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left source toggles */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, zIndex: 2 }}>
        {SOURCES.map(({ id, label, Icon }) => {
          const on = enabled[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                playUISound("relay-latch", { volume: 0.22 });
                setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 9px",
                borderRadius: 8,
                border: `1px solid ${on ? accent : "var(--rule-strong)"}`,
                background: on ? `${accent}16` : "var(--board)",
                color: on ? "var(--ink)" : "var(--ink-4)",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Icon size={12} style={{ color: on ? accent : "var(--ink-4)" }} />
              {label}
            </button>
          );
        })}
      </div>

      {/* SVG circuit wires */}
      <svg
        width="88"
        height="120"
        viewBox="0 0 88 120"
        fill="none"
        style={{ position: "absolute", left: 84, top: 4, pointerEvents: "none" }}
      >
        {SOURCES.map((s) => {
          const on = enabled[s.id];
          const d = `M 0 ${s.y} C 42 ${s.y}, 44 60, 88 60`;
          return (
            <g key={s.id}>
              <path d={d} stroke="var(--rule-strong)" strokeWidth="1.5" />
              {on && (
                <motion.path
                  d={d}
                  stroke={accent}
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  animate={{ strokeDashoffset: [24, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Destination hub */}
      <motion.div
        animate={{ scale: activeCount > 0 ? 1 : 0.94 }}
        style={{
          zIndex: 2,
          width: 62,
          height: 62,
          borderRadius: 14,
          background: "var(--board)",
          border: `1.5px solid ${activeCount > 0 ? accent : "var(--rule)"}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          boxShadow: "0 8px 20px -10px rgba(0,0,0,0.16)",
        }}
      >
        <Terminal size={16} style={{ color: activeCount > 0 ? accent : "var(--ink-4)" }} />
        <span className="bnc-mono" style={{ fontSize: 10, fontWeight: 700 }}>
          {activeCount}/3 IN
        </span>
      </motion.div>
    </div>
  );
}
