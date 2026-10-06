import { notFound } from "next/navigation";
import { CareersPage } from "@/components/CareersPage";
import { getNewSitePageContent } from "@/content/newSiteCmsPages";
import { getCareersJobs, orderCareersJobs } from "@/content/careersJobs";
import { careersSettingsFromEditor } from "@/content/careersCms";
import { getNewSiteMetadata, NewSiteSeoSchema } from "@/content/newSiteSEO";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getNewSiteMetadata("careers", locale === "ar" ? "ar" : "en");
}

export default async function LocalizedCareers({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const [page, jobs] = await Promise.all([getNewSitePageContent("careers", locale), getCareersJobs(locale)]);
  if (!page.published) notFound();
  const settings = careersSettingsFromEditor(page.editorSections);
  return <><NewSiteSeoSchema slug="careers" locale={locale} /><CareersPage locale={locale} route="careers" square cmsContent={{ ...page.content, jobs: orderCareersJobs(jobs, settings?.jobOrderMode || "latest", settings?.selectedJobIds || []) }} cmsSettings={settings} /></>;
}
