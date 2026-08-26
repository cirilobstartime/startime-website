import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";
import { eyebrowFields, sectionControls } from "./shared";

export const RichTextBlock: Block = {
  slug: "richTextContent",
  labels: {
    singular: "Rich text content",
    plural: "Rich text content sections",
  },
  fields: [
    ...sectionControls,
    ...eyebrowFields,
    { name: "heading", type: "textarea" },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor(),
      required: true,
      admin: {
        description:
          "Use the visual editor for headings, paragraphs, lists, links, emphasis, and quotations.",
      },
    },
  ],
};
