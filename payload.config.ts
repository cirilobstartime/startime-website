import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Media } from "./src/payload/collections/Media";
import { Forms } from "./src/payload/collections/Forms";
import { FormSubmissions } from "./src/payload/collections/FormSubmissions";
import { FormUploads } from "./src/payload/collections/FormUploads";
import { FormAttempts } from "./src/payload/collections/FormAttempts";
import { InsightCategories } from "./src/payload/collections/InsightCategories";
import { Insights } from "./src/payload/collections/Insights";
import { Pages } from "./src/payload/collections/Pages";
import { Redirects } from "./src/payload/collections/Redirects";
import { Users } from "./src/payload/collections/Users";
import { SiteSettings } from "./src/payload/globals/SiteSettings";
import { MarketingSettings } from "./src/payload/globals/MarketingSettings";

const serverURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const payloadSecret = process.env.PAYLOAD_SECRET;

if (
  process.env.NODE_ENV === "production" &&
  (!payloadSecret || payloadSecret.length < 32)
) {
  throw new Error(
    "PAYLOAD_SECRET must be configured with at least 32 characters in production.",
  );
}

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      beforeDashboard: [
        {
          path: "./src/payload/admin/CmsDashboardIntro",
          exportName: "CmsDashboardIntro",
        },
      ],
      graphics: {
        Icon: {
          path: "./src/payload/admin/StartimeBrand",
          exportName: "StartimeIcon",
        },
        Logo: {
          path: "./src/payload/admin/StartimeBrand",
          exportName: "StartimeLogo",
        },
      },
    },
    meta: {
      icons: {
        icon: [
          {
            type: "image/svg+xml",
            url: "/assets/brand/startime-symbol-dark.svg",
          },
        ],
        shortcut: "/assets/brand/startime-symbol-dark.svg",
      },
      titleSuffix: "— Startime Content Studio",
    },
  },
  collections: [
    Users,
    Pages,
    Media,
    Forms,
    FormSubmissions,
    FormUploads,
    FormAttempts,
    InsightCategories,
    Insights,
    Redirects,
  ],
  globals: [SiteSettings, MarketingSettings],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || "file:./startime.db",
    },
    blocksAsJSON: true,
    wal: true,
  }),
  experimental: {
    localizeStatus: true,
  },
  localization: {
    defaultLocale: "en",
    defaultLocalePublishOption: "active",
    fallback: false,
    locales: [
      {
        code: "en",
        label: "English",
      },
      {
        code: "ar",
        label: "Arabic",
        rtl: true,
      },
    ],
  },
  routes: {
    admin: "/content-admin",
    api: "/api",
  },
  cors: [serverURL],
  csrf: [serverURL],
  secret:
    payloadSecret ||
    "startime-local-development-secret-change-before-production",
  serverURL,
  sharp,
  typescript: {
    outputFile: "src/generated/payload-types.ts",
  },
});
