import type { Block } from "payload";
import { eyebrowFields, sectionControls } from "./shared";

export const TimelineBlock: Block = {
  slug: "timeline",
  labels: {
    singular: "Timeline or process",
    plural: "Timelines and processes",
  },
  fields: [
    ...sectionControls,
    ...eyebrowFields,
    { name: "heading", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    {
      name: "steps",
      type: "array",
      minRows: 2,
      fields: [
        { name: "visible", type: "checkbox", defaultValue: true },
        { name: "label", type: "textarea" },
        { name: "title", type: "textarea", required: true },
        { name: "body", type: "textarea" },
        {
          name: "icon",
          type: "select",
          options: [
            { label: "Compass", value: "compass" },
            { label: "Lightbulb", value: "lightbulb" },
            { label: "Handshake", value: "handshake" },
            { label: "Gear", value: "gear" },
            { label: "Megaphone", value: "megaphone" },
            { label: "Check", value: "check" },
            { label: "Chart", value: "chart" },
            { label: "Sparkle", value: "sparkle" },
          ],
        },
      ],
    },
  ],
};
