import Image from "next/image";
import type { Locale } from "@/content/home";
import { getNewsImageVariants, getPostFeatureImage, type InsightPost } from "@/content/insightPosts";

export function ResponsiveNewsImage({ post, sizes }: { post: InsightPost; sizes: string }) {
  const variants = getNewsImageVariants(post);
  if (!variants) return <Image src={post.image} alt="" fill sizes={sizes} />;

  return <picture className="news-responsive-picture">
    <source media="(max-width: 640px)" srcSet={variants.mobile} />
    <source media="(max-width: 1024px)" srcSet={variants.tablet} />
    <source media="(max-width: 1599px)" srcSet={variants.laptop} />
    <Image src={variants.desktop} alt="" fill sizes={sizes} />
  </picture>;
}

export function PostFeatureImage({ post, locale }: { post: InsightPost; locale: Locale }) {
  const image = getPostFeatureImage(post);
  return <Image
    src={image.src}
    alt={image.alt?.[locale] ?? ""}
    width={image.width}
    height={image.height}
    priority
    sizes="100vw"
  />;
}
