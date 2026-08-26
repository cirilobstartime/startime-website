import type { CollectionConfig } from "payload";
import { pageBlocks } from "../blocks";
import { manageCmsContent } from "../access/cmsUsers";

export const Pages: CollectionConfig = {
  slug: "pages",
  disableDuplicate: false,
  admin: {
    group: "Content",
    useAsTitle: "internalTitle",
    defaultColumns: [
      "internalTitle",
      "pageType",
      "visible",
      "_status",
      "updatedAt",
    ],
    description:
      "Switch locale before editing. Each language has its own slug, sections, visibility, SEO, draft and publish status. Use Duplicate in the document menu to make a complete copy.",
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
      type: "tabs",
      tabs: [
        {
          label: "Page content",
          fields: [
            {
              name: "title",
              type: "text",
              localized: true,
              required: true,
            },
            {
              name: "summary",
              type: "textarea",
              localized: true,
            },
            {
              name: "sections",
              type: "blocks",
              blocks: pageBlocks,
              localized: true,
              admin: {
                description:
                  "This language owns a complete section set. Reorder, hide, add, or edit sections here without changing the other language.",
                initCollapsed: true,
              },
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "seo",
              type: "group",
              fields: [
                {
                  name: "title",
                  type: "text",
                  localized: true,
                },
                {
                  name: "description",
                  type: "textarea",
                  localized: true,
                },
                {
                  name: "openGraphImage",
                  type: "upload",
                  relationTo: "media",
                },
                {
                  name: "openGraphTitle",
                  type: "text",
                  localized: true,
                },
                {
                  name: "openGraphDescription",
                  type: "textarea",
                  localized: true,
                },
                {
                  name: "canonicalURL",
                  type: "text",
                  localized: true,
                },
                {
                  name: "indexable",
                  type: "checkbox",
                  localized: true,
                  defaultValue: true,
                },
                {
                  name: "followLinks",
                  type: "checkbox",
                  localized: true,
                  defaultValue: true,
                },
                {
                  name: "includeInSitemap",
                  type: "checkbox",
                  localized: true,
                  defaultValue: true,
                },
                {
                  name: "sitemapPriority",
                  type: "number",
                  localized: true,
                  defaultValue: 0.7,
                  min: 0,
                  max: 1,
                },
                {
                  name: "sitemapChangeFrequency",
                  type: "select",
                  localized: true,
                  defaultValue: "monthly",
                  options: [
                    "always",
                    "hourly",
                    "daily",
                    "weekly",
                    "monthly",
                    "yearly",
                    "never",
                  ],
                },
                {
                  name: "structuredData",
                  type: "json",
                  localized: true,
                  admin: {
                    description:
                      "Optional page-specific JSON-LD. Only valid JSON is rendered.",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Page settings",
          fields: [
            {
              name: "internalTitle",
              type: "text",
              required: true,
            },
            {
              name: "pageType",
              type: "select",
              defaultValue: "generic",
              required: true,
              options: [
                { label: "Home", value: "home" },
                { label: "Discover", value: "discover" },
                { label: "Portfolio", value: "portfolio" },
                { label: "Solutions", value: "solutions" },
                { label: "Triple S Arena", value: "triple-s-arena" },
                {
                  label: "Triple S Arena Cybersecurity Policy",
                  value: "triple-s-policy",
                },
                { label: "Join Us", value: "join-us" },
                { label: "Contact", value: "contact" },
                { label: "Insights", value: "insights" },
                { label: "Generic", value: "generic" },
              ],
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
              admin: {
                description:
                  "Master visibility switch for this language. Hidden pages return 404 even when published.",
              },
            },
            {
              name: "showInNavigation",
              type: "checkbox",
              localized: true,
              defaultValue: false,
            },
            {
              name: "navigationLabel",
              type: "text",
              localized: true,
              admin: {
                condition: (_, siblingData) =>
                  Boolean(siblingData?.showInNavigation),
              },
            },
            {
              name: "publishFrom",
              type: "date",
              localized: true,
              admin: {
                date: { pickerAppearance: "dayAndTime" },
                description:
                  "Optional date and time when the page becomes visible.",
              },
            },
            {
              name: "publishUntil",
              type: "date",
              localized: true,
              admin: {
                date: { pickerAppearance: "dayAndTime" },
                description:
                  "Optional date and time when the page stops being visible.",
              },
            },
          ],
        },
        {
          label: "Redirects",
          fields: [
            {
              name: "redirects",
              type: "array",
              localized: true,
              labels: {
                singular: "Redirect",
                plural: "Redirects",
              },
              admin: {
                description:
                  "Add every previous path for this language. Redirects are applied only while this page is visible and published.",
                initCollapsed: true,
              },
              fields: [
                {
                  name: "fromPath",
                  label: "Previous path",
                  type: "text",
                  required: true,
                  admin: {
                    description:
                      "Start with / and omit the locale, for example /discover.",
                  },
                },
                {
                  name: "permanent",
                  label: "Permanent (301/308)",
                  type: "checkbox",
                  defaultValue: true,
                  admin: {
                    description:
                      "Keep enabled for permanently retired URLs. Disable only for a temporary redirect.",
                  },
                },
              ],
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
