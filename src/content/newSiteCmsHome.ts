import "server-only";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import type { Media, Page, Project } from "@/generated/payload-types";
import type { Locale } from "@/content/home";
import { cmsMediaURL } from "@/content/cmsMediaURL";
import type { HomepageItemVisual, HomepageVisual } from "@/content/homepageVisual";
import type { ViewportImages } from "@/components/ArtDirectedImage";
import type { PortfolioTopPadding } from "@/content/portfolioTopPadding";
import type { PortfolioPhoto } from "@/content/portfolioImages";

type SectionRecord = Record<string, unknown>;
export type HomepageVideoSources = ViewportImages;
export type HomepageMedia = { images?: ViewportImages; videos?: HomepageVideoSources };

export type HomepageOpening = {
  visual?: HomepageVisual;
  eyebrow: string;
  heading: string;
  description: string;
  headingURL?: string;
  showDiscoverButton?: boolean;
  discoverLabel?: string;
  discoverTextColor?: string;
  discoverBorderColor?: string;
  discoverBackgroundColor?: string;
  showPresentationSkip?: boolean;
  presentationSkipLabel?: string;
  heritageHeading: string;
  futureHeading: string;
  images: [string, string, string];
  scenes?: (HomepageMedia & { visual?: HomepageVisual })[];
};

export type HomepageValue = {
  visual?: HomepageVisual;
  eyebrow: string;
  heading: string;
  body: string;
  statistics: [string, string][];
  showStatistics?: boolean;
  patternImages?: ViewportImages;
  statVisuals?: (HomepageItemVisual | undefined)[];
};

export type HomepageDomains = {
  visual?: HomepageVisual;
  eyebrow: string;
  heading: string;
  body: string;
  items: { title: string; body: string; icon: string; iconImages?: ViewportImages; visual?: HomepageItemVisual }[];
};

export type HomepagePortfolios = {
  visual?: HomepageVisual;
  portfolioTitleColor?: string;
  topPaddingByScreen?: PortfolioTopPadding;
  patternImages?: ViewportImages;
  eyebrow: string;
  heading: string;
  body: string;
  items: { title: string; body: string; image: string; images?: ViewportImages; visual?: HomepageItemVisual }[];
};

export type HomepageImpact = {
  visual?: HomepageVisual;
  eyebrow: string;
  heading: string;
  items: { title: string; body: string; image: string; images?: ViewportImages; visual?: HomepageItemVisual }[];
};

export type HomepageProjects = {
  visual?: HomepageVisual;
  eyebrow: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaURL?: string;
  showCTA?: boolean;
  items: { title: string; projectName?: string; body: string; image: string; logo: string; images?: ViewportImages; logos?: ViewportImages; destination?: string; visual?: HomepageItemVisual }[];
};

export type HomepageSupplement = {
  visual?: HomepageVisual;
  images?: ViewportImages;
  patternImages?: ViewportImages;
  videos?: HomepageVideoSources;
  ctaURL?: string;
  showCTA?: boolean;
  showMedia?: boolean;
};

export type NewSiteCmsHome = {
  published: boolean;
  order?: string[];
  sectionAppearance?: Record<string, { backgroundImages?: ViewportImages; backgroundVideos?: HomepageVideoSources; overlayOpacity?: number; anchorID?: string; elementVisibility?: Record<string, boolean> }>;
  opening?: HomepageOpening;
  value?: HomepageValue;
  domains?: HomepageDomains;
  portfolios?: HomepagePortfolios;
  impact?: HomepageImpact;
  projects?: HomepageProjects;
  panorama?: HomepageSupplement & { scenes: { heading: string; description: string; noGlass?: boolean; visual?: HomepageItemVisual }[]; skipLabel: string; skipURL: string; showSkip: boolean };
  team?: HomepageSupplement;
  triple?: HomepageSupplement;
  partners?: HomepageSupplement & { logos?: { image: string; images?: ViewportImages; alt: string; destination?: string }[] };
  membership?: HomepageSupplement & { heading: string; patternImages?: ViewportImages; logos: { image: string; images?: ViewportImages; alt: string; destination?: string }[] };
  news?: HomepageSupplement & { selectionMode: "latest" | "manual"; selectedIDs: number[]; maximumItems: number; cardVisuals?: Record<number, HomepageItemVisual> };
};

function mediaURL(value: number | Media | null | undefined): string | undefined {
  return typeof value === "object" && value?.url ? cmsMediaURL(value.url) : undefined;
}

function fieldMedia(value: unknown): string | undefined {
  return mediaURL(value as number | Media | null | undefined);
}

function mediaSet(value: unknown): ViewportImages | undefined {
  if (!value || typeof value !== "object") return undefined;
  const source = value as SectionRecord;
  const pairs = (["default", "mobile", "tablet", "laptop", "desktop", "imac"] as const)
    .flatMap((viewport) => {
      const url = fieldMedia(source[viewport]);
      return url ? [[viewport, url] as const] : [];
    });
  return pairs.length ? Object.fromEntries(pairs) : undefined;
}

function supplement(section?: SectionRecord): HomepageSupplement | undefined {
  if (!section) return undefined;
  return {
    visual: visualOf(section as never),
    images: mediaSet(section.images),
    patternImages: mediaSet(section.patternImages),
    videos: mediaSet(section.videos),
    ctaURL: typeof section.ctaURL === "string" ? section.ctaURL : undefined,
    showCTA: section.showCTA !== false,
    showMedia: section.showMedia === true,
  };
}

function visualOf(section: SectionRecord | null | undefined): HomepageVisual | undefined {
  if (!section) return undefined;
  const appearance = section.appearance as { backgroundColor?: string | null; applyPresets?: boolean; theme?: string; spacing?: string } | undefined;
  const backgroundPreset = appearance?.applyPresets && ["light", "dark", "brand", "transparent"].includes(appearance.theme || "")
    ? appearance.theme as HomepageVisual["backgroundPreset"] : undefined;
  const spacingPreset = appearance?.applyPresets && ["compact", "standard", "large"].includes(appearance.spacing || "")
    ? appearance.spacing as HomepageVisual["spacingPreset"] : undefined;
  return { backgroundColor: appearance?.backgroundColor, backgroundPreset, spacingPreset, textStyles: section.textStyles as HomepageVisual["textStyles"], detailColors: section.detailColors as HomepageVisual["detailColors"], iconDimensions: section.iconDimensions as HomepageVisual["iconDimensions"] };
}

const getPublishedHomepage = cache(async (locale: Locale): Promise<Page | undefined> => {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "pages",
    depth: 2,
    draft: false,
    fallbackLocale: false,
    locale,
    limit: 1,
    overrideAccess: false,
    where: {
      and: [
        { internalTitle: { equals: "New Site: Home" } },
        { _status: { equals: "published" } },
        { visible: { equals: true } },
      ],
    },
  });
  return result.docs[0] as Page | undefined;
});

/** Share only artwork, never Home copy, colors, visibility or item styling. */
export const getHomepagePortfolioPhotos = cache(async (locale: Locale): Promise<PortfolioPhoto[]> => {
  const page = await getPublishedHomepage(locale);
  const section = ((page?.sections || []) as unknown as SectionRecord[]).find((item) => item.blockType === "newHomepagePortfolios");
  const items = Array.isArray(section?.portfolios) ? section.portfolios as SectionRecord[] : [];
  return items.map((item) => ({ image: fieldMedia(item.image) || undefined, images: mediaSet(item.images) }));
});

/** Only published sections of the selected language affect the public homepage. */
export const getNewSiteCmsHome = cache(async (locale: Locale): Promise<NewSiteCmsHome> => {
  const page = await getPublishedHomepage(locale);
  if (!page) return { published: false };
  const payload = await getPayload({ config: configPromise });
  const visible = ((page.sections || []) as unknown as SectionRecord[]).filter((section) => section.visible !== false);
  const byType = (type: string) => visible.find((section) => section.blockType === type);
  const opening = byType("newHomepageOpening");
  const value = byType("newHomepageValue");
  const domains = byType("newHomepageDomains");
  const portfolios = byType("newHomepagePortfolios");
  const impact = byType("newHomepageImpact");
  const projects = byType("newHomepageProjects");
  const panorama = byType("newHomepagePanorama");
  const membership = byType("newHomepageMembership");
  const team = byType("siteHomeTeam");
  const triple = byType("siteHomeTriple");
  const partners = byType("siteHomePartners");
  const news = byType("siteHomeNews");
  const projectIDs = projects && !Array.isArray(projects.pageProjects)
    ? ((projects.projects || []) as Array<number | Project>).map((project) => typeof project === "number" ? project : project.id)
    : [];
  const projectRecords = projectIDs.length ? await payload.find({
    collection: "projects",
    depth: 2,
    draft: false,
    fallbackLocale: false,
    locale,
    limit: 100,
    overrideAccess: false,
    where: {
      and: [
        { id: { in: projectIDs } },
        { _status: { equals: "published" } },
        { visible: { equals: true } },
        { showOnHomepage: { equals: true } },
      ],
    },
  }) : null;
  const projectByID = new Map((projectRecords?.docs || []).map((project) => [project.id, project as Project]));
  const openingImages = opening
    ? [fieldMedia(opening.sceneOneImage), fieldMedia(opening.sceneTwoImage), fieldMedia(opening.sceneThreeImage)]
    : [];
  const asString = (value: unknown) => typeof value === "string" ? value : "";
  const asItems = (value: unknown) => Array.isArray(value) ? value as SectionRecord[] : [];
  const sectionAppearance = Object.fromEntries(visible.flatMap((section) => {
    const appearance = section.appearance as SectionRecord | undefined;
    if (typeof section.blockType !== "string") return [];
    return [[section.blockType, {
      backgroundImages: mediaSet(section.backgroundImages) || (() => {
        const mobile = fieldMedia(appearance?.mobileBackgroundImage);
        const desktop = fieldMedia(appearance?.backgroundImage);
        return mobile || desktop ? { default: desktop, mobile } : undefined;
      })(),
      backgroundVideos: mediaSet(section.backgroundVideos),
      overlayOpacity: typeof appearance?.overlayOpacity === "number" ? appearance.overlayOpacity : undefined,
      anchorID: typeof section.anchorID === "string" ? section.anchorID : undefined,
      elementVisibility: section.elementVisibility as Record<string, boolean> | undefined,
    }]];
  }));
  return {
    published: true,
    order: visible.map((section) => asString(section.blockType)),
    sectionAppearance,
    opening: opening && openingImages.every(Boolean)
      ? {
          visual: visualOf(opening),
          eyebrow: asString(opening.eyebrow),
          heading: asString(opening.heading),
          description: asString(opening.description),
          headingURL: asString(opening.headingURL) || undefined,
          showDiscoverButton: opening.showDiscoverButton !== false,
          discoverLabel: asString(opening.discoverLabel) || undefined,
          discoverTextColor: asString(opening.discoverTextColor) || undefined,
          discoverBorderColor: asString(opening.discoverBorderColor) || undefined,
          discoverBackgroundColor: asString(opening.discoverBackgroundColor) || undefined,
          showPresentationSkip: opening.showPresentationSkip !== false,
          presentationSkipLabel: asString(opening.presentationSkipLabel) || undefined,
          heritageHeading: asString(opening.heritageHeading),
          futureHeading: asString(opening.futureHeading),
          images: openingImages as [string, string, string],
          scenes: [1, 2, 3].map((index) => {
            const name = ["", "One", "Two", "Three"][index];
            return {
              images: mediaSet(opening[`scene${name}Images`]),
              videos: mediaSet(opening[`scene${name}Videos`]),
              visual: { textStyles: opening[`scene${name}TextStyles`] as HomepageVisual["textStyles"] },
            };
          }),
        }
      : undefined,
    value: value
      ? {
          visual: visualOf(value),
          eyebrow: asString(value.eyebrow),
          heading: asString(value.heading),
          body: asString(value.body),
          statistics: asItems(value.statistics).filter((stat) => stat.visible !== false).map((stat) => [asString(stat.value), asString(stat.label)]),
          showStatistics: value.showStatistics !== false,
          patternImages: mediaSet(value.patternImages),
          statVisuals: asItems(value.statistics).filter((stat) => stat.visible !== false).map((stat) => stat.itemVisual as HomepageItemVisual | undefined),
        }
      : undefined,
    domains: domains
      ? {
          visual: visualOf(domains),
          eyebrow: asString(domains.eyebrow),
          heading: asString(domains.heading),
          body: asString(domains.body),
          items: asItems(domains.domains).filter((item) => item.visible !== false).flatMap((item) => {
            const icon = fieldMedia(item.icon);
            return icon ? [{ title: asString(item.title), body: asString(item.description), icon, iconImages: mediaSet(item.iconImages), visual: item.itemVisual as HomepageItemVisual | undefined }] : [];
          }),
        }
      : undefined,
    portfolios: portfolios
      ? {
          visual: visualOf(portfolios),
          portfolioTitleColor: asString(portfolios.portfolioTitleColor) || undefined,
          topPaddingByScreen: portfolios.topPaddingByScreen as PortfolioTopPadding | undefined,
          patternImages: mediaSet(portfolios.patternImages),
          eyebrow: asString(portfolios.eyebrow),
          heading: asString(portfolios.heading),
          body: asString(portfolios.body),
          items: asItems(portfolios.portfolios).filter((item) => item.visible !== false).flatMap((item) => {
            const image = fieldMedia(item.image);
            return image ? [{ title: asString(item.title), body: asString(item.description), image, images: mediaSet(item.images), visual: item.itemVisual as HomepageItemVisual | undefined }] : [];
          }),
        }
      : undefined,
    impact: impact
      ? {
          visual: visualOf(impact),
          eyebrow: asString(impact.eyebrow),
          heading: asString(impact.heading),
          items: asItems(impact.impacts).filter((item) => item.visible !== false).flatMap((item) => {
            const image = fieldMedia(item.image);
            return image ? [{ title: asString(item.title), body: asString(item.description), image, images: mediaSet(item.images), visual: item.itemVisual as HomepageItemVisual | undefined }] : [];
          }),
        }
      : undefined,
    projects: projects
      ? {
          visual: visualOf(projects),
          eyebrow: asString(projects.eyebrow),
          heading: asString(projects.heading),
          body: asString(projects.body),
          ctaLabel: asString(projects.ctaLabel),
          ctaURL: asString(projects.ctaURL) || undefined,
          showCTA: projects.showCTA !== false,
          items: Array.isArray(projects.pageProjects) ? asItems(projects.pageProjects).filter((item) => item.visible !== false).flatMap((item) => {
            const image = fieldMedia(item.image);
            const logo = fieldMedia(item.logo);
            return image ? [{ title: asString(item.title), projectName: asString(item.projectName) || asString(item.title), body: asString(item.description), image, logo: logo || "/assets/brand/startime-dark.svg", images: mediaSet(item.images), logos: mediaSet(item.logos), destination: asString(item.destination) || undefined, visual: item.itemVisual as HomepageItemVisual | undefined }] : [];
          }) : projectIDs.flatMap((id) => {
            const project = projectByID.get(id);
            const image = mediaURL(project?.image);
            const logo = mediaURL(project?.logo);
            return project && image && logo ? [{ title: project.title, projectName: project.title, body: project.description, image, logo }] : [];
          }),
        }
      : undefined,
    panorama: panorama ? {
      ...supplement(panorama),
      images: mediaSet(panorama.panoramaImages) || mediaSet(panorama.backgroundImages),
      videos: mediaSet(panorama.panoramaVideos) || mediaSet(panorama.backgroundVideos),
      scenes: asItems(panorama.scenes).filter((scene) => scene.visible !== false).map((scene) => ({ heading: asString(scene.heading), description: asString(scene.description), noGlass: scene.noGlass === true, visual: scene.itemVisual as HomepageItemVisual | undefined })),
      skipLabel: asString(panorama.skipLabel),
      skipURL: asString(panorama.skipURL) || "#home2-value",
      showSkip: panorama.showSkip !== false,
    } : undefined,
    team: supplement(team),
    triple: supplement(triple),
    partners: partners ? { ...supplement(partners), logos: asItems(partners.logos).filter((item) => item.visible !== false).flatMap((item) => {
      const image = fieldMedia(item.image);
      return image ? [{ image, images: mediaSet(item.images), alt: asString(item.alt), destination: asString(item.destination) || undefined }] : [];
    }) } : undefined,
    membership: membership ? { ...supplement(membership), heading: asString(membership.heading), patternImages: mediaSet(membership.patternImages), logos: asItems(membership.logos).filter((item) => item.visible !== false).flatMap((item) => {
      const image = fieldMedia(item.image);
      return image ? [{ image, images: mediaSet(item.images), alt: asString(item.alt), destination: asString(item.destination) || undefined }] : [];
    }) } : undefined,
    news: news ? {
      ...supplement(news),
      selectionMode: news.selectionMode === "manual" ? "manual" : "latest",
      selectedIDs: ((news.selectedNews || []) as Array<number | { id: number }>).map((item) => typeof item === "number" ? item : item.id),
      maximumItems: typeof news.maximumItems === "number" ? news.maximumItems : 9,
      cardVisuals: Object.fromEntries(asItems(news.cardOverrides).flatMap((item) => {
        const post = item.post as number | { id?: number } | undefined;
        const id = typeof post === "number" ? post : post?.id;
        return typeof id === "number" ? [[id, item.itemVisual as HomepageItemVisual]] : [];
      })),
    } : undefined,
  };
});
