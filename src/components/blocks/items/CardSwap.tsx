"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const INITIAL_CARDS = [
  { id: "01", title: "Spring Token", meta: "stiffness: 380", color: "#0d99ff" },
  { id: "02", title: "Paper Surface", meta: "#dcd9cf · warm", color: "#ff3b6b" },
  { id: "03", title: "Specular Rim", meta: "edge-hi: 0.75", color: "#1f9d55" },
  { id: "04", title: "Detent Audio", meta: "38ms transient", color: "#9d7bf5" },
];

export default function CardSwap({ tweaks }: LiveBlockProps) {
  const stiffness = tweaks?.stiffness ?? 320;
  const damping = tweaks?.damping ?? 25;
  const [cards, setCards] = useState(INITIAL_CARDS);

  const cycleCard = () => {
    playUISound("paper-flick");
    setCards((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "relative",
        width: 210,
        height: 148,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {cards.map((card, index) => {
        const isTop = index === 0;
        return (
          <motion.div
            key={card.id}
            layout
            drag={isTop}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.85}
            onDragEnd={(_, info) => {
              const dist = Math.hypot(info.offset.x, info.offset.y);
              const vel = Math.hypot(info.velocity.x, info.velocity.y);
              if (dist > 48 || vel > 320) {
                cycleCard();
              } else {
                playUISound("soft-thud", { volume: 0.18 });
              }
            }}
            onClick={() => {
              if (isTop) cycleCard();
            }}
            animate={{
              scale: 1 - index * 0.055,
              y: index * 10 - 8,
              rotate: index === 0 ? 0 : index % 2 === 0 ? 2.2 : -2.2,
              zIndex: cards.length - index,
              opacity: 1 - index * 0.16,
            }}
            transition={{ type: "spring", stiffness, damping }}
            style={{
              position: "absolute",
              width: 192,
              height: 112,
              borderRadius: 14,
              padding: "13px 15px",
              background: "var(--board)",
              border: "1px solid var(--rule-strong)",
              boxShadow: "0 10px 24px -12px rgba(0,0,0,0.22)",
              cursor: isTop ? "grab" : "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              touchAction: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                className="bnc-mono"
                style={{
                  fontSize: 10.5,
                  padding: "2px 7px",
                  borderRadius: 999,
                  background: `${tweaks?.accent ?? card.color}1f`,
                  color: index === 0 ? (tweaks?.accent ?? card.color) : card.color,
                  fontWeight: 600,
                }}
              >
                SPEC {card.id}
              </span>
              <span style={{ fontSize: 10.5, color: "var(--ink-4)" }} className="bnc-mono">
                drag ↗
              </span>
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 650, color: "var(--ink)" }}>
                {card.title}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-4)" }} className="bnc-mono">
                {card.meta}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
