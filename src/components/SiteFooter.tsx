import {
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  LinkSimple,
  LinkedinLogo,
  MapPin,
  Phone,
  ThreadsLogo,
  TiktokLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { SiteChrome } from "@/content/types";
import { CmsImage } from "./CmsImage";

const socialIcons = {
  facebook: FacebookLogo,
  instagram: InstagramLogo,
  linkedin: LinkedinLogo,
  threads: ThreadsLogo,
  tiktok: TiktokLogo,
  x: XLogo,
  youtube: YoutubeLogo,
};

function normalizeSocialIcon(link: SiteChrome["socialLinks"][number]) {
  const iconName = (link.icon || link.platform).trim().toLowerCase();
  const aliases: Record<string, keyof typeof socialIcons> = {
    facebook: "facebook",
    instagram: "instagram",
    linkedin: "linkedin",
    threads: "threads",
    tiktok: "tiktok",
    twitter: "x",
    x: "x",
    youtube: "youtube",
  };

  return socialIcons[aliases[iconName]] || LinkSimple;
}

export function SiteFooter({ chrome }: { chrome: SiteChrome }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid shell">
        <div className="site-footer__brand">
          <div className="site-footer__logo">
            <CmsImage
              alt="Startime"
              media={chrome.footerLogo || "/assets/brand/startime-white.svg"}
              sizes="180px"
            />
          </div>
          <p>{chrome.footerDescription}</p>
          <div className="site-footer__socials">
            {chrome.socialLinks.map((link, index) => {
              const Icon = normalizeSocialIcon(link);
              return (
                <a
                  aria-label={link.platform}
                  href={link.href}
                  key={`${link.href}-${index}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Icon aria-hidden />
                </a>
              );
            })}
          </div>
          {chrome.sisterCompanies.length ? (
            <div className="site-footer__sister-companies">
              <h2>{chrome.sisterCompaniesHeading}</h2>
              <div className="site-footer__sister-grid">
                {chrome.sisterCompanies.map((company, index) => {
                  const logo = (
                    <CmsImage
                      alt={company.alt}
                      media={company.logo}
                      sizes="(max-width: 720px) 240px, 150px"
                    />
                  );

                  return company.href ? (
                    <a
                      aria-label={company.alt}
                      href={company.href}
                      key={`${company.href}-${index}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {logo}
                    </a>
                  ) : (
                    <span key={`${company.alt}-${index}`}>{logo}</span>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
        <div className="site-footer__links">
          <h2>{chrome.companyHeading}</h2>
          {chrome.navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="site-footer__contact">
          <h2>{chrome.contactHeading}</h2>
          <p>
            <MapPin aria-hidden />
            <span>{chrome.address}</span>
          </p>
          <a href={`tel:${chrome.phone}`}>
            <Phone aria-hidden />
            {chrome.phone}
          </a>
          <a href={`mailto:${chrome.email}`}>
            <EnvelopeSimple aria-hidden />
            {chrome.email}
          </a>
        </div>
      </div>
      <div className="site-footer__bottom shell">
        <p>{chrome.copyright}</p>
      </div>
    </footer>
  );
}
