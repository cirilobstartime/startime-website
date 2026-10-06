import { notFound } from "next/navigation";
import { ContactPage } from "@/components/ContactPage";
import { getNewSitePageContent } from "@/content/newSiteCmsPages";
import { getNewSiteMetadata, NewSiteSeoSchema } from "@/content/newSiteSEO";
import { contactSectionKeys, pageSettingsFromEditor } from "@/content/investmentContactCms";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getNewSiteMetadata("contact", locale === "ar" ? "ar" : "en");
}

export default async function LocalizedContact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const page = await getNewSitePageContent("contact", locale);
  if (!page.published) notFound();
  return <><NewSiteSeoSchema slug="contact" locale={locale} /><ContactPage locale={locale} route="contact" square cmsContent={page.content} cmsSettings={pageSettingsFromEditor("Contact", contactSectionKeys, page.editorSections)} /></>;
}
