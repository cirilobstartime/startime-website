import { notFound, permanentRedirect, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getPageRoutes } from "@/content/pageRoutes";
import { getCMSRedirect } from "@/content/payload";
import { mainPageKeys, pageRoutePath } from "@/lib/pageRoutes";
import { getNewSiteChrome } from "@/content/newSiteChrome";
import { NewSiteChromeProvider } from "@/components/NewSiteChromeProvider";
import { PageDesignScope } from "@/components/PageDesignScope";
import { getDesignSettings } from "@/content/designSettings";
import { pageDesignStyles } from "@/lib/designSettings";

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const [chrome, routes, requestHeaders] = await Promise.all([getNewSiteChrome(locale), getPageRoutes(), headers()]);
  const path = requestHeaders.get("x-startime-public-path") || "/";
  const segments = path.replace(/^\/(?:ar|en)(?=\/|$)/, "").split("/").filter(Boolean);
  const fixedKey = mainPageKeys.find((key) => key === (segments[0] || "home"));
  const page = fixedKey && routes[locale].find((item) => item.key === fixedKey);
  if (page && page.key !== "home" && page.slug !== segments[0] && (segments.length === 1 || page.key === "insights")) {
    const match = await getCMSRedirect(locale, pageRoutePath(locale, { key: page.key, slug: segments[0] }));
    if (!match) notFound();
    const destination = pageRoutePath(locale, { key: match.key as typeof page.key, slug: match.slug })
      + (segments.length > 1 ? `/${segments.slice(1).join("/")}` : "") + (requestHeaders.get("x-startime-public-search") || "");
    if (match.permanent) permanentRedirect(destination);
    redirect(destination);
  }
  return <NewSiteChromeProvider value={{ ...chrome, routes }}><PageDesignScope styles={pageDesignStyles(await getDesignSettings())} routes={routes}>{children}</PageDesignScope></NewSiteChromeProvider>;
}
