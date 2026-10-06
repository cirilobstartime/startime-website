import type { ViewportImages } from "@/components/ArtDirectedImage";
import { cmsMediaURL } from "@/content/cmsMediaURL";
import type { HomepageItemVisual, HomepageVisual, TextRoleStyle } from "@/content/homepageVisual";

export const visionSectionKeys = ["hero", "path", "vision", "pillars", "programs", "roadmap", "commitment"] as const;
export type VisionSectionKey = (typeof visionSectionKeys)[number];

type VisionItemSettings = {
  visible: boolean;
  showTarget: boolean;
  image?: string;
  images?: ViewportImages;
  icon?: string;
  icons?: ViewportImages;
  visual?: HomepageItemVisual;
};

export type VisionSectionSettings = {
  visible: boolean;
  anchorID?: string;
  visual?: HomepageVisual;
  elementVisibility?: Partial<Record<"eyebrow" | "heading" | "body" | "media" | "items" | "pattern" | "cta", boolean>>;
  backgroundImages?: ViewportImages;
  backgroundVideos?: ViewportImages;
  backdrop?: string;
  backdropImages?: ViewportImages;
  portrait?: string;
  portraitImages?: ViewportImages;
  image?: string;
  images?: ViewportImages;
  pattern?: string;
  patternImages?: ViewportImages;
  paragraphs?: Array<{ visible: boolean; style?: TextRoleStyle }>;
  items?: VisionItemSettings[];
  showHonorific?: boolean;
  showName?: boolean;
  showRole?: boolean;
  showScrollCue?: boolean;
};

export type VisionCmsSettings = Partial<Record<VisionSectionKey, VisionSectionSettings>> & { order: VisionSectionKey[] };

const viewports = ["default", "mobile", "tablet", "laptop", "desktop", "imac"] as const;

function mediaURL(value: unknown): string | undefined {
  if (typeof value === "string") return value.startsWith("/assets/") ? value : undefined;
  if (value && typeof value === "object" && "url" in value) {
    return cmsMediaURL((value as { url?: string }).url);
  }
  return undefined;
}

function mediaSet(value: unknown): ViewportImages | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const entries = viewports.flatMap((viewport) => {
    const url = mediaURL(record[viewport]);
    return url ? [[viewport, url] as const] : [];
  });
  return entries.length ? Object.fromEntries(entries) : undefined;
}

export function visionSettingsFromEditor(sections?: Record<string, unknown>[]): VisionCmsSettings | undefined {
  if (!sections?.length) return undefined;
  const result: VisionCmsSettings = { order: [] };
  for (const section of sections) {
    const key = visionSectionKeys.find((candidate) => section.blockType === `siteVision${candidate[0].toUpperCase()}${candidate.slice(1)}`);
    if (!key) continue;
    result.order.push(key);
    const appearance = section.appearance as Record<string, unknown> | undefined;
    result[key] = {
      visible: section.visible !== false,
      anchorID: typeof section.anchorID === "string" ? section.anchorID.replace(/[^a-z0-9_-]/gi, "") : undefined,
      elementVisibility: section.elementVisibility as VisionSectionSettings["elementVisibility"],
      visual: {
        backgroundColor: appearance?.backgroundColor as string | undefined,
        backgroundPreset: appearance?.applyPresets ? appearance.theme as HomepageVisual["backgroundPreset"] : undefined,
        spacingPreset: appearance?.applyPresets ? appearance.spacing as HomepageVisual["spacingPreset"] : undefined,
        textStyles: section.textStyles as HomepageVisual["textStyles"],
        iconDimensions: section.iconDimensions as HomepageVisual["iconDimensions"],
        detailColors: section.detailColors as HomepageVisual["detailColors"],
      },
      backgroundImages: mediaSet(section.backgroundImages),
      backgroundVideos: mediaSet(section.backgroundVideos),
      backdrop: mediaURL(section.backdrop),
      backdropImages: mediaSet(section.backdropImages),
      portrait: mediaURL(section.portrait),
      portraitImages: mediaSet(section.portraitImages),
      image: mediaURL(section.image),
      images: mediaSet(section.images),
      pattern: mediaURL(section.pattern),
      patternImages: mediaSet(section.patternImages),
      paragraphs: Array.isArray(section.body) ? section.body.map((paragraph: Record<string, unknown>) => ({
        visible: paragraph?.visible !== false,
        style: paragraph?.style as TextRoleStyle | undefined,
      })) : undefined,
      items: Array.isArray(section.items) ? section.items.map((item: Record<string, unknown>) => ({
        visible: item?.visible !== false,
        showTarget: item?.showTarget !== false,
        image: mediaURL(item?.image),
        images: mediaSet(item?.images),
        icon: mediaURL(item?.icon),
        icons: mediaSet(item?.icons),
        visual: item?.itemVisual as HomepageItemVisual | undefined,
      })) : undefined,
      showHonorific: section.showHonorific !== false,
      showName: section.showName !== false,
      showRole: section.showRole !== false,
      showScrollCue: section.showScrollCue !== false,
    };
  }
  return result;
}
