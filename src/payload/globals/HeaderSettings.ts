import type { GlobalConfig } from "payload";
import { manageCmsContent } from "../access/cmsUsers";
import { brandColorField } from "../fields/visualStyle";

export const HeaderSettings: GlobalConfig = {
  slug: "header-settings",
  label: "Header",
  admin: {
    group: "Website chrome",
    description: "The shared desktop header and full-screen mobile menu. Switch locale before editing labels, links, and menu copy. Publish to update every new-site page.",
  },
  access: { read: () => true, update: manageCmsContent },
  fields: [
    { type: "tabs", tabs: [
      { label: "Brand and controls", fields: [
        { name: "logo", label: "Header logo", type: "upload", relationTo: "media", admin: { description: "Transparent logo, recommended SVG or WebP; displayed within a 142 × 58 px area without cropping." } },
        { name: "logoAlt", label: "Logo accessible name", type: "text", localized: true, defaultValue: "Startime" },
        { name: "homeHref", label: "Logo destination", type: "text", localized: true, admin: { description: "Use /en or /ar for the relevant language." } },
        { name: "languageEnglishLabel", label: "English switch label", type: "text", localized: true, defaultValue: "EN" },
        { name: "languageArabicLabel", label: "Arabic switch label", type: "text", localized: true, defaultValue: "عربي" },
        { name: "openMenuLabel", label: "Open-menu accessible label", type: "text", localized: true },
        { name: "closeMenuLabel", label: "Close-menu accessible label", type: "text", localized: true },
        { name: "menuDescription", label: "Full-screen menu supporting copy", type: "textarea", localized: true },
        { name: "menuEmail", label: "Email shown in full-screen menu", type: "email" },
      ] },
      { label: "Navigation", fields: [
        { name: "navigation", label: "Top navigation and full-screen menu", type: "array", localized: true, admin: { description: "Drag to reorder. A link may have optional submenu links. Hidden links disappear from both desktop and mobile." }, fields: [
          { name: "label", type: "text", required: true },
          { name: "href", type: "text", required: true },
          { name: "visible", type: "checkbox", defaultValue: true },
          { name: "children", label: "Submenu links", type: "array", fields: [
            { name: "label", type: "text", required: true },
            { name: "href", type: "text", required: true },
            { name: "visible", type: "checkbox", defaultValue: true },
          ] },
        ] },
      ] },
      { label: "Menu social links", fields: [
        { name: "socialLinks", type: "array", localized: true, admin: { description: "Links in the expanded menu. Footer social links are managed separately in Footer." }, fields: [
          { name: "platform", type: "select", required: true, options: ["linkedin", "x", "instagram", "youtube", "facebook", "tiktok"] },
          { name: "label", type: "text", required: true },
          { name: "href", type: "text", required: true },
          { name: "visible", type: "checkbox", defaultValue: true },
        ] },
      ] },
      { label: "Appearance", fields: [
        brandColorField("backgroundColor", "Scrolled header background"),
        brandColorField("textColor", "Scrolled header text"),
        brandColorField("menuBackgroundColor", "Expanded menu background"),
        brandColorField("menuTextColor", "Expanded menu text"),
        brandColorField("accentColor", "Navigation accent"),
        { name: "menuPattern", label: "Expanded-menu pattern", type: "upload", relationTo: "media", admin: { description: "Optional. Recommended 1920 × 1080 px, transparent pattern. Full image is used as a background." } },
      ] },
    ] },
  ],
  versions: { drafts: { autosave: true } },
};
