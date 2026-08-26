import { createHash, randomBytes } from "node:crypto";
import configPromise from "@payload-config";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import { hashIP, verifyFormToken } from "@/lib/formSecurity";
import { claimFormAttempt } from "@/lib/formRateLimit";
import { sendFormNotification } from "@/lib/formNotifications";
import { verifyAttributionTouch } from "@/lib/attributionSecurity";
import {
  readRequestBodyWithLimit,
  RequestBodyTooLargeError,
} from "@/lib/requestBody";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 8 * 1024 * 1024;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

function clean(value: unknown, max = 5000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const allowed =
    process.env.NEXT_PUBLIC_APP_URL ||
    `${request.headers.get("x-forwarded-proto") || "http"}://${
      request.headers.get("host") || "localhost:3003"
    }`;
  try {
    return (
      origin === allowed || new URL(origin).host === request.headers.get("host")
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  }
  let data: FormData;
  try {
    const bytes = await readRequestBodyWithLimit(request, MAX_BODY_BYTES);
    const contentType = request.headers.get("content-type") || "";
    data = await new Response(bytes, {
      headers: { "content-type": contentType },
    }).formData();
  } catch (error) {
    if (!(error instanceof RequestBodyTooLargeError)) {
      return NextResponse.json(
        { error: "Invalid form request." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Request is too large." },
      { status: 413 },
    );
  }
  const formKey = clean(data.get("_formKey"), 100);
  const token = clean(data.get("_token"), 300);
  if (!formKey || !verifyFormToken(formKey, token).valid) {
    return NextResponse.json(
      { error: "This form session expired. Refresh the page and try again." },
      { status: 400 },
    );
  }
  if (clean(data.get("companyWebsite"), 200)) {
    return NextResponse.json({ ok: true });
  }

  const payload = await getPayload({ config: configPromise });
  const [forms, marketingSettings] = await Promise.all([
    payload.find({
      collection: "forms",
      depth: 0,
      limit: 1,
      locale: clean(data.get("_locale"), 2) === "ar" ? "ar" : "en",
      overrideAccess: true,
      where: {
        and: [{ formKey: { equals: formKey } }, { active: { equals: true } }],
      },
    }),
    payload.findGlobal({
      slug: "marketing-settings",
      depth: 0,
      locale: "en",
      overrideAccess: true,
    }),
  ]);
  const form = forms.docs[0];
  if (!form) {
    return NextResponse.json(
      { error: "Form is unavailable." },
      { status: 404 },
    );
  }

  const headerStore = await headers();
  const forwarded = headerStore
    .get("x-forwarded-for")
    ?.split(",")
    .at(-1)
    ?.trim();
  const ipHash = hashIP(headerStore.get("x-real-ip") || forwarded || "unknown");
  const configuredWindow = Number(form.rateLimit?.windowMinutes);
  const configuredLimit = Number(form.rateLimit?.requests);
  const windowMinutes = Math.max(
    1,
    Math.min(
      1440,
      Math.floor(Number.isFinite(configuredWindow) ? configuredWindow : 15),
    ),
  );
  const limit = Math.max(
    1,
    Math.min(
      100,
      Math.floor(Number.isFinite(configuredLimit) ? configuredLimit : 5),
    ),
  );
  const attempt = await claimFormAttempt(payload, {
    formKey,
    ipHash,
    limit,
    windowMinutes,
  });
  if (!attempt.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "retry-after": String(attempt.retryAfterSeconds),
        },
      },
    );
  }

  const values: Record<string, string | boolean> = {};
  const pendingUploads: Array<{
    buffer: Buffer;
    fieldName: string;
    mimetype: string;
    originalName: string;
    safeName: string;
  }> = [];
  for (const field of form.fields || []) {
    const entry = data.get(field.name);
    if (field.type === "file") {
      if (!(entry instanceof File) || !entry.size) {
        if (field.required) {
          return NextResponse.json(
            { error: `${field.label} is required.` },
            { status: 400 },
          );
        }
        continue;
      }
      const allowed = field.allowedFileTypes || [];
      if (
        entry.size > MAX_FILE_BYTES ||
        (allowed.length &&
          !allowed.includes(entry.type as (typeof allowed)[number]))
      ) {
        return NextResponse.json(
          { error: `${field.label} has an unsupported file type or size.` },
          { status: 400 },
        );
      }
      const buffer = Buffer.from(await entry.arrayBuffer());
      const signature = buffer.subarray(0, 8).toString("hex");
      const signatures: Record<string, string[]> = {
        "application/pdf": ["25504446"],
        "image/jpeg": ["ffd8ff"],
        "image/png": ["89504e470d0a1a0a"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          ["504b0304"],
      };
      if (
        signatures[entry.type] &&
        !signatures[entry.type].some((prefix) => signature.startsWith(prefix))
      ) {
        return NextResponse.json(
          { error: `${field.label} could not be verified.` },
          { status: 400 },
        );
      }
      const safeName = entry.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120);
      pendingUploads.push({
        buffer,
        fieldName: field.name,
        mimetype: entry.type,
        originalName: entry.name.slice(0, 200),
        safeName,
      });
      values[field.name] = createHash("sha256").update(buffer).digest("hex");
      continue;
    }
    if (
      typeof entry === "string" &&
      entry.length > Number(field.maxLength || 5000)
    ) {
      return NextResponse.json(
        { error: `${field.label} is too long.` },
        { status: 400 },
      );
    }
    const value =
      field.type === "checkbox"
        ? entry === "yes"
        : clean(entry, Number(field.maxLength || 5000));
    if (field.required && (value === "" || value === false)) {
      return NextResponse.json(
        { error: `${field.label} is required.` },
        { status: 400 },
      );
    }
    if (
      field.type === "email" &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
    ) {
      return NextResponse.json(
        { error: `${field.label} is invalid.` },
        { status: 400 },
      );
    }
    if (
      field.type === "select" &&
      value &&
      !field.options?.some((option) => option.value === value)
    ) {
      return NextResponse.json(
        { error: `${field.label} is invalid.` },
        { status: 400 },
      );
    }
    if (field.type === "number" && value && !Number.isFinite(Number(value))) {
      return NextResponse.json(
        { error: `${field.label} is invalid.` },
        { status: 400 },
      );
    }
    if (
      field.type === "date" &&
      value &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(String(value)) ||
        Number.isNaN(Date.parse(`${value}T00:00:00Z`)))
    ) {
      return NextResponse.json(
        { error: `${field.label} is invalid.` },
        { status: 400 },
      );
    }
    if (field.type === "url" && value) {
      try {
        const parsed = new URL(String(value));
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
      } catch {
        return NextResponse.json(
          { error: `${field.label} is invalid.` },
          { status: 400 },
        );
      }
    }
    if (
      field.type === "tel" &&
      value &&
      !/^[+()\d\s.-]{7,30}$/.test(String(value))
    ) {
      return NextResponse.json(
        { error: `${field.label} is invalid.` },
        { status: 400 },
      );
    }
    values[field.name] = value;
  }

  const cookieStore = await cookies();
  const acceptedCampaignParameters = new Set(
    String(marketingSettings.acceptedCampaignParameters || "")
      .split(",")
      .map((key) => key.trim())
      .filter((key) => /^[a-z][a-z0-9_]{0,63}$/i.test(key)),
  );
  const parseTouch = (name: string) => {
    const parsed = verifyAttributionTouch(cookieStore.get(name)?.value);
    if (!parsed) return {};
    const rawCampaign =
      parsed.campaign && typeof parsed.campaign === "object"
        ? (parsed.campaign as Record<string, unknown>)
        : {};
    return {
      campaign: Object.fromEntries(
        Object.entries(rawCampaign)
          .filter(([key]) => acceptedCampaignParameters.has(key))
          .map(([key, value]) => [key, clean(String(value || ""), 200)])
          .filter(([, value]) => Boolean(value)),
      ),
      capturedAt: clean(parsed.capturedAt, 40),
      landingPage: clean(parsed.landingPage, 500),
      referrer: clean(parsed.referrer, 500),
      sessionID: clean(parsed.sessionID, 100),
    };
  };
  const parseClientTouch = (value: unknown) => {
    if (!value || typeof value !== "object") return {};
    const touch = value as Record<string, unknown>;
    const rawCampaign =
      touch.campaign && typeof touch.campaign === "object"
        ? (touch.campaign as Record<string, unknown>)
        : {};
    return {
      campaign: Object.fromEntries(
        Object.entries(rawCampaign)
          .filter(([key]) => acceptedCampaignParameters.has(key))
          .map(([key, value]) => [key, clean(String(value || ""), 200)])
          .filter(([, value]) => Boolean(value)),
      ),
      capturedAt: clean(touch.capturedAt, 40),
      landingPage: clean(touch.landingPage, 500),
      referrer: clean(touch.referrer, 500),
      sessionID: clean(touch.sessionID, 100),
    };
  };
  let clientAttribution: Record<string, unknown> = {};
  try {
    clientAttribution = JSON.parse(
      clean(data.get("_attribution"), 8000) || "{}",
    ) as Record<string, unknown>;
  } catch {
    clientAttribution = {};
  }
  const hasTouch = (touch: Record<string, unknown>) =>
    Boolean(
      Object.keys(
        touch.campaign && typeof touch.campaign === "object"
          ? (touch.campaign as Record<string, unknown>)
          : {},
      ).length || clean(touch.referrer, 500),
    );
  const cookieFirstTouch = parseTouch("st_first_touch");
  const cookieLatestTouch = parseTouch("st_latest_touch");
  const firstTouch = hasTouch(cookieFirstTouch)
    ? cookieFirstTouch
    : parseClientTouch(clientAttribution.firstTouch);
  const latestTouch = hasTouch(cookieLatestTouch)
    ? cookieLatestTouch
    : parseClientTouch(clientAttribution.latestTouch);
  const reference = `ST-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomBytes(4).toString("hex").toUpperCase()}`;
  const uploadIDs: number[] = [];
  const submission = await (async () => {
    try {
      for (const pending of pendingUploads) {
        const upload = await payload.create({
          collection: "form-uploads",
          data: {
            fieldName: pending.fieldName,
            formKey,
            originalName: pending.originalName,
          },
          file: {
            data: pending.buffer,
            mimetype: pending.mimetype,
            name: `${Date.now()}-${randomBytes(4).toString("hex")}-${pending.safeName}`,
            size: pending.buffer.length,
          },
          overrideAccess: true,
        });
        uploadIDs.push(Number(upload.id));
      }

      return await payload.create({
        collection: "form-submissions",
        data: {
          attribution: {
            currentSessionID: clean(data.get("_sessionID"), 100),
            firstTouch,
            landingPage: clean(data.get("_pagePath"), 500),
            latestTouch,
            referrer: headerStore.get("referer")?.slice(0, 500) || "",
            visitorID: /^[0-9a-f-]{36}$/i.test(
              cookieStore.get("st_visitor_id")?.value || "",
            )
              ? cookieStore.get("st_visitor_id")?.value
              : "",
          },
          ctaID: clean(data.get("_ctaID"), 120),
          conversionCurrency: clean(
            form.conversionCurrency || "",
            3,
          ).toUpperCase(),
          conversionValue: Number(form.conversionValue || 0),
          data: values,
          form: form.id,
          formKey,
          ipHash,
          locale: clean(data.get("_locale"), 2) === "ar" ? "ar" : "en",
          pagePath: clean(data.get("_pagePath"), 500),
          reference,
          sectionID: clean(data.get("_sectionID"), 120),
          status: "new",
          uploads: uploadIDs,
          userAgent: headerStore.get("user-agent")?.slice(0, 500) || "",
        },
        overrideAccess: true,
      });
    } catch (error) {
      await Promise.allSettled(
        uploadIDs.map((id) =>
          payload.delete({
            collection: "form-uploads",
            id,
            overrideAccess: true,
          }),
        ),
      );
      throw error;
    }
  })();

  try {
    await sendFormNotification({
      formKey,
      locale: clean(data.get("_locale"), 2) === "ar" ? "ar" : "en",
      pagePath: clean(data.get("_pagePath"), 500),
      reference,
      submissionID: submission.id,
      submittedAt: new Date(),
      values,
    });
  } catch (error) {
    console.error("Form submission notification failed", {
      error: error instanceof Error ? error.message : "Unknown SMTP error",
      formKey,
      reference,
    });
  }

  return NextResponse.json(
    {
      conversionCurrency: clean(form.conversionCurrency || "", 3).toUpperCase(),
      conversionValue: Number(form.conversionValue || 0),
      ok: true,
      reference,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
