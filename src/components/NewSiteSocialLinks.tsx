"use client";

import { FacebookLogo } from "@phosphor-icons/react/FacebookLogo";
import { InstagramLogo } from "@phosphor-icons/react/InstagramLogo";
import { LinkedinLogo } from "@phosphor-icons/react/LinkedinLogo";
import { ThreadsLogo } from "@phosphor-icons/react/ThreadsLogo";
import { TiktokLogo } from "@phosphor-icons/react/TiktokLogo";
import { XLogo } from "@phosphor-icons/react/XLogo";
import { YoutubeLogo } from "@phosphor-icons/react/YoutubeLogo";
import type { ChromeSocial } from "@/content/newSiteChrome";
import { useExternalLinkAttributes } from "./ExternalLinkPolicy";

const icons = { linkedin: LinkedinLogo, x: XLogo, instagram: InstagramLogo, youtube: YoutubeLogo, facebook: FacebookLogo, tiktok: TiktokLogo, threads: ThreadsLogo };

export function NewSiteSocialLinks({ links, section = "footer" }: { links: ChromeSocial[]; section?: "header" | "footer" }) {
  const attributes = useExternalLinkAttributes();
  return <>{links.map(({ platform, label, href }) => {
    const Icon = icons[platform as keyof typeof icons];
    return <a href={href} key={`${platform}-${href}`} {...attributes(href, section)} aria-label={label}>
      {Icon ? <Icon aria-hidden="true" weight="regular" /> : <span>{label}</span>}
    </a>;
  })}</>;
}
