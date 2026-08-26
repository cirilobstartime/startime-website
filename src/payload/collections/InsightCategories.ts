import type { CollectionConfig } from "payload";
import { manageCmsContent } from "../access/cmsUsers";

export const InsightCategories: CollectionConfig = {
  slug: "insight-categories",
  labels: {
    singular: "Insight Category",
    plural: "Insight Categories",
  },
  admin: {
    group: "Insights and News",
    useAsTitle: "internalTitle",
    defaultColumns: ["internalTitle", "title", "slug", "visible"],
    description:
      "Create reusable categories for Startime news and insight cards. Switch locale before editing the public label.",
  },
  access: {
    create: manageCmsContent,
    delete: manageCmsContent,
    read: ({ req }) =>
      req.user
        ? true
        : {
            _status: {
              equals: "published",
            },
          },
    update: manageCmsContent,
  },
  fields: [
    {
      name: "internalTitle",
      label: "Internal category name",
      type: "text",
      required: true,
      admin: {
        description: "Stable English CMS label; never shown on the website.",
      },
    },
    {
      name: "title",
      label: "Public category label",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "slug",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "visible",
      type: "checkbox",
      localized: true,
      defaultValue: true,
    },
    {
      name: "displayOrder",
      type: "number",
      defaultValue: 10,
      admin: {
        position: "sidebar",
      },
    },
  ],
  versions: {
    drafts: {
      autosave: true,
      localizeStatus: true,
    },
  },
};
