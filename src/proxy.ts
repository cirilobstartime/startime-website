import { type NextRequest, NextResponse } from "next/server";
import { buildContentSecurityPolicy } from "@/lib/contentSecurityPolicy";

async function rewriteProof(path: string, nonce: string): Promise<string> {
  const secret = process.env.PAYLOAD_SECRET;
  if (!secret) throw new Error("The application secret is required for internal routing.");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${path}\n${nonce}`));
  return Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function proxy(request: NextRequest) {
  // A loopback rewrite already has the original public path and CSP nonce.
  // Re-running routing here would replace /news with /en/latest-news and
  // make the canonical-page guard redirect /news back to itself.
  const internalPath = request.headers.get("x-startime-public-path");
  const internalNonce = request.headers.get("x-nonce");
  if (request.headers.get("x-startime-internal-rewrite") === "1" && internalPath && internalNonce
    && request.headers.get("x-startime-rewrite-proof") === await rewriteProof(internalPath, internalNonce)) {
    return NextResponse.next({ request: { headers: new Headers(request.headers) } });
  }
  const pathname = request.nextUrl.pathname;
  if ((pathname === "/en" || pathname.startsWith("/en/")) && request.headers.get("x-startime-internal-rewrite") !== "1") {
    const destination = request.nextUrl.clone();
    destination.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(destination, 308);
  }
  const requestHeaders = new Headers(request.headers);
  const nonce = crypto.randomUUID().replaceAll("-", "");
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce);
  const isArabic = pathname === "/ar" || pathname.startsWith("/ar/");
  const publicSlug = pathname.replace(/^\/(?:ar|en)(?=\/|$)/, "").split("/")[1];
  const isDesignPreview = /^(?:home[1-6]|discover[1-5]|vision[12]|investment[12]|careers1|contact1|insights1|animation)$/.test(publicSlug || "");
  requestHeaders.set("x-startime-locale", isArabic ? "ar" : "en");
  requestHeaders.set("x-startime-public-path", pathname);
  requestHeaders.set("x-startime-public-search", request.nextUrl.search);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const isPublicPage =
    !isArabic &&
    pathname !== "/en" &&
    !pathname.startsWith("/en/") &&
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/content-admin") &&
    !pathname.startsWith("/assets/") &&
    !pathname.startsWith("/uploads/") &&
    !pathname.startsWith("/_next/") &&
    !/\.[^/]+$/.test(pathname);
  const destination = request.nextUrl.clone();
  if (isDesignPreview && process.env.ENABLE_DESIGN_PREVIEWS !== "1") {
    destination.pathname = isArabic ? "/ar/__preview_disabled__" : "/en/__preview_disabled__";
    return NextResponse.rewrite(destination, { request: { headers: requestHeaders } });
  }
  const isRoutablePath = !isDesignPreview && (isPublicPage || isArabic) && pathname !== "/" && pathname !== "/ar"
    && !/\.[^/]+$/.test(pathname);
  if (isRoutablePath) {
    const resolver = request.nextUrl.clone();
    resolver.protocol = "http:";
    resolver.hostname = "127.0.0.1";
    resolver.pathname = "/api/page-route";
    resolver.search = "";
    resolver.searchParams.set("locale", isArabic ? "ar" : "en");
    resolver.searchParams.set("path", pathname);
    const resolved = await fetch(resolver, { cache: "no-store" });
    if (!resolved.ok) return new NextResponse("Page routing is temporarily unavailable.", { status: 503 });
    const route = await resolved.json() as { destination?: string; permanent?: boolean; rewrite?: string };
    if (route.destination) {
      destination.pathname = route.destination;
      const response = NextResponse.redirect(destination, route.permanent ? 308 : 307);
      response.headers.set("Content-Security-Policy", contentSecurityPolicy);
      return response;
    }
    if (route.rewrite) destination.pathname = isArabic ? route.rewrite : `/en${route.rewrite}`;
  }
  if (isPublicPage) {
    if (destination.pathname === pathname) destination.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
    // Keep the locale rewrite on this server. Behind Nginx, the public Host
    // resolves to the EC2 address and its application port is not exposed.
    destination.hostname = "127.0.0.1";
    destination.protocol = "http:";
  }
  if (destination.pathname !== pathname) {
    requestHeaders.set("x-startime-internal-rewrite", "1");
    requestHeaders.set("x-startime-rewrite-proof", await rewriteProof(pathname, nonce));
  }
  const response = (isPublicPage || destination.pathname !== pathname ? NextResponse.rewrite(destination, {
    request: { headers: requestHeaders },
  }) : NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  }));
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
