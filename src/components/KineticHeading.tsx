"use client";

import { useReducedMotion } from "motion/react";

type KineticHeadingProps = {
  children: string;
};

/**
 * Word-level layers give the hero a deliberate scene-like entrance. Arabic is
 * intentionally animated by word (never by character) so connected glyphs
 * remain intact and readable.
 */
export function KineticHeading({ children }: KineticHeadingProps) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <>{children}</>;

  return children.split(/(\s+)/).map((part, index) =>
    /^\s+$/.test(part) ? (
      part
    ) : (
      <span className="kinetic-heading__clip" key={`${part}-${index}`}>
        <span className="kinetic-heading__word">{part}</span>
      </span>
    ),
  );
}
