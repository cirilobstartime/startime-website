"use client";

import Image from "next/image";
import Link from "./CmsLink";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import type { Locale } from "@/content/home";
import { useNewSiteChrome } from "./NewSiteChromeProvider";
import { NewSiteSocialLinks } from "./NewSiteSocialLinks";
import { SiteNavigationMenus } from "./SiteNavigationMenus";
import { alternatePageHref } from "@/lib/pageRoutes";
import { useExternalLinkAttributes } from "./ExternalLinkPolicy";

export function NewSiteHeader({ locale, scrolled, menuOpen, setMenuOpen }: {
  locale: Locale; scrolled: boolean; menuOpen: boolean; setMenuOpen: (value: boolean | ((current: boolean) => boolean)) => void;
}) {
  const { header, routes } = useNewSiteChrome();
  const externalAttributes = useExternalLinkAttributes();
  const pathname = usePathname();
  const alternateLocalePath = alternatePageHref(pathname, routes);
  const rtl = locale === "ar";
  const style = {
    "--cms-header-background": header.backgroundColor,
    "--cms-header-text": header.textColor,
    "--cms-menu-background": header.menuBackgroundColor,
    "--cms-menu-text": header.menuTextColor,
    "--cms-header-accent": header.accentColor,
  } as CSSProperties;
  const menuStyle = menuOpen && header.menuPattern ? {
    backgroundImage: `linear-gradient(90deg, color-mix(in srgb, var(--cms-menu-background, #2e2449) 90%, transparent), color-mix(in srgb, var(--cms-menu-background, #2e2449) 72%, transparent)), url(${JSON.stringify(header.menuPattern)})`,
  } : undefined;

  return <header className={`home2-header ${scrolled ? "is-scrolled" : ""} ${menuOpen ? "menu-active" : ""}`} style={style}>
    <Link className="home2-logo" href={header.homeHref} {...externalAttributes(header.homeHref, "header")} aria-label={header.logoAlt}>
      <Image src={header.logo} alt={header.logoAlt} width={460} height={183} loading="eager" sizes="142px" />
    </Link>
    <nav className={menuOpen ? "open" : ""} style={menuStyle} aria-label={rtl ? "التنقل الرئيسي" : "Primary navigation"}>
      <div className="nav-overlay-links">
        <SiteNavigationMenus locale={locale} labels={header.navigation.map((item) => item.label)} navigation={header.navigation} onNavigate={() => setMenuOpen(false)} />
      </div>
      <div className="nav-overlay-copy"><p>{header.menuDescription}</p></div>
      <div className="home2-mobile-nav-footer">
        <a href={`mailto:${header.menuEmail}`}>{header.menuEmail}</a>
        <div><NewSiteSocialLinks links={header.socialLinks} section="header" /></div>
      </div>
    </nav>
    <div className="home2-header-actions">
      <Link href={alternateLocalePath}>{rtl ? header.englishLabel : header.arabicLabel}</Link>
      <button type="button" aria-label={menuOpen ? header.closeMenuLabel : header.openMenuLabel} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /></button>
    </div>
  </header>;
}
