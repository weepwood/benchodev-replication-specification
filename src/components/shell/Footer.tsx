import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        marginTop: 84,
        borderTop: "1px solid var(--rule)",
        background: "var(--board)",
      }}
    >
      <div
        className="bnc-container"
        style={{
          paddingTop: 36,
          paddingBottom: 42,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              className="bnc-heading"
              style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}
            >
              Bencho
            </span>
            <span style={{ color: "var(--ink-4)", fontSize: 13 }}>
              · run by <strong style={{ color: "var(--ink-2)", fontWeight: 600 }}>Lorenzo Cabra</strong>
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--ink-4)" }}>
            Live, interactive UI blocks and tactile sounds. Everything is live, not mocked.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 18,
            fontSize: 13,
          }}
        >
          <Link href="/" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
            Catalog (138)
          </Link>
          <Link href="/sounds" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
            Sounds
          </Link>
          <Link href="/docs" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
            MCP Server
          </Link>
          <Link href="/sponsor" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
            Sponsor
          </Link>
          <Link href="/sponsor/apply" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
            Apply
          </Link>
          <Link href="/pro" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
            Pro
          </Link>
        </div>
      </div>
    </footer>
  );
}
