"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { NewSiteFooter, NewSiteHeader } from "@/content/newSiteChrome";
import { resolvePageHref, type PageRoutes } from "@/lib/pageRoutes";

type ChromeValue = { header: NewSiteHeader; footer: NewSiteFooter; routes: PageRoutes };
const ChromeContext = createContext<ChromeValue | null>(null);

export function NewSiteChromeProvider({ value, children }: { value: ChromeValue; children: ReactNode }) {
  return <ChromeContext.Provider value={value}>{children}</ChromeContext.Provider>;
}

export function usePageHref() {
  const value = useContext(ChromeContext);
  return (href: string) => value ? resolvePageHref(href, value.routes) : href;
}

export function useNewSiteChromeOptional() {
  return useContext(ChromeContext);
}

export function useNewSiteChrome() {
  const value = useContext(ChromeContext);
  if (!value) throw new Error("NewSiteChromeProvider is missing from the locale layout.");
  return value;
}
