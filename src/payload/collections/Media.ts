import type { CollectionConfig } from "payload";
import { manageCmsContent } from "../access/cmsUsers";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Content",
    useAsTitle: "alt",
    description:
      "Upload source artwork, MP4/WebM videos, and public documents here. Raster images are automatically optimized to WebP; videos, SVGs and PDFs retain their original format. Use the dimensions shown beside each section's media field.",
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
      "application/pdf",
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
          "Internal editor guidance only. Use the exact viewport and frame dimensions shown beside the page field where this file will appear—hero, panorama, card, team and logo shapes differ. Raster uploads are saved as WebP automatically without cropping the primary file.",
      },
    },
  ],
};
