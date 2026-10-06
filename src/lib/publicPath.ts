export type PublicLocale = "en" | "ar";

/** English lives at the root; Arabic is the only prefixed public locale. */
export function publicPath(locale: PublicLocale, path = ""): string {
  const suffix = path ? `/${path.replace(/^\/+/, "")}` : "";
  return `${locale === "ar" ? "/ar" : ""}${suffix}` || "/";
}

export function canonicalizePublicHref(href: string): string {
  if (href === "/en") return "/";
  return href.startsWith("/en/") ? href.slice(3) : href;
}
