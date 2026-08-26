import configPromise from "@payload-config";
import { getPayload } from "payload";
import { getLivePage } from "../src/content/liveSiteDefaults";
import { getTripleSPolicyPage } from "../src/content/tripleSPolicy";
import type { Locale, PageSection } from "../src/content/types";

const payload = await getPayload({ config: configPromise });
const locales = ["en", "ar"] satisfies Locale[];

let policyPageID: number | string | undefined;
const existingPolicy = await payload.find({
  collection: "pages",
  depth: 0,
  limit: 1,
  overrideAccess: true,
  where: { pageType: { equals: "triple-s-policy" } },
});
policyPageID = existingPolicy.docs[0]?.id;

for (const locale of locales) {
  const arenaResult = await payload.find({
    collection: "pages",
    depth: 0,
    draft: true,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: true,
    where: { pageType: { equals: "triple-s-arena" } },
  });
  const arenaPage = arenaResult.docs[0];
  if (!arenaPage) throw new Error(`Missing Triple S Arena page for ${locale}.`);

  const defaultArena = getLivePage(locale, "triple-s-arena");
  const defaultEcosystem = defaultArena.sections.find(
    (section) =>
      section.blockType === "cardGrid" && section.displayOrder === 20,
  );
  const arenaSections = ((arenaPage.sections || []) as PageSection[]).map(
    (section) =>
      section.blockType === "cardGrid" &&
      section.displayOrder === 20 &&
      defaultEcosystem?.blockType === "cardGrid"
        ? { ...section, buttons: defaultEcosystem.buttons }
        : section,
  );

  await payload.update({
    collection: "pages",
    id: arenaPage.id,
    data: { _status: "published", sections: arenaSections } as never,
    draft: false,
    locale,
    overrideAccess: true,
  });

  const heroMedia = arenaSections.find(
    (section) => section.blockType === "hero",
  );
  const policy = getTripleSPolicyPage(locale);
  const policySections = policy.sections.map((section) =>
    section.blockType === "hero" && heroMedia?.blockType === "hero"
      ? { ...section, media: heroMedia.media }
      : section,
  );
  const policyData = {
    _status: "published",
    internalTitle: "Triple S Arena Cybersecurity Policy",
    pageType: "triple-s-policy",
    sections: policySections,
    seo: policy.seo,
    slug: policy.slug,
    summary: policy.summary,
    title: policy.title,
    visible: true,
    showInNavigation: false,
  };

  if (!policyPageID) {
    const created = await payload.create({
      collection: "pages",
      data: policyData as never,
      draft: false,
      locale,
      overrideAccess: true,
    });
    policyPageID = created.id;
  } else {
    await payload.update({
      collection: "pages",
      id: policyPageID,
      data: policyData as never,
      draft: false,
      locale,
      overrideAccess: true,
    });
  }
}

console.log(
  "Added the bilingual Triple S Arena cybersecurity policy and linked CTA without changing other page content.",
);
