import Link from "./CmsLink";
import { usePathname } from "next/navigation";
import { HoverDisclosure } from "@/components/HoverDisclosure";

export function DiscoverMenu({ locale, label, onNavigate }: { locale: "en" | "ar"; label: string; onNavigate?: () => void }) {
  const rtl = locale === "ar";
  const pathname = usePathname();
  const links = [
    { href: `/${locale}/discover`, label },
    { href: `/${locale}/discover1`, label: rtl ? "اكتشف 1" : "Discover 1" },
    { href: `/${locale}/discover2`, label: rtl ? "اكتشف 2" : "Discover 2" },
    { href: `/${locale}/discover3`, label: rtl ? "اكتشف 3" : "Discover 3" },
    { href: `/${locale}/discover4`, label: rtl ? "اكتشف 4" : "Discover 4" },
    { href: `/${locale}/discover5`, label: rtl ? "اكتشف 5" : "Discover 5" },
  ];

  return (
    <HoverDisclosure className="home2-home-menu discover-menu" label={label}>
        {links.map((item) => {
          const active = pathname === item.href;
          return <Link className={active ? "is-active" : ""} href={item.href} aria-current={active ? "page" : undefined} onClick={onNavigate} key={item.href}>{item.label}</Link>;
        })}
    </HoverDisclosure>
  );
}
