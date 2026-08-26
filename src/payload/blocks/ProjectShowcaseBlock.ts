import type { Block } from "payload";
import { eyebrowFields, sectionControls } from "./shared";

export const ProjectShowcaseBlock: Block = {
  slug: "projectShowcase",
  labels: {
    singular: "Project showcase",
    plural: "Project showcases",
  },
  fields: [
    ...sectionControls,
    ...eyebrowFields,
    { name: "heading", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    {
      name: "projects",
      type: "array",
      minRows: 1,
      fields: [
        { name: "title", type: "textarea", required: true },
        { name: "summary", type: "textarea", required: true },
        { name: "logo", type: "upload", relationTo: "media" },
        { name: "image", type: "upload", relationTo: "media" },
        { name: "href", type: "text" },
        {
          name: "featured",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
    {
      name: "projectCtaLabel",
      label: "Linked project button label",
      type: "textarea",
      admin: {
        description:
          "Shown only on project cards that have a destination URL.",
      },
    },
    { name: "ctaLabel", type: "textarea" },
    { name: "ctaHref", type: "text" },
  ],
};
