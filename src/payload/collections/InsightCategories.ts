import type { CollectionConfig } from "payload";
import { manageCmsContent } from "../access/cmsUsers";

export const InsightCategories: CollectionConfig = {
  slug: "insight-categories",
  labels: {
    singular: "News / Article Category",
    plural: "News / Article Categories",
  },
  admin: {
    group: "Insights and News",
    useAsTitle: "internalTitle",
    defaultColumns: ["internalTitle", "contentType", "title", "slug", "visible"],
    description:
      "Create separate categories for News or Articles. The post editor only offers categories matching its selected content type. Translate each public label independently.",
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
      name: "contentType",
      label: "Category for",
      type: "select",
      required: true,
      defaultValue: "news",
      options: [{ label: "News", value: "news" }, { label: "Article", value: "article" }],
      admin: { description: "Choose once. News and article categories are intentionally kept separate." },
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
