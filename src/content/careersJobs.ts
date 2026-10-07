import "server-only";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import type { Locale } from "@/content/home";
import type { CareerJob } from "@/content/careers";

type NamedTaxonomy = { title?: string; visible?: boolean; _status?: string };
type JobRecord = {
  id: number | string; slug?: string; title?: string; detailTitle?: string; summary?: string; overview?: string;
  responsibilities?: Array<{ text?: string }>; requirements?: Array<{ text?: string }>;
  category?: NamedTaxonomy | number | string; tags?: Array<NamedTaxonomy | number | string>;
  location?: string; jobType?: string; jobTypeLabel?: string; publishedAt?: string; createdAt?: string;
  open?: boolean; visible?: boolean; _status?: string;
};

const employmentLabels: Record<string, [string, string]> = {
  "full-time": ["Full-Time", "دوام كامل"], "part-time": ["Part-Time", "دوام جزئي"],
  contract: ["Contract", "عقد"], internship: ["Internship", "تدريب"],
  temporary: ["Temporary", "مؤقت"], freelance: ["Freelance", "عمل حر"],
};

export const getCareersJobs = cache(async (locale: Locale): Promise<CareerJob[]> => {
  const payload = await getPayload({ config: configPromise });
  const results = await payload.find({
    collection: "jobs", locale, fallbackLocale: false, draft: false, overrideAccess: false,
    depth: 2, limit: 500, sort: "-createdAt", where: { and: [
      { _status: { equals: "published" } }, { open: { equals: true } }, { visible: { equals: true } },
    ] },
  });
  return ([...results.docs] as JobRecord[]).sort((a, b) => Date.parse(b.publishedAt || b.createdAt || "") - Date.parse(a.publishedAt || a.createdAt || "")).flatMap((job) => {
    if (!job.title || !job.summary || !job.overview) return [];
    const category = typeof job.category === "object" && job.category?.visible !== false && job.category?._status === "published" ? job.category.title : undefined;
    const tags = (job.tags || []).flatMap((tag) => typeof tag === "object" && tag.visible !== false && tag._status === "published" && tag.title ? [tag.title] : []);
    const city = job.location || "";
    const employmentType = job.jobTypeLabel || employmentLabels[job.jobType || ""]?.[locale === "ar" ? 1 : 0] || job.jobType || "";
    return [{
      id: String(job.id), title: job.title, detailTitle: job.detailTitle || job.title,
      location: [city, employmentType].filter(Boolean).join(" | "), city, employmentType,
      summary: job.summary, overview: job.overview,
      responsibilities: (job.responsibilities || []).map((item) => item.text || "").filter(Boolean),
      requirements: (job.requirements || []).map((item) => item.text || "").filter(Boolean),
      category, tags,
    }];
  });
});

export function orderCareersJobs(jobs: CareerJob[], mode: "latest" | "manual", selectedIds: string[]): CareerJob[] {
  if (mode !== "manual" || !selectedIds.length) return jobs;
  const ranks = new Map(selectedIds.map((id, index) => [id, index]));
  return [...jobs].sort((a, b) => (ranks.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (ranks.get(b.id) ?? Number.MAX_SAFE_INTEGER));
}
