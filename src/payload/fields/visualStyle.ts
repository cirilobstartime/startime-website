import type { Field } from "payload";
import { iconDimensionsField } from "./iconDimensions";

const colorFieldComponent = {
  path: "./src/payload/admin/BrandColorField",
  exportName: "BrandColorField",
};

export function brandColorField(name: string, label: string): Field {
  return {
    name,
    label,
    type: "text",
    validate: (value: unknown) => !value || (typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)) || "Enter a six-digit hex color, for example #2e2449.",
    admin: {
      components: { Field: colorFieldComponent },
      description: "Choose a Startime brand color or a custom six-digit hex. Leave empty for the approved design default.",
    },
  };
}

export function textRole(name: string, label: string): Field {
  return {
    name,
    label,
    type: "group",
    admin: { description: `Optional ${label.toLowerCase()} styling. Empty values retain the approved responsive design.` },
    fields: [
      brandColorField("color", "Text color"),
      {
        type: "row",
        fields: [
          { name: "mobile", label: "Mobile · ≤ 640 px", type: "number", min: 10, max: 96, admin: { width: "20%", description: "Font size in px" } },
          { name: "tablet", label: "Tablet · 641–1023 px", type: "number", min: 10, max: 96, admin: { width: "20%", description: "Font size in px" } },
          { name: "laptop", label: "Laptop · 1024–1599 px", type: "number", min: 10, max: 120, admin: { width: "20%", description: "Font size in px" } },
          { name: "desktop", label: "Desktop · 1600–1999 px", type: "number", min: 10, max: 140, admin: { width: "20%", description: "Font size in px" } },
          { name: "imac", label: "Large / iMac · ≥ 2000 px", type: "number", min: 10, max: 160, admin: { width: "20%", description: "Font size in px" } },
        ],
      },
    ],
  };
}

/** Only attach this to sections whose public renderer consumes the controls. */
export const homepageVisualFields: Field[] = [
  {
    label: "Advanced visual controls",
    type: "collapsible",
    admin: { initCollapsed: true, description: "Open only when this section needs styling beyond the approved design." },
    fields: [iconDimensionsField(), {
      name: "textStyles",
      type: "group",
      fields: [textRole("eyebrow", "Eyebrow"), textRole("heading", "Main heading"), textRole("body", "Body text"), textRole("itemHeading", "Card or item heading"), textRole("itemBody", "Card or item body"), textRole("cta", "Button or link text"), textRole("number", "Animated statistic")],
    }, {
      name: "detailColors",
      label: "Other element colors",
      type: "group",
      fields: [
        brandColorField("ctaText", "Button or link text"),
        brandColorField("ctaBackground", "Button background"),
        brandColorField("icon", "Icon color"),
        brandColorField("line", "Divider or border color"),
        brandColorField("number", "Number color"),
        brandColorField("pattern", "Pattern tint"),
      ],
    }],
  },
];

export const homepageItemVisualFields: Field[] = [
  { name: "itemVisual", label: "This item only · colors, text and icon sizes", type: "group", admin: { description: "Optional overrides for this one card or slide. Leave blank to inherit the section design." }, fields: [
    textRole("title", "Item title"),
    textRole("body", "Item description"),
    brandColorField("background", "Item background"),
    brandColorField("border", "Item border"),
    brandColorField("icon", "Item icon"),
    iconDimensionsField(),
  ] },
];
