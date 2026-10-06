import type { Field } from "payload";
import { brandColorField } from "../fields/visualStyle";
import { mediaRoleGuidance, responsiveImagesField, responsiveVideosField, type MediaRole } from "../fields/responsiveMedia";

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
    label: "Show this section",
    type: "checkbox",
    defaultValue: true,
    admin: {
      description: "Turn this off to hide the section without deleting it.",
    },
  },
  {
    label: "Advanced background media and element visibility",
    type: "collapsible",
    admin: { initCollapsed: true, description: "Open to replace backgrounds per device or hide individual elements without deleting them." },
    fields: [
      responsiveImagesField("backgroundImages", "Background artwork by screen", "background"),
      responsiveVideosField("backgroundVideos", "Background video by screen", "background"),
      {
        name: "elementVisibility",
        label: "Show or hide individual elements",
        type: "group",
        admin: { description: "Turn an element off without deleting its text, media, or link." },
        fields: [
          { name: "eyebrow", label: "Show eyebrow", type: "checkbox", defaultValue: true },
          { name: "heading", label: "Show heading", type: "checkbox", defaultValue: true },
          { name: "body", label: "Show description", type: "checkbox", defaultValue: true },
          { name: "media", label: "Show foreground image or video", type: "checkbox", defaultValue: true },
          { name: "items", label: "Show cards, slides or statistics", type: "checkbox", defaultValue: true },
          { name: "pattern", label: "Show decorative pattern", type: "checkbox", defaultValue: true },
          { name: "cta", label: "Show buttons and action links", type: "checkbox", defaultValue: true },
        ],
      },
    ],
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
    label: "Section appearance",
    type: "collapsible",
    admin: { initCollapsed: true, description: "Optional background, overlay, and spacing controls." },
    fields: [{
    name: "appearance",
    type: "group",
    fields: [
      {
        name: "applyPresets",
        label: "Apply background and spacing presets",
        type: "checkbox",
        defaultValue: false,
        admin: { description: "Leave off to preserve the approved design. Turn on only when you want the background and vertical spacing choices below to override it." },
      },
      {
        name: "theme",
        label: "Background preset",
        type: "select",
        defaultValue: "light",
        options: [
          { label: "Light", value: "light" },
          { label: "Dark", value: "dark" },
          { label: "Brand purple", value: "brand" },
          { label: "Transparent", value: "transparent" },
        ],
      },
      brandColorField("backgroundColor", "Background color"),
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
    }],
  },
];

/** Replace only the optional backdrop labels with this section's measured frame. */
export function sectionControlsFor(role: MediaRole): Field[] {
  return sectionControls.map((field) => {
    if (field.type !== "collapsible") return field;
    if (field.label === "Section appearance") {
      const { sizes, note } = mediaRoleGuidance(role);
      return {
        ...field,
        fields: field.fields.map((nested) => {
          if (!("name" in nested) || nested.name !== "appearance" || nested.type !== "group") return nested;
          return {
            ...nested,
            fields: nested.fields.map((option) => {
              if (!("name" in option) || option.name !== "backgroundImage" && option.name !== "mobileBackgroundImage") return option;
              const mobile = option.name === "mobileBackgroundImage";
              const upload = mobile ? sizes[0] : sizes[3];
              const [width, height] = upload.split("×").map((part) => Number(part.trim()));
              return {
                ...option,
                admin: {
                  ...option.admin,
                  description: `Legacy ${mobile ? "mobile" : "desktop"} background slot; prefer the five-screen Background artwork field above. Reference screen ${mobile ? "390×844" : "1920×1080"} CSS px; rendered section frame ${width / 2}×${height / 2} CSS px; recommended upload ${upload} px (2×). Full-bleed backgrounds use cover, so a different aspect ratio crops. ${note}`,
                },
              };
            }),
          };
        }),
      } as Field;
    }
    if (field.label !== "Advanced background media and element visibility") return field;
    return {
      ...field,
      fields: field.fields.map((nested) => "name" in nested && nested.name === "backgroundImages"
        ? responsiveImagesField("backgroundImages", "Optional section background by screen", role)
        : "name" in nested && nested.name === "backgroundVideos"
          ? responsiveVideosField("backgroundVideos", "Optional section background video by screen", role)
          : nested),
    } as Field;
  });
}

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
