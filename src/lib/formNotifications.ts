import nodemailer from "nodemailer";

type NotificationInput = {
  formKey: string;
  locale: "ar" | "en";
  pagePath: string;
  reference: string;
  submissionID: number | string;
  submittedAt: Date;
  values: Record<string, string | boolean>;
};

type NotificationRecipient = {
  cc: string;
  subject: string;
  to: string;
};

const notificationRecipients: Record<string, NotificationRecipient> = {
  careers: {
    cc: "website@startime.sa",
    subject: "New Applicant applied at Startime Website",
    to: "career@startime.sa",
  },
  contact: {
    cc: "website@startime.sa",
    subject: "New contact query at Startime website",
    to: "info@startime.sa",
  },
};

function escapeHTML(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function printableValue(value: string | boolean): string {
  return typeof value === "boolean" ? (value ? "Yes" : "No") : value;
}

function recipientFor(formKey: string): NotificationRecipient | null {
  return notificationRecipients[formKey] || null;
}

/**
 * Sends an internal notification only after a submission is safely recorded in
 * Payload. E-mail delivery is deliberately best-effort: an SMTP outage must
 * never discard a legitimate lead or application from the CMS.
 */
export async function sendFormNotification(
  input: NotificationInput,
): Promise<void> {
  const recipient = recipientFor(input.formKey);
  if (!recipient) return;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  if (!host || !user || !password) {
    console.warn("Form notification skipped: SMTP is not configured.");
    return;
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true";
  const origin = (process.env.NEXT_PUBLIC_APP_URL || "https://startime.sa").replace(
    /\/$/,
    "",
  );
  const rows = Object.entries(input.values)
    .map(
      ([key, value]) =>
        `<tr><th style="padding:8px 12px;text-align:left;border:1px solid #ddd;background:#f5f5f5">${escapeHTML(key)}</th><td style="padding:8px 12px;border:1px solid #ddd">${escapeHTML(printableValue(value))}</td></tr>`,
    )
    .join("");
  const adminURL = `${origin}/content-admin/collections/form-submissions/${input.submissionID}`;
  const submittedAt = input.submittedAt.toISOString();

  const transport = nodemailer.createTransport({
    auth: { pass: password, user },
    host,
    port,
    secure,
  });

  await transport.sendMail({
    cc: recipient.cc,
    from: process.env.SMTP_FROM || `Startime Website <${user}>`,
    html: `
      <p>A new website form submission has been received.</p>
      <table style="border-collapse:collapse;margin:16px 0">
        <tr><th style="padding:8px 12px;text-align:left;border:1px solid #ddd;background:#f5f5f5">Reference</th><td style="padding:8px 12px;border:1px solid #ddd">${escapeHTML(input.reference)}</td></tr>
        <tr><th style="padding:8px 12px;text-align:left;border:1px solid #ddd;background:#f5f5f5">Form</th><td style="padding:8px 12px;border:1px solid #ddd">${escapeHTML(input.formKey)}</td></tr>
        <tr><th style="padding:8px 12px;text-align:left;border:1px solid #ddd;background:#f5f5f5">Page</th><td style="padding:8px 12px;border:1px solid #ddd">${escapeHTML(input.pagePath)}</td></tr>
        <tr><th style="padding:8px 12px;text-align:left;border:1px solid #ddd;background:#f5f5f5">Language</th><td style="padding:8px 12px;border:1px solid #ddd">${escapeHTML(input.locale)}</td></tr>
        <tr><th style="padding:8px 12px;text-align:left;border:1px solid #ddd;background:#f5f5f5">Submitted</th><td style="padding:8px 12px;border:1px solid #ddd">${escapeHTML(submittedAt)}</td></tr>
        ${rows}
      </table>
      <p><a href="${escapeHTML(adminURL)}">Open submission in Startime CMS</a></p>
    `,
    subject: recipient.subject,
    text: [
      "A new website form submission has been received.",
      `Reference: ${input.reference}`,
      `Form: ${input.formKey}`,
      `Page: ${input.pagePath}`,
      `Language: ${input.locale}`,
      `Submitted: ${submittedAt}`,
      ...Object.entries(input.values).map(
        ([key, value]) => `${key}: ${printableValue(value)}`,
      ),
      `CMS: ${adminURL}`,
    ].join("\n"),
    to: recipient.to,
  });
}
