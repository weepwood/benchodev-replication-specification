"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const ORBIT_ITEMS = [
  { label: "Tokens", tag: "01", color: "#0d99ff" },
  { label: "Springs", tag: "02", color: "#ff3b6b" },
  { label: "Audio", tag: "03", color: "#1f9d55" },
  { label: "Shaders", tag: "04", color: "#9d7bf5" },
  { label: "MCP", tag: "05", color: "#e09a12" },
];

export default function OrbitCards({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#9d7bf5";
  const stiffness = tweaks?.stiffness ?? 280;
  const damping = tweaks?.damping ?? 24;

  const [angle, setAngle] = useState(0.35);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
      }}
      onPointerMove={(e) => {
        if (!dragging) return;
        setAngle((a) => a + e.movementX * 0.018);
      }}
      onPointerUp={() => {
        setDragging(false);
        playUISound("magnetic-snap", { volume: 0.2 });
      }}
      onPointerCancel={() => setDragging(false)}
      style={{
        position: "relative",
        width: 240,
        height: 164,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: dragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
    >
      {/* Orbital ellipse guide */}
      <div
        style={{
          position: "absolute",
          width: 196,
          height: 68,
          borderRadius: "50%",
          border: `1px dashed ${accent}55`,
          pointerEvents: "none",
        }}
      />

      {ORBIT_ITEMS.map((item, idx) => {
        const theta = angle + (idx / ORBIT_ITEMS.length) * Math.PI * 2;
        const x = Math.sin(theta) * 78;
        const y = Math.cos(theta) * 26;
        const depth = (Math.cos(theta) + 1) / 2; // 0 back .. 1 front
        const scale = 0.68 + depth * 0.38;
        const zIndex = Math.round(depth * 20);

        return (
          <motion.button
            key={item.tag}
            type="button"
            onClick={() => {
              playUISound("micro-detent");
              setAngle((a) => a + 0.62);
            }}
            animate={{
              x,
              y,
              scale,
              opacity: 0.42 + depth * 0.58,
            }}
            transition={{ type: "spring", stiffness, damping }}
            style={{
              position: "absolute",
              zIndex,
              width: 76,
              padding: "8px 9px",
              borderRadius: 11,
              background: "var(--board)",
              border: `1px solid ${depth > 0.75 ? accent : "var(--rule-strong)"}`,
              boxShadow: "0 8px 18px -10px rgba(0,0,0,0.22)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 3,
              cursor: "grab",
            }}
          >
            <span
              className="bnc-mono"
              style={{ fontSize: 9.5, color: item.color, fontWeight: 700 }}
            >
              {item.tag}
            </span>
            <span style={{ fontSize: 11.5, fontWeight: 650, color: "var(--ink)" }}>
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
