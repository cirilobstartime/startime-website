import configPromise from "@payload-config";
import { getPayload } from "payload";

const metadata = {
  en: {
    description:
      "Startime is a leading company specializing in organizing events, exhibitions, and sovereign and international conferences in the Kingdom of Saudi Arabia. Smart project management solutions aligned with the highest international standards.",
    title:
      "Startime Event and Exhibition Management Company in Saudi Arabia",
  },
  ar: {
    description:
      "شركة ستار تايم الرائدة في تنظيم الفعاليات والمعارض والمؤتمرات السيادية والدولية في المملكة العربية السعودية. حلول إدارة مشاريع ذكية وفق أعلى المعايير العالمية.",
    title: "ستار تايم | شركة تنظيم فعاليات ومعارض في السعودية",
  },
} as const;

function updateWebPageSchema(
  value: unknown,
  locale: keyof typeof metadata,
): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const schema = value as Record<string, unknown>;
  const graph = schema["@graph"];
  if (!Array.isArray(graph)) return schema;

  const localized = metadata[locale];
  return {
    ...schema,
    "@graph": graph.map((node) => {
      if (
        !node ||
        typeof node !== "object" ||
        Array.isArray(node) ||
        (node as Record<string, unknown>)["@type"] !== "WebPage"
      ) {
        return node;
      }

      return {
        ...(node as Record<string, unknown>),
        name: localized.title,
        description: localized.description,
      };
    }),
  };
}

async function run() {
  if (process.env.APPLY_HOME_SEO !== "true") {
    throw new Error("Set APPLY_HOME_SEO=true to apply the homepage metadata update.");
  }

  const payload = await getPayload({ config: configPromise });

  for (const locale of ["en", "ar"] as const) {
    const result = await payload.find({
      collection: "pages",
      depth: 1,
      draft: false,
      fallbackLocale: false,
      limit: 1,
      locale,
      overrideAccess: true,
      where: { pageType: { equals: "home" } },
    });
    const page = result.docs[0];
    if (!page) throw new Error(`Homepage not found for ${locale}`);

    const localized = metadata[locale];
    const currentSEO = page.seo || {};
    await payload.update({
      collection: "pages",
      id: page.id,
      draft: false,
      locale,
      overrideAccess: true,
      data: {
        _status: "published",
        // Replace any stale autosaved section relationship with the currently
        // published section data. This keeps public content unchanged while
        // allowing Payload to validate and publish the SEO-only update.
        sections: page.sections,
        seo: {
          ...currentSEO,
          title: localized.title,
          description: localized.description,
          openGraphTitle: localized.title,
          openGraphDescription: localized.description,
          structuredData:
            updateWebPageSchema(currentSEO.structuredData, locale) ||
            currentSEO.structuredData,
        },
      },
    });

    payload.logger.info(`Updated ${locale} homepage SEO metadata.`);
  }
}

await run();
