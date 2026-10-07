import { notFound } from "next/navigation";
import { DiscoverPage } from "@/components/DiscoverPage";

export default async function LocalizedDiscoverThree({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return <DiscoverPage locale={locale} variant="redesign" route="discover3" />;
}
