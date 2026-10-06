import type { GlobalConfig } from "payload";
import { manageCmsContent } from "../access/cmsUsers";
import { iconDimensionsField } from "../fields/iconDimensions";

export const IconSettings: GlobalConfig = {
  slug: "icon-settings", label: "Icon dimensions",
  admin: { group: "Website chrome", description: "Site-wide responsive icon sizes, shared by English and Arabic. Save applies immediately. For a particular section or card, use its Advanced visual controls / item overrides. Empty fields preserve the current design." },
  access: { read: () => true, update: manageCmsContent },
  fields: [{ type: "tabs", tabs: [
    { label: "Content icons", fields: [iconDimensionsField("content", "Uploaded and built-in content icons")] },
    { label: "Links and arrows", fields: [iconDimensionsField("actions", "Button and link arrows"), iconDimensionsField("carousel", "Carousel arrow symbols")] },
    { label: "Header and footer", fields: [iconDimensionsField("social", "Social icons"), iconDimensionsField("contact", "Contact and footer detail icons"), iconDimensionsField("menu", "Menu / close control")] },
    { label: "Forms", fields: [iconDimensionsField("forms", "Attachment, select, and form action icons")] },
  ] }],
};
