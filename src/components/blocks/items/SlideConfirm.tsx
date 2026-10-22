"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

export default function SlideConfirm({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#1f9d55";
  const [confirmed, setConfirmed] = useState(false);
  const x = useMotionValue(0);
  const labelOpacity = useTransform(x, [0, 120], [1, 0]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (confirmed) {
          setConfirmed(false);
          x.set(0);
          playUISound("micro-detent");
        }
      }}
      style={{
        position: "relative",
        width: 220,
        height: 46,
        borderRadius: 999,
        padding: 4,
        background: confirmed ? accent : "var(--board)",
        border: `1px solid ${confirmed ? accent : "var(--rule-strong)"}`,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)",
        cursor: confirmed ? "pointer" : "default",
      }}
    >
      {confirmed ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            color: "#fff",
            fontSize: 12.5,
            fontWeight: 650,
          }}
        >
          <Check size={15} /> Deployed · click to reset
        </div>
      ) : (
        <>
          <motion.span
            style={{
              opacity: labelOpacity,
              width: "100%",
              textAlign: "center",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--ink-3)",
              paddingLeft: 24,
              pointerEvents: "none",
            }}
          >
            Slide to ship →
          </motion.span>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 172 }}
            dragElastic={0.05}
            style={{
              x,
              position: "absolute",
              left: 4,
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "var(--solid)",
              color: "var(--solid-ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "grab",
              touchAction: "none",
            }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 132) {
                setConfirmed(true);
                playUISound("chime-confirm");
              } else {
                x.set(0);
                playUISound("soft-thud", { volume: 0.2 });
              }
            }}
          >
            <ArrowRight size={15} />
          </motion.div>
        </>
      )}
    </div>
  );
}
