export type LinkFollowStatus = "follow" | "nofollow";

const siteHosts = new Set(["startime.sa", "www.startime.sa"]);

export function isExternalWebLink(href: string, currentOrigin: string): boolean {
  if (!href || /^(?:#|mailto:|tel:|javascript:|data:)/i.test(href)) return false;
  try {
    const current = new URL(currentOrigin);
    const destination = new URL(href, current);
    if (!/^https?:$/.test(destination.protocol)) return false;
    if (!/^https?:\/\//i.test(href) && !href.startsWith("//")) return false;
    return destination.host !== current.host && !siteHosts.has(destination.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function linkSection(anchor: HTMLAnchorElement): { key: string; label: string } {
  const header = anchor.closest("header");
  if (header) return { key: "header", label: "Header" };
  const footer = anchor.closest("footer");
  if (footer) return { key: "footer", label: "Footer" };
  const section = anchor.closest("section");
  if (section) {
    const heading = section.querySelector("h1, h2, h3")?.textContent?.trim();
    const id = (section.id || section.getAttribute("data-section") || section.classList[0] || "section").replace(/[^\w-]/g, "-");
    return { key: `section:${id}`, label: heading || id.replace(/[-_]/g, " ") };
  }
  const article = anchor.closest("article");
  if (article) return { key: "article", label: "Article" };
  return { key: "page", label: "Page body" };
}

export function linkPlacement(pathname: string, section: string, href: string): string {
  return `${pathname.replace(/\/$/, "") || "/"}\u001f${section}\u001f${href}`;
}

export function externalLinkRel(status: LinkFollowStatus): string {
  return status === "follow" ? "noopener noreferrer" : "nofollow noopener noreferrer";
}

export function defaultExternalAttributes(href: string): { target?: "_blank"; rel?: string } {
  return isExternalWebLink(href, "https://startime.sa")
    ? { target: "_blank", rel: externalLinkRel("nofollow") }
    : {};
}
