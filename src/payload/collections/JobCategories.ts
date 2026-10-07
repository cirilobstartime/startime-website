import type { CollectionConfig } from "payload";
import { manageCmsContent } from "../access/cmsUsers";

export const JobCategories: CollectionConfig = {
  slug: "job-categories",
  labels: { singular: "Job Category", plural: "Job Categories" },
  admin: { group: "Careers", useAsTitle: "internalTitle", defaultColumns: ["internalTitle", "title", "_status"], description: "Departments or professional disciplines used by Careers filters. Translate the public title in each locale." },
  access: { create: manageCmsContent, delete: manageCmsContent, update: manageCmsContent, read: ({ req }) => req.user ? true : { _status: { equals: "published" } } },
  fields: [
    { name: "internalTitle", type: "text", required: true },
    { name: "title", type: "text", localized: true, required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "visible", type: "checkbox", localized: true, defaultValue: true },
  ],
  versions: { drafts: { autosave: true, localizeStatus: true } },
};
