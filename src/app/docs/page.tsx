"use client";

import React, { useEffect, useState } from "react";
import { Check, Copy, KeyRound, Plus, Terminal } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";

const ROOT_TOKENS_SNIPPET = `:root {
  --bg: #fff;
  --surface: #f7f7f6;
  --surface-2: #f1f1f0;
  --surface-3: #ecebe7;
  --ink: #17181a;
  --ink-2: #3c3b37;
  --ink-3: #5c5b56;
  --solid: #0e0f11;
  --solid-ink: #f4f3f1;
  --pick: #0d99ff;   /* Figma selection blue */
  --guide: #ff3b6b;  /* Figma guide pink */
  --paper: #dcd9cf;  /* Warm kraft inset */
  --rule: #17181a29; /* Hairline divider */
}`;

interface McpKeyRow {
  id: number;
  apiKey: string;
  label: string;
  tier: string;
  usageCount: number;
}

export default function DocsPage() {
  const [keys, setKeys] = useState<McpKeyRow[]>([]);
  const [label, setLabel] = useState("Cursor IDE");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/mcp-key")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.keys)) setKeys(d.keys);
      })
      .catch(() => {});
  }, []);

  const createNewKey = async (e: React.FormEvent) => {
    e.preventDefault();
    playUISound("spring-pop");
    const res = await fetch("/api/mcp-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label }),
    });
    const data = await res.json();
    if (data?.key) {
      setKeys((prev) => [data.key, ...prev]);
    }
  };

  const copySnippet = async (id: string, content: string) => {
    playUISound("camera-shutter", { volume: 0.22 });
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      // ignore
    }
    setCopiedText(id);
    setTimeout(() => setCopiedText((c) => (c === id ? null : c)), 1600);
  };

  const origin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const primaryKey = keys[0]?.apiKey ?? "bnc_live_demo";

  const claudeCmd = `claude mcp add --transport http bencho "${origin}/api/mcp?key=${primaryKey}"`;

  return (
    <div className="bnc-container" style={{ paddingTop: 44, maxWidth: 980 }}>
      <h1
        className="bnc-heading"
        style={{ margin: "0 0 10px 0", fontSize: "clamp(34px, 4.5vw, 48px)" }}
      >
        Documentation
      </h1>
      <p style={{ margin: "0 0 36px 0", fontSize: 16.5, color: "var(--ink-3)", lineHeight: 1.55 }}>
        How to drop Bencho blocks, CSS custom properties, Web Audio synths, and MCP endpoints
        straight into your codebase.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Section 1: MCP Integration */}
        <section id="mcp" className="bnc-card" style={{ padding: 26, gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Terminal size={18} style={{ color: "var(--pick)" }} />
            <h2 className="bnc-heading" style={{ margin: 0, fontSize: 22 }}>
              1. Connect via MCP (Cursor, Claude Code, Windsurf)
            </h2>
          </div>

          <p style={{ margin: 0, fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55 }}>
            Bencho exposes a live JSON-RPC 2.0 Model Context Protocol endpoint at{" "}
            <code className="bnc-mono">/api/mcp</code> with <code className="bnc-mono">list_blocks</code>,{" "}
            <code className="bnc-mono">pull_block</code>, and{" "}
            <code className="bnc-mono">pull_sound</code> tools.
          </p>

          <div
            style={{
              padding: 14,
              borderRadius: 12,
              background: "#0e0f11",
              color: "#74dcae",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              overflowX: "auto",
            }}
          >
            <code className="bnc-mono" style={{ fontSize: 12, whiteSpace: "nowrap" }}>
              {claudeCmd}
            </code>
            <button
              type="button"
              onClick={() => copySnippet("claude", claudeCmd)}
              className="bnc-btn"
              style={{ height: 28, fontSize: 11.5, flexShrink: 0 }}
            >
              {copiedText === "claude" ? <Check size={12} /> : <Copy size={12} />}
              Copy
            </button>
          </div>

          {/* API Key Generator */}
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: "var(--surface)",
              border: "1px solid var(--rule)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 650 }}>
                <KeyRound size={14} style={{ color: "var(--guide)" }} /> Your Personal MCP Keys
              </span>
              <form onSubmit={createNewKey} style={{ display: "flex", gap: 6 }}>
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Key label"
                  style={{
                    height: 32,
                    padding: "0 10px",
                    borderRadius: 8,
                    border: "1px solid var(--rule-strong)",
                    background: "var(--board)",
                    color: "var(--ink)",
                    fontSize: 12,
                  }}
                />
                <button type="submit" className="bnc-btn bnc-btn-primary" style={{ height: 32, fontSize: 12 }}>
                  <Plus size={13} /> Mint Key
                </button>
              </form>
            </div>

            {keys.map((k) => (
              <div
                key={k.id}
                className="bnc-mono"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 9,
                  background: "var(--board)",
                  border: "1px solid var(--rule)",
                  fontSize: 12,
                }}
              >
                <div>
                  <strong>{k.label}</strong>{" "}
                  <span style={{ color: "var(--pick)" }}>{k.apiKey}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "var(--ink-4)", fontSize: 11 }}>
                    {k.tier.toUpperCase()} · {k.usageCount} pulls
                  </span>
                  <button
                    type="button"
                    onClick={() => copySnippet(`key-${k.id}`, k.apiKey)}
                    className="bnc-btn"
                    style={{ height: 26, fontSize: 11, padding: "0 8px" }}
                  >
                    {copiedText === `key-${k.id}` ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Design System Tokens */}
        <section className="bnc-card" style={{ padding: 26, gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 className="bnc-heading" style={{ margin: 0, fontSize: 22 }}>
              2. Design Tokens (:root CSS Custom Properties)
            </h2>
            <button
              type="button"
              onClick={() => copySnippet("tokens", ROOT_TOKENS_SNIPPET)}
              className="bnc-btn"
            >
              {copiedText === "tokens" ? <Check size={13} /> : <Copy size={13} />}
              Copy :root
            </button>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "var(--ink-3)" }}>
            Every Bencho component reads semantic CSS custom properties with warm archival paper
            insets (<code className="bnc-mono">#dcd9cf</code>), Figma selection blue (
            <code className="bnc-mono">#0d99ff</code>), and automatic dark-mode overrides.
          </p>
          <pre
            className="bnc-mono"
            style={{
              margin: 0,
              padding: 16,
              borderRadius: 12,
              background: "#0e0f11",
              color: "#f4f3f1",
              fontSize: 12,
              lineHeight: 1.55,
              overflowX: "auto",
            }}
          >
            {ROOT_TOKENS_SNIPPET}
          </pre>
        </section>

        {/* Section 3: Craft & Micro-Interaction Engineering Notes */}
        <section className="bnc-card" style={{ padding: 26, gap: 12 }}>
          <h2 className="bnc-heading" style={{ margin: 0, fontSize: 22 }}>
            3. Micro-Interaction Craft &amp; Browser Hardening
          </h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontSize: 14,
              color: "var(--ink-2)",
              lineHeight: 1.55,
            }}
          >
            <li>
              <strong>3-Layer Pinch-Zoom Defense:</strong> Combines{" "}
              <code className="bnc-mono">maximum-scale=1, user-scalable=no</code>, iOS WebKit{" "}
              <code className="bnc-mono">gesturestart</code> prevention, and{" "}
              <code className="bnc-mono">body &#123; touch-action: pan-x pan-y &#125;</code> so
              multi-touch canvas drags never accidentally zoom the viewport.
            </li>
            <li>
              <strong>Browser-Tab Adaptive Favicon:</strong> Inline data-URI SVG embeds its own{" "}
              <code className="bnc-mono">@media (prefers-color-scheme)</code> rule so the goat
              orbital icon matches the browser tab bar rather than page theme state.
            </li>
            <li>
              <strong>Per-Block Lazy Chunks:</strong> Every block is dynamically imported into an
              isolated JavaScript chunk so initial catalog hydration stays razor-fast.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
