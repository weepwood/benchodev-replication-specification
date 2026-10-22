"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const STOPS = ["24mm", "35mm", "50mm", "85mm", "135mm"];

export default function OptionWheel({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#e09a12";
  const stiffness = tweaks?.stiffness ?? 410;
  const damping = tweaks?.damping ?? 26;

  const [idx, setIdx] = useState(2);
  const accumRef = useRef(0);
  const [dragging, setDragging] = useState(false);

  const stepBy = (delta: number) => {
    setIdx((prev) => {
      const next = Math.max(0, Math.min(STOPS.length - 1, prev + delta));
      if (next !== prev) {
        playUISound("micro-detent", { pitch: 0.9 + next * 0.1 });
      }
      return next;
    });
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        accumRef.current = 0;
      }}
      onPointerMove={(e) => {
        if (!dragging) return;
        accumRef.current += e.movementX;
        if (accumRef.current > 24) {
          stepBy(-1);
          accumRef.current = 0;
        } else if (accumRef.current < -24) {
          stepBy(1);
          accumRef.current = 0;
        }
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      style={{
        width: 224,
        padding: "14px 12px",
        borderRadius: 14,
        background: "var(--solid)",
        color: "var(--solid-ink)",
        cursor: dragging ? "grabbing" : "ew-resize",
        touchAction: "none",
        boxShadow: "0 10px 26px -12px rgba(0,0,0,0.34)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <span className="bnc-mono" style={{ fontSize: 13.5, fontWeight: 700, color: accent }}>
          {STOPS[idx]}
        </span>
      </div>

      <div
        style={{
          position: "relative",
          height: 36,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 0,
            width: 2,
            height: 8,
            background: accent,
            borderRadius: 2,
            zIndex: 3,
          }}
        />
        <motion.div
          animate={{ x: (2 - idx) * 44 }}
          transition={{ type: "spring", stiffness, damping }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {STOPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                playUISound("micro-detent");
                setIdx(i);
              }}
              className="bnc-mono"
              style={{
                width: 34,
                border: "none",
                background: "transparent",
                color: "var(--solid-ink)",
                opacity: i === idx ? 1 : 0.35,
                fontSize: 10.5,
                fontWeight: i === idx ? 700 : 400,
                cursor: "pointer",
                padding: 0,
              }}
            >
              {label.replace("mm", "")}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
