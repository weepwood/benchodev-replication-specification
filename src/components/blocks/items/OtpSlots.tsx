"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

export default function OtpSlots({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#0d99ff";
  const [digits, setDigits] = useState(["4", "2", "8", "", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const complete = digits.every((d) => d !== "");

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", gap: 5 }}>
        {digits.map((d, i) => (
          <motion.input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            aria-label={`Digit ${i + 1}`}
            animate={{ scale: d ? 1.04 : 1 }}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(-1);
              const next = [...digits];
              next[i] = val;
              setDigits(next);
              if (val) {
                playUISound("keycap-pbt", { pitch: 0.9 + i * 0.08 });
                if (i < 5) refs.current[i + 1]?.focus();
                else playUISound("chime-confirm");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !digits[i] && i > 0) {
                refs.current[i - 1]?.focus();
              }
            }}
            className="bnc-mono"
            style={{
              width: 31,
              height: 38,
              borderRadius: 9,
              border: `1.5px solid ${complete ? "#1f9d55" : d ? accent : "var(--rule-strong)"}`,
              background: "var(--board)",
              color: "var(--ink)",
              textAlign: "center",
              fontSize: 14,
              fontWeight: 700,
              outline: "none",
            }}
          />
        ))}
      </div>
      <span
        className="bnc-mono"
        style={{ fontSize: 10.5, color: complete ? "#1f9d55" : "var(--ink-4)" }}
      >
        {complete ? "✓ Token verified" : "Type 3 more digits"}
      </span>
    </div>
  );
}
