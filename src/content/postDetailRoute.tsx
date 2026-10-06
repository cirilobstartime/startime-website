import { notFound, permanentRedirect } from "next/navigation";
import { InsightDetailPage } from "@/components/InsightDetailPage";
import { getNewSitePosts } from "@/content/newSiteCmsPosts";
import { getNewSiteArticleMetadata, NewSiteSeoSchema } from "@/content/newSiteSEO";
import { postPath } from "@/lib/postPath";


export async function generatePostMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const post = (await getNewSitePosts(locale)).find((item) => item.slug === slug);
  if (!post) notFound();
  return getNewSiteArticleMetadata(slug, locale, { type: post.type, title: post[locale].title, description: post[locale].lead[1], image: post.featureImage?.src || post.image });
}

export async function renderPostDetail({ params }: { params: Promise<{ locale: string; slug: string }> }, namespace: "news" | "insights") {
  const { locale, slug } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const posts = await getNewSitePosts(locale);
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  if ((post.type === "news" ? "news" : "insights") !== namespace) permanentRedirect(postPath(locale, post));
  return <><NewSiteSeoSchema slug={`${namespace}/${slug}`} locale={locale} article={{ title: post[locale].title, description: post[locale].lead[1], image: post.featureImage?.src || post.image }} /><InsightDetailPage locale={locale} post={post} posts={posts} /></>;
}
