"use client";

import { useSyncExternalStore } from "react";

const subscribeToHostname = () => () => {};
const isLocalHostname = () => window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
// Render no third-party frame during SSR; enable it only after the browser confirms a non-local host.
const isServerHostname = () => true;

export function DunsRegisteredSeal({ rtl = false, src = "https://dunsregistered.dnb.com/SealAuthentication.aspx?Cid=1" }: { rtl?: boolean; src?: string }) {
  const isLocal = useSyncExternalStore(subscribeToHostname, isLocalHostname, isServerHostname);

  return (
    <div className="footer-duns-seal">
      {!isLocal ? <iframe
        id="Iframe1"
        title={rtl ? "ختم التسجيل لدى دن آند برادستريت" : "D-U-N-S Registered seal"}
        src={src}
        width="114"
        height="97"
        loading="lazy"
        scrolling="no"
        referrerPolicy="strict-origin-when-cross-origin"
      /> : null}
    </div>
  );
}
