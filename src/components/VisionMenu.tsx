"use client";

import Link from "./CmsLink";
import { usePathname } from "next/navigation";
import { HoverDisclosure } from "@/components/HoverDisclosure";
import type { Locale } from "@/content/home";

export function VisionMenu({ locale, label, onNavigate }: { locale: Locale; label: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const links = [
    { href: `/${locale}/vision`, label },
    { href: `/${locale}/vision1`, label: locale === "ar" ? "الرؤية 1" : "Vision 1" },
    { href: `/${locale}/vision2`, label: locale === "ar" ? "الرؤية 2" : "Vision 2" },
  ];

  return (
    <HoverDisclosure className="home2-home-menu vision-menu" label={label}>
      {links.map(({ href, label: itemLabel }) => (
        <Link key={href} href={href} className={pathname === href ? "is-active" : ""} aria-current={pathname === href ? "page" : undefined} onClick={onNavigate}>
          {itemLabel}
        </Link>
      ))}
    </HoverDisclosure>
  );
}
