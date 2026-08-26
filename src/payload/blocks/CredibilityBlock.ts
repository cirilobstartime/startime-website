import type { Block } from "payload";
import { sectionControls } from "./shared";

export const CredibilityBlock: Block = {
  slug: "credibility",
  labels: {
    singular: "Credibility strip",
    plural: "Credibility strips",
  },
  fields: [
    ...sectionControls,
    { name: "label", type: "textarea", required: true },
    {
      name: "logos",
      type: "array",
      labels: {
        singular: "Membership logo",
        plural: "Membership logos",
      },
      admin: {
        description:
          "Add each organization logo here. Every logo keeps the same display size on the website. SVG or transparent PNG works best.",
      },
      fields: [
        {
          name: "logo",
          type: "upload",
          relationTo: "media",
          required: true,
          admin: {
            description:
              "Use a horizontal logo with a transparent background where possible.",
          },
        },
      ],
    },
    {
      // Existing single-logo content remains supported on the frontend, but
      // editors only see the clearer multi-logo field above.
      name: "media",
      type: "upload",
      relationTo: "media",
      admin: { condition: () => false },
    },
    { name: "href", type: "text" },
  ],
};
