"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const ACTIONS = [
  { label: "Copy :root tokens", kbd: "⌘C" },
  { label: "Pull via MCP", kbd: "⌘M" },
  { label: "Export WAV audio", kbd: "⌘E" },
  { label: "Toggle dark mode", kbd: "⌘D" },
];

export default function CommandBar({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#0d99ff";
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const [ran, setRan] = useState<string | null>(null);

  const filtered = ACTIONS.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: 228,
        borderRadius: 13,
        background: "var(--board)",
        border: "1px solid var(--rule-strong)",
        overflow: "hidden",
        boxShadow: "0 10px 24px -12px rgba(0,0,0,0.18)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "7px 10px",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        <Search size={13} style={{ color: accent }} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSel(0);
            playUISound("keycap-pbt", { volume: 0.12 });
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSel((s) => Math.min(filtered.length - 1, s + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSel((s) => Math.max(0, s - 1));
            } else if (e.key === "Enter" && filtered[sel]) {
              e.preventDefault();
              playUISound("spring-pop");
              setRan(filtered[sel].label);
            }
          }}
          placeholder={ran ? `✓ ${ran}` : "Type a command…"}
          aria-label="Command palette search"
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            fontSize: 11.5,
            color: "var(--ink)",
            outline: "none",
          }}
        />
      </div>

      <div style={{ padding: 4 }}>
        {filtered.slice(0, 3).map((item, idx) => {
          const active = idx === sel;
          return (
            <button
              key={item.label}
              type="button"
              onMouseEnter={() => setSel(idx)}
              onClick={() => {
                playUISound("spring-pop");
                setRan(item.label);
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "5px 8px",
                borderRadius: 7,
                border: "none",
                background: active ? `${accent}16` : "transparent",
                color: active ? accent : "var(--ink-2)",
                fontSize: 11,
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
              }}
            >
              <span>{item.label}</span>
              <span className="bnc-mono" style={{ fontSize: 10, opacity: 0.7 }}>
                {item.kbd}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
