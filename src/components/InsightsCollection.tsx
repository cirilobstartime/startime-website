"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { Locale, NewsMosaicSection } from "@/content/types";
import { CmsImage } from "./CmsImage";
import { TiltCard } from "./TiltCard";

type Props = {
  articles: NewsMosaicSection["articles"];
  layout: "grid" | "swiper";
  locale: Locale;
  pageSize?: number | null;
};

function ArticleCard({
  article,
  locale,
}: {
  article: NewsMosaicSection["articles"][number];
  locale: Locale;
}) {
  return (
    <TiltCard className="insight-card">
      <div className="insight-card__media">
        <CmsImage
          alt={article.title}
          media={article.media}
          sizes="(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 31vw"
        />
      </div>
      <div className="insight-card__content">
        {article.kicker ? (
          <p className="insight-card__kicker">{article.kicker}</p>
        ) : null}
        <h3>{article.title}</h3>
        {article.summary ? <p>{article.summary}</p> : null}
        {article.href ? (
          <Link aria-label={article.title} href={article.href}>
            <span>{locale === "ar" ? "اقرأ المزيد" : "Read more"}</span>
            <ArrowUpRight aria-hidden />
          </Link>
        ) : null}
      </div>
    </TiltCard>
  );
}

export function InsightsCollection({
  articles,
  layout,
  locale,
  pageSize = 9,
}: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(Math.max(3, Number(pageSize) || 9));

  const move = useCallback(
    (direction: -1 | 1) => {
      const rail = railRef.current;
      if (!rail) return;
      const card = rail.querySelector<HTMLElement>(".insight-card");
      rail.scrollBy({
        behavior: "smooth",
        left:
          direction *
          (locale === "ar" ? -1 : 1) *
          (card ? card.offsetWidth + 18 : rail.clientWidth * 0.8),
      });
    },
    [locale],
  );

  if (layout === "swiper") {
    return (
      <div className="insights-swiper">
        <div
          aria-label={
            locale === "ar"
              ? "أحدث رؤى وأخبار ستارتايم"
              : "Latest Startime insights and news"
          }
          className="insights-swiper__rail"
          ref={railRef}
          role="region"
          tabIndex={0}
        >
          {articles.map((article, index) => (
            <ArticleCard
              article={article}
              key={`${article.title}-${index}`}
              locale={locale}
            />
          ))}
        </div>
        <div className="insights-swiper__controls">
          <button
            aria-label={
              locale === "ar" ? "المقالات السابقة" : "Previous articles"
            }
            onClick={() => move(-1)}
            type="button"
          >
            {locale === "ar" ? (
              <ArrowRight aria-hidden />
            ) : (
              <ArrowLeft aria-hidden />
            )}
          </button>
          <button
            aria-label={locale === "ar" ? "المقالات التالية" : "Next articles"}
            onClick={() => move(1)}
            type="button"
          >
            {locale === "ar" ? (
              <ArrowLeft aria-hidden />
            ) : (
              <ArrowRight aria-hidden />
            )}
          </button>
        </div>
      </div>
    );
  }

  const shown = articles.slice(0, visible);
  return (
    <>
      <div className="insights-grid">
        {shown.map((article, index) => (
          <ArticleCard
            article={article}
            key={`${article.title}-${index}`}
            locale={locale}
          />
        ))}
      </div>
      {visible < articles.length ? (
        <div className="insights-grid__more">
          <button
            className="button button--outline"
            onClick={() =>
              setVisible((count) => count + Math.max(3, Number(pageSize) || 9))
            }
            type="button"
          >
            {locale === "ar" ? "تحميل المزيد" : "Load more insights"}
            <ArrowRight aria-hidden />
          </button>
        </div>
      ) : null}
    </>
  );
}
