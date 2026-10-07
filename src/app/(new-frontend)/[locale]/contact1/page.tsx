import { notFound } from "next/navigation";
import { ContactPage } from "@/components/ContactPage";

export default async function LocalizedContactOne({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return <ContactPage locale={locale} route="contact1" />;
}
