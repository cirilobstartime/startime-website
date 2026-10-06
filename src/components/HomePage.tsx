"use client";

import { DunsRegisteredSeal } from "@/components/DunsRegisteredSeal";

import Image from "next/image";
import Link from "./CmsLink";
import { useEffect, useRef, useState } from "react";
import { homeContent, projects, type Locale } from "@/content/home";
import { AllianceStrip } from "@/components/AllianceStrip";
import { SiteNavigationMenus } from "@/components/SiteNavigationMenus";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { FacebookLogo } from "@phosphor-icons/react/FacebookLogo";
import { InstagramLogo } from "@phosphor-icons/react/InstagramLogo";
import { LinkedinLogo } from "@phosphor-icons/react/LinkedinLogo";
import { MapPin } from "@phosphor-icons/react/MapPin";
import { Phone } from "@phosphor-icons/react/Phone";
import { EnvelopeSimple } from "@phosphor-icons/react/EnvelopeSimple";
import { TiktokLogo } from "@phosphor-icons/react/TiktokLogo";
import { XLogo } from "@phosphor-icons/react/XLogo";
import { YoutubeLogo } from "@phosphor-icons/react/YoutubeLogo";

const Arrow = () => <ArrowRight aria-hidden="true" />;
const CarouselArrow = () => <span className="carousel-arrow-shape" aria-hidden="true" />;

const domainImages = [
  "/assets/editorial/startime-strategic-events-hero-v2.webp",
  "/assets/projects/maritime-forum-featured-v2.webp",
  "/assets/editorial/startime-triple-s-command-center.webp",
  "/assets/projects/blue-economy-v2.webp",
  "/assets/editorial/startime-team-ministry-environment-event.png",
];

const impactImages = [
  "/assets/editorial/startime-saudi-leadership-v2.webp",
  "/assets/editorial/startime-team-ministry-environment-event.png",
  "/assets/editorial/startime-triple-s-command-center.webp",
  "/assets/editorial/startime-strategic-events-hero-v2.webp",
  "/assets/projects/smart-cities-v2.webp",
  "/assets/projects/blue-economy-v2.webp",
  "/assets/editorial/startime-team-ministry-environment-event.png",
  "/assets/projects/maritime-forum-featured-v2.webp",
  "/assets/projects/unmanned-systems-v2.webp",
  "/assets/editorial/startime-saudi-leadership-v2.webp",
  "/assets/editorial/startime-triple-s-command-center.webp",
];

const socialLinks = [
  { label: "LinkedIn", href: "https://sa.linkedin.com/company/startimeevents", icon: LinkedinLogo },
  { label: "X", href: "https://x.com/startimeevents", icon: XLogo },
  { label: "Instagram", href: "https://www.instagram.com/startimeevents/", icon: InstagramLogo },
  { label: "YouTube", href: "https://www.youtube.com/@Startime_Events", icon: YoutubeLogo },
  { label: "Facebook", href: "https://www.facebook.com/STARTIMEvents", icon: FacebookLogo },
  { label: "TikTok", href: "https://www.tiktok.com/@startime_events", icon: TiktokLogo },
];

function SocialIcon({ icon: Icon }: { icon: typeof LinkedinLogo }) {
  return <Icon aria-hidden="true" weight="regular" />;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}

function AnimatedStat({ value, label, index }: { value: string; label: string; index: number }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const element = elementRef.current;
    const numericPart = value.match(/[\d.]+/)?.[0];
    if (!element || !numericPart) {
      setDisplayValue(value);
      return;
    }

    const target = Number(numericPart);
    const decimals = numericPart.includes(".") ? 1 : 0;
    const prefix = value.slice(0, value.indexOf(numericPart));
    const suffix = value.slice(value.indexOf(numericPart) + numericPart.length);
    const format = (current: number) => `${prefix}${current.toFixed(decimals)}${suffix}`;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;

    const animate = () => {
      if (reducedMotion) {
        setDisplayValue(value);
        return;
      }
      const start = performance.now() + index * 90;
      const duration = 1350;
      const tick = (now: number) => {
        const progress = Math.min(1, Math.max(0, (now - start) / duration));
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(format(target * eased));
        if (progress < 1) animationFrame = requestAnimationFrame(tick);
      };
      animationFrame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        animate();
        observer.disconnect();
      }
    }, { threshold: 0.24 });
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [index, value]);

  return (
    <div className="stat" ref={elementRef}>
      <div className="stat-value"><strong aria-label={value}>{displayValue}</strong></div>
      <span>{label}</span>
    </div>
  );
}

export function HomePage({ locale, route = "home6" }: { locale: Locale; route?: "home6" }) {
  const c = homeContent[locale];
  const rtl = locale === "ar";
  const [menuOpen, setMenuOpen] = useState(false);
  const [domain, setDomain] = useState(0);
  const [impact, setImpact] = useState(0);
  const [project, setProject] = useState(0);
  const [newsPage, setNewsPage] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const projectTabsRef = useRef<HTMLDivElement>(null);
  const projectTabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { rootMargin: "0px 0px 12% 0px", threshold: 0.06 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    let scrollFrame = 0;
    const updateHeader = () => {
      scrollFrame = 0;
      const next = window.scrollY > 80;
      setScrolled((current) => current === next ? current : next);
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateHeader);
    };
    updateHeader();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [locale, rtl]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    const rail = projectTabsRef.current;
    const activeTab = projectTabRefs.current[project];
    if (!rail || !activeTab) return;

    const centerActiveTab = (behavior: ScrollBehavior) => {
      const railBounds = rail.getBoundingClientRect();
      const tabBounds = activeTab.getBoundingClientRect();
      const offset = tabBounds.left + (tabBounds.width / 2) - railBounds.left - (railBounds.width / 2);
      if (Math.abs(offset) > 2) rail.scrollBy({ left: offset, behavior });
    };

    const animationFrame = requestAnimationFrame(() => centerActiveTab("smooth"));
    const resizeObserver = new ResizeObserver(() => centerActiveTab("auto"));
    resizeObserver.observe(rail);
    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [project]);

  const newsPerPage = 3;
  const newsPageCount = Math.ceil(c.news.items.length / newsPerPage);
  const newsPages = Array.from({ length: newsPageCount }, (_, pageIndex) =>
    c.news.items.slice(pageIndex * newsPerPage, (pageIndex + 1) * newsPerPage),
  );

  const pagePath = `/${locale}/${route}`;
  const navLinks = [pagePath, `/${locale}/discover`, `/${locale}/vision`, `/${locale}/investment`, `/${locale}/careers`, `/${locale}/insights`, `/${locale}/contact`];

  return (
    <main className={rtl ? "rtl" : "ltr"}>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${menuOpen ? "menu-active" : ""}`}>
        <Link className="logo" href={pagePath} aria-label="Startime">
          <Image src="/assets/alliance/startime-ufi.webp" alt="Startime" width={460} height={183} loading="eager" />
        </Link>
        <nav className={menuOpen ? "open" : ""}>
          <div className="nav-overlay-links">
            <SiteNavigationMenus locale={locale} labels={c.nav} darkHome onNavigate={() => setMenuOpen(false)} />
          </div>
          <div className="nav-overlay-copy"><p>{c.footerBio}</p></div>
          <div className="mobile-nav-footer">
            <a href="mailto:info@startime.sa">info@startime.sa</a>
            <div className="mobile-socials">{socialLinks.map((item) => <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}><SocialIcon icon={item.icon} /></a>)}</div>
          </div>
        </nav>
        <div className="header-actions">
          <Link className="language" href={`/${rtl ? "en" : "ar"}/${route}`}>{rtl ? "EN" : "عربي"}</Link>
          <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-heading">
        <video autoPlay muted loop playsInline poster="/assets/editorial/startime-strategic-events-hero-v2.webp">
          <source src="/assets/video/startime-home-hero.mp4" type="video/mp4" media="(min-width: 700px)" />
          <source src="/assets/video/startime-home-hero-mobile.mp4" type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <div className="hero-content">
          <h1 id="hero-heading">{c.hero.title}</h1>
          <p>{c.hero.body}</p>
          <a className="button button-accent" href="#value">{c.hero.cta}<Arrow /></a>
        </div>
      </section>

      <section className="value section-light" id="value">
        <div className="section-grid">
          <Reveal className="section-heading">
            <p className="label">{c.value.label}</p>
            <h2>{c.value.title}</h2>
            <p className="lead">{c.value.body}</p>
          </Reveal>
          <Reveal className="value-image"><Image src="/assets/editorial/startime-saudi-leadership-v2.webp" alt="" fill sizes="(max-width: 900px) 100vw, 45vw" loading="eager" /></Reveal>
        </div>
        <Reveal className="stats-rail">
          <Image className="stats-pattern" src="/assets/brand/startime-pattern.svg" alt="" width={1920} height={1080} aria-hidden="true" />
          <div className="stats-feature">
            <AnimatedStat value={c.stats[4][0]} label={c.stats[4][1]} index={0} />
          </div>
          <div className="stats-support">
            {[0, 1, 2, 3, 5].map((statIndex, index) => {
              const [value, label] = c.stats[statIndex];
              return <AnimatedStat value={value} label={label} index={index + 1} key={label} />;
            })}
          </div>
        </Reveal>
      </section>

      <section className="domains section-dark" id="domains">
        <div className="domains-media" aria-hidden="true">
          {domainImages.map((src, index) => <Image key={src} className={domain === index ? "active" : ""} src={src} alt="" fill sizes="100vw" />)}
          <div className="domains-shade" />
        </div>
        <div className="domains-layout">
          <Reveal className="domains-copy">
            <div className="section-heading">
              <p className="label">{c.domains.label}</p>
              <h2>{c.domains.title}</h2>
              <p className="lead">{c.domains.body}</p>
            </div>
          </Reveal>
          <Reveal className="domain-showcase">
            <div className="domain-card-stack">
            {c.domains.items.map((item, index) => (
              <article key={item.title} className={domain === index ? "active" : domain === (index + 1) % c.domains.items.length ? "previous" : domain === (index - 1 + c.domains.items.length) % c.domains.items.length ? "next" : ""} aria-hidden={domain !== index}>
                <Image src={domainImages[index]} alt="" fill sizes="(max-width: 820px) 82vw, 34vw" />
                <div className="domain-card-shade" />
                <div><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p></div>
              </article>
            ))}
            </div>
            <div className="domain-carousel-controls">
              <div className="carousel-control-pair">
                <button className="carousel-arrow carousel-arrow-prev" type="button" aria-label={c.domains.items[(domain - 1 + c.domains.items.length) % c.domains.items.length].title} onClick={() => setDomain((domain - 1 + c.domains.items.length) % c.domains.items.length)}><CarouselArrow /></button>
                <button className="carousel-arrow carousel-arrow-next" type="button" aria-label={c.domains.items[(domain + 1) % c.domains.items.length].title} onClick={() => setDomain((domain + 1) % c.domains.items.length)}><CarouselArrow /></button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="portfolios section-dark" id="portfolios">
        <Reveal className="wide-heading"><div><p className="label">{c.portfolios.label}</p><h2>{c.portfolios.title}</h2></div><p className="lead">{c.portfolios.body}</p></Reveal>
        <div className="portfolio-grid">
          {c.portfolios.items.map((item, index) => (
            <Reveal className="portfolio-panel" key={item.title}>
              <Image src={["/assets/editorial/startime-saudi-leadership-v2.webp", "/assets/editorial/startime-strategic-events-hero-v2.webp", "/assets/editorial/startime-team-ministry-environment-event.png"][index]} alt="" fill sizes="(max-width: 900px) 100vw, 34vw" />
              <div className="panel-shade" /><div><h3>{item.title}</h3><p>{item.body}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="impact section-light" id="impact">
        <div className="impact-shell">
          <div className="impact-backgrounds" aria-hidden="true">{impactImages.map((src, index) => <Image key={`${src}-${index}`} className={impact === index ? "active" : ""} src={src} alt="" fill sizes="(min-width: 1600px) 1760px, (max-width: 768px) calc(100vw - 32px), 92vw" />)}</div>
          <div className="impact-shade" aria-hidden="true" />
          <Reveal className="impact-intro">
            <p className="label">{c.impact.label}</p>
            <h2>{c.impact.title}</h2>
          </Reveal>
          <div className="impact-workspace">
            <div className="impact-active" key={`${locale}-${impact}`}>
              <span>{String(impact + 1).padStart(2, "0")} / {String(c.impact.items.length).padStart(2, "0")}</span>
              <h3>{c.impact.items[impact].title}</h3>
              <p className="impact-active-copy">{c.impact.items[impact].body}</p>
              <div className="impact-active-footer">
                <a className="text-action" href="#projects">{c.impact.cta}<Arrow /></a>
                <div className="impact-controls carousel-control-pair">
                  <button className="carousel-arrow carousel-arrow-prev" type="button" aria-label={c.impact.items[(impact - 1 + c.impact.items.length) % c.impact.items.length].title} onClick={() => setImpact((current) => (current - 1 + c.impact.items.length) % c.impact.items.length)}><CarouselArrow /></button>
                  <button className="carousel-arrow carousel-arrow-next" type="button" aria-label={c.impact.items[(impact + 1) % c.impact.items.length].title} onClick={() => setImpact((current) => (current + 1) % c.impact.items.length)}><CarouselArrow /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="projects section-light" id="projects">
        <Reveal className="projects-copy"><p className="label">{c.projects.label}</p><h2>{c.projects.title}</h2><p className="lead">{c.projects.body}</p></Reveal>
        <div className="project-stage">
          {projects.map((item, index) => (
            <article className={project === index ? "active" : ""} key={item.title}>
              <Image src={item.image} alt="" fill sizes="100vw" priority={index === 0} />
              <div className="panel-shade" />
              <div><p>{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</p><h3>{rtl ? item.ar : item.title}</h3><span>{rtl ? item.arDescription : item.description}</span><button className="text-action" type="button">{c.projects.cta}<Arrow /></button></div>
            </article>
          ))}
          <button className="project-arrow prev carousel-arrow carousel-arrow-prev" aria-label={rtl ? projects[(project - 1 + projects.length) % projects.length].ar : projects[(project - 1 + projects.length) % projects.length].title} onClick={() => setProject((project - 1 + projects.length) % projects.length)}><CarouselArrow /></button>
          <button className="project-arrow next carousel-arrow carousel-arrow-next" aria-label={rtl ? projects[(project + 1) % projects.length].ar : projects[(project + 1) % projects.length].title} onClick={() => setProject((project + 1) % projects.length)}><CarouselArrow /></button>
        </div>
        <div className="project-tabs" ref={projectTabsRef}>{projects.map((item, index) => <button ref={(element) => { projectTabRefs.current[index] = element; }} key={item.title} className={project === index ? "active" : ""} onClick={() => setProject(index)} aria-label={rtl ? item.ar : item.title} title={rtl ? item.ar : item.title}><Image src={item.logo} alt={rtl ? item.ar : item.title} width={240} height={120} loading="eager" unoptimized /></button>)}</div>
      </section>

      <section className="team section-light" id="team">
        <Reveal className="team-image"><Image src="/assets/editorial/startime-careers-creative-team.webp" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" loading="eager" /></Reveal>
        <Reveal className="team-copy"><p className="label">{c.team.label}</p><h2>{c.team.title}</h2><p className="lead">{c.team.body}</p><a className="button button-accent" href="#footer">{c.team.cta}<Arrow /></a></Reveal>
      </section>

      <section className="triple section-dark">
        <div className="triple-copy"><Reveal><h2>{c.triple.title}</h2><h3>{c.triple.subtitle}</h3><p>{c.triple.body}</p><a className="button button-accent" href="#footer">{c.triple.cta}<Arrow /></a></Reveal></div>
        <div className="triple-image"><Image src="/assets/editorial/startime-triple-s-command-center.webp" alt="" fill sizes="(max-width: 900px) 100vw, 55vw" /></div>
        <div className="membership"><span>{rtl ? "نفخر بعضويتنا في" : "A proud member of"}</span><Image src="/assets/brand/ufi-iaee.svg" alt="UFI and IAEE" width={220} height={80} /></div>
      </section>

      <section className="partners section-light" id="partners">
        <Reveal className="wide-heading"><div><p className="label">{c.partners.label}</p><h2>{c.partners.title}</h2><p className="lead">{c.partners.body}</p></div><a className="button button-accent" href="#footer">{c.partners.cta}<Arrow /></a></Reveal>
        <div className="logo-marquee"><div>{[...Array.from({ length: 15 }, (_, index) => index + 1), ...Array.from({ length: 15 }, (_, index) => index + 1)].map((n, index) => <Image key={`${n}-${index}`} src={`/assets/partners/partner-${String(n).padStart(2, "0")}.png`} alt="" width={152} height={70} />)}</div></div>
      </section>

      <section className="news section-light" id="news">
        <Reveal className="news-heading">
          <div><p className="label">{c.news.label}</p><h2>{c.news.title}</h2><p className="lead">{c.news.body}</p></div>
          <div className="news-heading-aside"><a className="text-link" href="#footer">{c.news.cta}<Arrow /></a></div>
        </Reveal>
        <div className="news-carousel" aria-live="polite">
          <div className="news-track" style={{ "--news-page": newsPage } as React.CSSProperties}>
            {newsPages.map((pageItems, pageIndex) => (
              <div className="news-grid" key={pageIndex}>
                {pageItems.map(([title, body], visibleIndex) => {
                  const index = (pageIndex * newsPerPage) + visibleIndex;
                  return <article className="news-card" key={title}><div className="news-image"><Image src={["/assets/editorial/news-partnership.webp", "/assets/editorial/startime-strategic-events-hero-v2.webp", "/assets/editorial/news-sovereign.webp"][index % 3]} alt="" fill sizes="(max-width: 820px) 100vw, 33vw" /></div><h3>{title}</h3><p>{body}</p><Arrow /></article>;
                })}
              </div>
            ))}
          </div>
          <div className="news-controls">
            <span>{String(newsPage + 1).padStart(2, "0")} / {String(newsPageCount).padStart(2, "0")}</span>
            <div>{Array.from({ length: newsPageCount }, (_, index) => <button key={index} className={newsPage === index ? "active" : ""} type="button" aria-label={c.news.items[index * newsPerPage][0]} aria-current={newsPage === index ? "true" : undefined} onClick={() => setNewsPage(index)} />)}</div>
            <nav className="carousel-control-pair">
              <button className="carousel-arrow carousel-arrow-prev" type="button" aria-label={c.news.items[((newsPage - 1 + newsPageCount) % newsPageCount) * newsPerPage][0]} onClick={() => setNewsPage((newsPage - 1 + newsPageCount) % newsPageCount)}><CarouselArrow /></button>
              <button className="carousel-arrow carousel-arrow-next" type="button" aria-label={c.news.items[((newsPage + 1) % newsPageCount) * newsPerPage][0]} onClick={() => setNewsPage((newsPage + 1) % newsPageCount)}><CarouselArrow /></button>
            </nav>
          </div>
        </div>
      </section>

      <footer className="home2-footer" id="footer">
        <Image className="home2-footer-pattern" src="/assets/brand/startime-pattern.svg" alt="" fill sizes="100vw" aria-hidden="true" />
        <div className="home2-footer-main">
          <div className="home2-footer-about"><Image src="/assets/alliance/startime-ufi.webp" alt="Startime" width={460} height={183} /><p>{c.footerBio}</p><div>{socialLinks.map((item) => <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label} title={item.label}><SocialIcon icon={item.icon} /></a>)}</div></div>
          <nav>{c.nav.map((item, index) => <Link key={item} href={navLinks[index]}>{item}</Link>)}</nav>
          <div className="home2-contact"><span className="footer-contact-item"><MapPin aria-hidden="true" /><span>{rtl ? <>3507 الرياض 12341<br />المملكة العربية السعودية</> : <>3507 Riyadh 12341<br />Saudi Arabia</>}</span></span><a className="footer-contact-item" href="tel:920010500"><Phone aria-hidden="true" /><span>920010500</span></a><a className="footer-contact-item" href="mailto:info@startime.sa"><EnvelopeSimple aria-hidden="true" /><span>info@startime.sa</span></a><DunsRegisteredSeal rtl={rtl} /></div>
        </div>
        <AllianceStrip rtl={rtl} />
        <div className="home2-footer-bottom"><span>© Startime Events – All Rights Reserved</span></div>
      </footer>
    </main>
  );
}
