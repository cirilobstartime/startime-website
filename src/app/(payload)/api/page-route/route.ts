import { NextRequest, NextResponse } from "next/server";
import { getPageRoutes } from "@/content/pageRoutes";
import { getCMSRedirect } from "@/content/payload";
import { pageRoutePath, type MainPageKey } from "@/lib/pageRoutes";
import { publicPath } from "@/lib/publicPath";
import { postPath } from "@/lib/postPath";
import { getNewSitePosts } from "@/content/newSiteCmsPosts";

export const dynamic = "force-dynamic";

/** Public, read-only resolver. Proxy uses loopback so redirects precede streaming. */
export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") === "ar" ? "ar" : "en";
  const raw = request.nextUrl.searchParams.get("path") || "/";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.length > 2048) return NextResponse.json({}, { status: 400 });
  let path: string;
  try { path = decodeURIComponent(raw).normalize("NFC").replace(/\/$/, "") || "/"; }
  catch { return NextResponse.json({}, { status: 400 }); }
  const segments = path.replace(/^\/(?:ar|en)(?=\/|$)/, "").split("/").filter(Boolean);
  const routes = (await getPageRoutes())[locale];
  const page = routes.find((item) => item.slug === segments[0]);
  const json = (value: object) => NextResponse.json(value, { headers: { "Cache-Control": "no-store" } });
  // Resolve type-specific detail routes before archive aliases or CMS redirects.
  // Legacy news links under /insights remain valid permanent redirects.
  if (segments.length === 2 && (segments[0] === "news" || segments[0] === "insights" || page?.key === "insights" || page?.key === "latest-news")) {
    const post = (await getNewSitePosts(locale)).find((item) => item.slug === segments[1]);
    if (post) {
      const destination = postPath(locale, post);
      if (path !== destination) return json({ destination, permanent: true });
      return json({ rewrite: publicPath(locale, `${post.type === "news" ? "news" : "insights"}/${post.slug}`) });
    }
  }
  if (page && (segments.length === 1 || (page.key === "insights" && segments.length === 2))) {
    return json({ rewrite: publicPath(locale === "ar" ? "ar" : "en", page.key) + (segments.length === 2 ? `/${segments[1]}` : "") });
  }
  const candidates = locale === "ar" ? [path, path.replace(/^\/ar(?=\/|$)/, "")]
    : [path, `/en${path}`];
  for (const candidate of candidates) {
    const match = await getCMSRedirect(locale, candidate);
    if (!match) continue;
    const destination = pageRoutePath(locale, { key: match.key as MainPageKey, slug: match.slug });
    if (destination !== path) return json({ destination, permanent: match.permanent });
  }
  if (segments.length === 2) {
    const match = await getCMSRedirect(locale, publicPath(locale, segments[0]));
    if (match?.key === "insights") return json({ destination: publicPath(locale, `${match.slug}/${segments[1]}`), permanent: match.permanent });
  }
  return json({});
}
