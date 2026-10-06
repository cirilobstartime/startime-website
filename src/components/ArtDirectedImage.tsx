/* eslint-disable @next/next/no-img-element -- A native fallback preserves the approved direct-child image CSS and intrinsic logo sizes. */
import type { CSSProperties } from "react";

export type ViewportImages = Partial<Record<"default" | "mobile" | "tablet" | "laptop" | "desktop" | "imac", string>>;

// Optional backgrounds can have only one device-specific source. An empty
// image is preferable to using that device's composition on every viewport.
const emptyPixel = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

export function resolveViewportImages(images: ViewportImages | undefined, fallback: string): Record<"mobile" | "tablet" | "laptop" | "desktop" | "imac", string> {
  const source = images || {};
  const defaultImage = source.default || fallback || emptyPixel;
  return {
    mobile: source.mobile || defaultImage,
    tablet: source.tablet || defaultImage,
    laptop: source.laptop || defaultImage,
    desktop: source.desktop || defaultImage,
    imac: source.imac || defaultImage,
  };
}

/** Responsive source selection; each section controls cover vs contain to retain its approved layout. */
export function ArtDirectedImage({ images, fallback, alt = "", className, style, loading = "lazy", fill = true, width, height }: {
  images?: ViewportImages;
  fallback: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  loading?: "lazy" | "eager";
  fill?: boolean;
  width?: number;
  height?: number;
}) {
  const source = images || {};
  if (!Object.values(source).some(Boolean)) {
    return <img
      className={className}
      style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style } : style}
      src={fallback}
      alt={alt}
      loading={loading}
      decoding="async"
      width={width}
      height={height}
    />;
  }
  // Only a deliberate per-screen upload overrides the shared default artwork.
  const resolved = resolveViewportImages(source, fallback);
  return <picture className="art-directed-picture">
    <source media="(max-width: 640px)" srcSet={resolved.mobile} />
    <source media="(min-width: 641px) and (max-width: 1023px)" srcSet={resolved.tablet} />
    <source media="(min-width: 1024px) and (max-width: 1599px)" srcSet={resolved.laptop} />
    <source media="(min-width: 1600px) and (max-width: 1999px)" srcSet={resolved.desktop} />
    <source media="(min-width: 2000px)" srcSet={resolved.imac} />
    <img className={`${fill ? "art-directed-fill" : "art-directed-natural"} ${className || ""}`} style={style} src={resolved.desktop} alt={alt} loading={loading} decoding="async" width={width} height={height} />
  </picture>;
}

export function ArtDirectedVideo({ videos, className, poster, autoplay = true }: {
  videos?: ViewportImages;
  className?: string;
  poster?: string;
  autoplay?: boolean;
}) {
  if (!videos || !Object.values(videos).some(Boolean)) return null;
  const videoType = (url: string) => url.toLowerCase().split("?")[0].endsWith(".webm") ? "video/webm" : "video/mp4";
  const defaultVideo = videos.default;
  const resolved = {
    mobile: videos.mobile || defaultVideo,
    tablet: videos.tablet || defaultVideo,
    laptop: videos.laptop || defaultVideo,
    desktop: videos.desktop || defaultVideo,
    imac: videos.imac || defaultVideo,
  };
  return <video className={className} poster={poster} autoPlay={autoplay} muted loop playsInline preload="metadata" aria-hidden="true">
    {resolved.mobile && <source src={resolved.mobile} media="(max-width: 640px)" type={videoType(resolved.mobile)} />}
    {resolved.tablet && <source src={resolved.tablet} media="(min-width: 641px) and (max-width: 1023px)" type={videoType(resolved.tablet)} />}
    {resolved.laptop && <source src={resolved.laptop} media="(min-width: 1024px) and (max-width: 1599px)" type={videoType(resolved.laptop)} />}
    {resolved.desktop && <source src={resolved.desktop} media="(min-width: 1600px) and (max-width: 1999px)" type={videoType(resolved.desktop)} />}
    {resolved.imac && <source src={resolved.imac} media="(min-width: 2000px)" type={videoType(resolved.imac)} />}
  </video>;
}
