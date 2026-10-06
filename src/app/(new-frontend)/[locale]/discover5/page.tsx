import { notFound } from "next/navigation";
import { DiscoverPage } from "@/components/DiscoverPage";

export default async function LocalizedDiscoverFive({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return <DiscoverPage locale={locale} variant="legacy" route="discover5" />;
}
