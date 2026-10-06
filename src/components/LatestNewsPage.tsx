"use client";

import { NewSiteHeader } from "@/components/NewSiteHeader";
import { NewSiteFooter } from "@/components/NewSiteFooter";


import { useEffect, useRef, useState } from "react";
import { PostArchive } from "@/components/PostArchive";
import { type Locale } from "@/content/home";
import type { InsightPost } from "@/content/insightPosts";
import { latestNewsContent } from "@/content/latestNews";
import { ArtDirectedImage, ArtDirectedVideo } from "@/components/ArtDirectedImage";
import type { EditorialPageSettings } from "@/content/editorialPageCms";
import { homepageVisualStyle } from "@/content/homepageVisual";


export function LatestNewsPage({ locale, posts, cmsContent, cmsSettings }: { locale: Locale; posts?: InsightPost[]; cmsContent?: (typeof latestNewsContent)["en"]; cmsSettings?: EditorialPageSettings }) {
  const content = cmsContent || latestNewsContent[locale];
  const copy = { ...content.hero, archiveLabel: content.archive.label, archiveTitle: content.archive.title };
  const rtl = locale === "ar";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const hero = cmsSettings?.sections.hero;
  const archive = cmsSettings?.sections.archive;
  const order = (key: "hero" | "archive") => [...(cmsSettings?.order || []), "hero", "archive"].filter((item, index, list) => list.indexOf(item) === index).indexOf(key) + 1;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll(".insights-reveal").forEach((element) => observer.observe(element));
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = heroRef.current;
      if (!hero) return;
      const bounds = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -bounds.top / Math.max(1, hero.offsetHeight)));
      hero.style.setProperty("--insights-hero-progress", String(progress));
      setScrolled((current) => {
        const next = bounds.bottom <= 70;
        return current === next ? current : next;
      });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [locale, rtl]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);


  return <main className={`insights-page latest-news-page image-hero-page sharp-variation cms-editorial-page ${rtl ? "rtl" : "ltr"}`}>
      <NewSiteHeader locale={locale} scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

    <section className="insights-hero latest-news-hero" ref={heroRef} aria-labelledby="latest-news-heading" id={hero?.anchorID} style={{ ...homepageVisualStyle(hero?.visual), order: order("hero"), display: hero?.visible === false ? "none" : undefined }}>
      {hero?.backgroundImages && <ArtDirectedImage className="editorial-section-background" fallback="" images={hero.backgroundImages} alt="" />}
      <ArtDirectedVideo className="editorial-section-video" videos={hero?.backgroundVideos} />
      {hero?.elementVisibility?.media !== false && <div className="latest-news-hero-media"><ArtDirectedImage fallback={hero?.image || "/assets/editorial/news-partnership.webp"} images={hero?.images} alt="" loading="eager" /></div>}
      <div className="insights-hero-copy">{hero?.elementVisibility?.eyebrow !== false && <p className="insights-label">{copy.label}</p>}{hero?.elementVisibility?.heading !== false && <h1 id="latest-news-heading">{copy.title}</h1>}{hero?.elementVisibility?.body !== false && <p className="insights-hero-body">{copy.body}</p>}</div>
      {hero?.showScrollCue !== false && <span className="contact-scroll-cue" aria-hidden="true" />}
    </section>

    <PostArchive locale={locale} type="news" label={copy.archiveLabel} title={copy.archiveTitle} allPosts={posts} cmsSection={archive} sectionOrder={order("archive")} />

      <NewSiteFooter locale={locale} />
  </main>;
}
