"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, FileCode2, Folder } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

export default function TreeView({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#0d99ff";
  const [openBlocks, setOpenBlocks] = useState(true);
  const [selected, setSelected] = useState("InkBloom.tsx");

  const files = ["InkBloom.tsx", "Metaballs.tsx", "tokens.css"];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bnc-mono"
      style={{
        width: 214,
        padding: "10px 12px",
        borderRadius: 12,
        background: "var(--board)",
        border: "1px solid var(--rule)",
        fontSize: 11.5,
      }}
    >
      <button
        type="button"
        onClick={() => {
          playUISound("micro-detent");
          setOpenBlocks((o) => !o);
        }}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 5,
          border: "none",
          background: "transparent",
          color: "var(--ink)",
          fontWeight: 650,
          padding: "3px 2px",
          cursor: "pointer",
        }}
      >
        <motion.span animate={{ rotate: openBlocks ? 90 : 0 }} style={{ display: "flex" }}>
          <ChevronRight size={13} />
        </motion.span>
        <Folder size={13} style={{ color: accent }} />
        <span>src/blocks</span>
      </button>

      <AnimatePresence initial={false}>
        {openBlocks && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              overflow: "hidden",
              marginLeft: 10,
              paddingLeft: 10,
              borderLeft: `1px solid ${accent}55`,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              marginTop: 3,
            }}
          >
            {files.map((f) => {
              const active = selected === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    playUISound("vernier-tick");
                    setSelected(f);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 6px",
                    background: active ? `${accent}18` : "transparent",
                    color: active ? accent : "var(--ink-2)",
                    fontWeight: active ? 650 : 450,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <FileCode2 size={12} />
                  <span>{f}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
