"use client";
import { SlideCounter } from "./SlideCounter";

import { NewSiteHeader } from "@/components/NewSiteHeader";
import { NewSiteFooter } from "@/components/NewSiteFooter";


import Image from "next/image";
import { TrimmedProjectLogo } from "./TrimmedProjectLogo";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArtDirectedImage } from "@/components/ArtDirectedImage";
import { PageSectionBackdrop } from "@/components/PageSectionBackdrop";
import { homepageItemStyle, homepageVisualStyle } from "@/content/homepageVisual";
import { investmentSectionKeys, type InvestmentKey, type PageCmsSettings } from "@/content/investmentContactCms";
import { ArrowLeft } from "@phosphor-icons/react/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { Cpu } from "@phosphor-icons/react/Cpu";
import { Leaf } from "@phosphor-icons/react/Leaf";
import { LockKey } from "@phosphor-icons/react/LockKey";
import { ShieldChevron } from "@phosphor-icons/react/ShieldChevron";
import { UsersThree } from "@phosphor-icons/react/UsersThree";
import { type Locale } from "@/content/home";
import { investmentContent } from "@/content/investment";
import { getNewInvestmentPortfolios } from "@/content/newPageProjects";
import { slideImagesWithFallback } from "@/content/slideImageFallback";
import type { InvestmentPortfolio } from "@/content/newSiteCmsProjects";
import { resolvePortfolioPhoto, type PortfolioPhoto } from "@/content/portfolioImages";


const domainImages = [
  "/assets/projects/industrial-security-v2.webp",
  "/assets/projects/maritime-forum-featured-v2.webp",
  "/assets/projects/semiconductor-v2.webp",
  "/assets/projects/blue-economy-v2.webp",
  "/assets/editorial/startime-careers-creative-team.webp",
];

const impactImages = [
  "/assets/editorial/startime-saudi-leadership-v2.webp",
  "/assets/editorial/home4-heritage-future-v1.webp",
  "/assets/editorial/startime-strategic-events-hero-v2.webp",
  "/assets/editorial/news-partnership.webp",
  "/assets/editorial/home4-startime-future-v1.webp",
];

const domainIcons = [ShieldChevron, LockKey, Cpu, Leaf, UsersThree];
// The process order is shared by the English and Arabic investment content.
const approachIcons = [
  "/assets/ui/investment-icons/opportunity-foresight.svg",
  "/assets/ui/investment-icons/market-intelligence.svg",
  "/assets/ui/investment-icons/gap-analysis.svg",
  "/assets/ui/investment-icons/concept-development.svg",
  "/assets/ui/investment-icons/evaluation-validation.svg",
  "/assets/ui/investment-icons/feasibility-sustainability.svg",
  "/assets/ui/investment-icons/business-model.svg",
  "/assets/ui/investment-icons/investment-establishment.svg",
  "/assets/ui/investment-icons/operations-execution.svg",
  "/assets/ui/investment-icons/impact-assessment.svg",
];

function safeInvestmentURL(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  if (/^\/(?!\/)[^\s]*$/.test(value) || /^#[a-z0-9_-]+$/i.test(value) || /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(value)) return value;
  try { const url = new URL(value); if (url.protocol === "https:") return url.href; } catch { /* Invalid editor URL uses the approved destination. */ }
  return fallback;
}

function Reveal({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={`investment-reveal ${className}`} style={style}>{children}</div>;
}

const CarouselArrow = () => <span className="carousel-arrow-shape" aria-hidden="true" />;

export function InvestmentPage({
  locale,

  square = false,
  newDesign = false,
  cmsPortfolios,
  cmsContent,
  cmsSettings,
  portfolioPhotos,
}: {
  locale: Locale;
  route?: "investment" | "investment1" | "investment2";
  square?: boolean;
  newDesign?: boolean;
  cmsPortfolios?: InvestmentPortfolio[];
  cmsContent?: (typeof investmentContent)["en"];
  cmsSettings?: PageCmsSettings<InvestmentKey>;
  portfolioPhotos?: PortfolioPhoto[];
}) {
  const c = cmsContent || investmentContent[locale];
  const rtl = locale === "ar";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [domain, setDomain] = useState(0);
  const [impact, setImpact] = useState(0);
  const [portfolio, setPortfolio] = useState(0);
  const [project, setProject] = useState(0);
  const [pathwayStep, setPathwayStep] = useState(1);
  const heroSequenceRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: .12, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".investment-reveal").forEach((element) => observer.observe(element));

    const onScroll = () => {
      const heroStillVisible = newDesign && (heroSequenceRef.current?.getBoundingClientRect().bottom ?? 0) > 70;
      setScrolled(window.scrollY > 56 && !heroStillVisible);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [locale, rtl, newDesign]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!newDesign) return;

    let frame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePathwayStep = () => {
      frame = 0;
      const sequence = heroSequenceRef.current;
      const hero = heroRef.current;
      if (!sequence || !hero) return;
      if (reducedMotion.matches) {
        setPathwayStep(6);
        return;
      }
      const rect = sequence.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - hero.offsetHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const nextStep = Math.min(6, Math.floor(progress * 6) + 1);
      setPathwayStep((current) => current === nextStep ? current : nextStep);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updatePathwayStep);
    };

    updatePathwayStep();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    reducedMotion.addEventListener("change", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [newDesign]);

  const section = (key: InvestmentKey) => cmsSettings?.[key];
  const element = (key: InvestmentKey, name: "eyebrow" | "heading" | "body" | "media" | "items" | "cta") => section(key)?.elementVisibility?.[name] !== false;
  const orderedKeys = [...(cmsSettings?.order || []), ...investmentSectionKeys].filter((key, index, list) => list.indexOf(key) === index);
  const sectionStyle = (key: InvestmentKey) => ({ ...homepageVisualStyle(section(key)?.visual), order: key === "hero" ? 1 : orderedKeys.indexOf(key) + 2, display: section(key)?.visible === false ? "none" : undefined });
  const itemEntries = <T,>(key: InvestmentKey, items: T[]) => items.flatMap((item, index) => section(key)?.items?.[index]?.visible === false ? [] : [{ item, originalIndex: index, settings: section(key)?.items?.[index] }]);
  const domains = itemEntries("domains", c.domains.items);
  const portfolios = itemEntries("portfolios", c.portfolios.items);
  const approach = itemEntries("approach", c.approach.items);
  const impacts = itemEntries("impact", c.impact.items);
  const baseProjectPortfolios = cmsPortfolios || (square ? getNewInvestmentPortfolios(locale) : c.projects.portfolios);
  const projectPortfolios = baseProjectPortfolios.flatMap((group, groupIndex) => {
    const groupSettings = section("projects")?.portfolios?.[groupIndex];
    if (groupSettings?.visible === false) return [];
    const items = group.items.flatMap((item, itemIndex) => groupSettings?.items?.[itemIndex]?.visible === false ? [] : [{ ...item, imageSettings: groupSettings?.items?.[itemIndex] }]);
    return items.length ? [{ ...group, items }] : [];
  });
  const activeProjects = projectPortfolios[portfolio]?.items || [];
  const activeProject = activeProjects[project] ?? activeProjects[0];
  const impactTotal = Math.max(1, impacts.length);


  const moveImpact = (step: number) => {
    setImpact((current) => Math.max(0, Math.min(impactTotal - 1, current + step)));
  };

  const choosePortfolio = (index: number) => {
    setPortfolio(index);
    setProject(0);
  };

  const moveProject = (direction: number) => {
    setProject((current) => Math.max(0, Math.min(activeProjects.length - 1, current + direction)));
  };

  return (
    <main className={`investment-page investment-cms-page image-hero-page ${newDesign ? "investment-page-next" : ""} ${square ? "sharp-variation" : ""} ${rtl ? "rtl" : "ltr"}`}>
      <NewSiteHeader locale={locale} scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {section("hero")?.visible !== false && (newDesign ? (
        <div className="investment-next-hero-sequence" ref={heroSequenceRef} style={sectionStyle("hero")}>
        <section className="investment-next-hero" ref={heroRef} aria-labelledby={`investment-next-title-${locale}`}>
          <div className="investment-next-stars" aria-hidden="true" />
          <div className="investment-next-heading">
            <h1 id={`investment-next-title-${locale}`}>{c.hero.lead}</h1>
          </div>
          <div className="investment-next-globe-stage">
            <div className="investment-next-orbit orbit-a" aria-hidden="true" />
            <div className="investment-next-orbit orbit-b" aria-hidden="true" />
            <div className="investment-next-globe" aria-hidden="true">
              <div className="investment-next-globe-texture" />
              <div className="investment-next-globe-brand" />
              <div className="investment-next-globe-grid" />
              <div className="investment-next-globe-light" />
            </div>
            <div className="investment-next-pathways">
              {c.hero.items.map((item, index) => (
                <div className={`investment-next-pathway pathway-${index + 1} ${pathwayStep > index + 1 ? "is-visible" : ""}`} key={item} aria-hidden={pathwayStep <= index + 1}>
                  <i aria-hidden="true" /><span>{item}</span>
                </div>
              ))}
              {pathwayStep < 6 ? (
                <div className="investment-next-pathway-focus" key={pathwayStep}>
                  <i aria-hidden="true" /><span>{c.hero.items[pathwayStep - 1]}</span>
                </div>
              ) : null}
            </div>
          </div>
        </section>
        </div>
      ) : <section className="investment-hero-scroll investment-hero-static" style={sectionStyle("hero")}>
        <div className="investment-hero-stage">
          <div className="investment-hero-media">
            <Image className="investment-hero-image" src="/assets/editorial/startime-investment-aerial-day-v2.webp" alt="" fill priority sizes="100vw" />
          </div>
          <div className="investment-hero-shade" />
          <div className="investment-hero-title"><h1>{c.hero.title}</h1><p>{c.hero.lead}</p></div>
          <div className="investment-orbit complete" aria-label={c.hero.items.join(", ")}>
            {c.hero.items.map((item, index) => (
              <div
                className={`investment-orbit-item item-${index + 1}`}
                key={item}
              >
                <i /><span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>)}

      {section("philosophy")?.visible !== false && <section className={`investment-philosophy investment-cms-section ${newDesign ? "investment-next-philosophy" : ""}`} id={section("philosophy")?.anchorID} style={sectionStyle("philosophy")}>
        <PageSectionBackdrop settings={section("philosophy")} />
        <Reveal className="investment-philosophy-copy">
          {element("philosophy", "eyebrow") && <p className="investment-label">{c.philosophy.label}</p>}
          {element("philosophy", "heading") && <h2>{c.philosophy.title}</h2>}
          {element("philosophy", "body") && c.philosophy.body.map((paragraph, index) => section("philosophy")?.paragraphs?.[index]?.visible === false ? null : <p className="investment-cms-paragraph" style={homepageItemStyle({ body: section("philosophy")?.paragraphs?.[index]?.style })} key={`${index}-${paragraph}`}>{paragraph}</p>)}
        </Reveal>
        {!newDesign ? <div className="investment-philosophy-media investment-reveal">
          <Image src="/assets/editorial/startime-strategic-events-hero-v2.webp" alt="" fill sizes="(max-width: 900px) 100vw, 45vw" />
          <span aria-hidden="true" />
        </div> : null}
      </section>}

      {section("domains")?.visible !== false && (newDesign ? <section className="investment-next-domains investment-cms-section" id={section("domains")?.anchorID || "investment-domains"} aria-label={c.domains.label} style={sectionStyle("domains")}>
        <PageSectionBackdrop settings={section("domains")} />
        <Reveal className="investment-next-domains-heading">
          {element("domains", "eyebrow") && <p className="investment-label">{c.domains.label}</p>}
          {element("domains", "heading") && <h2>{c.domains.title}</h2>}
        </Reveal>
        <div className="investment-next-domain-list">
          {element("domains", "items") && domains.map(({ item, originalIndex, settings: itemSettings }) => {
            const Icon = domainIcons[originalIndex] || domainIcons[0];
            return (
              <Reveal className="investment-next-domain-row" style={homepageItemStyle(itemSettings?.visual)} key={`${originalIndex}-${item.title}`}>
                <div className="investment-next-domain-heading">
                  <h3>{itemSettings?.icon || itemSettings?.icons ? <span className="investment-cms-icon-frame"><ArtDirectedImage className="investment-cms-icon" images={itemSettings.icons} fallback={itemSettings.icon || ""} alt="" fill={false} width={52} height={52} /></span> : <Icon aria-hidden="true" />}<span>{item.title}</span></h3>
                </div>
                <div className="investment-next-domain-panel">
                  <p>{item.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section> : <section className="investment-domains-programs investment-cms-section" id={section("domains")?.anchorID || "investment-domains"} aria-label={c.domains.label} style={sectionStyle("domains")}>
        <PageSectionBackdrop settings={section("domains")} />
        <div className="investment-domains-programs-intro">
          <div>
            {element("domains", "eyebrow") && <p className="investment-label">{c.domains.label}</p>}
            {element("domains", "heading") && <h2>{c.domains.title}</h2>}
          </div>
        </div>
        <div className="investment-domains-programs-layout">
          <div className="investment-domains-programs-visual">
            {domainImages.map((src, index) => <Image className={domain === index ? "active" : ""} src={src} alt="" fill sizes="(max-width: 900px) 100vw, 48vw" key={src} />)}
          </div>
          <div className="investment-domains-programs-accordion">
            {element("domains", "items") && domains.map(({ item, originalIndex: index }) => (
              <div className={`investment-domain-row ${domain === index ? "active" : ""}`} key={item.title}>
                <h3><button type="button" id={`investment-domain-heading-${locale}-${index}`} aria-expanded={domain === index} aria-controls={`investment-domain-panel-${locale}-${index}`} onClick={() => setDomain(index)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong></button></h3>
                <div className="investment-domain-panel" id={`investment-domain-panel-${locale}-${index}`} role="region" aria-labelledby={`investment-domain-heading-${locale}-${index}`} hidden={domain !== index}><p>{item.body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>)}

      {section("portfolios")?.visible !== false && <section className={`investment-portfolios investment-cms-section ${newDesign ? "investment-next-portfolios" : ""}`} id={section("portfolios")?.anchorID} style={sectionStyle("portfolios")}>
        <PageSectionBackdrop settings={section("portfolios")} />
        <Reveal className="investment-portfolios-heading">
          {element("portfolios", "eyebrow") && <p className="investment-label">{c.portfolios.label}</p>}
          {element("portfolios", "heading") && <h2>{c.portfolios.title}</h2>}
        </Reveal>
        <div className="investment-portfolio-grid">
          {element("portfolios", "items") && portfolios.map(({ item, originalIndex, settings: itemSettings }) => {
            const sharedIndex = ["government", "business", "community"].indexOf(itemSettings?.homepagePortfolio || "");
            const photoIndex = sharedIndex >= 0 ? sharedIndex : originalIndex;
            const photo = resolvePortfolioPhoto(portfolioPhotos?.[photoIndex], itemSettings, photoIndex);
            return (
              <Reveal className={`investment-portfolio-item ${newDesign ? "investment-portfolio-photo-card" : ""}`} style={homepageItemStyle(itemSettings?.visual)} key={`${originalIndex}-${item.title}`}>
                {newDesign
                  ? <>{element("portfolios", "media") && <div className="investment-portfolio-photo-media"><ArtDirectedImage images={photo.images} fallback={photo.image} alt="" /></div>}<div className="investment-portfolio-photo-copy"><h3>{item.title}</h3>{element("portfolios", "body") && <p>{item.body}</p>}</div></>
                  : <><span>{String(originalIndex + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.body}</p></>}
              </Reveal>
            );
          })}
        </div>
      </section>}

      {section("approach")?.visible !== false && <section className="investment-approach investment-cms-section" id={section("approach")?.anchorID} style={sectionStyle("approach")}>
        <PageSectionBackdrop settings={section("approach")} />
        <Reveal className="investment-approach-heading">
          {element("approach", "eyebrow") && <p className="investment-label">{c.approach.label}</p>}
          {element("approach", "heading") && <h2>{c.approach.title}</h2>}
        </Reveal>
        <div className="investment-approach-track">
          {element("approach", "items") && approach.map(({ item, originalIndex, settings: itemSettings }) => (
            <Reveal className="investment-approach-step" style={homepageItemStyle(itemSettings?.visual)} key={`${originalIndex}-${item.title}`}>
              {newDesign
                ? <span className="investment-approach-marker" aria-hidden="true"><ArtDirectedImage images={itemSettings?.icons} fallback={itemSettings?.icon || approachIcons[originalIndex] || approachIcons[0]} alt="" fill={false} width={226} height={204} /></span>
                : <span>{String(originalIndex + 1).padStart(2, "0")}</span>}<div><h3>{item.title}</h3><p>{item.body}</p></div>
            </Reveal>
          ))}
        </div>
      </section>}

      {section("impact")?.visible !== false && <section className="investment-impact-governance investment-cms-section" id={section("impact")?.anchorID || "investment-impact"} style={sectionStyle("impact")}>
        <PageSectionBackdrop settings={section("impact")} />
        <div className="investment-impact-governance-media">
          {element("impact", "media") && impacts.length > 0 && (() => {
            const first = impacts[0];
            const firstImage = first?.settings?.image || impactImages[first?.originalIndex ?? 0] || impactImages[0];
            const itemSettings = impacts[impact % impacts.length]?.settings;
            // One persistent background: shared fallback images never reanimate.
            // An explicit slide/device override still changes the source normally.
            return <ArtDirectedImage className="active" images={slideImagesWithFallback({ default: firstImage, ...first?.settings?.images }, { default: itemSettings?.image, ...itemSettings?.images }, firstImage)} fallback={firstImage} alt="" />;
          })()}
          <div />
        </div>
        <div className="investment-impact-governance-heading">{element("impact", "eyebrow") && <p className="investment-label">{c.impact.label}</p>}{element("impact", "heading") && <h2>{c.impact.title}</h2>}</div>
        <div className="investment-impact-governance-layout">
          {element("impact", "items") && impacts.length > 0 && <article className="investment-impact-governance-active" key={`${locale}-${impact}`} style={homepageItemStyle(impacts[impact % impacts.length]?.settings?.visual)}>
            <SlideCounter current={impact + 1} total={impactTotal} />
            <h3>{impacts[impact % impacts.length].item.title}</h3>
            <p>{impacts[impact % impacts.length].item.body}</p>
            <ul>{impacts[impact % impacts.length].item.points.map((point) => <li key={point}>{point}</li>)}</ul>
            <div className={`investment-impact-governance-controls ${square ? "carousel-control-pair" : ""}`}>
              {square ? <>
                <button className="carousel-arrow carousel-arrow-prev" type="button" disabled={impact <= 0} onClick={() => moveImpact(-1)} aria-label={rtl ? "الأثر السابق" : "Previous impact"}><CarouselArrow /></button>
                <button className="carousel-arrow carousel-arrow-next" type="button" disabled={impact >= impactTotal - 1} onClick={() => moveImpact(1)} aria-label={rtl ? "الأثر التالي" : "Next impact"}><CarouselArrow /></button>
              </> : <>
                <button type="button" onClick={() => moveImpact(-1)} aria-label={rtl ? "الأثر السابق" : "Previous impact"}><ArrowLeft aria-hidden="true" /></button>
                <button type="button" onClick={() => moveImpact(1)} aria-label={rtl ? "الأثر التالي" : "Next impact"}><ArrowRight aria-hidden="true" /></button>
              </>}
            </div>
          </article>}
        </div>
      </section>}

      {section("projects")?.visible !== false && projectPortfolios.length > 0 && <section className="investment-projects investment-cms-section" id={section("projects")?.anchorID || "investment-projects"} style={sectionStyle("projects")}>
        <PageSectionBackdrop settings={section("projects")} />
        <Reveal className="investment-projects-heading">
          {element("projects", "eyebrow") && <p className="investment-label">{c.projects.label}</p>}{element("projects", "heading") && <h2>{c.projects.title}</h2>}{element("projects", "body") && <p>{c.projects.body}</p>}
        </Reveal>
        <div className="investment-projects-portfolios" role="tablist">
          {projectPortfolios.map((item, index) => <button className={portfolio === index ? "active" : ""} type="button" role="tab" aria-selected={portfolio === index} onClick={() => choosePortfolio(index)} key={item.title}>{item.title}</button>)}
        </div>
        <div className="investment-project-showcase">
          {element("projects", "media") && <div className="investment-project-image" key={activeProject.image}><ArtDirectedImage images={activeProject.imageSettings?.images} fallback={activeProject.imageSettings?.image || activeProject.image} alt="" /></div>}
          <article key={`${portfolio}-${project}`} style={homepageItemStyle(activeProject.imageSettings?.visual)}>
            {(activeProject.imageSettings?.logo || activeProject.logo) ? <div className="investment-project-logo"><TrimmedProjectLogo src={activeProject.imageSettings?.logo || activeProject.logo || ""} rtl={rtl} /></div> : null}
            <h3>{activeProject.title}</h3><p>{activeProject.body}</p>{element("projects", "cta") && <a href={safeInvestmentURL(activeProject.imageSettings?.url, "#investment-closing")}>{c.projects.cta}</a>}
            <div className={`investment-project-controls ${square ? "carousel-control-pair" : ""}`}>
              {square
                ? <button className="carousel-arrow carousel-arrow-prev" type="button" disabled={project <= 0} onClick={() => moveProject(-1)} aria-label="Previous"><CarouselArrow /></button>
                : <button type="button" onClick={() => moveProject(rtl ? 1 : -1)} aria-label="Previous"><ArrowLeft aria-hidden="true" /></button>}
              <SlideCounter current={project + 1} total={activeProjects.length} />
              {square
                ? <button className="carousel-arrow carousel-arrow-next" type="button" disabled={project >= activeProjects.length - 1} onClick={() => moveProject(1)} aria-label="Next"><CarouselArrow /></button>
                : <button type="button" onClick={() => moveProject(rtl ? -1 : 1)} aria-label="Next"><ArrowRight aria-hidden="true" /></button>}
            </div>
          </article>
        </div>
        <div className="investment-project-rail">
          {activeProjects.map((item, index) => <button className={project === index ? "active" : ""} type="button" onClick={() => setProject(index)} key={item.title}>{item.logo ? <span><TrimmedProjectLogo src={item.logo} centered /></span> : <strong>{item.title}</strong>}</button>)}
        </div>
      </section>}

      {section("closing")?.visible !== false && <section className="investment-closing investment-cms-section" id={section("closing")?.anchorID || "investment-closing"} style={sectionStyle("closing")}>
        {element("closing", "media") && <ArtDirectedImage images={section("closing")?.images} fallback={section("closing")?.image || (newDesign ? "/assets/editorial/investment-closing-library.webp" : "/assets/editorial/home4-startime-future-v1.webp")} alt="" />}
        <PageSectionBackdrop settings={section("closing")} />
        {!newDesign && <div aria-hidden="true" />}
        <Reveal>{element("closing", "heading") && <><h2>{c.closing.title}</h2><h3>{c.closing.subtitle}</h3></>}{element("closing", "body") && <p>{c.closing.body}</p>}{element("closing", "cta") && <a href={safeInvestmentURL(c.closing.ctaURL, "mailto:info@startime.sa")}>{c.closing.cta}</a>}</Reveal>
      </section>}

      <NewSiteFooter locale={locale} />
    </main>
  );
}
