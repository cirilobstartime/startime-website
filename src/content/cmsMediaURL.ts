/** Payload may serialize its own uploads as absolute URLs. Keep same-origin media local. */
export function cmsMediaURL(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("/")) return url;
  try {
    const parsed = new URL(url);
    return parsed.pathname.startsWith("/api/media/file/")
      ? `${parsed.pathname}${parsed.search}`
      : url;
  } catch {
    return undefined;
  }
}
