import {
  Anchor,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Buildings,
  CalendarBlank,
  ChartLineUp,
  Check,
  Circuitry,
  Compass,
  DownloadSimple,
  Factory,
  Gear,
  GlobeHemisphereWest,
  Handshake,
  Heartbeat,
  Lightbulb,
  MapPin,
  Megaphone,
  Mountains,
  ShieldCheck,
  Sparkle,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { CSSProperties, ReactNode } from "react";
import type {
  CallToActionSection,
  CardGridSection,
  CredibilitySection,
  FormSection,
  HeroSection,
  ImageStorySection,
  Locale,
  LogoMarqueeSection,
  MapSection,
  MediaFeatureSection,
  NewsMosaicSection,
  PageSection,
  ProjectShowcaseSection,
  RichTextSection,
  TimelineSection,
} from "@/content/types";
import { createFormToken } from "@/lib/formSecurity";
import { CmsImage, CmsMedia, getMediaURL } from "./CmsImage";
import { EditorialSwiper } from "./EditorialSwiper";
import { InsightsCollection } from "./InsightsCollection";
import { LeadForm } from "./LeadForm";
import { HeroMotion, Reveal } from "./Reveal";
import { ProjectRail } from "./ProjectRail";
import { TeamCardMotion } from "./TeamCardMotion";
import { TiltCard } from "./TiltCard";
import { KineticHeading } from "./KineticHeading";
import { AnimatedCounter } from "./AnimatedCounter";

function TextLink({
  href,
  label,
}: {
  href?: string | null;
  label?: string | null;
}) {
  if (!href || !label) return null;
  return (
    <Link className="text-link" href={href}>
      {label}
      <ArrowUpRight aria-hidden weight="bold" />
    </Link>
  );
}

function Eyebrow({
  children,
  size = "default",
}: {
  children?: string | null;
  size?: "small" | "default" | "large" | null;
}) {
  if (!children) return null;
  return <p className={`eyebrow eyebrow--${size || "default"}`}>{children}</p>;
}

const icons = {
  anchor: Anchor,
  buildings: Buildings,
  calendar: CalendarBlank,
  chart: ChartLineUp,
  circuitry: Circuitry,
  compass: Compass,
  factory: Factory,
  gear: Gear,
  globe: GlobeHemisphereWest,
  handshake: Handshake,
  heartbeat: Heartbeat,
  lightbulb: Lightbulb,
  megaphone: Megaphone,
  mountains: Mountains,
  shield: ShieldCheck,
  sparkle: Sparkle,
  users: UsersThree,
  check: Check,
} as const;

function ButtonIcon({ name }: { name?: string | null }) {
  if (name === "none") return null;
  if (name === "download") return <DownloadSimple aria-hidden weight="bold" />;
  return name === "arrow-right" ? (
    <ArrowRight aria-hidden weight="bold" />
  ) : (
    <ArrowUpRight aria-hidden weight="bold" />
  );
}

function SectionBackground({
  children,
  className,
  section,
}: {
  children: ReactNode;
  className: string;
  section: PageSection;
}) {
  const background =
    section.appearance?.backgroundImage &&
    typeof section.appearance.backgroundImage === "object"
      ? section.appearance.backgroundImage.url
      : typeof section.appearance?.backgroundImage === "string"
        ? section.appearance.backgroundImage
        : undefined;
  const style = {
    "--section-bg": section.appearance?.backgroundColor || undefined,
    "--section-image": background ? `url("${background}")` : undefined,
    "--section-overlay": background
      ? String(Number(section.appearance?.overlayOpacity ?? 0) / 100)
      : "0",
  } as CSSProperties;
  return (
    <section
      className={`${className} section-surface section-surface--${
        section.appearance?.theme || "light"
      } section-surface--${section.appearance?.spacing || "large"}`}
      data-background-media={background ? "true" : undefined}
      data-section-type={section.blockType}
      id={section.anchorID || undefined}
      style={style}
    >
      {children}
    </section>
  );
}

function Hero({
  locale,
  pagePath,
  section,
}: {
  locale: Locale;
  pagePath: string;
  section: HeroSection;
}) {
  const isSimfPage = pagePath.endsWith("/simf");
  const isHomePage = pagePath === "/" || pagePath === "/ar";
  const youtubeID = getYouTubeID(section.youtubeURL);
  const useYouTube = section.mediaType === "youtube" && youtubeID;
  const isViewportHero = section.heroHeight !== "standard";
  const animateDetails = pagePath.endsWith("/solutions");
  const detailIcons =
    section.eventDetails && section.eventDetails.length > 2
      ? [CalendarBlank, Lightbulb, Handshake, GlobeHemisphereWest]
      : [CalendarBlank, MapPin];

  return (
    <section
      className={`hero-section${isSimfPage ? " hero-section--simf" : ""}${
        isHomePage ? " hero-section--home" : ""
      }${isViewportHero ? " hero-section--viewport" : ""}${
        pagePath.endsWith("/solutions") ? " hero-section--solutions" : ""
      }`}
    >
      <div className="hero-section__media">
        {useYouTube ? (
          <iframe
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            aria-label=""
            className="hero-section__youtube"
            src={`https://www.youtube-nocookie.com/embed/${youtubeID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeID}&playsinline=1&rel=0&modestbranding=1`}
            title="Hero background video"
          />
        ) : (
          <CmsMedia
            alt=""
            media={section.media}
            mobileMedia={section.mobileMedia}
            priority
            sizes="100vw"
          />
        )}
      </div>
      <div className="hero-section__shade" />
      <div className="hero-section__content shell">
        <HeroMotion>
          <Eyebrow size={section.eyebrowSize}>{section.eyebrow}</Eyebrow>
          <h1><KineticHeading>{section.heading}</KineticHeading></h1>
          {section.body ? (
            <p className="hero-section__body">{section.body}</p>
          ) : null}
          {section.buttons?.length ? (
            <div className="hero-section__buttons">
              {section.buttons.map((button) => (
                <Link
                  className={`button button--${button.style || "primary"}`}
                  href={button.href}
                  key={`${button.href}-${button.label}`}
                  rel={button.openInNewTab ? "noreferrer" : undefined}
                  target={button.openInNewTab ? "_blank" : undefined}
                >
                  {button.label}
                  <ButtonIcon name={button.icon} />
                </Link>
              ))}
            </div>
          ) : null}
          {section.eventDetails?.length ? (
            <div className="hero-section__details">
              {section.eventDetails.map((detail, index) => (
                <div key={`${detail.label}-${detail.value}`}>
                  <span className="hero-section__detail-icon">
                    {(() => {
                      const DetailIcon = detailIcons[index] || Sparkle;
                      return <DetailIcon aria-hidden />;
                    })()}
                  </span>
                  <span>
                    <small>{detail.label}</small>
                    <strong>
                      {animateDetails ? (
                        <AnimatedCounter value={detail.value} />
                      ) : (
                        detail.value
                      )}
                    </strong>
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </HeroMotion>
      </div>
      {!isHomePage ? (
        <a
          aria-label={locale === "ar" ? "الانتقال إلى المحتوى" : "Continue"}
          className="hero-section__scroll"
          href="#after-hero"
        >
          <ArrowDown aria-hidden />
        </a>
      ) : null}
    </section>
  );
}

function getYouTubeID(url?: string | null) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1) || null;
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v") || parsed.pathname.match(/\/embed\/([^/?]+)/)?.[1] || null;
    }
  } catch {
    return null;
  }
  return null;
}

function CardGrid({
  locale,
  section,
}: {
  locale: Locale;
  section: CardGridSection;
}) {
  const visibleCards = section.cards.filter((card) => card.visible !== false);
  return (
    <SectionBackground
      className={`content-grid content-grid--${section.layout || "editorial"}`}
      section={section}
    >
      <div className="shell">
        <Reveal className="section-heading">
          <div>
            <Eyebrow size={section.eyebrowSize}>{section.eyebrow}</Eyebrow>
            <h2>{section.heading}</h2>
          </div>
          {section.body ? <p>{section.body}</p> : null}
        </Reveal>
        {section.layout === "swiper" ? (
          <EditorialSwiper cards={visibleCards} locale={locale} />
        ) : section.layout === "tracks" ? (
          <div
            aria-label={section.heading}
            className="content-grid__items content-grid__items--tracks"
          >
            {visibleCards.map((card, index) => (
              <Reveal
                className="content-grid__track"
                delay={Math.min(index * 0.09, 0.36)}
                key={card.id || `${card.title}-${index}`}
              >
                <span className="content-grid__track-marker" aria-hidden>
                  <span />
                </span>
                <h3>{card.title}</h3>
              </Reveal>
            ))}
          </div>
        ) : (
          <div
            className={`content-grid__items content-grid__items--${section.layout || "editorial"}`}
          >
            {visibleCards.map((card, index) => {
              const Icon = card.icon
                ? icons[card.icon as keyof typeof icons]
                : undefined;
              const button = card.button;
              const cardContent = (
                <>
                  {card.media ? (
                    <div className="content-card__media">
                      <CmsImage
                        alt={card.title}
                        media={card.media}
                        sizes="(max-width: 760px) 100vw, 33vw"
                      />
                    </div>
                  ) : null}
                  <div className="content-card__body">
                    {card.iconMedia ? (
                      <span className="content-card__icon content-card__icon--media">
                        <CmsImage
                          alt=""
                          media={card.iconMedia}
                          sizes="54px"
                        />
                      </span>
                    ) : Icon ? (
                      <span className="content-card__icon">
                        <Icon aria-hidden />
                      </span>
                    ) : null}
                    <Eyebrow size={card.eyebrowSize}>{card.eyebrow}</Eyebrow>
                    <h3>{card.title}</h3>
                    {card.meta ? (
                      <p className="content-card__meta">{card.meta}</p>
                    ) : null}
                    {card.body ? <p>{card.body}</p> : null}
                    {button?.href && button.label ? (
                      <Link
                        className="text-link"
                        data-track={button.trackingID || undefined}
                        href={button.href}
                        target={button.openInNewTab ? "_blank" : undefined}
                      >
                        {button.label}
                        <ButtonIcon name={button.icon} />
                      </Link>
                    ) : null}
                  </div>
                </>
              );

              return section.layout === "team" ? (
                <TeamCardMotion
                  className="content-card"
                  delay={Math.min(index * 0.08, 0.4)}
                  key={card.id || `${card.title}-${index}`}
                >
                  {cardContent}
                </TeamCardMotion>
              ) : (
                <Reveal
                  delay={Math.min(index * 0.045, 0.25)}
                  key={card.id || `${card.title}-${index}`}
                >
                  <TiltCard className="content-card">{cardContent}</TiltCard>
                </Reveal>
              );
            })}
          </div>
        )}
        {section.buttons?.length ? (
          <div className="section-buttons">
            {section.buttons.map((button) => (
              <Link
                className={`button button--${button.style || "primary"}`}
                data-track={button.trackingID || undefined}
                href={button.href}
                key={`${button.href}-${button.label}`}
              >
                {button.label}
                <ButtonIcon name={button.icon} />
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </SectionBackground>
  );
}

function Timeline({ section }: { section: TimelineSection }) {
  return (
    <SectionBackground className="timeline-section" section={section}>
      <div className="shell">
        <Reveal className="section-heading">
          <div>
            <Eyebrow size={section.eyebrowSize}>{section.eyebrow}</Eyebrow>
            <h2>{section.heading}</h2>
          </div>
          {section.body ? <p>{section.body}</p> : null}
        </Reveal>
        <div className="timeline timeline--vertical">
          {section.steps
            .filter((step) => step.visible !== false)
            .map((step, index) => {
              const Icon = step.icon
                ? icons[step.icon as keyof typeof icons]
                : undefined;
              const stepNumber = String(index + 1).padStart(2, "0");
              const markerLabel = /^\d{4}$/.test(step.label || "")
                ? step.label
                : stepNumber;
              return (
                <Reveal className="timeline__step" key={step.id || step.title}>
                  <span
                    className={`timeline__number${markerLabel !== stepNumber ? " timeline__number--year" : ""}`}
                  >
                    {Icon ? <Icon aria-hidden /> : markerLabel}
                  </span>
                  <div>
                    {step.label && step.label !== markerLabel ? (
                      <small>{step.label}</small>
                    ) : null}
                    <h3>{step.title}</h3>
                    {step.body ? <p>{step.body}</p> : null}
                  </div>
                </Reveal>
              );
            })}
        </div>
      </div>
    </SectionBackground>
  );
}

function FormSectionComponent({
  locale,
  pagePath,
  section,
}: {
  locale: Locale;
  pagePath: string;
  section: FormSection;
}) {
  if (!section.form || typeof section.form !== "object") return null;
  return (
    <SectionBackground className="form-section" section={section}>
      <div className="shell form-section__grid">
        <Reveal className="form-section__intro">
          <Eyebrow size={section.eyebrowSize}>{section.eyebrow}</Eyebrow>
          <h2>{section.heading}</h2>
          {section.body ? <p>{section.body}</p> : null}
        </Reveal>
        <Reveal className="form-section__panel" delay={0.08}>
          <LeadForm
            form={section.form}
            locale={locale}
            pagePath={pagePath}
            privacyNote={section.privacyNote}
            sectionID={section.id}
            successHeading={section.successHeading}
            successMessage={section.successMessage}
            token={createFormToken(section.form.formKey)}
          />
        </Reveal>
      </div>
    </SectionBackground>
  );
}

function safeMapEmbedURL(value: string): string | null {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    if (
      url.protocol !== "https:" ||
      !(hostname === "google.com" || hostname.endsWith(".google.com"))
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

function MapSectionComponent({ section }: { section: MapSection }) {
  const embedURL = safeMapEmbedURL(section.embedURL);
  if (!embedURL) return null;
  return (
    <SectionBackground className="location-map" section={section}>
      <div className="shell">
        <Reveal className="location-map__heading">
          <div>
            <Eyebrow size={section.eyebrowSize}>{section.eyebrow}</Eyebrow>
            <h2>{section.heading}</h2>
          </div>
          <div>
            {section.body ? <p>{section.body}</p> : null}
            {section.button?.href && section.button.label ? (
              <Link
                className={`button button--${section.button.style || "primary"}`}
                data-track={section.button.trackingID || undefined}
                href={section.button.href}
                rel="noreferrer"
                target="_blank"
              >
                {section.button.label}
                <ButtonIcon name={section.button.icon} />
              </Link>
            ) : null}
          </div>
        </Reveal>
        <Reveal className="location-map__frame" delay={0.08}>
          <iframe
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={embedURL}
            title={section.mapTitle}
          />
        </Reveal>
      </div>
    </SectionBackground>
  );
}

function CallToAction({ section }: { section: CallToActionSection }) {
  const mediaURL = getMediaURL(section.media);
  const decodedMediaURL = mediaURL ? decodeURIComponent(mediaURL) : "";
  const sectionLabel = `${section.eyebrow || ""} ${section.heading || ""}`;
  const preservePanoramicMedia =
    Boolean(mediaURL) &&
    (/(?:^|\/)ceo(?:\s*[._-]|$)/i.test(decodedMediaURL) ||
      /\bCEO\b/i.test(sectionLabel) ||
      /الرئيس التنفيذي/.test(sectionLabel));

  return (
    <SectionBackground
      className={`cta-section ${
        preservePanoramicMedia ? "cta-section--preserve-panorama" : ""
      }`}
      section={section}
    >
      {section.media ? (
        <div className="cta-section__media">
          <CmsImage alt="" media={section.media} sizes="100vw" />
        </div>
      ) : null}
      <div className="cta-section__shade" />
      <Reveal className="cta-section__content shell">
        <Eyebrow size={section.eyebrowSize}>{section.eyebrow}</Eyebrow>
        <h2>{section.heading}</h2>
        {section.body ? <p>{section.body}</p> : null}
        <div className="section-buttons">
          {section.buttons?.map((button) => (
            <Link
              className={`button button--${button.style || "primary"}`}
              data-track={button.trackingID || undefined}
              href={button.href}
              key={`${button.href}-${button.label}`}
              rel={button.openInNewTab ? "noreferrer" : undefined}
              target={button.openInNewTab ? "_blank" : undefined}
            >
              {button.label}
              <ButtonIcon name={button.icon} />
            </Link>
          ))}
        </div>
      </Reveal>
    </SectionBackground>
  );
}

function RichTextContent({ section }: { section: RichTextSection }) {
  return (
    <SectionBackground className="policy-content" section={section}>
      <div className="shell policy-content__layout">
        <Reveal className="policy-content__intro">
          <Eyebrow size={section.eyebrowSize}>{section.eyebrow}</Eyebrow>
          {section.heading ? <h2>{section.heading}</h2> : null}
        </Reveal>
        <Reveal className="policy-content__document" delay={0.08}>
          <RichText data={section.content as never} />
        </Reveal>
      </div>
    </SectionBackground>
  );
}

function Credibility({ section }: { section: CredibilitySection }) {
  const logos = (section.logos?.length
    ? section.logos.map((item) => item.logo)
    : [section.media]
  ).filter(Boolean);
  const content = (
    <>
      <span>{section.label}</span>
      <span className="credibility__logos">
        {logos.map((logo, index) => (
          <span className="credibility__logo" key={`${getMediaURL(logo)}-${index}`}>
            <CmsImage alt="Membership logo" media={logo} sizes="220px" />
          </span>
        ))}
      </span>
    </>
  );

  return (
    <section className="credibility">
      {section.href ? (
        <Link href={section.href}>{content}</Link>
      ) : (
        <div>{content}</div>
      )}
    </section>
  );
}

function LogoMarquee({ section }: { section: LogoMarqueeSection }) {
  const logos = section.logos.filter(
    (item) => item.visible !== false && Boolean(item.logo),
  );
  if (!logos.length) return null;

  const renderLogo = (
    item: LogoMarqueeSection["logos"][number],
    index: number,
    duplicate = false,
  ) => {
    const logo = (
      <span className="partner-marquee__logo">
        <CmsImage alt={duplicate ? "" : item.alt} media={item.logo} sizes="180px" />
      </span>
    );

    return (
      <li key={`${duplicate ? "duplicate" : "primary"}-${item.id || item.alt}-${index}`}>
        {item.href ? (
          <a
            aria-hidden={duplicate || undefined}
            href={item.href}
            rel="noreferrer"
            tabIndex={duplicate ? -1 : undefined}
            target="_blank"
          >
            {logo}
          </a>
        ) : (
          logo
        )}
      </li>
    );
  };

  return (
    <SectionBackground className="partner-marquee" section={section}>
      <div className="shell">
        <Reveal className="partner-marquee__heading">
          <h2>{section.heading}</h2>
          {section.body ? <p>{section.body}</p> : null}
        </Reveal>
      </div>
      <Reveal className="partner-marquee__viewport" delay={0.08}>
        <div
          className={`partner-marquee__track partner-marquee__track--${section.speed || "standard"}`}
        >
          <ul className="partner-marquee__set">
            {logos.map((item, index) => renderLogo(item, index))}
          </ul>
          <ul aria-hidden="true" className="partner-marquee__set">
            {logos.map((item, index) => renderLogo(item, index, true))}
          </ul>
        </div>
      </Reveal>
    </SectionBackground>
  );
}

function ProjectShowcase({
  locale,
  section,
}: {
  locale: Locale;
  section: ProjectShowcaseSection;
}) {
  const style = {
    "--projects-bg": section.appearance?.backgroundColor || undefined,
  } as CSSProperties;
  return (
    <section className="projects-section section-pad" style={style}>
      <div className="shell">
        <Reveal className="projects-section__intro">
          <div>
            <Eyebrow size={section.eyebrowSize}>{section.eyebrow}</Eyebrow>
            <h2>{section.heading}</h2>
          </div>
          <div className="projects-section__copy">
            {section.body ? <p>{section.body}</p> : null}
            <TextLink href={section.ctaHref} label={section.ctaLabel} />
          </div>
        </Reveal>
      </div>
      <Reveal delay={0.1}>
        <ProjectRail
          locale={locale}
          projectCtaLabel={section.projectCtaLabel}
          projects={section.projects}
        />
      </Reveal>
    </section>
  );
}

function MediaFeature({ section }: { section: MediaFeatureSection }) {
  const background = section.mediaPosition === "background";
  const style = {
    "--media-feature-bg": section.appearance?.backgroundColor || undefined,
  } as CSSProperties;
  return (
    <section
      className={`media-feature media-feature--${section.theme || "dark"} ${
        background ? "media-feature--background" : ""
      }`}
      id={section.anchorID || undefined}
      style={style}
    >
      <div
        className={`media-feature__grid ${
          section.mediaPosition === "end" ? "media-feature__grid--reverse" : ""
        }`}
      >
        <div className="media-feature__media">
          <CmsImage
            alt={section.heading}
            media={section.media}
            sizes="(max-width: 800px) 100vw, 58vw"
          />
        </div>
        <Reveal className="media-feature__content">
          <Eyebrow size={section.eyebrowSize}>{section.eyebrow}</Eyebrow>
          <h2>{section.heading}</h2>
          {section.body ? <p>{section.body}</p> : null}
          <TextLink href={section.ctaHref} label={section.ctaLabel} />
        </Reveal>
      </div>
    </section>
  );
}

function ImageStory({ section }: { section: ImageStorySection }) {
  return (
    <section className="image-story">
      <div className="image-story__media">
        {section.images.map((image, index) => (
          <div
            className={`image-story__image image-story__image--${index + 1}`}
            key={`${image.caption}-${index}`}
          >
            <CmsImage
              alt={image.caption || section.heading}
              media={image.media}
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>
      <div className="image-story__shade" />
      <Reveal className="image-story__content shell">
        <Eyebrow size={section.eyebrowSize}>{section.eyebrow}</Eyebrow>
        <h2>{section.heading}</h2>
        {section.body ? <p>{section.body}</p> : null}
        <TextLink href={section.ctaHref} label={section.ctaLabel} />
      </Reveal>
    </section>
  );
}

function NewsMosaic({
  locale,
  section,
}: {
  locale: Locale;
  section: NewsMosaicSection;
}) {
  const layout = section.layout || "mosaic";
  const style = {
    "--news-bg": section.appearance?.backgroundColor || undefined,
  } as CSSProperties;
  return (
    <section
      className={`news-section news-section--${layout} section-pad`}
      data-theme={section.appearance?.theme || "light"}
      id={section.anchorID || undefined}
      style={style}
    >
      <div className="shell">
        <Reveal className="news-section__intro">
          <div>
            <Eyebrow size={section.eyebrowSize}>{section.eyebrow}</Eyebrow>
            <h2>{section.heading}</h2>
          </div>
          <TextLink href={section.ctaHref} label={section.ctaLabel} />
        </Reveal>
        {layout === "grid" || layout === "swiper" ? (
          <InsightsCollection
            articles={section.articles}
            layout={layout}
            locale={locale}
            pageSize={section.pageSize}
          />
        ) : (
          <div className="news-mosaic">
            {section.articles.map((article, index) => (
              <Reveal
                className={`news-card news-card--${(index % 6) + 1}`}
                delay={Math.min(index * 0.06, 0.3)}
                key={`${article.title}-${index}`}
              >
                <article>
                  <div className="news-card__media">
                    <CmsImage
                      alt={article.title}
                      media={article.media}
                      sizes="(max-width: 720px) 100vw, 34vw"
                    />
                  </div>
                  <div className="news-card__shade" />
                  <div className="news-card__content">
                    {article.kicker ? <p>{article.kicker}</p> : null}
                    <h3>{article.title}</h3>
                    {article.href ? (
                      <Link aria-label={article.title} href={article.href}>
                        <ArrowUpRight aria-hidden />
                      </Link>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function SectionRenderer({
  locale,
  pagePath,
  section,
}: {
  locale: Locale;
  pagePath: string;
  section: PageSection;
}) {
  switch (section.blockType) {
    case "hero":
      return <Hero locale={locale} pagePath={pagePath} section={section} />;
    case "credibility":
      return <Credibility section={section} />;
    case "logoMarquee":
      return <LogoMarquee section={section} />;
    case "cardGrid":
      return <CardGrid locale={locale} section={section} />;
    case "projectShowcase":
      return <ProjectShowcase locale={locale} section={section} />;
    case "mediaFeature":
      return <MediaFeature section={section} />;
    case "imageStory":
      return <ImageStory section={section} />;
    case "newsMosaic":
      return <NewsMosaic locale={locale} section={section} />;
    case "timeline":
      return <Timeline section={section} />;
    case "form":
      return (
        <FormSectionComponent
          locale={locale}
          pagePath={pagePath}
          section={section}
        />
      );
    case "map":
      return <MapSectionComponent section={section} />;
    case "callToAction":
      return <CallToAction section={section} />;
    case "richTextContent":
      return <RichTextContent section={section} />;
    default:
      return null;
  }
}
