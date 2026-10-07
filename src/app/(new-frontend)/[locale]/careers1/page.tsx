import { notFound } from "next/navigation";
import { CareersPage } from "@/components/CareersPage";

export default async function LocalizedCareersOne({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return <CareersPage locale={locale} route="careers1" />;
}
