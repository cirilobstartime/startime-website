import type { GlobalConfig } from "payload";
import { manageCmsContent } from "../access/cmsUsers";

export const MaintenanceSettings: GlobalConfig = {
  slug: "maintenance-settings",
  label: "Maintenance mode",
  admin: {
    group: "Content",
    description:
      "Temporarily route every English and Arabic website page to one shared branded maintenance screen. The Content Studio, API, media and deployments remain available.",
  },
  access: {
    read: () => true,
    update: manageCmsContent,
  },
  fields: [
    {
      name: "enabled",
      label: "Enable maintenance mode",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "When enabled, all public pages temporarily redirect to /maintenance. The maintenance page has no language switch, and CMS editing is not affected.",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Page content",
          fields: [
            {
              name: "eyebrow",
              type: "text",
              localized: true,
              defaultValue: "Under development",
            },
            {
              name: "heading",
              type: "textarea",
              localized: true,
              defaultValue: "We’re preparing something exceptional.",
              required: true,
            },
            {
              name: "message",
              type: "textarea",
              localized: true,
              defaultValue:
                "Our website is receiving a carefully planned update. We’ll be back shortly with an improved Startime experience.",
              required: true,
            },
            {
              name: "statusLabel",
              label: "Status label",
              type: "text",
              localized: true,
              defaultValue: "A new experience is taking shape",
            },
            {
              name: "showContactLink",
              label: "Show contact link",
              type: "checkbox",
              defaultValue: true,
            },
            {
              name: "contactLabel",
              type: "text",
              localized: true,
              defaultValue: "Contact Startime",
            },
            {
              name: "contactHref",
              type: "text",
              localized: true,
              defaultValue: "mailto:info@startime.sa",
              admin: {
                description:
                  "Use an email, telephone or external URL. Internal website pages will return to maintenance mode while it is enabled.",
              },
            },
          ],
        },
        {
          label: "Media",
          fields: [
            {
              name: "logo",
              label: "Logo override (optional)",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Leave empty to use the website header logo. Recommended: transparent SVG or WebP, at least 600px wide.",
              },
            },
            {
              name: "backgroundMedia",
              label: "Desktop background image or video (optional)",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Recommended image: 2560 × 1440 px. Recommended video: 1920 × 1080 MP4 or WebM.",
              },
            },
            {
              name: "mobileBackgroundMedia",
              label: "Mobile background image or video (optional)",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "Recommended image or video: 1080 × 1920 px. The desktop media is used when this is empty.",
              },
            },
            {
              name: "overlayOpacity",
              label: "Background overlay opacity",
              type: "number",
              defaultValue: 72,
              min: 0,
              max: 95,
              admin: {
                description: "0 is clear and 95 is darkest.",
              },
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "metaTitle",
              type: "text",
              localized: true,
              defaultValue: "Website under development | Startime",
            },
            {
              name: "metaDescription",
              type: "textarea",
              localized: true,
              defaultValue:
                "Startime is preparing an improved digital experience. Please check back shortly.",
            },
          ],
        },
      ],
    },
  ],
};
