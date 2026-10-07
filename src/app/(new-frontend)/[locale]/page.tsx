import { notFound } from "next/navigation";
import { Home2Page } from "@/components/Home2Page";
import { getNewSitePosts } from "@/content/newSiteCmsPosts";
import { getNewSiteCmsHome } from "@/content/newSiteCmsHome";
import { getNewSitePageContent } from "@/content/newSiteCmsPages";
import { getNewSiteMetadata, NewSiteSeoSchema } from "@/content/newSiteSEO";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getNewSiteMetadata("home", locale === "ar" ? "ar" : "en");
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const [posts, home, page] = await Promise.all([getNewSitePosts(locale), getNewSiteCmsHome(locale), getNewSitePageContent("home", locale)]);
  if (!home.published || !page.published) notFound();
  return <><NewSiteSeoSchema slug="home" locale={locale} /><Home2Page locale={locale} variant="home5" route="" square newMain posts={posts} cmsHome={home} cmsContent={page.content} /></>;
}
