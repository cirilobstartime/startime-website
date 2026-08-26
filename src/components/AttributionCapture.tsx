"use client";

import { useEffect } from "react";
import type { MarketingSettings } from "@/content/types";
import {
  decorateCrossDomainURL,
  recordClientAttribution,
} from "@/lib/clientAttribution";
import { getOrCreateSessionID } from "@/lib/clientSession";
import { pushDataLayerEvent } from "@/lib/dataLayer";

export function AttributionCapture({
  settings,
}: {
  settings: MarketingSettings;
}) {
  useEffect(() => {
    const campaignParameters = settings.acceptedCampaignParameters
      .split(",")
      .map((key) => key.trim())
      .filter(Boolean);
    const params = new URLSearchParams(window.location.search);
    const campaign = Object.fromEntries(
      campaignParameters
        .map((key) => [key, params.get(key)] as const)
        .filter((entry): entry is readonly [string, string] =>
          Boolean(entry[1]),
        ),
    );
    let externalReferrer = "";
    try {
      if (
        document.referrer &&
        new URL(document.referrer).origin !== window.location.origin
      ) {
        externalReferrer = document.referrer;
      }
    } catch {
      externalReferrer = "";
    }
    const sessionID = getOrCreateSessionID();
    const hasTouch = Boolean(Object.keys(campaign).length || externalReferrer);
    if (hasTouch) {
      recordClientAttribution({
        campaign,
        landingPage: `${window.location.pathname}${window.location.search}`,
        referrer: externalReferrer,
        retentionDays: settings.attributionCookieDays,
        sessionID,
      });
      pushDataLayerEvent({
        event: "startime_campaign_touch",
        campaign,
        landing_page: `${window.location.pathname}${window.location.search}`,
        session_id: sessionID,
      });
    }
    document.documentElement.dataset.attributionCaptured = "true";

    void fetch("/api/attribution", {
      body: JSON.stringify({
        campaign,
        landingPage: `${window.location.pathname}${window.location.search}`,
        referrer: externalReferrer,
        sessionID,
        touch: hasTouch,
      }),
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      method: "POST",
    });

    const allowedHosts = settings.crossDomainHosts
      .split(",")
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean);
    const decorateLink = (event: MouseEvent) => {
      const anchor =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (!anchor) return;
      try {
        const destination = new URL(anchor.href, window.location.href);
        if (destination.origin === window.location.origin) return;
        anchor.href = decorateCrossDomainURL(anchor.href, allowedHosts);
      } catch {
        // Leave invalid or non-HTTP links untouched.
      }
    };
    document.addEventListener("click", decorateLink, true);
    return () => document.removeEventListener("click", decorateLink, true);
  }, [
    settings.acceptedCampaignParameters,
    settings.attributionCookieDays,
    settings.crossDomainHosts,
  ]);

  return null;
}
