import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { manageCmsContent } from "../access/cmsUsers";

function linkValidation(value: unknown) {
  if (
    typeof value !== "string" ||
    (!value.startsWith("/") && !/^https?:\/\//i.test(value))
  ) {
    return "Enter an internal path beginning with / or a complete https:// URL.";
  }
  return true;
}

export const Insights: CollectionConfig = {
  slug: "insights-posts",
  labels: {
    singular: "News or Insight",
    plural: "Insights and News",
  },
  admin: {
    group: "Insights and News",
    useAsTitle: "internalTitle",
    defaultColumns: [
      "internalTitle",
      "category",
      "publishedAt",
      "showOnHomepage",
      "showOnInsightsPage",
      "_status",
    ],
    description:
      "Edit the six real Startime news cards shown on the homepage and Insights page. Newest publication dates appear first automatically.",
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
      label: "Internal post name",
      type: "text",
      required: true,
      admin: {
        description: "Stable English CMS label; never shown on the website.",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Card content",
          fields: [
            {
              name: "title",
              type: "text",
              localized: true,
              required: true,
            },
            {
              name: "slug",
              type: "text",
              localized: true,
              required: true,
              unique: true,
              admin: {
                description:
                  "URL segment only, for example enduring-partnership-renewed-trust.",
              },
            },
            {
              name: "summary",
              type: "textarea",
              localized: true,
              required: true,
            },
            {
              name: "category",
              type: "relationship",
              relationTo: "insight-categories",
              required: true,
            },
            {
              name: "featuredImage",
              type: "upload",
              relationTo: "media",
              required: true,
            },
            {
              name: "destination",
              label: "Card destination",
              type: "text",
              localized: true,
              required: true,
              validate: linkValidation,
              admin: {
                description:
                  "Choose where Read more opens, for example /media-centre.",
              },
            },
          ],
        },
        {
          label: "Article page",
          fields: [
            {
              name: "intro",
              label: "Article introduction",
              type: "textarea",
              localized: true,
            },
            {
              name: "content",
              label: "Article sections",
              type: "array",
              localized: true,
              minRows: 1,
              fields: [
                {
                  name: "heading",
                  type: "text",
                },
                {
                  name: "body",
                  type: "richText",
                  editor: lexicalEditor(),
                  required: true,
                  admin: {
                    description:
                      "Use the visual editor for paragraphs, headings, lists, links, emphasis, and quotations.",
                  },
                },
              ],
            },
            {
              name: "seo",
              label: "Article SEO",
              type: "group",
              fields: [
                {
                  name: "title",
                  label: "SEO title",
                  type: "text",
                  localized: true,
                },
                {
                  name: "description",
                  label: "Meta description",
                  type: "textarea",
                  localized: true,
                },
                {
                  name: "indexable",
                  type: "checkbox",
                  defaultValue: true,
                },
              ],
            },
          ],
        },
        {
          label: "Publishing and placement",
          fields: [
            {
              name: "publishedAt",
              label: "Publication date",
              type: "date",
              required: true,
              admin: {
                date: {
                  pickerAppearance: "dayOnly",
                },
                description:
                  "Cards are automatically ordered newest to oldest.",
              },
            },
            {
              name: "publicationLabel",
              label: "Public date label",
              type: "text",
              localized: true,
              required: true,
              admin: {
                description:
                  "Exact label shown publicly, for example September 2025 or September 18, 2025.",
              },
            },
            {
              name: "visible",
              type: "checkbox",
              localized: true,
              defaultValue: true,
            },
            {
              name: "showOnHomepage",
              label: "Show on homepage",
              type: "checkbox",
              localized: true,
              defaultValue: true,
            },
            {
              name: "showOnInsightsPage",
              label: "Show on Insights page",
              type: "checkbox",
              localized: true,
              defaultValue: true,
            },
          ],
        },
      ],
    },
  ],
  versions: {
    drafts: {
      autosave: true,
      localizeStatus: true,
    },
  },
};
