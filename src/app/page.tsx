import React, { Suspense } from "react";
import { CatalogView } from "@/components/home/CatalogView";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="bnc-container" style={{ paddingTop: 64 }}>
          <div
            className="bnc-shimmer-bar"
            style={{ width: 260, height: 56, borderRadius: 14, marginBottom: 24 }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(308px, 1fr))",
              gap: 18,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bnc-shimmer-bar"
                style={{ height: 320, borderRadius: 18 }}
              />
            ))}
          </div>
        </div>
      }
    >
      <CatalogView />
    </Suspense>
  );
}
