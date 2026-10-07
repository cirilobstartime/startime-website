import type { Block } from "payload";
import { sectionControlsFor } from "./shared";
import { brandColorField, homepageItemVisualFields, homepageVisualFields } from "../fields/visualStyle";
import { fallbackImageField, responsiveImagesField } from "../fields/responsiveMedia";
import { portfolioTopPaddingDefaults } from "@/content/portfolioTopPadding";

export const NewHomepagePortfoliosBlock: Block = {
  slug: "newHomepagePortfolios",
  labels: { singular: "New homepage portfolios", plural: "New homepage portfolios" },
  fields: [
    ...sectionControlsFor("homePortfoliosSection"),
    ...homepageVisualFields,
    brandColorField("portfolioTitleColor", "Portfolio card title color · default beige"),
    { name: "eyebrow", type: "text", required: true },
    { name: "heading", type: "text", required: true, admin: { description: "Centered section heading. On Arabic large-laptop and desktop layouts (1600 px+), its text area can grow from 820 to 1000 px so the approved title stays on one line. The longer English title and custom copy may wrap naturally. Per-screen font sizes are editable under Advanced visual controls." } },
    { name: "body", type: "textarea", required: true },
    { name: "topPaddingByScreen", label: "Top padding by screen · this section only", type: "group", admin: { description: "Current measured top padding at the five reference widths is shown below in CSS px. These defaults retain the approved fluid spacing between widths. Change only the devices you want; bottom padding and all other sections stay unchanged." }, fields: [
      ...(["mobile", "tablet", "laptop", "desktop", "imac"] as const).map((device) => ({
        name: device,
        label: `${device === "imac" ? "iMac / large" : device[0].toUpperCase() + device.slice(1)} · current ${portfolioTopPaddingDefaults[device]} px`,
        type: "number" as const,
        min: 0,
        max: 400,
        defaultValue: portfolioTopPaddingDefaults[device],
        admin: { description: device === "desktop" ? "Reference 1920 px screen: 144 px. The unchanged design is fluid (128 px at 1600 px); editing this value makes it fixed within the desktop range." : device === "laptop" ? "Reference 1366 px screen: 109.28 px. The unchanged design remains fluid across laptop widths; editing this value makes it fixed within the laptop range." : `Reference ${device === "mobile" ? "390" : device === "tablet" ? "768" : "2560"} px screen: ${portfolioTopPaddingDefaults[device]} px.` },
      })),
    ] },
    responsiveImagesField("patternImages", "Decorative background pattern by screen", "portfolioPattern"),
    {
      name: "portfolios",
      type: "array",
      minRows: 1,
      maxRows: 6,
      admin: { description: "Drag to reorder. Keep three entries for the approved three-column layout." },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        fallbackImageField("image", "Portfolio fallback photograph", "portfolio"),
        responsiveImagesField("images", "Portfolio image by screen", "portfolio"),
        { name: "visible", type: "checkbox", defaultValue: true },
        ...homepageItemVisualFields,
      ],
    },
  ],
};
