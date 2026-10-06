"use client";

import { NewSiteHeader } from "@/components/NewSiteHeader";
import { NewSiteFooter } from "@/components/NewSiteFooter";


import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArtDirectedImage } from "@/components/ArtDirectedImage";
import { PageSectionBackdrop } from "@/components/PageSectionBackdrop";
import { homepageItemStyle, homepageVisualStyle } from "@/content/homepageVisual";
import { contactSectionKeys, type ContactKey, type PageCmsSettings } from "@/content/investmentContactCms";
import { ArrowUpRight } from "@phosphor-icons/react/ArrowUpRight";
import { Clock } from "@phosphor-icons/react/Clock";
import { EnvelopeSimple } from "@phosphor-icons/react/EnvelopeSimple";
import { MapPin } from "@phosphor-icons/react/MapPin";
import { Phone } from "@phosphor-icons/react/Phone";
import { Paperclip } from "@phosphor-icons/react/Paperclip";
import { contactContent } from "@/content/contact";
import { type Locale } from "@/content/home";
import { submitPublicForm } from "@/lib/submitPublicForm";
import { useExternalLinkAttributes } from "@/components/ExternalLinkPolicy";


function safeGoogleMapsURL(value: string, fallback: string): string {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && ["google.com", "www.google.com", "maps.google.com"].includes(url.hostname) && (url.pathname.startsWith("/maps") || url.hostname === "maps.google.com")) return url.href;
  } catch { /* Malformed editor URL uses the approved map. */ }
  return fallback;
}

function coordinateQuery(latitude: string, longitude: string): string | undefined {
  const lat = Number(latitude), lng = Number(longitude);
  if (!latitude.trim() || !longitude.trim() || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return undefined;
  return `${lat},${lng}`;
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`contact-reveal ${className}`}>{children}</div>;
}

export function ContactPage({ locale, square = false, cmsContent, cmsSettings }: { locale: Locale; route?: "contact" | "contact1"; square?: boolean; cmsContent?: (typeof contactContent)["en"]; cmsSettings?: PageCmsSettings<ContactKey> }) {
  const c = cmsContent || contactContent[locale];
  const rtl = locale === "ar";
  const heroRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const section = (key: ContactKey) => cmsSettings?.[key];
  const element = (key: ContactKey, name: "eyebrow" | "heading" | "body" | "media" | "items" | "cta") => section(key)?.elementVisibility?.[name] !== false;
  const orderedKeys = [...(cmsSettings?.order || []), ...contactSectionKeys].filter((key, index, list) => list.indexOf(key) === index);
  const sectionStyle = (key: ContactKey) => ({ ...homepageVisualStyle(section(key)?.visual), order: orderedKeys.indexOf(key) + 1, display: section(key)?.visible === false ? "none" : undefined });
  const coords = coordinateQuery(c.location.latitude, c.location.longitude);
  const mapSrc = coords ? `https://www.google.com/maps?q=${encodeURIComponent(coords)}&output=embed` : safeGoogleMapsURL(c.location.mapEmbedURL, contactContent[locale].location.mapEmbedURL);
  const directionsURL = coords ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords)}` : safeGoogleMapsURL(c.location.directionsURL, contactContent[locale].location.directionsURL);
  const externalAttributes = useExternalLinkAttributes();
  const locationSection = `section:${(section("location")?.anchorID || "contact-location").replace(/[^\w-]/g, "-")}`;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: .12, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".contact-reveal").forEach((element) => observer.observe(element));

    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = heroRef.current;
      if (!hero) return;
      const bounds = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -bounds.top / Math.max(1, hero.offsetHeight)));
      hero.style.setProperty("--contact-hero-progress", String(progress));
      setScrolled((current) => {
        const next = bounds.bottom <= 70;
        return current === next ? current : next;
      });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [locale, rtl]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!submitted) return;
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [submitted]);


  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitPublicForm({ form: event.currentTarget, formKey: "contact", locale, sectionID: "contact-form" });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : String(error));
    } finally {
      setSubmitting(false);
    }
  };

  const factIcons = [EnvelopeSimple, Phone, MapPin, Clock];

  return (
    <main className={`contact-page contact-cms-page image-hero-page ${square ? "sharp-variation" : ""} ${rtl ? "rtl" : "ltr"}`}>
      <NewSiteHeader locale={locale} scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {section("hero")?.visible !== false && <section className="contact-hero contact-cms-section" ref={heroRef} id={section("hero")?.anchorID} style={sectionStyle("hero")}>
        {element("hero", "media") && <ArtDirectedImage className="contact-hero-image" images={section("hero")?.images} fallback={section("hero")?.image || "/assets/contact/startime-contact-hero-v1-optimized.webp"} alt="" loading="eager" />}
        <PageSectionBackdrop settings={section("hero")} />
        <div className="contact-hero-shade" aria-hidden="true" />
        <div className="contact-hero-copy">
          {element("hero", "heading") && <h1>{c.hero.title}</h1>}
          {element("hero", "body") && <p>{c.hero.body}</p>}
        </div>
        {section("hero")?.showScrollCue !== false && <span className="contact-scroll-cue" aria-hidden="true" />}
      </section>}

      {section("form")?.visible !== false && <section className="contact-enquiry contact-cms-section" id={section("form")?.anchorID || "enquiry"} style={sectionStyle("form")}>
        <PageSectionBackdrop settings={section("form")} />
        <Reveal className="contact-enquiry-intro">
          {element("form", "eyebrow") && <p className="contact-label">{c.form.label}</p>}
          {element("form", "heading") && <h2>{c.form.title}</h2>}
          {element("form", "body") && <p>{c.form.body}</p>}
        </Reveal>
        <div className="contact-form-shell contact-reveal" id="contact-form">
          {submitted ? (
            <div className="contact-success" role="status" aria-live="polite">
              <span aria-hidden="true">✓</span>
              <h3>{c.form.successTitle}</h3>
              <p>{c.form.successBody}</p>
            </div>
          ) : (
            <form className="lead-form" data-form-key="contact" onSubmit={submit}>
              <input aria-hidden="true" autoComplete="off" name="companyWebsite" tabIndex={-1} style={{ position: "absolute", left: "-10000px" }} />
              {c.form.fields.slice(0, 5).map((field, index) => (
                <label className={index === 4 ? "contact-field-wide" : ""} key={field}>
                  <span>{field}</span>
                  <input name={["organization", "name", "position", "phone", "email"][index]} type={index === 3 ? "tel" : index === 4 ? "email" : "text"} required={index === 0 || index === 1 || index === 4} />
                </label>
              ))}
              <label className="contact-field-wide">
                <span>{c.form.fields[5]}</span>
                <textarea name="message" rows={5} required />
              </label>
              {section("form")?.showAttachment !== false && <label className="contact-field-wide contact-file">
                <span>{c.form.fields[6]}</span>
                <span className="contact-file-control"><Paperclip aria-hidden="true" /><input name="attachment" type="file" accept=".pdf,.docx,.png,.jpg,.jpeg" /></span>
                <small>{c.form.fileNote}</small>
              </label>}
              <label className="contact-field-wide contact-consent"><input name="consent" type="checkbox" value="yes" required /><span>{c.form.consent}</span></label>
              <p className="contact-privacy">{c.form.privacy}</p>
              {submitError ? <p className="contact-form-error" role="alert">{submitError}</p> : null}
              <button className="contact-submit" type="submit" disabled={submitting}>{submitting ? (rtl ? "جارٍ الإرسال…" : "Sending…") : c.form.submit}<ArrowUpRight aria-hidden="true" /></button>
            </form>
          )}
        </div>
      </section>}

      {section("headquarters")?.visible !== false && <section className="contact-headquarters contact-cms-section" id={section("headquarters")?.anchorID} style={sectionStyle("headquarters")}>
        <PageSectionBackdrop settings={section("headquarters")} />
        <Reveal className="contact-headquarters-heading">
          {element("headquarters", "heading") && <h2>{c.headquarters.title}</h2>}
          {element("headquarters", "body") && <p>{c.headquarters.body}</p>}
        </Reveal>
        <div className="contact-facts">
          {element("headquarters", "items") && c.headquarters.facts.map((fact, index) => {
            if (section("headquarters")?.items?.[index]?.visible === false) return null;
            const Icon = factIcons[index] || MapPin;
            const href = index === 0 ? `mailto:${fact.value}` : index === 1 ? `tel:${fact.value.replace(/[^+\d]/g, "")}` : undefined;
            const content = <><Icon aria-hidden="true" /><span><small>{fact.label}</small><strong>{fact.value}</strong></span></>;
            const style = homepageItemStyle(section("headquarters")?.items?.[index]?.visual);
            return href ? <a className="contact-fact contact-reveal" style={style} href={href} key={fact.label}>{content}</a> : <div className="contact-fact contact-reveal" style={style} key={fact.label}>{content}</div>;
          })}
        </div>
      </section>}

      {section("location")?.visible !== false && <section className="contact-location contact-cms-section" id={section("location")?.anchorID} style={sectionStyle("location")}>
        <PageSectionBackdrop settings={section("location")} />
        <div className="contact-location-heading">
          <Reveal>{element("location", "eyebrow") && <p className="contact-label">{c.location.label}</p>}{element("location", "heading") && <h2>{c.location.title}</h2>}</Reveal>
          <Reveal className="contact-location-copy">{element("location", "body") && <p>{c.location.body}</p>}{element("location", "cta") && <a href={directionsURL} {...externalAttributes(directionsURL, locationSection)}>{c.location.cta}<ArrowUpRight aria-hidden="true" /></a>}</Reveal>
        </div>
        {element("location", "media") && <Reveal className="contact-map">
          <ArtDirectedImage className="contact-map-art" images={section("location")?.mapArtworkImages} fallback={section("location")?.mapArtwork || "/assets/contact/startime-riyadh-map-v1-optimized.webp"} alt="" />
          <iframe title={c.location.mapTitle} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </Reveal>}
      </section>}

      <NewSiteFooter locale={locale} />
    </main>
  );
}
