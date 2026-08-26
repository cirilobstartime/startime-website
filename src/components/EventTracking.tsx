"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { pushDataLayerEvent } from "@/lib/dataLayer";
import { attributionDataLayerFields } from "@/lib/clientAttribution";

function labelFor(element: HTMLElement): string {
  return (element.getAttribute("aria-label") || element.textContent || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

export function EventTracking() {
  const pathname = usePathname();
  const startedForms = useRef(new WeakSet<HTMLFormElement>());

  useEffect(() => {
    document.documentElement.dataset.trackingReady = "true";
    pushDataLayerEvent({
      event: "startime_page_view",
      page_location: window.location.href,
      page_path: `${window.location.pathname}${window.location.search}`,
      page_title: document.title,
      ...attributionDataLayerFields(),
    });
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("a, button")
          : null;
      if (!target) return;
      if (target.closest(".cookie-consent")) return;
      const href =
        target instanceof HTMLAnchorElement
          ? target.getAttribute("href") || ""
          : "";
      if (target.classList.contains("locale-switch")) {
        pushDataLayerEvent({
          event: "startime_language_switch",
          destination: href,
          label: labelFor(target),
        });
      }
      if (
        target.matches(
          "[data-track], .button, .text-link, .header-cta, .mobile-menu a",
        )
      ) {
        pushDataLayerEvent({
          event: "startime_cta_click",
          cta_id: target.dataset.track || "",
          destination: href,
          label: labelFor(target),
          page_path: window.location.pathname,
          ...attributionDataLayerFields(),
        });
      }
    };

    const onFocus = (event: FocusEvent) => {
      const form =
        event.target instanceof Element
          ? event.target.closest<HTMLFormElement>(".lead-form")
          : null;
      if (!form || startedForms.current.has(form)) return;
      startedForms.current.add(form);
      pushDataLayerEvent({
        event: "startime_form_start",
        form_key: form.dataset.formKey || "",
        page_path: window.location.pathname,
        ...attributionDataLayerFields(),
      });
    };

    const onSubmit = (event: SubmitEvent) => {
      const form =
        event.target instanceof HTMLFormElement ? event.target : null;
      if (!form?.classList.contains("lead-form")) return;
      pushDataLayerEvent({
        event: "startime_form_submit",
        form_key: form.dataset.formKey || "",
        page_path: window.location.pathname,
        ...attributionDataLayerFields(),
      });
    };

    document.addEventListener("click", onClick);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("submit", onSubmit);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("submit", onSubmit);
    };
  }, []);

  return null;
}
