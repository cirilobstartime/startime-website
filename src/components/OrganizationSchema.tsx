import type { SiteChrome } from "@/content/types";

function mediaURL(
  media: SiteChrome["organization"]["logo"],
  origin: string,
): string | undefined {
  const value =
    typeof media === "string"
      ? media
      : media && typeof media === "object"
        ? media.url || ""
        : "";
  if (!value) return undefined;
  try {
    return new URL(value, origin).toString();
  } catch {
    return undefined;
  }
}

export function OrganizationSchema({
  chrome,
  nonce,
}: {
  chrome: SiteChrome;
  nonce: string;
}) {
  const profile = chrome.organization;
  const origin = (
    process.env.NEXT_PUBLIC_APP_URL ||
    profile.url ||
    "https://startime.sa"
  ).replace(/\/$/, "");
  const logo = mediaURL(profile.logo, origin);
  const geo =
    Number.isFinite(profile.latitude) && Number.isFinite(profile.longitude)
      ? {
          "@type": "GeoCoordinates",
          latitude: profile.latitude,
          longitude: profile.longitude,
        }
      : undefined;
  const address = {
    "@type": "PostalAddress",
    streetAddress: profile.streetAddress,
    addressLocality: profile.addressLocality,
    addressRegion: profile.addressRegion,
    postalCode: profile.postalCode,
    addressCountry: profile.addressCountry,
  };
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: profile.name,
    legalName: profile.legalName,
    alternateName: profile.alternateName,
    url: profile.url || origin,
    logo,
    image: logo,
    description: profile.description,
    foundingDate: profile.foundingDate,
    telephone: profile.phone,
    email: profile.email,
    address,
    location: geo
      ? {
          "@type": "Place",
          address,
          geo,
        }
      : undefined,
    areaServed: {
      "@type": "Country",
      name: "Saudi Arabia",
    },
    knowsAbout: profile.keywords,
    sameAs: chrome.socialLinks.map((link) => link.href),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: profile.phone,
      email: profile.email,
      contactType: "customer service",
      areaServed: "SA",
      availableLanguage: ["English", "Arabic"],
    },
  };

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replaceAll("<", "\\u003c"),
      }}
      nonce={nonce}
      suppressHydrationWarning
      type="application/ld+json"
    />
  );
}
