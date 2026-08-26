"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  value: string;
};

/**
 * Animates a compact numeric metric once it reaches the viewport, while
 * retaining any surrounding symbols (for example the plus in 500+).
 */
export function AnimatedCounter({ value }: AnimatedCounterProps) {
  const container = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(/^(\D*)(\d[\d,]*)(\D*)$/);
    if (!match || !container.current) return;

    const [, prefix, numericValue, suffix] = match;
    const target = Number(numericValue.replaceAll(",", ""));
    if (!Number.isFinite(target)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      return;
    }

    const node = container.current;
    let frame = 0;
    let started = false;

    const animate = () => {
      if (started) return;
      started = true;
      const startedAt = performance.now();
      // Keep every metric on the same deliberate timeline. A target-derived
      // duration made small values such as 38 finish before users could
      // perceive the animation, while the larger two remained visible.
      const duration = 3200;
      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const current = Math.round(target * progress).toLocaleString("en-US");
        setDisplay(`${prefix}${current}${suffix}`);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        animate();
        observer.disconnect();
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={container}>{display}</span>;
}
