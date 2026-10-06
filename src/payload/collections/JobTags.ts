import type { CollectionConfig } from "payload";
import { manageCmsContent } from "../access/cmsUsers";

export const JobTags: CollectionConfig = {
  slug: "job-tags",
  labels: { singular: "Job Tag", plural: "Job Tags" },
  admin: { group: "Careers", useAsTitle: "internalTitle", defaultColumns: ["internalTitle", "title", "_status"], description: "Optional searchable career skills and specialties. Translate each public label independently." },
  access: { create: manageCmsContent, delete: manageCmsContent, update: manageCmsContent, read: ({ req }) => req.user ? true : { _status: { equals: "published" } } },
  fields: [
    { name: "internalTitle", type: "text", required: true },
    { name: "title", type: "text", localized: true, required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "visible", type: "checkbox", localized: true, defaultValue: true },
  ],
  versions: { drafts: { autosave: true, localizeStatus: true } },
};
