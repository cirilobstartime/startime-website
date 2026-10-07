import { notFound } from "next/navigation";
import { Home2Page } from "@/components/Home2Page";

export default async function LocalizedHome4({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return <Home2Page locale={locale} variant="home2" route="home4" />;
}
