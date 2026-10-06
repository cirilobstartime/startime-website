"use client";

import Link from "./CmsLink";
import { usePathname } from "next/navigation";
import type { Locale } from "@/content/home";
import { HoverDisclosure } from "@/components/HoverDisclosure";

export function HomeMenu({ locale, label, dark = false, onNavigate }: { locale: Locale; label: string; dark?: boolean; onNavigate?: () => void }) {
  const rtl = locale === "ar";
  const pathname = usePathname();
  const links = [
    { href: `/${locale}`, label },
    { href: `/${locale}/home1`, label: rtl ? "الرئيسية 1" : "Home 1" },
    { href: `/${locale}/home2`, label: rtl ? "الرئيسية 2" : "Home 2" },
    { href: `/${locale}/home3`, label: rtl ? "الرئيسية 3" : "Home 3" },
    { href: `/${locale}/home4`, label: rtl ? "الرئيسية 4" : "Home 4" },
    { href: `/${locale}/home5`, label: rtl ? "الرئيسية 5" : "Home 5" },
    { href: `/${locale}/home6`, label: rtl ? "الرئيسية 6" : "Home 6" },
    { href: `/${locale}/animation`, label: rtl ? "التحريك" : "Animation" },
  ];

  return (
    <HoverDisclosure className={`home2-home-menu ${dark ? "on-dark" : ""}`} label={label}>
        {links.map((item) => {
          const active = pathname === item.href;
          return (
            <Link className={active ? "is-active" : ""} href={item.href} aria-current={active ? "page" : undefined} onClick={onNavigate} key={item.href}>
              {item.label}
            </Link>
          );
        })}
    </HoverDisclosure>
  );
}
