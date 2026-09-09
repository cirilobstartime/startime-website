import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type {
  Locale,
  MaintenanceSettings,
  SiteChrome,
} from "@/content/types";
import { CmsImage, CmsMedia } from "./CmsImage";

type MaintenanceModeProps = {
  chrome: SiteChrome;
  locale: Locale;
  settings: MaintenanceSettings;
};

export function MaintenanceMode({
  chrome,
  locale,
  settings,
}: MaintenanceModeProps) {
  const arabic = locale === "ar";
  const background = settings.backgroundMedia;

  return (
    <main
      className="maintenance-mode"
      dir={arabic ? "rtl" : "ltr"}
      id="main-content"
      lang={locale}
      style={
        {
          "--maintenance-overlay": settings.overlayOpacity / 100,
        } as React.CSSProperties
      }
    >
      {background ? (
        <div className="maintenance-mode__media" aria-hidden="true">
          <CmsMedia
            alt=""
            media={background}
            mobileMedia={settings.mobileBackgroundMedia}
            priority
          />
        </div>
      ) : null}
      <div className="maintenance-mode__wash" />
      <div className="maintenance-mode__grid" aria-hidden="true" />

      <div className="maintenance-mode__shell">
        <div className="maintenance-mode__topline">
          <span className="maintenance-mode__logo">
            <CmsImage
              alt={chrome.siteName}
              media={
                settings.logo ||
                chrome.headerLogo ||
                "/assets/brand/startime-white.svg"
              }
              priority
              sizes="220px"
            />
          </span>
          <span className="maintenance-mode__status">
            <i aria-hidden="true" />
            {settings.statusLabel}
          </span>
        </div>

        <section className="maintenance-mode__content">
          {settings.eyebrow ? (
            <p className="maintenance-mode__eyebrow">{settings.eyebrow}</p>
          ) : null}
          <h1>{settings.heading}</h1>
          <p className="maintenance-mode__message">{settings.message}</p>
          {settings.showContactLink && settings.contactHref ? (
            <a
              className="maintenance-mode__contact"
              href={settings.contactHref}
            >
              {settings.contactLabel}
              <ArrowUpRight aria-hidden weight="bold" />
            </a>
          ) : null}
        </section>

        <div className="maintenance-mode__footerline" aria-hidden="true">
          <span>STARTIME</span>
          <span>2009 — 2030</span>
        </div>
      </div>
    </main>
  );
}
