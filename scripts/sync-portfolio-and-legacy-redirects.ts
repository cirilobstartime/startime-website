import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Locale, PageSection } from "../src/content/types";

const payload = await getPayload({ config: configPromise });
const eventHero = await payload.find({
  collection: "media",
  depth: 0,
  limit: 1,
  overrideAccess: true,
  where: { filename: { equals: "startime-strategic-events-hero-v2.webp" } },
});
const eventHeroID = eventHero.docs[0]?.id;

if (!eventHeroID) {
  throw new Error("The approved event-led portfolio hero image is missing.");
}

for (const locale of ["en", "ar"] satisfies Locale[]) {
  const result = await payload.find({
    collection: "pages",
    depth: 1,
    draft: true,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: true,
    where: { pageType: { equals: "portfolio" } },
  });
  const page = result.docs[0];
  if (!page) throw new Error(`Portfolio page is missing for ${locale}.`);

  const sections = ((page.sections || []) as PageSection[]).map((section) => {
    if (section.blockType === "hero") {
      return { ...section, media: eventHeroID };
    }
    if (section.blockType === "projectShowcase") {
      return {
        ...section,
        projectCtaLabel:
          locale === "ar" ? "استكشف المنتدى" : "Explore the Forum",
      };
    }
    return section;
  });

  await payload.update({
    collection: "pages",
    id: page.id,
    data: { _status: "published", sections } as never,
    draft: false,
    locale,
    overrideAccess: true,
  });
}

const fallbackEnglishPaths = [
  "/en",
  "/en/discover",
  "/en/portfolio",
  "/en/solutions",
  "/en/triple-s-arena",
  "/en/join-us",
  "/en/contact",
];

async function sourceEnglishPaths() {
  try {
    const response = await fetch("https://startime.sa/sitemap.xml");
    if (!response.ok) throw new Error(`Sitemap returned ${response.status}.`);
    const xml = await response.text();
    const paths = [...xml.matchAll(/<loc>(https:\/\/startime\.sa\/en(?:\/[^<]*)?)<\/loc>/g)]
      .map((match) => new URL(match[1]).pathname.replace(/\/$/, ""))
      .filter(Boolean);
    return [...new Set(paths.length ? paths : fallbackEnglishPaths)];
  } catch {
    return fallbackEnglishPaths;
  }
}

const pageTypeByOldPath: Record<string, string> = {
  "/en": "home",
  "/en/contact": "contact",
  "/en/discover": "discover",
  "/en/join-us": "join-us",
  "/en/portfolio": "portfolio",
  "/en/solutions": "solutions",
  "/en/triple-s-arena": "triple-s-arena",
};

let redirectCount = 0;
for (const fromPath of await sourceEnglishPaths()) {
  const pageType = pageTypeByOldPath[fromPath];
  if (!pageType) {
    console.warn(`Skipped unmapped source URL: ${fromPath}`);
    continue;
  }
  const targetResult = await payload.find({
    collection: "pages",
    depth: 0,
    draft: false,
    fallbackLocale: false,
    limit: 1,
    locale: "en",
    overrideAccess: true,
    where: {
      and: [
        { pageType: { equals: pageType } },
        { visible: { equals: true } },
        { _status: { equals: "published" } },
      ],
    },
  });
  const targetPage = targetResult.docs[0];
  if (!targetPage) throw new Error(`No published target for ${fromPath}.`);

  const existing = await payload.find({
    collection: "redirects",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [
        { sourceLocale: { equals: "en" } },
        { fromPath: { equals: fromPath } },
      ],
    },
  });
  const data = {
    active: true,
    fromPath,
    internalTitle: `${fromPath} → ${targetPage.slug === "home" ? "/" : `/${targetPage.slug}`}`,
    notes: "Imported from the public startime.sa sitemap for search migration.",
    permanent: true,
    sourceLocale: "en",
    targetPage: targetPage.id,
  } as const;

  if (existing.docs[0]) {
    await payload.update({
      collection: "redirects",
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "redirects",
      data,
      overrideAccess: true,
    });
  }
  redirectCount += 1;
}

console.log(
  `Updated the bilingual portfolio presentation and synchronized ${redirectCount} indexed English redirects.`,
);
process.exit(0);
