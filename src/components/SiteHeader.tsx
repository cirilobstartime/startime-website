"use client";

import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Locale, SiteChrome } from "@/content/types";
import { CmsImage } from "./CmsImage";

type SiteHeaderProps = {
  chrome: SiteChrome;
  locale: Locale;
  routePath: string;
};

export function SiteHeader({ chrome, locale, routePath }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const otherLocale = locale === "en" ? "ar" : "en";
  const homeHref = locale === "ar" ? "/ar" : "/";
  const localeHref = locale === "en" ? `/ar${routePath}` : routePath || "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}
    >
      <Link
        aria-label={
          locale === "ar" ? "الصفحة الرئيسية لستارتايم" : "Startime home"
        }
        className="site-header__logo"
        href={homeHref}
      >
        <CmsImage
          alt="Startime"
          media={chrome.headerLogo || "/assets/brand/startime-white.svg"}
          priority
          sizes="180px"
        />
      </Link>

      <nav
        aria-label={locale === "ar" ? "التنقل الرئيسي" : "Primary navigation"}
        className="site-header__nav"
      >
        {chrome.navigation.map((item) => (
          <Link href={item.href} key={`${item.href}-${item.label}`}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="site-header__actions">
        <a
          aria-label={
            locale === "en" ? "Switch to Arabic" : "Switch to English"
          }
          className="locale-switch"
          href={localeHref}
        >
          {otherLocale.toUpperCase()}
        </a>
        <Link className="header-cta" href={chrome.headerCtaHref}>
          {chrome.headerCtaLabel}
          <ArrowUpRight aria-hidden weight="bold" />
        </Link>
        <button
          aria-expanded={menuOpen}
          aria-label={
            locale === "ar"
              ? menuOpen
                ? "إغلاق القائمة"
                : "فتح القائمة"
              : menuOpen
                ? "Close menu"
                : "Open menu"
          }
          className="mobile-menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? <X weight="bold" /> : <List weight="bold" />}
        </button>
      </div>

      {menuOpen
        ? createPortal(
            <div
              aria-modal="true"
              className="mobile-menu mobile-menu--open"
              role="dialog"
            >
              <button
                aria-label={locale === "ar" ? "إغلاق القائمة" : "Close menu"}
                className="mobile-menu__close"
                onClick={() => setMenuOpen(false)}
                ref={closeButtonRef}
                type="button"
              >
                <X aria-hidden weight="bold" />
              </button>
              <nav
                aria-label={locale === "ar" ? "تنقل الجوال" : "Mobile navigation"}
              >
                {chrome.navigation.map((item) => (
                  <Link
                    href={item.href}
                    key={`${item.href}-${item.label}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                    <ArrowUpRight aria-hidden />
                  </Link>
                ))}
                <Link
                  href={chrome.headerCtaHref}
                  onClick={() => setMenuOpen(false)}
                >
                  {chrome.headerCtaLabel}
                  <ArrowUpRight aria-hidden />
                </Link>
              </nav>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
