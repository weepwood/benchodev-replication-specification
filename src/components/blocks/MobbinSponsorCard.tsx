"use client";

import React from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function MobbinSponsorCard() {
  const mx = useMotionValue(160);
  const my = useMotionValue(120);

  const prism = useMotionTemplate`radial-gradient(240px circle at ${mx}px ${my}px, rgba(13,153,255,0.34), rgba(255,59,107,0.22) 45%, transparent 80%)`;

  return (
    <div
      className="bnc-card bnc-holo-card"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - rect.left);
        my.set(e.clientY - rect.top);
      }}
      style={{
        minHeight: 320,
        justifyContent: "space-between",
        padding: 20,
      }}
    >
      <div className="bnc-holo-foil" />
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: prism,
          pointerEvents: "none",
        }}
      />

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
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 10.5,
            padding: "3px 9px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#f4f3f1",
          }}
        >
          <Sparkles size={11} style={{ color: "#f2c46d" }} />
          SPONSORED
        </span>

        <Link
          href="/sponsor"
          style={{
            fontSize: 11.5,
            color: "rgba(244,243,241,0.72)",
            textDecoration: "none",
          }}
        >
          Book a slot →
        </Link>
      </div>

      {/* Holographic specimen centerpiece */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          margin: "18px 0",
          padding: "18px 16px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.14)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          className="bnc-heading"
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            marginBottom: 6,
          }}
        >
          Mobbin
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.5,
            color: "rgba(244,243,241,0.82)",
          }}
        >
          400,000+ real-world iOS & Web UI flows. Discover proven patterns before you build.
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
        <span className="bnc-mono" style={{ fontSize: 11, color: "rgba(244,243,241,0.65)" }}>
          mobbin.com · partner
        </span>
        <Link
          href="/sponsor"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "6px 12px",
            borderRadius: 999,
            background: "#ffffff",
            color: "#0e0f11",
            fontSize: 12,
            fontWeight: 650,
            textDecoration: "none",
          }}
        >
          Explore <ArrowUpRight size={13} />
        </Link>
      </div>
    </div>
  );
}
