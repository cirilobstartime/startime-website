"use client";

import { type RefObject, useEffect } from "react";

type Options = {
  interval?: number;
  locale: "en" | "ar";
  railRef: RefObject<HTMLElement | null>;
  slideSelector: string;
};

/**
 * Advances horizontal rails gently on small screens. User interaction pauses
 * autoplay, and the behavior is disabled entirely when reduced motion is set.
 */
export function useMobileCarouselAutoplay({
  interval = 5600,
  locale,
  railRef,
  slideSelector,
}: Options) {
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const mobile = window.matchMedia("(max-width: 760px)");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let timer: number | null = null;
    let resumeTimer: number | null = null;
    let inView = false;

    const stop = () => {
      if (timer !== null) window.clearInterval(timer);
      timer = null;
    };

    const nearestIndex = (slides: HTMLElement[]) => {
      const railRect = rail.getBoundingClientRect();
      const edge = locale === "ar" ? railRect.right : railRect.left;
      return slides.reduce((nearest, slide, index) => {
        const rect = slide.getBoundingClientRect();
        const slideEdge = locale === "ar" ? rect.right : rect.left;
        const nearestRect = slides[nearest].getBoundingClientRect();
        const nearestEdge =
          locale === "ar" ? nearestRect.right : nearestRect.left;
        return Math.abs(slideEdge - edge) < Math.abs(nearestEdge - edge)
          ? index
          : nearest;
      }, 0);
    };

    const advance = () => {
      const slides = Array.from(
        rail.querySelectorAll<HTMLElement>(slideSelector),
      );
      if (slides.length < 2 || document.hidden) return;
      const current = nearestIndex(slides);
      const nextIndex = (current + 1) % slides.length;
      if (nextIndex === 0) {
        rail.scrollTo({ behavior: "smooth", left: 0 });
        return;
      }
      const currentLeft = slides[current].getBoundingClientRect().left;
      const nextLeft = slides[nextIndex].getBoundingClientRect().left;
      rail.scrollBy({ behavior: "smooth", left: nextLeft - currentLeft });
    };

    const start = () => {
      stop();
      if (!inView || !mobile.matches || reducedMotion.matches) return;
      timer = window.setInterval(advance, interval);
    };

    const pauseThenResume = () => {
      stop();
      if (resumeTimer !== null) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(start, interval);
    };

    const pause = () => stop();
    const resume = () => start();

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
        else stop();
      },
      { threshold: 0.18 },
    );

    observer.observe(rail);
    mobile.addEventListener("change", start);
    reducedMotion.addEventListener("change", start);
    rail.addEventListener("pointerdown", pauseThenResume, { passive: true });
    rail.addEventListener("touchstart", pauseThenResume, { passive: true });
    rail.addEventListener("focusin", pause);
    rail.addEventListener("focusout", resume);
    rail.addEventListener("mouseenter", pause);
    rail.addEventListener("mouseleave", resume);

    return () => {
      stop();
      observer.disconnect();
      if (resumeTimer !== null) window.clearTimeout(resumeTimer);
      mobile.removeEventListener("change", start);
      reducedMotion.removeEventListener("change", start);
      rail.removeEventListener("pointerdown", pauseThenResume);
      rail.removeEventListener("touchstart", pauseThenResume);
      rail.removeEventListener("focusin", pause);
      rail.removeEventListener("focusout", resume);
      rail.removeEventListener("mouseenter", pause);
      rail.removeEventListener("mouseleave", resume);
    };
  }, [interval, locale, railRef, slideSelector]);
}
