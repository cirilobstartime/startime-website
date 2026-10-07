import { canonicalizePublicHref, publicPath, type PublicLocale } from "./publicPath";

export const mainPageKeys = ["home", "discover", "vision", "investment", "careers", "insights", "latest-news", "contact"] as const;
export type MainPageKey = typeof mainPageKeys[number];
export type PageRoute = { id: number; key: MainPageKey; slug: string; visible: boolean };
export type PageRoutes = Record<PublicLocale, PageRoute[]>;

export function mainPageKey(title?: string | null): MainPageKey | undefined {
  return mainPageKeys.find((key) => title === `New Site: ${key === "home" ? "Home" : key}`);
}

export function pageRoutePath(locale: PublicLocale, page: Pick<PageRoute, "key" | "slug">): string {
  return publicPath(locale, page.key === "home" ? "" : page.slug);
}

/** Resolve internal layout links without modifying the editor's saved content. */
export function resolvePageHref(href: string, routes: PageRoutes): string {
  const normalized = canonicalizePublicHref(href);
  if (!normalized.startsWith("/") || normalized.startsWith("//")) return href;
  const [path] = normalized.split(/[?#]/);
  const suffix = normalized.slice(path.length);
  const locale: PublicLocale = /^\/ar(?:\/|$)/.test(path) ? "ar" : "en";
  const segments = path.replace(/^\/ar(?=\/|$)/, "").split("/").filter(Boolean).map((segment) => {
    try { return decodeURIComponent(segment).normalize("NFC"); } catch { return segment; }
  });
  const first = segments[0] || "home";
  // Post detail prefixes are stable and independent of editable archive slugs.
  if (segments.length === 2 && (first === "news" || first === "insights")) return normalized;
  const page = routes[locale].find((item) => item.slug === first)
    || routes[locale].find((item) => item.key === first);
  if (!page) return normalized;
  // The only main-page child routes are editorial detail pages.
  if (segments.length > 1 && page.key !== "insights") return normalized;
  return pageRoutePath(locale, page) + (segments.length > 1 ? `/${segments.slice(1).join("/")}` : "") + suffix;
}

export function alternatePageHref(href: string, routes: PageRoutes): string {
  const path = canonicalizePublicHref(href);
  const locale: PublicLocale = /^\/ar(?:\/|$)/.test(path) ? "ar" : "en";
  const other = locale === "en" ? "ar" : "en";
  const segments = path.replace(/^\/ar(?=\/|$)/, "").split("/").filter(Boolean).map((segment) => {
    try { return decodeURIComponent(segment).normalize("NFC"); } catch { return segment; }
  });
  if (segments.length === 2 && (segments[0] === "news" || segments[0] === "insights")) return publicPath(other, segments.join("/"));
  const page = routes[locale].find((item) => item.slug === (segments[0] || "home"))
    || routes[locale].find((item) => item.key === (segments[0] || "home"));
  const alternate = page && routes[other].find((item) => item.key === page.key);
  return alternate ? pageRoutePath(other, alternate) + (segments.length > 1 ? `/${segments.slice(1).join("/")}` : "")
    : publicPath(other, segments.join("/"));
}
