import "server-only";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import type { InsightCategory, InsightsPost, Media } from "@/generated/payload-types";
import type { Locale } from "@/content/home";
import { cmsMediaURL } from "@/content/cmsMediaURL";
import {
  type InsightPost,
  type InsightPostCategory,
  type InsightPostTranslation,
} from "@/content/insightPosts";

function populatedMedia(value: number | Media | null | undefined): Media | null {
  return value && typeof value === "object" && value.url ? value : null;
}

function categoryFor(value: number | InsightCategory): InsightPostCategory | undefined {
  const slug = typeof value === "object" ? value.slug : undefined;
  return slug || undefined;
}

function toFrontendPost(post: InsightsPost, locale: Locale): InsightPost | null {
  const original = populatedMedia(post.featuredImage);
  // A device override must never silently become the default on other screens.
  const defaultThumbnail = populatedMedia(post.thumbnailImages?.default) || original;
  if (!defaultThumbnail) return null;
  const desktop = populatedMedia(post.thumbnailImages?.desktop) || defaultThumbnail;
  const desktopURL = cmsMediaURL(desktop?.url);
  if (!post.slug || !post.title || !desktopURL) return null;

  const laptop = populatedMedia(post.thumbnailImages?.laptop) || defaultThumbnail;
  const tablet = populatedMedia(post.thumbnailImages?.tablet) || defaultThumbnail;
  const mobile = populatedMedia(post.thumbnailImages?.mobile) || defaultThumbnail;
  const feature = populatedMedia(post.articleFeatureImage) || defaultThumbnail;
  const copy: InsightPostTranslation = {
    title: post.title,
    lead: [post.title, post.summary],
    body: post.intro ? [post.intro] : [],
  };
  const empty: InsightPostTranslation = { title: "", lead: [], body: [] };
  const category = typeof post.category === "object" ? post.category : null;

  return {
    cmsId: post.id,
    publishedAt: post.publishedAt || post.createdAt,
    displayOrder: typeof post.displayOrder === "number" ? post.displayOrder : undefined,
    slug: post.slug,
    type: (["article", "insight"] as string[]).includes(post.postType) ? "article" : "news",
    image: desktopURL,
    thumbnailImages: {
      desktop: desktopURL,
      laptop: cmsMediaURL(laptop?.url)!,
      tablet: cmsMediaURL(tablet?.url)!,
      mobile: cmsMediaURL(mobile?.url)!,
    },
    featureImage: feature?.url
      ? {
          src: cmsMediaURL(feature.url)!,
          width: feature.width || 1921,
          height: feature.height || 1080,
          alt: { [locale]: feature.alt || "" },
        }
      : undefined,
    category: categoryFor(post.category),
    categoryLabel: category?.visible !== false && category?._status === "published" ? category.title || undefined : undefined,
    tags: (post.tags || []).flatMap((tag) => typeof tag === "object" && tag.visible !== false && tag._status === "published" && tag.slug && tag.title ? [{ slug: tag.slug, title: tag.title }] : []),
    showOnHomepage: post.showOnHomepage !== false,
    showOnArchive: post.showOnInsightsPage !== false,
    richContent: post.content,
    en: locale === "en" ? copy : empty,
    ar: locale === "ar" ? copy : empty,
  };
}

/** Published, visible content for the approved new-site cards and detail routes. */
export const getNewSitePosts = cache(async (locale: Locale): Promise<InsightPost[]> => {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "insights-posts",
      depth: 2,
      draft: false,
      fallbackLocale: false,
      locale,
      limit: 500,
      overrideAccess: false,
      sort: "-publishedAt",
      where: {
        and: [
          { _status: { equals: "published" } },
          { visible: { equals: true } },
        ],
      },
    });
    // Imported legacy posts have no publication date. Keep their approved
    // editorial order until an editor supplies dates; dated new posts still
    // appear first in the automatic latest feed.
    const ordered = [...result.docs].sort((a, b) => {
      if (a.publishedAt && b.publishedAt) return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
      if (a.publishedAt) return -1;
      if (b.publishedAt) return 1;
      return (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER)
        || Date.parse(b.createdAt) - Date.parse(a.createdAt);
    });
    const published = ordered.flatMap((post) => {
      const mapped = toFrontendPost(post, locale);
      return mapped ? [mapped] : [];
    });
    return published;
  } catch (error) {
    console.error("New-site posts could not be loaded from the CMS:", error);
  }
  return [];
});

export function orderArchivePosts(posts: InsightPost[], mode: "latest" | "manual" = "latest", selectedIds: number[] = []) {
  if (mode !== "manual") return posts;
  if (selectedIds.length) {
    const rank = new Map(selectedIds.map((id, index) => [id, index]));
    return [...posts].sort((a, b) => (rank.get(a.cmsId || -1) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.cmsId || -1) ?? Number.MAX_SAFE_INTEGER));
  }
  return [...posts].sort((a, b) => (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER)
    || Date.parse(b.publishedAt || "") - Date.parse(a.publishedAt || ""));
}
