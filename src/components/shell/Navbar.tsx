"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Volume2,
  VolumeX,
  SunMoon,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  isSoundMuted,
  playUISound,
  setSoundMuted,
} from "@/lib/soundEngine";

const NAV_LINKS = [
  { href: "/", label: "Catalog" },
  { href: "/sounds", label: "Sounds" },
  { href: "/sponsor", label: "Sponsor" },
  { href: "/pro", label: "Pro" },
  { href: "/docs", label: "Docs" },
];

export function Navbar() {
  const pathname = usePathname();
  const [muted, setMuted] = useState(false);
  const [themeMode, setThemeMode] = useState<"system" | "light" | "dark">("system");
  const [onlineCount, setOnlineCount] = useState<number>(7);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setMuted(isSoundMuted());
    const savedTheme = window.localStorage.getItem("bencho_theme") as
      | "system"
      | "light"
      | "dark"
      | null;
    if (savedTheme === "light" || savedTheme === "dark") {
      setThemeMode(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }

    const onSoundChange = (e: Event) => {
      const detail = (e as CustomEvent<{ muted: boolean }>).detail;
      setMuted(Boolean(detail?.muted));
    };
    const onAuthChange = () => {
      fetch("/api/auth")
        .then((r) => r.json())
        .then((d) => setIsPro(Boolean(d?.pro)))
        .catch(() => {});
    };

    window.addEventListener("bencho-sound-change", onSoundChange);
    window.addEventListener("bencho-auth-change", onAuthChange);

    // Initial auth + presence check
    onAuthChange();
    fetch("/api/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d?.online === "number") setOnlineCount(d.online);
      })
      .catch(() => {});

    return () => {
      window.removeEventListener("bencho-sound-change", onSoundChange);
      window.removeEventListener("bencho-auth-change", onAuthChange);
    };
  }, [pathname]);

  const cycleTheme = () => {
    playUISound("micro-detent");
    const next =
      themeMode === "system" ? "dark" : themeMode === "dark" ? "light" : "system";
    setThemeMode(next);
    if (next === "system") {
      document.documentElement.removeAttribute("data-theme");
      window.localStorage.removeItem("bencho_theme");
    } else {
      document.documentElement.setAttribute("data-theme", next);
      window.localStorage.setItem("bencho_theme", next);
    }
  };

  const toggleMute = () => {
    const next = !muted;
    setSoundMuted(next);
    setMuted(next);
    if (!next) {
      playUISound("spring-pop", { force: true });
    }
  };

  return (
    <header className="bnc-header">
      <div
        className="bnc-container"
        style={{
          height: 62,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Left Brand Mark: Orbital Ring + Minimalist Mountain Goat */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            href="/"
            onClick={() => playUISound("micro-detent")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "var(--ink)",
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="currentColor"
                strokeOpacity="0.24"
                strokeWidth="1.4"
              />
              <ellipse
                cx="16"
                cy="16"
                rx="14"
                ry="6.5"
                transform="rotate(-24 16 16)"
                stroke="#0d99ff"
                strokeWidth="1.5"
              />
              {/* Stylized geometric ibex / goat horns + head */}
              <path
                d="M12.5 19.5L16 12.5L19.5 19.5M16 12.5C14 8.5 9.8 8.8 9.2 12.2M16 12.5C18 8.5 22.2 8.8 22.8 12.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="27.2" cy="11.2" r="2" fill="#ff3b6b" />
            </svg>
            <span
              className="bnc-heading"
              style={{ fontSize: 18.5, fontWeight: 700, letterSpacing: "-0.03em" }}
            >
              Bencho
            </span>
          </Link>

          <span
            className="bnc-mono hidden sm:inline-flex"
            title="Live explorers currently interacting"
            style={{
              alignItems: "center",
              gap: 6,
              padding: "3px 9px",
              borderRadius: 999,
              background: "var(--board)",
              border: "1px solid var(--rule)",
              fontSize: 11,
              color: "var(--ink-3)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--ok)",
                boxShadow: "0 0 0 3px rgba(21,128,61,0.18)",
              }}
            />
            {onlineCount} live
          </span>
        </div>

        {/* Center / Primary Navigation */}
        <nav
          aria-label="Primary navigation"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            overflowX: "auto",
          }}
        >
          {NAV_LINKS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/" || pathname.startsWith("/blocks")
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => playUISound("vernier-tick", { volume: 0.16 })}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 500,
                  color: active ? "var(--ink)" : "var(--ink-3)",
                  background: active ? "var(--board)" : "transparent",
                  border: active ? "1px solid var(--rule)" : "1px solid transparent",
                  boxShadow: active ? "inset 0 1px 0 var(--card-top-spec)" : "none",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "all 140ms ease",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Audio, Theme, Pro CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute UI sounds" : "Mute UI sounds"}
            title={muted ? "UI sounds muted (click to enable)" : "UI sounds live"}
            className="bnc-btn"
            style={{ width: 36, padding: 0 }}
          >
            {muted ? (
              <VolumeX size={15} style={{ color: "var(--ink-4)" }} />
            ) : (
              <Volume2 size={15} style={{ color: "var(--pick)" }} />
            )}
          </button>

          <button
            type="button"
            onClick={cycleTheme}
            aria-label={`Theme mode: ${themeMode}. Click to switch`}
            title={`Theme: ${themeMode} (click to switch)`}
            className="bnc-btn hidden sm:inline-flex"
            style={{ padding: "0 10px", fontSize: 11.5 }}
          >
            <SunMoon size={14} />
            <span className="bnc-mono" style={{ textTransform: "capitalize" }}>
              {themeMode}
            </span>
          </button>

          <Link
            href="/pro"
            onClick={() => playUISound("micro-detent")}
            className={isPro ? "bnc-btn" : "bnc-btn bnc-btn-primary"}
            style={{
              borderRadius: 999,
              padding: "0 14px",
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            {isPro ? (
              <>
                <CheckCircle2 size={13} style={{ color: "var(--ok)" }} />
                <span>Pro Active</span>
              </>
            ) : (
              <>
                <Sparkles size={13} style={{ color: "#f2c46d" }} />
                <span>Get Pro</span>
              </>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
