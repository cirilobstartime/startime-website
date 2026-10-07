"use client";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { canonicalizePublicHref } from "@/lib/publicPath";
import type { PageRoutes } from "@/lib/pageRoutes";

export function PageDesignScope({
  styles,
  routes,
  children,
}: {
  styles: Record<string, CSSProperties>;
  routes: PageRoutes;
  children: ReactNode;
}) {
  const path = canonicalizePublicHref(usePathname());
  const locale = /^\/ar(?:\/|$)/.test(path) ? "ar" : "en";
  const segments = path
    .replace(/^\/ar(?=\/|$)/, "")
    .split("/")
    .filter(Boolean);
  let slug = segments[0] || "home";
  try {
    slug = decodeURIComponent(slug);
  } catch {
    /* Unknown paths receive global defaults only. */
  }
  const page =
    segments.length <= 1 &&
    routes[locale].find(
      (entry) => entry.visible && (entry.slug === slug || entry.key === slug),
    );
  return (
    <div
      className="cms-page-design"
      style={page ? styles[`${locale}:${page.id}`] : undefined}
    >
      {children}
    </div>
  );
}
