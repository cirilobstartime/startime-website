import type { Metadata } from "next";
import { headers } from "next/headers";
import { AttributionCapture } from "@/components/AttributionCapture";
import { AmbientSpotlight } from "@/components/AmbientSpotlight";
import { CookieConsent } from "@/components/CookieConsent";
import { EventTracking } from "@/components/EventTracking";
import { FuturisticMotion } from "@/components/FuturisticMotion";
import { MarketingTags } from "@/components/MarketingTags";
import { OrganizationSchema } from "@/components/OrganizationSchema";
import { getMarketingSettings, getSiteChrome } from "@/content/payload";
import "./globals.css";
import "./luxury.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://startime.sa",
  ),
  title: "Startime",
  description: "High-impact events, experiences, and business communities.",
  icons: {
    icon: [
      {
        type: "image/svg+xml",
        url: "/assets/brand/startime-symbol-dark.svg",
      },
    ],
    shortcut: "/assets/brand/startime-symbol-dark.svg",
  },
};

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get("x-nonce") || "";
  const locale = requestHeaders.get("x-startime-locale") === "ar" ? "ar" : "en";
  const [marketing, chrome] = await Promise.all([
    getMarketingSettings(locale),
    getSiteChrome(locale),
  ]);
  return (
    <html dir={locale === "ar" ? "rtl" : "ltr"} lang={locale}>
      <body>
        <AmbientSpotlight />
        <FuturisticMotion />
        <AttributionCapture settings={marketing} />
        <EventTracking />
        <MarketingTags nonce={nonce} settings={marketing} />
        <OrganizationSchema chrome={chrome} nonce={nonce} />
        <CookieConsent settings={marketing} />
        {children}
      </body>
    </html>
  );
}
