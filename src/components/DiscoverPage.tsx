"use client";
import { SlideCounter } from "./SlideCounter";

import { NewSiteHeader } from "@/components/NewSiteHeader";
import { NewSiteFooter } from "@/components/NewSiteFooter";


import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { Paperclip } from "@phosphor-icons/react/Paperclip";
import { discoverContent } from "@/content/discover";
import { type Locale } from "@/content/home";
import { DiscoverKineticTimeline } from "@/components/DiscoverKineticTimeline";
import { ArtDirectedImage, ArtDirectedVideo } from "@/components/ArtDirectedImage";
import { slideImagesWithFallback } from "@/content/slideImageFallback";
import type { ViewportImages } from "@/components/ArtDirectedImage";
import type { DiscoverCmsSettings, DiscoverSectionKey, DiscoverSectionSettings } from "@/content/discoverCms";
import { homepageItemStyle, homepageVisualStyle } from "@/content/homepageVisual";
import type { CSSProperties } from "react";
import { submitPublicForm } from "@/lib/submitPublicForm";

const Arrow = () => <ArrowRight aria-hidden="true" />;
const CarouselArrow = () => <span className="carousel-arrow-shape" aria-hidden="true" />;


const timelineImages = [
  "/assets/editorial/startime-saudi-leadership-v2.webp",
  "/assets/editorial/news-partnership.webp",
  "/assets/editorial/startime-strategic-events-hero-v2.webp",
  "/assets/editorial/startime-triple-s-command-center.webp",
  "/assets/projects/industrial-security-v2.webp",
  "/assets/projects/smart-cities-v2.webp",
];

const governanceImages = [
  "/assets/editorial/startime-saudi-leadership-v2.webp",
  "/assets/editorial/startime-triple-s-command-center.webp",
  "/assets/editorial/startime-strategic-events-hero-v2.webp",
  "/assets/editorial/news-partnership.webp",
  "/assets/projects/smart-cities-v2.webp",
  "/assets/projects/industrial-security-v2.webp",
  "/assets/editorial/startime-team-ministry-environment-event.png",
  "/assets/projects/blue-economy-v2.webp",
];


function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}

function DiscoverImage({ images, fallback, className = "", alt = "", loading = "lazy" }: { images?: ViewportImages; fallback: string; className?: string; alt?: string; loading?: "lazy" | "eager" }) {
  return images ? <ArtDirectedImage images={images} fallback={fallback} className={className} alt={alt} loading={loading} />
    : <Image className={className} src={fallback} alt={alt} fill sizes="100vw" loading={loading} />;
}

function DiscoverBackdrop({ settings }: { settings?: DiscoverSectionSettings }) {
  if (!settings?.backgroundImages && !settings?.backgroundVideos) return null;
  return <div className="discover-cms-backdrop" aria-hidden="true">
    {settings.backgroundImages && <ArtDirectedImage images={settings.backgroundImages} fallback="" />}
    <ArtDirectedVideo videos={settings.backgroundVideos} />
    {settings.overlayOpacity !== undefined && <span className="discover-cms-backdrop-overlay" style={{ opacity: settings.overlayOpacity / 100 }} />}
  </div>;
}

function DiscoverPattern({ settings }: { settings?: DiscoverSectionSettings }) {
  if (!settings?.patternImages || settings.elementVisibility?.pattern === false) return null;
  return <div className="discover-cms-pattern" aria-hidden="true"><ArtDirectedImage images={settings.patternImages} fallback="/assets/brand/startime-pattern.svg" /></div>;
}

export function DiscoverPage({ locale, variant = "kinetic", square = false, cmsContent, cmsSettings }: { locale: Locale; variant?: "kinetic" | "new" | "redesign" | "editorial" | "legacy"; route?: "discover" | "discover1" | "discover2" | "discover3" | "discover4" | "discover5"; square?: boolean; cmsContent?: (typeof discoverContent)["en"]; cmsSettings?: DiscoverCmsSettings }) {
  const c = cmsContent || discoverContent[locale];
  const rtl = locale === "ar";
  const modernDesign = variant === "kinetic" || variant === "new";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [timeline, setTimeline] = useState(0);
  const [governance, setGovernance] = useState(0);
  const [bioOpen, setBioOpen] = useState(false);
  const [governanceSubmitting, setGovernanceSubmitting] = useState(false);
  const [governanceSent, setGovernanceSent] = useState(false);
  const [governanceError, setGovernanceError] = useState("");
  const heroRef = useRef<HTMLElement>(null);
  const ceoRef = useRef<HTMLElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const bioInteractedRef = useRef(false);
  const timelineRef = useRef<HTMLElement>(null);
  const timelineRailRef = useRef<HTMLDivElement>(null);
  const governanceRef = useRef<HTMLElement>(null);
  const governancePrinciples = c.governance.principles.map((item, index) => ({ ...item, sourceIndex: index, cms: cmsSettings?.governance?.principleItems?.[index] })).filter((item) => item.cms?.visible !== false);
  const activeGovernancePrinciples = governancePrinciples.length ? governancePrinciples : c.governance.principles.map((item, index) => ({ ...item, sourceIndex: index, cms: undefined }));
  const firstGovernancePrinciple = activeGovernancePrinciples[0];
  const firstGovernanceImages = firstGovernancePrinciple?.cms?.images || cmsSettings?.governance?.principleImages?.[firstGovernancePrinciple?.sourceIndex ?? 0]?.images || cmsSettings?.governance?.images;
  const firstGovernanceFallback = governanceImages[firstGovernancePrinciple?.sourceIndex ?? 0] || governanceImages[0];
  const activePrinciple = activeGovernancePrinciples[Math.min(governance, activeGovernancePrinciples.length - 1)];
  const order = cmsSettings?.order;
  const ordered = Boolean(order && order.some((key, index) => key !== (["hero", "introduction", "timeline", "vision", "ceo", "methodology", "governance", "form"] as DiscoverSectionKey[])[index]));
  const shown = (key: DiscoverSectionKey) => cmsSettings?.[key]?.visible !== false;
  const element = (key: DiscoverSectionKey, part: keyof NonNullable<DiscoverSectionSettings["elementVisibility"]>) => cmsSettings?.[key]?.elementVisibility?.[part] !== false;
  const sectionStyle = (key: DiscoverSectionKey): CSSProperties => ({ ...homepageVisualStyle(cmsSettings?.[key]?.visual), ...(ordered ? { order: (order?.indexOf(key) ?? 0) * 2 } : {}) });
  const sectionID = (key: DiscoverSectionKey, fallback?: string) => cmsSettings?.[key]?.anchorID || fallback;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { rootMargin: "0px 0px 10% 0px", threshold: 0.06 },
    );
    document.querySelectorAll(".reveal:not(.chronicle-entry)").forEach((element) => observer.observe(element));

    const chronicleObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.classList.toggle("is-visible", entry.isIntersecting)),
      { rootMargin: "-8% 0px -8% 0px", threshold: 0.12 },
    );
    if (variant === "new") {
      document.querySelectorAll(".chronicle-entry").forEach((element) => chronicleObserver.observe(element));
    }

    let frame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => {
      frame = 0;
      if (heroRef.current) {
        const heroBounds = heroRef.current.getBoundingClientRect();
        const heroTravel = Math.max(1, heroRef.current.offsetHeight - window.innerHeight);
        const heroProgress = reducedMotion ? 0 : Math.min(1, Math.max(0, -heroBounds.top / heroTravel));
        heroRef.current.style.setProperty("--discover-hero-progress", String(heroProgress));
        const heroTop = window.scrollY + heroBounds.top;
        const nextScrolled = modernDesign
          ? heroBounds.bottom <= 70
          : window.scrollY > heroTop + heroTravel - 24;
        setScrolled((current) => current === nextScrolled ? current : nextScrolled);
      }
      const staticLargeLayout = window.matchMedia("(min-width: 2000px) and (min-height: 1000px)").matches;
      if (!modernDesign && window.matchMedia("(min-width: 821px)").matches && !staticLargeLayout && timelineRef.current) {
        const bounds = timelineRef.current.getBoundingClientRect();
        const distance = Math.max(1, bounds.height - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -bounds.top / distance));
        setTimeline(Math.min(c.timeline.length - 1, Math.round(progress * (c.timeline.length - 1))));
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      chronicleObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [c.timeline.length, locale, rtl, variant, modernDesign]);

  useEffect(() => {
    if (!square || !modernDesign || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = governanceRef.current;
    if (!section) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (interval) clearInterval(interval);
      interval = entry.isIntersecting
        ? setInterval(() => setGovernance((current) => (current + 1) % activeGovernancePrinciples.length), 7000)
        : undefined;
    }, { threshold: 0.25 });
    observer.observe(section);
    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, [activeGovernancePrinciples.length, modernDesign, square]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (modernDesign || !window.matchMedia("(max-width: 820px)").matches) return;
    const rail = timelineRailRef.current;
    const active = rail?.querySelector<HTMLButtonElement>("button.active");
    if (!rail || !active) return;
    rail.scrollTo({ left: active.offsetLeft - (rail.clientWidth - active.clientWidth) / 2, behavior: "smooth" });
  }, [timeline, modernDesign]);

  useEffect(() => {
    if (!bioInteractedRef.current) return;
    const target = bioOpen ? bioRef.current : ceoRef.current?.querySelector(".ceo-portrait");
    window.requestAnimationFrame(() => target?.scrollIntoView({ behavior: "auto", block: "start" }));
  }, [bioOpen]);

  const selectTimeline = (index: number) => {
    setTimeline(index);
    const section = timelineRef.current;
    const staticLargeLayout = window.matchMedia("(min-width: 2000px) and (min-height: 1000px)").matches;
    if (!section || !window.matchMedia("(min-width: 821px)").matches || staticLargeLayout) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const distance = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (distance * index) / (c.timeline.length - 1), behavior: "smooth" });
  };

  const submitGovernance = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setGovernanceSubmitting(true);
    setGovernanceError("");
    try {
      await submitPublicForm({ form, formKey: "governance", locale, sectionID: sectionID("form", "governance-contact") || "governance-contact" });
      setGovernanceSent(true);
      form.reset();
    } catch (error) {
      setGovernanceError(error instanceof Error ? error.message : "Unable to submit the form.");
    } finally {
      setGovernanceSubmitting(false);
    }
  };

  const toggleBio = () => {
    bioInteractedRef.current = true;
    setBioOpen((open) => !open);
  };


  return (
    <main className={`discover-page image-hero-page discover-page-${variant} ${variant === "kinetic" ? "discover-page-new" : ""} ${modernDesign ? "discover-page-redesign" : ""} ${square ? "sharp-variation" : ""} ${rtl ? "rtl" : "ltr"} ${cmsSettings ? "discover-cms-enabled" : ""} ${ordered ? "discover-cms-reordered" : ""}`}>
      <NewSiteHeader locale={locale} scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {shown("hero") && <section className={`discover-hero-scroll ${modernDesign ? "discover-hero-static" : ""}`} ref={heroRef} aria-labelledby="discover-heading" id={sectionID("hero")} style={sectionStyle("hero")}>
        <div className="discover-hero">
          {element("hero", "media") && <DiscoverImage className="discover-hero-media" images={cmsSettings?.hero?.images} fallback={variant === "legacy" ? "/assets/editorial/startime-saudi-leadership-v2.webp" : variant === "editorial" ? "/assets/editorial/home4-najd-origin-v1.webp" : "/assets/editorial/discover-hero-generated-v1.webp"} loading="eager" />}
          <DiscoverBackdrop settings={cmsSettings?.hero} />
          <div className="discover-hero-shade" />
          {element("hero", "pattern") && <div className="discover-hero-pattern" aria-hidden="true">{cmsSettings?.hero?.patternImages && <ArtDirectedImage images={cmsSettings.hero.patternImages} fallback="/assets/brand/startime-pattern.svg" />}</div>}
          <div className="discover-hero-copy">
            {element("hero", "eyebrow") && <p>{c.hero.brand}</p>}
            {element("hero", "heading") && <h1 id="discover-heading">{c.hero.title}</h1>}
          </div>
          {cmsSettings?.hero?.showScrollCue !== false && <span className="contact-scroll-cue" aria-hidden="true" />}
        </div>
      </section>}

      {shown("introduction") && <section className={`discover-intro section-light ${cmsSettings?.introduction?.patternImages ? "cms-custom-pattern" : ""} ${element("introduction", "pattern") ? "" : "cms-hide-pattern"}`} id={sectionID("introduction")} style={sectionStyle("introduction")}>
        <DiscoverBackdrop settings={cmsSettings?.introduction} />
        <DiscoverPattern settings={cmsSettings?.introduction} />
        <div className="discover-intro-inner">
          <Reveal className="discover-intro-heading">
            {element("introduction", "eyebrow") && <p className="label">{c.introduction.label}</p>}
            {element("introduction", "heading") && <h2>{c.introduction.title}</h2>}
          </Reveal>
          {element("introduction", "body") && <Reveal className="discover-intro-body"><p className="discover-body">{c.introduction.body}</p></Reveal>}
        </div>
      </section>}

      {shown("timeline") && (variant === "kinetic" ? ordered
        ? <div className="discover-cms-timeline-order" style={sectionStyle("timeline")}><DiscoverKineticTimeline items={c.timeline} rtl={rtl} settings={cmsSettings?.timeline} /></div>
        : <DiscoverKineticTimeline items={c.timeline} rtl={rtl} settings={cmsSettings?.timeline} style={sectionStyle("timeline")} /> : variant === "new" ? (
        <section className="discover-chronicle section-dark" aria-label={rtl ? "الجدول الزمني" : "Startime timeline"}>
          <div className="discover-chronicle-shell">
            {c.timeline.map((item, index) => (
              <article className={`chronicle-entry reveal ${index % 2 ? "chronicle-entry-reverse" : ""}`} key={item.year} style={{ "--chronicle-index": index + 1 } as React.CSSProperties}>
                <div className="chronicle-slide">
                  <div className="chronicle-media">
                    <Image src={timelineImages[index]} alt="" fill sizes="100vw" loading={index < 2 ? "eager" : "lazy"} />
                    <span className="chronicle-media-shade" aria-hidden="true" />
                  </div>
                  <div className="chronicle-copy">
                    <strong className="chronicle-year">{item.year}</strong>
                    <h2>{item.title}</h2>
                    <p>{item.body}</p>
                  </div>
                  {index < c.timeline.length - 1 && <span className="chronicle-node" aria-hidden="true" />}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="discover-timeline section-dark" ref={timelineRef} aria-label={rtl ? "الجدول الزمني" : "Startime timeline"}>
          <div className="discover-timeline-stage">
            <div className="timeline-pattern" aria-hidden="true" />
            <div className="timeline-media" aria-hidden="true">
              {timelineImages.map((src, index) => <Image key={src} className={timeline === index ? "active" : ""} src={src} alt="" fill sizes="(max-width: 820px) 100vw, 58vw" loading={index === 0 ? "eager" : "lazy"} />)}
              <div className="timeline-shade" />
            </div>
            <div className="timeline-content">
              <div className="timeline-copy" key={`${locale}-${timeline}`} aria-live="polite">
                <strong>{c.timeline[timeline].year}</strong>
                <h2>{c.timeline[timeline].title}</h2>
                <p>{c.timeline[timeline].body}</p>
              </div>
              <div className="timeline-controls carousel-control-pair">
                <button className="carousel-arrow carousel-arrow-prev" type="button" disabled={timeline <= 0} aria-label={rtl ? "المحطة السابقة" : "Previous milestone"} onClick={() => selectTimeline(Math.max(0, timeline - 1))}><CarouselArrow /></button>
                <button className="carousel-arrow carousel-arrow-next" type="button" disabled={timeline >= c.timeline.length - 1} aria-label={rtl ? "المحطة التالية" : "Next milestone"} onClick={() => selectTimeline(Math.min(c.timeline.length - 1, timeline + 1))}><CarouselArrow /></button>
              </div>
            </div>
            <div className="timeline-rail" ref={timelineRailRef} style={{ "--timeline-progress": `${(timeline / (c.timeline.length - 1)) * 100}%` } as React.CSSProperties}>
              <i />
              {c.timeline.map((item, index) => <button className={timeline === index ? "active" : ""} type="button" onClick={() => selectTimeline(index)} key={item.year}><span />{item.year}</button>)}
            </div>
          </div>
        </section>
      ))}

      {shown("vision") && <section className="discover-vision section-light" id={sectionID("vision", "vision")} style={sectionStyle("vision")}>
        <DiscoverBackdrop settings={cmsSettings?.vision} />
        {!square && element("vision", "media") && <div className="vision-visual" aria-hidden="true">
          <DiscoverImage images={cmsSettings?.vision?.images} fallback="/assets/editorial/startime-saudi-leadership-v2.webp" loading="eager" />
          <div className="vision-shade" />
          {!modernDesign && <strong>2030</strong>}
        </div>}
        <Reveal className="vision-copy">
          {element("vision", "eyebrow") && <p className="label">{c.vision.label}</p>}
          {element("vision", "heading") && <h2>{c.vision.title}</h2>}
          {element("vision", "body") && c.vision.body.map((paragraph) => <p className="discover-body" key={paragraph}>{paragraph}</p>)}
        </Reveal>
      </section>}

      {shown("ceo") && <section ref={ceoRef} className={`discover-ceo section-dark ${bioOpen ? "bio-expanded" : ""} ${cmsSettings?.ceo?.patternImages ? "cms-custom-pattern" : ""} ${element("ceo", "pattern") ? "" : "cms-hide-pattern"}`} id={sectionID("ceo", "leadership")} style={sectionStyle("ceo")}>
        <DiscoverBackdrop settings={cmsSettings?.ceo} />
        <DiscoverPattern settings={cmsSettings?.ceo} />
        {element("ceo", "media") && <Reveal className="ceo-portrait"><DiscoverImage images={cmsSettings?.ceo?.images} fallback="/assets/people/shaya-al-qahtani-cutout-v2-optimized.webp" alt={c.ceo.name} /></Reveal>}
        <Reveal className="ceo-quote">
          <span>{cmsSettings?.ceo?.quoteMark || "“"}</span>
          {modernDesign && <div className="ceo-attribution-top"><strong>{c.ceo.name}</strong><small>{c.ceo.role}</small></div>}
          {element("ceo", "body") && <blockquote>{c.ceo.quote}</blockquote>}
          {modernDesign && (!square || cmsSettings?.ceo?.showBioPreview) && <p className="ceo-bio-preview">{c.ceo.bio[0]}</p>}
          {!modernDesign && <div><strong>{c.ceo.name}</strong><small>{c.ceo.role}</small></div>}
          {element("ceo", "cta") && <div className="ceo-actions">
            <button className="button button-accent" type="button" aria-expanded={bioOpen} onClick={modernDesign ? toggleBio : () => setBioOpen(!bioOpen)}>{modernDesign && bioOpen ? (cmsSettings?.ceo?.lessLabel || (rtl ? "عرض أقل" : "Show Less")) : c.ceo.learnMore}<Arrow /></button>
            <a className="button button-ghost" href={`mailto:${cmsSettings?.ceo?.contactEmail || "info@startime.sa"}`}>{c.ceo.contact}<Arrow /></a>
          </div>}
        </Reveal>
        {!modernDesign && <div ref={bioRef} className={`ceo-bio ${bioOpen ? "open" : ""}`} aria-hidden={!bioOpen}>
          <div><h2>{c.ceo.bioTitle}</h2><div className="ceo-bio-copy">{c.ceo.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
        </div>}
      </section>}

      {shown("ceo") && modernDesign && <div ref={bioRef} className={`ceo-bio ceo-bio-standalone ${bioOpen ? "open" : ""}`} aria-hidden={!bioOpen} style={ordered ? { order: (order?.indexOf("ceo") ?? 0) * 2 + 1 } : undefined}>
        <div><h2>{c.ceo.bioTitle}</h2><div className="ceo-bio-copy">{c.ceo.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
      </div>}

      {shown("methodology") && <section className={`discover-methodology ${modernDesign ? "section-light" : "section-dark"}`} id={sectionID("methodology", "methodology")} style={sectionStyle("methodology")}>
        <DiscoverBackdrop settings={cmsSettings?.methodology} />
        {element("methodology", "media") && <Reveal className="methodology-media">
          <DiscoverImage images={cmsSettings?.methodology?.images} fallback="/assets/editorial/startime-strategic-events-hero-v2.webp" />
          <div className="methodology-shade" />
        </Reveal>}
        <Reveal className="methodology-copy">
          {element("methodology", "eyebrow") && <p className="label">{c.methodology.label}</p>}
          {element("methodology", "heading") && <h2>{c.methodology.title}</h2>}
          {element("methodology", "body") && <p>{c.methodology.body}</p>}
        </Reveal>
      </section>}

      {shown("governance") && <section ref={governanceRef} className={`discover-governance section-dark ${cmsSettings?.governance?.patternImages ? "cms-custom-pattern" : ""} ${element("governance", "pattern") ? "" : "cms-hide-pattern"}`} id={sectionID("governance", "governance")} style={sectionStyle("governance")}>
        <DiscoverBackdrop settings={cmsSettings?.governance} />
        <DiscoverPattern settings={cmsSettings?.governance} />
        {element("governance", "media") && <div className="governance-media" aria-hidden="true">
          {activeGovernancePrinciples.map((item, index) => <DiscoverImage key={`${item.sourceIndex}-${index}`} className={governance === index ? "active" : ""} images={slideImagesWithFallback(firstGovernanceImages, item.cms?.images || cmsSettings?.governance?.principleImages?.[item.sourceIndex]?.images, firstGovernanceFallback)} fallback={firstGovernanceFallback} />)}
          <div className="governance-shade" />
        </div>}
        <Reveal className="governance-heading">
          {element("governance", "eyebrow") && <p className="label">{c.governance.label}</p>}
          {element("governance", "heading") && <h2>{c.governance.title}</h2>}
          {element("governance", "body") && <p>{c.governance.body}</p>}
        </Reveal>
        {element("governance", "items") && <div className="governance-layout">
          <div className="governance-active" key={`${locale}-${governance}`} aria-live="polite" style={homepageItemStyle(activePrinciple.cms?.visual)}>
            {cmsSettings?.governance?.showCounter !== false && <SlideCounter current={governance + 1} total={activeGovernancePrinciples.length} />}
            <h3>{square ? activePrinciple.newPageTitle ?? activePrinciple.title : activePrinciple.title}</h3>
            <p>{activePrinciple.body}</p>
            <div className="governance-controls carousel-control-pair">
              <button className="carousel-arrow carousel-arrow-prev" type="button" disabled={governance <= 0} aria-label={rtl ? "المبدأ السابق" : "Previous principle"} onClick={() => setGovernance(Math.max(0, governance - 1))}><CarouselArrow /></button>
              <button className="carousel-arrow carousel-arrow-next" type="button" disabled={governance >= activeGovernancePrinciples.length - 1} aria-label={rtl ? "المبدأ التالي" : "Next principle"} onClick={() => setGovernance(Math.min(activeGovernancePrinciples.length - 1, governance + 1))}><CarouselArrow /></button>
            </div>
          </div>
        </div>}
      </section>}

      {shown("form") && <section className="governance-contact section-light" id={sectionID("form", "governance-contact")} style={sectionStyle("form")}>
        <DiscoverBackdrop settings={cmsSettings?.form} />
        <div className={`governance-contact-shell ${modernDesign ? "governance-contact-shell-new" : ""}`}>
          {modernDesign ? <>
            {element("form", "heading") && <Reveal className="governance-contact-title"><h2>{c.form.title}</h2></Reveal>}
            {element("form", "media") && <Reveal className="governance-contact-image"><DiscoverImage images={cmsSettings?.form?.images} fallback={square ? "/assets/editorial/startime-careers-creative-team.webp" : "/assets/editorial/startime-saudi-leadership-v2.webp"} /></Reveal>}
          </> : <Reveal className="governance-contact-intro">
              <h2>{c.form.title}</h2>
              {element("form", "media") && <div className="governance-contact-image"><DiscoverImage images={cmsSettings?.form?.images} fallback="/assets/editorial/startime-saudi-leadership-v2.webp" /></div>}
            </Reveal>}
          {element("form", "items") && <Reveal className="governance-contact-form">
            <form onSubmit={submitGovernance} data-form-key="governance" className="lead-form">
              <input aria-hidden="true" autoComplete="off" name="companyWebsite" tabIndex={-1} style={{ position: "absolute", left: "-10000px" }} />
              {c.form.fields.slice(0, 5).map((field, index) => <label key={field}><span>{field}</span><input name={["department", "name", "position", "phone", "email"][index]} type={index === 3 ? "tel" : index === 4 ? "email" : "text"} required={index === 1 || index === 4} /></label>)}
              <label className="form-message"><span>{c.form.fields[5]}</span><textarea name="message" rows={5} /></label>
              {cmsSettings?.form?.showAttachment !== false && <label className="form-file"><span>{c.form.fields[6]}</span><input type="file" name="attachment" accept=".pdf,.docx,.jpg,.jpeg,.png" /><Paperclip aria-hidden="true" /></label>}
              {governanceError && <p role="alert" className="form-error">{governanceError}</p>}
              {governanceSent && <p role="status" className="form-success">{rtl ? "تم استلام رسالتك بنجاح." : "Your message has been received."}</p>}
              {element("form", "cta") && <button className="button button-accent" type="submit" disabled={governanceSubmitting}>{governanceSubmitting ? (rtl ? "جارٍ الإرسال…" : "Sending…") : c.form.submit}<Arrow /></button>}
            </form>
          </Reveal>}
        </div>
      </section>}

      <NewSiteFooter locale={locale} />
    </main>
  );
}
