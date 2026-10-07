import Image from "next/image";
import Link from "./CmsLink";
import styles from "./MaintenancePage.module.css";

type Locale = "en" | "ar";

const copy = {
  en: {
    title: "We’re improving your experience.",
    description: "Our website is temporarily unavailable while we make updates. For urgent inquiries, contact us directly.",
    email: "Email Startime",
    retry: "Try again",
    language: "العربية",
    logoLabel: "Startime — Home",
  },
  ar: {
    title: "نعمل على تحسين تجربتكم.",
    description: "موقعنا غير متاح مؤقتًا بينما نجري بعض التحديثات. للاستفسارات العاجلة، تواصلوا معنا مباشرةً.",
    email: "راسلوا ستارتايم",
    retry: "حاولوا مجددًا",
    language: "English",
    logoLabel: "ستارتايم — الرئيسية",
  },
} as const;

export function MaintenancePage({ locale }: { locale: Locale }) {
  const content = copy[locale];
  const otherLocale = locale === "en" ? "ar" : "en";

  return (
    <main className={`${styles.page} ${locale === "ar" ? `${styles.arabic} rtl` : ""}`} lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className={styles.scene} aria-hidden="true" />
      <header className={styles.header}>
        <Link href={`/${locale}`} className={styles.logoLink} aria-label={content.logoLabel}>
          <Image src="/assets/brand/startime-white.svg" alt="Startime" width={650} height={300} priority className={styles.logo} />
        </Link>
        <Link href={`/${otherLocale}/maintenance`} className={styles.language} lang={otherLocale}>
          {content.language}
        </Link>
      </header>

      <div className={styles.content}>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
        <div className={styles.actions}>
          <a href="mailto:info@startime.sa" className={styles.primary}>{content.email}</a>
          <a href={`/${locale}`} className={styles.secondary}>{content.retry}</a>
        </div>
      </div>

      <footer className={styles.footer}>Startime</footer>
    </main>
  );
}
