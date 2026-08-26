import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Locale, PageSection } from "../src/content/types";

const payload = await getPayload({ config: configPromise });

for (const locale of ["en", "ar"] satisfies Locale[]) {
  const home = await payload.find({
    collection: "pages",
    depth: 0,
    draft: true,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: true,
    where: { pageType: { equals: "home" } },
  });
  const discover = await payload.find({
    collection: "pages",
    depth: 0,
    draft: true,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: true,
    where: { pageType: { equals: "discover" } },
  });
  const homePage = home.docs[0];
  const discoverPage = discover.docs[0];
  if (!homePage || !discoverPage) throw new Error(`Missing ${locale} home or Discover page.`);

  const homeHero = (homePage.sections as PageSection[]).find(
    (section) => section.blockType === "hero",
  );
  const sections = (discoverPage.sections as PageSection[]).map((section) =>
    section.blockType === "hero"
      ? {
          ...section,
          heroHeight: "viewport",
          media: homeHero?.media,
          mediaType: "video",
          mobileMedia: homeHero?.mobileMedia,
          youtubeURL: "",
        }
      : section,
  );

  await payload.update({
    collection: "pages",
    id: discoverPage.id,
    data: { _status: "published", sections } as never,
    draft: false,
    locale,
    overrideAccess: true,
  });
}

console.log("Updated both Discover heroes to use the homepage video at full viewport height.");
