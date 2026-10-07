import "server-only";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import { assertPageRoute } from "./pageRoutes";
import type { Locale } from "@/content/home";
import { cmsMediaURL } from "@/content/cmsMediaURL";
import { newSiteContent, newSiteSectionSlug, type NewSitePageType } from "@/payload/blocks/newSiteSections";

function copyFromEditor(sample: unknown, saved: unknown, name = ""): unknown {
  if (Array.isArray(sample)) {
    if (!Array.isArray(saved)) return sample;
    return saved.map((item, index) => typeof sample[0] === "string"
      ? String(item?.value ?? "")
      : copyFromEditor(sample[index] ?? sample[0], item, name));
  }
  if (sample && typeof sample === "object") {
    if (!saved || typeof saved !== "object") return sample;
    const source = saved as Record<string, unknown>;
    const merged = Object.fromEntries(Object.entries(sample).map(([key, value]) => [
      key,
      copyFromEditor(value, source[key], key),
    ]));
    if (name === "items") {
      if (typeof source.icon === "string") merged.icon = source.icon;
      if (source.itemVisual && typeof source.itemVisual === "object") merged.itemVisual = source.itemVisual;
    }
    if (name === "principles" && typeof source.newPageTitle === "string") merged.newPageTitle = source.newPageTitle;
    return merged;
  }
  if ((name === "image" || name === "logo") && saved && typeof saved === "object") {
    const url = (saved as { url?: string }).url;
    return cmsMediaURL(url) || sample;
  }
  return typeof saved === "string" ? saved : sample;
}

/** Keep the approved visual components while supplying their copy from one published locale. */
export const getNewSitePageContent = cache(async <T extends NewSitePageType>(
  pageType: T,
  locale: Locale,
): Promise<{ published: boolean; content: (typeof newSiteContent)[T][Locale]; archiveSortMode?: "latest" | "manual"; editorSections?: Record<string, unknown>[] }> => {
  const base = newSiteContent[pageType][locale];
  await assertPageRoute(pageType, locale);
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "pages",
    depth: 2,
    draft: false,
    fallbackLocale: false,
    locale,
    limit: 1,
    overrideAccess: false,
    where: { and: [
      { internalTitle: { equals: pageType === "home" ? "New Site: Home" : `New Site: ${pageType}` } },
      { _status: { equals: "published" } },
      { visible: { equals: true } },
    ] },
  });
  const page = result.docs[0];
  if (!page) return { published: false, content: base };
  const sections = page.sections || [];
  const content = Object.fromEntries(Object.entries(base).map(([section, value]) => {
    const block = sections.find((candidate) => candidate.blockType === newSiteSectionSlug(pageType, section));
    if (!block) return [section, value];
    const data = Array.isArray(value) ? (block as unknown as { items?: unknown }).items
      : typeof value === "string" ? (block as unknown as { text?: unknown }).text
        : block;
    return [section, copyFromEditor(value, data)];
  })) as (typeof newSiteContent)[T][Locale];
  return { published: true, content, editorSections: sections as unknown as Record<string, unknown>[], archiveSortMode: page.archiveSortMode === "manual" ? "manual" : "latest" };
});
