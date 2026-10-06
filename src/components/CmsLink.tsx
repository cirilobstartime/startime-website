"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePathname } from "next/navigation";
import { usePageHref, useNewSiteChromeOptional } from "./NewSiteChromeProvider";
import { canonicalizePublicHref } from "@/lib/publicPath";

/** Resolve main-page links at render time, keeping Next's prefetch/navigation in sync. */
export default function CmsLink(props: ComponentProps<typeof Link>) {
  const resolveHref = usePageHref();
  const href = typeof props.href === "string" ? resolveHref(props.href) : props.href;
  const chrome = useNewSiteChromeOptional();
  const pathname = usePathname();
  const internal = typeof href === "string" ? canonicalizePublicHref(href).split(/[?#]/)[0] : "";
  const locale = /^\/ar(?:\/|$)/.test(internal) ? "ar" : "en";
  let first = internal.replace(/^\/ar(?=\/|$)/, "").split("/")[1] || "";
  try { first = decodeURIComponent(first); } catch { /* Keep invalid paths unchanged. */ }
  const currentLocale = /^\/ar(?:\/|$)/.test(pathname) ? "ar" : "en";
  let currentSlug = canonicalizePublicHref(pathname).replace(/^\/ar(?=\/|$)/, "").split("/")[1] || "";
  try { currentSlug = decodeURIComponent(currentSlug); } catch { /* Keep invalid paths unchanged. */ }
  const renamed = internal.startsWith("/") && !internal.startsWith("//") && (
    chrome?.routes[locale].some((route) => route.slug === first && route.slug !== route.key)
    || chrome?.routes[currentLocale].some((route) => route.slug === currentSlug && route.slug !== route.key)
  );
  return <Link {...props} href={href} prefetch={renamed ? false : props.prefetch} onClick={(event) => {
    props.onClick?.(event);
    if (!renamed || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      || props.target === "_blank" || props.download || typeof href !== "string") return;
    // CMS aliases are runtime rewrites, not fixed client-router segments. A full
    // document navigation avoids stale RSC route trees after a published rename.
    event.preventDefault();
    if (props.replace) window.location.replace(href);
    else window.location.assign(href);
  }} />;
}
