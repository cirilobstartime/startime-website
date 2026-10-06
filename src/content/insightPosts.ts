import rawPosts from "@/content/insight-posts.json";
import type { Locale } from "@/content/home";
import type { InsightsPost } from "@/generated/payload-types";

export type InsightPostType = "news" | "article";

export type InsightPostCategory = string;

export type InsightPostTranslation = {
  lead: string[];
  title: string;
  body: string[];
};

export type InsightPost = {
  cmsId?: number;
  publishedAt?: string;
  displayOrder?: number;
  slug: string;
  type: InsightPostType;
  image: string;
  thumbnailImages?: ResponsivePostImages;
  featureImage?: PostFeatureImageAsset;
  category?: InsightPostCategory;
  categoryLabel?: string;
  tags?: Array<{ slug: string; title: string }>;
  showOnHomepage?: boolean;
  showOnArchive?: boolean;
  richContent?: InsightsPost["content"];
  en: InsightPostTranslation;
  ar: InsightPostTranslation;
};

export type PostFeatureImageAsset = {
  src: string;
  width: number;
  height: number;
  alt?: Partial<Record<Locale, string>>;
};

export type ResponsivePostImages = {
  desktop: string;
  laptop: string;
  tablet: string;
  mobile: string;
};

export const insightPosts = rawPosts as InsightPost[];

const suppliedNewsImageSlugs = new Set([
  "first-annual-gala-october",
  "startime-alliance-founding-member",
  "saudi-unmanned-systems-expo",
  "iaee-membership",
  "fourth-saudi-international-maritime-forum",
  "ufi-certified-membership",
  "ceo-national-exhibitions-committee",
  "saudization-local-content-certificate",
  "impact-events-partnership",
]);

export function getNewsImageVariants(post: InsightPost) {
  if (post.thumbnailImages) return post.thumbnailImages;
  if (post.type !== "news" || !suppliedNewsImageSlugs.has(post.slug)) return null;
  const image = (size: "desktop" | "laptop" | "tablet" | "mobile") =>
    `/assets/news-responsive/${size}/${post.slug}.webp`;
  return {
    desktop: image("desktop"),
    laptop: image("laptop"),
    tablet: image("tablet"),
    mobile: image("mobile"),
  };
}

export function getPostFeatureImage(post: InsightPost) {
  // A post detail uses one uncropped source at every viewport. Until a separate
  // feature upload is supplied, use its approved large thumbnail as the fallback.
  if (post.featureImage) return post.featureImage;
  const desktopThumbnail = getNewsImageVariants(post)?.desktop;
  if (desktopThumbnail) return { src: desktopThumbnail, width: 1921, height: 1080 };
  return { src: post.image, width: 1440, height: 900 };
}

const postCategories: Record<string, InsightPostCategory> = {
  "first-annual-gala-october": "company-news",
  "startime-alliance-founding-member": "partnerships",
  "saudi-unmanned-systems-expo": "projects-events",
  "iaee-membership": "memberships-accreditations",
  "fourth-saudi-international-maritime-forum": "projects-events",
  "ufi-certified-membership": "memberships-accreditations",
  "ceo-national-exhibitions-committee": "company-news",
  "saudization-local-content-certificate": "company-news",
  "impact-events-partnership": "partnerships",
  "maritime-energy-supply-chain-security": "maritime-energy-security",
};

const categoryLabels: Record<string, Record<Locale, string>> = {
  "company-news": { en: "Company News", ar: "أخبار الشركة" },
  partnerships: { en: "Partnerships", ar: "الشراكات" },
  "projects-events": { en: "Projects & Events", ar: "المشاريع والفعاليات" },
  "memberships-accreditations": { en: "Memberships & Accreditations", ar: "العضويات والاعتمادات" },
  "maritime-energy-security": { en: "Maritime & Energy Security", ar: "الأمن البحري وأمن الطاقة" },
};

export function getInsightPost(slug: string) {
  return insightPosts.find((post) => post.slug === slug);
}

export function getPostCopy(post: InsightPost, locale: Locale) {
  return post[locale];
}

export function getPostSummary(post: InsightPost, locale: Locale) {
  const copy = getPostCopy(post, locale);
  const supportingLine = copy.lead.find((line) => line !== copy.title);
  return supportingLine ?? copy.body[0] ?? "";
}

export function getPostCategory(post: InsightPost): InsightPostCategory {
  return post.category ?? postCategories[post.slug] ?? (post.type === "news" ? "company-news" : "maritime-energy-security");
}

export function postCategoryLabel(category: InsightPostCategory, locale: Locale) {
  return categoryLabels[category]?.[locale] || category.replaceAll("-", " ");
}

export function postTypeLabel(type: InsightPostType, locale: Locale) {
  if (locale === "ar") return type === "news" ? "خبر" : "مقالة";
  return type === "news" ? "News" : "Article";
}
