import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";
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

const validateEditorialTaxonomy: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  const type = data?.postType || originalDoc?.postType;
  if (type !== "news" && type !== "article") return data;
  if ((data?._status ?? originalDoc?._status) === "published") {
    const thumbnails = data?.thumbnailImages ?? originalDoc?.thumbnailImages;
    const legacyImage = data?.featuredImage ?? originalDoc?.featuredImage;
    if (!thumbnails?.default && !legacyImage) {
      throw new Error("Upload a Default thumbnail (or retain the legacy card image) before publishing. Device-specific images never become the fallback for other screens.");
    }
  }
  const category = data?.category ?? originalDoc?.category;
  const categoryID = typeof category === "object" && category ? category.id : category;
  if (categoryID) {
    const record = await req.payload.findByID({ collection: "insight-categories", id: categoryID, depth: 0, overrideAccess: true, req });
    if (record.contentType !== type) throw new Error(`Select a ${type} category for this ${type} post.`);
  }
  const tags = data?.tags ?? originalDoc?.tags;
  if (Array.isArray(tags)) for (const tag of tags) {
    const id = typeof tag === "object" && tag ? tag.id : tag;
    const record = await req.payload.findByID({ collection: "insight-tags", id, depth: 0, overrideAccess: true, req });
    if (record.contentType !== type) throw new Error(`Select only ${type} tags for this ${type} post.`);
  }
  return data;
};

export const Insights: CollectionConfig = {
  slug: "insights-posts",
  labels: {
    singular: "News or Article",
    plural: "News and Articles",
  },
  admin: {
    group: "Insights and News",
    useAsTitle: "internalTitle",
    defaultColumns: [
      "internalTitle",
      "postType",
      "category",
      "publishedAt",
      "showOnHomepage",
      "showOnInsightsPage",
      "_status",
    ],
    description:
      "Choose News or Article, then select a matching category and tags. Published News appears on the News page and in the automatic homepage feed; published Articles appear on Insights and reach the homepage only when selected manually. English and Arabic publish independently.",
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
  hooks: { beforeValidate: [validateEditorialTaxonomy] },
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
              name: "postType",
              label: "Content type",
              type: "select",
              defaultValue: "news",
              required: true,
              options: [
                { label: "News", value: "news" },
                { label: "Article / Insight", value: "article" },
              ],
            },
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
              filterOptions: ({ data }) => ({ contentType: { equals: data?.postType === "article" || data?.postType === "insight" ? "article" : "news" } }),
              admin: { description: "Only categories for the selected content type are shown. Change Content type first when switching between News and Article." },
            },
            {
              name: "tags",
              label: "News / article tags",
              type: "relationship",
              relationTo: "insight-tags",
              hasMany: true,
              filterOptions: ({ data }) => ({ contentType: { equals: data?.postType === "article" || data?.postType === "insight" ? "article" : "news" } }),
              admin: { description: "Optional reusable tags; only tags for the selected type are offered." },
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
          label: "Images · four thumbnails + article",
          description: "Upload the artwork prepared for each card width. The fifth image is the single, uncropped article image for all screens.",
          fields: [
            {
              name: "thumbnailImages",
              label: "Card thumbnails · one default + four optional screen overrides",
              type: "group",
              localized: true,
              admin: {
                description:
                  "Upload the default thumbnail once before publishing (older posts may keep their legacy card image). Only fill a device slot for a different composition; empty slots use the explicit default, never another device's upload. Labels below show both measured Homepage and News/Insights archive frames at each reference screen. The recommended 2× upload canvas covers the larger frame; nearby widths and content can change the exact frame. iMac uses the desktop slot or default. The image is contained, not cover-cropped.",
              },
              fields: [
                {
                  name: "default",
                  label: "Default thumbnail · all devices unless overridden",
                  type: "upload",
                  relationTo: "media",
                  admin: { description: "Upload once. Recommended 1152×648 px (16:9) for the measured desktop frame of 576×324 CSS px at a 1920×1080 viewport. Individual device uploads below are optional; a missing slot uses this default." },
                },
                {
                  name: "desktop",
                  label: "Desktop / iMac · screens 1920×1080 / 2560×1440 · Home 576×324 / archive 567×319 · upload 1152×648 px",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description: "At both reference screens, Homepage frame 576×324 CSS px and News/Insights archive frame 567×319 CSS px. Upload 1152×648 px (2× the larger frame), or the previously supplied 1921×1080 px 16:9 artwork. Prefer optimized WebP below about 400 KB.",
                  },
                },
                {
                  name: "laptop",
                  label: "Laptop · screen 1366×768 · Home 408×275 / archive 403×271 · upload 816×550 px",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description:
                      "At the 1366×768 reference screen, Homepage frame 408×275 CSS px and News/Insights archive frame 403×271 CSS px. Upload 816×550 px (2× the larger frame); the supplied 863×581 px artwork remains valid. Empty slot uses the default thumbnail.",
                  },
                },
                {
                  name: "tablet",
                  label: "Tablet · screen 768×1024 · Home 232×201 / archive 356×308 · upload 712×616 px",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description:
                      "At the 768×1024 reference screen, Homepage frame 232×201 CSS px but News/Insights archive frame 356×308 CSS px. Upload 712×616 px (2× the larger archive frame); the supplied 741×641 px artwork remains valid. Empty slot uses the default thumbnail.",
                  },
                },
                {
                  name: "mobile",
                  label: "Mobile · screen 390×844 · frame 350×350 · upload 700×700 px (2×)",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description:
                      "At the 390×844 reference screen, Homepage and News/Insights archive frames are both 350×350 CSS px. Upload 700×700 px (2×); the supplied 641×641 px square artwork remains valid. Empty slot uses the default thumbnail.",
                  },
                },
              ],
            },
            {
              name: "articleFeatureImage",
              label: "Article feature · 100vw wide × auto height · one uncropped image for all screens",
              type: "upload",
              localized: true,
              relationTo: "media",
              admin: {
                description:
                  "Actual frontend frame: full viewport width (390, 768, 1366, 1920 or 2560 CSS px at our reference screens) × height determined by the image's own ratio. The image is never cover-cropped. For 16:9 artwork, recommended one optimized 3840×2160 px WebP (2× the 1920 desktop width; about 1.5× the 2560 iMac width), ideally under 1.2 MB. Other aspect ratios are valid; retain your intended composition. If empty, the explicit Default thumbnail or legacy card image is used, never a device-specific crop. No separate mobile upload is needed.",
              },
            },
            {
              name: "featuredImage",
              label: "Legacy card image · fallback only",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Older records use this image. New records should use the four thumbnail slots above; this is not an additional required upload.",
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
              name: "displayOrder",
              label: "Legacy card order",
              type: "number",
              admin: {
                description:
                  "Existing imported records without real dates retain this order. For new manual archive ordering, choose posts directly in the News or Insights page editor.",
              },
            },
            {
              name: "publishedAt",
              label: "Publication date",
              type: "date",
              admin: {
                date: {
                  pickerAppearance: "dayOnly",
                },
                description:
                  "Optional. Enter the real publication date when known; do not use an estimated date.",
              },
            },
            {
              name: "publicationLabel",
              label: "Public date label",
              type: "text",
              localized: true,
              admin: {
                description:
                  "Optional exact date label if the design displays one.",
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
              label: "Eligible for homepage",
              type: "checkbox",
              localized: true,
              defaultValue: true,
            },
            {
              name: "showOnInsightsPage",
              label: "Visible in its own archive",
              type: "checkbox",
              localized: true,
              defaultValue: true,
              admin: { description: "News is eligible only for Latest News; Articles only for Insights. The content type always determines the archive." },
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
