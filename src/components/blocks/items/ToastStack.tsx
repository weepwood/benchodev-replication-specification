"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Plus } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const MESSAGES = [
  "MCP pulled InkBloom.tsx",
  "Copied :root tokens",
  "Exported micro-detent.wav",
  "Spring calibrated 380/26",
];

export default function ToastStack({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#1f9d55";
  const stiffness = tweaks?.stiffness ?? 380;
  const damping = tweaks?.damping ?? 26;

  const [expanded, setExpanded] = useState(false);
  const [toasts, setToasts] = useState([
    { id: 1, text: MESSAGES[0] },
    { id: 2, text: MESSAGES[1] },
    { id: 3, text: MESSAGES[2] },
  ]);

  const pushToast = () => {
    playUISound("spring-pop", { volume: 0.22 });
    const nextId = Date.now();
    const msg = MESSAGES[nextId % MESSAGES.length];
    setToasts((prev) => [{ id: nextId, text: msg }, ...prev.slice(0, 2)]);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        position: "relative",
        width: 224,
        height: 150,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 8,
      }}
    >
      {toasts.map((toast, idx) => (
        <motion.div
          key={toast.id}
          animate={{
            y: expanded ? -idx * 42 : -idx * 9,
            scale: expanded ? 1 : 1 - idx * 0.055,
            opacity: 1 - idx * (expanded ? 0.08 : 0.22),
            zIndex: 10 - idx,
          }}
          transition={{ type: "spring", stiffness, damping }}
          style={{
            position: "absolute",
            bottom: 34,
            width: 208,
            padding: "8px 11px",
            borderRadius: 10,
            background: "var(--board)",
            border: "1px solid var(--rule-strong)",
            boxShadow: "0 8px 18px -10px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontSize: 11.5,
            fontWeight: 550,
            color: "var(--ink)",
          }}
        >
          <CheckCircle2 size={13} style={{ color: accent, flexShrink: 0 }} />
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {toast.text}
          </span>
        </motion.div>
      ))}

      <button
        type="button"
        onClick={pushToast}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "3px 9px",
          borderRadius: 999,
          border: "1px solid var(--rule-strong)",
          background: "var(--board)",
          color: "var(--ink-2)",
          fontSize: 10.5,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <Plus size={11} style={{ color: accent }} /> Trigger toast
      </button>
    </div>
  );
}
