"use client";

import { useEffect } from "react";

/** A single passive pointer listener powers the two CSS spotlights site-wide. */
export function AmbientSpotlight() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    const paint = () => {
      root.style.setProperty("--mouse-x", `${x}px`);
      root.style.setProperty("--mouse-y", `${y}px`);
      frame = 0;
    };
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", move, { passive: true });
    paint();
    return () => {
      window.removeEventListener("pointermove", move);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
