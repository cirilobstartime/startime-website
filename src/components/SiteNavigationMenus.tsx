"use client";

import Link from "./CmsLink";
import { usePageHref } from "./NewSiteChromeProvider";
import { usePathname } from "next/navigation";
import { DiscoverMenu } from "@/components/DiscoverMenu";
import { HomeMenu } from "@/components/HomeMenu";
import { PageVariantMenu } from "@/components/PageVariantMenu";
import { VisionMenu } from "@/components/VisionMenu";
import { HoverDisclosure } from "@/components/HoverDisclosure";
import type { Locale } from "@/content/home";
import type { ChromeLink } from "@/content/newSiteChrome";
import { useExternalLinkAttributes } from "@/components/ExternalLinkPolicy";

export function SiteNavigationMenus({
  locale,
  labels,
  navigation,
  darkHome = false,
  onNavigate,
}: {
  locale: Locale;
  labels: string[];
  navigation?: ChromeLink[];
  darkHome?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const resolveHref = usePageHref();
  const externalAttributes = useExternalLinkAttributes();
  if (navigation) {
    const stagingOnly = process.env.NEXT_PUBLIC_STARTIME_STAGING_ONLY === "1";
    return <>{navigation.map((item) => {
      const children = stagingOnly ? [] : item.children || [];
      if (!children.length) return <Link key={`${item.href}-${item.label}`} href={item.href} {...externalAttributes(item.href, "header")} aria-current={pathname === resolveHref(item.href) ? "page" : undefined} onClick={onNavigate}>{item.label}</Link>;
      return <HoverDisclosure className="home2-home-menu" label={item.label} key={`${item.href}-${item.label}`}>
        {children.map((child) => <Link key={`${child.href}-${child.label}`} href={child.href} {...externalAttributes(child.href, "header")} aria-current={pathname === child.href ? "page" : undefined} onClick={onNavigate}>{child.label}</Link>)}
      </HoverDisclosure>;
    })}</>;
  }
  if (process.env.NEXT_PUBLIC_STARTIME_STAGING_ONLY === "1") {
    const slugs = ["", "discover", "vision", "investment", "careers", "insights", "contact"];
    return <>{slugs.map((slug, index) => {
      const href = `/${locale}${slug ? `/${slug}` : ""}`;
      return <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={onNavigate}>{labels[index]}</Link>;
    })}</>;
  }
  return (
    <>
      <HomeMenu locale={locale} label={labels[0]} dark={darkHome} onNavigate={onNavigate} />
      <DiscoverMenu locale={locale} label={labels[1]} onNavigate={onNavigate} />
      <VisionMenu locale={locale} label={labels[2]} onNavigate={onNavigate} />
      <PageVariantMenu locale={locale} label={labels[3]} slug="investment" onNavigate={onNavigate} />
      <PageVariantMenu locale={locale} label={labels[4]} slug="careers" onNavigate={onNavigate} />
      <PageVariantMenu locale={locale} label={labels[5]} slug="insights" onNavigate={onNavigate} />
      <PageVariantMenu locale={locale} label={labels[6]} slug="contact" onNavigate={onNavigate} />
    </>
  );
}
