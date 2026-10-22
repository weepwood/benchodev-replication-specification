"use client";

import React, { useId, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { LiveBlockProps } from "../types";

export default function Metaballs({ tweaks }: LiveBlockProps) {
  const rawId = useId().replace(/:/g, "");
  const filterId = `bnc-goo-${rawId}`;
  const accent = tweaks?.accent ?? "#ff3b6b";
  const stiffness = tweaks?.stiffness ?? 240;
  const damping = tweaks?.damping ?? 19;

  const mx = useMotionValue(115);
  const my = useMotionValue(80);
  const sx = useSpring(mx, { stiffness, damping });
  const sy = useSpring(my, { stiffness, damping });
  const [split, setSplit] = useState(false);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setSplit((s) => !s);
      }}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - rect.left);
        my.set(e.clientY - rect.top);
      }}
      onPointerLeave={() => {
        mx.set(115);
        my.set(80);
      }}
      style={{
        position: "relative",
        width: 230,
        height: 160,
        cursor: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none",
      }}
    >
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          filter: `url(#${filterId})`,
        }}
      >
        {/* Central core */}
        <motion.div
          animate={{
            x: split ? 72 : 91,
            y: 56,
            scale: split ? 0.88 : 1.05,
          }}
          transition={{ type: "spring", stiffness, damping }}
          style={{
            position: "absolute",
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: accent,
          }}
        />

        {/* Orbiting droplet 1 */}
        <motion.div
          animate={{
            x: split ? [136, 118, 136] : [114, 72, 114],
            y: split ? [42, 78, 42] : [40, 82, 40],
          }}
          transition={{
            duration: 3.6 / (tweaks?.speed ?? 1),
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: accent,
          }}
        />

        {/* Orbiting droplet 2 */}
        <motion.div
          animate={{
            x: [68, 128, 68],
            y: [78, 48, 78],
          }}
          transition={{
            duration: 4.4 / (tweaks?.speed ?? 1),
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#0d99ff",
          }}
        />

        {/* Pointer follower droplet */}
        <motion.div
          style={{
            position: "absolute",
            x: sx,
            y: sy,
            marginLeft: -17,
            marginTop: -17,
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: accent,
          }}
        />
      </div>

      <span
        className="bnc-mono"
        style={{
          position: "absolute",
          bottom: 6,
          fontSize: 10.5,
          color: "var(--ink-4)",
          pointerEvents: "none",
        }}
      >
        move cursor · click to split
      </span>
    </div>
  );
}
