"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { playUISound } from "@/lib/soundEngine";

const SWATCHES = ["#0d99ff", "#ff3b6b", "#1f9d55", "#f2c46d", "#9d7bf5"];

export default function SponsorApplyPage() {
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("https://");
  const [tagline, setTagline] = useState("");
  const [tier, setTier] = useState("flagship-holo");
  const [accentColor, setAccentColor] = useState("#0d99ff");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          contactEmail,
          websiteUrl,
          tagline,
          tier,
          accentColor,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Unable to submit application.");
        playUISound("subtle-alert");
      } else {
        playUISound("chime-confirm");
        setSubmitted(true);
      }
    } catch {
      setError("Network error while saving sponsor application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bnc-container" style={{ paddingTop: 40 }}>
      <Link href="/sponsor" className="bnc-btn" style={{ borderRadius: 999, marginBottom: 24 }}>
        <ArrowLeft size={14} /> Back to Sponsor Wall
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div className="bnc-card" style={{ padding: 26 }}>
          <h1 className="bnc-heading" style={{ margin: "0 0 8px 0", fontSize: 28 }}>
            Apply to Sponsor Bencho
          </h1>
          <p style={{ margin: "0 0 22px 0", fontSize: 14, color: "var(--ink-3)" }}>
            Design your holographic catalog card below. Submitting publishes an instant preview
            card to the Sponsor Wall.
          </p>

          {submitted ? (
            <div
              style={{
                padding: 20,
                borderRadius: 14,
                background: "var(--surface)",
                border: "1px solid var(--ok)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ok)" }}>
                <CheckCircle2 size={18} />
                <strong>Sponsor slot application saved!</strong>
              </div>
              <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-2)" }}>
                Your holographic card for <strong>{companyName}</strong> is now live on the
                Bencho Sponsor Wall.
              </p>
              <div>
                <Link href="/sponsor" className="bnc-btn bnc-btn-primary">
                  View on Sponsor Wall →
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
                <span style={{ fontWeight: 600 }}>Company / Product Name</span>
                <input
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Studio"
                  style={{
                    height: 38,
                    padding: "0 12px",
                    borderRadius: 10,
                    border: "1px solid var(--rule-strong)",
                    background: "var(--surface)",
                    color: "var(--ink)",
                  }}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
                <span style={{ fontWeight: 600 }}>Work Email</span>
                <input
                  required
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="founder@acme.dev"
                  style={{
                    height: 38,
                    padding: "0 12px",
                    borderRadius: 10,
                    border: "1px solid var(--rule-strong)",
                    background: "var(--surface)",
                    color: "var(--ink)",
                  }}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
                <span style={{ fontWeight: 600 }}>Destination URL</span>
                <input
                  required
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://acme.dev"
                  style={{
                    height: 38,
                    padding: "0 12px",
                    borderRadius: 10,
                    border: "1px solid var(--rule-strong)",
                    background: "var(--surface)",
                    color: "var(--ink)",
                  }}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
                <span style={{ fontWeight: 600 }}>Short Pitch (max 160 chars)</span>
                <textarea
                  required
                  rows={3}
                  maxLength={160}
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Zero-config visual regression testing built for design engineers."
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid var(--rule-strong)",
                    background: "var(--surface)",
                    color: "var(--ink)",
                    resize: "vertical",
                  }}
                />
              </label>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
                  <span style={{ fontWeight: 600 }}>Placement Tier</span>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    style={{
                      height: 38,
                      padding: "0 10px",
                      borderRadius: 10,
                      border: "1px solid var(--rule-strong)",
                      background: "var(--surface)",
                      color: "var(--ink)",
                    }}
                  >
                    <option value="flagship-holo">Flagship Holo Grid ($1,800/mo)</option>
                    <option value="grid-card">Catalog Card ($950/mo)</option>
                  </select>
                </label>

                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>
                    Foil Accent
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {SWATCHES.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        aria-label={`Select accent ${hex}`}
                        onClick={() => {
                          playUISound("vernier-tick");
                          setAccentColor(hex);
                        }}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: hex,
                          border:
                            accentColor === hex
                              ? "2.5px solid var(--ink)"
                              : "2px solid transparent",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div style={{ fontSize: 12.5, color: "var(--acc-red)" }}>{error}</div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="bnc-btn bnc-btn-pick"
                style={{ height: 42, fontSize: 13.5, marginTop: 6 }}
              >
                {submitting ? "Submitting…" : "Submit & Publish Preview Card"}
              </button>
            </form>
          )}
        </div>

        {/* Live Holographic Card Preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="bnc-mono" style={{ fontSize: 11.5, color: "var(--ink-4)" }}>
            LIVE CATALOG CARD PREVIEW
          </span>
          <div
            className="bnc-card bnc-holo-card"
            style={{ padding: 24, minHeight: 270, justifyContent: "space-between" }}
          >
            <div className="bnc-holo-foil" />
            <div style={{ position: "relative", zIndex: 2 }}>
              <span
                className="bnc-mono"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 9px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.12)",
                  color: accentColor,
                  fontSize: 10.5,
                  fontWeight: 700,
                }}
              >
                <Sparkles size={11} />
                {tier.toUpperCase()}
              </span>
            </div>

            <div style={{ position: "relative", zIndex: 2, margin: "18px 0" }}>
              <h2 className="bnc-heading" style={{ margin: "0 0 8px 0", fontSize: 26, color: "#fff" }}>
                {companyName || "Your Brand"}
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: "rgba(244,243,241,0.82)", lineHeight: 1.5 }}>
                {tagline ||
                  "Your concise engineering-friendly pitch appears right inside the live block grid."}
              </p>
            </div>

            <div
              className="bnc-mono"
              style={{ position: "relative", zIndex: 2, fontSize: 11.5, opacity: 0.7 }}
            >
              {websiteUrl.replace(/^https?:\/\//, "") || "yourbrand.dev"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
