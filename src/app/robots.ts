import type { MetadataRoute } from "next";
import { getGlobalSEO } from "@/content/newSiteSEO";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getGlobalSEO("en");
  const allowIndexing = process.env.STAGING_NOINDEX !== "1" && seo?.allowSearchIndexing === true;
  const origin = /^https:\/\/[^\s/]+$/i.test(seo?.siteURL || "") ? seo!.siteURL! : "https://www.startime.sa";
  const extraDisallow = (seo?.robotsAdditionalRules || "").split(/\r?\n/)
    .map((line) => line.match(/^\s*Disallow:\s*(\/[A-Za-z0-9_./*?=&%-]*)\s*$/i)?.[1])
    .filter((value): value is string => !!value && value !== "/");
  return {
    rules: allowIndexing
      ? {
          allow: "/",
          disallow: [
            "/content-admin",
            "/content-admin/",
            "/api/",
            "/uploads/form-submissions/",
            ...extraDisallow,
          ],
          userAgent: "*",
        }
      : {
          disallow: "/",
          userAgent: "*",
        },
    sitemap: allowIndexing ? `${origin}/sitemap.xml` : undefined,
  };
}
