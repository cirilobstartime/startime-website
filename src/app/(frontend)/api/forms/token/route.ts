import { NextResponse } from "next/server";
import { createFormToken } from "@/lib/formSecurity";

const publicFormKeys = new Set(["contact", "careers", "governance"]);

export function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key") || "";
  if (!publicFormKeys.has(key)) {
    return NextResponse.json({ error: "Form unavailable." }, { status: 404 });
  }
  return NextResponse.json(
    { token: createFormToken(key, Date.now() - 2000) },
    { headers: { "cache-control": "no-store" } },
  );
}
