import type { ViewportImages } from "@/components/ArtDirectedImage";
import { cmsMediaURL } from "@/content/cmsMediaURL";
import type { HomepageVisual } from "@/content/homepageVisual";

export const insightsSectionKeys = ["hero", "introduction", "archive", "areas", "ambition", "credibility", "property", "contribution"] as const;
export const newsSectionKeys = ["hero", "archive"] as const;
export type EditorialSectionKey = (typeof insightsSectionKeys)[number];
export type EditorialSection = {
  visible: boolean;
  anchorID?: string;
  visual?: HomepageVisual;
  elementVisibility?: Partial<Record<"eyebrow" | "heading" | "body" | "media" | "items" | "pattern" | "cta", boolean>>;
  image?: string;
  images?: ViewportImages;
  pattern?: string;
  patternImages?: ViewportImages;
  backgroundImages?: ViewportImages;
  backgroundVideos?: ViewportImages;
  showScrollCue?: boolean;
  itemVisibility?: boolean[];
  allFilterLabel?: string;
  categoriesFilterLabel?: string;
  recipientEmail?: string;
};
export type EditorialPageSettings = {
  order: EditorialSectionKey[];
  sections: Partial<Record<EditorialSectionKey, EditorialSection>>;
  archiveSortMode: "latest" | "manual";
  selectedPostIds: number[];
};

function mediaURL(value: unknown): string | undefined {
  if (typeof value === "string") return value.startsWith("/assets/") ? value : undefined;
  if (value && typeof value === "object" && "url" in value) return cmsMediaURL((value as { url?: string }).url);
  return undefined;
}

function mediaSet(value: unknown): ViewportImages | undefined {
  if (!value || typeof value !== "object") return undefined;
  const source = value as Record<string, unknown>;
  const entries = ["default", "mobile", "tablet", "laptop", "desktop", "imac"].flatMap((key) => {
    const url = mediaURL(source[key]);
    return url ? [[key, url]] : [];
  });
  return entries.length ? Object.fromEntries(entries) : undefined;
}

export function editorialSettingsFromEditor(page: "insights" | "latest-news", blocks?: Record<string, unknown>[]): EditorialPageSettings {
  const result: EditorialPageSettings = { order: [], sections: {}, archiveSortMode: "latest", selectedPostIds: [] };
  for (const block of blocks || []) {
    const prefix = page === "insights" ? "siteInsights" : "siteLatest-news";
    const key = (page === "insights" ? insightsSectionKeys : newsSectionKeys).find((item) => block.blockType === `${prefix}${item[0].toUpperCase()}${item.slice(1)}`);
    if (!key) continue;
    result.order.push(key);
    const appearance = block.appearance as Record<string, unknown> | undefined;
    result.sections[key] = {
      visible: block.visible !== false,
      anchorID: typeof block.anchorID === "string" ? block.anchorID.replace(/[^a-z0-9_-]/gi, "") : undefined,
      elementVisibility: block.elementVisibility as EditorialSection["elementVisibility"],
      visual: {
        backgroundColor: appearance?.backgroundColor as string | undefined,
        backgroundPreset: appearance?.applyPresets ? appearance.theme as HomepageVisual["backgroundPreset"] : undefined,
        spacingPreset: appearance?.applyPresets ? appearance.spacing as HomepageVisual["spacingPreset"] : undefined,
        textStyles: block.textStyles as HomepageVisual["textStyles"],
        iconDimensions: block.iconDimensions as HomepageVisual["iconDimensions"],
        detailColors: block.detailColors as HomepageVisual["detailColors"],
      },
      image: mediaURL(block.image), images: mediaSet(block.images),
      pattern: mediaURL(block.pattern), patternImages: mediaSet(block.patternImages),
      backgroundImages: mediaSet(block.backgroundImages), backgroundVideos: mediaSet(block.backgroundVideos),
      showScrollCue: block.showScrollCue !== false,
      itemVisibility: Array.isArray(block.items) ? block.items.map((item) => item?.visible !== false) : undefined,
      allFilterLabel: typeof block.allFilterLabel === "string" ? block.allFilterLabel : undefined,
      categoriesFilterLabel: typeof block.categoriesFilterLabel === "string" ? block.categoriesFilterLabel : undefined,
      recipientEmail: typeof block.recipientEmail === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(block.recipientEmail) ? block.recipientEmail : undefined,
    };
    if (key === "archive") {
      result.archiveSortMode = block.archiveSortMode === "manual" ? "manual" : "latest";
      result.selectedPostIds = Array.isArray(block.selectedPosts) ? block.selectedPosts.flatMap((item) => {
        const id = typeof item === "object" && item ? item.id : item;
        return typeof id === "number" ? [id] : [];
      }) : [];
    }
  }
  return result;
}
