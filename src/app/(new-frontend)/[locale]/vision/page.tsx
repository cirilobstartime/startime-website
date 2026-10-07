import { notFound } from "next/navigation";
import { VisionPage } from "@/components/VisionPage";
import { getNewSitePageContent } from "@/content/newSiteCmsPages";
import { getNewSiteMetadata, NewSiteSeoSchema } from "@/content/newSiteSEO";
import { visionSettingsFromEditor } from "@/content/visionCms";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getNewSiteMetadata("vision", locale === "ar" ? "ar" : "en");
}

export default async function LocalizedVision({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const page = await getNewSitePageContent("vision", locale);
  if (!page.published) notFound();
  return <><NewSiteSeoSchema slug="vision" locale={locale} /><VisionPage locale={locale} route="vision" square cmsContent={page.content} cmsSettings={visionSettingsFromEditor(page.editorSections)} /></>;
}
