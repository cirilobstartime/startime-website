import type { Locale } from "@/content/home";

export const latestNewsContent: Record<Locale, {
  hero: { label: string; title: string; body: string };
  archive: { label: string; title: string };
}> = {
  en: {
    hero: {
      label: "Latest News",
      title: "The Latest from Startime",
      body: "Stay informed about Startime’s latest announcements, partnerships, milestones, projects, and events.",
    },
    archive: { label: "Media Center", title: "Latest News" },
  },
  ar: {
    hero: {
      label: "آخر الأخبار",
      title: "أحدث أخبار ستارتايم",
      body: "تابع آخر إعلانات ستارتايم وشراكاتها وإنجازاتها ومشاريعها وفعالياتها.",
    },
    archive: { label: "المركز الإعلام", title: "آخر الأخبار" },
  },
};
