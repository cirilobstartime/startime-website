import configPromise from "@payload-config";
import { getPayload } from "payload";
import { getDefaultChrome, getDefaultPage } from "../src/content/defaults";
import type { Locale, PageSection } from "../src/content/types";

const payload = await getPayload({ config: configPromise });

for (const locale of ["en", "ar"] satisfies Locale[]) {
  const pageResult = await payload.find({
    collection: "pages",
    depth: 2,
    draft: true,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: true,
    where: { pageType: { equals: "contact" } },
  });
  const page = pageResult.docs[0];
  const defaultMap = getDefaultPage(locale, "contact").sections.find(
    (section) => section.blockType === "map",
  );
  if (page && defaultMap) {
    const sections = (page.sections || []) as PageSection[];
    const nextSections = sections.some((section) => section.blockType === "map")
      ? sections.map((section) =>
          section.blockType === "map" ? defaultMap : section,
        )
      : [...sections, defaultMap];
    await payload.update({
      collection: "pages",
      id: page.id,
      data: {
        _status: "published",
        sections: nextSections,
      } as never,
      draft: false,
      locale,
      overrideAccess: true,
    });
  }

  const chrome = getDefaultChrome(locale);
  const organization = chrome.organization;
  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      allowSearchIndexing: false,
      defaultSEODescription: chrome.defaultSEODescription,
      foundingDate: organization.foundingDate,
      organizationAddress: {
        addressCountry: organization.addressCountry,
        addressLocality: organization.addressLocality,
        addressRegion: organization.addressRegion,
        latitude: organization.latitude,
        longitude: organization.longitude,
        postalCode: organization.postalCode,
        streetAddress: organization.streetAddress,
      },
      organizationAlternateName: organization.alternateName,
      organizationDescription: organization.description,
      organizationEmail: organization.email,
      organizationKeywords: organization.keywords.map((keyword) => ({
        keyword,
      })),
      organizationLegalName: organization.legalName,
      organizationPhone: organization.phone,
      organizationURL: organization.url,
      siteName: chrome.siteName,
    } as never,
    draft: false,
    locale,
    overrideAccess: true,
  });
}

await payload.updateGlobal({
  slug: "marketing-settings",
  data: {
    acceptedCampaignParameters:
      "utm_id,utm_source,utm_medium,utm_campaign,utm_term,utm_content,utm_source_platform,gclid,gbraid,wbraid,fbclid,msclkid,ttclid,li_fat_id,twclid",
    attributionCookieDomain: ".startime.sa",
    crossDomainHosts: "startime.sa,sim.startime.sa",
  },
  draft: false,
  locale: "en",
  overrideAccess: true,
});

console.log("Updated the contact map, organization SEO profile, and attribution settings.");
process.exit(0);
