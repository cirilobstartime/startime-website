"use client";

import Image from "next/image";
import Link from "./CmsLink";
import { usePathname } from "next/navigation";
import styles from "./NotFoundExperience.module.css";

const content = {
  en: {
    navigation: [
      ["Home", ""],
      ["Discover", "discover"],
      ["Vision", "vision"],
      ["Investment", "investment"],
      ["Careers", "careers"],
      ["Insights", "insights"],
    ],
    eyebrow: "PAGE NOT FOUND · 404",
    title: "A different path awaits.",
    description: "The page you’re looking for may have moved. Let’s find your way forward.",
    home: "Back to homepage",
    vision: "Explore our vision",
    language: "العربية",
    footer: "Every new direction begins somewhere.",
  },
  ar: {
    navigation: [
      ["الرئيسية", ""],
      ["اكتشف", "discover"],
      ["الرؤية", "vision"],
      ["الاستثمار", "investment"],
      ["الوظائف", "careers"],
      ["الرؤى", "insights"],
    ],
    eyebrow: "الصفحة غير موجودة · ٤٠٤",
    title: "طريق آخر ينتظرك.",
    description: "قد تكون الصفحة التي تبحث عنها قد انتقلت. لنساعدك على إيجاد طريقك.",
    home: "العودة للرئيسية",
    vision: "اكتشف رؤيتنا",
    language: "English",
    footer: "كل وجهة جديدة تبدأ من مكان ما.",
  },
} as const;

export function NotFoundExperience() {
  const pathname = usePathname() || "";
  const locale = pathname.startsWith("/ar") ? "ar" : "en";
  const copy = content[locale];
  const otherLocale = locale === "ar" ? "en" : "ar";
  const languageDestination = pathname.startsWith(`/${locale}`)
    ? `/${otherLocale}${pathname.slice(3)}`
    : `/${otherLocale}`;

  return (
    <main className={`${styles.page} ${locale === "ar" ? `${styles.arabic} rtl` : ""}`} lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className={styles.image} aria-hidden="true" />
      <div className={styles.shade} aria-hidden="true" />

      <header className={styles.header}>
        <Link href={`/${locale}`} className={styles.logoLink} aria-label={locale === "ar" ? "ستارتايم - الرئيسية" : "Startime - Home"}>
          <Image src="/assets/brand/startime-white.svg" alt="Startime" width={650} height={300} className={styles.logo} priority />
        </Link>
        <nav className={styles.nav} aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
          {copy.navigation.map(([label, path]) => (
            <Link href={`/${locale}${path ? `/${path}` : ""}`} key={path || "home"}>{label}</Link>
          ))}
        </nav>
        <Link href={languageDestination} className={styles.language} lang={otherLocale} prefetch={false}>
          {copy.language}
        </Link>
      </header>

      <div className={styles.content}>
        <span className={styles.eyebrow}><span className={styles.eyebrowRule} />{copy.eyebrow}</span>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
        <div className={styles.actions}>
          <Link href={`/${locale}`} className={styles.primary}>{copy.home}<span aria-hidden="true">{locale === "ar" ? "←" : "→"}</span></Link>
          <Link href={`/${locale}/vision`} className={styles.secondary}>{copy.vision}<span aria-hidden="true">↗</span></Link>
        </div>
      </div>

      <div className={styles.number} aria-hidden="true">404</div>
      <footer className={styles.footer}><span>Startime</span><span>{copy.footer}</span></footer>
    </main>
  );
}
