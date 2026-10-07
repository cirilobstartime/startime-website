"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import Link from "./CmsLink";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CardGridSection, Locale } from "@/content/types";
import { CmsImage } from "./CmsImage";
import { useMobileCarouselAutoplay } from "./useMobileCarouselAutoplay";

type EditorialSwiperProps = {
  cards: CardGridSection["cards"];
  locale: Locale;
};

export function EditorialSwiper({ cards, locale }: EditorialSwiperProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const visibleCards = cards.filter((card) => card.visible !== false);

  useMobileCarouselAutoplay({
    interval: 5600,
    locale,
    railRef,
    slideSelector: ".editorial-slide",
  });

  const updateActive = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const slides = Array.from(
      rail.querySelectorAll<HTMLElement>(".editorial-slide"),
    );
    if (!slides.length) return;
    const railStart = locale === "ar" ? rail.getBoundingClientRect().right : rail.getBoundingClientRect().left;
    const edge = (slide: HTMLElement) => locale === "ar" ? slide.getBoundingClientRect().right : slide.getBoundingClientRect().left;
    const index = slides.reduce(
      (nearest, slide, slideIndex) =>
        Math.abs(edge(slide) - railStart) <
        Math.abs(edge(slides[nearest]) - railStart)
          ? slideIndex
          : nearest,
      0,
    );
    setActive(index);
    setAtEnd(Math.abs(rail.scrollLeft) >= rail.scrollWidth - rail.clientWidth - 2);
  }, [locale]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    rail.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    updateActive();
    return () => { rail.removeEventListener("scroll", updateActive); window.removeEventListener("resize", updateActive); };
  }, [updateActive]);

  const move = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const nextIndex = Math.max(
      0,
      Math.min(visibleCards.length - 1, active + direction),
    );
    rail
      .querySelectorAll<HTMLElement>(".editorial-slide")
      [nextIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
  };

  return (
    <div className="editorial-swiper">
      <div
        aria-label={
          locale === "ar"
            ? "فعاليات واستثمارات ستارتايم"
            : "Startime events and investments"
        }
        className="editorial-swiper__rail"
        dir={locale === "ar" ? "rtl" : "ltr"}
        ref={railRef}
        role="region"
        tabIndex={0}
      >
        {visibleCards.map((card, index) => (
          <article
            className={`editorial-slide ${index === 0 ? "editorial-slide--featured" : ""} ${index === active ? "is-active" : ""}`}
            key={card.id || `${card.title}-${index}`}
          >
            <div className="editorial-slide__media">
              <CmsImage
                alt={card.title}
                media={card.media}
                sizes="(max-width: 720px) 88vw, (max-width: 1100px) 60vw, 46vw"
              />
              <span className="editorial-slide__index">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="editorial-slide__content">
              {card.eyebrow ? (
                <p className={`eyebrow eyebrow--${card.eyebrowSize || "default"}`}>
                  {card.eyebrow}
                </p>
              ) : null}
              {card.meta ? (
                <p className="editorial-slide__meta">{card.meta}</p>
              ) : null}
              <h3>{card.title}</h3>
              {card.body ? <p>{card.body}</p> : null}
              {card.button?.href && card.button.label ? (
                <Link className="text-link" href={card.button.href}>
                  {card.button.label}
                  <ArrowRight aria-hidden />
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      <div className="editorial-swiper__controls">
        <p aria-live="polite">
          <strong>{String(active + 1).padStart(2, "0")}</strong>
          <span>/ {String(visibleCards.length).padStart(2, "0")}</span>
        </p>
        <div className="editorial-swiper__progress" aria-hidden>
          <span
            style={{
              transform: `scaleX(${visibleCards.length ? (active + 1) / visibleCards.length : 0})`,
            }}
          />
        </div>
        <div className="editorial-swiper__buttons">
          <button
            aria-label={locale === "ar" ? "العنصر السابق" : "Previous item"}
            disabled={active === 0}
            onClick={() => move(-1)}
            type="button"
          >
            <ArrowLeft weight="bold" aria-hidden />
          </button>
          <button
            aria-label={locale === "ar" ? "العنصر التالي" : "Next item"}
            disabled={atEnd || active >= visibleCards.length - 1}
            onClick={() => move(1)}
            type="button"
          >
            <ArrowRight weight="bold" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
