import { notFound } from "next/navigation";
import { AnimationPage } from "@/components/AnimationPage";

export default async function LocalizedAnimation({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return <AnimationPage locale={locale} />;
}
