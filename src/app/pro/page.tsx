"use client";

import React, { useEffect, useState } from "react";
import { Check, Lock, Sparkles, Unlock } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";

const PRO_PERKS = [
  "Unlimited MCP pulls across all 138 interactive blocks",
  "Full Pro shader & SVG filter collection (Metaballs, Orbit Cards, Line Sphere)",
  "44.1kHz 16-bit lossless WAV master pack + commercial license",
  "Custom spring & CSS token preset export straight into your repo",
  "Lifetime updates by Lorenzo Cabra — pay once, use in unlimited apps",
];

export default function ProPage() {
  const [email, setEmail] = useState("engineer@studio.dev");
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => {
        if (d?.pro) {
          setIsPro(true);
          if (d?.account?.email) setEmail(d.account.email);
        }
      })
      .catch(() => {});
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unlock", email }),
      });
      const data = await res.json();
      if (data?.pro) {
        playUISound("chime-confirm", { force: true });
        setIsPro(true);
        window.dispatchEvent(new Event("bencho-auth-change"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    playUISound("micro-detent");
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signout" }),
    });
    setIsPro(false);
    window.dispatchEvent(new Event("bencho-auth-change"));
  };

  return (
    <div className="bnc-container" style={{ paddingTop: 44 }}>
      <div
        className="bnc-card"
        style={{
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
      >
        {/* Left: Precision Hardware Lock-Wall Visual (/pro/lock-wall.jpg) */}
        <div
          style={{
            position: "relative",
            minHeight: 380,
            backgroundImage: "url('/pro/lock-wall.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 28,
            color: "#f4f3f1",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(14,15,17,0.45) 0%, rgba(14,15,17,0.86) 100%)",
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            <span
              className="bnc-mono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.14)",
                backdropFilter: "blur(8px)",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {isPro ? <Unlock size={12} color="#74dcae" /> : <Lock size={12} color="#f2c46d" />}
              {isPro ? "PRO VAULT UNLOCKED" : "BENCHO PRO ACCESS"}
            </span>
          </div>

          <div style={{ position: "relative", zIndex: 2 }}>
            <div className="bnc-heading" style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.08 }}>
              Precision craft for shipping teams.
            </div>
            <p style={{ margin: "10px 0 0 0", fontSize: 14, opacity: 0.85, lineHeight: 1.5 }}>
              Every block runs live in the free catalog. Pro unlocks unlimited AI editor MCP
              streaming, commercial sound stems, and advanced physics shaders.
            </p>
          </div>
        </div>

        {/* Right: Pricing & Instant Sandbox Pro Activation */}
        <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div>
              <h1 className="bnc-heading" style={{ margin: 0, fontSize: 28 }}>
                Bencho Pro
              </h1>
              <span style={{ fontSize: 13, color: "var(--ink-4)" }}>
                One-time lifetime pass · No recurring subscription
              </span>
            </div>
            <div className="bnc-heading" style={{ fontSize: 34, fontWeight: 700 }}>
              $89
            </div>
          </div>

          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 11,
            }}
          >
            {PRO_PERKS.map((perk) => (
              <li
                key={perk}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: 13.5,
                  color: "var(--ink-2)",
                }}
              >
                <span
                  style={{
                    marginTop: 2,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "rgba(21,128,61,0.14)",
                    color: "var(--ok)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Check size={12} />
                </span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>

          {isPro ? (
            <div
              style={{
                padding: 16,
                borderRadius: 12,
                background: "var(--surface)",
                border: "1px solid var(--ok)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 650, color: "var(--ok)" }}>
                  ✓ Pro Lifetime Active ({email})
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
                  Your MCP keys and Pro block exports are upgraded.
                </div>
              </div>
              <button type="button" onClick={handleSignOut} className="bnc-btn">
                Lock Vault
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleUnlock}
              style={{
                padding: 16,
                borderRadius: 14,
                background: "var(--surface)",
                border: "1px solid var(--rule)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)" }}>
                Activate Instant Sandbox Pro Pass (persisted in Postgres)
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: 190,
                    height: 40,
                    padding: "0 12px",
                    borderRadius: 10,
                    border: "1px solid var(--rule-strong)",
                    background: "var(--board)",
                    color: "var(--ink)",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bnc-btn bnc-btn-pick"
                  style={{ height: 40, padding: "0 18px", fontWeight: 600 }}
                >
                  <Sparkles size={14} />
                  {loading ? "Unlocking…" : "Unlock Pro Pass"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
