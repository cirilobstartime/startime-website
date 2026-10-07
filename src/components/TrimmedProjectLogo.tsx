"use client";

import Image from "next/image";
import { useState } from "react";

type Bounds = { x: number; y: number; width: number; height: number; sourceWidth: number; sourceHeight: number };
const cache = new Map<string, Bounds>();

// Measure only the empty canvas. Rendering keeps the original vector/bitmap,
// so no artwork is resampled or rewritten when editors replace a CMS logo.
function artworkBounds(image: HTMLImageElement): Bounds {
  const sourceWidth = image.naturalWidth;
  const sourceHeight = image.naturalHeight;
  const scale = Math.min(1, 512 / Math.max(sourceWidth, sourceHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(sourceWidth * scale));
  canvas.height = Math.max(1, Math.round(sourceHeight * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const full = { x: 0, y: 0, width: sourceWidth, height: sourceHeight, sourceWidth, sourceHeight };
  if (!context) return full;
  try {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let left = canvas.width, top = canvas.height, right = -1, bottom = -1;
    for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      if (data[i + 3] < 16 || (data[i] > 250 && data[i + 1] > 250 && data[i + 2] > 250)) continue;
      left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
    if (right < left) return full;
    // One measurement pixel protects anti-aliased artwork edges.
    left = Math.max(0, left - 1); top = Math.max(0, top - 1);
    right = Math.min(canvas.width - 1, right + 1); bottom = Math.min(canvas.height - 1, bottom + 1);
    return { x: left / scale, y: top / scale, width: (right - left + 1) / scale, height: (bottom - top + 1) / scale, sourceWidth, sourceHeight };
  } catch { return full; } // Non-local/CORS-restricted sources retain their full logo.
}

export function TrimmedProjectLogo({ src, centered = false, rtl = false }: { src: string; centered?: boolean; rtl?: boolean }) {
  const [measured, setMeasured] = useState<{ src: string; bounds: Bounds } | null>(null);
  const bounds = measured?.src === src ? measured.bounds : cache.get(src);
  return <>
    <Image src={src} alt="" fill sizes="180px" unoptimized style={{ visibility: bounds ? "hidden" : "visible" }} onLoad={event => {
      const next = cache.get(src) || artworkBounds(event.currentTarget);
      cache.set(src, next);
      setMeasured({ src, bounds: next });
    }} />
    {bounds && <svg className="trimmed-project-logo" aria-hidden="true" viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`} preserveAspectRatio={`${centered ? "xMid" : rtl ? "xMax" : "xMin"}YMid meet`}>
      <image href={src} width={bounds.sourceWidth} height={bounds.sourceHeight} />
    </svg>}
  </>;
}
