import type { CSSProperties } from "react";

export const portfolioTopPaddingDefaults = {
  mobile: 88,
  tablet: 104,
  laptop: 109.28,
  desktop: 144,
  imac: 144,
} as const;

export type PortfolioTopPadding = Partial<Record<keyof typeof portfolioTopPaddingDefaults, number>>;

/** Unchanged defaults leave the original fluid CSS intact between reference widths. */
export function portfolioTopPaddingStyle(values?: PortfolioTopPadding): CSSProperties {
  const style: Record<string, string> = {};
  for (const device of Object.keys(portfolioTopPaddingDefaults) as (keyof PortfolioTopPadding)[]) {
    const value = values?.[device];
    if (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 400 && value !== portfolioTopPaddingDefaults[device]) {
      style[`--cms-portfolios-top-${device}`] = `${value}px`;
    }
  }
  return style as CSSProperties;
}
