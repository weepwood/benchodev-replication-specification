"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

export default function ProfileHoverCard({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#e57bb8";
  const [open, setOpen] = useState(true);
  const [following, setFollowing] = useState(false);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => setOpen(true)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <motion.div
        animate={{
          opacity: open ? 1 : 0.7,
          y: open ? 0 : 4,
          scale: open ? 1 : 0.97,
        }}
        style={{
          width: 214,
          padding: 12,
          borderRadius: 14,
          background: "var(--board)",
          border: "1px solid var(--rule-strong)",
          boxShadow: "0 10px 24px -12px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: accent,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11.5,
                fontWeight: 700,
              }}
            >
              LC
            </span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 650, color: "var(--ink)" }}>
                @lorenzo
              </div>
              <div className="bnc-mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>
                138 live blocks
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playUISound("spring-pop");
              setFollowing((f) => !f);
            }}
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              border: "none",
              background: following ? "var(--surface-3)" : "var(--solid)",
              color: following ? "var(--ink)" : "var(--solid-ink)",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {following ? "Following" : "Follow"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
