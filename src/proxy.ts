import { type NextRequest, NextResponse } from "next/server";
import { buildContentSecurityPolicy } from "@/lib/contentSecurityPolicy";

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const nonce = crypto.randomUUID().replaceAll("-", "");
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce);
  const isArabic =
    request.nextUrl.pathname === "/ar" ||
    request.nextUrl.pathname.startsWith("/ar/");
  requestHeaders.set("x-startime-locale", isArabic ? "ar" : "en");
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
