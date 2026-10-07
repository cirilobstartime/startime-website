import { notFound } from "next/navigation";
import { InsightsPage } from "@/components/InsightsPage";
import { getNewSitePosts, orderArchivePosts } from "@/content/newSiteCmsPosts";
import { getNewSitePageContent } from "@/content/newSiteCmsPages";
import { editorialSettingsFromEditor } from "@/content/editorialPageCms";
import { getNewSiteMetadata, NewSiteSeoSchema } from "@/content/newSiteSEO";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getNewSiteMetadata("insights", locale === "ar" ? "ar" : "en");
}

export default async function LocalizedInsights({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const [posts, page] = await Promise.all([getNewSitePosts(locale), getNewSitePageContent("insights", locale)]);
  if (!page.published) notFound();
  const settings = editorialSettingsFromEditor("insights", page.editorSections);
  const articles = posts.filter((post) => post.type === "article" && post.showOnArchive !== false);
  return <><NewSiteSeoSchema slug="insights" locale={locale} /><InsightsPage locale={locale} route="insights" square posts={orderArchivePosts(articles, settings.order.includes("archive") ? settings.archiveSortMode : page.archiveSortMode, settings.selectedPostIds)} cmsContent={page.content} cmsSettings={settings} /></>;
}
