import type { Block } from "payload";
import { buttonFields, eyebrowFields, sectionControls } from "./shared";

export const CallToActionBlock: Block = {
  slug: "callToAction",
  labels: {
    singular: "Call to action",
    plural: "Calls to action",
  },
  fields: [
    ...sectionControls,
    ...eyebrowFields,
    { name: "heading", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    { name: "media", type: "upload", relationTo: "media" },
    {
      name: "buttons",
      type: "array",
      minRows: 1,
      maxRows: 3,
      fields: buttonFields,
    },
  ],
};
