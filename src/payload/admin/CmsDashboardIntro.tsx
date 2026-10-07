import Link from "next/link";
import React from "react";

const destinations = [
  { number: "01", title: "Website pages", description: "Edit connected page content and manage English and Arabic publishing independently.", href: "/content-admin/collections/pages", action: "Open pages" },
  { number: "02", title: "News & insights", description: "Manage articles, four responsive card images, and the uncropped feature image.", href: "/content-admin/collections/insights-posts", action: "Open stories" },
  { number: "03", title: "Media library", description: "Upload brand assets once and reuse them across English and Arabic pages.", href: "/content-admin/collections/media", action: "Open media" },
  { number: "04", title: "Header", description: "Edit the shared navigation, menu, logo, language controls, and colors.", href: "/content-admin/globals/header-settings", action: "Edit header" },
  { number: "05", title: "Footer", description: "Manage footer links, contact details, alliance logos, and colors for every page.", href: "/content-admin/globals/footer-settings", action: "Edit footer" },
  { number: "06", title: "Global SEO", description: "Set search, social sharing, indexing, and structured-data defaults.", href: "/content-admin/globals/global-seo", action: "Edit SEO" },
  { number: "07", title: "External links", description: "See outbound links by page and section; choose follow or nofollow without changing their destinations.", href: "/content-admin/external-links", action: "Review links" },
];

export function CmsDashboardIntro() {
  return (
    <section className="startime-cms-home" aria-labelledby="startime-cms-home-title">
      <div className="startime-cms-intro">
        <div className="startime-cms-intro__content">
          <p className="startime-cms-intro__eyebrow">Startime content studio <span aria-hidden="true">/</span> Editorial workspace</p>
          <h1 id="startime-cms-home-title">A clear home for every story.</h1>
          <p>Shape the website in English and Arabic, with deliberate control over what is published in each language.</p>
          <div className="startime-cms-intro__actions">
            <Link className="startime-cms-intro__primary" href="/content-admin/collections/pages">Edit website pages <span aria-hidden="true">↗</span></Link>
            <a className="startime-cms-intro__secondary" href="/en" target="_blank" rel="noopener noreferrer">View website <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="startime-cms-intro__monogram" aria-hidden="true">S<span>.</span></div>
      </div>

      <div className="startime-cms-section-heading">
        <div><p>YOUR WORKSPACE</p><h2>What would you like to update?</h2></div>
        <span>Choose an area to begin</span>
      </div>
      <div className="startime-cms-destinations">
        {destinations.map((item) => (
          <Link className="startime-cms-destination" href={item.href} key={item.number}>
            <span className="startime-cms-destination__number">{item.number}</span>
            <strong>{item.title}</strong>
            <span className="startime-cms-destination__description">{item.description}</span>
            <span className="startime-cms-destination__action">{item.action} <span aria-hidden="true">↗</span></span>
          </Link>
        ))}
      </div>

      <div className="startime-cms-guide">
        <div><span className="startime-cms-guide__mark" aria-hidden="true">i</span><div><strong>Publishing in two languages</strong><p>Choose English or Arabic at the top of a document before editing. Save a draft, check the page, then publish that language. The other language keeps its own copy, section order, and status.</p></div></div>
        <Link href="/content-admin/collections/pages">Go to pages <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
