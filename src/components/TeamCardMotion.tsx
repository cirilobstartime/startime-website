"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";

type TeamCardMotionProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/** A cinematic, people-specific reveal for the Join Us team grid. */
export function TeamCardMotion({
  children,
  className,
  delay = 0,
}: TeamCardMotionProps) {
  const reduceMotion = useReducedMotion();
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <motion.article
      className={`${className || ""} team-card-motion${
        isRevealed && !reduceMotion ? " team-card-motion--revealed" : ""
      }`}
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: 38, scale: 0.975, rotateX: -5 }
      }
      onViewportEnter={() => setIsRevealed(true)}
      transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ amount: 0.18, once: true }}
      whileInView={
        reduceMotion
          ? undefined
          : { opacity: 1, y: 0, scale: 1, rotateX: 0 }
      }
      whileHover={
        reduceMotion
          ? undefined
          : { y: -6, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }
      }
    >
      {children}
    </motion.article>
  );
}
