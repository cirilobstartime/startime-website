"use client";

import Image from "next/image";
import Link from "./CmsLink";
import { MapPin } from "@phosphor-icons/react/MapPin";
import { Phone } from "@phosphor-icons/react/Phone";
import { EnvelopeSimple } from "@phosphor-icons/react/EnvelopeSimple";
import type { CSSProperties } from "react";
import type { Locale } from "@/content/home";
import { AllianceStrip } from "./AllianceStrip";
import { DunsRegisteredSeal } from "./DunsRegisteredSeal";
import { useNewSiteChrome } from "./NewSiteChromeProvider";
import { NewSiteSocialLinks } from "./NewSiteSocialLinks";
import { useExternalLinkAttributes } from "./ExternalLinkPolicy";

export function NewSiteFooter({ locale, home = false }: { locale: Locale; home?: boolean }) {
  const { footer } = useNewSiteChrome();
  const externalAttributes = useExternalLinkAttributes();
  const rtl = locale === "ar";
  const style = {
    "--cms-footer-background": footer.backgroundColor,
    "--cms-footer-text": footer.textColor,
    "--cms-footer-muted": footer.mutedTextColor,
    "--cms-footer-hover": footer.linkHoverColor,
    "--cms-footer-icon": footer.iconColor,
    "--cms-footer-social-background": footer.socialBackgroundColor,
    "--cms-footer-social-hover": footer.socialHoverColor,
    "--cms-footer-divider": footer.dividerColor,
    "--cms-footer-copyright": footer.copyrightColor,
    "--cms-footer-pattern-opacity": footer.patternOpacity / 100,
  } as CSSProperties;
  const phoneHref = `tel:${footer.phone.replace(/[^+\d]/g, "")}`;
  return <footer className={`home2-footer${footer.showPattern ? " cms-footer-pattern-visible" : ""}${footer.logoTreatment === "original" ? " cms-footer-logo-original" : ""}${footer.allianceLogoTreatment === "original" ? " cms-alliance-logo-original" : ""}`} id={home ? "home2-footer" : "footer"} style={style}>
    {footer.showPattern && footer.pattern ? <Image className="home2-footer-pattern" src={footer.pattern} alt="" fill sizes="100vw" aria-hidden="true" /> : null}
    <div className="home2-footer-main">
      <div className="home2-footer-about">
        <Image src={footer.logo} alt={footer.logoAlt} width={460} height={183} sizes="180px" />
        <p>{footer.description}</p>
        <div><NewSiteSocialLinks links={footer.socialLinks} /></div>
      </div>
      <nav aria-label={rtl ? "روابط التذييل" : "Footer links"}>{footer.links.map((link) => <Link key={`${link.href}-${link.label}`} href={link.href} {...externalAttributes(link.href, "footer")}>{link.label}</Link>)}</nav>
      <div className="home2-contact">
        {footer.address ? <span className="footer-contact-item"><MapPin aria-hidden="true" />{footer.addressHref ? <a href={footer.addressHref} {...externalAttributes(footer.addressHref, "footer")} className="cms-footer-address">{footer.address}</a> : <span className="cms-footer-address">{footer.address}</span>}</span> : null}
        {footer.phone ? <a className="footer-contact-item" href={phoneHref}><Phone aria-hidden="true" /><span>{footer.phone}</span></a> : null}
        {footer.email ? <a className="footer-contact-item" href={`mailto:${footer.email}`}><EnvelopeSimple aria-hidden="true" /><span>{footer.email}</span></a> : null}
        {footer.showDunsSeal ? <DunsRegisteredSeal rtl={rtl} src={footer.dunsSealURL} /> : null}
      </div>
    </div>
    <AllianceStrip rtl={rtl} label={footer.allianceLabel} memberLogo={footer.allianceMemberLogo} memberLogoAlt={footer.allianceMemberLogoAlt} logos={footer.allianceLogos} />
    <div className="home2-footer-bottom"><span>{footer.copyright}</span></div>
  </footer>;
}
