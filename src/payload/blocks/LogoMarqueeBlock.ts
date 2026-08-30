import type { Block } from "payload";
import { sectionControls } from "./shared";

export const LogoMarqueeBlock: Block = {
  slug: "logoMarquee",
  labels: {
    singular: "Partner logo marquee",
    plural: "Partner logo marquees",
  },
  fields: [
    ...sectionControls,
    { name: "heading", type: "textarea", required: true },
    { name: "body", type: "textarea" },
    {
      name: "speed",
      type: "select",
      defaultValue: "standard",
      options: [
        { label: "Slow", value: "slow" },
        { label: "Standard", value: "standard" },
      ],
      admin: {
        description:
          "Controls the continuous marquee speed. Motion pauses while a visitor points to or focuses a logo.",
      },
    },
    {
      name: "logos",
      type: "array",
      minRows: 1,
      admin: {
        description:
          "Add and reorder any number of partner logos. Transparent SVG, PNG or WebP artwork works best. Recommended source canvas: 600 × 280 px.",
        initCollapsed: true,
      },
      labels: {
        singular: "Partner logo",
        plural: "Partner logos",
      },
      fields: [
        {
          name: "logo",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "alt",
          label: "Organization name",
          type: "text",
          required: true,
          admin: {
            description:
              "Used for accessibility. Enter the organization name shown in the logo.",
          },
        },
        {
          name: "href",
          label: "Organization website (optional)",
          type: "text",
        },
        {
          name: "visible",
          type: "checkbox",
          defaultValue: true,
        },
      ],
    },
  ],
};
