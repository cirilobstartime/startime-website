import type { ViewportImages } from "@/components/ArtDirectedImage";
import { cmsMediaURL } from "@/content/cmsMediaURL";
import type { HomepageVisual } from "@/content/homepageVisual";
import type { HomepageItemVisual } from "@/content/homepageVisual";

export type DiscoverSectionKey = "hero" | "introduction" | "timeline" | "vision" | "ceo" | "methodology" | "governance" | "form";
export type DiscoverSectionSettings = {
  visible: boolean;
  anchorID?: string;
  visual?: HomepageVisual;
  elementVisibility?: Partial<Record<"eyebrow" | "heading" | "body" | "media" | "items" | "pattern" | "cta", boolean>>;
  images?: ViewportImages;
  patternImages?: ViewportImages;
  backgroundImages?: ViewportImages;
  backgroundVideos?: ViewportImages;
  overlayOpacity?: number;
  filmVideos?: ViewportImages;
  filmPosters?: ViewportImages;
  filmSource?: "upload" | "youtube";
  filmYoutubeURL?: string;
  filmTitle?: string;
  contactEmail?: string;
  recipientEmail?: string;
  showBioPreview?: boolean;
  lessLabel?: string;
  principleImages?: { images?: ViewportImages }[];
  principleItems?: { images?: ViewportImages; visible: boolean; visual?: HomepageItemVisual }[];
  showScrollCue?: boolean;
  quoteMark?: string;
  showCounter?: boolean;
  showAttachment?: boolean;
};
export type DiscoverCmsSettings = Partial<Record<DiscoverSectionKey, DiscoverSectionSettings>> & { order?: DiscoverSectionKey[] };

const keys: DiscoverSectionKey[] = ["hero", "introduction", "timeline", "vision", "ceo", "methodology", "governance", "form"];
const viewports = ["default", "mobile", "tablet", "laptop", "desktop", "imac"] as const;

function mediaSet(value: unknown): ViewportImages | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const entries = viewports.flatMap((viewport) => {
    const media = record[viewport];
    const url = media && typeof media === "object" && "url" in media ? cmsMediaURL((media as { url?: string }).url) : undefined;
    return url ? [[viewport, url] as const] : [];
  });
  return entries.length ? Object.fromEntries(entries) : undefined;
}

function safeEmail(value: unknown): string | undefined {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : undefined;
}

function singleMediaURL(value: unknown): string | undefined {
  return value && typeof value === "object" && "url" in value
    ? cmsMediaURL((value as { url?: string }).url)
    : undefined;
}

export function discoverSettingsFromEditor(sections?: Record<string, unknown>[]): DiscoverCmsSettings | undefined {
  if (!sections?.length) return undefined;
  const result: DiscoverCmsSettings = { order: [] };
  for (const section of sections) {
    const key = keys.find((candidate) => section.blockType === `siteDiscover${candidate[0].toUpperCase()}${candidate.slice(1)}`);
    if (!key) continue;
    result.order?.push(key);
    const appearance = section.appearance as Record<string, unknown> | undefined;
    result[key] = {
      visible: section.visible !== false,
      anchorID: typeof section.anchorID === "string" ? section.anchorID.replace(/[^a-z0-9_-]/gi, "") : undefined,
      elementVisibility: section.elementVisibility as DiscoverSectionSettings["elementVisibility"],
      visual: {
        backgroundColor: appearance?.backgroundColor as string | undefined,
        backgroundPreset: appearance?.applyPresets ? appearance.theme as HomepageVisual["backgroundPreset"] : undefined,
        spacingPreset: appearance?.applyPresets ? appearance.spacing as HomepageVisual["spacingPreset"] : undefined,
        textStyles: section.textStyles as HomepageVisual["textStyles"],
        iconDimensions: section.iconDimensions as HomepageVisual["iconDimensions"],
        detailColors: section.detailColors as HomepageVisual["detailColors"],
      },
      images: mediaSet(section.images),
      patternImages: mediaSet(section.patternImages),
      backgroundImages: mediaSet(section.backgroundImages) || (() => {
        const mobile = singleMediaURL(appearance?.mobileBackgroundImage);
        const desktop = singleMediaURL(appearance?.backgroundImage);
        return mobile || desktop ? { default: desktop, mobile } : undefined;
      })(),
      backgroundVideos: mediaSet(section.backgroundVideos),
      overlayOpacity: appearance?.applyPresets && typeof appearance.overlayOpacity === "number"
        ? Math.max(0, Math.min(90, appearance.overlayOpacity)) : undefined,
      filmVideos: mediaSet(section.filmVideos),
      filmPosters: mediaSet(section.filmPosters),
      filmSource: section.filmSource === "youtube" ? "youtube" : "upload",
      filmYoutubeURL: typeof section.filmYoutubeURL === "string" ? section.filmYoutubeURL : undefined,
      filmTitle: typeof section.filmTitle === "string" ? section.filmTitle : undefined,
      contactEmail: safeEmail(section.contactEmail),
      recipientEmail: safeEmail(section.recipientEmail),
      showBioPreview: section.showBioPreview === true,
      lessLabel: typeof section.lessLabel === "string" ? section.lessLabel : undefined,
      principleImages: Array.isArray(section.principleImages)
        ? section.principleImages.map((item) => ({ images: mediaSet(item?.images) })) : undefined,
      principleItems: Array.isArray(section.principles)
        ? section.principles.map((item) => ({ images: mediaSet(item?.images), visible: item?.visible !== false, visual: item?.itemVisual as HomepageItemVisual | undefined })) : undefined,
      showScrollCue: section.showScrollCue !== false,
      quoteMark: typeof section.quoteMark === "string" ? section.quoteMark : undefined,
      showCounter: section.showCounter !== false,
      showAttachment: section.showAttachment !== false,
    };
  }
  return result;
}
