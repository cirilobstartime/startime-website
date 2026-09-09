import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Locale, PageSection } from "../src/content/types";

const payload = await getPayload({ config: configPromise });

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

  const sections = (page.sections || []) as PageSection[];
  const membership = sections.find(
    (section) => section.blockType === "credibility",
  );
  const partners = sections.find(
    (section) => section.blockType === "logoMarquee",
  );

  if (!membership || !partners) {
    throw new Error(
      `Homepage membership or partner section is missing for ${locale}.`,
    );
  }

  const reordered: PageSection[] = sections.filter(
    (section) =>
      section.blockType !== "credibility" &&
      section.blockType !== "logoMarquee",
  );
  reordered.push(membership, partners);

  await payload.update({
    collection: "pages",
    id: page.id,
    data: { sections: reordered } as never,
    draft: false,
    locale,
    overrideAccess: true,
  });

  console.log(
    `${locale}: placed the membership section immediately before the partner marquee.`,
  );
}

process.exit(0);
