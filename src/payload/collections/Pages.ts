import type { CollectionConfig } from "payload";
import { pageBlocks } from "../blocks";
import { manageCmsContent } from "../access/cmsUsers";
import { validateMainPageSlug, capturePublishedPageSlug, redirectChangedMainPageSlug } from "../hooks/pageSlugs";

export const Pages: CollectionConfig = {
  slug: "pages",
  disableDuplicate: false,
  hooks: { beforeValidate: [validateMainPageSlug], beforeChange: [capturePublishedPageSlug], afterChange: [redirectChangedMainPageSlug] },
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
      "Switch locale before editing. English and Arabic have independent content, section order, visibility, slugs and publish status. Publishing a changed main-page slug automatically adds an editable redirect from its old URL.",
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
                  "Drag connected page blocks to change public order. Open a block to edit its copy, media, colors, responsive type, links, and visibility. Investment hero intentionally exposes copy only; its globe/background are locked. English and Arabic have independent section sets.",
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
                  admin: { description: "Optional SEO override only; leave blank to use the page's current published URL. To change its actual address, edit Slug in Page settings and publish." },
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
                { label: "Vision", value: "vision" },
                { label: "Investment", value: "investment" },
                { label: "Careers", value: "careers" },
                { label: "Latest News", value: "latest-news" },
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
              admin: { description: "Actual URL for this language. Use a single slug, e.g. news (English /news, Arabic /ar/news). Publish to apply; an editable redirect is automatically added from the previous URL. Homepage stays home (/ or /ar)." },
            },
            {
              name: "visible",
              label: "Show this page in this language",
              type: "checkbox",
              localized: true,
              defaultValue: true,
              admin: {
                description:
                  "Master visibility switch for this language. Hidden pages return 404 even when published.",
              },
            },
            {
              name: "archiveSortMode",
              label: "News / blog card order",
              type: "select",
              localized: true,
              defaultValue: "latest",
              options: [
                { label: "Latest publication date first (default)", value: "latest" },
                { label: "Manual card order from each post", value: "manual" },
              ],
              admin: { description: "Applies to Latest News and Insights/blog archives. Manual mode uses each post's Card order number." },
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
