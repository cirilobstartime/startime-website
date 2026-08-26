import type { MetadataRoute } from "next";
import { getSiteChrome } from "@/content/payload";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const chrome = await getSiteChrome("en");
  const allowIndexing = chrome.allowSearchIndexing;
  const origin = (
    process.env.NEXT_PUBLIC_APP_URL || "https://startime.sa"
  ).replace(/\/$/, "");
  return {
    rules: allowIndexing
      ? {
          allow: "/",
          disallow: [
            "/content-admin",
            "/content-admin/",
            "/api/",
            "/uploads/form-submissions/",
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
