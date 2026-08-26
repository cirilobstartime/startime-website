"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, { damping: 18, stiffness: 220 });
  const rotateY = useSpring(0, { damping: 18, stiffness: 220 });

  function move(event: PointerEvent<HTMLElement>) {
    if (reduced) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    rotateY.set((x - 0.5) * 8);
    rotateX.set((0.5 - y) * 8);
    event.currentTarget.style.setProperty("--tilt-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--tilt-y", `${y * 100}%`);
  }

  function leave(event: PointerEvent<HTMLElement>) {
    rotateX.set(0);
    rotateY.set(0);
    event.currentTarget.style.removeProperty("--tilt-x");
    event.currentTarget.style.removeProperty("--tilt-y");
  }

  return (
    <motion.div className={`tilt-card ${className}`} onPointerLeave={leave} onPointerMove={move} style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}>
      <div className="tilt-card-glow" aria-hidden />
      {children}
    </motion.div>
  );
}
