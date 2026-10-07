import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MaintenancePage } from "@/components/MaintenancePage";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "صيانة الموقع | ستارتايم" : "Maintenance | Startime",
    robots: { index: false, follow: false },
  };
}

export default async function MaintenanceRoute({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return <MaintenancePage locale={locale} />;
}
