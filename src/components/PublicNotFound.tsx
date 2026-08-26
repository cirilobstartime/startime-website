import { ArrowLeft, ArrowRight, Compass } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { Locale, SiteChrome } from "@/content/types";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

type PublicNotFoundProps = {
  chrome: SiteChrome;
  locale: Locale;
};

export function PublicNotFound({ chrome, locale }: PublicNotFoundProps) {
  const arabic = locale === "ar";
  const homeHref = arabic ? "/ar" : "/";

  return (
    <div className="site not-found-site" data-locale={locale} dir={arabic ? "rtl" : "ltr"} lang={locale}>
      <SiteHeader chrome={chrome} locale={locale} routePath="" />
      <main className="not-found" id="main-content">
        <div className="not-found__media" />
        <div className="not-found__shade" />
        <div className="not-found__orb not-found__orb--one" />
        <div className="not-found__orb not-found__orb--two" />
        <section className="not-found__content shell">
          <p className="not-found__code" aria-hidden="true">404</p>
          <div className="not-found__copy">
            <span className="eyebrow">
              {arabic ? "مسار غير موجود" : "Route not found"}
            </span>
            <h1>
              {arabic
                ? "يبدو أن هذه الوجهة ليست هنا."
                : "This destination is not on the map."}
            </h1>
            <p>
              {arabic
                ? "ربما تم نقل الصفحة أو لم تعد متاحة. يمكنك العودة إلى الصفحة الرئيسية لمواصلة استكشاف ستارتايم."
                : "The page may have moved or is no longer available. Return home to continue exploring Startime."}
            </p>
            <Link className="button button--primary" href={homeHref}>
              {arabic ? "العودة إلى الرئيسية" : "Return to homepage"}
              {arabic ? <ArrowLeft aria-hidden /> : <ArrowRight aria-hidden />}
            </Link>
          </div>
          <div className="not-found__compass" aria-hidden="true">
            <Compass weight="thin" />
          </div>
        </section>
      </main>
      <SiteFooter chrome={chrome} />
    </div>
  );
}
