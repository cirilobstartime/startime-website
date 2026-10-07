import type { Block } from "payload";
import { sectionControlsFor } from "./shared";
import { homepageItemVisualFields, homepageVisualFields } from "../fields/visualStyle";
import { fallbackImageField, responsiveImagesField } from "../fields/responsiveMedia";

export const NewHomepageImpactBlock: Block = {
  slug: "newHomepageImpact",
  labels: { singular: "New homepage impact journey", plural: "New homepage impact journeys" },
  fields: [
    ...sectionControlsFor("homeImpactSection"),
    ...homepageVisualFields,
    { name: "eyebrow", type: "text", required: true },
    { name: "heading", type: "text", required: true },
    {
      name: "impacts",
      type: "array",
      minRows: 1,
      maxRows: 16,
      admin: { description: "Drag to reorder the impact journey. Each entry's image is connected to that entry, so the imagery follows the copy in both desktop and mobile presentations." },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        fallbackImageField("image", "Impact fallback photograph", "impact"),
        responsiveImagesField("images", "Impact image by screen", "impact"),
        { name: "visible", type: "checkbox", defaultValue: true },
        ...homepageItemVisualFields,
      ],
    },
  ],
};
