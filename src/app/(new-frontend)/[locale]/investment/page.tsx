import { notFound } from "next/navigation";
import { InvestmentPage } from "@/components/InvestmentPage";
import { getNewSitePageContent } from "@/content/newSiteCmsPages";
import { getNewSiteMetadata, NewSiteSeoSchema } from "@/content/newSiteSEO";
import { investmentSectionKeys, pageSettingsFromEditor } from "@/content/investmentContactCms";
import { getHomepagePortfolioPhotos } from "@/content/newSiteCmsHome";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getNewSiteMetadata("investment", locale === "ar" ? "ar" : "en");
}

export default async function LocalizedInvestment({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const [page, portfolioPhotos] = await Promise.all([getNewSitePageContent("investment", locale), getHomepagePortfolioPhotos(locale)]);
  if (!page.published) notFound();
  return <><NewSiteSeoSchema slug="investment" locale={locale} /><InvestmentPage locale={locale} route="investment" square newDesign portfolioPhotos={portfolioPhotos} cmsPortfolios={page.content.projects.portfolios} cmsContent={page.content} cmsSettings={pageSettingsFromEditor("Investment", investmentSectionKeys, page.editorSections)} /></>;
}
