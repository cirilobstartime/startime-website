import configPromise from "@payload-config";
import { getPayload } from "payload";
import { getDefaultPage } from "../src/content/defaults";
import type { Locale, PageSection } from "../src/content/types";

const payload = await getPayload({ config: configPromise });

for (const locale of ["en", "ar"] satisfies Locale[]) {
  const solutionResult = await payload.find({
    collection: "pages",
    depth: 0,
    draft: true,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: true,
    where: { pageType: { equals: "solutions" } },
  });
  const solutionsPage = solutionResult.docs[0];
  if (!solutionsPage) {
    throw new Error(`Missing Solutions page for ${locale}.`);
  }

  const solutionHero = getDefaultPage(locale, "solutions").sections.find(
    (section) => section.blockType === "hero",
  );
  const solutionCta = getDefaultPage(locale, "solutions").sections.find(
    (section) => section.blockType === "callToAction" && section.displayOrder === 40,
  );
  if (!solutionHero || solutionHero.blockType !== "hero") {
    throw new Error(`Default section configuration is incomplete for ${locale}.`);
  }

  const solutionSections = ((solutionsPage.sections || []) as PageSection[]).map(
    (section) => {
      if (section.blockType === "hero") {
        return { ...section, eventDetails: solutionHero.eventDetails };
      }
      if (
        section.blockType === "callToAction" &&
        section.displayOrder === 40 &&
        solutionCta?.blockType === "callToAction"
      ) {
        return { ...section, buttons: solutionCta.buttons };
      }
      return section;
    },
  );
  await payload.update({
    collection: "pages",
    id: solutionsPage.id,
    data: { _status: "published", sections: solutionSections } as never,
    draft: false,
    locale,
    overrideAccess: true,
  });
}

console.log("Updated bilingual Solutions counters and profile CTA without changing other CMS content.");
