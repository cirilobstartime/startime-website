"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { externalLinkRel, isExternalWebLink, linkPlacement, linkSection, type LinkFollowStatus } from "@/lib/externalLinks";

const ExternalLinkContext = createContext<{ path: string; rules: Record<string, LinkFollowStatus> }>({ path: "/", rules: {} });

export function useExternalLinkAttributes() {
  const { path, rules } = useContext(ExternalLinkContext);
  return (href: string, section: string): { target?: "_blank"; rel?: string } =>
    isExternalWebLink(href, "https://startime.sa")
      ? { target: "_blank", rel: externalLinkRel(rules[linkPlacement(path, section, href)] || "nofollow") }
      : {};
}

export function ExternalLinkPolicy({ rules, children }: { rules: Record<string, LinkFollowStatus>; children: ReactNode }) {
  const pathname = usePathname();
  const [currentRules, setCurrentRules] = useState(rules);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/external-link-rules?pagePath=${encodeURIComponent(pathname)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((result: { rules: Record<string, LinkFollowStatus> }) => setCurrentRules(result.rules))
      .catch(() => { /* Server-rendered rules and nofollow default remain in effect. */ });
    return () => controller.abort();
  }, [pathname]);
  useEffect(() => {
    const applyAnchor = (anchor: HTMLAnchorElement) => {
      const href = anchor.getAttribute("href") || "";
      if (!isExternalWebLink(href, window.location.origin)) return;
      const placement = linkPlacement(window.location.pathname, linkSection(anchor).key, href);
      anchor.target = "_blank";
      anchor.rel = externalLinkRel(currentRules[placement] || "nofollow");
    };
    const applyAll = () => document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(applyAnchor);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "attributes" && record.target instanceof HTMLAnchorElement) applyAnchor(record.target);
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node instanceof HTMLAnchorElement) applyAnchor(node);
          node.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(applyAnchor);
        }
      }
    });
    applyAll();
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
    const onHistory = () => {
      requestAnimationFrame(applyAll);
    };
    window.addEventListener("popstate", onHistory);
    return () => {
      observer.disconnect();
      window.removeEventListener("popstate", onHistory);
    };
  }, [currentRules, pathname]);
  return <ExternalLinkContext.Provider value={{ path: pathname, rules: currentRules }}>{children}</ExternalLinkContext.Provider>;
}
