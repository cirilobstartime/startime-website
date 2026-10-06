"use client";

import { useRef, type FocusEvent, type MouseEvent, type ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react/CaretDown";

const desktopHoverQuery = "(min-width: 901px) and (hover: hover) and (pointer: fine)";

export function HoverDisclosure({ className, label, children }: { className: string; label: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const hasDesktopHover = () => window.matchMedia(desktopHoverQuery).matches;
  const onBlur = (event: FocusEvent<HTMLDetailsElement>) => {
    if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
      event.currentTarget.open = false;
    }
  };
  const onSummaryClick = (event: MouseEvent<HTMLElement>) => {
    if (hasDesktopHover() && event.detail > 0) event.preventDefault();
  };

  return (
    <details
      className={className}
      ref={ref}
      onMouseEnter={() => { if (hasDesktopHover() && ref.current) ref.current.open = true; }}
      onMouseLeave={() => { if (hasDesktopHover() && ref.current) ref.current.open = false; }}
      onBlur={onBlur}
    >
      <summary onClick={onSummaryClick}>{label}<CaretDown aria-hidden="true" weight="bold" /></summary>
      <div>{children}</div>
    </details>
  );
}
