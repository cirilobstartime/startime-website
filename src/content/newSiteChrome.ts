import "server-only";

import configPromise from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import type { Locale } from "@/content/home";
import { homeContent } from "@/content/home";
import { cmsMediaURL } from "@/content/cmsMediaURL";
import { canonicalizePublicHref, publicPath } from "@/lib/publicPath";

export type ChromeLink = { label: string; href: string; children?: ChromeLink[] };
export type ChromeSocial = { platform: string; label: string; href: string };
export type NewSiteHeader = {
  logo: string; logoAlt: string; homeHref: string;
  englishLabel: string; arabicLabel: string;
  openMenuLabel: string; closeMenuLabel: string;
  menuDescription: string; menuEmail: string;
  navigation: ChromeLink[]; socialLinks: ChromeSocial[];
  backgroundColor?: string; textColor?: string; menuBackgroundColor?: string; menuTextColor?: string; accentColor?: string; menuPattern?: string;
};
export type NewSiteFooter = {
  logo: string; logoAlt: string; logoTreatment: "white" | "original"; description: string; pattern: string; showPattern: boolean;
  links: ChromeLink[]; address: string; addressHref?: string; phone: string; email: string;
  showDunsSeal: boolean; dunsSealURL: string; copyright: string; socialLinks: ChromeSocial[];
  allianceLabel: string; allianceMemberLogo: string; allianceMemberLogoAlt: string; allianceLogoTreatment: "white" | "original";
  allianceLogos: { image: string; alt: string; href?: string }[];
  backgroundColor?: string; textColor?: string; mutedTextColor?: string; linkHoverColor?: string; iconColor?: string;
  socialBackgroundColor?: string; socialHoverColor?: string; dividerColor?: string; copyrightColor?: string; patternOpacity: number;
};

const socialDefaults = [
  { platform: "linkedin", label: "LinkedIn", href: "https://sa.linkedin.com/company/startimeevents" },
  { platform: "x", label: "X", href: "https://x.com/startimeevents" },
  { platform: "instagram", label: "Instagram", href: "https://www.instagram.com/startimeevents/" },
  { platform: "youtube", label: "YouTube", href: "https://www.youtube.com/@Startime_Events" },
  { platform: "facebook", label: "Facebook", href: "https://www.facebook.com/STARTIMEvents" },
  { platform: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@startime_events" },
];
const footerSocialDefaults = [
  ...socialDefaults,
  { platform: "threads", label: "Threads", href: "https://www.threads.com/@startimeevents" },
];

const pageSlugs = ["", "discover", "vision", "investment", "careers", "insights", "contact"];
export function safeChromeHref(value: string | null | undefined, fallback = "#"): string {
  if (!value) return fallback;
  if (value.startsWith("/") && !value.startsWith("//")) return canonicalizePublicHref(value);
  if (/^https:\/\/[^\s]+$/i.test(value)) return value;
  return fallback;
}

function mediaURL(value: unknown, fallback: string): string {
  return value && typeof value === "object" && "url" in value && typeof value.url === "string"
    ? cmsMediaURL(value.url) || fallback : fallback;
}

function fallbackHeader(locale: Locale): NewSiteHeader {
  const rtl = locale === "ar";
  return {
    logo: "/assets/alliance/startime-ufi.webp", logoAlt: "Startime", homeHref: publicPath(locale),
    englishLabel: "EN", arabicLabel: "عربي",
    openMenuLabel: rtl ? "فتح القائمة" : "Open menu", closeMenuLabel: rtl ? "إغلاق القائمة" : "Close menu",
    menuDescription: homeContent[locale].footerBio, menuEmail: "info@startime.sa",
    navigation: homeContent[locale].nav.map((label, index) => ({ label, href: publicPath(locale, pageSlugs[index]) })),
    socialLinks: socialDefaults,
  };
}

function fallbackFooter(locale: Locale): NewSiteFooter {
  const rtl = locale === "ar";
  return {
    logo: "/assets/alliance/startime-ufi.webp", logoAlt: "Startime", logoTreatment: "white", description: homeContent[locale].footerBio,
    pattern: "/assets/brand/startime-pattern.svg",
    showPattern: false,
    links: homeContent[locale].nav.map((label, index) => ({ label, href: publicPath(locale, pageSlugs[index]) })),
    address: rtl ? "3507 الرياض 12341\nالمملكة العربية السعودية" : "3507 Riyadh 12341\nSaudi Arabia",
    phone: "920010500", email: "info@startime.sa", showDunsSeal: true,
    dunsSealURL: "https://dunsregistered.dnb.com/SealAuthentication.aspx?Cid=1",
    copyright: "© Startime Events – All Rights Reserved", socialLinks: footerSocialDefaults,
    allianceLabel: rtl ? "أعضاء تحالف ستارتايم" : "Startime Alliance members",
    allianceMemberLogo: "/assets/alliance/alliance-member.webp",
    allianceMemberLogoAlt: rtl ? "عضو تحالف ستارتايم" : "Startime Alliance Member",
    allianceLogoTreatment: "white",
    allianceLogos: [
      { image: "/assets/alliance/startime-ufi.webp", alt: "Startime" },
      { image: "/assets/alliance/united.webp", alt: "United Advisory Chamber" },
      { image: "/assets/alliance/impact.webp", alt: "Impact Event Production" },
      { image: "/assets/alliance/aljawda.webp", alt: "Aljawda" },
    ],
    patternOpacity: 20,
  };
}

export const getNewSiteChrome = cache(async (locale: Locale): Promise<{ header: NewSiteHeader; footer: NewSiteFooter }> => {
  const headerFallback = fallbackHeader(locale);
  const footerFallback = fallbackFooter(locale);
  try {
    const payload = await getPayload({ config: configPromise });
    const [header, footer] = await Promise.all([
      payload.findGlobal({ slug: "header-settings", depth: 2, draft: false, fallbackLocale: false, locale, overrideAccess: false }),
      payload.findGlobal({ slug: "footer-settings", depth: 2, draft: false, fallbackLocale: false, locale, overrideAccess: false }),
    ]);
    const liveHeader = header._status === "published" ? header : null;
    const liveFooter = footer._status === "published" ? footer : null;
    const nav = liveHeader?.navigation?.filter((item) => item.visible !== false && item.label && item.href).map((item) => ({
      label: item.label, href: safeChromeHref(item.href),
      children: item.children?.filter((child) => child.visible !== false && child.label && child.href).map((child) => ({ label: child.label, href: safeChromeHref(child.href) })),
    }));
    const footerLinks = liveFooter?.links?.filter((item) => item.visible !== false && item.label && item.href).map((item) => ({ label: item.label, href: safeChromeHref(item.href) }));
    const social = (items: { platform: string; label: string; href: string; visible?: boolean | null }[] | null | undefined) => items?.filter((item) => item.visible !== false && item.href && item.platform).map((item) => ({
      platform: item.platform, label: item.label || item.platform, href: safeChromeHref(item.href),
    }));
    return {
      header: liveHeader ? {
        ...headerFallback,
        logo: mediaURL(header.logo, headerFallback.logo), logoAlt: header.logoAlt || headerFallback.logoAlt,
        homeHref: safeChromeHref(header.homeHref, headerFallback.homeHref),
        englishLabel: header.languageEnglishLabel || headerFallback.englishLabel,
        arabicLabel: header.languageArabicLabel || headerFallback.arabicLabel,
        openMenuLabel: header.openMenuLabel || headerFallback.openMenuLabel,
        closeMenuLabel: header.closeMenuLabel || headerFallback.closeMenuLabel,
        menuDescription: header.menuDescription ?? headerFallback.menuDescription,
        menuEmail: header.menuEmail || headerFallback.menuEmail,
        navigation: nav || headerFallback.navigation, socialLinks: social(header.socialLinks) || headerFallback.socialLinks,
        backgroundColor: header.backgroundColor || undefined, textColor: header.textColor || undefined,
        menuBackgroundColor: header.menuBackgroundColor || undefined, menuTextColor: header.menuTextColor || undefined,
        accentColor: header.accentColor || undefined, menuPattern: mediaURL(header.menuPattern, "") || undefined,
      } : headerFallback,
      footer: liveFooter ? {
        ...footerFallback,
        logo: mediaURL(footer.logo, footerFallback.logo), logoAlt: footer.logoAlt || footerFallback.logoAlt,
        logoTreatment: footer.logoTreatment === "original" ? "original" : "white",
        description: footer.description ?? footerFallback.description,
        pattern: mediaURL(footer.pattern, footerFallback.pattern),
        showPattern: footer.showPattern === true,
        links: footerLinks || footerFallback.links,
        address: footer.address ?? footerFallback.address,
        addressHref: footer.addressHref ? safeChromeHref(footer.addressHref) : undefined,
        phone: footer.phone || footerFallback.phone, email: footer.email || footerFallback.email,
        showDunsSeal: footer.showDunsSeal !== false,
        dunsSealURL: footer.dunsSealURL && /^https:\/\/(?:dunsregistered\.dnb\.com|profiles\.dunsregistered\.com)\//i.test(footer.dunsSealURL) ? footer.dunsSealURL : footerFallback.dunsSealURL,
        copyright: footer.copyright ?? footerFallback.copyright,
        socialLinks: social(footer.socialLinks) || footerFallback.socialLinks,
        allianceLabel: footer.allianceLabel || footerFallback.allianceLabel,
        allianceMemberLogo: mediaURL(footer.allianceMemberLogo, footerFallback.allianceMemberLogo),
        allianceMemberLogoAlt: footer.allianceMemberLogoAlt || footerFallback.allianceMemberLogoAlt,
        allianceLogoTreatment: footer.allianceLogoTreatment === "original" ? "original" : "white",
        allianceLogos: footer.allianceLogos?.filter((item) => item.visible !== false && item.image).map((item) => ({
          image: mediaURL(item.image, ""), alt: item.alt || "", href: item.href ? safeChromeHref(item.href) : undefined,
        })).filter((item) => item.image) || footerFallback.allianceLogos,
        backgroundColor: footer.backgroundColor || undefined, textColor: footer.textColor || undefined,
        mutedTextColor: footer.mutedTextColor || undefined, linkHoverColor: footer.linkHoverColor || undefined,
        iconColor: footer.iconColor || undefined, socialBackgroundColor: footer.socialBackgroundColor || undefined,
        socialHoverColor: footer.socialHoverColor || undefined, dividerColor: footer.dividerColor || undefined,
        copyrightColor: footer.copyrightColor || undefined,
        patternOpacity: footer.patternOpacity ?? footerFallback.patternOpacity,
      } : footerFallback,
    };
  } catch (error) {
    console.error("New-site header/footer settings unavailable:", error);
    return { header: headerFallback, footer: footerFallback };
  }
});
