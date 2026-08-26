import type { Locale, PublicInsightCategory, SiteChrome } from "@/content/types";
import { InsightsCollection } from "./InsightsCollection";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function InsightsArchive({
  categories,
  chrome,
  locale,
}: {
  categories: PublicInsightCategory[];
  chrome: SiteChrome;
  locale: Locale;
}) {
  const arabic = locale === "ar";
  const articles = categories
    .flatMap((category) => category.articles)
    .sort(
      (left, right) =>
        new Date(right.publishedAt || 0).getTime() -
        new Date(left.publishedAt || 0).getTime(),
    );
  return (
    <div className="site" data-locale={locale} dir={arabic ? "rtl" : "ltr"} lang={locale}>
      <SiteHeader chrome={chrome} locale={locale} routePath="/insights" />
      <main id="main-content">
        <section className="insights-archive-hero">
          <div className="shell">
            <p className="eyebrow">{arabic ? "ستارتايم" : "STARTIME"}</p>
            <h1>{arabic ? "الأخبار والرؤى" : "News and Insights"}</h1>
            <p>{arabic ? "تابع أخبار ستارتايم وأبرز المقالات والرؤى التي تواكب القطاعات التي نخدمها." : "Explore Startime news alongside perspectives shaping the industries we serve."}</p>
          </div>
        </section>
        <section className="insights-archive section-pad">
          <div className="shell">
            {articles.length ? <InsightsCollection articles={articles} layout="grid" locale={locale} pageSize={9} /> : <p className="insights-empty">{arabic ? "لا توجد أخبار أو رؤى منشورة حالياً." : "No published insights are available yet."}</p>}
          </div>
        </section>
      </main>
      <SiteFooter chrome={chrome} />
    </div>
  );
}
