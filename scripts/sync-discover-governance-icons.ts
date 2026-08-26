import path from "node:path";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Locale, PageSection } from "../src/content/types";

const payload = await getPayload({ config: configPromise });
const projectRoot = process.cwd();

const governanceIcons = [
  ["Organizational Strength", "organizational-strength.svg"],
  ["Operational Risk Management", "operational-risk-management.svg"],
  ["Decision-Making Excellence", "decision-making-excellence.svg"],
  ["Stakeholder Transparency", "stakeholder-transparency.svg"],
  ["National & International Compliance", "national-international-compliance.svg"],
  ["Experience & Impact Governance", "experience-impact-governance.svg"],
  ["Effective Corporate Communication", "effective-corporate-communication.svg"],
  ["Internal Accountability & Transparency", "internal-accountability-transparency.svg"],
] as const;

const iconIDs = new Map<string, number | string>();
for (const [label, filename] of governanceIcons) {
  const existing = await payload.find({
    collection: "media",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { filename: { equals: filename } },
  });
  const sourceFile = path.join(
    projectRoot,
    "public/assets/icons/discover-governance",
    filename,
  );
  const data = {
    alt: `${label} icon`,
    usageNotes:
      "Governance card icon. SVG source is deliberately retained as vector artwork; use this field only for the visible card icon.",
  };
  const media = existing.docs[0]
    ? await payload.update({
        collection: "media",
        id: existing.docs[0].id,
        data,
        filePath: sourceFile,
        locale: "en",
        overrideAccess: true,
      })
    : await payload.create({
        collection: "media",
        data,
        filePath: sourceFile,
        locale: "en",
        overrideAccess: true,
      });

  if (media.mimeType !== "image/svg+xml" || !media.filename?.endsWith(".svg")) {
    throw new Error(`SVG preservation failed for ${filename}.`);
  }
  iconIDs.set(label, media.id);
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
    where: { pageType: { equals: "discover" } },
  });
  const page = result.docs[0];
  if (!page) throw new Error(`Discover page is missing for ${locale}.`);

  const sections = (page.sections as PageSection[]).map((section) => {
    if (section.blockType !== "cardGrid" || section.cards.length !== governanceIcons.length) {
      return section;
    }
    const mappedCards = section.cards.map((card, index) => {
      const [englishTitle] = governanceIcons[index];
      const isGovernanceCard =
        locale === "en"
          ? card.title === englishTitle
          : section.eyebrow === "الحوكمة";
      if (!isGovernanceCard) return card;
      return {
        ...card,
        icon: null,
        iconMedia: iconIDs.get(englishTitle),
      };
    });
    return mappedCards.some((card) => card.iconMedia)
      ? { ...section, cards: mappedCards }
      : section;
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

console.log("Published the eight supplied Governance SVG icons in English and Arabic.");
