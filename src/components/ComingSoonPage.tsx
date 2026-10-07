import Image from "next/image";
import Link from "./CmsLink";
import styles from "./ComingSoonPage.module.css";

type Locale = "en" | "ar";

const copy = {
  en: {
    title: "The next chapter is taking shape.",
    description: "Something new is on the horizon. We’re preparing a new Startime experience.",
    home: "Back to homepage",
    contact: "Contact us",
    language: "العربية",
    logoLabel: "Startime — Home",
  },
  ar: {
    title: "الفصل القادم يتشكّل.",
    description: "شيء جديد يلوح في الأفق. نُعدّ تجربة جديدة لستارتايم.",
    home: "العودة للرئيسية",
    contact: "تواصل معنا",
    language: "English",
    logoLabel: "ستارتايم — الرئيسية",
  },
} as const;

export function ComingSoonPage({ locale }: { locale: Locale }) {
  const content = copy[locale];
  const otherLocale = locale === "en" ? "ar" : "en";

  return (
    <main className={`${styles.page} ${locale === "ar" ? `${styles.arabic} rtl` : ""}`} lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className={styles.scene} aria-hidden="true" />
      <header className={styles.header}>
        <Link href={`/${locale}`} className={styles.logoLink} aria-label={content.logoLabel}>
          <Image src="/assets/brand/startime-white.svg" alt="Startime" width={650} height={300} priority className={styles.logo} />
        </Link>
        <Link href={`/${otherLocale}/coming-soon`} className={styles.language} lang={otherLocale}>
          {content.language}
        </Link>
      </header>

      <div className={styles.content}>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
        <div className={styles.actions}>
          <Link href={`/${locale}`} className={styles.primary}>
            <span>{content.home}</span>
            <svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" /></svg>
          </Link>
          <Link href={`/${locale}/contact`} className={styles.secondary}>{content.contact}</Link>
        </div>
      </div>

      <footer className={styles.footer}>Startime</footer>
    </main>
  );
}
