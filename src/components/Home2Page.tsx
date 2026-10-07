"use client";

import Image from "next/image";
import { SlideCounter } from "./SlideCounter";
import { postPath } from "@/lib/postPath";
import Link from "./CmsLink";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { homeContent, projects, type Locale } from "@/content/home";
import { impactMedia } from "@/content/impactMedia";
import { homeMediaPartners } from "@/content/homeMediaPartners";
import type { NewSiteCmsHome } from "@/content/newSiteCmsHome";
import { homepageItemStyle, homepageVisualStyle, type HomepageItemVisual } from "@/content/homepageVisual";
import { portfolioTopPaddingStyle } from "@/content/portfolioTopPadding";
import { portfolioImages } from "@/content/portfolioImages";
import { getNewHomepageProjects } from "@/content/newPageProjects";
import { getNewsImageVariants, getPostCopy, getPostSummary, insightPosts, type InsightPost } from "@/content/insightPosts";
import { ResponsiveNewsImage } from "@/components/ResponsiveNewsImage";
import { ArtDirectedImage, ArtDirectedVideo, resolveViewportImages, type ViewportImages } from "@/components/ArtDirectedImage";
import { AnimationSection } from "@/components/AnimationPage";
import { NewSiteHeader } from "@/components/NewSiteHeader";
import { NewSiteFooter } from "@/components/NewSiteFooter";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { Cpu } from "@phosphor-icons/react/Cpu";
import { Leaf } from "@phosphor-icons/react/Leaf";
import { LockKey } from "@phosphor-icons/react/LockKey";
import { ShieldCheck } from "@phosphor-icons/react/ShieldCheck";
import { UsersThree } from "@phosphor-icons/react/UsersThree";
import { canonicalizePublicHref, publicPath } from "@/lib/publicPath";
import { useExternalLinkAttributes } from "./ExternalLinkPolicy";

const Arrow = () => <ArrowRight aria-hidden="true" />;
const CarouselArrow = () => <span className="carousel-arrow-shape" aria-hidden="true" />;

function HomeSectionBackdrop({ section }: { section?: NonNullable<NewSiteCmsHome["sectionAppearance"]>[string] }) {
  if (!section?.backgroundImages && !section?.backgroundVideos) return null;
  const opacity = Math.min(90, Math.max(0, section.overlayOpacity ?? 0)) / 100;
  return <div className="cms-home-backdrop" aria-hidden="true">
    {section.backgroundImages && <ArtDirectedImage images={section.backgroundImages} fallback="" />}
    <ArtDirectedVideo videos={section.backgroundVideos} />
    {opacity > 0 && <span className="cms-home-backdrop-overlay" style={{ backgroundColor: `rgba(46,36,73,${opacity})` }} />}
  </div>;
}

function TintablePattern({ images, fallback, tint, className = "" }: { images?: ViewportImages; fallback: string; tint?: string | null; className?: string }) {
  if (!tint || !/^#[0-9a-f]{6}$/i.test(tint)) return <ArtDirectedImage className={className} images={images} fallback={fallback} alt="" />;
  const viewports = ["mobile", "tablet", "laptop", "desktop", "imac"] as const;
  const resolved = resolveViewportImages(images, fallback);
  return <>{viewports.map((viewport) => {
    const source = resolved[viewport];
    const safeSource = /^(\/api\/media\/file\/|\/assets\/)[^"'()\\]*$/.test(source) ? source : fallback;
    return <span
      key={viewport}
      className={`cms-pattern-tint cms-pattern-tint-${viewport} ${className}`}
      style={{ backgroundColor: tint, WebkitMaskImage: `url("${safeSource}")`, maskImage: `url("${safeSource}")` }}
      aria-hidden="true"
    />;
  })}</>;
}

function TintableIcon({ images, fallback, tint }: { images?: ViewportImages; fallback: string; tint?: string | null }) {
  if (!tint || !/^#[0-9a-f]{6}$/i.test(tint)) return <ArtDirectedImage images={images} fallback={fallback} fill={false} width={226} height={204} />;
  const viewports = ["mobile", "tablet", "laptop", "desktop", "imac"] as const;
  const resolved = resolveViewportImages(images, fallback);
  return <>{viewports.map((viewport) => {
    const source = resolved[viewport];
    const safeSource = /^(\/api\/media\/file\/|\/assets\/)[^"'()\\]*$/.test(source) ? source : fallback;
    return <span key={viewport} className={`cms-icon-tint cms-icon-tint-${viewport}`} style={{ backgroundColor: tint, WebkitMaskImage: `url("${safeSource}")`, maskImage: `url("${safeSource}")` }} />;
  })}</>;
}

const domainImages = [
  "/assets/editorial/startime-strategic-events-hero-v2.webp",
  "/assets/projects/maritime-forum-featured-v2.webp",
  "/assets/editorial/startime-triple-s-command-center.webp",
  "/assets/projects/blue-economy-v2.webp",
  "/assets/editorial/startime-team-ministry-environment-event.png",
];

// The same index maps to the English and Arabic investment-domain copy.
const domainIcons = [
  "/assets/ui/investment-icons/defense-capabilities-v3.svg",
  "/assets/ui/investment-icons/national-security-v3.svg",
  "/assets/ui/investment-icons/advanced-technologies-v3.svg",
  "/assets/ui/investment-icons/environmental-issues-v3.svg",
  "/assets/ui/investment-icons/women-and-children-v3.svg",
];
const legacyDomainIcons = [ShieldCheck, LockKey, Cpu, Leaf, UsersThree];


const impactImages = impactMedia.map((item) => item.default);

const home4HeroImages = [
  "/assets/editorial/home4-heritage-future-v1.webp",
  "/assets/editorial/home4-najd-origin-v1.webp",
  "/assets/editorial/home4-startime-future-v1.webp",
];

const home5HeroImages = [
  "/assets/editorial/home5-maritime-forum.webp",
  "/assets/editorial/home5-heritage-doorway-v3-optimized.webp",
  "/assets/editorial/home5-shape-future-full-optimized.webp",
];

const HOME_HERO_SCENE_COUNT = 3;

const home5HeroContent: Record<Locale, {
  eyebrow: string;
  title: string;
  description: string;
  heritage: string;
  future: string;
}> = {
  en: {
    eyebrow: "STARTIME Signature Event",
    title: "Saudi International Maritime Forum",
    description: "A Saudi Global Platform Advancing Dialogue and Collaboration on the Future of Maritime Energy Security, Trade, and Data.",
    heritage: "Heritage",
    future: "We Shape the Future",
  },
  ar: {
    eyebrow: "حدث رئيسي لستارتايم",
    title: "الملتقى البحري السعودي الدولي الرابع",
    description: "منصة سعودية عالمية للحوار والتعاون حول مستقبل أمن الطاقة والتجارة والبيانات عبر البحار",
    heritage: "عراقة",
    future: "تصنع المستقبل",
  },
};

function Reveal({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={`h2-reveal ${className}`} style={style}>{children}</div>;
}

function useScrollChapter<T extends HTMLElement>(count: number, enabled = true) {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element || count < 2 || !enabled) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const staticLargeLayout = window.matchMedia("(min-width: 2000px) and (min-height: 1000px)").matches;
      if (window.innerWidth <= 900 || staticLargeLayout) return;
      const bounds = element.getBoundingClientRect();
      const travel = Math.max(1, element.offsetHeight - window.innerHeight);
      const progress = Math.min(0.999, Math.max(0, -bounds.top / travel));
      const next = Math.min(count - 1, Math.round(progress * (count - 1)));
      setActive((current) => (current === next ? current : next));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [count, enabled]);

  return [ref, active, setActive] as const;
}

function Home4Hero({ locale, newHomepage = false, newMain = false, cmsOpening, orderStyle, anchorID, background }: { locale: Locale; newHomepage?: boolean; newMain?: boolean; cmsOpening?: NewSiteCmsHome["opening"]; orderStyle?: CSSProperties; anchorID?: string; background?: NonNullable<NewSiteCmsHome["sectionAppearance"]>[string] }) {
  const c = homeContent[locale];
  const heroImages = newHomepage ? cmsOpening?.images || home5HeroImages : home4HeroImages;
  const home5Copy = cmsOpening ? {
    eyebrow: cmsOpening.eyebrow,
    title: cmsOpening.heading,
    description: cmsOpening.description,
    heritage: cmsOpening.heritageHeading,
    future: cmsOpening.futureHeading,
  } : home5HeroContent[locale];
  const forumHref = cmsOpening?.headingURL?.trim() || (newMain ? `https://sim.startime.sa${locale === "ar" ? "/ar" : ""}` : undefined);
  const externalAttributes = useExternalLinkAttributes();
  const heroRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const skipPresentation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const hero = heroRef.current;
    if (!hero) return;
    const panorama = hero.parentElement?.querySelector<HTMLElement>(".cms-home-panorama-order");
    const presentationEnd = Math.max(hero.getBoundingClientRect().bottom, panorama?.getBoundingClientRect().bottom || 0) + window.scrollY;
    const target = Array.from(hero.parentElement?.querySelectorAll<HTMLElement>("section, footer") || [])
      .filter((element) => element !== hero && !hero.contains(element) && !panorama?.contains(element))
      .filter((element) => element.getBoundingClientRect().height > 0 && element.getBoundingClientRect().top + window.scrollY >= presentationEnd - 2)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
    if (!target) return;
    event.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };
  const [periodLabel = "", legacyBody = "", originLabel = "", originBody = ""] = c.hero.body.split("\n\n");

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let frame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sceneImages = Array.from(hero.querySelectorAll<HTMLElement>(".home4-hero-image"));
    const update = () => {
      frame = 0;
      const bounds = hero.getBoundingClientRect();
      const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
      const progress = Math.min(0.999, Math.max(0, -bounds.top / travel));
      const stagePosition = progress * HOME_HERO_SCENE_COUNT;
      const nextStage = Math.min(HOME_HERO_SCENE_COUNT - 1, Math.floor(stagePosition));
      const sceneProgress = Math.min(1, stagePosition - nextStage);
      const compact = window.innerWidth <= 900;
      const horizontalDirection = locale === "ar" ? -1 : 1;
      const copyFadeStart = newHomepage && nextStage === 2 ? 0.92 : 0.56;
      const copyFade = reducedMotion
        ? 1
        : 1 - Math.max(0, (sceneProgress - copyFadeStart) / (1 - copyFadeStart));
      const copyScale = reducedMotion ? 1 : 1 + sceneProgress * (compact ? 0.025 : 0.045);

      sceneImages.forEach((image, index) => {
        const imageProgress = reducedMotion ? 0 : index < nextStage ? 1 : index === nextStage ? sceneProgress : 0;
        if (newHomepage && index === 0) {
          const copyTravel = imageProgress * (compact ? 68 : 62) * horizontalDirection;
          const imageScale = 1.02 + imageProgress * (compact ? 0.18 : 0.24);
          image.style.setProperty("--home5-scene-scale", imageScale.toFixed(3));
          hero.style.setProperty("--home5-forum-pan-x", `${copyTravel.toFixed(2)}vw`);
          return;
        }
        const thirdScene = newHomepage && index === 2;
        const easedImageProgress = thirdScene
          ? Math.max(0, (imageProgress - 0.12) / 0.88)
          : imageProgress;
        const zoomDistance = thirdScene
          ? 0.08
          : index === 1
            ? compact ? 0.72 : 1.05
            : compact ? 0.48 : 0.78;
        const shiftDistance = thirdScene
          ? 0
          : index === 1
            ? compact ? 0.6 : 1.1
            : compact ? 1.5 : 3;
        const baseScale = thirdScene ? 1 : 1.015;

        image.style.setProperty("--home4-scene-scale", (baseScale + easedImageProgress * zoomDistance).toFixed(3));
        image.style.setProperty("--home4-scene-shift", `${(-easedImageProgress * shiftDistance).toFixed(2)}%`);
      });
      hero.style.setProperty("--home4-copy-opacity", copyFade.toFixed(3));
      hero.style.setProperty("--home4-copy-scale", copyScale.toFixed(3));
      if (newHomepage && nextStage === 1) {
        const doorProgress = reducedMotion ? 0 : sceneProgress;
        hero.style.setProperty("--home5-door-copy-scale", Math.max(.36, 1 - doorProgress * .64).toFixed(3));
        hero.style.setProperty("--home5-door-copy-y", `${(-doorProgress * (compact ? 1.2 : 2.4)).toFixed(2)}vh`);
        hero.style.setProperty("--home5-door-copy-blur", `${(doorProgress * 2.2).toFixed(2)}px`);
      } else {
        hero.style.setProperty("--home5-door-copy-scale", "1");
        hero.style.setProperty("--home5-door-copy-y", "0vh");
        hero.style.setProperty("--home5-door-copy-blur", "0px");
      }
      const futureCopyProgress = newHomepage && nextStage === 2 && !reducedMotion ? sceneProgress : 0;
      hero.style.setProperty(
        "--home5-future-copy-y",
        `${(-futureCopyProgress * (compact ? 26 : 34)).toFixed(2)}vh`,
      );

      setActiveStage((current) => (current === nextStage ? current : nextStage));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [locale, newHomepage]);

  return (
    <section className="home4-hero" id={anchorID || "home4-hero"} ref={heroRef} aria-labelledby="home4-hero-heading" style={{ ...homepageVisualStyle(cmsOpening?.visual), ...orderStyle }}>
      <div className="home4-hero-stage">
        <HomeSectionBackdrop section={background} />
        <div className="home4-hero-images" aria-hidden="true">
          {heroImages.map((src, index) => {
            const className = `home4-hero-image home4-hero-image-${index} ${activeStage === index ? "active" : ""}`;
            if (newHomepage && index === 2) {
              return (
                <span className={`home5-shape-future-frame ${activeStage === index ? "active" : ""}`} key="home5-shape-future-responsive">
                  <ArtDirectedImage className={`${className} ${cmsOpening?.scenes?.[index]?.images ? "cms-responsive" : ""}`} images={cmsOpening?.scenes?.[index]?.images} fallback={src} loading="eager" />
                  <ArtDirectedVideo className={`home4-hero-video ${activeStage === index ? "active" : ""}`} videos={cmsOpening?.scenes?.[index]?.videos} poster={src} />
                </span>
              );
            }
            return (
              <span className="home4-hero-scene" key={src}>
                <ArtDirectedImage className={`${className} ${cmsOpening?.scenes?.[index]?.images ? "cms-responsive" : ""}`} images={cmsOpening?.scenes?.[index]?.images} fallback={src} loading={index === 0 ? "eager" : "lazy"} />
                <ArtDirectedVideo className={`home4-hero-video ${activeStage === index ? "active" : ""}`} videos={cmsOpening?.scenes?.[index]?.videos} poster={src} />
              </span>
            );
          })}
        </div>
        <div className="home4-hero-shade" aria-hidden="true" />

        {newHomepage ? (
          <>
            <div className={`home4-hero-copy home5-hero-forum ${activeStage === 0 ? "active" : ""}`} aria-hidden={activeStage !== 0} style={homepageVisualStyle(cmsOpening?.scenes?.[0]?.visual)}>
              <span>{cmsOpening ? home5Copy.eyebrow : newMain && locale === "en" ? "Startime Flagship Event" : home5Copy.eyebrow}</span>
              <h1 id="home4-hero-heading">{home5Copy.title}</h1>
              <p>{home5Copy.description}</p>
              {forumHref && cmsOpening?.showDiscoverButton !== false && <a className="home5-hero-discover" href={forumHref} tabIndex={activeStage === 0 ? 0 : -1} style={{ color: /^#[0-9a-f]{6}$/i.test(cmsOpening?.discoverTextColor || "") ? cmsOpening?.discoverTextColor : "#ffffff", borderColor: /^#[0-9a-f]{6}$/i.test(cmsOpening?.discoverBorderColor || "") ? cmsOpening?.discoverBorderColor : "#74659f", backgroundColor: /^#[0-9a-f]{6}$/i.test(cmsOpening?.discoverBackgroundColor || "") ? cmsOpening?.discoverBackgroundColor : "#74659f" }} {...externalAttributes(forumHref, `section:${(anchorID || "home4-hero").replace(/[^\w-]/g, "-")}`)}>{cmsOpening?.discoverLabel || (locale === "ar" ? "اكتشف المزيد" : "Discover More")}</a>}
            </div>

            <div className={`home4-hero-copy home5-hero-word home5-hero-door ${activeStage === 1 ? "active" : ""}`} aria-hidden={activeStage !== 1} style={homepageVisualStyle(cmsOpening?.scenes?.[1]?.visual)}>
              <h2>{home5Copy.heritage}</h2>
            </div>
            {activeStage === 1 && cmsOpening?.showPresentationSkip !== false && <a className="home5-presentation-skip" href="#home2-value" onClick={skipPresentation}>{cmsOpening?.presentationSkipLabel || (locale === "ar" ? "تخطى العرض" : "Skip the presentation")}</a>}

            <div className={`home4-hero-copy home5-hero-word home5-hero-future ${activeStage === 2 ? "active" : ""}`} aria-hidden={activeStage !== 2} style={homepageVisualStyle(cmsOpening?.scenes?.[2]?.visual)}>
              <h2>{home5Copy.future}</h2>
            </div>
          </>
        ) : (
          <>
            <div className={`home4-hero-copy home4-hero-title ${activeStage === 0 ? "active" : ""}`} aria-hidden={activeStage !== 0}>
              <h1 id="home4-hero-heading">{c.hero.title}</h1>
            </div>

            <div className={`home4-hero-copy home4-hero-story ${activeStage === 1 ? "active" : ""}`} aria-hidden={activeStage !== 1}>
              <span>{periodLabel}</span>
              <p>{legacyBody}</p>
            </div>

            <div className={`home4-hero-copy home4-hero-story home4-hero-final ${activeStage === 2 ? "active" : ""}`} aria-hidden={activeStage !== 2}>
              <span>{originLabel}</span>
              <p>{originBody}</p>
              <a className="button button-accent" href="#home2-value">{c.hero.cta}<Arrow /></a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function AnimatedNumber({ value, label, delay, billion = false, locale = "en", style }: { value: string; label: string; delay: number; billion?: boolean; locale?: Locale; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const element = ref.current;
    const match = value.match(/[\d.]+/);
    if (!element || !match) return;
    const numeric = Number(match[0]);
    const decimals = match[0].includes(".") ? 1 : 0;
    const prefix = value.slice(0, value.indexOf(match[0]));
    const suffix = value.slice(value.indexOf(match[0]) + match[0].length);
    let animationFrame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplay(value);
        return;
      }
      const start = performance.now() + delay;
      const animate = (now: number) => {
        const progress = Math.min(1, Math.max(0, (now - start) / 1200));
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(`${prefix}${(numeric * eased).toFixed(decimals)}${suffix}`);
        if (progress < 1) animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [delay, value]);

  return <div className={`home2-stat ${billion ? "home2-stat-billion" : ""}`} ref={ref} style={style}>
    <strong aria-label={billion ? `${value} ${locale === "ar" ? "مليار" : "billion"}` : value}>
      {billion ? <><span className="home2-stat-number">{display}</span><span className="home2-stat-unit"><small>{locale === "ar" ? "مليار" : "billion"}</small><span className="home2-stat-riyal" aria-hidden="true" /></span></> : display}
    </strong>
    <span>{label}</span>
  </div>;
}

export function Home2Page({
  locale,
  variant = "home2",
  square = false,
  newMain = false,
  posts = insightPosts,
  cmsHome,
  cmsContent,
}: {
  locale: Locale;
  variant?: "home2" | "home3" | "home4" | "home5";
  route?: "" | "home1" | "home2" | "home3" | "home4" | "home5";
  square?: boolean;
  newMain?: boolean;
  posts?: InsightPost[];
  cmsHome?: NewSiteCmsHome;
  cmsContent?: (typeof homeContent)["en"];
}) {
  const externalAttributes = useExternalLinkAttributes();
  const c = newMain && locale === "en" ? {
    ...homeContent.en,
    value: {
      ...homeContent.en.value,
      body: "We believe in an enduring truth: innovation and sustainable impact are the true foundations of growth. Guided by this conviction, we have dedicated ourselves to creating, investing in, and organizing innovative events that look ahead to the promising horizons of the future and achieve the impact we envision.\n\nWe develop high-impact government initiatives, specialized international exhibitions, and purpose-driven community projects that contribute to building business platforms that create value, strengthen partnerships, and support economic and knowledge growth. Through this approach, and with the help of Allah and the support of our wise government, we aspire to contribute to enhancing the competitiveness of Saudi Arabia and reinforcing its position among global competitiveness indicators in the MICE industry.",
    },
    projects: { ...homeContent.en.projects, label: "Startime Projects" },
  } : { ...homeContent[locale] };
  if (cmsContent) {
    c.team = cmsContent.team;
    c.triple = cmsContent.triple;
    c.partners = cmsContent.partners;
    c.news = cmsContent.news;
    c.footerBio = cmsContent.footerBio;
  }
  if (cmsHome?.value) {
    c.value = {
      label: cmsHome.value.eyebrow,
      title: cmsHome.value.heading,
      body: cmsHome.value.body,
    };
    if (cmsHome.value.statistics.length) c.stats = cmsHome.value.statistics;
  }
  if (cmsHome?.domains) {
    c.domains = {
      label: cmsHome.domains.eyebrow,
      title: cmsHome.domains.heading,
      body: cmsHome.domains.body,
      items: cmsHome.domains.items.map(({ title, body }) => ({ title, body })),
    };
  }
  if (cmsHome?.portfolios) {
    c.portfolios = {
      label: cmsHome.portfolios.eyebrow,
      title: cmsHome.portfolios.heading,
      body: cmsHome.portfolios.body,
      items: cmsHome.portfolios.items.map(({ title, body }) => ({ title, body })),
    };
  }
  if (cmsHome?.impact) {
    c.impact = {
      ...c.impact,
      label: cmsHome.impact.eyebrow,
      title: cmsHome.impact.heading,
      items: cmsHome.impact.items.map(({ title, body }) => ({ title, body })),
    };
  }
  if (cmsHome?.projects) {
    c.projects = {
      label: cmsHome.projects.eyebrow,
      title: cmsHome.projects.heading,
      body: cmsHome.projects.body,
      cta: cmsHome.projects.ctaLabel,
    };
  }
  const rtl = locale === "ar";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const staticHomeSections = variant === "home5";
  const primaryHomeVariation = variant === "home5" && square;
  const pageProjects: Array<{ title: string; ar: string; projectName?: string; description: string; arDescription: string; image: string; logo: string; images?: ViewportImages; logos?: ViewportImages; destination?: string; visual?: HomepageItemVisual }> = cmsHome?.projects
    ? cmsHome.projects.items.map((item) => ({
        title: item.title,
        ar: item.title,
        projectName: item.projectName,
        description: item.body,
        arDescription: item.body,
        image: item.image,
        logo: item.logo,
        images: item.images,
        logos: item.logos,
        destination: item.destination,
        visual: item.visual,
      }))
    : primaryHomeVariation ? getNewHomepageProjects(newMain && locale === "en") : projects;
  const [domainsRef, domain, setDomain] = useScrollChapter<HTMLElement>(c.domains.items.length, !staticHomeSections);
  const [impactRef, impact, setImpact] = useScrollChapter<HTMLElement>(c.impact.items.length, !staticHomeSections);
  const [projectsRef, project, setProject] = useScrollChapter<HTMLElement>(pageProjects.length, !staticHomeSections);
  const [newsPage, setNewsPage] = useState(0);
  const [newsVisibleCount, setNewsVisibleCount] = useState(3);
  const domainAtlasRef = useRef<HTMLDivElement>(null);
  const domainTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const impactListRef = useRef<HTMLDivElement>(null);
  const impactTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const projectWindowRef = useRef<HTMLDivElement>(null);
  const projectTabsRef = useRef<HTMLDivElement>(null);
  const projectTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const newsTrackRef = useRef<HTMLDivElement>(null);
  const newsCardRefs = useRef<Array<HTMLElement | null>>([]);
  const newsAutoDirectionRef = useRef(1);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    if (!staticHomeSections) document.querySelectorAll(".home2 .h2-reveal").forEach((element) => observer.observe(element));
    let frame = 0;
    const updateHeader = () => {
      frame = 0;
      const immersiveSection = variant === "home5"
        ? document.querySelector<HTMLElement>(".animation-scroll")
        : variant === "home4"
          ? document.querySelector<HTMLElement>(".home4-hero")
          : null;
      const threshold = immersiveSection ? immersiveSection.offsetTop + immersiveSection.offsetHeight - 78 : 40;
      setScrolled(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateHeader);
    };
    updateHeader();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [locale, rtl, staticHomeSections, variant]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!primaryHomeVariation) return;
    const updateVisibleNews = () => {
      const next = window.innerWidth <= 700 ? 1 : 3;
      setNewsVisibleCount((current) => current === next ? current : next);
      setNewsPage(0);
      newsTrackRef.current?.scrollTo({ left: 0, behavior: "auto" });
    };
    updateVisibleNews();
    window.addEventListener("resize", updateVisibleNews, { passive: true });
    return () => window.removeEventListener("resize", updateVisibleNews);
  }, [primaryHomeVariation]);

  useEffect(() => {
    const rail = domainAtlasRef.current;
    const tab = domainTabRefs.current[domain];
    if (!rail || !tab || window.innerWidth > 900 || staticHomeSections) return;
    const frame = requestAnimationFrame(() => {
      tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [domain, staticHomeSections]);

  useEffect(() => {
    const list = impactListRef.current;
    const tab = impactTabRefs.current[impact];
    if (!list || !tab || window.innerWidth <= 900 || staticHomeSections) return;
    const frame = requestAnimationFrame(() => {
      list.scrollTo({ top: tab.offsetTop - list.clientHeight / 2 + tab.offsetHeight / 2, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [impact, staticHomeSections]);

  useEffect(() => {
    const rail = projectTabsRef.current;
    const tab = projectTabRefs.current[project];
    if (!rail || !tab) return;
    const frame = requestAnimationFrame(() => {
      const railBox = rail.getBoundingClientRect();
      const tabBox = tab.getBoundingClientRect();
      rail.scrollBy({ left: tabBox.left + tabBox.width / 2 - railBox.left - railBox.width / 2, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [project]);

  const newsPerPage = 3;
  const publishedNews = posts.filter((post) => post.type === "news" && post.showOnHomepage !== false);
  const homepageNews = (cmsHome?.news?.selectionMode === "manual"
    ? cmsHome.news.selectedIDs.flatMap((id) => {
        const post = posts.find((candidate) => candidate.cmsId === id);
        return post ? [post] : [];
      })
    : publishedNews).slice(0, cmsHome?.news?.maximumItems || (primaryHomeVariation ? 9 : 6));
  const newsPageCount = Math.ceil(homepageNews.length / (primaryHomeVariation ? newsVisibleCount : newsPerPage));
  const newsItems = primaryHomeVariation ? homepageNews : homepageNews.slice(newsPage * newsPerPage, (newsPage + 1) * newsPerPage);
  const homepageNewsLabel = c.news.label;
  const homepageNewsCta = cmsHome?.news ? c.news.cta : primaryHomeVariation ? (rtl ? "عرض جميع الأخبار" : "Find All News") : c.news.cta;
  const homepageNewsHref = canonicalizePublicHref(cmsHome?.news?.ctaURL || publicPath(locale, primaryHomeVariation ? "latest-news" : "insights"));
  const partnerLogos = cmsHome ? cmsHome.partners?.logos || [] : undefined;
  const partnerLogoCount = partnerLogos?.length ?? (newMain ? homeMediaPartners.length : 15);
  const partnerMarqueeMode = partnerLogoCount > 5 ? "is-looping" : partnerLogoCount > 2 ? "is-mobile-loop" : "is-static";
  const partnerMarqueeRef = useRef<HTMLDivElement>(null);
  const [partnerLogoCopies, setPartnerLogoCopies] = useState(partnerLogoCount > 2 ? 2 : 1);
  const [partnerMediaActive, setPartnerMediaActive] = useState(false);
  const [partnerMediaReady, setPartnerMediaReady] = useState(false);

  useEffect(() => {
    const marquee = partnerMarqueeRef.current;
    if (!marquee || partnerLogoCount <= 2) return;
    const updateCopies = () => {
      const imageWidth = window.innerWidth <= 540 ? 180 : 215;
      const setWidth = partnerLogoCount * imageWidth;
      const next = Math.max(2, Math.ceil(marquee.clientWidth / setWidth) + 1);
      if (next !== partnerLogoCopies) {
        setPartnerMediaReady(false);
        setPartnerLogoCopies(next);
      }
    };
    updateCopies();
    window.addEventListener("resize", updateCopies, { passive: true });
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setPartnerMediaActive(true);
        observer.disconnect();
      }
    }, { rootMargin: "100% 0px" });
    observer.observe(marquee);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateCopies);
    };
  }, [partnerLogoCount, partnerLogoCopies]);

  useEffect(() => {
    if (!partnerMediaActive || partnerLogoCount <= 2) return;
    const images = Array.from(partnerMarqueeRef.current?.querySelectorAll("img") || []);
    let cancelled = false;
    Promise.all(images.map((image) => image.decode().catch(() => undefined))).then(() => {
      if (!cancelled) setPartnerMediaReady(true);
    });
    return () => { cancelled = true; };
  }, [partnerMediaActive, partnerLogoCopies, partnerLogoCount]);
  const selectNewsPage = (page: number) => {
    const boundedPage = Math.max(0, Math.min(newsPageCount - 1, page));
    setNewsPage(boundedPage);
    if (!primaryHomeVariation) return;
    const track = newsTrackRef.current;
    const card = newsCardRefs.current[boundedPage * newsVisibleCount];
    if (!track || !card) return;
    const trackBounds = track.getBoundingClientRect();
    const cardBounds = card.getBoundingClientRect();
    const distance = rtl ? cardBounds.right - trackBounds.right : cardBounds.left - trackBounds.left;
    track.scrollBy({ left: distance, behavior: "smooth" });
  };
  const syncNewsPageFromScroll = () => {
    if (!primaryHomeVariation) return;
    const track = newsTrackRef.current;
    if (!track) return;
    const trackBounds = track.getBoundingClientRect();
    const trackEdge = rtl ? trackBounds.right : trackBounds.left;
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    newsCardRefs.current.forEach((card, index) => {
      if (!card) return;
      const bounds = card.getBoundingClientRect();
      const edge = rtl ? bounds.right : bounds.left;
      const distance = Math.abs(edge - trackEdge);
      if (distance < nearestDistance) {
        nearest = index;
        nearestDistance = distance;
      }
    });
    setNewsPage(nearest >= homepageNews.length - newsVisibleCount ? newsPageCount - 1 : Math.min(newsPageCount - 1, Math.round(nearest / newsVisibleCount)));
  };
  useEffect(() => {
    const track = newsTrackRef.current;
    if (!primaryHomeVariation || !track || homepageNews.length <= newsVisibleCount || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = track.closest(".home2-news");
    const pauseForPointerInteraction = window.matchMedia("(hover: hover) and (pointer: fine)");
    let visible = false;
    newsAutoDirectionRef.current = 1;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.2 });
    observer.observe(track);
    const timer = window.setInterval(() => {
      if (!visible || document.hidden || (pauseForPointerInteraction.matches && section?.matches(":hover, :focus-within"))) return;
      const cards = newsCardRefs.current.slice(0, homepageNews.length);
      const trackBounds = track.getBoundingClientRect();
      const trackEdge = rtl ? trackBounds.right : trackBounds.left;
      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      cards.forEach((card, index) => {
        if (!card) return;
        const bounds = card.getBoundingClientRect();
        const distance = Math.abs((rtl ? bounds.right : bounds.left) - trackEdge);
        if (distance < nearestDistance) {
          nearest = index;
          nearestDistance = distance;
        }
      });
      const lastStart = cards.length - newsVisibleCount;
      if (nearest >= lastStart) newsAutoDirectionRef.current = -1;
      if (nearest <= 0) newsAutoDirectionRef.current = 1;
      const nextCard = cards[nearest + newsAutoDirectionRef.current];
      if (!nextCard) return;
      const bounds = nextCard.getBoundingClientRect();
      track.scrollBy({ left: (rtl ? bounds.right - trackEdge : bounds.left - trackEdge), behavior: "smooth" });
    }, 700);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [primaryHomeVariation, homepageNews.length, newsVisibleCount, rtl]);
  const rotateProject = (direction: number) => setProject((current) => Math.min(pageProjects.length - 1, Math.max(0, current + direction)));
  const selectProject = (index: number) => {
    setProject(index);
    if (window.innerWidth > 900 && !primaryHomeVariation) {
      requestAnimationFrame(() => projectWindowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
    }
  };

  const centeredValueLayout = variant === "home3" || variant === "home4" || variant === "home5";
  const cinematicHero = variant === "home4" || variant === "home5";
  const sectionStyle = (key: string, visual?: Parameters<typeof homepageVisualStyle>[0]): CSSProperties => {
    const position = cmsHome?.order?.indexOf(key) ?? -1;
    const visibility = cmsHome?.sectionAppearance?.[key]?.elementVisibility;
    const hidden = Object.fromEntries(Object.entries(visibility || {}).filter(([, shown]) => shown === false).map(([part]) => [`--cms-display-${part}`, "none"]));
    return { ...homepageVisualStyle(visual), ...hidden, ...(position >= 0 ? { order: position } : {}) } as CSSProperties;
  };
  const sectionAppearance = (key: string) => cmsHome?.sectionAppearance?.[key];
  const sectionAnchor = (key: string, fallback: string) => sectionAppearance(key)?.anchorID || fallback;
  const sectionVisible = (key: string) => !cmsHome || cmsHome.order?.includes(key);

  return (
    <main className={`home2 ${centeredValueLayout ? "home3" : ""} ${cinematicHero ? "home4" : ""} ${variant === "home5" ? "home5" : ""} ${square ? "sharp-variation" : ""} ${newMain ? "homepage-next" : ""} ${rtl ? "rtl" : "ltr"}`}>
      <NewSiteHeader locale={locale} scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {(!cmsHome || cmsHome.opening) && (cinematicHero ? <Home4Hero locale={locale} newHomepage={variant === "home5"} newMain={newMain} cmsOpening={cmsHome?.opening} orderStyle={sectionStyle("newHomepageOpening")} anchorID={sectionAnchor("newHomepageOpening", "home4-hero")} background={sectionAppearance("newHomepageOpening")} /> : (
        <section className="home2-hero" aria-labelledby="home2-hero-heading">
          <div className="home2-hero-copy">
            <h1 id="home2-hero-heading">{c.hero.title}</h1>
            <p>{c.hero.body}</p>
            <a className="button button-accent" href="#home2-value">{c.hero.cta}<Arrow /></a>
          </div>
          <div className="home2-hero-media">
            <video autoPlay muted loop playsInline poster="/assets/editorial/startime-strategic-events-hero-v2.webp">
              <source src="/assets/video/startime-home-hero.mp4" type="video/mp4" media="(min-width: 700px)" />
              <source src="/assets/video/startime-home-hero-mobile.mp4" type="video/mp4" />
            </video>
          </div>
        </section>
      ))}

      {variant === "home5" && sectionVisible("newHomepagePanorama") && <div className="cms-home-panorama-order" style={sectionStyle("newHomepagePanorama")}><AnimationSection locale={locale} showMap={false} homepage={cmsHome?.panorama} /></div>}

      {(!cmsHome || cmsHome.value) && <section className="home2-value" id={sectionAnchor("newHomepageValue", "home2-value")} style={sectionStyle("newHomepageValue", cmsHome?.value?.visual)}>
        <HomeSectionBackdrop section={sectionAppearance("newHomepageValue")} />
        <Reveal className="home2-value-grid">
          <div className="home2-section-copy">
            <p className="label">{c.value.label}</p>
            <h2>{c.value.title}</h2>
            <p className="lead">{c.value.body}</p>
          </div>
          {variant === "home2" && <div className="home2-value-image"><Image src="/assets/editorial/startime-saudi-leadership-v2.webp" alt="" fill sizes="(max-width: 900px) 100vw, 42vw" /></div>}
        </Reveal>
        {cmsHome?.value?.showStatistics !== false && <div className="home2-stats">
          <TintablePattern images={cmsHome?.value?.patternImages} fallback="/assets/brand/startime-pattern.svg" tint={cmsHome?.value?.visual?.detailColors?.pattern} />
          {c.stats.map(([value, label], index) => {
            const billion = primaryHomeVariation && /billion|مليار/i.test(`${value} ${label}`);
            const numeric = value.match(/[\d.]+/)?.[0] || value;
            return <AnimatedNumber key={label} value={billion ? (rtl ? `+${numeric}` : `${numeric}+`) : value} label={label} delay={index * 80} billion={billion} locale={locale} style={homepageItemStyle(cmsHome?.value?.statVisuals?.[index])} />;
          })}
        </div>}
      </section>}

      {(!cmsHome || cmsHome.domains) && <section
        className="home2-domains-scroll"
        id={sectionAnchor("newHomepageDomains", "home2-domains")}
        ref={domainsRef}
        style={{ "--chapter-count": c.domains.items.length, ...sectionStyle("newHomepageDomains", cmsHome?.domains?.visual) } as CSSProperties}
      >
        <HomeSectionBackdrop section={sectionAppearance("newHomepageDomains")} />
        <div className="home2-domains-stage">
          <div className="home2-domains-heading">
            <p className="label">{c.domains.label}</p>
            <h2>{c.domains.title}</h2>
            <p className="lead">{c.domains.body}</p>
          </div>
          {primaryHomeVariation ? <div className="home5-domain-editorial">
            <div className="home5-domain-icon-grid">
              {c.domains.items.map((item, index) => {
                const LegacyDomainIcon = legacyDomainIcons[index];
                return <article
                  className="home5-domain-icon-item"
                  key={item.title}
                  style={homepageItemStyle(cmsHome?.domains?.items[index]?.visual)}
                >
                  <span className="home5-domain-icon" aria-hidden="true">{newMain ? <TintableIcon images={cmsHome?.domains?.items[index]?.iconImages} fallback={cmsHome?.domains?.items[index]?.icon || domainIcons[index]} tint={cmsHome?.domains?.items[index]?.visual?.icon || cmsHome?.domains?.visual?.detailColors?.icon} /> : <LegacyDomainIcon />}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </article>;
              })}
            </div>
          </div> : <>
            <div className="home2-domain-atlas" ref={domainAtlasRef}>
              {c.domains.items.map((item, index) => (
                <button
                  className={domain === index ? "active" : ""}
                  ref={(element) => { domainTabRefs.current[index] = element; }}
                  type="button"
                  key={item.title}
                  onClick={() => setDomain(index)}
                  onMouseEnter={() => { if (staticHomeSections) setDomain(index); }}
                  onFocus={() => { if (staticHomeSections) setDomain(index); }}
                  aria-pressed={domain === index}
                >
                  <Image src={domainImages[index]} alt="" fill sizes="(max-width: 900px) 82vw, 32vw" />
                  <span>{item.title}</span>
                  {staticHomeSections && <div className="home5-domain-overlay"><h3>{item.title}</h3><p>{item.body}</p></div>}
                </button>
              ))}
            </div>
            <div className="home2-domain-detail" key={`${locale}-${domain}`}>
              <h3>{c.domains.items[domain].title}</h3>
              <p>{c.domains.items[domain].body}</p>
              <div className="carousel-control-pair">
                <button className="carousel-arrow carousel-arrow-prev" type="button" disabled={domain <= 0} onClick={() => setDomain((domain - 1 + c.domains.items.length) % c.domains.items.length)} aria-label={c.domains.items[(domain - 1 + c.domains.items.length) % c.domains.items.length].title}><CarouselArrow /></button>
                <button className="carousel-arrow carousel-arrow-next" type="button" disabled={domain >= c.domains.items.length - 1} onClick={() => setDomain((domain + 1) % c.domains.items.length)} aria-label={c.domains.items[(domain + 1) % c.domains.items.length].title}><CarouselArrow /></button>
              </div>
            </div>
          </>}
        </div>
      </section>}

      {(!cmsHome || cmsHome.portfolios) && <section className="home2-portfolios" id={sectionAnchor("newHomepagePortfolios", "home2-portfolios")} style={{ ...sectionStyle("newHomepagePortfolios", cmsHome?.portfolios?.visual), ...portfolioTopPaddingStyle(cmsHome?.portfolios?.topPaddingByScreen), "--cms-portfolio-title-color": cmsHome?.portfolios?.portfolioTitleColor || "#d4bda3" } as CSSProperties}>
        <HomeSectionBackdrop section={sectionAppearance("newHomepagePortfolios")} />
        <Reveal className="home2-wide-heading">
          <div><p className="label">{newMain && rtl && !cmsHome?.portfolios ? "محافظ الاستثمار" : c.portfolios.label}</p><h2>{c.portfolios.title}</h2></div>
          <p className="lead">{c.portfolios.body}</p>
        </Reveal>
        <div className="home2-portfolio-area">
          <TintablePattern className="home2-dark-pattern" images={cmsHome?.portfolios?.patternImages} fallback="/assets/brand/startime-pattern.svg" tint={cmsHome?.portfolios?.visual?.detailColors?.pattern} />
          <div className="home2-portfolio-grid">
            {c.portfolios.items.map((item, index) => (
              <Reveal className="home2-portfolio-card" key={item.title} style={homepageItemStyle(cmsHome?.portfolios?.items[index]?.visual)}>
                <div className="home2-portfolio-media"><ArtDirectedImage images={cmsHome?.portfolios?.items[index]?.images} fallback={cmsHome?.portfolios?.items[index]?.image || portfolioImages[index]} /></div>
                <div><h3>{item.title}</h3><p>{item.body}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>}

      <div className="home2-impact-projects-flow">
      {(!cmsHome || cmsHome.impact) && <section
        className="home2-impact-scroll"
        id={sectionAnchor("newHomepageImpact", "home2-impact")}
        ref={impactRef}
        style={{ "--chapter-count": c.impact.items.length, ...sectionStyle("newHomepageImpact", cmsHome?.impact?.visual) } as CSSProperties}
      >
        <HomeSectionBackdrop section={sectionAppearance("newHomepageImpact")} />
        <div className="home2-impact-stage">
          <div className="home2-impact-copy">
            <p className="label">{c.impact.label}</p>
            <h2>{c.impact.title}</h2>
            <div className="home2-impact-list" ref={impactListRef}>
              {c.impact.items.map((item, index) => (
                <button ref={(element) => { impactTabRefs.current[index] = element; }} className={impact === index ? "active" : ""} type="button" key={item.title} onClick={() => setImpact(index)} style={homepageItemStyle(cmsHome?.impact?.items[index]?.visual)}>{item.title}</button>
              ))}
            </div>
          </div>
          <div className="home2-impact-visual">
            {(cmsHome?.impact?.items.map((item) => item.image) || impactImages).map((src, index) => <ArtDirectedImage className={impact === index ? "active" : ""} images={cmsHome ? cmsHome.impact?.items[index]?.images : impactMedia[index]} fallback={src} key={`${src}-${index}`} />)}
            <article key={`${locale}-${impact}`} style={homepageItemStyle(cmsHome?.impact?.items[impact]?.visual)}>
              <h3>{c.impact.items[impact].title}</h3>
              <p>{c.impact.items[impact].body}</p>
              <div className="carousel-control-pair">
                <button className="carousel-arrow carousel-arrow-prev" type="button" disabled={impact <= 0} onClick={() => setImpact((impact - 1 + c.impact.items.length) % c.impact.items.length)} aria-label={c.impact.items[(impact - 1 + c.impact.items.length) % c.impact.items.length].title}><CarouselArrow /></button>
                <button className="carousel-arrow carousel-arrow-next" type="button" disabled={impact >= c.impact.items.length - 1} onClick={() => setImpact((impact + 1) % c.impact.items.length)} aria-label={c.impact.items[(impact + 1) % c.impact.items.length].title}><CarouselArrow /></button>
              </div>
            </article>
          </div>
        </div>
      </section>}

      {(!cmsHome || cmsHome.projects) && <section
        className="home2-projects-scroll"
        id={sectionAnchor("newHomepageProjects", "home2-projects")}
        ref={projectsRef}
        style={{ "--chapter-count": pageProjects.length, ...sectionStyle("newHomepageProjects", cmsHome?.projects?.visual) } as CSSProperties}
      >
        <HomeSectionBackdrop section={sectionAppearance("newHomepageProjects")} />
        <div className="home2-projects home2-projects-stage">
          <Reveal className="home2-projects-heading">
            <p className="label">{c.projects.label}</p>
            <h2>{c.projects.title}</h2>
            <p className="lead">{c.projects.body}</p>
          </Reveal>
          {primaryHomeVariation ? (
            <div className="home5-project-showcase">
              <div className="home5-project-viewport" ref={projectWindowRef}>
                <div
                  className="home5-project-track"
                  style={{ "--project-index": project } as CSSProperties}
                >
                  {pageProjects.map((item, index) => {
                    const title = rtl ? item.ar : item.title;
                    const hasProjectLogo = !item.logo.includes("startime-dark.svg") || !!(item.logos && Object.values(item.logos).some(Boolean));
                    const projectHref = canonicalizePublicHref(item.destination || cmsHome?.projects?.ctaURL || (newMain ? `${publicPath(locale, "investment")}#investment-projects` : ""));
                    return <article className={`home5-project-slide ${project === index ? "active" : ""}`} aria-hidden={project !== index} key={item.title} style={homepageItemStyle(item.visual)}>
                      <div className="home5-project-media">
                        <ArtDirectedImage images={item.images} fallback={item.image} loading={index === 0 ? "eager" : "lazy"} />
                      </div>
                      <div className="home5-project-copy">
                        <div className={`home5-project-identity${hasProjectLogo ? "" : " home5-project-identity--title"}`}>{hasProjectLogo ? <ArtDirectedImage images={item.logos} fallback={item.logo} alt={title} /> : <h3>{title}</h3>}</div>
                        {hasProjectLogo && <h3 className="home5-project-name">{item.projectName || title}</h3>}
                        <p>{rtl ? item.arDescription : item.description}</p>
                        {cmsHome?.projects?.showCTA !== false && (projectHref ? <a className="text-action" href={projectHref} aria-label={`${c.projects.cta}: ${title}`}>{c.projects.cta}<span className="new-site-visually-hidden"> {title}</span><Arrow /></a> : <span className="text-action">{c.projects.cta}<Arrow /></span>)}
                      </div>
                    </article>
                  })}
                </div>
                <nav className="home5-project-controls" aria-label={c.projects.title}>
                  <button
                    className="carousel-arrow carousel-arrow-prev"
                    type="button"
                    onClick={() => rotateProject(-1)}
                    disabled={project === 0}
                    aria-label={rtl ? "المشروع السابق" : "Previous project"}
                  ><CarouselArrow /></button>
                  <button
                    className="carousel-arrow carousel-arrow-next"
                    type="button"
                    onClick={() => rotateProject(1)}
                    disabled={project === pageProjects.length - 1}
                    aria-label={rtl ? "المشروع التالي" : "Next project"}
                  ><CarouselArrow /></button>
                </nav>
              </div>
              <div className="home2-project-logos home5-project-logos" ref={projectTabsRef}>
                {pageProjects.map((item, index) => <button ref={(element) => { projectTabRefs.current[index] = element; }} type="button" className={project === index ? "active" : ""} key={item.title} onClick={() => selectProject(index)} aria-label={rtl ? item.ar : item.title}><ArtDirectedImage images={item.logos} fallback={item.logo} alt={rtl ? item.ar : item.title} fill={false} width={260} height={104} /></button>)}
              </div>
            </div>
          ) : (
            <>
              <div className="home2-project-window" ref={projectWindowRef}>
                {pageProjects.map((item, index) => (
                  <article className={project === index ? "active" : ""} key={item.title}>
                    <ArtDirectedImage images={item.images} fallback={item.image} loading={index === 0 ? "eager" : "lazy"} />
                    <div><h3>{rtl ? item.ar : item.title}</h3><p>{rtl ? item.arDescription : item.description}</p><span className="text-action">{c.projects.cta}<Arrow /></span></div>
                  </article>
                ))}
                <nav className="home2-project-arrows carousel-control-pair">
                  <button className="carousel-arrow carousel-arrow-prev" type="button" disabled={project <= 0} onClick={() => rotateProject(-1)} aria-label={rtl ? pageProjects[(project - 1 + pageProjects.length) % pageProjects.length].ar : pageProjects[(project - 1 + pageProjects.length) % pageProjects.length].title}><CarouselArrow /></button>
                  <button className="carousel-arrow carousel-arrow-next" type="button" disabled={project >= pageProjects.length - 1} onClick={() => rotateProject(1)} aria-label={rtl ? pageProjects[(project + 1) % pageProjects.length].ar : pageProjects[(project + 1) % pageProjects.length].title}><CarouselArrow /></button>
                </nav>
              </div>
              <div className="home2-project-logos" ref={projectTabsRef}>
                {pageProjects.map((item, index) => <button ref={(element) => { projectTabRefs.current[index] = element; }} type="button" className={project === index ? "active" : ""} key={item.title} onClick={() => selectProject(index)} aria-label={rtl ? item.ar : item.title}><ArtDirectedImage images={item.logos} fallback={item.logo} alt={rtl ? item.ar : item.title} fill={false} width={220} height={88} /></button>)}
              </div>
            </>
          )}
        </div>
      </section>}
      </div>

      {sectionVisible("siteHomeTeam") && <section className={`home2-team ${cmsHome?.team?.patternImages ? "cms-team-custom-pattern" : ""}`} id={sectionAnchor("siteHomeTeam", "home2-team")} style={sectionStyle("siteHomeTeam", cmsHome?.team?.visual)}>
        <HomeSectionBackdrop section={sectionAppearance("siteHomeTeam")} />
        <Reveal className="home2-team-media"><ArtDirectedImage images={cmsHome?.team?.images} fallback="/assets/editorial/startime-careers-creative-team.webp" /><ArtDirectedVideo videos={cmsHome?.team?.videos} /></Reveal>
        {cmsHome?.team?.patternImages && <TintablePattern className="home2-team-custom-pattern" images={cmsHome.team.patternImages} fallback="/assets/brand/startime-pattern.svg" tint={cmsHome.team.visual?.detailColors?.pattern} />}
        <Reveal className="home2-team-copy"><p className="label">{c.team.label}</p><h2>{c.team.title}</h2><p className="lead">{c.team.body}</p>{cmsHome?.team?.showCTA !== false && <a className="button button-accent" href={cmsHome?.team?.ctaURL || "#home2-footer"}>{c.team.cta}<Arrow /></a>}</Reveal>
      </section>}

      {sectionVisible("siteHomeTriple") && <section className="home2-triple" style={sectionStyle("siteHomeTriple", cmsHome?.triple?.visual)}>
        <HomeSectionBackdrop section={sectionAppearance("siteHomeTriple")} />
        <Reveal className="home2-triple-copy"><h2>{c.triple.title}</h2><h3>{c.triple.subtitle}</h3><p>{c.triple.body}</p>{cmsHome?.triple?.showCTA !== false && <a className="text-action" href={cmsHome?.triple?.ctaURL || "#home2-footer"}>{c.triple.cta}<Arrow /></a>}</Reveal>
        {!primaryHomeVariation || cmsHome?.triple?.showMedia || cmsHome?.triple?.videos ? <Reveal className="home2-triple-media">
          <ArtDirectedImage images={cmsHome?.triple?.images} fallback="/assets/editorial/startime-triple-s-command-center.webp" />
          <ArtDirectedVideo videos={cmsHome?.triple?.videos} />
          <TintablePattern className="home2-dark-pattern" images={cmsHome?.triple?.patternImages} fallback="/assets/brand/startime-pattern.svg" tint={cmsHome?.triple?.visual?.detailColors?.pattern} />
        </Reveal> : null}
      </section>}

      {sectionVisible("newHomepageMembership") && <section className="home2-membership" aria-label={rtl ? "عضويات ستارتايم" : "Startime memberships"} style={sectionStyle("newHomepageMembership", cmsHome?.membership?.visual)}>
        <HomeSectionBackdrop section={sectionAppearance("newHomepageMembership")} />
        <TintablePattern className="home2-membership-pattern" images={cmsHome?.membership?.patternImages} fallback="/assets/brand/startime-pattern.svg" tint={cmsHome?.membership?.visual?.detailColors?.pattern} />
        <Reveal className="home2-membership-inner">
          <p>{cmsHome?.membership?.heading || (rtl ? "نفخر بعضويتنا في" : "A proud member of")}</p>
          <span aria-hidden="true" />
          {cmsHome ? <div className="cms-membership-logos">{(cmsHome.membership?.logos || []).map((logo, index) => logo.destination ? <a href={logo.destination} {...externalAttributes(logo.destination, "section:home2-membership")} key={`${logo.alt}-${index}`}><ArtDirectedImage images={logo.images} fallback={logo.image} alt={logo.alt} fill={false} /></a> : <ArtDirectedImage images={logo.images} fallback={logo.image} alt={logo.alt} fill={false} key={`${logo.alt}-${index}`} />)}</div> : <Image src="/assets/brand/ufi-iaee.svg" alt="UFI and IAEE" width={457} height={54} />}
        </Reveal>
      </section>}

      {sectionVisible("siteHomePartners") && <section className="home2-partners" id={sectionAnchor("siteHomePartners", "home2-partners")} style={sectionStyle("siteHomePartners", cmsHome?.partners?.visual)}>
        <HomeSectionBackdrop section={sectionAppearance("siteHomePartners")} />
        <Reveal className="home2-wide-heading">
          <div><p className="label">{c.partners.label}</p><h2>{c.partners.title}</h2><p className="lead">{c.partners.body}</p></div>
          {cmsHome?.partners?.showCTA !== false && <a className="button button-accent" href={cmsHome?.partners?.ctaURL || "#home2-footer"}>{c.partners.cta}<Arrow /></a>}
        </Reveal>
        <div ref={partnerMarqueeRef} className={`home2-logo-marquee ${partnerMarqueeMode}${partnerMediaReady ? " is-ready" : ""}`}><div style={{ "--marquee-copies": partnerLogoCopies } as CSSProperties}>{Array.from({ length: partnerLogoCopies }, (_, copyIndex) => <div className="home2-logo-marquee-set" key={copyIndex} aria-hidden={copyIndex > 0 ? true : undefined} inert={copyIndex > 0}>
          {partnerLogos ? partnerLogos.map((logo, index) => logo.destination ? <a href={logo.destination} {...externalAttributes(logo.destination, `section:${sectionAnchor("siteHomePartners", "home2-partners")}`)} key={`${logo.image}-${index}`}><ArtDirectedImage images={logo.images} fallback={logo.image} alt={logo.alt} fill={false} width={217} height={100} loading={partnerMediaActive ? "eager" : "lazy"} /></a> : <ArtDirectedImage key={`${logo.image}-${index}`} images={logo.images} fallback={logo.image} alt={logo.alt} fill={false} width={217} height={100} loading={partnerMediaActive ? "eager" : "lazy"} />) : Array.from({ length: partnerLogoCount }, (_, index) => {
            const partner = newMain ? homeMediaPartners[index % homeMediaPartners.length] : undefined;
            const number = partner?.number ?? (index % 15) + 1;
            return <Image key={`${number}-${index}`} src={`/assets/partners/${newMain ? "colored-partner" : "partner"}-${String(number).padStart(2, "0")}.png`} alt={partner ? partner[locale] : ""} width={newMain ? 217 : 180} height={newMain ? 100 : 92} loading={partnerMediaActive ? "eager" : "lazy"} />;
          })}
        </div>)}</div></div>
      </section>}

      {sectionVisible("siteHomeNews") && <section className="home2-news" id={sectionAnchor("siteHomeNews", "home2-news")} style={sectionStyle("siteHomeNews", cmsHome?.news?.visual)}>
        <HomeSectionBackdrop section={sectionAppearance("siteHomeNews")} />
        <Reveal className="home2-news-heading"><div><p className="label">{homepageNewsLabel}</p><h2>{c.news.title}</h2><p className="lead">{c.news.body}</p></div>{cmsHome?.news?.showCTA !== false && <Link className="text-link" href={homepageNewsHref}>{homepageNewsCta}<Arrow /></Link>}</Reveal>
        <div className={`home2-news-grid ${primaryHomeVariation ? "home5-news-carousel" : ""}`} aria-live="polite" ref={primaryHomeVariation ? newsTrackRef : undefined} onScroll={primaryHomeVariation ? syncNewsPageFromScroll : undefined}>
          {newsItems.map((post, index) => {
            const copy = getPostCopy(post, locale);
            return <article key={post.slug} style={homepageItemStyle(post.cmsId ? cmsHome?.news?.cardVisuals?.[post.cmsId] : undefined)} ref={primaryHomeVariation ? (element) => { newsCardRefs.current[index] = element; } : undefined}><Link href={postPath(locale, post)}><div className={getNewsImageVariants(post) ? "news-responsive-media" : undefined}><ResponsiveNewsImage post={post} sizes="(max-width: 700px) 100vw, 33vw" /></div><h3>{copy.title}</h3><p>{getPostSummary(post, locale)}</p>{primaryHomeVariation && <span className="home5-news-card-arrow" aria-hidden="true"><Arrow /></span>}</Link></article>;
          })}
        </div>
        {primaryHomeVariation ? <div className="home2-news-controls home5-news-controls">
          <nav className="carousel-control-pair" aria-label={homepageNewsLabel}>
            <button className="carousel-arrow carousel-arrow-prev" type="button" disabled={newsPage <= 0} onClick={() => selectNewsPage(newsPage - 1)} aria-label={rtl ? "السابق" : "Previous"}><CarouselArrow /></button>
            <button className="carousel-arrow carousel-arrow-next" type="button" disabled={newsPage >= newsPageCount - 1} onClick={() => selectNewsPage(newsPage + 1)} aria-label={rtl ? "التالي" : "Next"}><CarouselArrow /></button>
          </nav>
        </div> : <div className="home2-news-controls">
          <SlideCounter current={newsPage + 1} total={newsPageCount} />
          <div>{Array.from({ length: newsPageCount }, (_, index) => <button type="button" className={newsPage === index ? "active" : ""} key={index} onClick={() => setNewsPage(index)} aria-label={getPostCopy(homepageNews[index * newsPerPage], locale).title} />)}</div>
          <nav className="carousel-control-pair">
            <button className="carousel-arrow carousel-arrow-prev" type="button" disabled={newsPage <= 0} onClick={() => setNewsPage((newsPage - 1 + newsPageCount) % newsPageCount)} aria-label={getPostCopy(homepageNews[((newsPage - 1 + newsPageCount) % newsPageCount) * newsPerPage], locale).title}><CarouselArrow /></button>
            <button className="carousel-arrow carousel-arrow-next" type="button" disabled={newsPage >= newsPageCount - 1} onClick={() => setNewsPage((newsPage + 1) % newsPageCount)} aria-label={getPostCopy(homepageNews[((newsPage + 1) % newsPageCount) * newsPerPage], locale).title}><CarouselArrow /></button>
          </nav>
        </div>}
      </section>}

      <NewSiteFooter locale={locale} home />
    </main>
  );
}
