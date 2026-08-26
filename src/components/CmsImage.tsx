import Image from "next/image";
import type { MediaValue } from "@/content/types";

type CmsImageProps = {
  alt?: string;
  className?: string;
  media?: MediaValue;
  priority?: boolean;
  sizes?: string;
};

type CmsMediaProps = CmsImageProps & {
  mobileMedia?: MediaValue;
  poster?: MediaValue;
};

function getMediaMimeType(media: MediaValue | undefined, src: string) {
  if (typeof media === "object" && media?.mimeType) return media.mimeType;
  if (/\.webm(?:\?.*)?$/i.test(src)) return "video/webm";
  if (/\.mp4(?:\?.*)?$/i.test(src)) return "video/mp4";
  return undefined;
}

export function getMediaURL(media?: MediaValue): string {
  if (typeof media === "string") return media;
  const url = media?.url || "";
  const appURL = process.env.NEXT_PUBLIC_APP_URL;

  if (appURL && url.startsWith(appURL)) {
    return url.slice(appURL.length) || "/";
  }

  return url;
}

export function getMediaAlt(media?: MediaValue, fallback = ""): string {
  if (typeof media === "object" && media?.alt) return media.alt;
  return fallback;
}

export function CmsImage({
  alt,
  className,
  media,
  priority = false,
  sizes = "100vw",
}: CmsImageProps) {
  const src = getMediaURL(media);

  if (!src) return null;

  return (
    <Image
      alt={alt || getMediaAlt(media)}
      className={className}
      fill
      priority={priority}
      sizes={sizes}
      src={src}
      unoptimized={src.endsWith(".svg")}
    />
  );
}

export function CmsMedia({
  alt,
  className,
  media,
  mobileMedia,
  poster,
  priority = false,
  sizes = "100vw",
}: CmsMediaProps) {
  const src = getMediaURL(media);
  const mimeType = getMediaMimeType(media, src);
  const isVideo =
    mimeType?.startsWith("video/") || /\.(mp4|webm)(?:\?.*)?$/i.test(src);
  const mobileSrc = getMediaURL(mobileMedia);
  const mobileMimeType = getMediaMimeType(mobileMedia, mobileSrc);
  const mobileIsVideo =
    mobileMimeType?.startsWith("video/") ||
    /\.(mp4|webm)(?:\?.*)?$/i.test(mobileSrc);

  if (!src) return null;
  if (!isVideo) {
    return (
      <CmsImage
        alt={alt}
        className={className}
        media={media}
        priority={priority}
        sizes={sizes}
      />
    );
  }

  return (
    <video
      aria-label={alt || undefined}
      autoPlay
      className={className}
      loop
      muted
      playsInline
      poster={getMediaURL(poster) || undefined}
      preload="metadata"
    >
      {mobileSrc && mobileIsVideo ? (
        <source
          media="(max-width: 767px)"
          src={mobileSrc}
          type={mobileMimeType}
        />
      ) : null}
      <source src={src} type={mimeType} />
    </video>
  );
}
