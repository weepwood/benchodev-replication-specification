"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, ShieldAlert } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

export default function AccessRequest({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#1f9d55";
  const [progress, setProgress] = useState(0);
  const [granted, setGranted] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startHold = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (granted) {
      setGranted(false);
      setProgress(0);
      return;
    }
    playUISound("micro-detent");
    timerRef.current = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          setGranted(true);
          playUISound("chime-confirm");
          return 100;
        }
        return p + 7;
      });
    }, 28);
  };

  const stopHold = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setProgress((p) => (p >= 100 ? 100 : 0));
  };

  useEffect(() => () => stopHold(), []);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: 224,
        padding: "12px 14px",
        borderRadius: 14,
        background: "var(--board)",
        border: "1px solid var(--rule-strong)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <div>
        <div style={{ fontSize: 12, fontWeight: 650, color: "var(--ink)" }}>
          {granted ? "Prod write granted" : "Request prod key"}
        </div>
        <div className="bnc-mono" style={{ fontSize: 10.5, color: "var(--ink-4)" }}>
          {granted ? "Click to revoke" : "Hold button to sign"}
        </div>
      </div>

      <motion.button
        type="button"
        onPointerDown={startHold}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        whileTap={{ scale: 0.94 }}
        aria-label="Hold to approve access"
        style={{
          position: "relative",
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "none",
          background: granted ? accent : "var(--surface-2)",
          color: granted ? "#fff" : "var(--ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
        >
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="var(--rule)"
            strokeWidth="2.5"
          />
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
            strokeDasharray={113}
            strokeDashoffset={113 - (113 * progress) / 100}
          />
        </svg>
        {granted ? <Check size={16} /> : <ShieldAlert size={16} style={{ color: accent }} />}
      </motion.button>
    </div>
  );
}
