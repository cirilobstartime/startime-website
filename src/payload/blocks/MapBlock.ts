import type { Block } from "payload";
import { buttonFields, eyebrowFields, sectionControls } from "./shared";

export const MapBlock: Block = {
  slug: "map",
  labels: {
    singular: "Location map",
    plural: "Location maps",
  },
  fields: [
    ...sectionControls,
    ...eyebrowFields,
    { name: "heading", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    {
      name: "embedURL",
      label: "Google Maps embed URL",
      type: "text",
      required: true,
      admin: {
        description:
          "Use a Google Maps URL ending in output=embed. This is displayed inside the page.",
      },
    },
    {
      name: "mapTitle",
      label: "Accessible map title",
      type: "text",
      required: true,
    },
    {
      name: "button",
      type: "group",
      fields: buttonFields.map((field) =>
        "required" in field ? { ...field, required: false } : field,
      ),
    },
  ],
};
