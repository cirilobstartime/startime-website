"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/**
 * Progressive, presentation-quality motion for the public site.
 * It deliberately enhances existing CMS-driven sections instead of changing
 * their content model.  Every animation is removed when a route unmounts.
 */
export function FuturisticMotion() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      document.documentElement.classList.add("has-futuristic-motion");

      gsap.utils.toArray<HTMLElement>(".hero-section").forEach((hero) => {
        const media = hero.querySelector<HTMLElement>(".hero-section__media");
        const headingWords = hero.querySelectorAll<HTMLElement>(
          ".kinetic-heading__word",
        );
        const eyebrow = hero.querySelector<HTMLElement>(".eyebrow");
        const body = hero.querySelector<HTMLElement>(".hero-section__body");
        const buttons = hero.querySelectorAll<HTMLElement>(".hero-section__buttons .button");
        const details = hero.querySelector<HTMLElement>(".hero-section__details");

        if (media) {
          gsap.fromTo(
            media,
            {
              clipPath:
                document.documentElement.dir === "rtl"
                  ? "inset(0 100% 0 0)"
                  : "inset(0 0 0 100%)",
              scale: 1.11,
            },
            {
              clipPath: "inset(0 0 0 0)",
              duration: 1.2,
              ease: "power4.out",
              scale: 1.025,
            },
          );
          gsap.to(media, {
            ease: "none",
            scale: 1.08,
            scrollTrigger: {
              scrub: 0.7,
              start: "top top",
              end: "bottom top",
              trigger: hero,
            },
            yPercent: 5,
          });
        }
        const timeline = gsap.timeline({ delay: 0.25 });
        if (eyebrow) timeline.fromTo(eyebrow, { opacity: 0, x: -18 }, { duration: 0.45, ease: "power3.out", opacity: 1, x: 0 });
        if (headingWords.length) timeline.fromTo(headingWords, { opacity: 0, rotate: 2, yPercent: 116 }, { duration: 0.82, ease: "power4.out", opacity: 1, rotate: 0, stagger: 0.045, yPercent: 0 }, "<0.08");
        if (body) timeline.fromTo(body, { opacity: 0, y: 22 }, { duration: 0.62, ease: "power3.out", opacity: 1, y: 0 }, "<0.2");
        if (buttons.length) timeline.fromTo(buttons, { opacity: 0, y: 15 }, { duration: 0.55, ease: "power3.out", opacity: 1, stagger: 0.1, y: 0 }, "<0.1");
        if (details) {
          timeline.fromTo(
            details,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
            "<0.1",
          );
        }
      });

      gsap.utils.toArray<HTMLElement>(".not-found").forEach((page) => {
        const media = page.querySelector<HTMLElement>(".not-found__media");
        const code = page.querySelector<HTMLElement>(".not-found__code");
        const copy = page.querySelector<HTMLElement>(".not-found__copy");
        const compass = page.querySelector<HTMLElement>(".not-found__compass");
        if (media) {
          gsap.fromTo(
            media,
            {
              clipPath:
                document.documentElement.dir === "rtl"
                  ? "inset(0 100% 0 0)"
                  : "inset(0 0 0 100%)",
              scale: 1.12,
            },
            { clipPath: "inset(0 0 0 0)", duration: 1.25, ease: "power4.out", scale: 1.04 },
          );
        }
        if (code) gsap.fromTo(code, { opacity: 0, xPercent: 12 }, { duration: 0.9, ease: "power3.out", opacity: 1, xPercent: 0 });
        if (copy) gsap.fromTo(copy, { opacity: 0, y: 30 }, { delay: 0.24, duration: 0.82, ease: "power4.out", opacity: 1, y: 0 });
        if (compass) gsap.fromTo(compass, { opacity: 0, rotate: -35, scale: 0.8 }, { delay: 0.38, duration: 1, ease: "power3.out", opacity: 1, rotate: 0, scale: 1 });
      });

      gsap.utils
        .toArray<HTMLElement>(".media-feature__media, .image-story__media")
        .forEach((media) => {
          const image = media.querySelector("img");
          if (!image) return;
          gsap.fromTo(
            image,
            { scale: 1.12, yPercent: -9 },
            {
              ease: "none",
              scale: 1.025,
              scrollTrigger: {
                scrub: 0.8,
                start: "top bottom",
                end: "bottom top",
                trigger: media,
              },
              yPercent: 9,
            },
          );
        });

      gsap.utils.toArray<HTMLElement>(".project-rail-wrap").forEach((wrap) => {
        const cards = wrap.querySelectorAll<HTMLElement>(".project-card");
        if (!cards.length) return;
        gsap.fromTo(
          cards,
          { clipPath: "inset(0 0 14% 0)", y: 44 },
          {
            clipPath: "inset(0 0 0 0)",
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              start: "top 92%",
              toggleActions: "play none none none",
              trigger: wrap,
            },
            stagger: 0.1,
            y: 0,
          },
        );
      });

      const direction = document.documentElement.dir === "rtl" ? 1 : -1;
      const sceneSelectors = [
        ".content-grid",
        ".projects-section",
        ".timeline-section",
        ".media-feature",
        ".image-story",
        ".news-section",
        ".cta-section",
        ".form-section",
        ".location-map",
        ".credibility",
        ".partner-marquee",
      ].join(", ");

      gsap.utils.toArray<HTMLElement>(sceneSelectors).forEach((scene) => {
        const heading = scene.querySelector<HTMLElement>(
          ".section-heading h2, .projects-section__intro h2, .media-feature__content h2, .image-story__content h2, .news-section__intro h2, .cta-section__content h2, .form-section__intro h2, .location-map__heading h2, .partner-marquee__heading h2",
        );
        const eyebrow = scene.querySelector<HTMLElement>(".eyebrow");
        const body = scene.querySelector<HTMLElement>(
          ".section-heading > p, .projects-section__copy p, .media-feature__content > p:not(.eyebrow), .image-story__content > p:not(.eyebrow), .cta-section__content > p:not(.eyebrow), .form-section__intro > p:not(.eyebrow), .location-map__heading p, .partner-marquee__heading > p:not(.eyebrow)",
        );
        const links = scene.querySelectorAll<HTMLElement>(
          ".text-link, .section-buttons .button, .hero-section__buttons .button",
        );
        const sceneTimeline = gsap.timeline({
          scrollTrigger: {
            onEnter: () => scene.classList.add("is-motion-active"),
            start: "top 90%",
            toggleActions: "play none none none",
            trigger: scene,
          },
        });

        if (eyebrow) {
          sceneTimeline.fromTo(
            eyebrow,
            { clipPath: "inset(0 100% 0 0)", x: direction * 20 },
            { clipPath: "inset(0 0% 0 0)", duration: 0.46, ease: "power3.out", x: 0 },
          );
        }
        if (heading) {
          sceneTimeline.fromTo(
            heading,
            { clipPath: "inset(0 0 100% 0)", y: 54 },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 0.88,
              ease: "power4.out",
              onComplete: () => gsap.set(heading, { clearProps: "clipPath" }),
              y: 0,
            },
            eyebrow ? "<0.12" : 0,
          );
        }
        if (body) {
          sceneTimeline.fromTo(
            body,
            { opacity: 0, y: 20 },
            { duration: 0.56, ease: "power3.out", opacity: 1, y: 0 },
            "<0.3",
          );
        }
        if (links.length) {
          sceneTimeline.fromTo(
            links,
            { opacity: 0, y: 14 },
            { duration: 0.42, ease: "power3.out", opacity: 1, stagger: 0.07, y: 0 },
            "<0.12",
          );
        }
      });

      gsap.utils.toArray<HTMLElement>(".content-grid__items, .news-mosaic, .insights-grid").forEach((grid) => {
        const cards = grid.querySelectorAll<HTMLElement>(
          ".content-card, .news-card, .insight-card",
        );
        if (!cards.length) return;
        gsap.fromTo(
          cards,
          { clipPath: "inset(0 0 18% 0)", y: 38 },
          {
            clipPath: "inset(0 0 0 0)",
            duration: 0.86,
            ease: "power4.out",
            scrollTrigger: {
              start: "top 90%",
              toggleActions: "play none none none",
              trigger: grid,
            },
            stagger: 0.09,
            y: 0,
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".timeline--vertical").forEach((timeline) => {
        const steps = timeline.querySelectorAll<HTMLElement>(".timeline__step");
        const markers = timeline.querySelectorAll<HTMLElement>(".timeline__number");
        const isHorizontalJourney = timeline.classList.contains("timeline--journey");
        if (steps.length) {
          gsap.fromTo(
            steps,
            {
              x: isHorizontalJourney
                ? 0
                : (index: number) =>
                    (index % 2 ? 34 : -34) *
                    (document.documentElement.dir === "rtl" ? -1 : 1),
              y: isHorizontalJourney ? 26 : 0,
            },
            {
              duration: 0.72,
              ease: "power3.out",
              scrollTrigger: {
                onEnter: () => timeline.classList.add("is-motion-active"),
                start: "top 92%",
                toggleActions: "play none none none",
                trigger: timeline,
              },
              stagger: 0.13,
              x: 0,
              y: 0,
            },
          );
        }
        if (markers.length) {
          gsap.fromTo(
            markers,
            { scale: 0.55 },
            {
              duration: 0.46,
              ease: "back.out(1.8)",
              scrollTrigger: {
                onEnter: () => timeline.classList.add("is-motion-active"),
                start: "top 92%",
                toggleActions: "play none none none",
                trigger: timeline,
              },
              stagger: 0.13,
              scale: 1,
            },
          );
        }
      });

      gsap.utils.toArray<HTMLElement>(".form-section__panel, .location-map__frame").forEach((panel) => {
        gsap.fromTo(
          panel,
          { clipPath: "inset(0 0 100% 0)", y: 32 },
          {
            clipPath: "inset(0 0 0 0)",
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              start: "top 92%",
              toggleActions: "play none none none",
              trigger: panel,
            },
            y: 0,
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".credibility__logo").forEach((logo, index) => {
        gsap.fromTo(
          logo,
          { opacity: 0, scale: 0.84, y: 16 },
          {
            duration: 0.58,
            ease: "power3.out",
            opacity: 1,
            scrollTrigger: {
              start: "top 94%",
              toggleActions: "play none none none",
              trigger: logo.parentElement,
            },
            delay: Math.min(index * 0.08, 0.32),
            scale: 1,
            y: 0,
          },
        );
      });

      const header = document.querySelector<HTMLElement>(".site-header");
      if (header) {
        const headerItems = header.querySelectorAll<HTMLElement>(
          ".site-header__logo, .site-header__nav a, .site-header__actions > *",
        );
        gsap.fromTo(
          headerItems,
          { opacity: 0, y: -16 },
          { duration: 0.62, ease: "power3.out", opacity: 1, stagger: 0.055, y: 0 },
        );
      }

      gsap.utils.toArray<HTMLElement>(".editorial-swiper, .insights-swiper").forEach((swiper) => {
        const slides = swiper.querySelectorAll<HTMLElement>(
          ".editorial-slide, .insight-card",
        );
        const controls = swiper.querySelector<HTMLElement>(
          ".editorial-swiper__controls, .insights-swiper__controls",
        );
        if (slides.length) {
          gsap.fromTo(
            slides,
            { clipPath: "inset(0 0 18% 0)", x: direction * 36, y: 28 },
            {
              clipPath: "inset(0 0 0 0)",
              duration: 0.9,
              ease: "power4.out",
              scrollTrigger: {
                start: "top 90%",
                toggleActions: "play none none none",
                trigger: swiper,
              },
              stagger: 0.1,
              x: 0,
              y: 0,
            },
          );
        }
        if (controls) {
          gsap.fromTo(
            controls,
            { opacity: 0, y: 16 },
            {
              duration: 0.52,
              ease: "power3.out",
              opacity: 1,
              scrollTrigger: {
                start: "top 90%",
                toggleActions: "play none none none",
                trigger: swiper,
              },
              y: 0,
            },
          );
        }
      });

      gsap.utils
        .toArray<HTMLElement>(
          ".media-feature__media, .image-story__image, .cta-section__media",
        )
        .forEach((media) => {
          gsap.fromTo(
            media,
            {
              clipPath:
                document.documentElement.dir === "rtl"
                  ? "inset(0 100% 0 0)"
                  : "inset(0 0 0 100%)",
            },
            {
              clipPath: "inset(0 0 0 0)",
              duration: 1.1,
              ease: "power4.out",
              scrollTrigger: {
                start: "top 90%",
                toggleActions: "play none none none",
                trigger: media,
              },
            },
          );
        });

      gsap.utils.toArray<HTMLElement>(".form-section__panel form").forEach((form) => {
        const fields = form.querySelectorAll<HTMLElement>("label, input, select, textarea, button");
        if (!fields.length) return;
        gsap.fromTo(
          fields,
          { opacity: 0, y: 14 },
          {
            duration: 0.46,
            ease: "power3.out",
            opacity: 1,
            scrollTrigger: {
              start: "top 92%",
              toggleActions: "play none none none",
              trigger: form,
            },
            stagger: 0.045,
            y: 0,
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".site-footer").forEach((footer) => {
        const columns = footer.querySelectorAll<HTMLElement>(
          ".site-footer__brand, .site-footer__links, .site-footer__contact, .site-footer__bottom",
        );
        if (!columns.length) return;
        gsap.fromTo(
          columns,
          { opacity: 0, y: 30 },
          {
            duration: 0.74,
            ease: "power3.out",
            opacity: 1,
            scrollTrigger: {
              start: "top 92%",
              toggleActions: "play none none none",
              trigger: footer,
            },
            stagger: 0.1,
            y: 0,
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".timeline-section").forEach((section) => {
        const line = section.querySelector<HTMLElement>(".timeline");
        if (!line) return;
        gsap.fromTo(
          line,
          { "--timeline-progress": "0%" } as gsap.TweenVars,
          {
            "--timeline-progress": "100%",
            ease: "none",
            scrollTrigger: { scrub: 0.7, start: "top 75%", end: "bottom 72%", trigger: section },
          } as gsap.TweenVars,
        );
      });

      gsap.utils.toArray<HTMLElement>(".content-grid--tracks").forEach((section) => {
        const cards = section.querySelectorAll<HTMLElement>(".content-card");
        if (!cards.length) return;
        gsap.fromTo(
          cards,
          { opacity: 0, x: document.documentElement.dir === "rtl" ? 32 : -32 },
          {
            duration: 0.72,
            ease: "power3.out",
            opacity: 1,
            scrollTrigger: {
              start: "top 90%",
              toggleActions: "play none none none",
              trigger: section,
            },
            stagger: 0.1,
            x: 0,
          },
        );
      });

      // New route content can change the document height after the layout
      // settles. Refreshing here makes every page (and /ar equivalent) get
      // correct trigger positions, not only the first page loaded.
      ScrollTrigger.refresh();

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh, { once: true });
      document.fonts?.ready.then(refresh).catch(() => undefined);

      return () => window.removeEventListener("load", refresh);
    });

    return () => {
      document.documentElement.classList.remove("has-futuristic-motion");
      context.revert();
    };
  }, [pathname]);

  return null;
}
