import Image from "next/image";
import React from "react";

export function StartimeLogo() {
  return (
    <div className="startime-cms-logo">
      <Image
        alt="Startime Content Studio"
        height="72"
        src="/assets/brand/startime-dark.svg"
        width="230"
      />
    </div>
  );
}

export function StartimeIcon() {
  return (
    <div className="startime-cms-icon">
      <Image
        alt="Startime"
        height="40"
        src="/assets/brand/startime-symbol-dark.svg"
        width="50"
      />
    </div>
  );
}
