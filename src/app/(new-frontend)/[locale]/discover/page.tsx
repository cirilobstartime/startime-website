import { notFound } from "next/navigation";
import { DiscoverPage } from "@/components/DiscoverPage";
import { getNewSitePageContent } from "@/content/newSiteCmsPages";
import { discoverSettingsFromEditor } from "@/content/discoverCms";
import { getNewSiteMetadata, NewSiteSeoSchema } from "@/content/newSiteSEO";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getNewSiteMetadata("discover", locale === "ar" ? "ar" : "en");
}

export default async function LocalizedDiscover({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const page = await getNewSitePageContent("discover", locale);
  if (!page.published) notFound();
  return <><NewSiteSeoSchema slug="discover" locale={locale} /><DiscoverPage locale={locale} route="discover" square cmsContent={page.content} cmsSettings={discoverSettingsFromEditor(page.editorSections)} /></>;
}
