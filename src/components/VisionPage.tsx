"use client";
import { SlideCounter } from "./SlideCounter";

import { NewSiteHeader } from "@/components/NewSiteHeader";
import { NewSiteFooter } from "@/components/NewSiteFooter";


import Image from "next/image";
import { ArtDirectedImage, ArtDirectedVideo, type ViewportImages } from "@/components/ArtDirectedImage";
import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { type Locale } from "@/content/home";
import { visionContent } from "@/content/vision";
import { homepageItemStyle, homepageVisualStyle } from "@/content/homepageVisual";
import { type VisionCmsSettings, type VisionSectionKey, visionSectionKeys } from "@/content/visionCms";


const originalPillarImages = [
  "/assets/editorial/startime-saudi-leadership-v2.webp",
  "/assets/editorial/news-partnership.webp",
  "/assets/editorial/startime-triple-s-command-center.webp",
  "/assets/projects/smart-cities-v2.webp",
  "/assets/projects/blue-economy-v2.webp",
];

const newPillarImages = [
  "/assets/editorial/startime-saudi-leadership-v2.webp",
  "/assets/editorial/startime-vision-hero-v1.webp",
  "/assets/editorial/startime-investment-aerial-day-v2.webp",
  "/assets/editorial/startime-triple-s-command-center.webp",
  "/assets/projects/blue-economy-v2.webp",
];

const originalProgramImages = [
  "/assets/editorial/startime-triple-s-command-center.webp",
  "/assets/editorial/news-partnership.webp",
  "/assets/editorial/startime-careers-creative-team.webp",
  "/assets/editorial/startime-team-ministry-environment-event.png",
  "/assets/projects/semiconductor-v2.webp",
];

const newProgramImages = [
  "/assets/editorial/startime-triple-s-command-center.webp",
  "/assets/editorial/startime-investment-network-v1.webp",
  "/assets/editorial/startime-careers-creative-team.webp",
  "/assets/editorial/startime-team-ministry-environment-event.png",
  "/assets/projects/semiconductor-v2.webp",
];

const roadmapImages = [
  "/assets/editorial/home4-heritage-future-v1.webp",
  "/assets/editorial/home4-najd-origin-v1.webp",
  "/assets/editorial/startime-saudi-leadership-v2.webp",
  "/assets/editorial/news-partnership.webp",
  "/assets/editorial/home4-startime-future-v1.webp",
  "/assets/editorial/startime-triple-s-command-center.webp",
  "/assets/editorial/startime-vision-hero-v1.webp",
];

const roadmapIcons = [
  "/assets/ui/vision-roadmap/2024.svg",
  "/assets/ui/vision-roadmap/2025.svg",
  "/assets/ui/vision-roadmap/2026.svg",
  "/assets/ui/vision-roadmap/2027.svg",
  "/assets/ui/vision-roadmap/2028.svg",
  "/assets/ui/vision-roadmap/2029.svg",
  "/assets/ui/vision-roadmap/2030.svg",
];

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`vision-reveal ${className}`}>{children}</div>;
}

function VisionImage({ images, fallback, className, alt = "", sizes, priority = false, unoptimized = false, width, height, style }: {
  images?: ViewportImages;
  fallback: string;
  className: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
  width?: number;
  height?: number;
  style?: CSSProperties;
}) {
  if (images && Object.values(images).some(Boolean)) {
    return <ArtDirectedImage images={images} fallback={fallback} className={className} alt={alt} loading={priority ? "eager" : "lazy"} fill={!width} width={width} height={height} style={style} />;
  }
  return <Image className={className} src={fallback} alt={alt} fill={!width} width={width} height={height} priority={priority} unoptimized={unoptimized} sizes={sizes} style={style} />;
}

function VisionBackdrop({ images, videos }: { images?: ViewportImages; videos?: ViewportImages }) {
  if (!images && !videos) return null;
  const fallback = images?.default || "";
  return <div className="vision-cms-backdrop" aria-hidden="true">
    {images ? <ArtDirectedImage images={images} fallback={fallback} alt="" /> : null}
    {videos ? <ArtDirectedVideo videos={videos} /> : null}
  </div>;
}

function WordReveal({ text, as: Tag }: { text: string; as: "p" | "h2" }) {
  return (
    <Tag className="vision-word-reveal" aria-label={text}>
      {text.split(/\s+/).map((word, index) => (
        <span className="vision-word" style={{ "--word-index": index } as CSSProperties} aria-hidden="true" key={`${word}-${index}`}>
          {word}
        </span>
      ))}
    </Tag>
  );
}

function useScrollChapter(count: number, enabled = true, allViewports = false) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const section = ref.current;
    if (!section) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!allViewports && (window.innerWidth <= 900 || window.innerWidth >= 2000)) return;
      const bounds = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -bounds.top / travel));
      if (allViewports) section.style.setProperty("--roadmap-ring-offset", String((439.82 * (1 - progress)).toFixed(2)));
      const next = Math.min(count - 1, Math.floor(progress * count));
      setActive((current) => current === next ? current : next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [count, enabled, allViewports]);

  return [ref, active, setActive] as const;
}

export function VisionPage({ locale, variant = "new", square = false, cmsContent, cmsSettings }: { locale: Locale; variant?: "new" | "original"; route?: "vision" | "vision1" | "vision2"; square?: boolean; cmsContent?: (typeof visionContent)["en"]; cmsSettings?: VisionCmsSettings }) {
  const c = cmsContent || visionContent[locale];
  const rtl = locale === "ar";
  const modern = variant === "new";
  const settings = (key: VisionSectionKey) => cmsSettings?.[key];
  const shown = (key: VisionSectionKey) => settings(key)?.visible !== false;
  const element = (key: VisionSectionKey, name: "eyebrow" | "heading" | "body" | "media" | "items" | "pattern" | "cta") => settings(key)?.elementVisibility?.[name] !== false;
  const sectionStyle = (key: VisionSectionKey) => homepageVisualStyle(settings(key)?.visual);
  const sectionID = (key: VisionSectionKey) => settings(key)?.anchorID || undefined;
  const orderedKeys = [...(cmsSettings?.order || []), ...visionSectionKeys].filter((key, index, array) => array.indexOf(key) === index);
  const pillarEntries = c.pillars.items.map((item, index) => ({ item, settings: settings("pillars")?.items?.[index], index })).filter(({ settings: itemSettings }) => itemSettings?.visible !== false);
  const programEntries = c.programs.items.map((item, index) => ({ item, settings: settings("programs")?.items?.[index], index })).filter(({ settings: itemSettings }) => itemSettings?.visible !== false);
  const roadmapEntries = c.roadmap.items.map((item, index) => ({ item, settings: settings("roadmap")?.items?.[index], index })).filter(({ settings: itemSettings }) => itemSettings?.visible !== false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLElement>(null);
  const [pillarsRef, pillar, setPillar] = useScrollChapter(Math.max(1, pillarEntries.length), !modern);
  const [programsRef, program, setProgram] = useScrollChapter(Math.max(1, programEntries.length), !modern);
  const [roadmapRef, roadmap, setRoadmap] = useScrollChapter(Math.max(1, roadmapEntries.length), true, square);
  const pillarTouchStart = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: .12, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".vision-reveal").forEach((element) => observer.observe(element));

    let frame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => {
      frame = 0;
      if (heroRef.current) {
        const heroBounds = heroRef.current.getBoundingClientRect();
        const heroTravel = Math.max(1, heroRef.current.offsetHeight - window.innerHeight);
        if (!modern) {
          const progress = reducedMotion ? 0 : Math.min(1, Math.max(0, -heroBounds.top / heroTravel));
          heroRef.current.style.setProperty("--hero-progress", String(progress));
        }
        const heroTop = window.scrollY + heroBounds.top;
        const nextScrolled = modern ? window.scrollY > 72 : window.scrollY > heroTop + heroTravel - 24;
        setScrolled((current) => current === nextScrolled ? current : nextScrolled);
      }
      if (statementRef.current && !square) {
        const statementBounds = statementRef.current.getBoundingClientRect();
        const statementStage = statementRef.current.querySelector<HTMLElement>(".vision-statement-stage");
        const stickyTop = statementStage ? Number.parseFloat(window.getComputedStyle(statementStage).top) || 0 : 0;
        const statementTravel = Math.max(
          1,
          statementRef.current.offsetHeight - (statementStage?.offsetHeight ?? window.innerHeight) - stickyTop,
        );
        const revealTravel = statementTravel * (window.innerWidth <= 900 ? .72 : 1);
        const statementProgress = reducedMotion || (modern && window.innerWidth >= 2000 && window.innerHeight >= 1000)
          ? 1
          : Math.min(1, Math.max(0, -statementBounds.top / revealTravel));
        const words = statementRef.current.querySelectorAll<HTMLElement>(".vision-word");
        const revealedWords = Math.ceil(statementProgress * words.length);
        words.forEach((word, index) => word.classList.toggle("is-revealed", index < revealedWords));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [locale, rtl, modern, square]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const activeRoadmap = roadmapEntries[Math.min(roadmap, roadmapEntries.length - 1)];
  const roadmapIcon = activeRoadmap?.settings?.icon || roadmapIcons[activeRoadmap?.index ?? 0] || roadmapIcons[0];

  const selectChapter = (section: HTMLElement | null, index: number, count: number, setter: (value: number) => void, allViewports = false) => {
    setter(index);
    if (!section || (!allViewports && (window.innerWidth <= 900 || window.innerWidth >= 2000))) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (travel * index) / Math.max(1, count - 1), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  const sections: Record<VisionSectionKey, ReactNode> = {
    hero: <section className={`vision-cms-section vision-hero-scroll ${modern ? "vision-hero-static" : ""}`} ref={heroRef} id={sectionID("hero")} style={sectionStyle("hero")}>
        <div className="vision-hero">
          <div className="vision-hero-media">
            {element("hero", "media") && (modern ? <>
              <VisionImage className="vision-hero-backdrop" images={settings("hero")?.backdropImages || settings("hero")?.backgroundImages} fallback={settings("hero")?.backdrop || "/assets/editorial/startime-vision-hero-no-person-v2-optimized.webp"} alt="" priority sizes="100vw" />
              {settings("hero")?.backgroundVideos ? <ArtDirectedVideo videos={settings("hero")?.backgroundVideos} className="vision-cms-hero-video" /> : null}
              {/* Original portrait: Saudi Press Agency, CC BY-SA 4.0. Transparent cutout preserves the official likeness. */}
              <VisionImage className="vision-hero-portrait" images={settings("hero")?.portraitImages} fallback={settings("hero")?.portrait || "/assets/editorial/mbs-official-spa-cutout-v2-optimized.webp"} alt={c.hero.name} priority unoptimized sizes="(max-width: 900px) 110vw, 62vw" style={{ objectFit: "contain" }} />
            </> : <VisionImage className="vision-hero-image" images={settings("hero")?.backdropImages} fallback={settings("hero")?.backdrop || "/assets/editorial/startime-vision-hero-v1.webp"} alt="" priority sizes="100vw" />)}
          </div>
          <div className="vision-hero-edge" aria-hidden="true" />
          <div className="vision-hero-copy">
            {element("hero", "heading") && <h1>{c.hero.quote}</h1>}
            <div>
              {settings("hero")?.showHonorific !== false && <span className="vision-hero-honorific">{c.hero.honorific}</span>}
              {settings("hero")?.showName !== false && <strong>{c.hero.name}</strong>}
              {settings("hero")?.showRole !== false && <span className="vision-hero-role">{c.hero.role}</span>}
            </div>
          </div>
          {settings("hero")?.showScrollCue !== false && <span className="contact-scroll-cue" aria-hidden="true" />}
        </div>
      </section>,

    path: <section className="vision-cms-section vision-path" id={sectionID("path")} style={sectionStyle("path")}>
        <VisionBackdrop images={settings("path")?.backgroundImages} videos={settings("path")?.backgroundVideos} />
        {element("path", "media") && <div className="vision-path-media vision-reveal"><VisionImage className="vision-path-image" images={settings("path")?.images} fallback={settings("path")?.image || "/assets/editorial/startime-saudi-leadership-v2.webp"} alt="" sizes="(max-width: 900px) 100vw, 46vw" /></div>}
        <Reveal className="vision-path-copy">
          {element("path", "heading") && <h2>{c.path.title}</h2>}
          {element("path", "body") && c.path.body.map((paragraph, index) => settings("path")?.paragraphs?.[index]?.visible === false ? null : <p className="vision-cms-paragraph" style={homepageItemStyle({ body: settings("path")?.paragraphs?.[index]?.style })} key={`${index}-${paragraph}`}>{paragraph}</p>)}
        </Reveal>
      </section>,

    vision: <section className="vision-cms-section vision-statement" ref={statementRef} id={sectionID("vision")} style={sectionStyle("vision")}>
        <VisionBackdrop images={settings("vision")?.backgroundImages} videos={settings("vision")?.backgroundVideos} />
        <div className="vision-statement-stage">
          {element("vision", "pattern") && (!modern || settings("vision")?.pattern || settings("vision")?.patternImages) ? <div className="vision-statement-pattern" aria-hidden="true">
            <VisionImage className="vision-statement-pattern-image" images={settings("vision")?.patternImages} fallback={settings("vision")?.pattern || "/assets/brand/startime-pattern.svg"} alt="" sizes="100vw" />
          </div> : null}
          <div className="vision-statement-copy">
            {element("vision", "eyebrow") && <p className="vision-label">{c.vision.label}</p>}
            {element("vision", "body") && (square ? <p className="vision-word-reveal vision-statement-static-text">{c.vision.body}</p> : <WordReveal as="p" text={c.vision.body} />)}
            {element("vision", "heading") && (square ? <h2 className="vision-word-reveal vision-statement-static-text">{c.vision.statement}</h2> : <WordReveal as="h2" text={c.vision.statement} />)}
          </div>
        </div>
      </section>,

    pillars: modern ? <section className="vision-cms-section vision-pillars-new" aria-label={c.pillars.label} id={sectionID("pillars")} style={sectionStyle("pillars")}>
        <VisionBackdrop images={settings("pillars")?.backgroundImages} videos={settings("pillars")?.backgroundVideos} />
        <div className="vision-pillars-intro">
          <div className="vision-pillars-intro-title">
            {element("pillars", "eyebrow") && <p className="vision-label">{c.pillars.label}</p>}
            {element("pillars", "heading") && <h2>{c.pillars.title}</h2>}
          </div>
          {element("pillars", "body") && <p>{c.pillars.body}</p>}
        </div>
        {element("pillars", "items") && pillarEntries.length > 0 && <div
          className="vision-pillars-viewport"
          role="region"
          aria-roledescription="carousel"
          aria-label={c.pillars.label}
          onTouchStart={(event) => { pillarTouchStart.current = event.touches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => {
            if (pillarTouchStart.current === null) return;
            const distance = (event.changedTouches[0]?.clientX ?? pillarTouchStart.current) - pillarTouchStart.current;
            if (Math.abs(distance) > 45) setPillar((current) => Math.max(0, Math.min(pillarEntries.length - 1, current + (distance < 0 ? 1 : -1) * (rtl ? -1 : 1))));
            pillarTouchStart.current = null;
          }}
        >
          <div className="vision-pillars-track" style={{ transform: `translateX(${rtl ? pillar * 100 : -pillar * 100}%)` }}>
            {pillarEntries.map(({ item, settings: itemSettings, index: originalIndex }, index) => (
              <article className="vision-pillar-slide" aria-hidden={pillar !== index} inert={pillar !== index} key={`${item.title}-${originalIndex}`} style={homepageItemStyle(itemSettings?.visual)}>
                {element("pillars", "media") && <div className="vision-pillar-image"><ArtDirectedImage images={itemSettings?.images} fallback={itemSettings?.image || item.image || newPillarImages[originalIndex] || newPillarImages[0]} alt="" /></div>}
                <div className="vision-pillar-copy">
                  <span className="vision-pillar-index"><SlideCounter current={index + 1} total={pillarEntries.length} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <div className="vision-pillar-controls">
                    <div className="vision-pillar-progress" aria-hidden="true">{pillarEntries.map((_, dot) => <i className={dot === pillar ? "active" : ""} key={dot} />)}</div>
                    <div className="carousel-control-pair">
                      <button className="carousel-arrow carousel-arrow-prev" type="button" disabled={pillar === 0} onClick={() => setPillar(pillar - 1)} aria-label={rtl ? "السابق" : "Previous pillar"}><span className="carousel-arrow-shape" /></button>
                      <button className="carousel-arrow carousel-arrow-next" type="button" disabled={pillar === pillarEntries.length - 1} onClick={() => setPillar(pillar + 1)} aria-label={rtl ? "التالي" : "Next pillar"}><span className="carousel-arrow-shape" /></button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>}
      </section> : <section className="vision-cms-section vision-chapter vision-pillars" ref={pillarsRef} id={sectionID("pillars")} style={sectionStyle("pillars")}>
        <VisionBackdrop images={settings("pillars")?.backgroundImages} videos={settings("pillars")?.backgroundVideos} />
        <div className="vision-chapter-stage">
          <div className="vision-chapter-heading">
            {element("pillars", "eyebrow") && <p className="vision-label">{c.pillars.label}</p>}
            {element("pillars", "heading") && <h2>{c.pillars.title}</h2>}
            {element("pillars", "body") && <p>{c.pillars.body}</p>}
          </div>
          {element("pillars", "media") && <div className="vision-chapter-media">
            {pillarEntries.map(({ item, settings: itemSettings, index: originalIndex }, index) => <ArtDirectedImage className={pillar === index ? "active" : ""} images={itemSettings?.images} fallback={itemSettings?.image || item.image || originalPillarImages[originalIndex] || originalPillarImages[0]} alt="" key={`${item.title}-${originalIndex}`} />)}
          </div>}
          {element("pillars", "items") && <div className="vision-chapter-list">
            {pillarEntries.map(({ item, settings: itemSettings }, index) => (
              <button className={pillar === index ? "active" : ""} style={homepageItemStyle(itemSettings?.visual)} type="button" onClick={() => selectChapter(pillarsRef.current, index, pillarEntries.length, setPillar)} key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><p>{item.body}</p>
              </button>
            ))}
          </div>}
        </div>
      </section>,

    programs: modern ? <section className="vision-cms-section vision-programs-new" aria-label={c.programs.label} id={sectionID("programs")} style={sectionStyle("programs")}>
        <VisionBackdrop images={settings("programs")?.backgroundImages} videos={settings("programs")?.backgroundVideos} />
        <div className="vision-programs-intro">
          <div>{element("programs", "eyebrow") && <p className="vision-label">{c.programs.label}</p>}{element("programs", "heading") && <h2>{c.programs.title}</h2>}</div>
          {element("programs", "body") && <p>{c.programs.body}</p>}
        </div>
        {element("programs", "items") && programEntries.length > 0 && <div className="vision-programs-layout">
          {element("programs", "media") && <div className="vision-programs-visual">
            {programEntries.map(({ item, settings: itemSettings, index: originalIndex }, index) => <VisionImage className={program === index ? "active" : ""} images={itemSettings?.images} fallback={itemSettings?.image || item.image || newProgramImages[originalIndex] || newProgramImages[0]} alt="" sizes="(max-width: 900px) 100vw, 50vw" key={`${item.title}-${originalIndex}`} />)}
          </div>}
          <div className="vision-programs-information">
            <div className="vision-programs-accordion">
              {programEntries.map(({ item, settings: itemSettings, index: originalIndex }, index) => (
                <div className={`vision-program-row ${program === index ? "active" : ""}`} style={homepageItemStyle(itemSettings?.visual)} key={`${item.title}-${originalIndex}`}>
                  <h3>
                    <button type="button" id={`vision-program-heading-${locale}-${index}`} aria-expanded={program === index} aria-controls={`vision-program-panel-${locale}-${index}`} onClick={() => setProgram(index)}>
                      <span className="vision-program-index">{String(index + 1).padStart(2, "0")}</span>
                      <span>{item.title}</span>
                    </button>
                  </h3>
                  <div className="vision-program-panel" id={`vision-program-panel-${locale}-${index}`} role="region" aria-labelledby={`vision-program-heading-${locale}-${index}`} hidden={program !== index}>
                    <p>{item.body}</p>
                    {item.target && itemSettings?.showTarget !== false ? <small>{item.target}</small> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>}
      </section> : <section className="vision-cms-section vision-chapter vision-programs" ref={programsRef} id={sectionID("programs")} style={sectionStyle("programs")}>
        <VisionBackdrop images={settings("programs")?.backgroundImages} videos={settings("programs")?.backgroundVideos} />
        <div className="vision-chapter-stage">
          <div className="vision-chapter-heading">
            {element("programs", "eyebrow") && <p className="vision-label">{c.programs.label}</p>}
            {element("programs", "heading") && <h2>{c.programs.title}</h2>}
            {element("programs", "body") && <p>{c.programs.body}</p>}
          </div>
          {element("programs", "media") && <div className="vision-chapter-media">
            {programEntries.map(({ item, settings: itemSettings, index: originalIndex }, index) => <VisionImage className={program === index ? "active" : ""} images={itemSettings?.images} fallback={itemSettings?.image || item.image || originalProgramImages[originalIndex] || originalProgramImages[0]} alt="" sizes="(max-width: 900px) 100vw, 48vw" key={`${item.title}-${originalIndex}`} />)}
          </div>}
          {element("programs", "items") && <div className="vision-chapter-list">
            {programEntries.map(({ item, settings: itemSettings }, index) => (
              <button className={program === index ? "active" : ""} style={homepageItemStyle(itemSettings?.visual)} type="button" onClick={() => selectChapter(programsRef.current, index, programEntries.length, setProgram)} key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><p>{item.body}</p>{item.target && itemSettings?.showTarget !== false ? <small>{item.target}</small> : null}
              </button>
            ))}
          </div>}
        </div>
      </section>,

    roadmap: <section className="vision-cms-section vision-roadmap" ref={roadmapRef} id={sectionID("roadmap")} style={sectionStyle("roadmap")}>
        <div className="vision-roadmap-stage">
          <VisionBackdrop images={settings("roadmap")?.backgroundImages} videos={settings("roadmap")?.backgroundVideos} />
          {!square ? <>
            <div className="vision-roadmap-media">
              {roadmapEntries.map(({ index: originalIndex }, index) => <Image className={roadmap === index ? "active" : ""} src={roadmapImages[originalIndex] || roadmapImages[0]} alt="" fill sizes="100vw" key={`${originalIndex}-${index}`} />)}
            </div>
            <div className="vision-roadmap-shade" />
          </> : null}
          <div className="vision-roadmap-heading">
            {element("roadmap", "eyebrow") && <p className="vision-label">{c.roadmap.label}</p>}
            {element("roadmap", "heading") && <h2>{c.roadmap.title}</h2>}
          </div>
          {element("roadmap", "items") && activeRoadmap && <div className="vision-roadmap-active" key={`${locale}-${roadmap}`} style={homepageItemStyle(activeRoadmap.settings?.visual)}>
            <strong>{activeRoadmap.item.year}</strong>
            {square && element("roadmap", "media") ? <div className="vision-roadmap-gauge" aria-hidden="true"><svg className="vision-roadmap-progress" viewBox="0 0 160 160"><circle className="vision-roadmap-track" cx="80" cy="80" r="70" /><circle className="vision-roadmap-fill" cx="80" cy="80" r="70" /></svg><VisionImage className="vision-roadmap-icon" images={activeRoadmap.settings?.icons} fallback={roadmapIcon} alt="" width={160} height={160} /></div> : null}
            <p>{activeRoadmap.item.body}</p>
          </div>}
          {!square ? <div className="vision-roadmap-rail" style={{ "--roadmap-progress": `${(roadmap / Math.max(1, roadmapEntries.length - 1)) * 100}%` } as CSSProperties}>
            <i />
            {roadmapEntries.map(({ item }, index) => <button type="button" className={roadmap === index ? "active" : ""} onClick={() => selectChapter(roadmapRef.current, index, roadmapEntries.length, setRoadmap, square)} key={item.year}><span />{item.year}</button>)}
          </div> : null}
        </div>
      </section>,

    commitment: <section className="vision-cms-section vision-commitment" id={sectionID("commitment")} style={sectionStyle("commitment")}>
        <VisionBackdrop images={settings("commitment")?.backgroundImages} videos={settings("commitment")?.backgroundVideos} />
        {!modern && element("commitment", "media") ? <div className="vision-commitment-media"><Image src="/assets/editorial/home4-startime-future-v1.webp" alt="" fill sizes="100vw" /></div> : null}
        <Reveal className="vision-commitment-heading">{element("commitment", "eyebrow") && <p className="vision-label">{c.commitment.label}</p>}{element("commitment", "heading") && <h2>{c.commitment.title}</h2>}</Reveal>
        {element("commitment", "body") && <Reveal className="vision-commitment-copy">{c.commitment.body.map((paragraph, index) => settings("commitment")?.paragraphs?.[index]?.visible === false ? null : <p className="vision-cms-paragraph" style={homepageItemStyle({ body: settings("commitment")?.paragraphs?.[index]?.style })} key={`${index}-${paragraph}`}>{paragraph}</p>)}</Reveal>}
      </section>,
  };

  return <main className={`vision-page image-hero-page ${modern ? "vision-page-new" : "vision-page-original"} ${square ? "sharp-variation" : ""} ${rtl ? "rtl" : "ltr"}`}>
      <NewSiteHeader locale={locale} scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {orderedKeys.filter(shown).map((key) => <Fragment key={key}>{sections[key]}</Fragment>)}
      <NewSiteFooter locale={locale} />
    </main>;
}
