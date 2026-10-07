import type { ViewportImages } from "@/components/ArtDirectedImage";
import { cmsMediaURL } from "@/content/cmsMediaURL";
import type { HomepageItemVisual, HomepageVisual } from "@/content/homepageVisual";

export const careersSectionKeys = ["hero", "investing", "workplace", "opportunities", "talent"] as const;
export type CareersSectionKey = (typeof careersSectionKeys)[number];
export type CareersSectionSettings = {
  visible: boolean; anchorID?: string; visual?: HomepageVisual;
  elementVisibility?: Partial<Record<"eyebrow" | "heading" | "body" | "media" | "items" | "pattern" | "cta", boolean>>;
  image?: string; images?: ViewportImages; backgroundImages?: ViewportImages; backgroundVideos?: ViewportImages;
  pattern?: string; patternImages?: ViewportImages;
  points?: Array<{ visible: boolean; visual?: HomepageItemVisual; artwork?: string; artworkImages?: ViewportImages }>;
  showScrollCue?: boolean;
  filterLabels?: Record<string, string>;
};
export type CareersCmsSettings = Partial<Record<CareersSectionKey, CareersSectionSettings>> & { order: CareersSectionKey[]; jobOrderMode: "latest" | "manual"; selectedJobIds: string[] };

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

export function careersSettingsFromEditor(sections?: Record<string, unknown>[]): CareersCmsSettings | undefined {
  if (!sections?.length) return undefined;
  const result: CareersCmsSettings = { order: [], jobOrderMode: "latest", selectedJobIds: [] };
  for (const block of sections) {
    const key = careersSectionKeys.find((name) => block.blockType === `siteCareers${name[0].toUpperCase()}${name.slice(1)}`);
    if (!key) continue;
    result.order.push(key);
    const appearance = block.appearance as Record<string, unknown> | undefined;
    result[key] = {
      visible: block.visible !== false,
      anchorID: typeof block.anchorID === "string" ? block.anchorID.replace(/[^a-z0-9_-]/gi, "") : undefined,
      elementVisibility: block.elementVisibility as CareersSectionSettings["elementVisibility"],
      visual: {
        backgroundColor: appearance?.backgroundColor as string | undefined,
        backgroundPreset: appearance?.applyPresets ? appearance.theme as HomepageVisual["backgroundPreset"] : undefined,
        spacingPreset: appearance?.applyPresets ? appearance.spacing as HomepageVisual["spacingPreset"] : undefined,
        textStyles: block.textStyles as HomepageVisual["textStyles"],
        iconDimensions: block.iconDimensions as HomepageVisual["iconDimensions"],
        detailColors: block.detailColors as HomepageVisual["detailColors"],
      },
      image: mediaURL(block.image), images: mediaSet(block.images),
      backgroundImages: mediaSet(block.backgroundImages), backgroundVideos: mediaSet(block.backgroundVideos),
      pattern: mediaURL(block.pattern), patternImages: mediaSet(block.patternImages),
      points: key === "workplace" && Array.isArray(block.points) ? block.points.map((item) => ({ visible: item.visible !== false, visual: item.itemVisual as HomepageItemVisual | undefined, artwork: mediaURL(item.artwork), artworkImages: mediaSet(item.artworkImages) })) : undefined,
      showScrollCue: block.showScrollCue !== false,
      filterLabels: key === "opportunities" && block.filterLabels && typeof block.filterLabels === "object" ? Object.fromEntries(Object.entries(block.filterLabels as Record<string, unknown>).filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].trim().length > 0)) : undefined,
    };
    if (key === "opportunities") {
      result.jobOrderMode = block.jobOrderMode === "manual" ? "manual" : "latest";
      result.selectedJobIds = Array.isArray(block.selectedJobs) ? block.selectedJobs.map((item) => String(typeof item === "object" && item ? item.id : item)) : [];
    }
  }
  return result;
}
