"use client";

import { ArrowRight, CheckCircle, CircleNotch } from "@phosphor-icons/react";
import { useState } from "react";
import type { FormDefinition, Locale } from "@/content/types";
import {
  attributionDataLayerFields,
  readClientAttribution,
} from "@/lib/clientAttribution";
import { getOrCreateSessionID } from "@/lib/clientSession";
import { pushDataLayerEvent } from "@/lib/dataLayer";

type Props = {
  ctaID?: string | null;
  form: FormDefinition;
  locale: Locale;
  pagePath: string;
  privacyNote?: string | null;
  sectionID?: string | null;
  successHeading: string;
  successMessage: string;
  token: string;
};

export function LeadForm({
  ctaID,
  form,
  locale,
  pagePath,
  privacyNote,
  sectionID,
  successHeading,
  successMessage,
  token,
}: Props) {
  const [state, setState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("submitting");
    setError("");
    const data = new FormData(event.currentTarget);
    data.set("_formKey", form.formKey);
    data.set("_locale", locale);
    data.set("_pagePath", pagePath);
    data.set("_sectionID", sectionID || "");
    data.set("_ctaID", ctaID || "");
    data.set("_token", token);
    data.set("_sessionID", getOrCreateSessionID());
    data.set("_attribution", JSON.stringify(readClientAttribution()));

    const response = await fetch("/api/forms/submit", {
      body: data,
      credentials: "same-origin",
      method: "POST",
    });
    const result = (await response.json().catch(() => ({}))) as {
      conversionCurrency?: string;
      conversionValue?: number;
      error?: string;
      reference?: string;
    };
    if (!response.ok) {
      pushDataLayerEvent({
        event: "startime_form_error",
        form_key: form.formKey,
        page_path: pagePath,
        response_status: response.status,
      });
      setError(
        result.error ||
          (locale === "ar"
            ? "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى."
            : "We could not send your request. Please try again."),
      );
      setState("error");
      return;
    }
    const conversionValue = Number(result.conversionValue || 0);
    const conversionCurrency = result.conversionCurrency || undefined;
    pushDataLayerEvent({
      event: "startime_form_success",
      conversion_currency: conversionCurrency,
      conversion_value: conversionValue,
      form_key: form.formKey,
      page_path: pagePath,
      submission_reference: result.reference || "",
      ...attributionDataLayerFields(),
    });
    pushDataLayerEvent({
      event: "generate_lead",
      currency: conversionCurrency,
      form_key: form.formKey,
      value: conversionValue,
      ...attributionDataLayerFields(),
    });
    setState("success");
    formElement.reset();
  }

  if (state === "success") {
    return (
      <div className="lead-form__success" role="status">
        <CheckCircle aria-hidden weight="fill" />
        <h3>{successHeading}</h3>
        <p>{successMessage}</p>
      </div>
    );
  }

  return (
    <form
      className="lead-form"
      data-form-key={form.formKey}
      encType="multipart/form-data"
      onSubmit={submit}
    >
      <div aria-hidden className="lead-form__trap">
        <label>
          {locale === "ar" ? "الموقع الإلكتروني" : "Website"}
          <input autoComplete="off" name="companyWebsite" tabIndex={-1} />
        </label>
      </div>
      <div className="lead-form__grid">
        {form.fields?.map((field) => {
          const common = {
            "aria-describedby": field.helpText
              ? `${field.name}-help`
              : undefined,
            autoComplete: field.autocomplete || undefined,
            id: field.name,
            maxLength: field.maxLength || undefined,
            name: field.name,
            placeholder: field.placeholder || undefined,
            required: Boolean(field.required),
          };
          return (
            <div
              className={`lead-form__field lead-form__field--${
                field.width || "full"
              }`}
              key={field.id || field.name}
            >
              {field.type === "checkbox" ? (
                <label className="lead-form__checkbox">
                  <input {...common} type="checkbox" value="yes" />
                  <span>{field.label}</span>
                </label>
              ) : (
                <>
                  <label htmlFor={field.name}>
                    {field.label}
                    {field.required ? <span aria-hidden> *</span> : null}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea {...common} rows={5} />
                  ) : field.type === "select" ? (
                    <select {...common} defaultValue="">
                      <option disabled value="">
                        {field.placeholder || field.label}
                      </option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      {...common}
                      accept={field.allowedFileTypes?.join(",")}
                      type={field.type}
                    />
                  )}
                </>
              )}
              {field.helpText ? (
                <small id={`${field.name}-help`}>{field.helpText}</small>
              ) : null}
            </div>
          );
        })}
      </div>
      {privacyNote ? <p className="lead-form__privacy">{privacyNote}</p> : null}
      {error ? (
        <p className="lead-form__error" role="alert">
          {error}
        </p>
      ) : null}
      <button
        className="button button--primary"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? (
          <CircleNotch aria-hidden className="spin" />
        ) : (
          <ArrowRight aria-hidden />
        )}
        {form.submitLabel}
      </button>
    </form>
  );
}
