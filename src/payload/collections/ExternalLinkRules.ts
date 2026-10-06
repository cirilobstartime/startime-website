import type { CollectionConfig } from "payload";

export const ExternalLinkRules: CollectionConfig = {
  slug: "external-link-rules",
  admin: {
    hidden: true,
    useAsTitle: "href",
    description: "Managed through the External links workspace. URLs and locations are read-only; only follow status can be changed there.",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: "placement", type: "text", required: true, unique: true, index: true },
    { name: "href", type: "text", required: true },
    { name: "pagePath", type: "text", required: true },
    { name: "section", type: "text", required: true },
    { name: "label", type: "text" },
    { name: "status", type: "select", required: true, defaultValue: "nofollow", options: [
      { label: "Nofollow", value: "nofollow" }, { label: "Follow", value: "follow" },
    ] },
  ],
};
