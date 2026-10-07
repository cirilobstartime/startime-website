import type { Field } from "payload";

export const iconScreens = [
  ["mobile", "Mobile · ≤ 640 px"],
  ["tablet", "Tablet · 641–1023 px"],
  ["laptop", "Laptop · 1024–1599 px"],
  ["desktop", "Desktop · 1600–1999 px"],
  ["imac", "Large / iMac · ≥ 2000 px"],
] as const;

export function iconDimensionsField(name = "iconDimensions", label = "Icon dimensions by screen"): Field {
  return {
    name, label, type: "group",
    admin: { description: "Rendered width and height in CSS pixels, not upload pixels. Each screen is independent. Empty retains the approved size (or the global icon setting). Logos, photographs, and decorative patterns are not icons." },
    fields: iconScreens.map(([screen, screenLabel]) => ({
      name: screen, label: screenLabel, type: "group",
      fields: [{ type: "row", fields: [
        { name: "width", label: "Width (px)", type: "number", min: 4, max: 600, admin: { width: "50%" } },
        { name: "height", label: "Height (px)", type: "number", min: 4, max: 600, admin: { width: "50%" } },
      ] }],
    })),
  };
}
