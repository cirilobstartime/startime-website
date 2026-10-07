import type { MigrateUpArgs } from "@payloadcms/db-sqlite";
import { mainPageKey } from "../lib/pageRoutes";
import { saveSlugRedirect } from "../payload/hooks/pageSlugs";

/** Preserve slugs/content already edited on live; only add missing retired-route redirects. */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const locale of ["en", "ar"] as const) {
    const pages = await payload.find({ collection: "pages", locale, fallbackLocale: false, draft: false,
      depth: 0, limit: 100, overrideAccess: true, req, where: { _status: { equals: "published" } },
    });
    for (const page of pages.docs) {
      const key = mainPageKey(page.internalTitle);
      if (!key || key === "home" || key === page.slug) continue;
      const fromPath = locale === "ar" ? `/ar/${key}` : `/${key}`;
      const existing = await payload.find({ collection: "redirects", req, depth: 0, limit: 1, overrideAccess: true,
        where: { and: [{ sourceLocale: { equals: locale } }, { fromPath: { equals: fromPath } }] },
      });
      if (!existing.docs.length) await saveSlugRedirect(payload, page, locale, key, req);
    }
  }
}

export async function down(): Promise<void> {
  // Keep editor-owned redirects: rolling code back must not delete CMS data.
}
