import { notFound } from "next/navigation";
import { HomePage } from "@/components/HomePage";

export default async function LocalizedHome6({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return <HomePage locale={locale} route="home6" />;
}
