"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArtDirectedImage, ArtDirectedVideo, resolveViewportImages } from "@/components/ArtDirectedImage";
import type { DiscoverSectionSettings } from "@/content/discoverCms";

type Milestone = { year: string; title: string; body: string };

function youtubeID(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") return /^[\w-]{11}$/.test(url.pathname.slice(1)) ? url.pathname.slice(1) : undefined;
    if (!["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)) return undefined;
    const id = url.pathname.startsWith("/embed/") ? url.pathname.split("/")[2] : url.searchParams.get("v");
    return id && /^[\w-]{11}$/.test(id) ? id : undefined;
  } catch { return undefined; }
}

function TimelineFilm({ className, rtl, settings }: { className: string; rtl: boolean; settings?: DiscoverSectionSettings }) {
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "laptop" | "desktop" | "imac">("desktop");
  useEffect(() => {
    const update = () => setViewport(window.innerWidth <= 640 ? "mobile" : window.innerWidth <= 1023 ? "tablet" : window.innerWidth <= 1599 ? "laptop" : window.innerWidth <= 1999 ? "desktop" : "imac");
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);
  const id = settings?.filmSource === "youtube" ? youtubeID(settings.filmYoutubeURL) : undefined;
  const film = settings?.filmVideos && Object.values(settings.filmVideos).some(Boolean)
    ? resolveViewportImages(settings.filmVideos, rtl ? "/assets/discover/startime-timeline-ar.mp4" : "/assets/discover/startime-timeline.mp4") : undefined;
  const poster = settings?.filmPosters ? resolveViewportImages(settings.filmPosters, rtl ? "/assets/discover/startime-timeline-ar-poster.jpg" : "/assets/discover/startime-timeline-poster.jpg") : undefined;
  const fallbackFilm = rtl ? "/assets/discover/startime-timeline-ar.mp4" : "/assets/discover/startime-timeline.mp4";
  const fallbackPoster = rtl ? "/assets/discover/startime-timeline-ar-poster.jpg" : "/assets/discover/startime-timeline-poster.jpg";
  const title = settings?.filmTitle || (rtl ? "فيديو رحلة ستارتايم" : "Startime journey film");
  return (
    <div className={className}>
      <div className="kinetic-timeline-film-frame">
      {id ? <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      /> :
      <video
        controls
        playsInline
        preload="none"
        poster={poster?.[viewport] || fallbackPoster}
        aria-label={title}
      >
        {film ? <>
          <source src={film.mobile} media="(max-width: 640px)" type={film.mobile.endsWith(".webm") ? "video/webm" : "video/mp4"} />
          <source src={film.tablet} media="(min-width: 641px) and (max-width: 1023px)" type={film.tablet.endsWith(".webm") ? "video/webm" : "video/mp4"} />
          <source src={film.laptop} media="(min-width: 1024px) and (max-width: 1599px)" type={film.laptop.endsWith(".webm") ? "video/webm" : "video/mp4"} />
          <source src={film.desktop} media="(min-width: 1600px) and (max-width: 1999px)" type={film.desktop.endsWith(".webm") ? "video/webm" : "video/mp4"} />
          <source src={film.imac} media="(min-width: 2000px)" type={film.imac.endsWith(".webm") ? "video/webm" : "video/mp4"} />
        </> : <source src={fallbackFilm} type="video/mp4" />}
      </video>}
      </div>
    </div>
  );
}

export function DiscoverKineticTimeline({ items, rtl, settings, style }: { items: Milestone[]; rtl: boolean; settings?: DiscoverSectionSettings; style?: CSSProperties }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const firstItem = section.querySelector<HTMLElement>(".kinetic-timeline-item");
    if (!firstItem) return;

    let frame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const staticLarge = window.matchMedia("(min-width: 1800px) and (min-height: 1000px)");
    const update = () => {
      frame = 0;
      if (reducedMotion.matches || staticLarge.matches) return;
      const bounds = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -bounds.top / distance));
      const step = firstItem.offsetHeight;
      section.style.setProperty("--kinetic-offset", `${-progress * (items.length - 1) * step}px`);
      const index = Math.min(items.length - 1, Math.round(progress * (items.length - 1)));
      setActive((current) => current === index ? current : index);
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [items.length]);

  const goTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(min-width: 1800px) and (min-height: 1000px)").matches) {
      section.querySelectorAll(".kinetic-timeline-item")[index]?.scrollIntoView({ block: "center" });
      return;
    }
    const top = section.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(0, section.offsetHeight - window.innerHeight);
    window.scrollTo({ top: top + distance * index / Math.max(1, items.length - 1), behavior: "smooth" });
  };

  return (
    <>
    {settings?.elementVisibility?.media !== false && <TimelineFilm className="kinetic-timeline-film-mobile" rtl={rtl} settings={settings} />}
    <section
      className="kinetic-timeline section-dark"
      id="timeline"
      ref={sectionRef}
      aria-label={rtl ? "الجدول الزمني" : "Startime timeline"}
      style={{ height: `${100 + (items.length - 1) * 48}svh`, ...style }}
    >
      {(settings?.backgroundImages || settings?.backgroundVideos) && <div className="discover-cms-backdrop" aria-hidden="true">
        {settings.backgroundImages && <ArtDirectedImage images={settings.backgroundImages} fallback="" />}
        <ArtDirectedVideo videos={settings.backgroundVideos} />
        {settings.overlayOpacity !== undefined && <span className="discover-cms-backdrop-overlay" style={{ opacity: settings.overlayOpacity / 100 }} />}
      </div>}
      <div className="kinetic-timeline-stage">
        <div className="kinetic-timeline-meta" aria-live="polite">
          <span className="kinetic-timeline-year" key={items[active].year}>{items[active].year}</span>
        </div>
        <div className="kinetic-timeline-window">
          <div className="kinetic-timeline-track">
            {items.map((item, index) => (
              <button
                className={`kinetic-timeline-item ${active === index ? "is-active" : ""}`}
                type="button"
                aria-current={active === index ? "step" : undefined}
                onClick={() => goTo(index)}
                key={item.year}
              >
                <span className="kinetic-timeline-item-year">{item.year}</span>
                <span className="kinetic-timeline-title">{item.title}</span>
                <span className="kinetic-timeline-body">{item.body}</span>
              </button>
            ))}
          </div>
        </div>
        {settings?.elementVisibility?.media !== false && <TimelineFilm className="kinetic-timeline-film-desktop" rtl={rtl} settings={settings} />}
      </div>
      {settings?.elementVisibility?.media !== false && <TimelineFilm className="kinetic-timeline-film-wide" rtl={rtl} settings={settings} />}
    </section>
    </>
  );
}
