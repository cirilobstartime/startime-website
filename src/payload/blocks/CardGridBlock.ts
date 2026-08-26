import type { Block } from "payload";
import { buttonFields, eyebrowFields, sectionControls } from "./shared";

export const CardGridBlock: Block = {
  slug: "cardGrid",
  labels: {
    singular: "Flexible card grid",
    plural: "Flexible card grids",
  },
  fields: [
    ...sectionControls,
    ...eyebrowFields,
    { name: "heading", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    {
      name: "layout",
      type: "select",
      defaultValue: "editorial",
      options: [
        { label: "Editorial image grid", value: "editorial" },
        { label: "Editorial carousel", value: "swiper" },
        { label: "Corporate icon grid", value: "icons" },
        { label: "Horizontal feature list", value: "list" },
        { label: "Compact proof points", value: "proof" },
        { label: "Open editorial columns", value: "columns" },
        { label: "Dark checklist band", value: "checklist" },
        { label: "Compact sector rail", value: "tabs" },
        { label: "Strategic tracks", value: "tracks" },
        { label: "Impact focus grid", value: "focus" },
        { label: "Team member grid", value: "team" },
      ],
    },
    {
      name: "cards",
      type: "array",
      minRows: 1,
      fields: [
        { name: "internalLabel", type: "text" },
        { name: "visible", type: "checkbox", defaultValue: true },
        ...eyebrowFields,
        { name: "title", type: "textarea", required: true },
        { name: "body", type: "textarea" },
        { name: "media", type: "upload", relationTo: "media" },
        {
          name: "iconMedia",
          label: "Custom icon artwork",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Optional. Upload an SVG or image to replace the selected icon. SVG files remain SVG; raster artwork is optimized to WebP.",
          },
        },
        {
          name: "icon",
          type: "select",
          options: [
            { label: "Shield", value: "shield" },
            { label: "Anchor", value: "anchor" },
            { label: "Circuitry", value: "circuitry" },
            { label: "Factory", value: "factory" },
            { label: "Buildings", value: "buildings" },
            { label: "Mountains", value: "mountains" },
            { label: "Heartbeat", value: "heartbeat" },
            { label: "Globe", value: "globe" },
            { label: "Handshake", value: "handshake" },
            { label: "Chart", value: "chart" },
            { label: "Users", value: "users" },
            { label: "Sparkle", value: "sparkle" },
            { label: "Compass", value: "compass" },
            { label: "Lightbulb", value: "lightbulb" },
            { label: "Gear", value: "gear" },
            { label: "Check", value: "check" },
            { label: "Megaphone", value: "megaphone" },
            { label: "Calendar", value: "calendar" },
          ],
        },
        { name: "meta", type: "textarea" },
        {
          name: "button",
          type: "group",
          fields: buttonFields.map((field) =>
            "required" in field ? { ...field, required: false } : field,
          ),
        },
      ],
    },
    {
      name: "buttons",
      type: "array",
      maxRows: 2,
      fields: buttonFields,
    },
  ],
};
