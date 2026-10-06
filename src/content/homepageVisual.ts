import type { CSSProperties } from "react";
import { iconDimensionStyle, type IconDimensions } from "./iconDimensions";

export type TextRoleStyle = {
  color?: string | null;
  mobile?: number | null;
  tablet?: number | null;
  laptop?: number | null;
  desktop?: number | null;
  imac?: number | null;
};

export type HomepageVisual = {
  iconDimensions?: IconDimensions;
  backgroundColor?: string | null;
  backgroundPreset?: "light" | "dark" | "brand" | "transparent";
  spacingPreset?: "compact" | "standard" | "large";
  textStyles?: {
    eyebrow?: TextRoleStyle;
    heading?: TextRoleStyle;
    body?: TextRoleStyle;
    itemHeading?: TextRoleStyle;
    itemBody?: TextRoleStyle;
    cta?: TextRoleStyle;
    number?: TextRoleStyle;
  };
  detailColors?: { ctaText?: string | null; ctaBackground?: string | null; icon?: string | null; line?: string | null; number?: string | null; pattern?: string | null };
};

export type HomepageItemVisual = { title?: TextRoleStyle; body?: TextRoleStyle; background?: string | null; border?: string | null; icon?: string | null; iconDimensions?: IconDimensions };

const hex = (value: unknown): value is string => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
const size = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 10 && value <= 160;

/** Sanitize server-side CMS values before exposing them as CSS custom properties. */
export function homepageVisualStyle(visual?: HomepageVisual): CSSProperties {
  if (!visual) return {};
  const properties: Record<string, string> = {};
  if (hex(visual.backgroundColor)) properties["--cms-section-background"] = visual.backgroundColor;
  else if (visual.backgroundPreset) {
    properties["--cms-section-background"] = {
      light: "#ffffff", dark: "#171328", brand: "#2e2449", transparent: "transparent",
    }[visual.backgroundPreset];
  }
  const background = properties["--cms-section-background"];
  if (hex(background)) {
    const channels = [1, 3, 5].map((offset) => parseInt(background.slice(offset, offset + 2), 16) / 255);
    const luminance = channels.reduce((sum, channel, index) => sum + [0.2126, 0.7152, 0.0722][index] * (channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4), 0);
    const theme = luminance > .35 ? "light" : "dark";
    properties["--cms-background-tone"] = theme;
  }
  if (visual.spacingPreset) properties["--cms-section-padding"] = {
    compact: "clamp(2rem, 4vw, 3rem)",
    standard: "clamp(3rem, 5vw, 4.5rem)",
    large: "clamp(4rem, 6vw, 6rem)",
  }[visual.spacingPreset];
  for (const [key, value] of Object.entries(visual.detailColors || {})) {
    if (hex(value)) properties[`--cms-detail-${key}`] = value;
  }
  for (const role of ["eyebrow", "heading", "body", "itemHeading", "itemBody", "cta", "number"] as const) {
    const settings = visual.textStyles?.[role];
    if (!settings) continue;
    if (hex(settings.color)) properties[`--cms-${role}-color`] = settings.color;
    for (const breakpoint of ["mobile", "tablet", "laptop", "desktop", "imac"] as const) {
      if (size(settings[breakpoint])) properties[`--cms-${role}-${breakpoint}`] = `${settings[breakpoint]}px`;
    }
  }
  return { ...properties, ...iconDimensionStyle(visual.iconDimensions) } as CSSProperties;
}

export function homepageItemStyle(visual?: HomepageItemVisual): CSSProperties {
  if (!visual) return {};
  const properties: Record<string, string> = {};
  for (const role of ["title", "body"] as const) {
    const settings = visual[role];
    if (!settings) continue;
    if (hex(settings.color)) properties[`--cms-item-${role}-color`] = settings.color;
    for (const breakpoint of ["mobile", "tablet", "laptop", "desktop", "imac"] as const) {
      if (size(settings[breakpoint])) properties[`--cms-item-${role}-${breakpoint}`] = `${settings[breakpoint]}px`;
    }
  }
  if (hex(visual.background)) properties["--cms-item-background"] = visual.background;
  if (hex(visual.border)) properties["--cms-item-border"] = visual.border;
  if (hex(visual.icon)) properties["--cms-item-icon"] = visual.icon;
  return { ...properties, ...iconDimensionStyle(visual.iconDimensions) } as CSSProperties;
}
