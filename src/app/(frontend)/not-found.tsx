import type { Metadata } from "next";
import { headers } from "next/headers";
import { PublicNotFound } from "@/components/PublicNotFound";
import { getSiteChrome } from "@/content/payload";
import type { Locale } from "@/content/types";

export const metadata: Metadata = {
  title: "Page not found | Startime",
  robots: { follow: false, index: false },
};

export default async function NotFound() {
  const requestHeaders = await headers();
  const locale: Locale =
    requestHeaders.get("x-startime-locale") === "ar" ? "ar" : "en";
  const chrome = await getSiteChrome(locale);

  return <PublicNotFound chrome={chrome} locale={locale} />;
}
