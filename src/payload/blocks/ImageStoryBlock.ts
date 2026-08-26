import type { Block } from "payload";
import { eyebrowFields, sectionControls } from "./shared";

export const ImageStoryBlock: Block = {
  slug: "imageStory",
  labels: {
    singular: "Image story",
    plural: "Image stories",
  },
  fields: [
    ...sectionControls,
    ...eyebrowFields,
    { name: "heading", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    {
      name: "images",
      type: "array",
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: "media", type: "upload", relationTo: "media", required: true },
        { name: "caption", type: "textarea" },
      ],
    },
    { name: "ctaLabel", type: "textarea" },
    { name: "ctaHref", type: "text" },
  ],
};
