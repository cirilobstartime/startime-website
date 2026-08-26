import configPromise from "@payload-config";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import { signAttributionTouch } from "@/lib/attributionSecurity";
import {
  readRequestBodyWithLimit,
  RequestBodyTooLargeError,
} from "@/lib/requestBody";

const defaultParameters = [
  "utm_id",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_source_platform",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "ttclid",
  "li_fat_id",
  "twclid",
];

function clean(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin) {
    try {
      if (!host || new URL(origin).host !== host) {
        return NextResponse.json({ ok: false }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ ok: false }, { status: 403 });
    }
  }
  let body: Record<string, unknown>;
  try {
    const bytes = await readRequestBodyWithLimit(request, 16 * 1024);
    body = JSON.parse(new TextDecoder().decode(bytes)) as Record<
      string,
      unknown
    >;
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ ok: false }, { status: 413 });
    }
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const rawCampaign =
    body.campaign && typeof body.campaign === "object"
      ? (body.campaign as Record<string, unknown>)
      : {};
  const payload = await getPayload({ config: configPromise });
  const settings = await payload.findGlobal({
    slug: "marketing-settings",
    draft: false,
    locale: "en",
    overrideAccess: true,
  });
  const allowed = new Set(
    (settings.acceptedCampaignParameters || defaultParameters.join(","))
      .split(",")
      .map((key) => key.trim())
      .filter(Boolean),
  );
  const campaign = Object.fromEntries(
    Object.entries(rawCampaign)
      .filter(([key]) => allowed.has(key))
      .map(([key, value]) => [key, clean(value, 200)])
      .filter(([, value]) => Boolean(value)),
  );
  const touch = signAttributionTouch({
    campaign,
    capturedAt: new Date().toISOString(),
    landingPage: clean(body.landingPage),
    referrer: clean(body.referrer),
    sessionID: clean(body.sessionID, 100),
  });
  const store = await cookies();
  const retentionDays = Math.max(
    1,
    Math.min(395, Number(settings.attributionCookieDays || 90)),
  );
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const secure =
    forwardedProtocol === "https" ||
    (!forwardedProtocol && new URL(request.url).protocol === "https:");
  const options = {
    httpOnly: true,
    maxAge: retentionDays * 24 * 60 * 60,
    path: "/",
    sameSite: "lax" as const,
    secure,
    ...(safeCookieDomain(
      clean(settings.attributionCookieDomain, 200),
      request.headers.get("host") || "",
    )
      ? {
          domain: safeCookieDomain(
            clean(settings.attributionCookieDomain, 200),
            request.headers.get("host") || "",
          ),
        }
      : {}),
  };
  if (!store.has("st_visitor_id")) {
    store.set("st_visitor_id", randomUUID(), options);
  }
  if (Object.keys(campaign).length || clean(body.referrer)) {
    if (!store.has("st_first_touch")) {
      store.set("st_first_touch", touch, options);
    }
    store.set("st_latest_touch", touch, options);
  }

  return NextResponse.json(
    { ok: true },
    { headers: { "cache-control": "no-store" } },
  );
}

function safeCookieDomain(
  value: string,
  requestHost: string,
): string | undefined {
  const normalized = value.trim().toLowerCase();
  if (!/^\.?[a-z0-9.-]+$/.test(normalized)) return undefined;
  const base = normalized.replace(/^\./, "");
  const host = requestHost.split(":")[0].toLowerCase();
  if (host !== base && !host.endsWith(`.${base}`)) return undefined;
  return `.${base}`;
}
