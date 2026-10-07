import type { Metadata } from "next";
import { headers } from "next/headers";
import { AttributionCapture } from "@/components/AttributionCapture";
import { CookieConsent } from "@/components/CookieConsent";
import { EventTracking } from "@/components/EventTracking";
import { ExternalLinkPolicy } from "@/components/ExternalLinkPolicy";
import { MarketingTags } from "@/components/MarketingTags";
import { getMarketingSettings } from "@/content/payload";
import { getIconSettings } from "@/content/iconSettings";
import { globalIconStyle } from "@/content/iconDimensions";
import { getDesignSettings } from "@/content/designSettings";
import { designStyle } from "@/lib/designSettings";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { LinkFollowStatus } from "@/lib/externalLinks";
import "./globals.css";
import "./cms-home-visual.css";
import "./cms-discover-visual.css";
import "./cms-vision-visual.css";
import "./cms-investment-contact-visual.css";
import "./cms-careers-visual.css";
import "./cms-editorial-visual.css";
import "./cms-chrome.css";
import "./cms-icon-dimensions.css";
import "./cms-design.css";
import "./cms-carousel.css";

const isNoIndex = process.env.STAGING_NOINDEX === "1";

export const metadata: Metadata = {
  title: "Startime Events Company",
  description:
    "We create, organize, and host B2B events, while exercising thought leadership in anticipating the future. By embracing innovation and creativity as our approach, we deliver ultimate solutions for the events industry to achieve the desired impact across the MICE industry.",
  robots: isNoIndex
    ? {
        index: false,
        follow: false,
        noarchive: true,
        googleBot: {
          index: false,
          follow: false,
          noarchive: true,
        },
      }
    : undefined,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-startime-locale") === "ar" ? "ar" : "en";
  const [marketing, icons, design] = await Promise.all([getMarketingSettings(locale), getIconSettings(), getDesignSettings()]);
  const nonce = requestHeaders.get("x-nonce") || "";
  let externalLinkRules: Record<string, LinkFollowStatus> = {};
  try {
    const payload = await getPayload({ config: configPromise });
    const path = requestHeaders.get("x-startime-public-path") || "/";
    const rules = await payload.find({ collection: "external-link-rules", where: { pagePath: { equals: path } }, depth: 0, limit: 500, overrideAccess: true });
    externalLinkRules = Object.fromEntries(rules.docs.map((rule) => [rule.placement, rule.status as LinkFollowStatus]));
  } catch {
    // New installations still get the safe nofollow default until the collection is migrated.
  }
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body style={{ ...globalIconStyle(icons), ...designStyle(design, "global") }}>
        <AttributionCapture settings={marketing} />
        <EventTracking />
        <MarketingTags nonce={nonce} settings={marketing} />
        {marketing.showConsentNotice ? <CookieConsent settings={marketing} /> : null}
        <ExternalLinkPolicy rules={externalLinkRules}>{children}</ExternalLinkPolicy>
      </body>
    </html>
  );
}
