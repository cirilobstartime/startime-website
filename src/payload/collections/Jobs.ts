import type { CollectionConfig } from "payload";
import { manageCmsContent } from "../access/cmsUsers";

export const Jobs: CollectionConfig = {
  slug: "jobs",
  labels: { singular: "Job Posting", plural: "Job Postings" },
  admin: { group: "Careers", useAsTitle: "internalTitle", defaultColumns: ["internalTitle", "jobType", "location", "publishedAt", "_status"], description: "One job record for both languages, with independent translated content and publish status. Only open, visible, published jobs appear on Careers. Categories and tags power the filters." },
  access: { create: manageCmsContent, delete: manageCmsContent, update: manageCmsContent, read: ({ req }) => req.user ? true : { _status: { equals: "published" } } },
  fields: [
    { name: "internalTitle", type: "text", required: true, admin: { description: "Stable internal name; never shown publicly." } },
    { name: "slug", type: "text", required: true, unique: true, admin: { description: "Stable job identifier, e.g. creative-director." } },
    { name: "title", type: "text", localized: true, required: true },
    { name: "detailTitle", type: "text", localized: true, admin: { description: "Optional expanded heading in the job details dialog." } },
    { name: "summary", type: "textarea", localized: true, required: true },
    { name: "overview", type: "textarea", localized: true, required: true },
    { name: "responsibilities", type: "array", localized: true, fields: [{ name: "text", type: "textarea", required: true }] },
    { name: "requirements", type: "array", localized: true, fields: [{ name: "text", type: "textarea", required: true }] },
    { name: "location", type: "text", localized: true, required: true, admin: { description: "City or location shown on the card and used as a filter." } },
    { name: "jobType", type: "select", required: true, defaultValue: "full-time", options: [
      { label: "Full-time", value: "full-time" }, { label: "Part-time", value: "part-time" }, { label: "Contract", value: "contract" }, { label: "Internship", value: "internship" }, { label: "Temporary", value: "temporary" }, { label: "Freelance", value: "freelance" },
    ] },
    { name: "jobTypeLabel", type: "text", localized: true, admin: { description: "Optional translated public employment-type label. Leave blank for the built-in English/Arabic label." } },
    { name: "category", type: "relationship", relationTo: "job-categories", required: true },
    { name: "tags", type: "relationship", relationTo: "job-tags", hasMany: true },
    { name: "publishedAt", type: "date", admin: { description: "Latest-first uses this date; if empty, creation time is used." } },
    { name: "open", type: "checkbox", localized: true, defaultValue: true, admin: { description: "Close without deleting. Closed jobs disappear only in this language." } },
    { name: "visible", type: "checkbox", localized: true, defaultValue: true },
  ],
  versions: { drafts: { autosave: true, localizeStatus: true } },
};
