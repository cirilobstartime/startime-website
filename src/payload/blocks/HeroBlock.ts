import type { Block } from "payload";
import { buttonFields, eyebrowFields, sectionControls } from "./shared";

export const HeroBlock: Block = {
  slug: "hero",
  labels: {
    singular: "Cinematic hero",
    plural: "Cinematic heroes",
  },
  fields: [
    ...sectionControls,
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            ...eyebrowFields,
            { name: "heading", type: "textarea", required: true },
            { name: "body", type: "textarea" },
            {
              name: "eventDetails",
              type: "array",
              maxRows: 4,
              fields: [
                { name: "label", type: "textarea", required: true },
                { name: "value", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          label: "Media",
          fields: [
            {
              name: "mediaType",
              label: "Hero media type",
              type: "select",
              defaultValue: "image",
              options: [
                { label: "Image", value: "image" },
                { label: "Uploaded video", value: "video" },
                { label: "YouTube video", value: "youtube" },
              ],
              admin: {
                description:
                  "Choose Image or Uploaded video, then select Media below. Choose YouTube video and paste the YouTube link below.",
              },
            },
            {
              name: "media",
              label: "Image or uploaded video",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "For images, use 1920 × 1080 px. For video, upload MP4 or WebM (1920 × 1080 recommended). This is ignored when YouTube video is selected.",
              },
            },
            {
              name: "youtubeURL",
              label: "YouTube video URL",
              type: "text",
              admin: {
                description:
                  "Paste a public youtube.com or youtu.be video URL. This is used only when Hero media type is YouTube video.",
              },
            },
            {
              name: "mobileMedia",
              label: "Mobile image or uploaded video",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Optional mobile-specific hero media. Upload a portrait image, MP4, or WebM; 1080 × 1920 px is recommended. A mobile video is selected without downloading the desktop video.",
              },
            },
            {
              name: "heroHeight",
              label: "Hero height",
              type: "select",
              defaultValue: "viewport",
              options: [
                { label: "Full viewport height", value: "viewport" },
                { label: "Standard hero height", value: "standard" },
              ],
              admin: {
                description:
                  "Full viewport height fills the first screen, like the homepage hero.",
              },
            },
          ],
        },
        {
          label: "Buttons",
          fields: [
            {
              name: "buttons",
              type: "array",
              maxRows: 3,
              fields: buttonFields,
            },
          ],
        },
      ],
    },
  ],
};
