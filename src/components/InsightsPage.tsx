"use client";

import { NewSiteHeader } from "@/components/NewSiteHeader";
import { NewSiteFooter } from "@/components/NewSiteFooter";


import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Buildings } from "@phosphor-icons/react/Buildings";
import { ChartLineUp } from "@phosphor-icons/react/ChartLineUp";
import { Cpu } from "@phosphor-icons/react/Cpu";
import { Factory } from "@phosphor-icons/react/Factory";
import { Heartbeat } from "@phosphor-icons/react/Heartbeat";
import { Leaf } from "@phosphor-icons/react/Leaf";
import { Mountains } from "@phosphor-icons/react/Mountains";
import { ShieldCheck } from "@phosphor-icons/react/ShieldCheck";
import { Storefront } from "@phosphor-icons/react/Storefront";
import { Target } from "@phosphor-icons/react/Target";
import { PostArchive } from "@/components/PostArchive";
import { type Locale } from "@/content/home";
import type { InsightPost } from "@/content/insightPosts";
import { insightsContent } from "@/content/insights";
import { ArtDirectedImage, ArtDirectedVideo } from "@/components/ArtDirectedImage";
import { insightsSectionKeys, type EditorialPageSettings, type EditorialSectionKey } from "@/content/editorialPageCms";
import { homepageItemStyle, homepageVisualStyle } from "@/content/homepageVisual";


const areaIcons = [ShieldCheck, Target, ChartLineUp, Cpu, Leaf, Heartbeat, Storefront, Buildings, Mountains, Factory];
const namedAreaIcons = { shield: ShieldCheck, target: Target, growth: ChartLineUp, technology: Cpu, leaf: Leaf, health: Heartbeat, commerce: Storefront, buildings: Buildings, resources: Mountains, industry: Factory };
const CarouselArrow = () => <span className="carousel-arrow-shape" aria-hidden="true" />;
export function InsightsPage({ locale, square = false, posts, cmsContent, cmsSettings }: { locale: Locale; route?: "insights" | "insights1"; square?: boolean; posts?: InsightPost[]; cmsContent?: (typeof insightsContent)["en"]; cmsSettings?: EditorialPageSettings }) {
  const c = cmsContent || insightsContent[locale];
  const rtl = locale === "ar";
  const [activeArea, setActiveArea] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const areaTrackRef = useRef<HTMLDivElement>(null);
  const areaCardsRef = useRef<(HTMLElement | null)[]>([]);
  const section = (key: EditorialSectionKey) => cmsSettings?.sections[key];
  const element = (key: EditorialSectionKey, name: "eyebrow" | "heading" | "body" | "media" | "items" | "pattern" | "cta") => section(key)?.elementVisibility?.[name] !== false;
  const orderedKeys = [...(cmsSettings?.order || []), ...insightsSectionKeys].filter((key, index, list) => list.indexOf(key) === index);
  const sectionOrder = (key: EditorialSectionKey) => orderedKeys.indexOf(key) + 1;
  const sectionStyle = (key: EditorialSectionKey) => ({ ...homepageVisualStyle(section(key)?.visual), order: sectionOrder(key), display: section(key)?.visible === false ? "none" : undefined });
  const backdrop = (key: EditorialSectionKey) => <>{section(key)?.backgroundImages && <ArtDirectedImage className="editorial-section-background" fallback="" images={section(key)?.backgroundImages} alt="" />}<ArtDirectedVideo className="editorial-section-video" videos={section(key)?.backgroundVideos} /></>;

  const selectArea = (index: number) => {
    setActiveArea(index);
    const track = areaTrackRef.current;
    const card = areaCardsRef.current[index];
    if (!track || !card) return;
    const trackBounds = track.getBoundingClientRect();
    const cardBounds = card.getBoundingClientRect();
    const distance = rtl ? cardBounds.right - trackBounds.right : cardBounds.left - trackBounds.left;
    track.scrollBy({ left: distance, behavior: "smooth" });
  };

  const syncAreaFromScroll = () => {
    const track = areaTrackRef.current;
    if (!track) return;
    const trackEdge = rtl ? track.getBoundingClientRect().right : track.getBoundingClientRect().left;
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    areaCardsRef.current.forEach((card, index) => {
      if (!card) return;
      const bounds = card.getBoundingClientRect();
      const edge = rtl ? bounds.right : bounds.left;
      const distance = Math.abs(edge - trackEdge);
      if (distance < nearestDistance) {
        nearest = index;
        nearestDistance = distance;
      }
    });
    const atEnd = Math.abs(track.scrollLeft) >= track.scrollWidth - track.clientWidth - 2;
    setActiveArea(atEnd ? c.areas.items.length - 1 : nearest);
  };

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

  return (
    <main className={`insights-page image-hero-page cms-editorial-page ${square ? "sharp-variation" : ""} ${rtl ? "rtl" : "ltr"}`}>
      <NewSiteHeader locale={locale} scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section className="insights-hero" ref={heroRef} aria-labelledby="insights-heading" id={section("hero")?.anchorID} style={sectionStyle("hero")}>
        {element("hero", "media") && <ArtDirectedImage className="insights-hero-image" fallback={section("hero")?.image || "/assets/editorial/startime-insights-hero-v1-optimized.webp"} images={section("hero")?.images} alt="" loading="eager" />}
        {backdrop("hero")}
        <div className="insights-hero-shade" aria-hidden="true" />
        <div className="insights-hero-copy">
          {element("hero", "eyebrow") && <p className="insights-label">{c.hero.label}</p>}
          {element("hero", "heading") && <h1 id="insights-heading">{c.hero.title}<span>{c.hero.continuation}</span></h1>}
          {element("hero", "body") && <p className="insights-hero-body">{c.hero.body}</p>}
        </div>
        {section("hero")?.showScrollCue !== false && <span className="contact-scroll-cue" aria-hidden="true" />}
      </section>

      <section className="insights-intro" aria-label={c.hero.label} id={section("introduction")?.anchorID} style={sectionStyle("introduction")}>
        {backdrop("introduction")}
        {element("introduction", "body") && <div className="insights-intro-copy insights-reveal"><p>{c.introduction}</p></div>}
        {element("introduction", "media") && <div className={`insights-intro-media insights-reveal${square ? " insights-intro-media-responsive" : ""}`}>
          {section("introduction")?.image || section("introduction")?.images ? <ArtDirectedImage fallback={section("introduction")?.image || "/assets/editorial/insights-intro-laptop.webp"} images={section("introduction")?.images} alt="" style={{ objectFit: "contain" }} /> : square ? <picture>
            <source media="(max-width: 640px)" srcSet="/assets/editorial/insights-intro-mobile.webp" width={701} height={721} />
            <Image src="/assets/editorial/insights-intro-laptop.webp" alt="" width={863} height={581} sizes="(max-width: 900px) 100vw, 46vw" />
          </picture> : <Image src="/assets/editorial/home5-heritage-doorway.webp" alt="" fill sizes="(max-width: 900px) 100vw, 46vw" />}
        </div>}
      </section>

      <PostArchive locale={locale} type="article" label={c.archive.label} title={c.archive.title} allPosts={posts} cmsSection={section("archive")} sectionOrder={sectionOrder("archive")} />

      <section className="insights-areas" id={section("areas")?.anchorID || "insight-areas"} style={sectionStyle("areas")}>
        {backdrop("areas")}
        <div className="insights-section-heading">{element("areas", "eyebrow") && <p className="insights-label">{c.areas.label}</p>}{element("areas", "heading") && <h2>{c.areas.title}</h2>}</div>
        {element("areas", "items") &&
        <div className="insights-area-carousel">
          <div className="insights-area-cards" aria-label={c.areas.title} ref={areaTrackRef} onScroll={syncAreaFromScroll}>
            {c.areas.items.map((area, index) => {
              if (section("areas")?.itemVisibility?.[index] === false) return null;
              const AreaIcon = namedAreaIcons[area.icon as keyof typeof namedAreaIcons] || areaIcons[index % areaIcons.length];
              return <article
                className="insights-area-card"
                key={area.title}
                style={homepageItemStyle(area.itemVisual)}
                ref={(element) => { areaCardsRef.current[index] = element; }}
              >
                <span className="insights-area-card-icon" aria-hidden="true"><AreaIcon /></span>
                <h3>{area.title}</h3>
                <p>{area.body}</p>
              </article>;
            })}
          </div>
          <div className="insights-area-controls">
            <nav className="carousel-control-pair" aria-label={c.areas.label}>
              <button className="carousel-arrow carousel-arrow-prev" type="button" disabled={activeArea === 0} onClick={() => selectArea(Math.max(0, activeArea - 1))} aria-label={activeArea > 0 ? c.areas.items[activeArea - 1].title : undefined}><CarouselArrow /></button>
              <button className="carousel-arrow carousel-arrow-next" type="button" disabled={activeArea === c.areas.items.length - 1} onClick={() => selectArea(Math.min(c.areas.items.length - 1, activeArea + 1))} aria-label={activeArea < c.areas.items.length - 1 ? c.areas.items[activeArea + 1].title : undefined}><CarouselArrow /></button>
            </nav>
          </div>
        </div>}
      </section>

      <section className="insights-ambition" id={section("ambition")?.anchorID} style={sectionStyle("ambition")}>
        {element("ambition", "pattern") && <ArtDirectedImage fallback={section("ambition")?.pattern || "/assets/brand/startime-pattern.svg"} images={section("ambition")?.patternImages} className="insights-ambition-pattern" alt="" />}
        {backdrop("ambition")}
        <div className="insights-section-heading insights-reveal">{element("ambition", "eyebrow") && <p className="insights-label">{c.ambition.label}</p>}{element("ambition", "heading") && <h2>{c.ambition.title}</h2>}</div>
        {element("ambition", "items") && <div className="insights-metrics">
          {c.ambition.items.map((item, index) => section("ambition")?.itemVisibility?.[index] === false ? null : <div className="insights-metric insights-reveal" key={item.label} style={homepageItemStyle(item.itemVisual)}><strong>{item.value}</strong><h3>{item.label}</h3><p>{item.body}</p></div>)}
        </div>}
      </section>

      <section className="insights-principles" style={{ order: Math.min(sectionOrder("credibility"), sectionOrder("property")) }}>
        <article className="insights-principle insights-reveal" id={section("credibility")?.anchorID} style={sectionStyle("credibility")}>
          {backdrop("credibility")}
          <div>{element("credibility", "eyebrow") && <p className="insights-label">{c.credibility.label}</p>}{element("credibility", "heading") && <h2>{c.credibility.title}</h2>}</div>
          {element("credibility", "body") && <div className="insights-principle-copy">{c.credibility.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>}
        </article>
        <article className="insights-principle insights-reveal" id={section("property")?.anchorID} style={sectionStyle("property")}>
          {backdrop("property")}
          <div>{element("property", "eyebrow") && <p className="insights-label">{c.property.label}</p>}{element("property", "heading") && <h2>{c.property.title}</h2>}</div>
          {element("property", "body") && <div className="insights-principle-copy"><p>{c.property.body}</p></div>}
        </article>
      </section>

      <section className="insights-contribute" id={section("contribution")?.anchorID} style={sectionStyle("contribution")}>
        {backdrop("contribution")}
        <div className="insights-contribute-copy insights-reveal">{element("contribution", "eyebrow") && <p className="insights-label">{c.contribution.label}</p>}{element("contribution", "heading") && <h2>{c.contribution.title}</h2>}{element("contribution", "body") && <p>{c.contribution.body}</p>}</div>
        {element("contribution", "cta") && <form className="insights-contribute-form insights-reveal" action={`mailto:${section("contribution")?.recipientEmail || "info@startime.sa"}`} method="post" encType="text/plain">
          {c.contribution.fields.map((field, index) => (
            <label className={index >= 6 ? "wide" : ""} key={field}>
              <span>{field}</span>
              {index === 7 ? <input name="attachment" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" /> : <input name={field} type={index === 4 ? "tel" : index === 5 ? "email" : "text"} required={[0, 1, 2, 5].includes(index)} />}
            </label>
          ))}
          <button type="submit">{c.contribution.submit}<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
        </form>}
      </section>

      <NewSiteFooter locale={locale} />
    </main>
  );
}
