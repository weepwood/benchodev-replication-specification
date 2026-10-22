"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Code2,
  Download,
  Heart,
  Play,
  SkipForward,
  Sliders,
  Volume2,
} from "lucide-react";
import {
  UI_SOUNDS,
  generateSoundCodeSnippet,
  playUISound,
  renderSoundToWavBlob,
  type SoundCategory,
  type UISoundItem,
} from "@/lib/soundEngine";

const CATEGORIES: SoundCategory[] = [
  "All",
  "Press",
  "Toggle",
  "Hover",
  "Mechanical",
  "Whoosh",
  "Success",
  "Notify",
];

export default function SoundsPage() {
  const [category, setCategory] = useState<SoundCategory>("All");
  const [pitch, setPitch] = useState<number>(1.0);
  const [crispness, setCrispness] = useState<number>(1.0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [statsMap, setStatsMap] = useState<
    Record<string, { playsCount: number; downloadsCount: number; likesCount: number }>
  >({});

  useEffect(() => {
    fetch("/api/sounds")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.likedIds)) setLikedIds(new Set(d.likedIds));
        if (d?.stats) setStatsMap(d.stats);
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(
    () =>
      category === "All"
        ? UI_SOUNDS
        : UI_SOUNDS.filter((s) => s.category === category),
    [category]
  );

  const triggerPlay = (sound: UISoundItem) => {
    playUISound(sound, { pitch, crispness, volume: 0.45, force: true });
    setPlayingId(sound.id);
    setTimeout(() => {
      setPlayingId((cur) => (cur === sound.id ? null : cur));
    }, Math.max(240, sound.durationMs + 140));

    fetch("/api/sounds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sound.id, action: "play" }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.stats) setStatsMap((p) => ({ ...p, [sound.id]: res.stats }));
      })
      .catch(() => {});
  };

  const handleAuditionNext = () => {
    const idx = filtered.findIndex((s) => s.id === playingId);
    const next = filtered[(idx + 1) % filtered.length] ?? filtered[0];
    if (next) triggerPlay(next);
  };

  const handleDownloadWav = async (sound: UISoundItem) => {
    triggerPlay(sound);
    const blob = await renderSoundToWavBlob(sound, { pitch, crispness });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bencho-${sound.id}.wav`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    fetch("/api/sounds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sound.id, action: "download" }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.stats) setStatsMap((p) => ({ ...p, [sound.id]: res.stats }));
      })
      .catch(() => {});
  };

  const handleCopySnippet = async (sound: UISoundItem) => {
    triggerPlay(sound);
    const code = generateSoundCodeSnippet(sound, pitch, crispness);
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore
    }
    setCopiedId(sound.id);
    setTimeout(() => setCopiedId((c) => (c === sound.id ? null : c)), 1800);
  };

  const handleToggleLike = (sound: UISoundItem) => {
    playUISound("spring-pop", { force: true, volume: 0.25 });
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(sound.id)) next.delete(sound.id);
      else next.add(sound.id);
      return next;
    });

    fetch("/api/sounds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sound.id, action: "like" }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.stats) setStatsMap((p) => ({ ...p, [sound.id]: res.stats }));
      })
      .catch(() => {});
  };

  return (
    <div className="bnc-container" style={{ paddingTop: 44 }}>
      {/* Hero */}
      <section style={{ maxWidth: 740, marginBottom: 34 }}>
        <div
          className="bnc-mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "4px 11px",
            borderRadius: 999,
            background: "var(--board)",
            border: "1px solid var(--rule)",
            fontSize: 11.5,
            color: "var(--ink-3)",
            marginBottom: 16,
          }}
        >
          <Volume2 size={12} style={{ color: "var(--pick)" }} />
          <span>ZERO-LATENCY PROCEDURAL ACOUSTICS · 44.1KHZ WAV + TS</span>
        </div>

        <h1
          className="bnc-heading"
          style={{
            margin: "0 0 12px 0",
            fontSize: "clamp(36px, 5vw, 54px)",
            fontWeight: 700,
          }}
        >
          UI Sounds
        </h1>
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: "var(--ink-3)" }}>
          Tactile detents, warm polycarbonate switches, and subtle harmonic confirms.
          Preview live in browser, tune pitch &amp; crispness, download{" "}
          <code className="bnc-mono">.wav</code>, or copy a 20-line zero-asset Web Audio
          function.
        </p>
      </section>

      {/* Master Acoustic Calibration Deck */}
      <section
        className="bnc-card"
        style={{
          padding: "16px 20px",
          marginBottom: 24,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 22 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 13,
              fontWeight: 650,
            }}
          >
            <Sliders size={14} style={{ color: "var(--pick)" }} />
            Acoustic Rack
          </span>

          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="bnc-mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
              Pitch {pitch.toFixed(2)}×
            </span>
            <input
              type="range"
              min={0.75}
              max={1.45}
              step={0.05}
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              style={{ width: 120, accentColor: "var(--pick)" }}
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="bnc-mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
              Crispness {crispness.toFixed(2)}
            </span>
            <input
              type="range"
              min={0.5}
              max={1.4}
              step={0.05}
              value={crispness}
              onChange={(e) => setCrispness(Number(e.target.value))}
              style={{ width: 120, accentColor: "var(--guide)" }}
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleAuditionNext}
          className="bnc-btn bnc-btn-primary"
          style={{ borderRadius: 999 }}
        >
          <SkipForward size={14} /> Audition Next
        </button>
      </section>

      {/* Category Chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 24,
        }}
      >
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            data-active={category === c}
            onClick={() => {
              playUISound("micro-detent");
              setCategory(c);
            }}
            className="bnc-chip"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Sound Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
          gap: 16,
        }}
      >
        {filtered.map((sound) => {
          const isPlaying = playingId === sound.id;
          const isCopied = copiedId === sound.id;
          const isLiked = likedIds.has(sound.id);
          const stat = statsMap[sound.id];

          return (
            <article key={sound.id} className="bnc-card" style={{ padding: 16, gap: 14 }}>
              {/* Waveform Stage */}
              <div
                onClick={() => triggerPlay(sound)}
                style={{
                  height: 104,
                  borderRadius: 12,
                  background: "var(--paper-2)",
                  border: `1px solid ${isPlaying ? sound.accent : "var(--rule)"}`,
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    className="bnc-mono"
                    style={{
                      fontSize: 10.5,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "var(--board)",
                      color: sound.accent,
                      fontWeight: 700,
                    }}
                  >
                    {sound.category}
                  </span>
                  <span className="bnc-mono" style={{ fontSize: 10.5, color: "var(--ink-4)" }}>
                    {sound.durationMs}ms · {Math.round(sound.baseFreq * pitch)}Hz
                  </span>
                </div>

                {/* Tactile 20-bar envelope visualizer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 40,
                    gap: 3,
                  }}
                >
                  {Array.from({ length: 22 }).map((_, i) => {
                    const env = Math.exp(-i / 6.5) * (0.45 + ((i * 7) % 5) * 0.14);
                    const baseH = Math.max(4, Math.round(env * 34));
                    return (
                      <motion.span
                        key={i}
                        animate={{
                          height: isPlaying ? [baseH, Math.min(38, baseH * 1.65), baseH] : baseH,
                          backgroundColor: isPlaying ? sound.accent : "var(--ink-4)",
                        }}
                        transition={{ duration: 0.24, delay: i * 0.008 }}
                        style={{
                          flex: 1,
                          borderRadius: 99,
                          opacity: isPlaying ? 1 : 0.45,
                          display: "block",
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Meta */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 650 }}>
                    {sound.name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleToggleLike(sound)}
                    aria-label={`Bookmark ${sound.name}`}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: isLiked ? "var(--guide)" : "var(--ink-4)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11.5,
                      cursor: "pointer",
                    }}
                  >
                    <Heart
                      size={13}
                      fill={isLiked ? "var(--guide)" : "transparent"}
                      color={isLiked ? "var(--guide)" : "currentColor"}
                    />
                    <span className="bnc-mono">{stat?.likesCount ?? 19}</span>
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.45 }}>
                  {sound.description}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
                <button
                  type="button"
                  onClick={() => triggerPlay(sound)}
                  className="bnc-btn bnc-btn-primary"
                  style={{ flex: 1, height: 34, fontSize: 12 }}
                >
                  <Play size={12} fill="currentColor" /> Play
                </button>

                <button
                  type="button"
                  onClick={() => handleCopySnippet(sound)}
                  title="Copy zero-dependency Web Audio TypeScript function"
                  className="bnc-btn"
                  style={{ height: 34, fontSize: 12, padding: "0 10px" }}
                >
                  {isCopied ? <Check size={13} style={{ color: "var(--ok)" }} /> : <Code2 size={13} />}
                  <span>{isCopied ? "Copied" : "TS"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadWav(sound)}
                  title="Download rendered 44.1kHz .wav file"
                  className="bnc-btn"
                  style={{ height: 34, fontSize: 12, padding: "0 10px" }}
                >
                  <Download size={13} />
                  <span>WAV</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
