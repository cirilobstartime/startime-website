import type { Block } from "payload";
import { eyebrowFields, sectionControls } from "./shared";

export const NewsMosaicBlock: Block = {
  slug: "newsMosaic",
  labels: {
    singular: "News mosaic",
    plural: "News mosaics",
  },
  fields: [
    ...sectionControls,
    ...eyebrowFields,
    { name: "heading", type: "textarea", required: true },
    {
      name: "layout",
      type: "select",
      defaultValue: "mosaic",
      options: [
        { label: "Editorial grid", value: "grid" },
        { label: "Homepage swiper", value: "swiper" },
        { label: "Feature mosaic", value: "mosaic" },
      ],
      admin: {
        description:
          "Use the swiper for compact homepage news and the editorial grid for archive pages.",
      },
    },
    {
      name: "pageSize",
      type: "number",
      defaultValue: 9,
      min: 3,
      max: 30,
      admin: {
        condition: (_, siblingData) => siblingData?.layout === "grid",
        description:
          "Number of articles revealed at a time on an editorial grid.",
      },
    },
    {
      name: "articles",
      type: "array",
      minRows: 1,
      fields: [
        { name: "kicker", type: "textarea" },
        { name: "title", type: "textarea", required: true },
        { name: "summary", type: "textarea" },
        { name: "media", type: "upload", relationTo: "media", required: true },
        { name: "href", type: "text" },
      ],
    },
    { name: "ctaLabel", type: "textarea" },
    { name: "ctaHref", type: "text" },
  ],
};
