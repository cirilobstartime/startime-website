import type { GlobalConfig } from "payload";
import { manageCmsContent } from "../access/cmsUsers";
import { brandColorField } from "../fields/visualStyle";

export const FooterSettings: GlobalConfig = {
  slug: "footer-settings",
  label: "Footer",
  admin: { group: "Website chrome", description: "Shared footer for every new-site page. Content and colors are separate from Header. Switch locale for translated copy and link labels." },
  access: { read: () => true, update: manageCmsContent },
  fields: [
    { type: "tabs", tabs: [
      { label: "Brand and description", fields: [
        { name: "logo", label: "Footer logo", type: "upload", relationTo: "media", admin: { description: "Transparent SVG or WebP; displayed at approximately 180 px wide without cropping." } },
        { name: "logoAlt", type: "text", localized: true, defaultValue: "Startime" },
        { name: "logoTreatment", label: "Footer logo colors", type: "select", defaultValue: "white", options: [{ label: "White silhouette (current design)", value: "white" }, { label: "Original uploaded colors", value: "original" }] },
        { name: "description", type: "textarea", localized: true },
        { name: "pattern", label: "Background pattern", type: "upload", relationTo: "media", admin: { description: "Optional. The uploaded image sits behind footer content without cropping; opacity is editable in Colors." } },
        { name: "showPattern", label: "Display footer pattern", type: "checkbox", defaultValue: false, admin: { description: "Off in the approved current design. Turn on to display the chosen pattern." } },
      ] },
      { label: "Links and contact", fields: [
        { name: "links", label: "Footer navigation", type: "array", localized: true, admin: { description: "Drag to reorder. These links do not have to match the header." }, fields: [
          { name: "label", type: "text", required: true }, { name: "href", type: "text", required: true }, { name: "visible", type: "checkbox", defaultValue: true },
        ] },
        { name: "address", label: "Address", type: "textarea", localized: true },
        { name: "addressHref", label: "Map link (optional)", type: "text", localized: true },
        { name: "phone", type: "text" },
        { name: "email", type: "email" },
        { name: "showDunsSeal", label: "Show D-U-N-S Registered seal", type: "checkbox", defaultValue: true },
        { name: "dunsSealURL", label: "D-U-N-S seal embed URL", type: "text", defaultValue: "https://dunsregistered.dnb.com/SealAuthentication.aspx?Cid=1", admin: { description: "The D&B standard HTTPS script generates this exact 114 × 97 px iframe URL. Its Cid=1 endpoint currently returns a D&B server error; leave Show seal off until D&B restores it, then re-enable and verify. If D&B issues Startime a unique URL, enter it here." }, validate: (value: unknown) => !value || (typeof value === "string" && /^https:\/\/(?:dunsregistered\.dnb\.com|profiles\.dunsregistered\.com)\//i.test(value)) || "Use an HTTPS D-U-N-S Registered / Dun & Bradstreet seal URL." },
        { name: "copyright", type: "text", localized: true },
      ] },
      { label: "Social links", fields: [
        { name: "socialLinks", type: "array", localized: true, admin: { description: "Footer-only social icons. Add or reorder links separately for English and Arabic; choose Threads to display its icon." }, fields: [
          { name: "platform", type: "select", required: true, options: ["linkedin", "x", "instagram", "youtube", "facebook", "tiktok", "threads"] },
          { name: "label", type: "text", required: true },
          { name: "href", type: "text", required: true },
          { name: "visible", type: "checkbox", defaultValue: true },
        ] },
      ] },
      { label: "Alliance strip", fields: [
        { name: "allianceLabel", label: "Accessible alliance name", type: "text", localized: true },
        { name: "allianceMemberLogo", label: "Alliance member lockup", type: "upload", relationTo: "media", admin: { description: "Recommended transparent 486 × 87 px; displayed without cropping." } },
        { name: "allianceMemberLogoAlt", label: "Alliance member logo accessible name", type: "text", localized: true },
        { name: "allianceLogoTreatment", label: "Alliance logo colors", type: "select", defaultValue: "white", options: [{ label: "White silhouettes (current design)", value: "white" }, { label: "Original uploaded colors", value: "original" }] },
        { name: "allianceLogos", label: "Alliance company logos", type: "array", localized: true, fields: [
          { name: "image", type: "upload", relationTo: "media", required: true, admin: { description: "Transparent logo; keep its original aspect ratio. No cropping or forced monochrome." } },
          { name: "alt", label: "Company name", type: "text", required: true },
          { name: "href", label: "Optional website", type: "text" },
          { name: "visible", type: "checkbox", defaultValue: true },
        ] },
      ] },
      { label: "Colors", fields: [
        brandColorField("backgroundColor", "Footer background"),
        brandColorField("textColor", "Main text"),
        brandColorField("mutedTextColor", "Description, links and contact text"),
        brandColorField("linkHoverColor", "Link hover"),
        brandColorField("iconColor", "Contact icons"),
        brandColorField("socialBackgroundColor", "Social icon background"),
        brandColorField("socialHoverColor", "Social icon hover background"),
        brandColorField("dividerColor", "Divider lines"),
        brandColorField("copyrightColor", "Copyright text"),
        { name: "patternOpacity", label: "Pattern opacity %", type: "number", min: 0, max: 100, defaultValue: 20 },
      ] },
    ] },
  ],
  versions: { drafts: { autosave: true } },
};
