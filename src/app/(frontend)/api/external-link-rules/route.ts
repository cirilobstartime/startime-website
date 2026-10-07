import { NextResponse, type NextRequest } from "next/server";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { isExternalWebLink, linkPlacement, type LinkFollowStatus } from "@/lib/externalLinks";

export async function POST(request: NextRequest) {
  const payload = await getPayload({ config: configPromise });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user || user.collection !== "cms-users") return NextResponse.json({ error: "Sign in to the CMS first." }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const { pagePath, section, href, label, status } = body;
  if (typeof pagePath !== "string" || !/^\/(?!\/|api\/|content-admin(?:\/|$))[^?#]*$/.test(pagePath) || pagePath.length > 250 ||
      typeof section !== "string" || !/^(?:header|footer|page|article|section:[\w-]+)$/.test(section) || section.length > 100 ||
      typeof href !== "string" || href.length > 2000 || !isExternalWebLink(href, "https://startime.sa") ||
      (status !== "follow" && status !== "nofollow")) {
    return NextResponse.json({ error: "Only external website links and a follow status are accepted." }, { status: 400 });
  }
  const placement = linkPlacement(pagePath, section, href);
  const existing = await payload.find({ collection: "external-link-rules", where: { placement: { equals: placement } }, limit: 1, depth: 0, overrideAccess: true });
  const data = { placement, pagePath, section, href, label: typeof label === "string" ? label.slice(0, 160) : "", status: status as LinkFollowStatus };
  const rule = existing.docs[0]
    ? await payload.update({ collection: "external-link-rules", id: existing.docs[0].id, data: { status }, overrideAccess: true })
    : await payload.create({ collection: "external-link-rules", data, overrideAccess: true });
  return NextResponse.json({ placement: rule.placement, status: rule.status }, { headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: NextRequest) {
  const pagePath = request.nextUrl.searchParams.get("pagePath") || "/";
  if (!/^\/(?!\/|api\/|content-admin(?:\/|$))[^?#]*$/.test(pagePath) || pagePath.length > 250) {
    return NextResponse.json({ error: "Invalid page path." }, { status: 400 });
  }
  const payload = await getPayload({ config: configPromise });
  const found = await payload.find({ collection: "external-link-rules", where: { pagePath: { equals: pagePath } }, depth: 0, limit: 500, overrideAccess: true });
  return NextResponse.json({ rules: Object.fromEntries(found.docs.map((rule) => [rule.placement, rule.status])) }, { headers: { "Cache-Control": "private, no-store" } });
}
