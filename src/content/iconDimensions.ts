import type { CSSProperties } from "react";

export const iconScreens = ["mobile", "tablet", "laptop", "desktop", "imac"] as const;
export const iconGroups = ["content", "actions", "carousel", "social", "contact", "forms", "menu"] as const;
export type IconDimensions = Partial<Record<typeof iconScreens[number], { width?: number | null; height?: number | null }>>;
export type IconSettingsData = Partial<Record<typeof iconGroups[number], IconDimensions>>;

export function iconDimensionStyle(dimensions?: IconDimensions, prefix = "--cms-icon"): CSSProperties {
  const style: Record<string, string> = {};
  for (const screen of iconScreens) {
    for (const axis of ["width", "height"] as const) {
      const value = dimensions?.[screen]?.[axis];
      if (typeof value === "number" && Number.isFinite(value) && value >= 4 && value <= 600) style[`${prefix}-${axis}-${screen}`] = `${value}px`;
    }
  }
  return style as CSSProperties;
}

export function globalIconStyle(settings?: IconSettingsData): CSSProperties {
  return Object.assign({}, ...iconGroups.map((group) => iconDimensionStyle(settings?.[group], `--cms-${group}-icon`)));
}
