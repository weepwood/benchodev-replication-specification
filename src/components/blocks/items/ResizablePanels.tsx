"use client";

import React, { useRef, useState } from "react";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

export default function ResizablePanels({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#0d99ff";
  const [split, setSplit] = useState(54);
  const [dragging, setDragging] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={boxRef}
      onClick={(e) => e.stopPropagation()}
      onPointerMove={(e) => {
        if (!dragging || !boxRef.current) return;
        const rect = boxRef.current.getBoundingClientRect();
        const pct = Math.max(24, Math.min(76, ((e.clientX - rect.left) / rect.width) * 100));
        setSplit(Math.round(pct));
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      style={{
        width: 228,
        height: 120,
        borderRadius: 12,
        background: "var(--board)",
        border: "1px solid var(--rule-strong)",
        display: "flex",
        overflow: "hidden",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <div
        style={{
          width: `${split}%`,
          padding: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "var(--surface)",
        }}
      >
        <span className="bnc-mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>
          STAGE
        </span>
        <span className="bnc-mono" style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>
          {split}%
        </span>
      </div>

      {/* Draggable Figma sash */}
      <div
        onPointerDown={(e) => {
          e.stopPropagation();
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          playUISound("micro-detent");
        }}
        onDoubleClick={() => {
          playUISound("magnetic-snap");
          setSplit(50);
        }}
        title="Drag or double-click to reset"
        style={{
          width: 8,
          cursor: "col-resize",
          background: dragging ? accent : "var(--rule)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 120ms ease",
        }}
      >
        <span
          style={{
            width: 2,
            height: 24,
            borderRadius: 2,
            background: dragging ? "#fff" : accent,
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          padding: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <span className="bnc-mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>
          PROPS
        </span>
        <span className="bnc-mono" style={{ fontSize: 12, fontWeight: 700, color: accent }}>
          {100 - split}%
        </span>
      </div>
    </div>
  );
}
