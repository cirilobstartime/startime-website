import type { ViewportImages } from "@/components/ArtDirectedImage";

const devices = ["mobile", "tablet", "laptop", "desktop", "imac"] as const;

/** A slide's own default replaces the first slide on every device; individual crops override it. */
export function slideImagesWithFallback(
  first: ViewportImages | undefined,
  current: ViewportImages | undefined,
  firstFallback: string,
): ViewportImages {
  const base = first?.default || firstFallback;
  const currentDefault = current?.default;
  return {
    default: currentDefault || base,
    ...Object.fromEntries(devices.map((device) => [
      device,
      current?.[device] || currentDefault || first?.[device] || base,
    ])),
  };
}
