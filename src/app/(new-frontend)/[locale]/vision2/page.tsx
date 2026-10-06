import { notFound } from "next/navigation";
import { VisionPage } from "@/components/VisionPage";

export default async function LocalizedVisionTwo({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return <VisionPage locale={locale} variant="original" route="vision2" />;
}
