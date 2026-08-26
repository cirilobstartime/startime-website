import configPromise from "@payload-config";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import { getDefaultChrome, getDefaultPage } from "./defaults";
import type {
  Locale,
  MarketingSettings,
  NewsMosaicSection,
  PageSection,
  PublicInsight,
  PublicInsightCategory,
  PublicPage,
  SiteChrome,
} from "./types";

async function fetchInsight(
  locale: Locale,
  slug: string,
  categorySlug?: string,
): Promise<PublicInsight | null> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "insights-posts",
      depth: 2,
      draft: false,
      fallbackLocale: false,
      limit: 1,
      locale,
      overrideAccess: true,
      where: {
        and: [
          { slug: { equals: slug } },
          { visible: { equals: true } },
          { _status: { equals: "published" } },
        ],
      },
    });
    const post = result.docs[0];
    const image =
      post?.featuredImage && typeof post.featuredImage === "object"
        ? post.featuredImage
        : null;
    if (
      !post?.title ||
      !post.slug ||
      !post.summary ||
      !post.publishedAt ||
      !post.publicationLabel ||
      !image
    ) {
      return null;
    }
    const category =
      post.category && typeof post.category === "object" ? post.category : null;
    if (categorySlug && category?.slug !== categorySlug) return null;
    return {
      category: category?.title || null,
      categorySlug: category?.slug || null,
      content: (post.content || []).flatMap((section) =>
        section?.body ? [{ body: section.body, heading: section.heading }] : [],
      ),
      featuredImage: image,
      intro: post.intro,
      publishedAt: post.publishedAt,
      publicationLabel: post.publicationLabel,
      seo: post.seo,
      slug: post.slug,
      summary: post.summary,
      title: post.title,
    };
  } catch {
    return null;
  }
}

function normalizeSections(value: unknown): PageSection[] {
  if (!Array.isArray(value)) return [];

  // Payload stores block arrays in their editor-defined drag order. Preserve
  // that order exactly; sorting by the legacy displayOrder field caused a
  // dragged section to jump back to its previous position on the public site.
  return value.filter((section): section is PageSection =>
    Boolean(
      section &&
      typeof section === "object" &&
      "blockType" in section &&
      (section as { visible?: boolean }).visible !== false,
    ),
  );
}

async function fetchInsightArticles(
  payload: Awaited<ReturnType<typeof getPayload>>,
  locale: Locale,
  placement: "homepage" | "insights",
  categorySlug?: string,
  includeCategory = true,
): Promise<NewsMosaicSection["articles"]> {
  const placementField =
    placement === "homepage" ? "showOnHomepage" : "showOnInsightsPage";
  const result = await payload.find({
    collection: "insights-posts",
    depth: 2,
    draft: false,
    fallbackLocale: false,
    limit: placement === "homepage" ? 5 : 500,
    locale,
    overrideAccess: true,
    sort: "-publishedAt",
    where: {
      and: [
        { visible: { equals: true } },
        { [placementField]: { equals: true } },
        { _status: { equals: "published" } },
      ],
    },
  });
  const dateFormatter = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-SA" : "en-GB",
    {
      month: "long",
      year: "numeric",
    },
  );

  return result.docs.flatMap((post) => {
    const category =
      post.category && typeof post.category === "object" ? post.category : null;
    const image =
      post.featuredImage && typeof post.featuredImage === "object"
        ? post.featuredImage
        : null;
    if (!post.title || !post.summary || !post.destination || !image) return [];
    if (categorySlug && category?.slug !== categorySlug) return [];
    const categoryLabel = category?.title || "Startime";
    const href = `${locale === "ar" ? "/ar" : ""}/insights/${category?.slug || "news"}/${post.slug}`;
    return [
      {
        href,
        kicker: post.publicationLabel
          ? includeCategory
            ? `${categoryLabel} · ${post.publicationLabel}`
            : post.publicationLabel
          : post.publishedAt
            ? includeCategory
              ? `${categoryLabel} · ${dateFormatter.format(new Date(post.publishedAt))}`
              : dateFormatter.format(new Date(post.publishedAt))
            : includeCategory
              ? categoryLabel
              : "",
        media: image,
        publishedAt: post.publishedAt || null,
        summary: post.summary,
        title: post.title,
      },
    ];
  });
}

async function fetchInsightArchive(
  locale: Locale,
  categorySlug: string,
): Promise<PublicInsightCategory[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const categories = await payload.find({
      collection: "insight-categories",
      depth: 1,
      draft: false,
      fallbackLocale: false,
      limit: 20,
      locale,
      overrideAccess: true,
      sort: "displayOrder",
      where: { visible: { equals: true } },
    });
    const selected = categories.docs.filter(
      (category) =>
        categorySlug === "all" || category.slug === categorySlug,
    );
    return Promise.all(selected.map(async (category) => ({
      articles: await fetchInsightArticles(payload, locale, "insights", category.slug, false),
      slug: category.slug,
      title: category.title,
    })));
  } catch {
    return [];
  }
}

async function fetchPage(
  locale: Locale,
  route: string,
): Promise<PublicPage | null> {
  const fallbackType = route === "home" ? "home" : route;
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "pages",
      depth: 2,
      draft: false,
      fallbackLocale: false,
      limit: 1,
      locale,
      overrideAccess: true,
      where: {
        and: [
          { slug: { equals: route } },
          { visible: { equals: true } },
          { _status: { equals: "published" } },
        ],
      },
    });
    const page = result.docs[0];

    if (!page || !page.title) return null;
    const now = Date.now();
    if (
      (page.publishFrom && new Date(page.publishFrom).getTime() > now) ||
      (page.publishUntil && new Date(page.publishUntil).getTime() <= now)
    ) {
      return null;
    }

    const pageType = String(page.pageType || fallbackType);
    let sections = normalizeSections(page.sections);
    if (pageType === "home" || pageType === "insights") {
      const articles = await fetchInsightArticles(
        payload,
        locale,
        pageType === "home" ? "homepage" : "insights",
      );
      if (articles.length) {
        sections = sections.map((section) =>
          section.blockType === "newsMosaic"
            ? { ...section, articles }
            : section,
        );
      }
    }

    return {
      pageType,
      sections,
      seo: page.seo as PublicPage["seo"],
      slug: String(page.slug || ""),
      summary: page.summary,
      title: page.title,
    };
  } catch {
    return getDefaultPage(locale, fallbackType);
  }
}

async function fetchChrome(locale: Locale): Promise<SiteChrome> {
  try {
    const payload = await getPayload({ config: configPromise });
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 1,
      draft: false,
      fallbackLocale: false,
      locale,
      overrideAccess: true,
    });
    const fallback = getDefaultChrome(locale);
    // Payload keeps this global's working copy as a draft while the public
    // index setting is intentionally a launch control. Respect that explicit
    // setting even when the rest of the global is still awaiting publication.
    if (settings._status !== "published") {
      return {
        ...fallback,
        allowSearchIndexing: Boolean(settings.allowSearchIndexing),
      };
    }

    return {
      allowSearchIndexing: Boolean(settings.allowSearchIndexing),
      address: settings.address || fallback.address,
      companyHeading: settings.companyHeading || fallback.companyHeading,
      contactHeading: settings.contactHeading || fallback.contactHeading,
      copyright: settings.copyright || fallback.copyright,
      email: settings.email || fallback.email,
      footerDescription:
        settings.footerDescription || fallback.footerDescription,
      footerLogo:
        settings.footerLogo && typeof settings.footerLogo === "object"
          ? settings.footerLogo
          : fallback.footerLogo,
      sisterCompaniesHeading:
        settings.sisterCompaniesHeading || fallback.sisterCompaniesHeading,
      sisterCompanies: settings.sisterCompanies?.some(
        (item) => item.visible !== false && typeof item.logo === "object",
      )
        ? settings.sisterCompanies.flatMap((item) =>
            item.visible !== false && typeof item.logo === "object"
              ? [
                  {
                    alt:
                      item.alt ||
                      settings.sisterCompaniesHeading ||
                      fallback.sisterCompaniesHeading,
                    href: item.href || null,
                    logo: item.logo,
                  },
                ]
              : [],
          )
        : fallback.sisterCompanies,
      headerCtaHref: settings.headerCtaHref || fallback.headerCtaHref,
      headerCtaLabel: settings.headerCtaLabel || fallback.headerCtaLabel,
      headerLogo:
        settings.headerLogo && typeof settings.headerLogo === "object"
          ? settings.headerLogo
          : fallback.headerLogo,
      headerLogoDark:
        settings.headerLogoDark && typeof settings.headerLogoDark === "object"
          ? settings.headerLogoDark
          : fallback.headerLogoDark,
      navigation: settings.navigation?.some((item) => item.visible !== false)
        ? settings.navigation
            .filter((item) => item.visible !== false)
            .map((item) => ({
              href: item.href,
              label: item.label,
            }))
        : fallback.navigation,
      organization: {
        addressCountry:
          settings.organizationAddress?.addressCountry ||
          fallback.organization.addressCountry,
        addressLocality:
          settings.organizationAddress?.addressLocality ||
          fallback.organization.addressLocality,
        addressRegion:
          settings.organizationAddress?.addressRegion ||
          fallback.organization.addressRegion,
        alternateName:
          settings.organizationAlternateName ||
          fallback.organization.alternateName,
        description:
          settings.organizationDescription || fallback.organization.description,
        email:
          settings.organizationEmail ||
          settings.email ||
          fallback.organization.email,
        foundingDate:
          settings.foundingDate || fallback.organization.foundingDate,
        keywords: settings.organizationKeywords?.length
          ? settings.organizationKeywords.flatMap((item) =>
              item.keyword ? [item.keyword] : [],
            )
          : fallback.organization.keywords,
        latitude:
          settings.organizationAddress?.latitude ??
          fallback.organization.latitude,
        legalName:
          settings.organizationLegalName || fallback.organization.legalName,
        logo:
          settings.organizationLogo &&
          typeof settings.organizationLogo === "object"
            ? settings.organizationLogo
            : fallback.organization.logo,
        longitude:
          settings.organizationAddress?.longitude ??
          fallback.organization.longitude,
        name: settings.siteName || fallback.organization.name,
        phone: settings.organizationPhone || "+966920010500",
        postalCode:
          settings.organizationAddress?.postalCode ||
          fallback.organization.postalCode,
        streetAddress:
          settings.organizationAddress?.streetAddress ||
          fallback.organization.streetAddress,
        url: settings.organizationURL || fallback.organization.url,
      },
      phone: settings.phone || fallback.phone,
      siteName: settings.siteName || fallback.siteName,
      defaultSEODescription:
        settings.defaultSEODescription || fallback.defaultSEODescription,
      socialLinks: settings.socialLinks?.some((item) => item.visible !== false)
        ? settings.socialLinks
            .filter((item) => item.visible !== false)
            .map((item) => ({
              href: item.href,
              icon: item.icon || null,
              platform: item.platform,
            }))
        : fallback.socialLinks,
    };
  } catch {
    return getDefaultChrome(locale);
  }
}

async function fetchMarketing(locale: Locale): Promise<MarketingSettings> {
  const localizedFallback =
    locale === "ar"
      ? {
          acceptLabel: "السماح",
          cookieNotice:
            "نستخدم ملفات تعريف الارتباط الضرورية، وبموافقتك نستخدم التحليلات لتحسين تجربتك وقياس أداء الموقع.",
          rejectLabel: "رفض التحليلات",
          settingsLabel: "سياسة الخصوصية",
        }
      : {
          acceptLabel: "Allow analytics",
          cookieNotice:
            "We use essential cookies and, with your permission, analytics to improve your experience and measure website performance.",
          rejectLabel: "Reject analytics",
          settingsLabel: "Privacy policy",
        };
  const fallback: MarketingSettings = {
    ...localizedFallback,
    acceptedCampaignParameters:
      "utm_id,utm_source,utm_medium,utm_campaign,utm_term,utm_content,utm_source_platform,gclid,gbraid,wbraid,fbclid,msclkid,ttclid,li_fat_id,twclid",
    attributionCookieDays: 90,
    attributionCookieDomain: ".startime.sa",
    bingSiteVerification: "",
    crossDomainHosts: "startime.sa,sim.startime.sa",
    defaultConsentDenied: true,
    enableAnalytics: false,
    ga4MeasurementID: "",
    googleAdsID: "",
    googleSiteVerification: "",
    googleTagManagerID: "",
    linkedInPartnerID: "",
    metaDomainVerification: "",
    metaPixelID: "",
    privacyHref: locale === "ar" ? "/ar/privacy-policy" : "/privacy-policy",
    tiktokPixelID: "",
    xPixelID: "",
  };
  try {
    const payload = await getPayload({ config: configPromise });
    const settings = await payload.findGlobal({
      slug: "marketing-settings",
      depth: 0,
      draft: false,
      fallbackLocale: false,
      locale,
      overrideAccess: true,
    });
    if (settings._status !== "published") return fallback;
    return {
      acceptLabel: settings.acceptLabel || fallback.acceptLabel,
      acceptedCampaignParameters:
        settings.acceptedCampaignParameters ||
        fallback.acceptedCampaignParameters,
      attributionCookieDays: Number(
        settings.attributionCookieDays || fallback.attributionCookieDays,
      ),
      attributionCookieDomain:
        settings.attributionCookieDomain || fallback.attributionCookieDomain,
      bingSiteVerification: settings.bingSiteVerification || "",
      cookieNotice: settings.cookieNotice || fallback.cookieNotice,
      crossDomainHosts: settings.crossDomainHosts || fallback.crossDomainHosts,
      defaultConsentDenied: settings.defaultConsentDenied !== false,
      enableAnalytics: Boolean(settings.enableAnalytics),
      ga4MeasurementID: settings.ga4MeasurementID || "",
      googleAdsID: settings.googleAdsID || "",
      googleSiteVerification: settings.googleSiteVerification || "",
      googleTagManagerID: settings.googleTagManagerID || "",
      linkedInPartnerID: settings.linkedInPartnerID || "",
      metaDomainVerification: settings.metaDomainVerification || "",
      metaPixelID: settings.metaPixelID || "",
      privacyHref: settings.privacyHref || fallback.privacyHref,
      rejectLabel: settings.rejectLabel || fallback.rejectLabel,
      settingsLabel: settings.settingsLabel || fallback.settingsLabel,
      tiktokPixelID: settings.tiktokPixelID || "",
      xPixelID: settings.xPixelID || "",
    };
  } catch {
    return fallback;
  }
}

export const getPage = unstable_cache(fetchPage, ["startime-page-v20"], {
  revalidate: 60,
  tags: ["startime-pages"],
});

export const getInsight = fetchInsight;
export const getInsightArchive = fetchInsightArchive;

export const getSiteChrome = unstable_cache(
  fetchChrome,
  ["startime-chrome-v5"],
  {
    revalidate: 60,
    tags: ["startime-chrome"],
  },
);

export const getMarketingSettings = unstable_cache(
  fetchMarketing,
  ["startime-marketing-v1"],
  { revalidate: 60, tags: ["startime-marketing"] },
);

async function fetchRedirect(
  locale: Locale,
  fromPath: string,
): Promise<{ permanent: boolean; slug: string } | null> {
  try {
    const payload = await getPayload({ config: configPromise });
    const dedicated = await payload.find({
      collection: "redirects",
      depth: 1,
      fallbackLocale: false,
      limit: 1,
      locale,
      overrideAccess: true,
      where: {
        and: [
          { sourceLocale: { equals: locale } },
          { fromPath: { equals: fromPath } },
          { active: { equals: true } },
        ],
      },
    });
    const redirect = dedicated.docs[0];
    const target =
      redirect?.targetPage && typeof redirect.targetPage === "object"
        ? redirect.targetPage
        : null;
    if (
      target?.slug &&
      target.visible !== false &&
      target._status === "published"
    ) {
      return {
        permanent: redirect.permanent !== false,
        slug: target.slug,
      };
    }

    const result = await payload.find({
      collection: "pages",
      depth: 0,
      draft: false,
      fallbackLocale: false,
      limit: 1,
      locale,
      overrideAccess: true,
      where: {
        and: [
          { "redirects.fromPath": { equals: fromPath } },
          { visible: { equals: true } },
          { _status: { equals: "published" } },
        ],
      },
    });
    const page = result.docs[0];
    if (!page?.slug) return null;
    const entry = page.redirects?.find((item) => item.fromPath === fromPath);
    return {
      permanent: entry?.permanent !== false,
      slug: page.slug,
    };
  } catch {
    return null;
  }
}

export const getCMSRedirect = fetchRedirect;
