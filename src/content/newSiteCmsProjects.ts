import "server-only";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import type { Media } from "@/generated/payload-types";
import type { Locale } from "@/content/home";
import { investmentContent } from "@/content/investment";
import { cmsMediaURL } from "@/content/cmsMediaURL";

export type InvestmentPortfolio = {
  title: string;
  items: { title: string; body: string; image: string; logo?: string }[];
};

function mediaURL(value: number | Media | null | undefined): string | undefined {
  return typeof value === "object" ? cmsMediaURL(value?.url) : undefined;
}

export const getNewSiteInvestmentPortfolios = cache(async (locale: Locale): Promise<InvestmentPortfolio[]> => {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "projects",
    depth: 2,
    draft: false,
    fallbackLocale: false,
    locale,
    limit: 100,
    overrideAccess: false,
    sort: "investmentOrder",
    where: {
      and: [
        { _status: { equals: "published" } },
        { visible: { equals: true } },
        { showOnInvestment: { equals: true } },
      ],
    },
  });
  const groups = ["government", "business", "community"] as const;
  return groups.flatMap((group, index) => {
    const items = result.docs.flatMap((project) => {
      if (project.portfolio !== group) return [];
      const image = mediaURL(project.image);
      const logo = mediaURL(project.logo);
      return image ? [{
        title: project.title,
        body: project.investmentSummary || project.description,
        image,
        logo,
      }] : [];
    });
    return items.length ? [{ title: investmentContent[locale].projects.portfolios[index].title, items }] : [];
  });
});
