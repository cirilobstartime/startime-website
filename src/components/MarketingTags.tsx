import Script from "next/script";
import type { MarketingSettings } from "@/content/types";

export function MarketingTags({
  nonce,
  settings,
}: {
  nonce: string;
  settings: MarketingSettings;
}) {
  const gtmID = /^GTM-[A-Z0-9]+$/i.test(settings.googleTagManagerID)
    ? settings.googleTagManagerID
    : "";
  const ga4ID = /^G-[A-Z0-9]+$/i.test(settings.ga4MeasurementID)
    ? settings.ga4MeasurementID
    : "";
  const advertisingIDs = {
    google_ads_id: /^AW-[0-9]+$/i.test(settings.googleAdsID)
      ? settings.googleAdsID
      : "",
    linkedin_partner_id: /^\d+$/.test(settings.linkedInPartnerID)
      ? settings.linkedInPartnerID
      : "",
    meta_pixel_id: /^\d+$/.test(settings.metaPixelID)
      ? settings.metaPixelID
      : "",
    tiktok_pixel_id: /^[A-Z0-9]+$/i.test(settings.tiktokPixelID)
      ? settings.tiktokPixelID
      : "",
    x_pixel_id: /^[A-Z0-9]+$/i.test(settings.xPixelID) ? settings.xPixelID : "",
  };
  if (!settings.enableAnalytics || (!gtmID && !ga4ID)) return null;

  return (
    <>
      <Script
        id="startime-marketing-config"
        nonce={nonce}
        strategy="afterInteractive"
      >
        {`window.dataLayer=window.dataLayer||[];window.dataLayer.push(${JSON.stringify(
          {
            event: "startime_marketing_config",
            ...advertisingIDs,
          },
        ).replaceAll("<", "\\u003c")});`}
      </Script>
      {settings.defaultConsentDenied ? (
        <Script
          id="startime-consent-default"
          nonce={nonce}
          strategy="afterInteractive"
        >
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`}
        </Script>
      ) : null}
      {gtmID ? (
        <>
          <Script id="startime-gtm" nonce={nonce} strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmID}');`}
          </Script>
          <noscript>
            <iframe
              height="0"
              src={`https://www.googletagmanager.com/ns.html?id=${gtmID}`}
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
              width="0"
            />
          </noscript>
        </>
      ) : (
        <>
          <Script
            nonce={nonce}
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4ID}`}
            strategy="afterInteractive"
          />
          <Script id="startime-ga4" nonce={nonce} strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${ga4ID}');`}
          </Script>
        </>
      )}
    </>
  );
}
