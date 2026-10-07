import { notFound } from "next/navigation";
import { LatestNewsPage } from "@/components/LatestNewsPage";
import { getNewSitePosts, orderArchivePosts } from "@/content/newSiteCmsPosts";
import { getNewSitePageContent } from "@/content/newSiteCmsPages";
import { editorialSettingsFromEditor } from "@/content/editorialPageCms";
import { getNewSiteMetadata, NewSiteSeoSchema } from "@/content/newSiteSEO";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getNewSiteMetadata("latest-news", locale === "ar" ? "ar" : "en");
}

export default async function LocalizedLatestNews({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const [posts, page] = await Promise.all([getNewSitePosts(locale), getNewSitePageContent("latest-news", locale)]);
  if (!page.published) notFound();
  const settings = editorialSettingsFromEditor("latest-news", page.editorSections);
  const news = posts.filter((post) => post.type === "news" && post.showOnArchive !== false);
  return <><NewSiteSeoSchema slug="latest-news" locale={locale} /><LatestNewsPage locale={locale} posts={orderArchivePosts(news, settings.order.includes("archive") ? settings.archiveSortMode : page.archiveSortMode, settings.selectedPostIds)} cmsContent={page.content} cmsSettings={settings} /></>;
}
