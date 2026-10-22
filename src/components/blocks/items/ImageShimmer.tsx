"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

export default function ImageShimmer({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#4c8dff";
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        playUISound("glass-tap");
        setLoaded((v) => !v);
      }}
      style={{
        width: 206,
        padding: 10,
        borderRadius: 14,
        background: "var(--board)",
        border: "1px solid var(--rule)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          height: 76,
          borderRadius: 9,
          overflow: "hidden",
          marginBottom: 9,
          position: "relative",
        }}
      >
        {loaded ? (
          <motion.div
            initial={{ opacity: 0, filter: "blur(8px)", scale: 1.06 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, ${accent}, #ff3b6b)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
            }}
            className="bnc-mono"
          >
            1200 × 630 READY
          </motion.div>
        ) : (
          <div className="bnc-shimmer-bar" style={{ width: "100%", height: "100%" }} />
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {loaded ? (
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink)" }}>
            share-cover-ring.png
          </span>
        ) : (
          <span className="bnc-shimmer-bar" style={{ width: 116, height: 11, borderRadius: 4 }} />
        )}
        <span className="bnc-mono" style={{ fontSize: 10, color: accent }}>
          {loaded ? "Reset" : "Hydrate"}
        </span>
      </div>
    </div>
  );
}
