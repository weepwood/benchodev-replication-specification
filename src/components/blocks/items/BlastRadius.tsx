"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { playUISound } from "@/lib/soundEngine";
import type { LiveBlockProps } from "../types";

const NODES = [
  { id: "auth", label: "Auth", x: 34, y: 64 },
  { id: "api", label: "API", x: 106, y: 34 },
  { id: "edge", label: "Edge", x: 106, y: 94 },
  { id: "web", label: "App", x: 184, y: 48 },
  { id: "mcp", label: "MCP", x: 184, y: 98 },
];

const EDGES: Array<[string, string]> = [
  ["auth", "api"],
  ["auth", "edge"],
  ["api", "web"],
  ["api", "mcp"],
  ["edge", "web"],
];

function getDownstream(start: string): Set<string> {
  const visited = new Set<string>([start]);
  let added = true;
  while (added) {
    added = false;
    for (const [from, to] of EDGES) {
      if (visited.has(from) && !visited.has(to)) {
        visited.add(to);
        added = true;
      }
    }
  }
  return visited;
}

export default function BlastRadius({ tweaks }: LiveBlockProps) {
  const accent = tweaks?.accent ?? "#ff3b6b";
  const [focus, setFocus] = useState<string>("auth");
  const impacted = getDownstream(focus);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ position: "relative", width: 224, height: 136 }}
    >
      <svg width="224" height="136" viewBox="0 0 224 136" fill="none">
        {EDGES.map(([from, to]) => {
          const n1 = NODES.find((n) => n.id === from)!;
          const n2 = NODES.find((n) => n.id === to)!;
          const hot = impacted.has(from) && impacted.has(to);
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={n1.x}
              y1={n1.y}
              x2={n2.x}
              y2={n2.y}
              stroke={hot ? accent : "var(--rule-strong)"}
              strokeWidth={hot ? 2 : 1.2}
            />
          );
        })}
      </svg>

      {NODES.map((node) => {
        const hot = impacted.has(node.id);
        return (
          <motion.button
            key={node.id}
            type="button"
            onMouseEnter={() => {
              setFocus(node.id);
              playUISound("vernier-tick", { volume: 0.14 });
            }}
            onClick={() => setFocus(node.id)}
            animate={{ scale: node.id === focus ? 1.12 : 1 }}
            className="bnc-mono"
            style={{
              position: "absolute",
              left: node.x - 22,
              top: node.y - 13,
              width: 44,
              height: 26,
              borderRadius: 999,
              border: `1.5px solid ${hot ? accent : "var(--rule-strong)"}`,
              background: hot ? accent : "var(--board)",
              color: hot ? "#fff" : "var(--ink-2)",
              fontSize: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {node.label}
          </motion.button>
        );
      })}
    </div>
  );
}
