"use client";

import Link from "./CmsLink";
import { usePathname } from "next/navigation";
import { HoverDisclosure } from "@/components/HoverDisclosure";
import type { Locale } from "@/content/home";

export function PageVariantMenu({
  locale,
  label,
  slug,
  onNavigate,
}: {
  locale: Locale;
  label: string;
  slug: "investment" | "careers" | "insights" | "contact";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const links = [
    { href: `/${locale}/${slug}`, label },
    { href: `/${locale}/${slug}1`, label: `${label} 1` },
    ...(slug === "investment" ? [{ href: `/${locale}/${slug}2`, label: `${label} 2` }] : []),
  ];

  return (
    <HoverDisclosure className={`home2-home-menu ${slug}-menu`} label={label}>
      {links.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active ? "is-active" : ""}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        );
      })}
    </HoverDisclosure>
  );
}
