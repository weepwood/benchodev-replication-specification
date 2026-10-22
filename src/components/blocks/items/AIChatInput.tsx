"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const MODELS = ["Claude 3.7", "GPT-4.5", "Gemini 2.5"];
const REPLIES: Record<string, string> = {
  default: "Generated 42 lines · spring(380, 26) ready to paste.",
  "/fix": "Patched touch-action & Safari gesture guard in 14ms.",
  "/tokens": "Synced :root --pick & --paper CSS custom properties.",
};

export default function AIChatInput({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#0d99ff";
  const [text, setText] = useState("");
  const [modelIdx, setModelIdx] = useState(0);
  const [reply, setReply] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);

  const showSlash = text.startsWith("/");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || streaming) return;
    playUISound("orbit-ping", { volume: 0.25 });
    const full =
      text.startsWith("/fix")
        ? REPLIES["/fix"]
        : text.startsWith("/tokens")
        ? REPLIES["/tokens"]
        : REPLIES.default;
    setStreaming(true);
    setReply("");
    setText("");
    let i = 0;
    const timer = window.setInterval(() => {
      i += 3;
      setReply(full.slice(0, i));
      if (i >= full.length) {
        window.clearInterval(timer);
        setStreaming(false);
      }
    }, 28);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: 244,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <AnimatePresence mode="wait">
        {showSlash && (
          <motion.div
            key="slash"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            style={{
              display: "flex",
              gap: 6,
              padding: "5px 7px",
              borderRadius: 10,
              background: "var(--board)",
              border: "1px solid var(--rule-strong)",
              fontSize: 11,
            }}
          >
            {["/fix", "/tokens"].map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => {
                  playUISound("micro-detent");
                  setText(cmd + " ");
                }}
                className="bnc-mono"
                style={{
                  border: "none",
                  borderRadius: 6,
                  padding: "2px 7px",
                  background: `${accent}1a`,
                  color: accent,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {cmd}
              </button>
            ))}
          </motion.div>
        )}

        {reply && !showSlash && (
          <motion.div
            key="reply"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bnc-mono"
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              background: "var(--board)",
              border: "1px solid var(--rule)",
              fontSize: 10.5,
              color: "var(--ink-2)",
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: accent, marginRight: 5 }}>●</span>
            {reply}
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        style={{
          borderRadius: 14,
          background: "var(--board)",
          border: "1px solid var(--rule-strong)",
          padding: "9px 10px",
          boxShadow: "0 8px 22px -12px rgba(0,0,0,0.16)",
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => {
            playUISound("keycap-pbt", { volume: 0.12, pitch: 0.95 + Math.random() * 0.15 });
            setText(e.target.value);
          }}
          placeholder="Ask or type /tokens…"
          aria-label="AI prompt input"
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            color: "var(--ink)",
            fontSize: 12.5,
            outline: "none",
            marginBottom: 8,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            type="button"
            onClick={() => {
              playUISound("micro-detent");
              setModelIdx((i) => (i + 1) % MODELS.length);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 8px",
              borderRadius: 999,
              border: "1px solid var(--rule)",
              background: "var(--surface)",
              color: "var(--ink-2)",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            <Sparkles size={11} style={{ color: accent }} />
            {MODELS[modelIdx]}
          </button>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.9 }}
            aria-label="Send prompt"
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "none",
              background: text.trim() ? accent : "var(--surface-3)",
              color: text.trim() ? "#fff" : "var(--ink-4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ArrowUp size={14} />
          </motion.button>
        </div>
      </form>
    </div>
  );
}
