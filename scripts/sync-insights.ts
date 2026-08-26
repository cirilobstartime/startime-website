import configPromise from "@payload-config";
import { getPayload } from "payload";
import { approvedInsightContent } from "../src/content/approvedInsights";
import { approvedArabicInsightContent } from "../src/content/approvedArabicInsights";
import type {
  HeroSection,
  Locale,
  NewsMosaicSection,
  PageSection,
} from "../src/content/types";

const payload = await getPayload({ config: configPromise });
function richText(body: string) {
  return {
    root: {
      type: "root",
      children: body
        .split(/\n\n+/)
        .filter(Boolean)
        .map((paragraph) => ({
          type: "paragraph",
          children: [
            {
              type: "text",
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: paragraph,
              version: 1,
            },
          ],
          direction: null,
          format: "",
          indent: 0,
          textFormat: 0,
          textStyle: "",
          version: 1,
        })),
      direction: null,
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

const categoryDefinitions = [
  { internalTitle: "Startime News", title: "Startime News", arabicTitle: "أحدث أخبار ستارتايم", slug: "news", displayOrder: 10 },
  { internalTitle: "Industry Insights", title: "Industry Insights", arabicTitle: "المقالات والرؤى", slug: "articles", displayOrder: 20 },
] as const;

const categories = await payload.find({
  collection: "insight-categories",
  depth: 0,
  draft: true,
  fallbackLocale: false,
  limit: 20,
  locale: "en",
  overrideAccess: true,
});
const categoryIDs = new Map<string, number | string>();
for (const definition of categoryDefinitions) {
  const existing = categories.docs.find((category) => category.internalTitle === definition.internalTitle);
  const category = existing || await payload.create({
    collection: "insight-categories",
    data: { _status: "published", internalTitle: definition.internalTitle, title: definition.title, slug: definition.slug, visible: true, displayOrder: definition.displayOrder } as never,
    draft: false, locale: "en", overrideAccess: true,
  });
  categoryIDs.set(definition.internalTitle, category.id);
  await payload.update({
    collection: "insight-categories",
    id: category.id,
    data: { _status: "published", internalTitle: definition.internalTitle, title: definition.title, slug: definition.slug, visible: true, displayOrder: definition.displayOrder } as never,
    draft: false, locale: "en", overrideAccess: true,
  });
  await payload.update({
    collection: "insight-categories",
    id: category.id,
    data: {
      _status: "published",
      internalTitle: definition.internalTitle,
      title: definition.arabicTitle,
      slug: definition.slug,
      visible: true,
      displayOrder: definition.displayOrder,
    },
    draft: false,
    locale: "ar",
    overrideAccess: true,
  });
}

const posts = await payload.find({
  collection: "insights-posts",
  depth: 1,
  draft: true,
  fallbackLocale: false,
  limit: 20,
  locale: "en",
  overrideAccess: true,
});
for (const post of posts.docs) {
  const approved = approvedInsightContent[post.internalTitle];
  if (!approved) continue;
  const categoryInternalTitle = post.internalTitle === "Corporate Governance Transformation" ? "Industry Insights" : "Startime News";
  const categoryID = categoryIDs.get(categoryInternalTitle);
  const categorySlug = categoryInternalTitle === "Industry Insights" ? "articles" : "news";
  if (!categoryID) throw new Error(`Missing insight category: ${categoryInternalTitle}`);
  await payload.update({
    collection: "insights-posts",
    id: post.id,
    data: {
      _status: "published",
      title: approved.title,
      slug: post.slug,
      summary: post.summary,
      category: categoryID,
      featuredImage:
        typeof post.featuredImage === "object"
          ? post.featuredImage.id
          : post.featuredImage,
      destination: `/insights/${categorySlug}/${post.slug}`,
      intro: approved.intro,
      content: approved.content.map((section) => ({
        heading: section.heading,
        body: richText(section.body),
      })),
      seo: {
        title: `${approved.title} | Startime`.slice(0, 70),
        description: post.summary,
        indexable: true,
      },
      publishedAt: post.publishedAt,
      publicationLabel: approved.publicationLabel,
      visible: true,
      showOnHomepage: true,
      showOnInsightsPage: true,
    } as never,
    draft: false,
    locale: "en",
    overrideAccess: true,
  });
  const approvedArabic = approvedArabicInsightContent[post.internalTitle];
  if (!approvedArabic) {
    throw new Error(`Approved Arabic insight is missing: ${post.internalTitle}`);
  }
  const arTitle = approvedArabic.title;
  const arSummary = approvedArabic.summary;
  await payload.update({
    collection: "insights-posts",
    id: post.id,
    data: {
      _status: "published",
      title: arTitle,
      slug: post.slug,
      summary: arSummary,
      category: categoryID,
      featuredImage:
        typeof post.featuredImage === "object"
          ? post.featuredImage.id
          : post.featuredImage,
      destination: `/ar/insights/${categorySlug}/${post.slug}`,
      intro: approvedArabic.intro,
      content: approvedArabic.content.map((section) => ({
        heading: section.heading,
        body: richText(section.body),
      })),
      seo: {
        title: `${arTitle} | ستارتايم`.slice(0, 70),
        description: arSummary,
        indexable: true,
      },
      publishedAt: post.publishedAt,
      publicationLabel: approvedArabic.publicationLabel,
      visible: true,
      showOnHomepage: true,
      showOnInsightsPage: true,
    } as never,
    draft: false,
    locale: "ar",
    overrideAccess: true,
  });
}


async function pageFor(locale: Locale, pageType: string) {
  const result = await payload.find({
    collection: "pages",
    depth: 1,
    draft: true,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: true,
    where:
      pageType === "insights"
        ? { internalTitle: { contains: "Insights" } }
        : { pageType: { equals: pageType } },
  });
  return result.docs[0];
}

for (const locale of ["en", "ar"] satisfies Locale[]) {
  const insights = await pageFor(locale, "insights");
  if (!insights) throw new Error(`Insights page is missing for ${locale}.`);
  const existing = (insights.sections || []) as PageSection[];
  const existingHero = existing.find(
    (section) => section.blockType === "hero",
  ) as HeroSection | undefined;
  const news = existing.find(
    (section) => section.blockType === "newsMosaic",
  ) as NewsMosaicSection | undefined;

  // Payload validates the section's editorial fallback fields even though the
  // public renderer replaces them with the published collection automatically.
  // Keep one real existing post as a safe fallback rather than manufacturing
  // placeholder content or requiring an otherwise unnecessary hero section.
  const fallbackPost = posts.docs.find(
    (post) =>
      post.featuredImage &&
      (typeof post.featuredImage === "string" ||
        typeof post.featuredImage === "object"),
  );
  if (!fallbackPost) {
    throw new Error("A published insight with a featured image is required.");
  }
  const fallbackMedia = fallbackPost.featuredImage as NewsMosaicSection["articles"][number]["media"];
  const fallbackArticle = {
    href: locale === "ar" ? "/ar/insights" : "/insights",
    media: fallbackMedia,
    summary:
      locale === "ar"
        ? "آخر أخبار ستارتايم ورؤاها."
        : "The latest Startime news and perspectives.",
    title: locale === "ar" ? "أخبار ستارتايم" : "Startime News",
  };
  const fallbackNewsSection: NewsMosaicSection = {
    articles: [fallbackArticle],
    blockType: "newsMosaic",
    heading:
      locale === "ar"
        ? "أخبار ورؤى من القطاعات التي نخدمها"
        : "News, Perspectives and Event Intelligence",
    layout: "grid",
    visible: true,
  };
  const heroSection: HeroSection = existingHero || {
    appearance: {
      overlayOpacity: 58,
      theme: "dark",
    },
    blockType: "hero",
    body:
      locale === "ar"
        ? "أحدث أخبار ستارتايم وشراكاتها والفعاليات التي تصنع أثراً."
        : "The latest Startime news, partnerships and events creating impact.",
    buttons: [],
    displayOrder: 10,
    eyebrow: locale === "ar" ? "ستارتايم" : "STARTIME",
    heading: locale === "ar" ? "الأخبار والرؤى" : "News and Insights",
    heroHeight: "standard",
    media: fallbackMedia,
    mediaType: "image",
    visible: true,
  };

  const newsSection: NewsMosaicSection = {
    ...(news || fallbackNewsSection),
    articles: [fallbackArticle],
    displayOrder: 20,
    visible: true,
    eyebrow: locale === "ar" ? "أحدث أخبار ستارتايم" : "LATEST FROM STARTIME",
    heading:
      locale === "ar"
        ? "أخبار ورؤى من القطاعات التي نخدمها"
        : "News, Perspectives and Event Intelligence",
    layout: "grid",
    pageSize: 6,
    ctaLabel: null,
    ctaHref: null,
    appearance: {
      ...(news?.appearance || {}),
      backgroundColor: "#eee9e2",
      theme: "light",
    },
  };
  await payload.update({
    collection: "pages",
    id: insights.id,
    data: {
      _status: "published",
      internalTitle: "Insights",
      pageType: "insights",
      title: locale === "ar" ? "الأخبار والرؤى" : "Insights",
      summary:
        locale === "ar"
          ? "أخبار ستارتايم ورؤاها وآخر مستجداتها."
          : "Startime news, perspectives and company updates.",
      slug: "insights",
      visible: true,
      showInNavigation: true,
      navigationLabel: locale === "ar" ? "الأخبار والرؤى" : "Insights",
      // The archive is intentionally a clean editorial page. It does not need
      // a decorative hero; the news section supplies its visible content.
      sections: [heroSection, newsSection],
      seo: {
        title:
          locale === "ar"
            ? "أخبار ورؤى ستارتايم"
            : "Startime News and Insights",
        description:
          locale === "ar"
            ? "تابع أحدث أخبار ستارتايم ورؤاها وشراكاتها وفعالياتها في المملكة العربية السعودية."
            : "Read the latest Startime news, perspectives, partnerships and event updates from Saudi Arabia.",
        indexable: true,
        followLinks: true,
        includeInSitemap: true,
        sitemapPriority: 0.7,
        sitemapChangeFrequency: "monthly",
      },
    } as never,
    draft: false,
    locale,
    overrideAccess: true,
  });

  const home = await pageFor(locale, "home");
  if (!home) throw new Error(`Home page is missing for ${locale}.`);
  const homeSections = ((home.sections || []) as PageSection[]).filter(
    (section) => section.blockType !== "newsMosaic",
  );
  const homeNews: NewsMosaicSection = {
    ...newsSection,
    displayOrder: 70,
    eyebrow: locale === "ar" ? "من ستارتايم" : "FROM STARTIME",
    heading:
      locale === "ar" ? "أحدث الأخبار والرؤى" : "Latest News and Insights",
    layout: "swiper",
    pageSize: 5,
    ctaLabel: locale === "ar" ? "عرض جميع الأخبار" : "View all insights",
    ctaHref: locale === "ar" ? "/ar/insights" : "/insights",
    appearance: {
      ...newsSection.appearance,
      backgroundColor: "#eee9e2",
      theme: "light",
    },
  };
  await payload.update({
    collection: "pages",
    id: home.id,
    data: {
      _status: "published",
      sections: [...homeSections, homeNews],
    } as never,
    draft: false,
    locale,
    overrideAccess: true,
  });

  const settings = await payload.findGlobal({
    slug: "site-settings",
    depth: 1,
    draft: true,
    fallbackLocale: false,
    locale,
    overrideAccess: true,
  });
  type NavigationItem = {
    children?: Array<Record<string, unknown>> | null;
    href: string;
    label: string;
    visible?: boolean | null;
  };
  const navigation = ((settings.navigation || []) as NavigationItem[]).filter(
    (item) => item.href !== "/insights" && item.href !== "/ar/insights",
  );
  const joinIndex = navigation.findIndex((item) =>
    item.href.endsWith("/join-us"),
  );
  navigation.splice(joinIndex < 0 ? navigation.length : joinIndex, 0, {
    label: locale === "ar" ? "الأخبار والرؤى" : "Insights",
    href: locale === "ar" ? "/ar/insights" : "/insights",
    visible: true,
    children: [],
  });
  await payload.updateGlobal({
    slug: "site-settings",
    data: { allowSearchIndexing: true, navigation } as never,
    draft: false,
    locale,
    overrideAccess: true,
  });
}

console.log(
  "Published bilingual Insights, six articles, homepage news, and navigation.",
);
process.exit(0);
