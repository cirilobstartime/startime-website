import { attributionDataLayerFields, readClientAttribution } from "@/lib/clientAttribution";
import { getOrCreateSessionID } from "@/lib/clientSession";
import { pushDataLayerEvent } from "@/lib/dataLayer";

export type PublicFormKey = "contact" | "careers" | "governance";

export async function submitPublicForm(input: {
  form: HTMLFormElement;
  formKey: PublicFormKey;
  locale: "en" | "ar";
  sectionID: string;
  extra?: Record<string, string>;
}): Promise<string> {
  const { form, formKey, locale, sectionID, extra } = input;
  const tokenResponse = await fetch(`/api/forms/token?key=${formKey}`, {
    cache: "no-store",
    credentials: "same-origin",
  });
  if (!tokenResponse.ok) throw new Error(locale === "ar" ? "تعذر بدء الإرسال. يرجى المحاولة مرة أخرى." : "Could not start the submission. Please try again.");
  const { token } = (await tokenResponse.json()) as { token: string };
  const data = new FormData(form);
  for (const [key, value] of Object.entries(extra || {})) data.set(key, value);
  data.set("_formKey", formKey);
  data.set("_locale", locale);
  data.set("_pagePath", window.location.pathname);
  data.set("_sectionID", sectionID);
  data.set("_token", token);
  data.set("_sessionID", getOrCreateSessionID());
  const attribution = readClientAttribution();
  data.set("_attribution", JSON.stringify(attribution));
  // These are hidden submission fields for export/integration; the server's
  // signed first-party cookies remain the authoritative attribution source.
  for (const [key, value] of Object.entries(attribution.latestTouch?.campaign || {})) {
    data.set(`_campaign_${key}`, value);
  }
  const response = await fetch("/api/forms/submit", {
    body: data,
    credentials: "same-origin",
    method: "POST",
  });
  const result = (await response.json().catch(() => ({}))) as {
    error?: string;
    reference?: string;
    conversionCurrency?: string;
    conversionValue?: number;
  };
  if (!response.ok) {
    pushDataLayerEvent({ event: "startime_form_error", form_key: formKey, page_path: window.location.pathname, response_status: response.status });
    throw new Error(result.error || (locale === "ar" ? "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى." : "We could not send your request. Please try again."));
  }
  pushDataLayerEvent({
    event: "startime_form_success",
    form_key: formKey,
    page_path: window.location.pathname,
    submission_reference: result.reference || "",
    conversion_currency: result.conversionCurrency,
    conversion_value: result.conversionValue,
    ...attributionDataLayerFields(),
  });
  pushDataLayerEvent({
    event: "generate_lead",
    form_key: formKey,
    currency: result.conversionCurrency,
    value: result.conversionValue,
    ...attributionDataLayerFields(),
  });
  return result.reference || "";
}
