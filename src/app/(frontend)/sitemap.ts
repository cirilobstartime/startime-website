import configPromise from "@payload-config";
import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import { getGlobalSEO } from "@/content/newSiteSEO";
import type { Locale } from "@/content/home";
import { publicPath } from "@/lib/publicPath";
import { postPath } from "@/lib/postPath";
import { getPageRoutes } from "@/content/pageRoutes";
import { mainPageKey, resolvePageHref, pageRoutePath } from "@/lib/pageRoutes";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getGlobalSEO("en");
  if (process.env.STAGING_NOINDEX === "1" || seo?.allowSearchIndexing !== true) return [];
  const origin = /^https:\/\/[^\s/]+$/i.test(seo?.siteURL || "") ? seo!.siteURL! : "https://startime.sa";
  const payload = await getPayload({ config: configPromise });
  const routes = await getPageRoutes();
  const href = (locale: Locale, path: string) => resolvePageHref(publicPath(locale, path), routes);
  const rows = await Promise.all((["en", "ar"] as Locale[]).map(async (locale) => {
    const [pages, posts] = await Promise.all([
      payload.find({ collection: "pages", depth: 0, draft: false, fallbackLocale: false, limit: 500, locale, overrideAccess: false,
        where: { and: [
          { visible: { equals: true } }, { _status: { equals: "published" } },
          { "seo.includeInSitemap": { not_equals: false } }, { "seo.indexable": { not_equals: false } },
        ] },
      }),
      payload.find({ collection: "insights-posts", depth: 0, draft: false, fallbackLocale: false, limit: 500, locale, overrideAccess: false,
        where: { and: [{ visible: { equals: true } }, { _status: { equals: "published" } }, { "seo.indexable": { not_equals: false } }] },
      }),
    ]);
    return { locale, pages: pages.docs, posts: posts.docs };
  }));
  const available = new Set(rows.flatMap(({ locale, pages, posts }) => [
    ...pages.filter((page) => mainPageKey(page.internalTitle)).map((page) => pageRoutePath(locale, { key: mainPageKey(page.internalTitle)!, slug: page.slug })),
    ...posts.filter((post) => !!post.slug).map((post) => postPath(locale, post)),
  ]));
  const entries: MetadataRoute.Sitemap = [];
  for (const { locale, pages, posts } of rows) {
    for (const page of pages) {
      const key = mainPageKey(page.internalTitle);
      if (!key) continue;
      const enPath = href("en", key === "home" ? "" : key);
      const arPath = href("ar", key === "home" ? "" : key);
      entries.push({
        url: `${origin}${pageRoutePath(locale, { key, slug: page.slug })}`,
        lastModified: page.updatedAt,
        changeFrequency: page.seo?.sitemapChangeFrequency || "monthly",
        priority: Number(page.seo?.sitemapPriority ?? 0.7),
        alternates: { languages: {
          ...(available.has(enPath) ? { en: `${origin}${enPath}` } : {}),
          ...(available.has(arPath) ? { ar: `${origin}${arPath}` } : {}),
        } },
      });
    }
    for (const post of posts) {
      if (!post.slug) continue;
      const path = postPath("en", post);
      entries.push({
        url: `${origin}${postPath(locale, post)}`, lastModified: post.updatedAt, changeFrequency: "monthly", priority: 0.6,
        alternates: { languages: {
          ...(available.has(path) ? { en: `${origin}${path}` } : {}),
          ...(available.has(postPath("ar", post)) ? { ar: `${origin}${postPath("ar", post)}` } : {}),
        } },
      });
    }
  }
  return entries;
}
