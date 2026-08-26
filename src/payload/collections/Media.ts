import type { CollectionConfig } from "payload";
import { manageCmsContent } from "../access/cmsUsers";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Content",
    useAsTitle: "alt",
    description:
      "Upload source artwork here. Images are automatically optimized to WebP. Use 1920 × 1080 px for full-width hero imagery and 960 × 640 px for cards; preserve the subject within the centre-safe area.",
  },
  access: {
    create: manageCmsContent,
    delete: manageCmsContent,
    read: () => true,
    update: manageCmsContent,
  },
  upload: {
    adminThumbnail: "thumbnail",
    filesRequiredOnCreate: true,
    focalPoint: true,
    // Payload writes the primary uploaded image as WebP and creates WebP derivatives below.
    // SVG brand marks are kept as SVG because vector artwork should not be rasterised.
    formatOptions: {
      format: "webp",
      options: {
        quality: 84,
      },
    },
    imageSizes: [
      {
        name: "thumbnail",
        width: 480,
        height: 320,
        position: "centre",
        formatOptions: { format: "webp", options: { quality: 80 } },
      },
      {
        name: "card",
        width: 960,
        height: 640,
        position: "centre",
        formatOptions: { format: "webp", options: { quality: 84 } },
      },
      {
        name: "hero",
        width: 1920,
        height: 1080,
        position: "centre",
        formatOptions: { format: "webp", options: { quality: 86 } },
      },
    ],
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "video/mp4",
      "video/webm",
    ],
    staticDir: "uploads/media",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      required: true,
      admin: {
        description: "Describe the image for accessibility and SEO.",
      },
    },
    {
      name: "caption",
      type: "textarea",
      localized: true,
    },
    {
      name: "usageNotes",
      type: "textarea",
      admin: {
        description:
          "Internal editor guidance only. It is never shown on the public website. Recommended source sizes: hero 1920 × 1080 px; landscape card 960 × 640 px; portrait team image 900 × 1200 px. Raster uploads are saved as WebP automatically.",
      },
    },
  ],
};
