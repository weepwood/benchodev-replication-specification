"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Copy,
  Heart,
  RotateCcw,
  Sliders,
  Terminal,
  Volume2,
  Zap,
} from "lucide-react";
import {
  FEATURED_BLOCKS,
  type BlockMeta,
  type BlockTweakConfig,
} from "@/lib/blocksCatalog";
import { LazyBlockStage } from "./LazyBlockStage";
import { playUISound } from "@/lib/soundEngine";

const ACCENT_SWATCHES = [
  "#0d99ff",
  "#ff3b6b",
  "#1f9d55",
  "#e09a12",
  "#9d7bf5",
  "#b8431c",
];

type CanvasBackdrop = "paper" | "dots" | "blueprint" | "board" | "dark";

export function BlockDetailStudio({ block }: { block: BlockMeta }) {
  const [tweaks, setTweaks] = useState<BlockTweakConfig>(block.defaultTweaks);
  const [backdrop, setBackdrop] = useState<CanvasBackdrop>(
    block.stageStyle === "blueprint"
      ? "blueprint"
      : block.stageStyle === "dots"
      ? "dots"
      : "paper"
  );
  const [remountKey, setRemountKey] = useState(0);
  const [activeTab, setActiveTab] = useState<"preview" | "source" | "mcp">("preview");

  const [sourceCode, setSourceCode] = useState<string>("");
  const [stats, setStats] = useState({ copyCount: 24, likesCount: 18, mcpPulls: 9 });
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const [mcpKey, setMcpKey] = useState<string>("bnc_live_loading");
  const [mcpResult, setMcpResult] = useState<string | null>(null);
  const [mcpRunning, setMcpRunning] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams({
      id: block.id,
      accent: tweaks.accent,
      stiffness: String(tweaks.stiffness),
      damping: String(tweaks.damping),
      speed: String(tweaks.speed),
    });
    fetch(`/api/block-source?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.source) setSourceCode(d.source);
        if (d?.stats) setStats(d.stats);
        if (typeof d?.liked === "boolean") setLiked(d.liked);
      })
      .catch(() => {});
  }, [block.id, tweaks]);

  useEffect(() => {
    fetch("/api/mcp-key")
      .then((r) => r.json())
      .then((d) => {
        if (d?.keys?.[0]?.apiKey) setMcpKey(d.keys[0].apiKey);
      })
      .catch(() => {});
  }, []);

  const currentIdx = FEATURED_BLOCKS.findIndex((b) => b.id === block.id);
  const prevBlock =
    currentIdx > 0
      ? FEATURED_BLOCKS[currentIdx - 1]
      : FEATURED_BLOCKS[FEATURED_BLOCKS.length - 1];
  const nextBlock =
    currentIdx >= 0 && currentIdx < FEATURED_BLOCKS.length - 1
      ? FEATURED_BLOCKS[currentIdx + 1]
      : FEATURED_BLOCKS[0];

  const handleCopy = async (textToCopy: string) => {
    playUISound("camera-shutter", { volume: 0.24 });
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      // ignore
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);

    fetch("/api/block-source", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: block.id, action: "copy" }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.stats) setStats(d.stats);
      })
      .catch(() => {});
  };

  const handleToggleLike = () => {
    playUISound("spring-pop");
    setLiked((v) => !v);
    fetch("/api/block-source", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: block.id, action: "like" }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.stats) setStats(d.stats);
        if (typeof d?.liked === "boolean") setLiked(d.liked);
      })
      .catch(() => {});
  };

  const runLiveMcpPull = async () => {
    setMcpRunning(true);
    playUISound("orbit-ping", { volume: 0.25 });
    try {
      const res = await fetch(`/api/mcp?key=${encodeURIComponent(mcpKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method: "tools/call",
          params: {
            name: "pull_block",
            arguments: { id: block.id },
          },
        }),
      });
      const json = await res.json();
      setMcpResult(JSON.stringify(json, null, 2));
      setStats((s) => ({ ...s, mcpPulls: s.mcpPulls + 1 }));
    } catch {
      setMcpResult("// Error contacting /api/mcp");
    } finally {
      setMcpRunning(false);
    }
  };

  const stageStyleObj: React.CSSProperties =
    backdrop === "dark"
      ? { background: "#0e0f11", color: "#f4f3f1" }
      : backdrop === "board"
      ? { background: "var(--board)" }
      : {};

  const stageClass =
    backdrop === "dots"
      ? "bnc-stage bnc-stage-dots"
      : backdrop === "blueprint"
      ? "bnc-stage bnc-stage-blueprint"
      : "bnc-stage";

  const origin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  const mcpConfigSnippet = JSON.stringify(
    {
      mcpServers: {
        bencho: {
          url: `${origin}/api/mcp?key=${mcpKey}`,
        },
      },
    },
    null,
    2
  );

  return (
    <div className="bnc-container" style={{ paddingTop: 32 }}>
      {/* Top Breadcrumb + Prev/Next Stepper */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/" className="bnc-btn" style={{ borderRadius: 999 }}>
            <ArrowLeft size={14} /> Catalog
          </Link>
          <span className="bnc-mono" style={{ fontSize: 12, color: "var(--ink-4)" }}>
            / {block.kind} / <strong style={{ color: "var(--ink)" }}>{block.id}</strong>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link
            href={`/blocks/${prevBlock.id}`}
            className="bnc-btn"
            title={`Previous: ${prevBlock.title}`}
          >
            <ArrowLeft size={13} /> {prevBlock.title}
          </Link>
          <Link
            href={`/blocks/${nextBlock.id}`}
            className="bnc-btn"
            title={`Next: ${nextBlock.title}`}
          >
            {nextBlock.title} <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Main Split Studio */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 22,
          alignItems: "start",
        }}
      >
        {/* Left Column (spans wider via flex/grid): Stage + Source/MCP Tabs */}
        <div style={{ gridColumn: "span 1", display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="bnc-card" style={{ padding: 12 }}>
            {/* Mode Switcher Toolbar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                padding: "4px 6px 12px",
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className="bnc-chip"
                  data-active={activeTab === "preview"}
                  style={{ height: 32, fontSize: 12.5 }}
                >
                  Live Stage
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("source")}
                  className="bnc-chip"
                  data-active={activeTab === "source"}
                  style={{ height: 32, fontSize: 12.5 }}
                >
                  <Code2 size={13} /> View Source
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("mcp")}
                  className="bnc-chip"
                  data-active={activeTab === "mcp"}
                  style={{ height: 32, fontSize: 12.5 }}
                >
                  <Terminal size={13} /> Export via MCP
                </button>
              </div>

              {activeTab === "preview" && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {(["paper", "dots", "blueprint", "board", "dark"] as CanvasBackdrop[]).map(
                    (b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          playUISound("vernier-tick");
                          setBackdrop(b);
                        }}
                        className="bnc-mono"
                        style={{
                          padding: "4px 8px",
                          borderRadius: 6,
                          border:
                            backdrop === b
                              ? "1px solid var(--pick)"
                              : "1px solid var(--rule)",
                          background: backdrop === b ? "var(--surface-2)" : "transparent",
                          color: backdrop === b ? "var(--ink)" : "var(--ink-4)",
                          fontSize: 10.5,
                          cursor: "pointer",
                          textTransform: "capitalize",
                        }}
                      >
                        {b}
                      </button>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      playUISound("micro-detent");
                      setRemountKey((k) => k + 1);
                    }}
                    aria-label="Reset block state"
                    title="Reset block state"
                    className="bnc-btn"
                    style={{ height: 28, width: 28, padding: 0 }}
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              )}
            </div>

            {activeTab === "preview" && (
              <div
                key={remountKey}
                className={stageClass}
                style={{
                  margin: 0,
                  height: 390,
                  transform: "scale(1.12)",
                  transformOrigin: "center",
                  ...stageStyleObj,
                }}
              >
                <div style={{ transform: "scale(1.08)" }}>
                  <LazyBlockStage block={block} tweaks={tweaks} compact={false} />
                </div>
              </div>
            )}

            {activeTab === "source" && (
              <div
                style={{
                  borderRadius: 12,
                  background: "#0e0f11",
                  color: "#f4f3f1",
                  padding: 16,
                  overflowX: "auto",
                  maxHeight: 420,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                    paddingBottom: 8,
                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <span className="bnc-mono" style={{ fontSize: 11.5, color: "#9ab8db" }}>
                    src/blocks/{block.id}.tsx
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(sourceCode)}
                    className="bnc-btn bnc-btn-pick"
                    style={{ height: 28, fontSize: 11.5 }}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy TSX"}
                  </button>
                </div>
                <pre
                  className="bnc-mono"
                  style={{
                    margin: 0,
                    fontSize: 12,
                    lineHeight: 1.55,
                    whiteSpace: "pre",
                  }}
                >
                  {sourceCode || "// Loading source from /api/block-source…"}
                </pre>
              </div>
            )}

            {activeTab === "mcp" && (
              <div
                style={{
                  padding: 18,
                  borderRadius: 12,
                  background: "var(--surface)",
                  border: "1px solid var(--rule)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 650, marginBottom: 4 }}>
                    Pull &ldquo;{block.title}&rdquo; straight into Cursor / Claude Code
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
                    Add your live Bencho MCP server URL to <code className="bnc-mono">.cursor/mcp.json</code>{" "}
                    and prompt your agent: <em>&ldquo;Pull {block.id} from Bencho&rdquo;</em>.
                  </div>
                </div>

                <pre
                  className="bnc-mono"
                  style={{
                    margin: 0,
                    padding: 12,
                    borderRadius: 10,
                    background: "#0e0f11",
                    color: "#74dcae",
                    fontSize: 11.5,
                    overflowX: "auto",
                  }}
                >
                  {mcpConfigSnippet}
                </pre>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleCopy(mcpConfigSnippet)}
                    className="bnc-btn"
                  >
                    <Copy size={13} /> Copy mcp.json
                  </button>

                  <button
                    type="button"
                    onClick={runLiveMcpPull}
                    disabled={mcpRunning}
                    className="bnc-btn bnc-btn-pick"
                  >
                    <Zap size={13} />
                    {mcpRunning ? "Pulling via /api/mcp…" : "Test Live MCP Pull"}
                  </button>
                </div>

                {mcpResult && (
                  <pre
                    className="bnc-mono"
                    style={{
                      margin: 0,
                      padding: 12,
                      borderRadius: 10,
                      background: "#0e0f11",
                      color: "#f4f3f1",
                      fontSize: 11,
                      maxHeight: 200,
                      overflow: "auto",
                    }}
                  >
                    {mcpResult}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Meta + Live Physics Tweaks + Direct Actions */}
        <aside className="bnc-card" style={{ padding: 22, gap: 18 }}>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span
                className="bnc-mono"
                style={{
                  fontSize: 11,
                  padding: "3px 9px",
                  borderRadius: 999,
                  background: `${tweaks.accent}1a`,
                  color: tweaks.accent,
                  fontWeight: 700,
                }}
              >
                {block.kind.toUpperCase()}
              </span>

              <button
                type="button"
                onClick={() => playUISound(block.soundId, { force: true })}
                className="bnc-btn"
                style={{ height: 28, fontSize: 11.5, padding: "0 10px" }}
              >
                <Volume2 size={12} style={{ color: tweaks.accent }} />
                Sound: {block.soundId}
              </button>
            </div>

            <h1
              className="bnc-heading"
              style={{ margin: "0 0 8px 0", fontSize: 28, fontWeight: 700 }}
            >
              {block.title}
            </h1>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--ink-3)" }}>
              {block.description}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button
              type="button"
              onClick={() => handleCopy(sourceCode)}
              className="bnc-btn bnc-btn-primary"
              style={{ flex: 1, height: 40 }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied Source" : "Copy Source"}
              <span className="bnc-mono" style={{ opacity: 0.7, fontSize: 11 }}>
                ({stats.copyCount})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("mcp")}
              className="bnc-btn"
              style={{ height: 40 }}
            >
              <Terminal size={14} style={{ color: "var(--pick)" }} />
              MCP ({stats.mcpPulls})
            </button>

            <button
              type="button"
              onClick={handleToggleLike}
              aria-label="Like block"
              className="bnc-btn"
              style={{
                height: 40,
                color: liked ? "var(--guide)" : "var(--ink-2)",
              }}
            >
              <Heart
                size={15}
                fill={liked ? "var(--guide)" : "transparent"}
                color={liked ? "var(--guide)" : "currentColor"}
              />
              <span className="bnc-mono">{stats.likesCount}</span>
            </button>
          </div>

          {/* Live Physics & Token Calibration Panel */}
          <div
            style={{
              padding: 16,
              borderRadius: 14,
              background: "var(--surface)",
              border: "1px solid var(--rule)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12.5,
                  fontWeight: 650,
                }}
              >
                <Sliders size={13} style={{ color: tweaks.accent }} />
                Live Tweak Controls
              </span>
              <button
                type="button"
                onClick={() => {
                  playUISound("micro-detent");
                  setTweaks(block.defaultTweaks);
                }}
                className="bnc-mono"
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 11,
                  color: "var(--ink-4)",
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            </div>

            {/* Accent Color Swatches */}
            <div>
              <div
                className="bnc-mono"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  color: "var(--ink-3)",
                  marginBottom: 6,
                }}
              >
                <span>--pick accent</span>
                <span>{tweaks.accent}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {ACCENT_SWATCHES.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    aria-label={`Set accent ${hex}`}
                    onClick={() => {
                      playUISound("vernier-tick");
                      setTweaks((t) => ({ ...t, accent: hex }));
                    }}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: hex,
                      border:
                        tweaks.accent === hex
                          ? "2.5px solid var(--ink)"
                          : "2px solid transparent",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Stiffness Slider */}
            <label style={{ display: "block" }}>
              <div
                className="bnc-mono"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  color: "var(--ink-3)",
                  marginBottom: 4,
                }}
              >
                <span>Spring stiffness</span>
                <span>{tweaks.stiffness}</span>
              </div>
              <input
                type="range"
                min={140}
                max={600}
                step={10}
                value={tweaks.stiffness}
                onChange={(e) =>
                  setTweaks((t) => ({ ...t, stiffness: Number(e.target.value) }))
                }
                style={{ width: "100%", accentColor: tweaks.accent }}
              />
            </label>

            {/* Damping Slider */}
            <label style={{ display: "block" }}>
              <div
                className="bnc-mono"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  color: "var(--ink-3)",
                  marginBottom: 4,
                }}
              >
                <span>Spring damping</span>
                <span>{tweaks.damping}</span>
              </div>
              <input
                type="range"
                min={10}
                max={42}
                step={1}
                value={tweaks.damping}
                onChange={(e) =>
                  setTweaks((t) => ({ ...t, damping: Number(e.target.value) }))
                }
                style={{ width: "100%", accentColor: tweaks.accent }}
              />
            </label>

            {/* Speed Multiplier */}
            <label style={{ display: "block" }}>
              <div
                className="bnc-mono"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  color: "var(--ink-3)",
                  marginBottom: 4,
                }}
              >
                <span>Time scale</span>
                <span>{tweaks.speed.toFixed(1)}×</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={tweaks.speed}
                onChange={(e) =>
                  setTweaks((t) => ({ ...t, speed: Number(e.target.value) }))
                }
                style={{ width: "100%", accentColor: tweaks.accent }}
              />
            </label>
          </div>
        </aside>
      </div>
    </div>
  );
}
