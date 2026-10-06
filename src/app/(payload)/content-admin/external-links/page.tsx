import { headers } from "next/headers";
import { redirect } from "next/navigation";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { ExternalLinksWorkspace } from "@/payload/admin/ExternalLinksWorkspace";
import type { LinkFollowStatus } from "@/lib/externalLinks";
import type { Metadata } from "next";
import "./workspace.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "External Links — Startime Content Studio", robots: { index: false, follow: false } };

export default async function ExternalLinksPage() {
  const payload = await getPayload({ config: configPromise });
  const { user } = await payload.auth({ headers: await headers() });
  if (!user || user.collection !== "cms-users") redirect("/content-admin/login?redirect=%2Fcontent-admin%2Fexternal-links");
  const saved = await payload.find({ collection: "external-link-rules", depth: 0, limit: 1000, overrideAccess: true });
  const rules = Object.fromEntries(saved.docs.map((rule) => [rule.placement, rule.status as LinkFollowStatus]));
  return <ExternalLinksWorkspace rules={rules} />;
}
