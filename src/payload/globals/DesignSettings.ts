import type { Field, GlobalConfig } from "payload";
import { manageCmsContent } from "../access/cmsUsers";
import { brandColorField, textRole } from "../fields/visualStyle";
import { designRoles } from "@/lib/designSettings";

const labels = {
  heroHeading: "Hero heading (H1)",
  heading: "Main section heading (H2)",
  eyebrow: "Eyebrow / subtitle above heading",
  body: "Body paragraphs",
  itemHeading: "Card / item heading",
  itemBody: "Card / item description",
  cta: "Buttons and text links",
  number: "Statistics and numbers",
  small: "Small supporting text",
};

export function designFields(defaultColors = false): Field[] {
  return [
    {
      name: "typography",
      label: "Responsive typography",
      type: "group",
      fields: designRoles.map((role) => {
        const field = textRole(role, labels[role]);
        if (field.type !== "group")
          throw new Error("Expected typography group");
        return {
          type: "collapsible" as const,
          label: labels[role],
          admin: { initCollapsed: true },
          fields: [
            {
              ...field,
              fields: [
                ...field.fields,
                {
                  type: "row" as const,
                  fields: [
                    {
                      name: "weight",
                      label: "Font weight · 100–900",
                      type: "number" as const,
                      min: 100,
                      max: 900,
                      admin: { width: "50%" },
                    },
                    {
                      name: "lineHeight",
                      label: "Line height · multiplier",
                      type: "number" as const,
                      min: 0.8,
                      max: 3,
                      admin: {
                        width: "50%",
                        description:
                          "For example 1.6. Empty preserves the current line height.",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };
      }),
    },
    {
      name: "colors",
      label: "Colors by section background",
      type: "group",
      fields: ["light", "dark"].map((theme) => ({
        name: theme,
        label:
          theme === "light"
            ? "Light-background sections"
            : "Dark / image-background sections",
        type: "group" as const,
        fields: [
          ...designRoles,
          "link",
          "buttonBackground",
          "buttonBorder",
          "divider",
        ].map((role) => {
          const field = brandColorField(
            role,
            labels[role as keyof typeof labels] ||
              role.replace(/([A-Z])/g, " $1"),
          );
          if (defaultColors && theme === "light" && field.type === "text")
            return {
              ...field,
              defaultValue:
                role === "heading"
                  ? "#2e2449"
                  : role === "eyebrow"
                    ? "#614787"
                    : undefined,
            };
          return field;
        }),
      })),
    },
    {
      name: "spacing",
      label: "Content-section vertical padding by screen",
      type: "group",
      admin: {
        description:
          "Optional CSS pixels. Applies to content sections, not heroes, sticky timelines or the footer. Section-specific padding remains higher priority.",
      },
      fields: [
        {
          name: "mobile",
          label: "Mobile · ≤ 640 px",
          type: "number",
          min: 0,
          max: 300,
        },
        {
          name: "tablet",
          label: "Tablet · 641–1023 px",
          type: "number",
          min: 0,
          max: 300,
        },
        {
          name: "laptop",
          label: "Laptop · 1024–1599 px",
          type: "number",
          min: 0,
          max: 300,
        },
        {
          name: "desktop",
          label: "Desktop · 1600–1999 px",
          type: "number",
          min: 0,
          max: 300,
        },
        {
          name: "imac",
          label: "Large / iMac · ≥ 2000 px",
          type: "number",
          min: 0,
          max: 300,
        },
      ],
    },
  ];
}

export const DesignSettings: GlobalConfig = {
  slug: "design-settings",
  label: "Global design · typography and colors",
  admin: {
    group: "Website chrome",
    description:
      "Item → section → page → global → existing design. Empty font sizes keep the current responsive design. Colors on light backgrounds default to #2e2449 headings and #614787 eyebrows. Existing local overrides are preserved. Shared by English and Arabic unless a page override selects one language.",
  },
  access: { read: () => true, update: manageCmsContent },
  fields: [
    {
      type: "tabs",
      tabs: [
        { label: "Global defaults", fields: designFields(true) },
        {
          label: "Page overrides",
          fields: [
            {
              name: "pageOverrides",
              label: "Override one page only",
              type: "array",
              admin: {
                initCollapsed: true,
                description:
                  "Choose an existing main page. These settings override global defaults, but not the section/item styles already saved on that page. Language-specific entries override Both languages.",
              },
              fields: [
                {
                  name: "page",
                  type: "relationship",
                  relationTo: "pages",
                  required: true,
                  filterOptions: { internalTitle: { contains: "New Site: " } },
                },
                {
                  name: "locale",
                  label: "Language",
                  type: "select",
                  defaultValue: "both",
                  required: true,
                  options: [
                    { label: "Both languages", value: "both" },
                    { label: "English only", value: "en" },
                    { label: "Arabic only", value: "ar" },
                  ],
                },
                ...designFields(),
              ],
            },
          ],
        },
      ],
    },
  ],
};
