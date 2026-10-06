import type { Block } from "payload";
import { sectionControlsFor } from "./shared";
import { homepageItemVisualFields, homepageVisualFields } from "../fields/visualStyle";
import { fallbackImageField, responsiveImagesField } from "../fields/responsiveMedia";

export const NewHomepageDomainsBlock: Block = {
  slug: "newHomepageDomains",
  labels: { singular: "New homepage investment domains", plural: "New homepage investment domains" },
  fields: [
    ...sectionControlsFor("homeDomainsSection"),
    ...homepageVisualFields,
    { name: "eyebrow", type: "text", required: true },
    { name: "heading", type: "text", required: true },
    { name: "body", type: "textarea", required: true },
    {
      name: "domains",
      type: "array",
      minRows: 1,
      maxRows: 8,
      admin: { description: "Drag to reorder. Each domain title, description and icon belongs only to the selected language's complete section set." },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        fallbackImageField("icon", "Domain fallback icon", "domainIcon"),
        responsiveImagesField("iconImages", "Icon by screen", "domainIcon"),
        { name: "visible", type: "checkbox", defaultValue: true },
        ...homepageItemVisualFields,
      ],
    },
  ],
};
