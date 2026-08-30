"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 32,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: distance,
            }
      }
      transition={{
        delay,
        type: "spring",
        stiffness: 180,
        damping: 24,
      }}
      viewport={{ amount: 0.15, once: false }}
      whileInView={
        reduceMotion
          ? undefined
          : {
              opacity: 1,
              y: 0,
            }
      }
    >
      {children}
    </motion.div>
  );
}

export function HeroMotion({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion ? false : { opacity: 0, y: 30 }
      }
      animate={
        reduceMotion ? undefined : { opacity: 1, y: 0 }
      }
      transition={{ duration: 1.05, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
