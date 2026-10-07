"use client";

import Image from "next/image";
import Link from "./CmsLink";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Crosshair } from "@phosphor-icons/react/Crosshair";
import { SiteNavigationMenus } from "@/components/SiteNavigationMenus";
import { homeContent, type Locale } from "@/content/home";
import type { NewSiteCmsHome } from "@/content/newSiteCmsHome";
import { homepageItemStyle, type HomepageItemVisual } from "@/content/homepageVisual";
import { ArtDirectedImage, ArtDirectedVideo } from "@/components/ArtDirectedImage";

type Story = {
  title: string;
  description: string;
  stats: [string, string][];
  location: string;
  coordinates: string;
  map: string;
  overlayTitle?: string;
  noGlass?: boolean;
  visual?: HomepageItemVisual;
};

const mapAssets = {
  aseer: "/assets/animation-reference/map-aseer.webp",
  alula: "/assets/animation-reference/map-alula.webp",
  ahsa: "/assets/animation-reference/map-ahsa.webp",
  diriyah: "/assets/animation-reference/map-diriyah.webp",
  redSea: "/assets/animation-reference/map-red-sea.webp",
  jazan: "/assets/animation-reference/map-jazan.webp",
  jeddah: "/assets/animation-reference/map-jeddah.webp",
  qiddiya: "/assets/animation-reference/map-qiddiya.webp",
};

const liquidGlassMap = `data:image/svg+xml,${encodeURIComponent(`
  <svg viewBox="0 0 220 196.62249755859375" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#000" />
        <stop offset="100%" stop-color="red" />
      </linearGradient>
      <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#000" />
        <stop offset="100%" stop-color="blue" />
      </linearGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="5" /></filter>
    </defs>
    <rect width="220" height="196.62249755859375" fill="black" />
    <rect width="220" height="196.62249755859375" fill="url(#red)" />
    <rect width="220" height="196.62249755859375" fill="url(#blue)" style="mix-blend-mode:difference" />
    <rect x="4.9155624389648445" y="4.9155624389648445" width="210.16887512207032" height="186.79137268066407" fill="hsl(0 0% 53% / .9)" filter="url(#soft)" />
  </svg>
`)}`;

const liquidGlassMapTall = `data:image/svg+xml,${encodeURIComponent(`
  <svg viewBox="0 0 163.994140625 240" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#000" />
        <stop offset="100%" stop-color="red" />
      </linearGradient>
      <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#000" />
        <stop offset="100%" stop-color="blue" />
      </linearGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="5" /></filter>
    </defs>
    <rect width="163.994140625" height="240" fill="black" />
    <rect width="163.994140625" height="240" fill="url(#red)" />
    <rect width="163.994140625" height="240" fill="url(#blue)" style="mix-blend-mode:difference" />
    <rect x="4.099853515625" y="4.099853515625" width="155.79443359375" height="231.80029296875" fill="hsl(0 0% 53% / .9)" filter="url(#soft)" />
  </svg>
`)}`;

function LiquidGlassEffect({ brandVariant = false }: { brandVariant?: boolean }) {
  if (brandVariant) {
    return (
      <span className="animation-glass-effect animation-home-glass-effect" aria-hidden="true">
        <span className="animation-home-glass-surface" />
        <span className="animation-glass-filter-layer animation-home-glass-edge" />
      </span>
    );
  }

  return (
    <span className="animation-glass-effect" aria-hidden="true">
      <span className="animation-glass-filter-layer" />
      <span className="animation-glass-fold" />
      <span className="animation-glass-highlight-mask" />
    </span>
  );
}

const stories: Record<Locale, Story[]> = {
  en: [
    {
      title: "From Najd, Startime Began",
      description: "Since 2009, Startime has transformed Saudi ambition into platforms that connect people, ideas, and opportunity across the MICE industry.",
      stats: [["Since 2009", "A Saudi story of purposeful growth"], ["One Vision", "Impact beyond the event"]],
      location: "Najd, Saudi Arabia",
      coordinates: "Where ambition took flight",
      map: mapAssets.aseer,
    },
    {
      title: "Government Initiatives",
      description: "We identify market gaps and develop initiatives with government entities to accelerate national development goals.",
      stats: [["8", "Government initiatives"], ["Vision 2030", "Aligned with national priorities"]],
      location: "Government Portfolio",
      coordinates: "National development platforms",
      map: mapAssets.alula,
    },
    {
      title: "National Security",
      description: "We create high-level forums that bring decision-makers and specialists together to strengthen readiness and strategic dialogue.",
      stats: [["Maritime", "Security and resilience"], ["National", "Strategic collaboration"]],
      location: "Strategic Dialogue",
      coordinates: "Readiness through collaboration",
      map: mapAssets.alula,
    },
    {
      title: "Advanced Technologies",
      description: "We build platforms connecting investors, innovators, and global leaders across AI, autonomous systems, semiconductors, and emerging technologies.",
      stats: [["Future", "Focused platforms"], ["Global", "Knowledge exchange"]],
      location: "Technology & Innovation",
      coordinates: "Ideas connected to opportunity",
      map: mapAssets.ahsa,
    },
    {
      title: "Environmental Priorities",
      description: "We develop initiatives that turn environmental challenges into opportunities for collaboration, sustainable development, and long-term investment.",
      stats: [["Blue Economy", "Sustainable growth"], ["Net Zero", "Dialogue into action"]],
      location: "Sustainability",
      coordinates: "Platforms for lasting progress",
      map: mapAssets.diriyah,
    },
    {
      title: "International Trade Exhibitions",
      description: "We develop specialized exhibitions that connect global expertise with national demand and high-value investment opportunities.",
      stats: [["6", "International exhibitions"], ["B2B", "Market-building platforms"]],
      location: "Business Portfolio",
      coordinates: "Global expertise, national demand",
      map: mapAssets.redSea,
    },
    {
      title: "Community Events",
      description: "We create purpose-driven platforms for dialogue, collaboration, knowledge exchange, and meaningful social impact.",
      stats: [["10", "Community events"], ["People", "At the center of impact"]],
      location: "Community Portfolio",
      coordinates: "Purpose-driven engagement",
      map: mapAssets.redSea,
    },
    {
      title: "Strategic Partnerships",
      description: "Our growing network brings government, industry, investors, and knowledge leaders together to create sustainable value.",
      stats: [["40", "National and international partners"], ["Shared", "Ambition and expertise"]],
      location: "Partner Network",
      coordinates: "Collaboration that multiplies impact",
      map: mapAssets.jazan,
    },
    {
      title: "Investment Portfolios",
      description: "Startime invests in, develops, and manages portfolios, projects, and business platforms across the MICE industry.",
      stats: [["3", "Investment portfolios"], ["SAR 2.6+ Billion", "Investment by 2028"]],
      location: "Startime Investments",
      coordinates: "Building platforms with enduring value",
      map: mapAssets.jeddah,
    },
    {
      title: "Ultimate Impact",
      description: "Every platform is designed to advance national priorities, strengthen capabilities, and create economic, knowledge, and community impact.",
      stats: [["Vision 2030", "Purpose in every project"], ["Beyond Events", "A lasting legacy"]],
      location: "Saudi Arabia to the World",
      coordinates: "Impact that extends beyond the event",
      map: mapAssets.qiddiya,
    },
  ],
  ar: [
    {
      title: "من نجد بدأت ستارتايم",
      description: "منذ 2009، تحوّل ستارتايم الطموح السعودي إلى منصات تجمع الناس والأفكار والفرص وتعيد تعريف صناعة اجتماعات الأعمال.",
      stats: [["منذ 2009", "قصة سعودية من النمو الهادف"], ["رؤية واحدة", "أثر يتجاوز الحدث"]],
      location: "نجد، المملكة العربية السعودية",
      coordinates: "هنا انطلق الطموح",
      map: mapAssets.aseer,
    },
    {
      title: "المبادرات الحكومية",
      description: "نرصد فجوات السوق ونطوّر مبادرات بالشراكة مع الجهات الحكومية لتسريع تحقيق مستهدفات التنمية الوطنية.",
      stats: [["8", "مبادرات حكومية"], ["رؤية 2030", "منسجمة مع الأولويات الوطنية"]],
      location: "محفظة المبادرات الحكومية",
      coordinates: "منصات للتنمية الوطنية",
      map: mapAssets.alula,
    },
    {
      title: "الأمن الوطني",
      description: "نصنع ملتقيات رفيعة المستوى تجمع صناع القرار والمتخصصين لتعزيز الجاهزية وتمكين الحوار الاستراتيجي.",
      stats: [["الأمن البحري", "جاهزية ومرونة"], ["وطني", "تعاون استراتيجي"]],
      location: "الحوار الاستراتيجي",
      coordinates: "جاهزية يصنعها التعاون",
      map: mapAssets.alula,
    },
    {
      title: "التقنيات المتقدمة",
      description: "نبني منصات تربط المستثمرين والمبتكرين والقادة العالميين في الذكاء الاصطناعي والأنظمة المستقلة وأشباه الموصلات والتقنيات الناشئة.",
      stats: [["المستقبل", "منصات للقطاعات الواعدة"], ["عالمي", "تبادل المعرفة"]],
      location: "التقنية والابتكار",
      coordinates: "أفكار ترتبط بالفرص",
      map: mapAssets.ahsa,
    },
    {
      title: "الأولويات البيئية",
      description: "نطوّر مبادرات تحوّل التحديات البيئية إلى فرص للتعاون والتنمية المستدامة والاستثمار طويل الأمد.",
      stats: [["الاقتصاد الأزرق", "نمو مستدام"], ["الحياد الكربوني", "من الحوار إلى التنفيذ"]],
      location: "الاستدامة",
      coordinates: "منصات لتقدم مستدام",
      map: mapAssets.diriyah,
    },
    {
      title: "المعارض التجارية الدولية",
      description: "نطوّر معارض متخصصة تربط الخبرات العالمية بالطلب الوطني والفرص الاستثمارية النوعية.",
      stats: [["6", "معارض دولية"], ["أعمال", "منصات تصنع الأسواق"]],
      location: "محفظة الأعمال",
      coordinates: "خبرات عالمية وطلب وطني",
      map: mapAssets.redSea,
    },
    {
      title: "الفعاليات المجتمعية",
      description: "نصنع منصات هادفة للحوار والتعاون وتبادل المعرفة وتحقيق أثر اجتماعي ملموس.",
      stats: [["10", "فعاليات مجتمعية"], ["الإنسان", "محور صناعة الأثر"]],
      location: "محفظة المجتمع",
      coordinates: "تفاعل تقوده الغاية",
      map: mapAssets.redSea,
    },
    {
      title: "الشراكات الاستراتيجية",
      description: "تجمع شبكتنا المتنامية الجهات الحكومية وقطاعات الأعمال والمستثمرين وقادة المعرفة لصناعة قيمة مستدامة.",
      stats: [["40", "شريكًا محليًا ودوليًا"], ["طموح مشترك", "وخبرات متكاملة"]],
      location: "شبكة الشركاء",
      coordinates: "تعاون يضاعف الأثر",
      map: mapAssets.jazan,
    },
    {
      title: "المحافظ الاستثمارية",
      description: "تستثمر ستارتايم وتطوّر وتدير المحافظ والمشاريع ومنصات الأعمال ضمن صناعة اجتماعات الأعمال.",
      stats: [["3", "محافظ استثمارية"], ["+2.6 مليار ريال", "استثمارات بحلول 2028"]],
      location: "استثمارات ستارتايم",
      coordinates: "منصات ذات قيمة ممتدة",
      map: mapAssets.jeddah,
    },
    {
      title: "الأثر الذي لا يُضاهى",
      description: "صُممت كل منصة لدعم الأولويات الوطنية وتعزيز القدرات وصناعة أثر اقتصادي ومعرفي ومجتمعي مستدام.",
      stats: [["رؤية 2030", "غاية في كل مشروع"], ["ما بعد الحدث", "إرث ممتد"]],
      location: "من المملكة إلى العالم",
      coordinates: "أثر يتجاوز حدود الحدث",
      map: mapAssets.qiddiya,
    },
  ],
};

const homepageStoryIndexes = [0, 3, 7, 9] as const;
const homepageSceneCopy: Record<Locale, Array<Pick<Story, "overlayTitle" | "description" | "noGlass">>> = {
  en: [
    {
      overlayTitle: "From the Land of Najd, the Cradle of Pride",
      description: "A land that never bows, where determination grows, identity speaks, and every Saudi dream is signed with steadfastness and ascent.",
    },
    {
      overlayTitle: "From the Civilization of Diriyah, the Cradle of the State",
      description: "The beginning of the story and the compass of belonging. In its alleys, stories rest; on its walls, sovereignty is inscribed; and from its soil, vision grows and roots deepen.",
    },
    {
      overlayTitle: "Startime was born...",
      description: "",
      noGlass: true,
    },
    {
      overlayTitle: "And set out toward a conscious vision...",
      description: "With resolve inspired by wise leadership, to redefine the business meetings industry in the Kingdom of Saudi Arabia and establish its place globally.",
    },
  ],
  ar: [
    {
      overlayTitle: "من أرض نجد، مهد الكبرياء",
      description: "أرض لا تنحني تنبت العزم وتنطق الهوية وتوقع على كل حلم سعودي بالثبات والسمو",
    },
    {
      overlayTitle: "من حضارة الدرعية مهد الدولة",
      description: "ومطلع الحكاية وبوصلة الانتماء في أزقتها تنام الحكايات وعلى جدرانها توقع السيادة ومن ترابها تنبت الرؤية وتشتد الجذور",
    },
    {
      overlayTitle: "وُلِدَت ستارتايم ...",
      description: "",
      noGlass: true,
    },
    {
      overlayTitle: "وانطلقت نحو رؤية واعية...",
      description: "بعزم مستمد من قيادة رشيدة لتعيد تعريف صناعة اجتماعات الأعمال في المملكة العربية السعودية، وترسخ مكانتها عالميًا",
    },
  ],
};
const homepageStories: Record<Locale, Story[]> = {
  en: homepageStoryIndexes.map((index, position) => ({ ...stories.en[index], ...homepageSceneCopy.en[position] })),
  ar: homepageStoryIndexes.map((index, position) => ({ ...stories.ar[index], ...homepageSceneCopy.ar[position] })),
};

export function AnimationSection({ locale, showMap = true, homepage }: { locale: Locale; showMap?: boolean; homepage?: NewSiteCmsHome["panorama"] }) {
  const rtl = locale === "ar";
  const panoramaStartsRight = rtl || !showMap;
  const items = showMap ? stories[locale] : homepage?.scenes?.length
    ? homepage.scenes.map((scene, index) => ({ ...homepageStories[locale][index % homepageStories[locale].length], overlayTitle: scene.heading, description: scene.description, noGlass: scene.noGlass, visual: scene.visual }))
    : homepageStories[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const tabRailRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const panorama = section.querySelector<HTMLElement>(".animation-panorama-media");
      const bounds = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(.9999, Math.max(0, -bounds.top / travel));
      const panoramaTravel = Math.max(0, (panorama?.offsetWidth ?? 0) - window.innerWidth);
      section.style.setProperty("--animation-progress", String(progress));
      section.style.setProperty("--animation-shift", `${progress * panoramaTravel * (panoramaStartsRight ? 1 : -1)}px`);
      const next = Math.min(items.length - 1, Math.floor(progress * items.length));
      setActive((current) => current === next ? current : next);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    const panorama = section.querySelector<HTMLElement>(".animation-panorama-media");
    panorama?.addEventListener("load", update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      panorama?.removeEventListener("load", update);
      cancelAnimationFrame(frame);
    };
  }, [items.length, panoramaStartsRight]);

  useEffect(() => {
    const rail = tabRailRef.current;
    const tab = tabRefs.current[active];
    if (!rail || !tab || window.innerWidth > 900) return;
    const railBox = rail.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    rail.scrollTo({ left: rail.scrollLeft + tabBox.left + tabBox.width / 2 - railBox.left - railBox.width / 2, behavior: "smooth" });
  }, [active]);

  const selectStory = (index: number) => {
    setActive(index);
    const section = sectionRef.current;
    if (!section) return;
    const start = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: start + travel * (index / items.length), behavior: "smooth" });
  };

  const story = items[active];

  return (
      <section
        className={`animation-scroll ${showMap ? "" : "animation-scroll-no-map"} ${rtl ? "rtl" : "ltr"}`}
        ref={sectionRef}
        style={{
          "--animation-progress": 0,
          "--animation-scroll-height": `${(items.length + 1) * 100}svh`,
          "--animation-scroll-min": `${(items.length + 1) * 700}px`,
        } as CSSProperties}
        aria-label={rtl ? "رحلة أثر ستارتايم" : "Startime impact journey"}
      >
        <div className="animation-stage">
          <svg className="animation-liquid-filter" aria-hidden="true">
            <defs>
              <filter id="startime-home-liquid-glass" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.008 0.026" numOctaves="2" seed="19" result="liquidNoise" />
                <feGaussianBlur in="liquidNoise" stdDeviation="0.7" result="softNoise" />
                <feDisplacementMap in="SourceGraphic" in2="softNoise" scale="22" xChannelSelector="R" yChannelSelector="B" result="organicRefraction" />
                <feGaussianBlur in="organicRefraction" stdDeviation="0.3" />
              </filter>
              <filter id="startime-liquid-glass" colorInterpolationFilters="sRGB">
                <feImage href={liquidGlassMap} x="0" y="0" width="100%" height="100%" result="glassMap" />
                <feDisplacementMap in="SourceGraphic" in2="glassMap" scale="210" xChannelSelector="R" yChannelSelector="B" result="redShift" />
                <feColorMatrix in="redShift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
                <feDisplacementMap in="SourceGraphic" in2="glassMap" scale="210" xChannelSelector="R" yChannelSelector="B" result="greenShift" />
                <feColorMatrix in="greenShift" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
                <feDisplacementMap in="SourceGraphic" in2="glassMap" scale="210" xChannelSelector="R" yChannelSelector="B" result="blueShift" />
                <feColorMatrix in="blueShift" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
                <feBlend in="red" in2="green" mode="screen" result="redGreen" />
                <feBlend in="redGreen" in2="blue" mode="screen" result="refracted" />
                <feGaussianBlur in="refracted" stdDeviation="0.38" />
              </filter>
              <filter id="startime-liquid-glass-map" colorInterpolationFilters="sRGB">
                <feImage href={liquidGlassMapTall} x="0" y="0" width="100%" height="100%" result="glassMap" />
                <feDisplacementMap in="SourceGraphic" in2="glassMap" scale="210" xChannelSelector="R" yChannelSelector="B" result="redShift" />
                <feColorMatrix in="redShift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
                <feDisplacementMap in="SourceGraphic" in2="glassMap" scale="210" xChannelSelector="R" yChannelSelector="B" result="greenShift" />
                <feColorMatrix in="greenShift" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
                <feDisplacementMap in="SourceGraphic" in2="glassMap" scale="210" xChannelSelector="R" yChannelSelector="B" result="blueShift" />
                <feColorMatrix in="blueShift" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
                <feBlend in="red" in2="green" mode="screen" result="redGreen" />
                <feBlend in="redGreen" in2="blue" mode="screen" result="refracted" />
                <feGaussianBlur in="refracted" stdDeviation="0.38" />
              </filter>
            </defs>
          </svg>
          <div className="animation-panorama" aria-hidden="true">
            <ArtDirectedImage
              className="animation-panorama-media"
              images={!showMap ? homepage?.images : undefined}
              fallback={showMap ? `/assets/animation-reference/panorama-${locale}.webp` : "/assets/animation-reference/startime-home-panorama-5-optimized.webp"}
              width={showMap ? 16334 : 7009}
              height={931}
              fill={false}
              loading="lazy"
            />
            {!showMap && <ArtDirectedVideo className="animation-panorama-video" videos={homepage?.videos} />}
          </div>
          <div className="animation-stage-shade" aria-hidden="true" />

          {!showMap && story.overlayTitle ? (
            <h2
              className={`animation-home-headline ${story.noGlass ? "animation-home-headline-standalone" : ""}`}
              key={`headline-${locale}-${active}`}
              style={homepageItemStyle(story.visual)}
            >
              {story.overlayTitle}
            </h2>
          ) : null}

          {showMap && <div className="animation-mobile-tabs" role="tablist" aria-label={rtl ? "منصات ستارتايم" : "Startime platforms"} ref={tabRailRef}>
            {items.map((item, index) => (
              <button ref={(node) => { tabRefs.current[index] = node; }} type="button" role="tab" aria-selected={active === index} className={active === index ? "active" : ""} onClick={() => selectStory(index)} key={item.title}>{item.title}</button>
            ))}
          </div>}

          {(showMap || !story.noGlass) ? (
            <article className="animation-glass animation-story-card">
              <LiquidGlassEffect brandVariant={!showMap} />
              <div className="animation-story-content" key={`story-${locale}-${active}`}>
                {showMap ? <>
                  <h1>{story.title}</h1>
                  <p>{story.description}</p>
                  <div className="animation-stats">
                    {story.stats.map(([value, label]) => <div key={`${value}-${label}`}><strong>{value}</strong><span>{label}</span></div>)}
                  </div>
                </> : <p className="animation-home-copy" style={homepageItemStyle(story.visual)}>{story.description}</p>}
              </div>
            </article>
          ) : null}

          {showMap ? (
            <aside className="animation-glass animation-map-card">
              <LiquidGlassEffect />
              <span className="animation-map-focus"><Crosshair aria-hidden="true" /></span>
              <div className="animation-map-content" key={`map-${locale}-${active}`}>
                <div className="animation-map-image"><Image src={story.map} alt="" fill sizes="280px" loading="eager" /></div>
                <div className="animation-map-meta"><strong>{story.location}</strong><span dir={rtl ? "rtl" : "ltr"}>{story.coordinates}</span></div>
              </div>
            </aside>
          ) : null}

          {showMap ? (
            <div className="animation-progress" aria-hidden="true">
              <span>{String(active + 1).padStart(2, "0")}</span>
              <i><b style={{ width: `${((active + 1) / items.length) * 100}%` }} /></i>
              <span>{String(items.length).padStart(2, "0")}</span>
            </div>
          ) : null}
          {!showMap && homepage?.showSkip !== false && <a className="animation-skip" href={homepage?.skipURL || "#home2-value"}>{homepage?.skipLabel || (rtl ? "تخطي" : "Skip")}</a>}
        </div>
      </section>
  );
}

export function AnimationPage({ locale }: { locale: Locale }) {
  const rtl = locale === "ar";
  const c = homeContent[locale];
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [locale, menuOpen, rtl]);

  return (
    <main className={`animation-page ${rtl ? "rtl" : "ltr"}`}>
      <header className={`home2-header animation-header ${menuOpen ? "menu-active" : ""}`}>
        <Link className="home2-logo" href={`/${locale}`} aria-label="Startime">
          <Image src="/assets/alliance/startime-ufi.webp" alt="Startime" width={460} height={183} loading="eager" />
        </Link>
        <nav className={menuOpen ? "open" : ""}>
          <div className="nav-overlay-links">
            <SiteNavigationMenus locale={locale} labels={c.nav} darkHome onNavigate={() => setMenuOpen(false)} />
          </div>
          <div className="nav-overlay-copy"><p>{c.footerBio}</p></div>
        </nav>
        <div className="home2-header-actions">
          <Link href={`/${rtl ? "en" : "ar"}/animation`}>{rtl ? "EN" : "عربي"}</Link>
          <button type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span /><span /></button>
        </div>
      </header>
      <AnimationSection locale={locale} />
    </main>
  );
}
