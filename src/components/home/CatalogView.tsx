"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  Copy,
  Heart,
  Search,
  Sparkles,
  Terminal,
  Volume2,
} from "lucide-react";
import {
  ALL_138_BLOCKS,
  FEATURED_BLOCKS,
  generateBlockSourceCode,
  type BlockMeta,
  type InteractionKind,
} from "@/lib/blocksCatalog";
import { LazyBlockStage } from "@/components/blocks/LazyBlockStage";
import { MobbinSponsorCard } from "@/components/blocks/MobbinSponsorCard";
import { playUISound } from "@/lib/soundEngine";

const FILTER_KINDS: Array<"All" | InteractionKind> = [
  "All",
  "Press",
  "Hover",
  "Drag",
  "Type",
  "Loading",
];

const KIND_ACCENTS: Record<InteractionKind, string> = {
  Press: "#0d99ff",
  Hover: "#e09a12",
  Drag: "#ff3b6b",
  Type: "#1f9d55",
  Loading: "#9d7bf5",
};

export function CatalogView() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("c") ?? "";

  const [activeKind, setActiveKind] = useState<"All" | InteractionKind>("All");
  const [search, setSearch] = useState(initialQuery);
  const [showFullArchive, setShowFullArchive] = useState(Boolean(initialQuery));
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statsMap, setStatsMap] = useState<
    Record<string, { copyCount: number; likesCount: number; mcpPulls: number }>
  >({});

  useEffect(() => {
    fetch("/api/block-source")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.likedIds)) {
          setLikedIds(new Set(data.likedIds));
        }
        if (data?.stats) {
          setStatsMap(data.stats);
        }
      })
      .catch(() => {});
  }, []);

  const pool = showFullArchive || search.trim() !== "" ? ALL_138_BLOCKS : FEATURED_BLOCKS;

  const kindCounts = useMemo(() => {
    const counts: Record<string, number> = { All: ALL_138_BLOCKS.length };
    for (const k of ["Press", "Hover", "Drag", "Type", "Loading"]) {
      counts[k] = ALL_138_BLOCKS.filter((b) => b.kind === k).length;
    }
    return counts;
  }, []);

  const filteredBlocks = useMemo(() => {
    return pool.filter((b) => {
      const matchesKind = activeKind === "All" || b.kind === activeKind;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        b.id.toLowerCase().includes(q) ||
        b.title.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q) ||
        b.kind.toLowerCase().includes(q);
      return matchesKind && matchesSearch;
    });
  }, [pool, activeKind, search]);

  const handleCopyBlock = async (block: BlockMeta) => {
    playUISound("camera-shutter", { volume: 0.22 });
    const code = generateBlockSourceCode(block);
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard fallback ignored
    }
    setCopiedId(block.id);
    setTimeout(() => setCopiedId((prev) => (prev === block.id ? null : prev)), 1800);

    fetch("/api/block-source", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: block.id, action: "copy" }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.stats) {
          setStatsMap((prev) => ({ ...prev, [block.id]: res.stats }));
        }
      })
      .catch(() => {});
  };

  const handleToggleLike = async (block: BlockMeta) => {
    playUISound("spring-pop", { volume: 0.2 });
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(block.id)) next.delete(block.id);
      else next.add(block.id);
      return next;
    });

    fetch("/api/block-source", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: block.id, action: "like" }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.stats) {
          setStatsMap((prev) => ({ ...prev, [block.id]: res.stats }));
        }
      })
      .catch(() => {});
  };

  return (
    <div className="bnc-container" style={{ paddingTop: 48 }}>
      {/* Hero */}
      <section
        style={{
          maxWidth: 780,
          marginBottom: 40,
        }}
      >
        <div
          className="bnc-mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 11px",
            borderRadius: 999,
            background: "var(--board)",
            border: "1px solid var(--rule)",
            fontSize: 11.5,
            color: "var(--ink-3)",
            marginBottom: 18,
            boxShadow: "inset 0 1px 0 var(--card-top-spec)",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--guide)",
            }}
          />
          <span>EVERYTHING IS LIVE, NOT MOCKED</span>
          <span style={{ color: "var(--ink-5)" }}>·</span>
          <span>138 BLOCKS</span>
        </div>

        <h1
          className="bnc-heading"
          style={{
            margin: "0 0 14px 0",
            fontSize: "clamp(44px, 6vw, 68px)",
            lineHeight: 0.98,
            fontWeight: 700,
          }}
        >
          Bencho
        </h1>

        <p
          style={{
            margin: "0 0 24px 0",
            fontSize: "clamp(17px, 2.1vw, 21px)",
            lineHeight: 1.45,
            color: "var(--ink-3)",
            maxWidth: 640,
          }}
        >
          Explore and interact with a selection of{" "}
          <strong style={{ color: "var(--ink)", fontWeight: 600 }}>
            Blocks and Sounds
          </strong>
          . Tweak physics, copy source, or pull via MCP straight into your projects.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
          <Link
            href="/sounds"
            onClick={() => playUISound("spring-pop")}
            className="bnc-btn"
            style={{ borderRadius: 999, height: 38, padding: "0 16px" }}
          >
            <Volume2 size={14} style={{ color: "var(--pick)" }} />
            Explore UI Sounds (16)
          </Link>

          <Link
            href="/docs#mcp"
            onClick={() => playUISound("micro-detent")}
            className="bnc-btn"
            style={{ borderRadius: 999, height: 38, padding: "0 16px" }}
          >
            <Terminal size={14} style={{ color: "var(--guide)" }} />
            Connect MCP Server
          </Link>
        </div>
      </section>

      {/* Filter Toolbar: 5 Interaction Chips + Search + Archive Switch */}
      <section
        aria-label="Filter blocks by interaction kind"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          paddingBottom: 22,
          marginBottom: 24,
          borderBottom: "1px solid var(--rule)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          {FILTER_KINDS.map((kind) => {
            const active = activeKind === kind;
            return (
              <button
                key={kind}
                type="button"
                data-active={active}
                onClick={() => {
                  playUISound("micro-detent");
                  setActiveKind(kind);
                }}
                className="bnc-chip"
              >
                {kind !== "All" && (
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: active ? "#fff" : KIND_ACCENTS[kind],
                    }}
                  />
                )}
                <span>{kind}</span>
                <span
                  className="bnc-mono"
                  style={{
                    fontSize: 11,
                    opacity: active ? 0.82 : 0.55,
                  }}
                >
                  {kindCounts[kind]}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              height: 36,
              padding: "0 12px",
              borderRadius: 999,
              background: "var(--board)",
              border: "1px solid var(--rule)",
              minWidth: 210,
            }}
          >
            <Search size={14} style={{ color: "var(--ink-4)" }} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter 138 blocks…"
              aria-label="Search blocks"
              style={{
                border: "none",
                background: "transparent",
                color: "var(--ink)",
                fontSize: 13,
                outline: "none",
                width: "100%",
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              playUISound("micro-detent");
              setShowFullArchive((v) => !v);
            }}
            className="bnc-btn"
            style={{ borderRadius: 999, fontSize: 12 }}
          >
            <Sparkles size={13} style={{ color: showFullArchive ? "var(--pick)" : "var(--ink-4)" }} />
            {showFullArchive ? "Showing All 138" : "Expand All 138"}
          </button>
        </div>
      </section>

      {/* Responsive Interactive Block Grid */}
      {filteredBlocks.length === 0 ? (
        <div
          className="bnc-card"
          style={{
            padding: 48,
            alignItems: "center",
            textAlign: "center",
            gap: 12,
          }}
        >
          <p style={{ margin: 0, fontSize: 15, color: "var(--ink-3)" }}>
            No blocks matched &ldquo;{search}&rdquo; in {activeKind}.
          </p>
          <button
            type="button"
            className="bnc-btn"
            onClick={() => {
              setSearch("");
              setActiveKind("All");
            }}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(308px, 1fr))",
            gap: 18,
          }}
        >
          {filteredBlocks.map((block, index) => {
            const liked = likedIds.has(block.id);
            const copied = copiedId === block.id;
            const stat = statsMap[block.id];
            const stageClass =
              block.stageStyle === "dots"
                ? "bnc-stage bnc-stage-dots"
                : block.stageStyle === "blueprint"
                ? "bnc-stage bnc-stage-blueprint"
                : "bnc-stage";

            return (
              <React.Fragment key={block.id}>
                {/* Weave Mobbin Holographic Sponsor Card into slot #4 on All view */}
                {index === 4 && activeKind === "All" && !search && <MobbinSponsorCard />}

                <article className="bnc-card">
                  {/* Live Running Interactive Stage */}
                  <div className={stageClass}>
                    {/* Subtle top-left interaction badge */}
                    <span
                      className="bnc-mono"
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        zIndex: 5,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: "var(--board)",
                        border: "1px solid var(--rule)",
                        fontSize: 10.5,
                        color: "var(--ink-3)",
                        pointerEvents: "none",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: KIND_ACCENTS[block.kind],
                        }}
                      />
                      {block.kind}
                    </span>

                    {block.pro && (
                      <span
                        className="bnc-mono"
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          zIndex: 5,
                          padding: "2px 7px",
                          borderRadius: 999,
                          background: "var(--solid)",
                          color: "var(--solid-ink)",
                          fontSize: 9.5,
                          fontWeight: 700,
                          pointerEvents: "none",
                        }}
                      >
                        PRO
                      </span>
                    )}

                    <LazyBlockStage block={block} />
                  </div>

                  {/* Card Footer Meta & Quick Actions */}
                  <div
                    style={{
                      padding: "13px 15px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <Link
                      href={`/blocks/${block.id}`}
                      onClick={() => playUISound("micro-detent")}
                      style={{
                        textDecoration: "none",
                        color: "var(--ink)",
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 14.5,
                          fontWeight: 650,
                          letterSpacing: "-0.015em",
                        }}
                      >
                        <span>{block.title}</span>
                        <ArrowUpRight size={13} style={{ color: "var(--ink-4)" }} />
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--ink-4)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginTop: 2,
                        }}
                      >
                        {block.tagline}
                      </div>
                    </Link>

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => handleToggleLike(block)}
                        aria-label={liked ? `Unlike ${block.title}` : `Like ${block.title}`}
                        title="Bookmark block"
                        className="bnc-btn"
                        style={{
                          height: 30,
                          padding: "0 9px",
                          borderRadius: 8,
                          fontSize: 11.5,
                          color: liked ? "var(--guide)" : "var(--ink-3)",
                        }}
                      >
                        <Heart
                          size={13}
                          fill={liked ? "var(--guide)" : "transparent"}
                          color={liked ? "var(--guide)" : "currentColor"}
                        />
                        {stat?.likesCount !== undefined && (
                          <span className="bnc-mono">{stat.likesCount}</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyBlock(block)}
                        aria-label={`Copy ${block.title} source code`}
                        title="Copy standalone TSX source"
                        className="bnc-btn"
                        style={{
                          height: 30,
                          padding: "0 9px",
                          borderRadius: 8,
                          fontSize: 11.5,
                          color: copied ? "var(--ok)" : "var(--ink-2)",
                        }}
                      >
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                </article>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
