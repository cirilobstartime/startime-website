import path from "node:path";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Locale, PageSection } from "../src/content/types";

const payload = await getPayload({ config: configPromise });
const filename = "startime-home-hero-mobile.mp4";
const sourceFile = path.join(process.cwd(), "public", "assets", "video", filename);

const existing = await payload.find({
  collection: "media",
  depth: 0,
  limit: 1,
  overrideAccess: true,
  where: { filename: { equals: filename } },
});

const mediaData = {
  alt: "Startime homepage mobile hero video",
  usageNotes:
    "Portrait mobile homepage hero video (1080 × 1920). Keep the subject and focal area within the central safe zone.",
};

const mobileVideo = existing.docs[0]
  ? await payload.update({
      collection: "media",
      id: existing.docs[0].id,
      data: mediaData,
      filePath: sourceFile,
      locale: "en",
      overrideAccess: true,
    })
  : await payload.create({
      collection: "media",
      data: mediaData,
      filePath: sourceFile,
      locale: "en",
      overrideAccess: true,
    });

if (!mobileVideo.mimeType?.startsWith("video/")) {
  throw new Error(`Expected ${filename} to be stored as video media.`);
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

  const sections = (page.sections as PageSection[]).map((section) =>
    section.blockType === "hero"
      ? { ...section, mobileMedia: mobileVideo.id }
      : section,
  );

  await payload.update({
    collection: "pages",
    id: page.id,
    data: { _status: "published", sections } as never,
    draft: false,
    locale,
    overrideAccess: true,
  });
}

console.log("Published the portrait mobile homepage hero video in English and Arabic.");
