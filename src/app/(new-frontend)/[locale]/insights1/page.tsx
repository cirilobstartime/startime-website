import { notFound } from "next/navigation";
import { InsightsPage } from "@/components/InsightsPage";

export default async function LocalizedInsightsOne({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return <InsightsPage locale={locale} route="insights1" />;
}
