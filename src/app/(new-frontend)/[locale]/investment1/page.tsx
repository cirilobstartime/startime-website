import { notFound } from "next/navigation";
import { InvestmentPage } from "@/components/InvestmentPage";

export default async function LocalizedInvestmentOne({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return <InvestmentPage locale={locale} route="investment1" square />;
}
