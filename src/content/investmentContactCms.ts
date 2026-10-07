import { cmsMediaURL } from "@/content/cmsMediaURL";
import type { ViewportImages } from "@/components/ArtDirectedImage";
import type { HomepageItemVisual, HomepageVisual, TextRoleStyle } from "@/content/homepageVisual";

export const investmentSectionKeys = ["hero", "philosophy", "domains", "portfolios", "approach", "impact", "projects", "closing"] as const;
export const contactSectionKeys = ["hero", "form", "headquarters", "location"] as const;
export type InvestmentKey = (typeof investmentSectionKeys)[number];
export type ContactKey = (typeof contactSectionKeys)[number];

export type PageItemSettings = { visible: boolean; homepagePortfolio?: string; image?: string; images?: ViewportImages; icon?: string; icons?: ViewportImages; logo?: string; url?: string; visual?: HomepageItemVisual; items?: PageItemSettings[]; title?: string };
export type PageSectionSettings = {
  visible: boolean;
  anchorID?: string;
  elementVisibility?: Partial<Record<"eyebrow" | "heading" | "body" | "media" | "items" | "pattern" | "cta", boolean>>;
  visual?: HomepageVisual;
  image?: string;
  images?: ViewportImages;
  backgroundImages?: ViewportImages;
  backgroundVideos?: ViewportImages;
  mapArtwork?: string;
  mapArtworkImages?: ViewportImages;
  items?: PageItemSettings[];
  portfolios?: PageItemSettings[];
  paragraphs?: Array<{ visible: boolean; style?: TextRoleStyle }>;
  showScrollCue?: boolean;
  showAttachment?: boolean;
};
export type PageCmsSettings<K extends string> = { order: K[] } & Partial<Record<K, PageSectionSettings>>;

const viewportNames = ["default", "mobile", "tablet", "laptop", "desktop", "imac"] as const;

function mediaURL(value: unknown): string | undefined {
  if (typeof value === "string") return value.startsWith("/assets/") ? value : undefined;
  if (value && typeof value === "object" && "url" in value) return cmsMediaURL((value as { url?: string }).url);
  return undefined;
}

function mediaSet(value: unknown): ViewportImages | undefined {
  if (!value || typeof value !== "object") return undefined;
  const source = value as Record<string, unknown>;
  const entries = viewportNames.flatMap((name) => {
    const url = mediaURL(source[name]);
    return url ? [[name, url] as const] : [];
  });
  return entries.length ? Object.fromEntries(entries) : undefined;
}

function itemSettings(item: Record<string, unknown>): PageItemSettings {
  return {
    visible: item.visible !== false,
    title: typeof item.title === "string" ? item.title : undefined,
    homepagePortfolio: typeof item.homepagePortfolio === "string" ? item.homepagePortfolio : undefined,
    image: mediaURL(item.image), images: mediaSet(item.images),
    icon: mediaURL(item.icon), icons: mediaSet(item.icons),
    logo: mediaURL(item.logo),
    url: typeof item.url === "string" ? item.url : undefined,
    visual: item.itemVisual as HomepageItemVisual | undefined,
    items: Array.isArray(item.items) ? item.items.map((child) => itemSettings(child)) : undefined,
  };
}

export function pageSettingsFromEditor<K extends string>(page: "Investment" | "Contact", keys: readonly K[], sections?: Record<string, unknown>[]): PageCmsSettings<K> | undefined {
  if (!sections?.length) return undefined;
  const result = { order: [] as K[] } as PageCmsSettings<K>;
  for (const section of sections) {
    const key = keys.find((candidate) => section.blockType === `site${page}${candidate[0].toUpperCase()}${candidate.slice(1)}`);
    if (!key) continue;
    result.order.push(key);
    const appearance = section.appearance as Record<string, unknown> | undefined;
    result[key] = {
      visible: section.visible !== false,
      anchorID: typeof section.anchorID === "string" ? section.anchorID.replace(/[^a-z0-9_-]/gi, "") : undefined,
      elementVisibility: section.elementVisibility as PageSectionSettings["elementVisibility"],
      visual: { backgroundColor: appearance?.backgroundColor as string | undefined, backgroundPreset: appearance?.applyPresets ? appearance.theme as HomepageVisual["backgroundPreset"] : undefined, spacingPreset: appearance?.applyPresets ? appearance.spacing as HomepageVisual["spacingPreset"] : undefined, textStyles: section.textStyles as HomepageVisual["textStyles"], detailColors: section.detailColors as HomepageVisual["detailColors"], iconDimensions: section.iconDimensions as HomepageVisual["iconDimensions"] },
      image: mediaURL(section.image), images: mediaSet(section.images),
      backgroundImages: mediaSet(section.backgroundImages), backgroundVideos: mediaSet(section.backgroundVideos),
      mapArtwork: mediaURL(section.mapArtwork), mapArtworkImages: mediaSet(section.mapArtworkImages),
      items: Array.isArray(section.items) ? section.items.map((item) => itemSettings(item)) : Array.isArray(section.facts) ? section.facts.map((item) => itemSettings(item)) : undefined,
      portfolios: Array.isArray(section.portfolios) ? section.portfolios.map((item) => itemSettings(item)) : undefined,
      paragraphs: Array.isArray(section.body) ? section.body.map((item: Record<string, unknown>) => ({ visible: item.visible !== false, style: item.style as TextRoleStyle | undefined })) : undefined,
      showScrollCue: section.showScrollCue !== false,
      showAttachment: section.showAttachment !== false,
    } as PageCmsSettings<K>[K];
  }
  return result;
}
