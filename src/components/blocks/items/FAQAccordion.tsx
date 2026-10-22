"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const ITEMS = [
  { q: "Are blocks mocked?", a: "Never. Every card runs real React + spring physics." },
  { q: "How does MCP work?", a: "Point Cursor or Claude Code to /api/mcp to pull code." },
];

export default function FAQAccordion({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#0d99ff";
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: 232,
        borderRadius: 13,
        background: "var(--board)",
        border: "1px solid var(--rule)",
        overflow: "hidden",
      }}
    >
      {ITEMS.map((item, idx) => {
        const isOpen = open === idx;
        return (
          <div
            key={item.q}
            style={{
              borderBottom: idx === 0 ? "1px solid var(--rule)" : "none",
            }}
          >
            <button
              type="button"
              onClick={() => {
                playUISound("micro-detent");
                setOpen(isOpen ? null : idx);
              }}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "none",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "var(--ink)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span>{item.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                style={{ color: isOpen ? accent : "var(--ink-4)", display: "flex" }}
              >
                <Plus size={14} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    style={{
                      padding: "0 12px 10px",
                      fontSize: 11.5,
                      color: "var(--ink-3)",
                      lineHeight: 1.45,
                    }}
                  >
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
