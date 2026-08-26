export type Locale = "en" | "ar";

export type MediaValue =
  | string
  | {
      alt?: string | null;
      filename?: string | null;
      height?: number | null;
      id?: number | string;
      mimeType?: string | null;
      url?: string | null;
      width?: number | null;
    }
  | null;

export type Button = {
  href: string;
  icon?: string | null;
  label: string;
  openInNewTab?: boolean | null;
  style?: "primary" | "outline" | "text";
  trackingID?: string | null;
};

export type BaseSection = {
  anchorID?: string | null;
  appearance?: {
    backgroundColor?: string | null;
    backgroundImage?: MediaValue;
    mobileBackgroundImage?: MediaValue;
    overlayOpacity?: number | null;
    spacing?: "compact" | "standard" | "large" | null;
    theme?: "light" | "dark" | "brand" | "transparent" | null;
  } | null;
  blockType: string;
  displayOrder?: number | null;
  id?: string | null;
  internalLabel?: string | null;
  visible?: boolean | null;
};

export type CardGridSection = BaseSection & {
  blockType: "cardGrid";
  body?: string | null;
  buttons?: Button[] | null;
  cards: Array<{
    body?: string | null;
    button?: Button | null;
    eyebrow?: string | null;
    eyebrowSize?: "small" | "default" | "large" | null;
    icon?: string | null;
    iconMedia?: MediaValue;
    id?: string | null;
    internalLabel?: string | null;
    media?: MediaValue;
    meta?: string | null;
    title: string;
    visible?: boolean | null;
  }>;
  eyebrow?: string | null;
  eyebrowSize?: "small" | "default" | "large" | null;
  heading: string;
  layout?:
    | "editorial"
    | "icons"
    | "list"
    | "proof"
    | "swiper"
    | "columns"
    | "checklist"
    | "tabs"
    | "tracks"
    | "focus"
    | "team"
    | null;
};

export type TimelineSection = BaseSection & {
  blockType: "timeline";
  body?: string | null;
  eyebrow?: string | null;
  eyebrowSize?: "small" | "default" | "large" | null;
  heading: string;
  steps: Array<{
    body?: string | null;
    icon?: string | null;
    id?: string | null;
    label?: string | null;
    title: string;
    visible?: boolean | null;
  }>;
};

export type CallToActionSection = BaseSection & {
  blockType: "callToAction";
  body?: string | null;
  buttons?: Button[] | null;
  eyebrow?: string | null;
  eyebrowSize?: "small" | "default" | "large" | null;
  heading: string;
  media?: MediaValue;
};

export type FormDefinition = {
  active?: boolean | null;
  conversionCurrency?: string | null;
  conversionValue?: number | null;
  fields?: Array<{
    allowedFileTypes?: string[] | null;
    autocomplete?: string | null;
    helpText?: string | null;
    id?: string | null;
    label: string;
    maxLength?: number | null;
    name: string;
    options?: Array<{ label: string; value: string }> | null;
    placeholder?: string | null;
    required?: boolean | null;
    type: string;
    width?: "full" | "half" | null;
  }> | null;
  formKey: string;
  id: number | string;
  submitLabel: string;
};

export type FormSection = BaseSection & {
  blockType: "form";
  body?: string | null;
  eyebrow?: string | null;
  eyebrowSize?: "small" | "default" | "large" | null;
  form: FormDefinition | number | string;
  heading: string;
  privacyNote?: string | null;
  successHeading: string;
  successMessage: string;
};

export type MapSection = BaseSection & {
  blockType: "map";
  body?: string | null;
  button?: Button | null;
  embedURL: string;
  eyebrow?: string | null;
  eyebrowSize?: "small" | "default" | "large" | null;
  heading: string;
  mapTitle: string;
};

export type HeroSection = BaseSection & {
  blockType: "hero";
  body?: string | null;
  buttons?: Button[] | null;
  eyebrow?: string | null;
  eyebrowSize?: "small" | "default" | "large" | null;
  eventDetails?: Array<{ label: string; value: string }> | null;
  heading: string;
  heroHeight?: "standard" | "viewport" | null;
  media?: MediaValue;
  mediaType?: "image" | "video" | "youtube" | null;
  mobileMedia?: MediaValue;
  youtubeURL?: string | null;
};

export type CredibilitySection = BaseSection & {
  blockType: "credibility";
  href?: string | null;
  label: string;
  logos?: Array<{ logo?: MediaValue }> | null;
  media?: MediaValue;
};

export type Project = {
  featured?: boolean | null;
  href?: string | null;
  image?: MediaValue;
  logo?: MediaValue;
  summary: string;
  title: string;
};

export type ProjectShowcaseSection = BaseSection & {
  blockType: "projectShowcase";
  body?: string | null;
  ctaHref?: string | null;
  ctaLabel?: string | null;
  eyebrow?: string | null;
  eyebrowSize?: "small" | "default" | "large" | null;
  heading: string;
  projectCtaLabel?: string | null;
  projects: Project[];
};

export type MediaFeatureSection = BaseSection & {
  blockType: "mediaFeature";
  body?: string | null;
  ctaHref?: string | null;
  ctaLabel?: string | null;
  eyebrow?: string | null;
  eyebrowSize?: "small" | "default" | "large" | null;
  heading: string;
  media?: MediaValue;
  mediaPosition?: "start" | "end" | "background" | null;
  theme?: "dark" | "light" | null;
};

export type ImageStorySection = BaseSection & {
  blockType: "imageStory";
  body?: string | null;
  ctaHref?: string | null;
  ctaLabel?: string | null;
  eyebrow?: string | null;
  eyebrowSize?: "small" | "default" | "large" | null;
  heading: string;
  images: Array<{ caption?: string | null; media: MediaValue }>;
};

export type NewsMosaicSection = BaseSection & {
  blockType: "newsMosaic";
  articles: Array<{
    href?: string | null;
    kicker?: string | null;
    media: MediaValue;
    publishedAt?: string | null;
    summary?: string | null;
    title: string;
  }>;
  ctaHref?: string | null;
  ctaLabel?: string | null;
  eyebrow?: string | null;
  eyebrowSize?: "small" | "default" | "large" | null;
  heading: string;
  layout?: "grid" | "mosaic" | "swiper" | null;
  pageSize?: number | null;
};

export type RichTextSection = BaseSection & {
  blockType: "richTextContent";
  content: Record<string, unknown>;
  eyebrow?: string | null;
  eyebrowSize?: "small" | "default" | "large" | null;
  heading?: string | null;
};

export type PageSection =
  | CallToActionSection
  | CardGridSection
  | CredibilitySection
  | FormSection
  | HeroSection
  | ImageStorySection
  | MapSection
  | MediaFeatureSection
  | NewsMosaicSection
  | ProjectShowcaseSection
  | RichTextSection
  | TimelineSection;

export type PublicPage = {
  pageType: string;
  sections: PageSection[];
  seo?: {
    canonicalURL?: string | null;
    description?: string | null;
    followLinks?: boolean | null;
    includeInSitemap?: boolean | null;
    indexable?: boolean | null;
    openGraphDescription?: string | null;
    openGraphImage?: MediaValue;
    openGraphTitle?: string | null;
    structuredData?: Record<string, unknown> | null;
    sitemapChangeFrequency?: string | null;
    sitemapPriority?: number | null;
    title?: string | null;
  } | null;
  slug: string;
  summary?: string | null;
  title: string;
};

export type PublicInsight = {
  category?: string | null;
  categorySlug?: string | null;
  content: Array<{
    body: Record<string, unknown> | string;
    heading?: string | null;
  }>;
  featuredImage: MediaValue;
  intro?: string | null;
  publishedAt: string;
  publicationLabel: string;
  seo?: {
    description?: string | null;
    indexable?: boolean | null;
    title?: string | null;
  } | null;
  slug: string;
  summary: string;
  title: string;
};

export type PublicInsightCategory = {
  articles: NewsMosaicSection["articles"];
  slug: string;
  title: string;
};

export type SiteChrome = {
  allowSearchIndexing: boolean;
  address: string;
  companyHeading: string;
  contactHeading: string;
  copyright: string;
  email: string;
  footerDescription: string;
  footerLogo?: MediaValue;
  sisterCompanies: Array<{
    alt: string;
    href?: string | null;
    logo: MediaValue;
  }>;
  sisterCompaniesHeading: string;
  headerCtaHref: string;
  headerCtaLabel: string;
  headerLogo?: MediaValue;
  headerLogoDark?: MediaValue;
  navigation: Array<{ href: string; label: string }>;
  organization: {
    addressCountry: string;
    addressLocality: string;
    addressRegion: string;
    alternateName: string;
    description: string;
    email: string;
    foundingDate: string;
    keywords: string[];
    latitude?: number | null;
    legalName: string;
    logo?: MediaValue;
    longitude?: number | null;
    name: string;
    phone: string;
    postalCode: string;
    streetAddress: string;
    url: string;
  };
  phone: string;
  siteName: string;
  defaultSEODescription: string;
  socialLinks: Array<{
    href: string;
    icon?: "facebook" | "instagram" | "linkedin" | "threads" | "tiktok" | "x" | "youtube" | null;
    platform: string;
  }>;
};

export type MarketingSettings = {
  acceptLabel: string;
  acceptedCampaignParameters: string;
  attributionCookieDays: number;
  attributionCookieDomain: string;
  bingSiteVerification: string;
  cookieNotice: string;
  defaultConsentDenied: boolean;
  enableAnalytics: boolean;
  ga4MeasurementID: string;
  googleSiteVerification: string;
  googleTagManagerID: string;
  googleAdsID: string;
  linkedInPartnerID: string;
  metaDomainVerification: string;
  metaPixelID: string;
  crossDomainHosts: string;
  privacyHref: string;
  rejectLabel: string;
  settingsLabel: string;
  tiktokPixelID: string;
  xPixelID: string;
};
