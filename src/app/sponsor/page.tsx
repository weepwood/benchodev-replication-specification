"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, Sparkles, Users } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";

interface SponsorEntry {
  id: string | number;
  companyName: string;
  websiteUrl: string;
  tagline: string;
  tier: string;
  accentColor: string;
  badge?: string;
}

export default function SponsorWallPage() {
  const [featured, setFeatured] = useState<SponsorEntry[]>([]);
  const [community, setCommunity] = useState<SponsorEntry[]>([]);
  const [slotsRemaining, setSlotsRemaining] = useState<number>(2);

  useEffect(() => {
    fetch("/api/sponsors")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.featured)) setFeatured(d.featured);
        if (Array.isArray(d?.applications)) setCommunity(d.applications);
        if (typeof d?.slotsRemaining === "number") setSlotsRemaining(d.slotsRemaining);
      })
      .catch(() => {});
  }, []);

  const allCards = [...featured, ...community];

  return (
    <div className="bnc-container" style={{ paddingTop: 48 }}>
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 20,
          marginBottom: 36,
        }}
      >
        <div style={{ maxWidth: 660 }}>
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
            <Sparkles size={12} style={{ color: "#f2c46d" }} />
            <span>{slotsRemaining} Q2 CATALOG SLOTS AVAILABLE</span>
          </div>

          <h1
            className="bnc-heading"
            style={{
              margin: "0 0 12px 0",
              fontSize: "clamp(36px, 5vw, 54px)",
              fontWeight: 700,
            }}
          >
            Sponsors
          </h1>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: "var(--ink-3)" }}>
            Put your design or developer tool directly inside the live catalog grid explored by
            frontend engineers, design engineers, and AI coding agents.
          </p>
        </div>

        <Link
          href="/sponsor/apply"
          onClick={() => playUISound("spring-pop")}
          className="bnc-btn bnc-btn-pick"
          style={{ height: 42, padding: "0 20px", borderRadius: 999, fontSize: 13.5 }}
        >
          <Plus size={15} /> Apply for a Slot
        </Link>
      </section>

      {/* Audience Metrics Strip */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 14,
          marginBottom: 32,
        }}
      >
        {[
          { label: "Monthly Interactive Sessions", value: "142,000+" },
          { label: "Audience Profile", value: "Design & Frontend Eng" },
          { label: "MCP Editor Pulls / mo", value: "38,400+" },
          { label: "Ad Block Resilience", value: "100% Native Holo Card" },
        ].map((m) => (
          <div key={m.label} className="bnc-card" style={{ padding: "16px 18px" }}>
            <span className="bnc-mono" style={{ fontSize: 11, color: "var(--ink-4)" }}>
              {m.label}
            </span>
            <strong
              className="bnc-heading"
              style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}
            >
              {m.value}
            </strong>
          </div>
        ))}
      </section>

      {/* Sponsor Wall Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 18,
        }}
      >
        {allCards.map((sp) => (
          <article
            key={`${sp.tier}-${sp.id}`}
            className="bnc-card bnc-holo-card"
            style={{ padding: 22, minHeight: 250, justifyContent: "space-between" }}
          >
            <div className="bnc-holo-foil" />

            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                className="bnc-mono"
                style={{
                  fontSize: 10.5,
                  padding: "3px 9px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.12)",
                  color: sp.accentColor || "#f2c46d",
                  fontWeight: 700,
                }}
              >
                {sp.badge ?? sp.tier.toUpperCase()}
              </span>
              <Users size={14} style={{ opacity: 0.6 }} />
            </div>

            <div style={{ position: "relative", zIndex: 2, margin: "18px 0" }}>
              <h2
                className="bnc-heading"
                style={{ margin: "0 0 8px 0", fontSize: 24, color: "#fff" }}
              >
                {sp.companyName}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  color: "rgba(244,243,241,0.82)",
                }}
              >
                {sp.tagline}
              </p>
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span className="bnc-mono" style={{ fontSize: 11, opacity: 0.65 }}>
                {sp.websiteUrl.replace(/^https?:\/\//, "")}
              </span>
              <a
                href={sp.websiteUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: "#fff",
                  color: "#0e0f11",
                  fontSize: 12,
                  fontWeight: 650,
                  textDecoration: "none",
                }}
              >
                Visit <ArrowUpRight size={13} />
              </a>
            </div>
          </article>
        ))}

        {/* Open Slot CTA Card */}
        <Link
          href="/sponsor/apply"
          className="bnc-card"
          style={{
            padding: 24,
            minHeight: 250,
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            borderStyle: "dashed",
            textDecoration: "none",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "var(--surface-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--pick)",
            }}
          >
            <Plus size={20} />
          </span>
          <strong style={{ fontSize: 16, color: "var(--ink)" }}>Reserve Your Grid Card</strong>
          <span style={{ fontSize: 13, color: "var(--ink-3)", maxWidth: 240 }}>
            Preview your holographic card live and publish straight to the sponsor wall.
          </span>
        </Link>
      </div>
    </div>
  );
}
