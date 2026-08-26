import type { CollectionConfig } from "payload";

export function csvCell(value: unknown): string {
  const raw =
    value === null || value === undefined
      ? ""
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);
  const text = /^[\s\uFEFF]*[=+\-@]/u.test(raw) ? `'${raw}` : raw;
  return `"${text.replaceAll('"', '""')}"`;
}

function flatten(prefix: string, value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { [prefix]: value };
  }
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).flatMap(([key, item]) => {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        return Object.entries(item as Record<string, unknown>).map(
          ([nestedKey, nestedValue]) => [
            `${prefix}_${key}_${nestedKey}`,
            nestedValue,
          ],
        );
      }
      return [[`${prefix}_${key}`, item]];
    }),
  );
}

const staffOnly = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

export const FormSubmissions: CollectionConfig = {
  slug: "form-submissions",
  labels: { singular: "Form submission", plural: "Form submissions" },
  admin: {
    group: "Lead capture",
    useAsTitle: "reference",
    defaultColumns: ["reference", "formKey", "status", "locale", "createdAt"],
    description:
      "First-party conversion records. IP addresses are irreversibly hashed before storage.",
    components: {
      beforeList: [
        {
          path: "./src/payload/admin/FormSubmissionExport",
          exportName: "FormSubmissionExport",
        },
      ],
    },
  },
  endpoints: [
    {
      path: "/export",
      method: "get",
      handler: async (req) => {
        if (!req.user) {
          return new Response("Unauthorized", { status: 401 });
        }
        const docs: Record<string, unknown>[] = [];
        let page = 1;
        let hasNextPage = true;
        while (hasNextPage) {
          const result = await req.payload.find({
            collection: "form-submissions",
            depth: 0,
            limit: 500,
            page,
            overrideAccess: true,
            sort: "-createdAt",
          });
          docs.push(...(result.docs as unknown as Record<string, unknown>[]));
          hasNextPage = result.hasNextPage;
          page += 1;
        }

        const rows = docs.map((doc) => {
          const attribution =
            doc.attribution && typeof doc.attribution === "object"
              ? (doc.attribution as Record<string, unknown>)
              : {};
          return {
            reference: doc.reference,
            created_at: doc.createdAt,
            status: doc.status,
            form_key: doc.formKey,
            locale: doc.locale,
            page_path: doc.pagePath,
            section_id: doc.sectionID,
            cta_id: doc.ctaID,
            conversion_value: doc.conversionValue,
            conversion_currency: doc.conversionCurrency,
            landing_page: attribution.landingPage,
            referrer: attribution.referrer,
            visitor_id: attribution.visitorID,
            session_id: attribution.currentSessionID,
            ...flatten("field", doc.data),
            ...flatten("first_touch", attribution.firstTouch),
            ...flatten("latest_touch", attribution.latestTouch),
          };
        });
        const headers = Array.from(
          new Set(rows.flatMap((row) => Object.keys(row))),
        );
        const csv = [
          headers.map(csvCell).join(","),
          ...rows.map((row) =>
            headers
              .map((header) =>
                csvCell((row as Record<string, unknown>)[header]),
              )
              .join(","),
          ),
        ].join("\r\n");
        return new Response(`\uFEFF${csv}`, {
          headers: {
            "cache-control": "no-store",
            "content-disposition": `attachment; filename="startime-form-submissions-${new Date().toISOString().slice(0, 10)}.csv"`,
            "content-type": "text/csv; charset=utf-8",
          },
        });
      },
    },
  ],
  access: {
    create: staffOnly,
    delete: staffOnly,
    read: staffOnly,
    update: staffOnly,
  },
  fields: [
    {
      name: "reference",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    { name: "form", type: "relationship", relationTo: "forms", required: true },
    { name: "formKey", type: "text", required: true, index: true },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "In progress", value: "in-progress" },
        { label: "Qualified", value: "qualified" },
        { label: "Closed", value: "closed" },
        { label: "Spam", value: "spam" },
      ],
      required: true,
      index: true,
    },
    { name: "locale", type: "select", options: ["en", "ar"], required: true },
    { name: "pagePath", type: "text" },
    { name: "sectionID", type: "text" },
    { name: "ctaID", type: "text" },
    {
      name: "conversionValue",
      type: "number",
      min: 0,
      admin: {
        description:
          "Initial value comes from the form and can be updated when the opportunity is qualified.",
      },
    },
    { name: "conversionCurrency", type: "text", maxLength: 3 },
    { name: "data", type: "json", required: true },
    {
      name: "uploads",
      type: "relationship",
      relationTo: "form-uploads",
      hasMany: true,
    },
    {
      name: "attribution",
      type: "group",
      fields: [
        { name: "firstTouch", type: "json" },
        { name: "latestTouch", type: "json" },
        { name: "landingPage", type: "text" },
        { name: "referrer", type: "text" },
        { name: "visitorID", type: "text" },
        { name: "currentSessionID", type: "text" },
      ],
    },
    { name: "ipHash", type: "text", required: true, index: true },
    { name: "userAgent", type: "text" },
    { name: "notes", type: "textarea" },
  ],
};
