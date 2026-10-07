import { notFound, permanentRedirect, redirect } from "next/navigation";
import { getCMSRedirect } from "@/content/payload";
import { publicPath } from "@/lib/publicPath";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";


export default async function LegacyRedirect({ params }: { params: Promise<{ locale: string; legacy: string[] }> }) {
  const { locale, legacy } = await params;
  if ((locale !== "en" && locale !== "ar") || !legacy.length) notFound();
  const encodedPath = `/${legacy.join("/")}`;
  let path: string;
  try {
    path = `/${legacy.map((segment) => decodeURIComponent(segment)).join("/")}`.normalize("NFC");
  } catch {
    notFound();
  }
  const paths = [...new Set([path, encodedPath])];
  const candidates = locale === "en"
    ? paths.flatMap((candidate) => [candidate, `/en${candidate}`])
    : paths.flatMap((candidate) => [`/ar${candidate}`, candidate]);
  for (const fromPath of candidates) {
    const match = await getCMSRedirect(locale, fromPath);
    if (!match) continue;
    const destination = publicPath(locale, match.key === "home" ? "" : match.slug);
    if (destination === path || destination === `/ar${path}`) continue;
    const search = (await headers()).get("x-startime-public-search") || "";
    if (match.permanent) permanentRedirect(destination + search);
    redirect(destination + search);
  }
  // Retired Insights slugs also preserve existing article-detail URLs.
  if (legacy.length === 2) {
    const base = path.split("/")[1];
    const match = await getCMSRedirect(locale, publicPath(locale, base));
    if (match?.key === "insights") {
      const destination = publicPath(locale, `${match.slug}/${decodeURIComponent(legacy[1])}`)
        + ((await headers()).get("x-startime-public-search") || "");
      if (match.permanent) permanentRedirect(destination);
      redirect(destination);
    }
  }
  notFound();
}
