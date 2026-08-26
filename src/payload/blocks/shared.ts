import type { Field } from "payload";

export const sectionControls: Field[] = [
  {
    name: "internalLabel",
    type: "text",
    admin: {
      description: "Editor-only label for finding this section quickly.",
    },
  },
  {
    name: "visible",
    type: "checkbox",
    defaultValue: true,
    admin: {
      description: "Turn this off to hide the section without deleting it.",
    },
  },
  {
    name: "anchorID",
    type: "text",
    admin: {
      description:
        "Optional public anchor, for example strategic-sectors. Do not include #.",
    },
  },
  {
    name: "displayOrder",
    type: "number",
    defaultValue: 0,
    min: 0,
    admin: {
      hidden: true,
    },
  },
  {
    name: "appearance",
    type: "group",
    fields: [
      {
        name: "theme",
        type: "select",
        defaultValue: "light",
        options: [
          { label: "Light", value: "light" },
          { label: "Dark", value: "dark" },
          { label: "Brand purple", value: "brand" },
          { label: "Transparent", value: "transparent" },
        ],
      },
      {
        name: "backgroundColor",
        type: "text",
        admin: {
          description: "Optional CSS color override, for example #101114.",
        },
      },
      {
        name: "backgroundImage",
        type: "upload",
        relationTo: "media",
        admin: {
          description:
            "Optional desktop background. Use a 1920 × 1080 px landscape image; raster uploads are optimized to WebP.",
        },
      },
      {
        name: "mobileBackgroundImage",
        type: "upload",
        relationTo: "media",
        admin: {
          description:
            "Optional mobile-specific background. Use a 1080 × 1350 px portrait image; raster uploads are optimized to WebP.",
        },
      },
      {
        name: "overlayOpacity",
        type: "number",
        defaultValue: 45,
        min: 0,
        max: 90,
      },
      {
        name: "spacing",
        type: "select",
        defaultValue: "large",
        options: [
          { label: "Compact", value: "compact" },
          { label: "Standard", value: "standard" },
          { label: "Large", value: "large" },
        ],
      },
    ],
  },
];

/** Shared editor controls for every section/card eyebrow.
 * A textarea intentionally makes an editor-entered return visible on the site.
 */
export const eyebrowFields: Field[] = [
  {
    name: "eyebrow",
    type: "textarea",
    admin: {
      description: "Optional. Press Enter to show this label on two lines.",
    },
  },
  {
    name: "eyebrowSize",
    label: "Eyebrow text size",
    type: "select",
    defaultValue: "default",
    options: [
      { label: "Small", value: "small" },
      { label: "Default", value: "default" },
      { label: "Large", value: "large" },
    ],
    admin: {
      description: "Use Large sparingly for an important section label.",
    },
  },
];

export const buttonFields: Field[] = [
  {
    name: "label",
    type: "textarea",
    required: true,
    admin: { description: "Press Enter to show this CTA on two lines." },
  },
  { name: "href", type: "text", required: true },
  {
    name: "style",
    type: "select",
    defaultValue: "primary",
    options: [
      { label: "Primary", value: "primary" },
      { label: "Outline", value: "outline" },
      { label: "Text", value: "text" },
    ],
  },
  {
    name: "icon",
    type: "select",
    defaultValue: "arrow-up-right",
    options: [
      { label: "Arrow up right", value: "arrow-up-right" },
      { label: "Arrow right", value: "arrow-right" },
      { label: "Download", value: "download" },
      { label: "Calendar", value: "calendar" },
      { label: "Envelope", value: "envelope" },
      { label: "None", value: "none" },
    ],
  },
  {
    name: "trackingID",
    type: "text",
    admin: {
      description: "Stable analytics label, for example home-hero-events.",
    },
  },
  { name: "openInNewTab", type: "checkbox", defaultValue: false },
];

export const mediaField: Field = {
  name: "media",
  type: "upload",
  relationTo: "media",
  admin: {
    description:
      "Use 1920 × 1080 px for full-width images or 960 × 640 px for cards. Raster uploads are optimized to WebP.",
  },
};
