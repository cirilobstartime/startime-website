import path from "node:path";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { getDefaultPage } from "../src/content/defaults";
import type { Locale, PageSection } from "../src/content/types";

const payload = await getPayload({ config: configPromise });
const projectRoot = process.cwd();
const teamAssets = [
  "/assets/team/nasser-al-qahtani-transparent.png",
  "/assets/team/mutaz-mansour-transparent.png",
  "/assets/team/khaled-al-qahtani-transparent.png",
  "/assets/team/zayneb-mdini-transparent.png",
  "/assets/team/waleed-ramadan-transparent.png",
  "/assets/team/rawabi-al-shehri-transparent.png",
];

function filename(assetPath: string) {
  return path.basename(assetPath);
}

function alt(assetPath: string) {
  return path
    .basename(assetPath, path.extname(assetPath))
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

const mediaIDs = new Map<string, number | string>();
for (const assetPath of teamAssets) {
  const existing = await payload.find({
    collection: "media",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { filename: { equals: filename(assetPath) } },
  });
  const sourceFile = path.join(projectRoot, "public", assetPath);
  const media = existing.docs[0]
    ? await payload.update({
        collection: "media",
        id: existing.docs[0].id,
        data: {
          alt: alt(assetPath),
          usageNotes: "Approved Startime team portrait imported from startime.sa.",
        },
        filePath: sourceFile,
        locale: "en",
        overrideAccess: true,
      })
    : await payload.create({
      collection: "media",
      data: {
        alt: alt(assetPath),
        usageNotes: "Approved Startime team portrait imported from startime.sa.",
      },
      filePath: sourceFile,
      locale: "en",
      overrideAccess: true,
    });
  mediaIDs.set(assetPath, media.id);
}

function replaceTeamMedia(value: unknown): unknown {
  if (typeof value === "string" && mediaIDs.has(value)) {
    return mediaIDs.get(value);
  }
  if (Array.isArray(value)) return value.map(replaceTeamMedia);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, replaceTeamMedia(entry)]),
    );
  }
  return value;
}

async function page(locale: Locale, pageType: "portfolio" | "join-us") {
  const result = await payload.find({
    collection: "pages",
    depth: 1,
    draft: true,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: true,
    where: { pageType: { equals: pageType } },
  });
  const found = result.docs[0];
  if (!found) throw new Error(`${pageType} page is missing for ${locale}.`);
  return found;
}

for (const locale of ["en", "ar"] satisfies Locale[]) {
  const portfolio = await page(locale, "portfolio");
  const portfolioDefaults = getDefaultPage(locale, "portfolio").sections;
  const tracks = portfolioDefaults.find(
    (section) => section.blockType === "cardGrid" && section.layout === "tracks",
  );
  const focus = portfolioDefaults.find(
    (section) => section.blockType === "cardGrid" && section.layout === "focus",
  );
  if (!tracks || !focus) throw new Error(`Portfolio defaults are incomplete for ${locale}.`);
  const currentPortfolio = (portfolio.sections || []) as PageSection[];
  const hero = currentPortfolio.find((section) => section.blockType === "hero");
  const projects = currentPortfolio.find(
    (section) => section.blockType === "projectShowcase",
  );
  const remainingPortfolio = currentPortfolio.filter(
    (section) =>
      section !== hero &&
      section !== projects &&
      !(
        section.blockType === "cardGrid" &&
        (section.layout === "tracks" || section.layout === "focus")
      ),
  );
  if (!hero || !projects) throw new Error(`Portfolio core sections are missing for ${locale}.`);
  await payload.update({
    collection: "pages",
    id: portfolio.id,
    data: {
      _status: "published",
      sections: [hero, tracks, projects, focus, ...remainingPortfolio],
    } as never,
    draft: false,
    locale,
    overrideAccess: true,
  });

  const join = await page(locale, "join-us");
  const team = getDefaultPage(locale, "join-us").sections.find(
    (section) => section.blockType === "cardGrid" && section.layout === "team",
  );
  if (!team) throw new Error(`Team defaults are incomplete for ${locale}.`);
  const currentJoin = (join.sections || []) as PageSection[];
  const joinHero = currentJoin.find((section) => section.blockType === "hero");
  const remainingJoin = currentJoin.filter(
    (section) =>
      section !== joinHero &&
      !(section.blockType === "cardGrid" && section.layout === "team"),
  );
  if (!joinHero) throw new Error(`Join Us hero is missing for ${locale}.`);
  await payload.update({
    collection: "pages",
    id: join.id,
    data: {
      _status: "published",
      sections: [joinHero, replaceTeamMedia(team), ...remainingJoin],
    } as never,
    draft: false,
    locale,
    overrideAccess: true,
  });
}

console.log(
  "Published the bilingual portfolio tracks, portfolio focus, and repeatable team section.",
);
process.exit(0);
