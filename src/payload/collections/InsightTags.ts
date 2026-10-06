import type { CollectionConfig } from "payload";
import { manageCmsContent } from "../access/cmsUsers";

export const InsightTags: CollectionConfig = {
  slug: "insight-tags",
  labels: { singular: "News / Article Tag", plural: "News / Article Tags" },
  admin: {
    group: "Insights and News",
    useAsTitle: "internalTitle",
    defaultColumns: ["internalTitle", "contentType", "title", "_status"],
    description: "Reusable News or Article tags. The post editor offers only tags for its selected type; translate public labels per language.",
  },
  access: { create: manageCmsContent, delete: manageCmsContent, update: manageCmsContent, read: ({ req }) => req.user ? true : { _status: { equals: "published" } } },
  fields: [
    { name: "internalTitle", type: "text", required: true },
    { name: "contentType", label: "Tag for", type: "select", required: true, defaultValue: "news", options: [{ label: "News", value: "news" }, { label: "Article", value: "article" }] },
    { name: "title", label: "Public tag label", type: "text", localized: true, required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "visible", type: "checkbox", localized: true, defaultValue: true },
  ],
  versions: { drafts: { autosave: true, localizeStatus: true } },
};
