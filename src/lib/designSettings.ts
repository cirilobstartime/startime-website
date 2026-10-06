import type { CSSProperties } from "react";

export const designRoles = [
  "heroHeading",
  "heading",
  "eyebrow",
  "body",
  "itemHeading",
  "itemBody",
  "cta",
  "number",
  "small",
] as const;
export const designScreens = [
  "mobile",
  "tablet",
  "laptop",
  "desktop",
  "imac",
] as const;
export type DesignRole = (typeof designRoles)[number];
export type DesignText = {
  color?: string | null;
  weight?: number | null;
  lineHeight?: number | null;
} & Partial<Record<(typeof designScreens)[number], number | null>>;
export type DesignValues = {
  typography?: Partial<Record<DesignRole, DesignText>>;
  colors?: {
    light?: Partial<
      Record<
        DesignRole | "link" | "buttonBackground" | "buttonBorder" | "divider",
        string | null
      >
    >;
    dark?: Partial<
      Record<
        DesignRole | "link" | "buttonBackground" | "buttonBorder" | "divider",
        string | null
      >
    >;
  };
  spacing?: Partial<Record<(typeof designScreens)[number], number | null>>;
};
export type DesignSettingsData = DesignValues & {
  pageOverrides?: Array<
    DesignValues & {
      page?: number | { id: number } | null;
      locale?: "both" | "en" | "ar" | null;
    }
  >;
};

export function designStyle(
  data: DesignValues | undefined,
  scope: "global" | "page",
): CSSProperties {
  const vars: Record<string, string> = {};
  if (scope === "global") {
    vars["--cms-global-light-heading-color"] = "#2e2449";
    vars["--cms-global-light-eyebrow-color"] = "#614787";
  }
  const color = (v: unknown): v is string =>
    typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);
  for (const role of designRoles) {
    const text = data?.typography?.[role];
    if (color(text?.color)) vars[`--cms-${scope}-${role}-color`] = text.color;
    for (const screen of designScreens) {
      const size = text?.[screen];
      if (
        typeof size === "number" &&
        Number.isFinite(size) &&
        size >= 10 &&
        size <= 160
      )
        vars[`--cms-${scope}-${role}-${screen}`] = `${size}px`;
    }
    if (
      typeof text?.weight === "number" &&
      text.weight >= 100 &&
      text.weight <= 900
    )
      vars[`--cms-${scope}-${role}-weight`] = String(text.weight);
    if (
      typeof text?.lineHeight === "number" &&
      text.lineHeight >= 0.8 &&
      text.lineHeight <= 3
    )
      vars[`--cms-${scope}-${role}-lineHeight`] = String(text.lineHeight);
  }
  for (const theme of ["light", "dark"] as const)
    for (const [role, value] of Object.entries(data?.colors?.[theme] || {})) {
      if (color(value)) vars[`--cms-${scope}-${theme}-${role}-color`] = value;
    }
  for (const screen of designScreens) {
    const padding = data?.spacing?.[screen];
    if (
      typeof padding === "number" &&
      Number.isFinite(padding) &&
      padding >= 0 &&
      padding <= 300
    )
      vars[`--cms-${scope}-spacing-${screen}`] = `${padding}px`;
  }
  return vars as CSSProperties;
}

export function pageDesignStyles(
  data: DesignSettingsData,
): Record<string, CSSProperties> {
  const result: Record<string, CSSProperties> = {};
  // Locale-specific entries win over shared entries regardless of editor ordering.
  for (const localeOnly of [false, true])
    for (const entry of data.pageOverrides || []) {
      if ((entry.locale !== "both" && !!entry.locale) !== localeOnly) continue;
      const id = typeof entry.page === "object" ? entry.page?.id : entry.page;
      if (!id) continue;
      for (const locale of entry.locale === "en" || entry.locale === "ar"
        ? [entry.locale]
        : ["en", "ar"]) {
        const key = `${locale}:${id}`;
        result[key] = { ...result[key], ...designStyle(entry, "page") };
      }
    }
  return result;
}
