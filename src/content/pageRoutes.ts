import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { getCMSRedirect } from "./payload";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { mainPageKey, mainPageKeys, pageRoutePath, type MainPageKey, type PageRoutes } from "@/lib/pageRoutes";
import type { PublicLocale } from "@/lib/publicPath";

export const getPageRoutes = cache(async (): Promise<PageRoutes> => {
  const payload = await getPayload({ config: configPromise });
  const locales = await Promise.all((["en", "ar"] as const).map(async (locale) => {
    const pages = await payload.find({ collection: "pages", locale, fallbackLocale: false, draft: false,
      depth: 0, limit: 100, overrideAccess: false,
      select: { internalTitle: true, slug: true, visible: true, _status: true },
      where: { and: [{ internalTitle: { in: mainPageKeys.map((key) => `New Site: ${key === "home" ? "Home" : key}`) } }, { _status: { equals: "published" } }] },
    });
    return pages.docs.flatMap((page) => {
      const key = mainPageKey(page.internalTitle);
      return key && page.slug ? [{ id: page.id, key, slug: page.slug, visible: page.visible !== false }] : [];
    });
  }));
  return { en: locales[0], ar: locales[1] };
});

export async function getPagePath(key: MainPageKey, locale: PublicLocale): Promise<string> {
  const page = (await getPageRoutes())[locale].find((item) => item.key === key);
  return pageRoutePath(locale, page || { key, slug: key });
}

/** Run in page rendering too: Next can reuse layouts during client navigation. */
export const assertPageRoute = cache(async (key: MainPageKey, locale: PublicLocale) => {
  const requestHeaders = await headers();
  const path = requestHeaders.get("x-startime-public-path") || "/";
  const segments = path.replace(/^\/(?:ar|en)(?=\/|$)/, "").split("/").filter(Boolean);
  if (key === "home" || segments[0] !== key) return;
  const page = (await getPageRoutes())[locale].find((item) => item.key === key);
  if (!page || page.slug === key) return;
  const match = await getCMSRedirect(locale, pageRoutePath(locale, { key, slug: key }));
  if (!match) notFound();
  const destination = pageRoutePath(locale, { key: match.key as MainPageKey, slug: match.slug })
    + (segments.length > 1 ? `/${segments.slice(1).join("/")}` : "")
    + (requestHeaders.get("x-startime-public-search") || "");
  if (match.permanent) permanentRedirect(destination);
  redirect(destination);
});
