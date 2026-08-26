import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { InsightArticle } from "@/components/InsightArticle";
import { InsightsArchive } from "@/components/InsightsArchive";
import { SectionRenderer } from "@/components/SectionRenderer";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getMarketingSettings,
  getCMSRedirect,
  getInsight,
  getInsightArchive,
  getPage,
  getSiteChrome,
} from "@/content/payload";
import type { Locale } from "@/content/types";
import type { MediaValue } from "@/content/types";

type PageProps = {
  params: Promise<{
    path?: string[];
  }>;
};

function mediaURL(media?: MediaValue): string | undefined {
  if (!media) return undefined;
  if (typeof media === "string") return media;
  return media.url || undefined;
}

function routeToCMSlug(slug?: string[]): string {
  if (!slug?.length) return "home";
  return slug.join("/");
}

/**
 * The site layout owns the single authoritative Startime Organization entity.
 * Page-level JSON-LD may still describe WebPage, Article, Event, and similar
 * entities, but must reference that entity rather than redefine it.
 */
function normalizePageStructuredData(schema: Record<string, unknown>) {
  const graph = schema["@graph"];
  if (!Array.isArray(graph)) return schema;

  return {
    ...schema,
    "@graph": graph.filter(
      (node) =>
        !(
          node &&
          typeof node === "object" &&
          (node as Record<string, unknown>)["@type"] === "Organization" &&
          (node as Record<string, unknown>)["@id"] ===
            "https://startime.sa/#organization"
        ),
    ),
  };
}

function resolveRoute(path?: string[]): {
  locale: Locale;
  publicPath: string;
  slug: string[];
} {
  const locale: Locale = path?.[0] === "ar" ? "ar" : "en";
  const slug = locale === "ar" ? path?.slice(1) || [] : path || [];
  const suffix = slug.length ? `/${slug.join("/")}` : "";
  return {
    locale,
    publicPath: locale === "ar" ? `/ar${suffix}` : suffix || "/",
    slug,
  };
}

function publicPathForSlug(locale: Locale, slug: string): string {
  const suffix = slug && slug !== "home" ? `/${slug}` : "";
  return locale === "ar" ? `/ar${suffix}` : suffix || "/";
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { path } = await params;
  const { locale, publicPath, slug } = resolveRoute(path);
  if (slug.length === 1 && slug[0] === "insights") {
    const title =
      locale === "ar"
        ? "الأخبار والرؤى | ستارتايم"
        : "News and Insights | Startime";
    const description =
      locale === "ar"
        ? "تابع أحدث أخبار ستارتايم ورؤاها حول القطاعات والتجارب التي تصنع أثراً."
        : "Explore Startime news, event updates, and perspectives shaping the industries we serve.";
    return {
      title,
      description,
      alternates: {
        canonical: publicPath,
        languages: {
          ar: "/ar/insights",
          en: "/insights",
          "x-default": "/insights",
        },
      },
      robots: { follow: true, index: true },
    };
  }
  const chromePromise = getSiteChrome(locale);
  const insight =
    slug.length === 3 && slug[0] === "insights"
      ? await getInsight(locale, slug[2], slug[1])
      : null;
  if (insight) {
    const chrome = await chromePromise;
    const socialImage = mediaURL(insight.featuredImage);
    const title = insight.seo?.title || insight.title;
    const description = insight.seo?.description || insight.summary;
    const suffix = `/insights/${insight.slug}`;
    return {
      title,
      description,
      alternates: {
        canonical: publicPath,
        languages: {
          ar: `/ar${suffix}`,
          en: suffix || "/",
          "x-default": suffix || "/",
        },
      },
      openGraph: {
        description,
        images: socialImage
          ? [{ alt: insight.title, url: socialImage }]
          : undefined,
        locale: locale === "ar" ? "ar_SA" : "en_US",
        siteName: chrome.siteName,
        title,
        type: "article",
        url: publicPath,
      },
      robots: {
        follow: chrome.allowSearchIndexing,
        index: chrome.allowSearchIndexing && insight.seo?.indexable !== false,
      },
      twitter: {
        card: socialImage ? "summary_large_image" : "summary",
        description,
        images: socialImage ? [socialImage] : undefined,
        title,
      },
    };
  }
  const [page, marketing, chrome] = await Promise.all([
    getPage(locale, routeToCMSlug(slug)),
    getMarketingSettings(locale),
    chromePromise,
  ]);
  if (!page) return {};
  const suffix = slug.length ? `/${slug.join("/")}` : "";
  const firstVisual = page.sections.find(
    (section) => "media" in section && section.media,
  );
  const socialImage =
    mediaURL(page.seo?.openGraphImage) ||
    (firstVisual && "media" in firstVisual
      ? mediaURL(firstVisual.media)
      : undefined);
  const title = page.seo?.title || page.title;
  const description =
    page.seo?.description ||
    page.summary ||
    chrome.defaultSEODescription ||
    undefined;

  return {
    title,
    description,
    alternates: {
      canonical: page.seo?.canonicalURL || publicPath,
      languages: {
        ar: `/ar${suffix}`,
        en: suffix || "/",
        "x-default": suffix || "/",
      },
    },
    openGraph: {
      description: page.seo?.openGraphDescription || description,
      images: socialImage ? [{ alt: page.title, url: socialImage }] : undefined,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      siteName: chrome.siteName,
      title: page.seo?.openGraphTitle || page.seo?.title || page.title,
      type: page.pageType === "article" ? "article" : "website",
      url: publicPath,
    },
    robots: {
      follow: chrome.allowSearchIndexing && page.seo?.followLinks !== false,
      index: chrome.allowSearchIndexing && page.seo?.indexable !== false,
    },
    other: page.pageType === "home" ? { title } : undefined,
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      description: page.seo?.openGraphDescription || description,
      images: socialImage ? [socialImage] : undefined,
      title: page.seo?.openGraphTitle || title,
    },
    verification: {
      google: marketing.googleSiteVerification || undefined,
      other:
        marketing.metaDomainVerification || marketing.bingSiteVerification
          ? {
              ...(marketing.metaDomainVerification
                ? {
                    "facebook-domain-verification":
                      marketing.metaDomainVerification,
                  }
                : {}),
              ...(marketing.bingSiteVerification
                ? { "msvalidate.01": marketing.bingSiteVerification }
                : {}),
            }
          : undefined,
    },
  };
}

export default async function PublicPage({ params }: PageProps) {
  const nonce = (await headers()).get("x-nonce") || "";
  const { path } = await params;
  if (path?.[0] === "en") {
    const englishPath = path.slice(1);
    permanentRedirect(englishPath.length ? `/${englishPath.join("/")}` : "/");
  }
  if (path?.join("/") === "insights/strategic-event-platforms") {
    permanentRedirect("/insights/seabed-security-maritime-supply-chains");
  }

  const { locale, publicPath, slug } = resolveRoute(path);
  if (slug.length === 1 && slug[0] === "insights") {
    const [chrome, archive] = await Promise.all([
      getSiteChrome(locale),
      getInsightArchive(locale, "all"),
    ]);
    return (
      <InsightsArchive categories={archive} chrome={chrome} locale={locale} />
    );
  }
  if (
    slug.length === 2 &&
    slug[0] === "insights" &&
    ["news", "articles"].includes(slug[1])
  ) {
    permanentRedirect(locale === "ar" ? "/ar/insights" : "/insights");
  }
  if (slug.length === 2 && slug[0] === "insights") {
    const legacyInsight = await getInsight(locale, slug[1]);
    if (legacyInsight?.categorySlug) {
      permanentRedirect(
        `${locale === "ar" ? "/ar" : ""}/insights/${legacyInsight.categorySlug}/${legacyInsight.slug}`,
      );
    }
  }
  const [page, chrome, insight] = await Promise.all([
    getPage(locale, routeToCMSlug(slug)),
    getSiteChrome(locale),
    slug.length === 3 && slug[0] === "insights"
      ? getInsight(locale, slug[2], slug[1])
      : Promise.resolve(null),
  ]);
  const routePath = slug.length ? `/${slug.join("/")}` : "";
  if (insight) {
    return (
      <div
        className="site"
        data-locale={locale}
        dir={locale === "ar" ? "rtl" : "ltr"}
        lang={locale}
      >
        <SiteHeader chrome={chrome} locale={locale} routePath={routePath} />
        <main id="main-content">
          <InsightArticle insight={insight} locale={locale} />
        </main>
        <SiteFooter chrome={chrome} />
      </div>
    );
  }
  if (!page) {
    const oldPath = `/${slug.join("/")}`;
    const destination = await getCMSRedirect(locale, oldPath);
    if (destination) {
      const target = publicPathForSlug(locale, destination.slug);
      if (destination.permanent) permanentRedirect(target);
      redirect(target);
    }
    notFound();
  }

  const firstContentSectionIndex = page.sections.findIndex(
    (section) => section.visible !== false && section.blockType !== "hero",
  );

  return (
    <div
      className="site"
      data-locale={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={locale}
    >
      <SiteHeader chrome={chrome} locale={locale} routePath={routePath} />
      <main id="main-content">
        {page.seo?.structuredData ? (
          <script
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                normalizePageStructuredData(page.seo.structuredData),
              ).replaceAll("<", "\\u003c"),
            }}
            nonce={nonce}
            type="application/ld+json"
          />
        ) : null}
        {page.sections.map((section, index) => (
          <SectionRenderer
            key={section.id || `${section.blockType}-${index}`}
            locale={locale}
            pagePath={publicPath}
            section={
              index === firstContentSectionIndex && !section.anchorID
                ? { ...section, anchorID: "after-hero" }
                : section
            }
          />
        ))}
      </main>
      <SiteFooter chrome={chrome} />
    </div>
  );
}
