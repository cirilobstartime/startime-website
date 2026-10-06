"use client";

import Link from "./CmsLink";
import { postPath } from "@/lib/postPath";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/content/home";
import {
  getPostCategory,
  getPostCopy,
  getPostSummary,
  insightPosts,
  postCategoryLabel,
  type InsightPost,
  type InsightPostCategory,
  type InsightPostType,
} from "@/content/insightPosts";
import { ResponsiveNewsImage } from "@/components/ResponsiveNewsImage";
import { ArtDirectedImage, ArtDirectedVideo } from "@/components/ArtDirectedImage";
import type { EditorialSection } from "@/content/editorialPageCms";
import { homepageVisualStyle } from "@/content/homepageVisual";

const INITIAL_POST_COUNT = 12;
const POST_LOAD_BATCH = 12;

export function PostArchive({
  locale,
  type,
  label,
  title,
  allPosts = insightPosts,
  cmsSection,
  sectionOrder,
}: {
  locale: Locale;
  type: InsightPostType;
  label: string;
  title: string;
  allPosts?: InsightPost[];
  cmsSection?: EditorialSection;
  sectionOrder?: number;
}) {
  const rtl = locale === "ar";
  const [activeCategory, setActiveCategory] = useState<"all" | InsightPostCategory>("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_POST_COUNT);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const posts = useMemo(() => allPosts.filter((post) => post.type === type), [allPosts, type]);
  const categories = useMemo(
    () => Array.from(new Set(posts.map(getPostCategory))),
    [posts],
  );
  const categoryLabels = useMemo(() => new Map(posts.map((post) => [getPostCategory(post), post.categoryLabel])), [posts]);
  const filteredPosts = activeCategory === "all"
    ? posts
    : posts.filter((post) => getPostCategory(post) === activeCategory);
  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMorePosts = visibleCount < filteredPosts.length;
  const filterLabel = cmsSection?.categoriesFilterLabel || (type === "news"
    ? (rtl ? "تصنيف الأخبار" : "News categories")
    : (rtl ? "تصنيف المدونة" : "Blog categories"));
  const allLabel = cmsSection?.allFilterLabel || (type === "news"
    ? (rtl ? "جميع الأخبار" : "All News")
    : (rtl ? "جميع المدونات" : "All Blogs"));

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasMorePosts) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisibleCount((current) => Math.min(current + POST_LOAD_BATCH, filteredPosts.length));
      },
      { rootMargin: "360px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredPosts.length, hasMorePosts]);

  return (
    <section className="insights-archive" id={cmsSection?.anchorID || (type === "news" ? "latest-news" : "latest-insights")} style={{ ...homepageVisualStyle(cmsSection?.visual), order: sectionOrder, display: cmsSection?.visible === false ? "none" : undefined }}>
      {cmsSection?.backgroundImages && <ArtDirectedImage className="editorial-section-background" fallback="" images={cmsSection.backgroundImages} alt="" />}
      <ArtDirectedVideo className="editorial-section-video" videos={cmsSection?.backgroundVideos} />
      <div className="insights-section-heading insights-reveal">{cmsSection?.elementVisibility?.eyebrow !== false && <p className="insights-label">{label}</p>}{cmsSection?.elementVisibility?.heading !== false && <h2>{title}</h2>}</div>
      {cmsSection?.elementVisibility?.items !== false && <div className="insights-archive-filters" role="tablist" aria-label={filterLabel}>
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === "all"}
          className={activeCategory === "all" ? "active" : ""}
          onClick={() => {
            setActiveCategory("all");
            setVisibleCount(INITIAL_POST_COUNT);
          }}
        >{allLabel}</button>
        {categories.map((category) => <button
          type="button"
          role="tab"
          aria-selected={activeCategory === category}
          className={activeCategory === category ? "active" : ""}
          key={category}
          onClick={() => {
            setActiveCategory(category);
            setVisibleCount(INITIAL_POST_COUNT);
          }}
        >{categoryLabels.get(category) || postCategoryLabel(category, locale)}</button>)}
      </div>}
      {cmsSection?.elementVisibility?.items !== false && <div className="insights-archive-grid" aria-live="polite" aria-label={title}>
        {visiblePosts.map((post) => {
          const copy = getPostCopy(post, locale);
          const category = getPostCategory(post);
          return <article className="insights-post-card" key={post.slug}>
            <Link href={postPath(locale, post)}>
              <div className="insights-post-card-media news-responsive-media"><ResponsiveNewsImage post={post} sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 33vw" /></div>
              <div className="insights-post-card-copy"><span>{post.categoryLabel || postCategoryLabel(category, locale)}</span><h3>{copy.title}</h3><p>{getPostSummary(post, locale)}</p><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
            </Link>
          </article>;
        })}
      </div>}
      {cmsSection?.elementVisibility?.items !== false && hasMorePosts ? <div className="insights-archive-sentinel" ref={loadMoreRef} aria-hidden="true" /> : null}
    </section>
  );
}
