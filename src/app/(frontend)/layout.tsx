import type { Metadata } from "next";
import { headers } from "next/headers";
import { AttributionCapture } from "@/components/AttributionCapture";
import { CookieConsent } from "@/components/CookieConsent";
import { EventTracking } from "@/components/EventTracking";
import { FuturisticMotion } from "@/components/FuturisticMotion";
import { MarketingTags } from "@/components/MarketingTags";
import { OrganizationSchema } from "@/components/OrganizationSchema";
import { getMarketingSettings, getSiteChrome } from "@/content/payload";
import "./globals.css";
import "./luxury.css";
import "./themes.css";

const themeBootScript = `(()=>{try{const k="startime-theme",s=localStorage.getItem(k),m=s==="light"||s==="dark"?s:"system",p=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=m==="system"?p:m;document.documentElement.dataset.themeMode=m}catch{document.documentElement.dataset.theme="dark";document.documentElement.dataset.themeMode="system"}})();`;

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
    <html
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeBootScript }}
          nonce={nonce}
          suppressHydrationWarning
        />
      </head>
      <body>
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
