import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="bnc-container"
      style={{
        paddingTop: 84,
        paddingBottom: 64,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="bnc-card"
        style={{
          padding: "40px 36px",
          maxWidth: 460,
          alignItems: "center",
          textAlign: "center",
          gap: 14,
        }}
      >
        <span className="bnc-mono" style={{ fontSize: 12, color: "var(--guide)" }}>
          404 · SPECIMEN NOT FOUND
        </span>
        <h1 className="bnc-heading" style={{ margin: 0, fontSize: 28 }}>
          Block off the grid
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: "var(--ink-3)", lineHeight: 1.5 }}>
          That route or block ID doesn&apos;t exist in the 138-item catalog.
        </p>
        <Link href="/" className="bnc-btn bnc-btn-primary" style={{ marginTop: 6 }}>
          Return to Catalog
        </Link>
      </div>
    </div>
  );
}
