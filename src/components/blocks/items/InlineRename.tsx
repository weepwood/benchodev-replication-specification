"use client";

import React, { useState } from "react";
import { Check, Pencil } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

export default function InlineRename({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#0d99ff";
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Hero / Orbital Ring");

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={() => setEditing(true)}
      style={{
        width: 224,
        padding: "9px 11px",
        borderRadius: 11,
        background: "var(--board)",
        border: `1.5px solid ${editing ? accent : "var(--rule-strong)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      {editing ? (
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") {
              playUISound("micro-detent");
              setEditing(false);
            }
          }}
          onBlur={() => setEditing(false)}
          aria-label="Layer name"
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            fontSize: 12.5,
            fontWeight: 600,
            color: "var(--ink)",
            outline: "none",
          }}
        />
      ) : (
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)" }}>{name}</span>
      )}

      <button
        type="button"
        aria-label={editing ? "Save name" : "Edit name"}
        onClick={() => {
          playUISound("micro-detent");
          setEditing((v) => !v);
        }}
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          border: "none",
          background: editing ? accent : "var(--surface-2)",
          color: editing ? "#fff" : "var(--ink-3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {editing ? <Check size={12} /> : <Pencil size={12} />}
      </button>
    </div>
  );
}
