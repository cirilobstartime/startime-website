import type { Block } from "payload";
import { sectionControlsFor } from "./shared";
import { homepageItemVisualFields, homepageVisualFields } from "../fields/visualStyle";
import { responsiveImagesField } from "../fields/responsiveMedia";

export const NewHomepageValueBlock: Block = {
  slug: "newHomepageValue",
  labels: { singular: "New homepage value and impact", plural: "New homepage value and impact" },
  fields: [
    ...sectionControlsFor("homeValueSection"),
    ...homepageVisualFields,
    { name: "eyebrow", type: "text", required: true },
    { name: "heading", type: "text", required: true },
    { name: "body", type: "textarea", required: true },
    responsiveImagesField("patternImages", "Statistics background pattern by screen", "statsPattern"),
    { name: "showStatistics", type: "checkbox", defaultValue: true },
    {
      name: "statistics",
      type: "array",
      minRows: 1,
      maxRows: 8,
      admin: { description: "Reorder statistics here. Enter the display number and label separately; the existing Riyal and billion treatment remains in the design." },
      fields: [
        { name: "value", type: "text", required: true },
        { name: "label", type: "text", required: true },
        { name: "visible", type: "checkbox", defaultValue: true },
        ...homepageItemVisualFields,
      ],
    },
  ],
};
