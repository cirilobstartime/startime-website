import type { CollectionConfig } from "payload";
import { manageCmsContent } from "../access/cmsUsers";

/** Retained only for historical data compatibility; both public pages use page-owned project arrays. */
export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Project", plural: "Projects" },
  admin: {
    hidden: true,
    group: "Content",
    useAsTitle: "internalTitle",
    defaultColumns: ["internalTitle", "title", "portfolio", "visible", "_status"],
    description: "Legacy project records are retained for rollback. Edit homepage and investment projects inside their respective Pages instead.",
  },
  access: {
    create: manageCmsContent,
    delete: manageCmsContent,
    read: ({ req }) => req.user ? true : { _status: { equals: "published" } },
    update: manageCmsContent,
  },
  fields: [
    { name: "internalTitle", type: "text", required: true, admin: { description: "Stable internal name; not shown publicly." } },
    { name: "title", type: "text", localized: true, required: true },
    { name: "slug", type: "text", localized: true, required: true, unique: true },
    { name: "description", type: "textarea", localized: true, required: true },
    { name: "investmentSummary", type: "textarea", localized: true, admin: { description: "Shorter wording shown in the investment-page portfolio slider; the homepage uses Description." } },
    { name: "investmentOrder", type: "number", localized: true, min: 0, admin: { description: "Slide order within its investment portfolio. Use 10, 20, 30... to leave room for future projects." } },
    {
      name: "portfolio",
      type: "select",
      required: true,
      options: [
        { label: "Government", value: "government" },
        { label: "Business", value: "business" },
        { label: "Community", value: "community" },
      ],
    },
    { name: "image", type: "upload", relationTo: "media", localized: true, required: true, admin: { description: "Project slide image. Upload at least 1600 × 1000 px and retain a centre-safe subject for responsive crops." } },
    { name: "logo", type: "upload", relationTo: "media", localized: true, required: true, admin: { description: "Transparent SVG or WebP project logo. It is displayed without cropping." } },
    { name: "destination", type: "text", localized: true, admin: { description: "Optional local page path or complete https:// URL. Leave empty for an informational slide." } },
    { name: "visible", type: "checkbox", localized: true, defaultValue: true },
    { name: "showOnHomepage", type: "checkbox", localized: true, defaultValue: true },
    { name: "showOnInvestment", type: "checkbox", localized: true, defaultValue: true },
  ],
  versions: { drafts: { autosave: true, localizeStatus: true } },
};
