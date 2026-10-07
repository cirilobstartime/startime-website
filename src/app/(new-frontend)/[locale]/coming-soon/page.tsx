import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoonPage } from "@/components/ComingSoonPage";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "قريباً | ستارتايم" : "Coming Soon | Startime",
    robots: { index: false, follow: false },
  };
}

export default async function ComingSoonRoute({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return <ComingSoonPage locale={locale} />;
}
