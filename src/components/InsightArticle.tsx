import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { Locale, PublicInsight } from "@/content/types";
import { CmsImage } from "./CmsImage";
import { Reveal } from "./Reveal";

export function InsightArticle({
  insight,
  locale,
}: {
  insight: PublicInsight;
  locale: Locale;
}) {
  const isArabic = locale === "ar";
  const archiveHref = `${isArabic ? "/ar" : ""}/insights`;
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const published = insight.publicationLabel;
  const plainText = (value: Record<string, unknown> | string): string => {
    if (typeof value === "string") return value;
    const read = (entry: unknown): string => {
      if (!entry || typeof entry !== "object") return "";
      const node = entry as { children?: unknown[]; text?: unknown };
      if (typeof node.text === "string") return node.text;
      return Array.isArray(node.children)
        ? node.children.map(read).join(" ")
        : "";
    };
    return read(value.root);
  };
  const readingMinutes = Math.max(
    2,
    Math.ceil(
      insight.content.reduce(
        (total, section) => total + plainText(section.body).split(/\s+/).length,
        0,
      ) / 200,
    ),
  );

  return (
    <article className="insight-article">
      <header className="insight-article__hero">
        <div className="insight-article__media" aria-hidden>
          <CmsImage
            alt=""
            media={insight.featuredImage}
            priority
            sizes="100vw"
          />
        </div>
        <div className="insight-article__veil" />
        <div className="shell insight-article__hero-content">
          <Link
            className="insight-article__back"
            href={archiveHref}
          >
            <BackIcon aria-hidden />
            {isArabic ? "العودة إلى الرؤى والأخبار" : "Back to Insights"}
          </Link>
          <Reveal>
            <p className="eyebrow">
              {isArabic ? "رؤى وأخبار ستارتايم" : "STARTIME INSIGHTS & NEWS"}
            </p>
            <h1>{insight.title}</h1>
            <p className="insight-article__summary">{insight.summary}</p>
            <div className="insight-article__meta-line">
              {insight.category ? <span>{insight.category}</span> : null}
              <span>{published}</span>
              <span>
                {readingMinutes} {isArabic ? "دقائق قراءة" : "min read"}
              </span>
            </div>
          </Reveal>
        </div>
      </header>

      <div className="insight-article__body-wrap">
        <div className="insight-article__accent" />
        <div className="shell insight-article__layout">
          <aside className="insight-article__aside">
            <span>{isArabic ? "نشر في" : "Published"}</span>
            <strong>{published}</strong>
            {insight.category ? (
              <>
                <span>{isArabic ? "التصنيف" : "Category"}</span>
                <strong>{insight.category}</strong>
              </>
            ) : null}
          </aside>
          <div className="insight-article__content">
            {insight.intro ? (
              <Reveal>
                <p className="insight-article__lead">{insight.intro}</p>
              </Reveal>
            ) : null}
            {insight.content.map((section, index) => (
              <Reveal
                className="insight-article__section"
                delay={Math.min(index * 0.04, 0.16)}
                key={`${section.heading || "section"}-${index}`}
              >
                {section.heading ? <h2>{section.heading}</h2> : null}
                {typeof section.body === "string" ? (
                  section.body
                    .split(/\n\n+/)
                    .filter(Boolean)
                    .map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>{paragraph}</p>
                    ))
                ) : (
                  <RichText
                    className="insight-article__rich-text"
                    data={section.body as never}
                  />
                )}
              </Reveal>
            ))}
            <Reveal className="insight-article__footer-card">
              <p className="eyebrow">
                {isArabic ? "المزيد من ستارتايم" : "CONTINUE EXPLORING"}
              </p>
              <h2>
                {isArabic
                  ? "اكتشف المزيد من رؤى وأخبار ستارتايم"
                  : "Discover more Startime insights and news"}
              </h2>
              <Link
                className="button button--primary"
                href={archiveHref}
              >
                {isArabic ? "عرض جميع الرؤى" : "View all insights"}
                {isArabic ? (
                  <ArrowLeft aria-hidden />
                ) : (
                  <ArrowRight aria-hidden />
                )}
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </article>
  );
}
