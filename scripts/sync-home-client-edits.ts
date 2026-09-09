import path from "node:path";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Locale, PageSection } from "../src/content/types";

const payload = await getPayload({ config: configPromise });
const filename = "startime-team-ministry-environment-event.png";
const sourceFile = path.join(
  process.cwd(),
  "public",
  "assets",
  "editorial",
  filename,
);
const usageMarker = "Homepage team event image supplied September 2026";

const existing = await payload.find({
  collection: "media",
  depth: 0,
  limit: 1,
  overrideAccess: true,
  where: { usageNotes: { contains: usageMarker } },
});

const teamImage = existing.docs[0]
  ? await payload.update({
      collection: "media",
      id: existing.docs[0].id,
      data: {
        alt: "Saudi event speaker at the Ministry of Environment Water and Agriculture",
        usageNotes: `${usageMarker}. Homepage OUR TEAM split section. Recommended replacement source: 1200 × 1200 px or larger, with the subject centered. Raster uploads are converted to WebP automatically.`,
      },
      filePath: sourceFile,
      locale: "en",
      overrideAccess: true,
    })
  : await payload.create({
      collection: "media",
      data: {
        alt: "Saudi event speaker at the Ministry of Environment Water and Agriculture",
        usageNotes: `${usageMarker}. Homepage OUR TEAM split section. Recommended replacement source: 1200 × 1200 px or larger, with the subject centered. Raster uploads are converted to WebP automatically.`,
      },
      filePath: sourceFile,
      locale: "en",
      overrideAccess: true,
    });

await payload.update({
  collection: "media",
  id: teamImage.id,
  data: {
    alt: "متحدث في فعالية سعودية لوزارة البيئة والمياه والزراعة",
  },
  locale: "ar",
  overrideAccess: true,
});

if (teamImage.mimeType !== "image/webp") {
  throw new Error(`Expected ${filename} to be converted to WebP.`);
}

for (const locale of ["en", "ar"] satisfies Locale[]) {
  const result = await payload.find({
    collection: "pages",
    depth: 0,
    draft: true,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: true,
    where: { pageType: { equals: "home" } },
  });
  const page = result.docs[0];
  if (!page) throw new Error(`Homepage is missing for ${locale}.`);

  const original = (page.sections || []) as PageSection[];
  const teamSectionIndex = original.findIndex(
    (section) =>
      section.blockType === "mediaFeature" &&
      (section.ctaHref === "/join-us" || section.ctaHref === "/ar/join-us"),
  );
  if (teamSectionIndex < 0) {
    throw new Error(`Homepage team section is missing for ${locale}.`);
  }

  const partnerSection = original.find(
    (section) => section.blockType === "logoMarquee",
  );
  if (!partnerSection) {
    throw new Error(`Homepage partner marquee is missing for ${locale}.`);
  }

  const sections = original.flatMap<PageSection>((section) => {
    if (section.blockType === "logoMarquee") return [];
    if (
      section === original[teamSectionIndex] &&
      section.blockType === "mediaFeature"
    ) {
      return [{ ...section, media: { id: teamImage.id } }];
    }
    return [section];
  });
  sections.push({ ...partnerSection, displayOrder: 80 });

  await payload.update({
    collection: "pages",
    id: page.id,
    data: { _status: "published", sections } as never,
    draft: false,
    locale,
    overrideAccess: true,
  });
}

console.log(
  "Published the supplied homepage team image and moved the partner marquee before the footer in English and Arabic.",
);
