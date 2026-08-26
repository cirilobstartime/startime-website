import type { GlobalConfig } from "payload";
import { manageCmsContent } from "../access/cmsUsers";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Header and footer",
  admin: {
    group: "Content",
    description:
      "Header and footer content is localized. Switch English or Arabic before editing and publishing.",
  },
  access: {
    read: () => true,
    update: manageCmsContent,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Header",
          fields: [
            {
              name: "headerLogo",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "headerLogoDark",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "navigation",
              type: "array",
              localized: true,
              fields: [
                { name: "label", type: "text", required: true },
                { name: "href", type: "text", required: true },
                { name: "visible", type: "checkbox", defaultValue: true },
                {
                  name: "children",
                  type: "array",
                  fields: [
                    { name: "label", type: "text", required: true },
                    { name: "href", type: "text", required: true },
                    { name: "description", type: "text" },
                    { name: "visible", type: "checkbox", defaultValue: true },
                  ],
                },
              ],
            },
            {
              name: "headerCtaLabel",
              type: "text",
              localized: true,
            },
            {
              name: "headerCtaHref",
              type: "text",
              localized: true,
            },
          ],
        },
        {
          label: "Footer",
          fields: [
            {
              name: "footerLogo",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "footerDescription",
              type: "textarea",
              localized: true,
            },
            {
              name: "sisterCompaniesHeading",
              label: "Sister companies heading",
              type: "text",
              localized: true,
              defaultValue: "Our Sister Companies",
              admin: {
                description:
                  "Shown below the Startime description only when at least one sister-company logo is visible.",
              },
            },
            {
              name: "sisterCompanies",
              label: "Sister company logos",
              type: "array",
              admin: {
                description:
                  "Add any number of logos. Two display per row on desktop and one per row on mobile.",
              },
              fields: [
                {
                  name: "logo",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                  admin: {
                    description:
                      "Recommended ratio: 3:1 with a transparent SVG or WebP background.",
                  },
                },
                {
                  name: "alt",
                  label: "Accessible company name",
                  type: "text",
                  localized: true,
                  required: true,
                },
                {
                  name: "href",
                  label: "Company website (optional)",
                  type: "text",
                },
                { name: "visible", type: "checkbox", defaultValue: true },
              ],
            },
            {
              name: "companyHeading",
              type: "text",
              localized: true,
            },
            {
              name: "contactHeading",
              type: "text",
              localized: true,
            },
            { name: "address", type: "textarea", localized: true },
            { name: "phone", type: "text" },
            { name: "email", type: "email" },
            {
              name: "copyright",
              type: "text",
              localized: true,
            },
            {
              name: "socialLinks",
              type: "array",
              fields: [
                { name: "platform", type: "text", required: true },
                { name: "href", type: "text", required: true },
                {
                  name: "icon",
                  type: "select",
                  admin: {
                    description:
                      "Optional. If left empty, the icon is detected from the platform name.",
                  },
                  options: [
                    { label: "LinkedIn", value: "linkedin" },
                    { label: "X / Twitter", value: "x" },
                    { label: "Instagram", value: "instagram" },
                    { label: "YouTube", value: "youtube" },
                    { label: "Facebook", value: "facebook" },
                    { label: "TikTok", value: "tiktok" },
                    { label: "Threads", value: "threads" },
                  ],
                },
                { name: "visible", type: "checkbox", defaultValue: true },
              ],
            },
            {
              name: "footerGroups",
              type: "array",
              localized: true,
              fields: [
                { name: "heading", type: "text", required: true },
                {
                  name: "links",
                  type: "array",
                  fields: [
                    { name: "label", type: "text", required: true },
                    { name: "href", type: "text", required: true },
                    { name: "visible", type: "checkbox", defaultValue: true },
                  ],
                },
              ],
            },
            {
              name: "newsletterHeading",
              type: "text",
              localized: true,
            },
            {
              name: "newsletterBody",
              type: "textarea",
              localized: true,
            },
            {
              name: "newsletterForm",
              type: "relationship",
              relationTo: "forms",
            },
          ],
        },
        {
          label: "Global SEO",
          fields: [
            {
              name: "allowSearchIndexing",
              label: "Allow public search indexing",
              type: "checkbox",
              defaultValue: false,
              admin: {
                description:
                  "Keep disabled during review. Enable only for launch; individual page SEO controls still apply.",
              },
            },
            {
              name: "siteName",
              type: "text",
              localized: true,
              defaultValue: "Startime",
            },
            {
              name: "defaultSEODescription",
              type: "textarea",
              localized: true,
            },
            {
              name: "defaultOpenGraphImage",
              type: "upload",
              relationTo: "media",
            },
            { name: "organizationLegalName", type: "text" },
            { name: "organizationAlternateName", type: "text" },
            {
              name: "organizationDescription",
              type: "textarea",
              localized: true,
            },
            { name: "organizationLogo", type: "upload", relationTo: "media" },
            { name: "organizationURL", type: "text" },
            { name: "organizationPhone", type: "text" },
            { name: "organizationEmail", type: "email" },
            { name: "foundingDate", type: "text" },
            {
              name: "organizationKeywords",
              label: "Organization expertise and SEO topics",
              type: "array",
              localized: true,
              fields: [{ name: "keyword", type: "text", required: true }],
              admin: {
                description:
                  "Use accurate services and expertise only, such as event management, exhibitions, conferences and B2B meetings.",
              },
            },
            {
              name: "organizationAddress",
              type: "group",
              fields: [
                { name: "streetAddress", type: "text", localized: true },
                { name: "addressLocality", type: "text", localized: true },
                { name: "addressRegion", type: "text", localized: true },
                { name: "postalCode", type: "text" },
                {
                  name: "addressCountry",
                  type: "text",
                  defaultValue: "SA",
                },
                { name: "latitude", type: "number" },
                { name: "longitude", type: "number" },
              ],
            },
            {
              name: "robotsAdditionalRules",
              type: "textarea",
              admin: {
                description:
                  "Advanced robots.txt rules. Admin and API routes are always disallowed.",
              },
            },
          ],
        },
      ],
    },
  ],
  versions: {
    drafts: {
      autosave: true,
    },
  },
};
