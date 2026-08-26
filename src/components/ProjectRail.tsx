"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useRef } from "react";
import type { Locale, Project } from "@/content/types";
import { CmsImage } from "./CmsImage";
import { TiltCard } from "./TiltCard";

type ProjectRailProps = {
  locale: Locale;
  projectCtaLabel?: string | null;
  projects: Project[];
};

export function ProjectRail({
  locale,
  projectCtaLabel,
  projects,
}: ProjectRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const isArabic = locale === "ar";

  function scroll(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({
      behavior: "smooth",
      left: direction * rail.clientWidth * 0.72 * (isArabic ? -1 : 1),
    });
  }

  return (
    <div className="project-rail-wrap">
      <div className="project-rail-actions">
        <button
          aria-label={isArabic ? "المشاريع السابقة" : "Previous projects"}
          onClick={() => scroll(-1)}
          type="button"
        >
          {isArabic ? <ArrowRight /> : <ArrowLeft />}
        </button>
        <button
          aria-label={isArabic ? "المشاريع التالية" : "Next projects"}
          onClick={() => scroll(1)}
          type="button"
        >
          {isArabic ? <ArrowLeft /> : <ArrowRight />}
        </button>
      </div>
      <div
        aria-label={isArabic ? "منصات ستارتايم" : "Startime platforms"}
        className="project-rail"
        ref={railRef}
      >
        {projects.map((project, index) => (
          <TiltCard className={`project-card ${project.featured ? "project-card--featured" : ""}`} key={`${project.title}-${index}`}>
            <div className="project-card__media">
              <CmsImage
                alt={project.title}
                media={project.image || project.logo}
                sizes="(max-width: 720px) 80vw, 28vw"
              />
              <div className="project-card__veil" />
            </div>
            <div className="project-card__content">
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              {project.href ? (
                <Link
                  aria-label={`${project.title} — ${projectCtaLabel || (isArabic ? "استكشف المنتدى" : "Explore the Forum")}`}
                  href={project.href}
                >
                  <span>
                    {projectCtaLabel ||
                      (isArabic ? "استكشف المنتدى" : "Explore the Forum")}
                  </span>
                  <ArrowUpRight aria-hidden />
                </Link>
              ) : null}
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
