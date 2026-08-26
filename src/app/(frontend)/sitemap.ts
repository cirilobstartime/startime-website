import configPromise from "@payload-config";
import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import type { Locale } from "@/content/types";
import { getSiteChrome } from "@/content/payload";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise });
  const chrome = await getSiteChrome("en");
  if (!chrome.allowSearchIndexing) return [];
  const origin = (
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003"
  ).replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ["en", "ar"] satisfies Locale[]) {
    const [pages, insights] = await Promise.all([
      payload.find({
        collection: "pages",
        depth: 0,
        draft: false,
        fallbackLocale: false,
        limit: 500,
        locale,
        overrideAccess: true,
        where: {
          and: [
            { visible: { equals: true } },
            { _status: { equals: "published" } },
            { "seo.includeInSitemap": { not_equals: false } },
            { "seo.indexable": { not_equals: false } },
          ],
        },
      }),
      payload.find({
        collection: "insights-posts",
        depth: 1,
        draft: false,
        fallbackLocale: false,
        limit: 500,
        locale,
        overrideAccess: true,
        where: {
          and: [
            { visible: { equals: true } },
            { _status: { equals: "published" } },
            { "seo.indexable": { not_equals: false } },
          ],
        },
      }),
    ]);
    for (const page of pages.docs) {
      if (!page.slug) continue;
      const path = page.slug === "home" ? "" : `/${page.slug}`;
      entries.push({
        alternates: {
          languages: {
            ar: `${origin}/ar${path}`,
            en: `${origin}${path || "/"}`,
          },
        },
        changeFrequency:
          (page.seo?.sitemapChangeFrequency as
            | "always"
            | "hourly"
            | "daily"
            | "weekly"
            | "monthly"
            | "yearly"
            | "never"
            | undefined) || "monthly",
        lastModified: page.updatedAt,
        priority: Number(page.seo?.sitemapPriority ?? 0.7),
        url:
          locale === "ar" ? `${origin}/ar${path}` : `${origin}${path || "/"}`,
      });
    }

    for (const insight of insights.docs) {
      if (!insight.slug) continue;
      const category =
        insight.category && typeof insight.category === "object"
          ? insight.category.slug
          : "news";
      const path = `/insights/${category || "news"}/${insight.slug}`;
      entries.push({
        alternates: {
          languages: {
            ar: `${origin}/ar${path}`,
            en: `${origin}${path}`,
          },
        },
        changeFrequency: "monthly",
        lastModified: insight.updatedAt,
        priority: 0.6,
        url: locale === "ar" ? `${origin}/ar${path}` : `${origin}${path}`,
      });
    }
    if (locale === "en") {
      const path = "/insights";
      entries.push({
        alternates: { languages: { ar: `${origin}/ar${path}`, en: `${origin}${path}` } },
        changeFrequency: "weekly",
        priority: 0.7,
        url: `${origin}${path}`,
      });
    }
  }
  return entries;
}
