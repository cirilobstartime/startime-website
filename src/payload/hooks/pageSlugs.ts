import { APIError, type CollectionBeforeValidateHook, type CollectionBeforeChangeHook, type CollectionAfterChangeHook, type Payload, type PayloadRequest } from "payload";
import { mainPageKey, mainPageKeys, pageRoutePath } from "@/lib/pageRoutes";
import type { Page } from "@/generated/payload-types";
import type { PublicLocale } from "@/lib/publicPath";

const reserved = new Set(["api", "content-admin", "ar", "en", "assets", "uploads", "_next", "maintenance", "coming-soon", "sitemap", "robots", "favicon", "__preview_disabled__"]);

export const validateMainPageSlug: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  const key = mainPageKey(data?.internalTitle || originalDoc?.internalTitle);
  if (!key || !data || data.slug === undefined) return data;
  if (typeof data.slug !== "string") throw new APIError("Enter a single page slug, without / or a full URL.", 400);
  const slug = data.slug.trim().normalize("NFC");
  if (!/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(slug)) throw new APIError("Use letters, numbers and hyphens only, without /, spaces, query parameters or a full URL.", 400);
  if (key === "home" && slug !== "home") throw new APIError("The homepage stays at / in English and /ar in Arabic. Keep its slug as home.", 400);
  if (reserved.has(slug.toLowerCase()) || /^(?:home[1-6]|discover[1-5]|vision[12]|investment[12]|careers1|contact1|insights1|animation)$/i.test(slug)
    || mainPageKeys.some((other) => other !== key && other === slug)) throw new APIError("This slug is reserved by another page or system route. Choose a different slug.", 400);
  const locale = req.locale === "ar" ? "ar" : "en";
  const matches = await req.payload.find({ collection: "pages", locale, fallbackLocale: false, draft: true,
    depth: 0, limit: 100, overrideAccess: true, req,
    where: { slug: { equals: slug } },
  });
  if (matches.docs.some((page) => page.id !== originalDoc?.id && mainPageKey(page.internalTitle))) throw new APIError("Another main page already uses this slug in this language.", 400);
  // Also reserve currently published slugs when another page has an unpublished rename.
  const published = await req.payload.find({ collection: "pages", locale, fallbackLocale: false, draft: false,
    depth: 0, limit: 100, overrideAccess: true, req, where: { slug: { equals: slug } },
  });
  if (published.docs.some((page) => page.id !== originalDoc?.id && mainPageKey(page.internalTitle))) throw new APIError("Another main page currently publishes at this slug in this language.", 400);
  data.slug = slug;
  return data;
};

export async function saveSlugRedirect(payload: Payload, page: Page, locale: PublicLocale, oldSlug: string, req?: PayloadRequest) {
  const key = mainPageKey(page.internalTitle);
  if (!key || key === "home" || !oldSlug || oldSlug === page.slug) return;
  const fromPath = pageRoutePath(locale, { key, slug: oldSlug });
  const existing = await payload.find({ collection: "redirects", depth: 0, limit: 1, overrideAccess: true, req,
    where: { and: [{ sourceLocale: { equals: locale } }, { fromPath: { equals: fromPath } }] },
  });
  const data = { internalTitle: `Slug change: ${fromPath} → ${pageRoutePath(locale, { key, slug: page.slug })}`,
    sourceLocale: locale, fromPath, targetPage: page.id, permanent: true, active: true,
    notes: "Automatically created when this page's published slug changed. The destination follows the current published slug; you can edit or disable this redirect.",
  };
  if (existing.docs[0]) await payload.update({ collection: "redirects", id: existing.docs[0].id, data, overrideAccess: true, req });
  else await payload.create({ collection: "redirects", data, overrideAccess: true, req });
}

export const capturePublishedPageSlug: CollectionBeforeChangeHook = async ({ data, originalDoc, req, operation }) => {
  if (operation !== "update" || !originalDoc?.id || !mainPageKey(data.internalTitle || originalDoc.internalTitle)
    || (data._status ?? originalDoc._status) !== "published") return data;
  const locale = req.locale === "ar" ? "ar" : "en";
  // Payload's previousDoc can be the latest draft rather than the public record.
  const published = await req.payload.findByID({ collection: "pages", id: originalDoc.id, locale,
    fallbackLocale: false, draft: false, depth: 0, overrideAccess: true, req,
  });
  req.context.startimePublishedSlug = published._status === "published" ? published.slug : undefined;
  return data;
};

export const redirectChangedMainPageSlug: CollectionAfterChangeHook = async ({ doc, previousDoc, req, operation }) => {
  if (operation !== "update" || doc._status !== "published" || !mainPageKey(doc.internalTitle)) return doc;
  const locale = req.locale === "ar" ? "ar" : "en";
  const previousSlug = req.context.startimePublishedSlug ?? (previousDoc?._status === "published" ? previousDoc.slug : undefined);
  if (typeof previousSlug === "string" && previousSlug !== doc.slug) {
    await saveSlugRedirect(req.payload, doc, locale, previousSlug, req);
  }
  return doc;
};
