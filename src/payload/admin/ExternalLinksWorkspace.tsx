"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { externalLinkRel, isExternalWebLink, linkPlacement, linkSection, type LinkFollowStatus } from "@/lib/externalLinks";

type InventoryLink = { placement: string; pagePath: string; pageTitle: string; section: string; sectionLabel: string; href: string; label: string; host: string };
type Filter = "all" | LinkFollowStatus;

export function ExternalLinksWorkspace({ rules: initialRules }: { rules: Record<string, LinkFollowStatus> }) {
  const [links, setLinks] = useState<InventoryLink[]>([]);
  const [rules, setRules] = useState(initialRules);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState("");
  const [scannedPages, setScannedPages] = useState(0);

  async function scan() {
    setScanning(true);
    setError("");
    const mainPages = ["", "discover", "vision", "investment", "careers", "insights", "latest-news", "contact", "maintenance", "coming-soon"];
    const queue = ["/", "/ar", ...mainPages.flatMap((slug) => slug ? [`/${slug}`, `/ar/${slug}`] : [])];
    const visited = new Set<string>();
    const found = new Map<string, InventoryLink>();
    try {
      const sitemap = await fetch("/sitemap.xml").catch(() => null);
      if (sitemap?.ok) {
        const xml = new DOMParser().parseFromString(await sitemap.text(), "application/xml");
        for (const location of xml.querySelectorAll("loc")) {
          try {
            const url = new URL(location.textContent || "");
            if ((url.origin === window.location.origin || ["startime.sa", "www.startime.sa"].includes(url.hostname)) && !queue.includes(url.pathname)) queue.push(url.pathname);
          } catch { /* Ignore malformed sitemap entries. */ }
        }
      }
      while (queue.length && visited.size < 500) {
        const path = queue.shift()!;
        if (visited.has(path)) continue;
        visited.add(path);
        const response = await fetch(path, { credentials: "same-origin" });
        if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) continue;
        const document = new DOMParser().parseFromString(await response.text(), "text/html");
        const arabic = path === "/ar" || path.startsWith("/ar/");
        const cleanPath = path.replace(/^\/ar(?=\/|$)/, "") || "/";
        const routeName = cleanPath === "/" ? "Homepage" : cleanPath.startsWith("/insights/")
          ? document.querySelector("h1")?.textContent?.trim() || "Insight article"
          : cleanPath.split("/").filter(Boolean).map((part) => part.replace(/-/g, " ")).join(" / ");
        const pageTitle = `${routeName} (${arabic ? "AR" : "EN"})`;
        for (const anchor of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
          const href = anchor.getAttribute("href") || "";
          if (isExternalWebLink(href, window.location.origin)) {
            const section = linkSection(anchor);
            const placement = linkPlacement(path, section.key, href);
            if (!found.has(placement)) found.set(placement, {
              placement, pagePath: path, pageTitle, section: section.key, sectionLabel: section.label,
              href, label: anchor.textContent?.trim().replace(/\s+/g, " ").slice(0, 120) || anchor.getAttribute("aria-label") || "Image / icon link",
              host: new URL(href, window.location.origin).hostname,
            });
          } else if (!/^(?:#|mailto:|tel:|javascript:|data:)/i.test(href)) {
            const target = new URL(href, window.location.origin);
            if (target.origin !== window.location.origin) continue;
            const next = target.pathname.replace(/^\/en(?=\/|$)/, "") || "/";
            if (!visited.has(next) && !queue.includes(next) && !/^\/(?:api|content-admin|assets|uploads|_next)(?:\/|$)/.test(next) && !/\.[\w]+$/.test(next)) queue.push(next);
          }
        }
        if (/^\/(?:ar\/)?insights\/[^/]+$/.test(path) && document.querySelector(".insight-detail-page")) {
          const title = document.querySelector(".post-detail-intro h1")?.textContent?.trim() || routeName;
          const sharePageURL = `${window.location.origin}${path}`;
          const shareDestinations = [
            { label: "Facebook share", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharePageURL)}` },
            { label: "X share", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(sharePageURL)}&text=${encodeURIComponent(title)}` },
            { label: "LinkedIn share", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharePageURL)}` },
            { label: "WhatsApp share", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${sharePageURL}`)}` },
          ];
          for (const destination of shareDestinations) {
            const placement = linkPlacement(path, "page", destination.href);
            found.set(placement, { placement, pagePath: path, pageTitle, section: "page", sectionLabel: "Share actions", href: destination.href, label: destination.label, host: new URL(destination.href).hostname });
          }
        }
        setScannedPages(visited.size);
      }
      setLinks([...found.values()].sort((a, b) => a.pagePath.localeCompare(b.pagePath) || a.sectionLabel.localeCompare(b.sectionLabel) || a.host.localeCompare(b.host)));
      if (queue.length) setError("The inventory reached its 500-page safety limit. Narrow the website scope before relying on it as a complete audit.");
    } catch {
      setError("The website scan could not finish. Refresh the inventory and try again.");
    } finally {
      setScanning(false);
    }
  }

  useEffect(() => { const timer = window.setTimeout(() => void scan(), 0); return () => window.clearTimeout(timer); }, []);

  const visible = useMemo(() => links.filter((link) => {
    const status = rules[link.placement] || "nofollow";
    const matchesStatus = filter === "all" || filter === status;
    const term = query.toLowerCase().trim();
    return matchesStatus && (!term || `${link.href} ${link.pagePath} ${link.sectionLabel} ${link.label}`.toLowerCase().includes(term));
  }), [links, rules, filter, query]);
  const followed = links.filter((link) => rules[link.placement] === "follow").length;

  async function changeStatus(link: InventoryLink, status: LinkFollowStatus) {
    setSaving(link.placement);
    setError("");
    try {
      const response = await fetch("/api/external-link-rules", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
        body: JSON.stringify({ pagePath: link.pagePath, section: link.section, href: link.href, label: link.label, status }),
      });
      if (!response.ok) throw new Error();
      setRules((current) => ({ ...current, [link.placement]: status }));
    } catch {
      setError("This change was not saved. Please retry; the previous status remains active.");
    } finally {
      setSaving("");
    }
  }

  return <main className="external-links-workspace">
    <div className="external-links-shell">
      <nav className="external-links-breadcrumb"><Link href="/content-admin">Content Studio</Link><span aria-hidden="true">/</span><span>External links</span></nav>
      <header className="external-links-hero">
        <div><p className="external-links-eyebrow">MARKETING &amp; SEO / LINK GOVERNANCE</p><h1>Every outbound link,<br /><em>in one clear view.</em></h1><p>Review published English and Arabic pages. All external websites—including Startime subdomains—open in a new tab and default to nofollow. Change only the follow setting here; edit the destination in its original page or section.</p></div>
        <div className="external-links-hero-mark" aria-hidden="true">↗</div>
      </header>
      <section className="external-links-stats" aria-label="Inventory summary">
        <div><span>EXTERNAL PLACEMENTS</span><strong>{links.length}</strong><small>Across the public website</small></div>
        <div><span>FOLLOW</span><strong>{followed}</strong><small>Explicitly allowed by an editor</small></div>
        <div><span>NOFOLLOW</span><strong>{links.length - followed}</strong><small>Safe default</small></div>
        <div><span>PAGES SCANNED</span><strong>{scannedPages}</strong><small>{scanning ? "Scanning now…" : "English and Arabic"}</small></div>
      </section>
      <section className="external-links-list" aria-label="External link inventory">
        <div className="external-links-toolbar"><div><h2>Link inventory</h2><p>{scanning ? "Discovering website links…" : `${visible.length} links shown`}</p></div><button type="button" onClick={() => void scan()} disabled={scanning}>↻ <span>{scanning ? "Scanning…" : "Refresh inventory"}</span></button></div>
        <div className="external-links-controls"><label><span className="sr-only">Search links</span><input type="search" placeholder="Search URL, page, or section" value={query} onChange={(event) => setQuery(event.target.value)} /></label><div className="external-links-filter" aria-label="Filter by follow status">{(["all", "nofollow", "follow"] as Filter[]).map((item) => <button type="button" key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item === "all" ? "All links" : item === "nofollow" ? "Nofollow" : "Follow"}</button>)}</div></div>
        {error && <p className="external-links-error" role="alert">{error}</p>}
        {!scanning && !visible.length && <div className="external-links-empty">No external links match this view.</div>}
        <div className="external-links-rows">{visible.map((link) => {
          const status = rules[link.placement] || "nofollow";
          return <article className="external-links-row" key={link.placement}>
            <div className="external-links-row-main"><div className="external-links-favicon" aria-hidden="true">↗</div><div><span className="external-links-host">{link.host}</span><a href={link.href} target="_blank" rel={externalLinkRel(status)} title={link.href}>{link.href}</a><p>{link.label}</p></div></div>
            <div className="external-links-location"><span>LOCATION</span><strong>{link.pageTitle}</strong><small>{link.pagePath} · {link.sectionLabel}</small></div>
            <div className="external-links-status"><span>SEARCH FOLLOW</span><div className="external-links-switch" role="group" aria-label={`Follow setting for ${link.href} on ${link.pagePath}`}><button type="button" className={status === "nofollow" ? "active" : ""} disabled={saving === link.placement} onClick={() => void changeStatus(link, "nofollow")}>Nofollow</button><button type="button" className={status === "follow" ? "active" : ""} disabled={saving === link.placement} onClick={() => void changeStatus(link, "follow")}>Follow</button></div></div>
          </article>;
        })}</div>
      </section>
      <p className="external-links-note">External-link status is scoped to this page and section. Mail and phone links are excluded. Publishing a new link? Refresh this inventory after publishing to review it.</p>
    </div>
  </main>;
}
