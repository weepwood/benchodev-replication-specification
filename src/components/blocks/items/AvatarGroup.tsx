"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const MEMBERS = [
  { initials: "LC", name: "Lorenzo", role: "Design Eng", bg: "#0d99ff" },
  { initials: "MK", name: "Mina", role: "Motion", bg: "#ff3b6b" },
  { initials: "AR", name: "Alex", role: "Audio", bg: "#1f9d55" },
  { initials: "SY", name: "Sora", role: "WebGL", bg: "#9d7bf5" },
];

export default function AvatarGroup({ tweaks }: LiveBlockProps) {
  const stiffness = tweaks?.stiffness ?? 420;
  const damping = tweaks?.damping ?? 22;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          height: 22,
          fontSize: 11.5,
          fontWeight: 600,
          color: "var(--ink-2)",
        }}
      >
        {hovered !== null
          ? `${MEMBERS[hovered].name} · ${MEMBERS[hovered].role}`
          : "4 active in canvas"}
      </div>

      <div
        onMouseLeave={() => setHovered(null)}
        style={{ display: "flex", alignItems: "center" }}
      >
        {MEMBERS.map((m, idx) => {
          const isHov = hovered === idx;
          const spread = hovered !== null ? (idx - hovered) * 6 : 0;
          return (
            <motion.button
              key={m.initials}
              type="button"
              onMouseEnter={() => {
                setHovered(idx);
                playUISound("spring-pop", { pitch: 0.9 + idx * 0.08, volume: 0.16 });
              }}
              animate={{
                x: spread,
                y: isHov ? -8 : 0,
                scale: isHov ? 1.18 : 1,
                zIndex: isHov ? 10 : MEMBERS.length - idx,
              }}
              transition={{ type: "spring", stiffness, damping }}
              style={{
                marginLeft: idx === 0 ? 0 : -10,
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "2.5px solid var(--board)",
                background: idx === 0 ? (tweaks?.accent ?? m.bg) : m.bg,
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.16)",
              }}
            >
              {m.initials}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
