"use client";

import { useEffect } from "react";
import { initSoundPreference } from "@/lib/soundEngine";

/**
 * Layer 2 of Bencho's 3-layer pinch-zoom defense:
 * Blocks iOS Safari WebKit gesturestart/gesturechange/gestureend and ctrl+wheel zoom.
 */
export function PinchZoomGuard() {
  useEffect(() => {
    initSoundPreference();

    const preventGesture = (e: Event) => {
      e.preventDefault();
    };

    const preventCtrlWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    document.addEventListener("gesturestart", preventGesture, { passive: false });
    document.addEventListener("gesturechange", preventGesture, { passive: false });
    document.addEventListener("gestureend", preventGesture, { passive: false });
    window.addEventListener("wheel", preventCtrlWheel, { passive: false });

    return () => {
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("gestureend", preventGesture);
      window.removeEventListener("wheel", preventCtrlWheel);
    };
  }, []);

  return null;
}
