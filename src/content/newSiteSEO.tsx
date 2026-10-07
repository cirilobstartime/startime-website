import "server-only";

import configPromise from "@payload-config";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { cache } from "react";
import type { GlobalSeo, Media, Page } from "@/generated/payload-types";
import type { Locale } from "@/content/home";
import { homeContent } from "@/content/home";
import { cmsMediaURL } from "@/content/cmsMediaURL";
import { publicPath } from "@/lib/publicPath";
import { postPath } from "@/lib/postPath";
import { getPageRoutes } from "@/content/pageRoutes";
import { resolvePageHref } from "@/lib/pageRoutes";

const fallbackOrigin = "https://startime.sa";
const stagingNoIndex = process.env.STAGING_NOINDEX === "1";

export const getGlobalSEO = cache(async (locale: Locale): Promise<GlobalSeo | null> => {
  try {
    const payload = await getPayload({ config: configPromise });
    const seo = await payload.findGlobal({ slug: "global-seo", depth: 1, draft: false, fallbackLocale: false, locale, overrideAccess: false });
    return seo._status === "published" ? seo : null;
  } catch (error) {
    console.error("Global SEO settings unavailable:", error);
    return null;
  }
});

const getPageRecord = cache(async (slug: string, locale: Locale): Promise<Page | null> => {
  try {
    const payload = await getPayload({ config: configPromise });
    const record = await payload.find({ collection: "pages", depth: 1, draft: false, fallbackLocale: false, locale, limit: 1, overrideAccess: false,
      where: { and: [
        { internalTitle: { equals: slug === "home" ? "New Site: Home" : `New Site: ${slug}` } },
        { _status: { equals: "published" } },
        { visible: { equals: true } },
      ] },
    });
    return record.docs[0] || null;
  } catch (error) {
    console.error(`SEO page record unavailable for ${slug}:`, error);
    return null;
  }
});

function originFor(seo: GlobalSeo | null): string {
  const raw = seo?.siteURL?.replace(/\/$/, "");
  return raw && /^https:\/\/[^\s/]+$/i.test(raw) ? raw : fallbackOrigin;
}
function mediaUrl(value: number | Media | null | undefined, origin: string): string | undefined {
  const path = typeof value === "object" && value?.url ? cmsMediaURL(value.url) : null;
  return path ? new URL(path, origin).toString() : undefined;
}
async function canonicalPath(slug: string, locale: Locale): Promise<string> {
  if (/^(?:news|insights)\/[^/]+$/.test(slug)) return publicPath(locale, slug);
  return resolvePageHref(publicPath(locale, slug === "home" ? "" : slug), await getPageRoutes());
}
function pageDisplayTitle(slug: string, locale: Locale, saved?: string | null): string {
  if (saved && !/^(?:Startime|ستارتايم)\s*[·]\s*(?:discover|vision|investment|careers|insights|contact|latest-news)$/i.test(saved)) return saved;
  if (slug === "home") return locale === "ar" ? "ستارتايم" : "Startime";
  if (slug === "latest-news") return locale === "ar" ? "آخر الأخبار" : "Latest News";
  const index = ["", "discover", "vision", "investment", "careers", "insights", "contact"].indexOf(slug);
  return index > 0 ? homeContent[locale].nav[index] : saved || (locale === "ar" ? "ستارتايم" : "Startime");
}
function absoluteCanonical(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  try {
    const url = new URL(value, fallback);
    return url.protocol === "https:" ? url.toString() : fallback;
  } catch { return fallback; }
}

export async function getNewSiteMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const [seo, page] = await Promise.all([getGlobalSEO(locale), getPageRecord(slug, locale)]);
  const origin = originFor(seo);
  const canonical = absoluteCanonical(page?.seo?.canonicalURL, new URL(await canonicalPath(slug, locale), origin).toString());
  const pageTitle = page?.seo?.title || pageDisplayTitle(slug, locale, page?.title) || seo?.defaultTitle || (locale === "ar" ? "ستارتايم" : "Startime Events Company");
  const template = seo?.titleTemplate || "%s | Startime";
  const title = slug === "home" ? pageTitle : template.replace("%s", pageTitle);
  const description = page?.seo?.description || page?.summary || seo?.defaultDescription || homeContent[locale].footerBio;
  const openGraphImage = mediaUrl(page?.seo?.openGraphImage || seo?.openGraphImage, origin);
  const twitterImage = mediaUrl(seo?.twitterImage, origin) || openGraphImage;
  const isIndexable = !stagingNoIndex && seo?.allowSearchIndexing === true && page?.seo?.indexable !== false;
  const follow = isIndexable && seo?.followLinks !== false && page?.seo?.followLinks !== false;
  const alternatePath = await canonicalPath(slug, locale === "en" ? "ar" : "en");
  const alternate = new URL(alternatePath, origin).toString();
  return {
    metadataBase: new URL(origin), title, description,
    keywords: seo?.defaultKeywords?.map((item) => item.keyword).filter(Boolean),
    alternates: {
      canonical,
      ...(seo?.includeHreflang !== false ? { languages: {
        en: locale === "en" ? canonical : alternate,
        ar: locale === "ar" ? canonical : alternate,
        ...(seo?.includeXDefault !== false ? { "x-default": new URL(await canonicalPath(slug, "en"), origin).toString() } : {}),
      } } : {}),
    },
    robots: {
      index: isIndexable, follow, noarchive: seo?.noArchive === true,
      noimageindex: seo?.noImageIndex === true,
      "max-snippet": seo?.maxSnippet ?? undefined,
      "max-image-preview": seo?.maxImagePreview || undefined,
      "max-video-preview": seo?.maxVideoPreview ?? undefined,
      googleBot: { index: isIndexable, follow },
    },
    openGraph: {
      type: "website", siteName: seo?.siteName || "Startime", locale: locale === "ar" ? "ar_SA" : "en_US",
      url: canonical, title: page?.seo?.openGraphTitle || seo?.openGraphTitle || title,
      description: page?.seo?.openGraphDescription || seo?.openGraphDescription || description,
      ...(openGraphImage ? { images: [{ url: openGraphImage, alt: seo?.openGraphImageAlt || pageTitle }] } : {}),
    },
    twitter: {
      card: seo?.twitterCard || "summary_large_image", title: page?.seo?.openGraphTitle || seo?.openGraphTitle || title,
      description: page?.seo?.openGraphDescription || seo?.openGraphDescription || description,
      ...(twitterImage ? { images: [twitterImage] } : {}),
      ...(seo?.twitterSite ? { site: seo.twitterSite } : {}),
      ...(seo?.twitterCreator ? { creator: seo.twitterCreator } : {}),
    },
    verification: { ...(seo?.googleVerification ? { google: seo.googleVerification } : {}), other: {
      ...(seo?.bingVerification ? { "msvalidate.01": seo.bingVerification } : {}),
      ...(seo?.yandexVerification ? { "yandex-verification": seo.yandexVerification } : {}),
    } },
  };
}

export async function getNewSiteArticleMetadata(slug: string, locale: Locale, article: { type?: "news" | "article"; title: string; description?: string; image?: string }): Promise<Metadata> {
  const detailSlug = postPath("en", { slug, type: article.type || "article" }).slice(1);
  const base = await getNewSiteMetadata(detailSlug, locale);
  const seo = await getGlobalSEO(locale);
  const title = (seo?.titleTemplate || "%s | Startime").replace("%s", article.title);
  const url = new URL(await canonicalPath(detailSlug, locale), originFor(seo)).toString();
  const image = article.image ? new URL(article.image, originFor(seo)).toString() : undefined;
  return {
    ...base, title, description: article.description || base.description,
    alternates: { ...base.alternates, canonical: url,
      ...(seo?.includeHreflang !== false ? { languages: {
        en: `${originFor(seo)}${await canonicalPath(detailSlug, "en")}`,
        ar: `${originFor(seo)}${await canonicalPath(detailSlug, "ar")}`,
        ...(seo?.includeXDefault !== false ? { "x-default": `${originFor(seo)}${await canonicalPath(detailSlug, "en")}` } : {}),
      } } : {}),
    },
    openGraph: { type: "article", title, description: article.description || base.description || "", url,
      ...(image ? { images: [{ url: image, alt: article.title }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description: article.description || base.description || "",
      ...(image ? { images: [image] } : {}),
    },
  };
}

function validSchemaNode(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) && typeof (value as Record<string, unknown>)["@type"] === "string"
    ? value as Record<string, unknown> : null;
}

export async function NewSiteSeoSchema({ slug, locale, article }: { slug: string; locale: Locale; article?: { title: string; description?: string; image?: string; datePublished?: string; dateModified?: string } }) {
  const [seo, page] = await Promise.all([getGlobalSEO(locale), article ? Promise.resolve(null) : getPageRecord(slug, locale)]);
  const origin = originFor(seo);
  const url = new URL(await canonicalPath(slug, locale), origin).toString();
  const name = seo?.organizationName || seo?.siteName || "Startime";
  const organizationId = `${origin}/#organization`;
  const nodes: Record<string, unknown>[] = [];
  if (seo?.enableOrganizationSchema !== false) {
    const address = seo?.addressLocality || seo?.streetAddress || seo?.addressCountry ? {
      "@type": "PostalAddress", ...(seo?.streetAddress ? { streetAddress: seo.streetAddress } : {}),
      ...(seo?.addressLocality ? { addressLocality: seo.addressLocality } : {}),
      ...(seo?.addressRegion ? { addressRegion: seo.addressRegion } : {}),
      ...(seo?.postalCode ? { postalCode: seo.postalCode } : {}),
      ...(seo?.addressCountry ? { addressCountry: seo.addressCountry } : {}),
    } : undefined;
    nodes.push({ "@type": "Organization", "@id": organizationId, name, url: origin,
      ...(seo?.legalName ? { legalName: seo.legalName } : {}),
      ...(seo?.alternateName ? { alternateName: seo.alternateName } : {}),
      ...(seo?.organizationDescription ? { description: seo.organizationDescription } : {}),
      ...(mediaUrl(seo?.organizationLogo, origin) ? { logo: mediaUrl(seo?.organizationLogo, origin) } : {}),
      ...(seo?.foundingDate ? { foundingDate: seo.foundingDate } : {}),
      ...(seo?.organizationPhone ? { telephone: seo.organizationPhone } : {}),
      ...(seo?.organizationEmail ? { email: seo.organizationEmail } : {}),
      ...(seo?.sameAs?.length ? { sameAs: seo.sameAs.map((entry) => entry.url).filter((value): value is string => !!value && /^https:\/\//.test(value)) } : {}),
      ...(seo?.areasServed?.length ? { areaServed: seo.areasServed.map((entry) => entry.name) } : {}),
      ...(seo?.knowsAbout?.length ? { knowsAbout: seo.knowsAbout.map((entry) => entry.topic) } : {}),
      ...(address ? { address } : {}),
      ...(seo?.latitude != null && seo?.longitude != null ? { geo: { "@type": "GeoCoordinates", latitude: seo.latitude, longitude: seo.longitude } } : {}),
      ...(seo?.contactType && (seo?.organizationPhone || seo?.organizationEmail) ? { contactPoint: { "@type": "ContactPoint", contactType: seo.contactType,
        ...(seo?.organizationPhone ? { telephone: seo.organizationPhone } : {}),
        ...(seo?.organizationEmail ? { email: seo.organizationEmail } : {}),
      } } : {}),
    });
  }
  if (seo?.enableWebsiteSchema !== false) nodes.push({ "@type": "WebSite", "@id": `${origin}/#website`, url: origin, name: seo?.siteName || name,
    inLanguage: ["en", "ar"], ...(seo?.enableOrganizationSchema !== false ? { publisher: { "@id": organizationId } } : {}),
  });
  const pageTitle = article?.title || page?.seo?.title || pageDisplayTitle(slug, locale, page?.title) || seo?.defaultTitle || name;
  const description = article?.description || page?.seo?.description || page?.summary || seo?.defaultDescription;
  if (article && seo?.enableArticleSchema !== false) nodes.push({ "@type": "Article", "@id": `${url}#article`, headline: pageTitle, mainEntityOfPage: url,
    ...(description ? { description } : {}), ...(article.image ? { image: new URL(article.image, origin).toString() } : {}),
    ...(article.datePublished ? { datePublished: article.datePublished } : {}),
    ...(article.dateModified ? { dateModified: article.dateModified } : {}),
    ...(seo?.enableOrganizationSchema !== false ? { publisher: { "@id": organizationId } } : {}),
  });
  if (seo?.enableWebPageSchema !== false) nodes.push({ "@type": "WebPage", "@id": `${url}#webpage`, url, name: pageTitle,
    ...(description ? { description } : {}), inLanguage: locale,
    ...(seo?.enableWebsiteSchema !== false ? { isPartOf: { "@id": `${origin}/#website` } } : {}),
    ...(article && seo?.enableArticleSchema !== false ? { mainEntity: { "@id": `${url}#article` } } : {}),
  });
  if (slug !== "home" && seo?.enableBreadcrumbSchema !== false) nodes.push({ "@type": "BreadcrumbList", "@id": `${url}#breadcrumbs`, itemListElement: [
    { "@type": "ListItem", position: 1, name: locale === "ar" ? "الرئيسية" : "Home", item: `${origin}${publicPath(locale)}` },
    { "@type": "ListItem", position: 2, name: pageTitle, item: url },
  ] });
  const extra = validSchemaNode(seo?.additionalSchema);
  if (extra) nodes.push(extra);
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(/</g, "\\u003c");
  const nonce = (await headers()).get("x-nonce") || undefined;
  // Browsers intentionally hide nonce attributes from DOM attribute reads after
  // parsing; React can otherwise report a false hydration mismatch in dev.
  return <script nonce={nonce} suppressHydrationWarning type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
