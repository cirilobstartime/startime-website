import type { Locale, PublicPage, SiteChrome } from "./types";
import { getPdfPage } from "./pdfDefaults";
import { getLivePage, livePageTypes } from "./liveSiteDefaults";

const projectMedia = {
  simf: "/assets/projects/simf.png",
  blue: "/assets/projects/blue-economy.png",
  industrial: "/assets/projects/industrial-security.jpg",
  semiconductor: "/assets/projects/semiconductor.png",
  cities: "/assets/projects/smart-cities.png",
  mining: "/assets/projects/mining.png",
  drug: "/assets/projects/drug-security.jpg",
  unmanned: "/assets/projects/unmanned.png",
};

const english: PublicPage = {
  pageType: "home",
  slug: "",
  title: "Startime — Ultimate Impact",
  summary:
    "Startime creates and operates high-impact events, business communities, and intelligent experiences.",
  seo: {
    title: "Startime | Events, Experiences and Business Communities",
    description:
      "Startime creates high-impact events and platforms that connect people, accelerate ideas, and move industries forward.",
  },
  sections: [
    {
      blockType: "hero",
      displayOrder: 10,
      visible: true,
      internalLabel: "Flagship maritime hero",
      eyebrow: "A STARTIME FLAGSHIP EVENT",
      heading: "The Fourth Saudi International Maritime Forum",
      body: "A Saudi global platform for dialogue and cooperation on the future of maritime energy security, trade resilience, and data flows across the seas.",
      media: "/assets/editorial/maritime-hero-original.webp",
      buttons: [
        {
          label: "Learn More",
          href: "https://sim.startime.sa",
          style: "primary",
        },
        { label: "Contact Us", href: "/contact", style: "outline" },
      ],
      eventDetails: [
        { label: "Date", value: "23–25 November 2026" },
        {
          label: "Location",
          value:
            "Sofitel Riyadh Hotel & Convention Center | Riyadh, Kingdom of Saudi Arabia",
        },
      ],
    },
    {
      blockType: "credibility",
      displayOrder: 20,
      visible: true,
      label: "A proud member of",
      media: "/assets/brand/ufi.svg",
    },
    {
      blockType: "projectShowcase",
      displayOrder: 30,
      visible: true,
      eyebrow: "WHERE WE INVEST",
      heading: "Mega projects that generate value and amplify impact.",
      body: "We invest in high-potential sectors that advance Saudi ambitions and create enduring impact.",
      ctaLabel: "Explore our portfolio",
      ctaHref: "/portfolio",
      projects: [
        {
          title: "Saudi International Maritime Forum",
          summary:
            "A sovereign platform strengthening maritime security and naval defense cooperation.",
          logo: projectMedia.simf,
          image: "/assets/editorial/maritime-hero.webp",
          href: "https://sim.startime.sa",
          featured: true,
        },
        {
          title: "Saudi International Blue Economy Expo",
          summary:
            "Unlocking blue-economy opportunities across energy, transport, tourism, and food security.",
          logo: projectMedia.blue,
          href: "/portfolio",
        },
        {
          title: "Global Industrial Security Expo",
          summary:
            "Elevating protection standards for critical facilities and strategic infrastructure.",
          logo: projectMedia.industrial,
          href: "/portfolio",
        },
        {
          title: "Saudi International Semiconductor Expo",
          summary:
            "Advancing the localization of microchips, semiconductors, and high-value technology supply chains.",
          logo: projectMedia.semiconductor,
          href: "/portfolio",
        },
        {
          title: "Saudi International Urban Planning & Smart Cities Expo",
          summary:
            "Shaping connected, intelligent cities through sustainable urban innovation.",
          logo: projectMedia.cities,
          href: "/portfolio",
        },
        {
          title: "Saudi International Mining Technologies Expo",
          summary:
            "Accelerating advanced mining technologies and the sustainable value of Saudi mineral wealth.",
          logo: projectMedia.mining,
          href: "/portfolio",
        },
        {
          title: "Saudi International Drug Security Expo",
          summary:
            "Strengthening pharmaceutical supply-chain security and resilient local manufacturing.",
          logo: projectMedia.drug,
          href: "/portfolio",
        },
        {
          title: "Saudi International Unmanned Systems Expo",
          summary:
            "Uniting autonomous technologies, AI-driven systems, innovation, and advanced manufacturing.",
          logo: projectMedia.unmanned,
          href: "/portfolio",
        },
      ],
    },
    {
      blockType: "mediaFeature",
      displayOrder: 40,
      visible: true,
      eyebrow: "OUR OPERATIONS ECOSYSTEM",
      heading: "Triple S Arena",
      body: "From innovation to closure, every project is managed through a methodology rooted in Saudi identity and executed to uncompromising global standards. Our intelligent ecosystem automates every step, enforces quality, and preserves reliability.",
      media: "/assets/editorial/triple-s-arena-original.webp",
      mediaPosition: "start",
      theme: "dark",
      ctaLabel: "Discover Triple S Arena",
      ctaHref: "/triple-s-arena",
    },
    {
      blockType: "imageStory",
      displayOrder: 50,
      visible: true,
      eyebrow: "HOW WE WORK",
      heading: "A work environment pulsating with passion, creating impact.",
      body: "Our growth is driven by collaboration and sustainable partnerships. We work side by side to shape impact and inspire business communities.",
      images: [
        {
          media: "/assets/editorial/startime-how-we-work.png",
          caption: "High-impact collaboration",
        },
      ],
      ctaLabel: "Partner with us",
      ctaHref: "/contact",
    },
    {
      blockType: "mediaFeature",
      displayOrder: 60,
      visible: true,
      eyebrow: "PEOPLE & CULTURE",
      heading: "A workplace driven by passion and built to create impact.",
      body: "We cultivate a workplace that inspires creativity, embraces talent, and empowers every individual to excel, grow, and lead their own impact.",
      media: "/assets/editorial/startime-people-culture.png",
      mediaPosition: "end",
      theme: "dark",
      ctaLabel: "Join our community",
      ctaHref: "/join-us",
    },
    {
      blockType: "newsMosaic",
      displayOrder: 70,
      visible: true,
      eyebrow: "INSIGHTS & NEWS",
      heading: "Ideas shaping industries.",
      ctaLabel: "Explore all insights",
      ctaHref: "/portfolio",
      articles: [
        {
          kicker: "National ceremony",
          title: "For the Second Consecutive Year",
          media: "/assets/editorial/news-graduation.webp",
          href: "/portfolio",
        },
        {
          kicker: "Partnership",
          title: "Enduring Partnership, Renewed Trust",
          media: "/assets/editorial/news-partnership.webp",
          href: "/portfolio",
        },
        {
          kicker: "Governance",
          title: "A Transformational Leap in Corporate Governance",
          media: "/assets/editorial/news-governance.webp",
          href: "/portfolio",
        },
        {
          kicker: "Sovereign events",
          title: "Rooted in Leadership in Sovereign Event Management",
          media: "/assets/editorial/news-sovereign.webp",
          href: "/portfolio",
        },
        {
          kicker: "Partnerships",
          title: "Empowering Partners and Cementing Our Role in Hosting",
          media: "/assets/editorial/news-hosting.webp",
          href: "/portfolio",
        },
        {
          kicker: "Community",
          title: "Welcoming a Global Delegation",
          media: "/assets/editorial/news-delegation.webp",
          href: "/portfolio",
        },
      ],
    },
  ],
};

const arabic: PublicPage = {
  ...english,
  title: "ستارتايم — الأثر الأقصى",
  summary:
    "تصنع ستارتايم فعاليات مؤثرة ومجتمعات أعمال وتجارب ذكية تربط الناس وتحرك القطاعات.",
  seo: {
    title: "ستارتايم | الفعاليات والتجارب ومجتمعات الأعمال",
    description:
      "تصنع ستارتايم فعاليات ومنصات عالية الأثر تربط الناس وتسرّع الأفكار وتدفع القطاعات إلى الأمام.",
  },
  sections: [
    {
      blockType: "hero",
      displayOrder: 10,
      visible: true,
      eyebrow: "إحدى فعاليات ستارتايم الرائدة",
      heading: "الملتقى البحري الدولي السعودي الرابع",
      body: "منصة سعودية عالمية للحوار والتعاون حول مستقبل أمن الطاقة البحرية ومرونة التجارة وتدفقات البيانات عبر البحار.",
      media: "/assets/editorial/maritime-hero-original.webp",
      buttons: [
        { label: "اكتشف المزيد", href: "/ar/simf", style: "primary" },
        { label: "تواصل معنا", href: "/ar/contact", style: "outline" },
      ],
      eventDetails: [
        { label: "التاريخ", value: "23–25 نوفمبر 2026" },
        {
          label: "الموقع",
          value:
            "فندق ومركز مؤتمرات سوفيتل الرياض | الرياض، المملكة العربية السعودية",
        },
      ],
    },
    {
      blockType: "credibility",
      displayOrder: 20,
      visible: true,
      label: "عضو فخور في",
      media: "/assets/brand/ufi.svg",
    },
    {
      ...english.sections[2],
      blockType: "projectShowcase",
      eyebrow: "مجالات استثمارنا",
      heading: "مشاريع كبرى تصنع القيمة وتضاعف الأثر.",
      body: "نستثمر بشغف في القطاعات الواعدة التي تدعم طموحات المملكة وتصنع أثراً مستداماً.",
      ctaLabel: "استكشف أعمالنا",
      ctaHref: "/ar/portfolio",
      projects: [
        {
          title: "الملتقى البحري الدولي السعودي",
          summary:
            "منصة سيادية تعزز الأمن البحري والتعاون في قدرات الدفاع البحري.",
          logo: projectMedia.simf,
          image: "/assets/editorial/maritime-hero.webp",
          href: "/ar/simf",
          featured: true,
        },
        {
          title: "المعرض السعودي الدولي للاقتصاد الأزرق",
          summary:
            "إطلاق فرص الاقتصاد الأزرق في الطاقة والنقل والسياحة والأمن الغذائي.",
          logo: projectMedia.blue,
          href: "/ar/portfolio",
        },
        {
          title: "المعرض العالمي للأمن الصناعي",
          summary:
            "رفع معايير حماية المنشآت الحيوية والبنية التحتية الاستراتيجية.",
          logo: projectMedia.industrial,
          href: "/ar/portfolio",
        },
        {
          title: "المعرض السعودي الدولي لأشباه الموصلات",
          summary:
            "توطين الرقائق وأشباه الموصلات وسلاسل الإمداد التقنية عالية القيمة.",
          logo: projectMedia.semiconductor,
          href: "/ar/portfolio",
        },
        {
          title: "المعرض السعودي الدولي للتخطيط الحضري والمدن الذكية",
          summary: "بناء مدن مترابطة وذكية من خلال الابتكار الحضري المستدام.",
          logo: projectMedia.cities,
          href: "/ar/portfolio",
        },
        {
          title: "المعرض السعودي الدولي لتقنيات التعدين",
          summary:
            "تسريع تقنيات التعدين المتقدمة وتعظيم قيمة الثروات المعدنية.",
          logo: projectMedia.mining,
          href: "/ar/portfolio",
        },
        {
          title: "المعرض السعودي الدولي للأمن الدوائي",
          summary: "تعزيز أمن سلاسل الإمداد الدوائي والتصنيع المحلي المرن.",
          logo: projectMedia.drug,
          href: "/ar/portfolio",
        },
        {
          title: "المعرض السعودي الدولي للأنظمة غير المأهولة",
          summary:
            "جمع الأنظمة الذاتية والذكاء الاصطناعي والابتكار والتصنيع المتقدم.",
          logo: projectMedia.unmanned,
          href: "/ar/portfolio",
        },
      ],
    },
    {
      blockType: "mediaFeature",
      displayOrder: 40,
      visible: true,
      eyebrow: "منظومة العمليات الذكية",
      heading: "تريبل إس أرينا",
      body: "من الابتكار إلى الإغلاق، ندير مشاريعنا بمنهجية متجذرة في الهوية السعودية ومنفذة وفق أعلى المعايير العالمية، ضمن منظومة ذكية تؤتمت كل خطوة وتضمن الجودة والموثوقية.",
      media: "/assets/editorial/triple-s-arena-original.webp",
      mediaPosition: "start",
      theme: "dark",
      ctaLabel: "اكتشف تريبل إس أرينا",
      ctaHref: "/ar/triple-s-arena",
    },
    {
      blockType: "imageStory",
      displayOrder: 50,
      visible: true,
      eyebrow: "كيف نعمل",
      heading: "بيئة عمل تنبض بالشغف وتصنع الأثر.",
      body: "ننمّي أعمالنا بالتعاون والشراكات المستدامة، ونعمل جنباً إلى جنب لصناعة الأثر وإلهام مجتمعات الأعمال.",
      images: [
        {
          media: "/assets/editorial/startime-how-we-work.png",
          caption: "تعاون يصنع الأثر",
        },
      ],
      ctaLabel: "كن شريكاً لنا",
      ctaHref: "/ar/contact",
    },
    {
      blockType: "mediaFeature",
      displayOrder: 60,
      visible: true,
      eyebrow: "الأشخاص والثقافة",
      heading: "مكان عمل يقوده الشغف ويبنى لصناعة الأثر.",
      body: "نصنع بيئة تلهم الإبداع وتحتضن المواهب وتمكّن كل فرد من التميز والنمو وقيادة أثره الخاص.",
      media: "/assets/editorial/startime-people-culture.png",
      mediaPosition: "end",
      theme: "dark",
      ctaLabel: "انضم إلى مجتمعنا",
      ctaHref: "/ar/join-us",
    },
    {
      blockType: "newsMosaic",
      displayOrder: 70,
      visible: true,
      eyebrow: "الأخبار والرؤى",
      heading: "أفكار تشكل مستقبل القطاعات.",
      ctaLabel: "استكشف جميع الأخبار",
      ctaHref: "/ar/portfolio",
      articles: [
        {
          kicker: "المراسم الوطنية",
          title: "للعام الثاني على التوالي",
          media: "/assets/editorial/news-graduation.webp",
          href: "/ar/portfolio",
        },
        {
          kicker: "شراكة",
          title: "شراكة مستدامة وثقة متجددة",
          media: "/assets/editorial/news-partnership.webp",
          href: "/ar/portfolio",
        },
        {
          kicker: "الحوكمة",
          title: "نقلة نوعية في الحوكمة المؤسسية",
          media: "/assets/editorial/news-governance.webp",
          href: "/ar/portfolio",
        },
        {
          kicker: "الفعاليات السيادية",
          title: "ريادة راسخة في إدارة الفعاليات السيادية",
          media: "/assets/editorial/news-sovereign.webp",
          href: "/ar/portfolio",
        },
        {
          kicker: "الشراكات",
          title: "تمكين الشركاء وتعزيز دورنا في الاستضافة",
          media: "/assets/editorial/news-hosting.webp",
          href: "/ar/portfolio",
        },
        {
          kicker: "المجتمع",
          title: "استقبال وفد عالمي",
          media: "/assets/editorial/news-delegation.webp",
          href: "/ar/portfolio",
        },
      ],
    },
  ],
};

const chrome: Record<Locale, SiteChrome> = {
  en: {
    allowSearchIndexing: false,
    siteName: "Startime",
    defaultSEODescription:
      "Startime is a Saudi event management and business meetings agency creating high-impact conferences, exhibitions, B2B platforms, and integrated event experiences.",
    headerLogo: "/assets/brand/startime-white.svg",
    headerLogoDark: "/assets/brand/startime-dark.svg",
    footerLogo: "/assets/brand/startime-white.svg",
    navigation: [
      { label: "Home", href: "/" },
      { label: "Discover", href: "/discover" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Solutions", href: "/solutions" },
      { label: "Triple S Arena", href: "/triple-s-arena" },
      { label: "Insights", href: "/insights" },
      { label: "Join Us", href: "/join-us" },
    ],
    headerCtaLabel: "Contact Us",
    headerCtaHref: "/contact",
    footerDescription:
      "We create and organize innovative events with a visionary approach, combining creativity and integrated services to deliver impactful business meeting solutions.",
    sisterCompaniesHeading: "Our Sister Companies",
    sisterCompanies: [],
    companyHeading: "Company",
    contactHeading: "Contact",
    address: "Riyadh 12341 3507\nSaudi Arabia",
    phone: "920010500",
    email: "info@startime.sa",
    copyright: "© STARTIME Events — All Rights Reserved",
    organization: {
      name: "Startime",
      legalName: "STARTIME Events",
      alternateName: "Startime Events",
      description:
        "A Saudi event management and business meetings agency creating and operating high-impact conferences, exhibitions, B2B platforms, and integrated event experiences.",
      url: "https://startime.sa",
      logo: "/assets/brand/startime-dark.svg",
      phone: "+966920010500",
      email: "info@startime.sa",
      foundingDate: "2009",
      streetAddress: "3507",
      addressLocality: "Riyadh",
      addressRegion: "Riyadh",
      postalCode: "12341",
      addressCountry: "SA",
      keywords: [
        "event management Saudi Arabia",
        "event organization Riyadh",
        "business meetings",
        "conference production",
        "exhibition management",
        "B2B meetings",
        "corporate events",
      ],
    },
    socialLinks: [
      {
        platform: "LinkedIn",
        href: "https://sa.linkedin.com/company/startimeevents",
      },
      { platform: "X", href: "https://x.com/startimeevents" },
      {
        platform: "Instagram",
        href: "https://www.instagram.com/startimeevents/",
      },
      {
        platform: "YouTube",
        href: "https://www.youtube.com/@Startime_Events",
      },
    ],
  },
  ar: {
    allowSearchIndexing: false,
    siteName: "ستارتايم",
    defaultSEODescription:
      "ستارتايم وكالة سعودية لتنظيم وإدارة الفعاليات واجتماعات الأعمال، نصنع المؤتمرات والمعارض ومنصات الأعمال والتجارب المتكاملة عالية الأثر.",
    headerLogo: "/assets/brand/startime-white.svg",
    headerLogoDark: "/assets/brand/startime-dark.svg",
    footerLogo: "/assets/brand/startime-white.svg",
    navigation: [
      { label: "الرئيسية", href: "/ar" },
      { label: "اكتشف", href: "/ar/discover" },
      { label: "محفظتنا", href: "/ar/portfolio" },
      { label: "الحلول", href: "/ar/solutions" },
      { label: "النظام الذكي", href: "/ar/triple-s-arena" },
      { label: "الأخبار والرؤى", href: "/ar/insights" },
      { label: "انضم إلينا", href: "/ar/join-us" },
    ],
    headerCtaLabel: "تواصل معنا",
    headerCtaHref: "/ar/contact",
    footerDescription:
      "نصنع الأحداث وننظم ونستضيف فعاليات الأعمال برؤية طموحة، معتمدين الابتكار والإبداع نهجًا لتقديم حلول تصنع الأثر.",
    sisterCompaniesHeading: "شركاتنا الشقيقة",
    sisterCompanies: [],
    companyHeading: "الشركة",
    contactHeading: "التواصل",
    address: "الرياض 12341 3507\nالمملكة العربية السعودية",
    phone: "920010500",
    email: "info@startime.sa",
    copyright: "© ستارتايم للفعاليات — جميع الحقوق محفوظة",
    organization: {
      name: "ستارتايم",
      legalName: "STARTIME Events",
      alternateName: "ستارتايم للفعاليات",
      description:
        "وكالة سعودية لتنظيم وإدارة الفعاليات واجتماعات الأعمال، نصنع ونشغّل المؤتمرات والمعارض ومنصات الأعمال والتجارب المتكاملة عالية الأثر.",
      url: "https://startime.sa",
      logo: "/assets/brand/startime-dark.svg",
      phone: "+966920010500",
      email: "info@startime.sa",
      foundingDate: "2009",
      streetAddress: "3507",
      addressLocality: "الرياض",
      addressRegion: "منطقة الرياض",
      postalCode: "12341",
      addressCountry: "SA",
      keywords: [
        "تنظيم الفعاليات في السعودية",
        "إدارة الفعاليات في الرياض",
        "اجتماعات الأعمال",
        "تنظيم المؤتمرات",
        "إدارة المعارض",
        "اجتماعات الأعمال B2B",
        "فعاليات الشركات",
      ],
    },
    socialLinks: [
      {
        platform: "LinkedIn",
        href: "https://sa.linkedin.com/company/startimeevents",
      },
      { platform: "X", href: "https://x.com/startimeevents" },
      {
        platform: "Instagram",
        href: "https://www.instagram.com/startimeevents/",
      },
      {
        platform: "YouTube",
        href: "https://www.youtube.com/@Startime_Events",
      },
    ],
  },
};

export function getDefaultPage(locale: Locale, pageType = "home"): PublicPage {
  if (livePageTypes.includes(pageType as (typeof livePageTypes)[number])) {
    return getLivePage(locale, pageType);
  }
  if (
    [
      "home",
      "about",
      "events-investments",
      "solutions",
      "impact-experience",
      "simf",
      "simf-sponsor",
      "triple-s-arena",
      "insights",
      "article",
      "careers",
      "contact",
      "partner-with-us",
      "media-centre",
      "supplier-registration",
    ].includes(pageType)
  ) {
    return getPdfPage(locale, pageType);
  }
  const home = locale === "ar" ? arabic : english;
  if (pageType === "home") return home;

  const copy = structuredClone(home);
  const isArabic = locale === "ar";
  const byType: Record<
    string,
    { title: string; summary: string; sectionIndexes: number[] }
  > = {
    discover: {
      title: isArabic ? "اكتشف ستارتايم" : "Discover Startime",
      summary: isArabic
        ? "شركة سعودية تصنع منصات وفعاليات عالية الأثر وتحوّل الأفكار إلى تجارب مؤسسية استثنائية."
        : "A Saudi company creating high-impact platforms and events that turn ambitious ideas into exceptional institutional experiences.",
      sectionIndexes: [4, 5],
    },
    portfolio: {
      title: isArabic ? "أعمالنا" : "Our Portfolio",
      summary: isArabic
        ? "منصات ومشاريع نوعية تربط القطاعات الواعدة وتصنع قيمة مستدامة."
        : "Flagship platforms and ventures connecting high-potential sectors and creating lasting value.",
      sectionIndexes: [2, 6],
    },
    solutions: {
      title: isArabic ? "حلولنا" : "Our Solutions",
      summary: isArabic
        ? "من الاستراتيجية والتصميم إلى التشغيل والقياس، ندير منظومة الفعالية بالكامل."
        : "From strategy and experience design to operations and measurement, we manage the complete event ecosystem.",
      sectionIndexes: [3, 4],
    },
    "triple-s-arena": {
      title: isArabic ? "تريبل إس أرينا" : "Triple S Arena",
      summary: isArabic
        ? "منظومة تشغيل ذكية ترفع الجودة وتمنح كل مشروع إيقاعاً موحداً من الفكرة حتى الإغلاق."
        : "An intelligent operating ecosystem that raises quality and gives every project one connected rhythm from idea to closure.",
      sectionIndexes: [3, 6],
    },
    "join-us": {
      title: isArabic ? "انضم إلينا" : "Join Startime",
      summary: isArabic
        ? "بيئة عمل يقودها الشغف، تحتضن المواهب وتمكّن كل فرد من صناعة أثره."
        : "A workplace driven by passion, built to embrace talent and empower every individual to create impact.",
      sectionIndexes: [5, 4],
    },
    contact: {
      title: isArabic ? "لنصنع الأثر معاً" : "Let’s Create Impact Together",
      summary: isArabic
        ? "تواصل معنا لبدء مشروعك القادم أو استكشاف فرص الشراكة مع ستارتايم."
        : "Talk to our team about your next project or explore a partnership with Startime.",
      sectionIndexes: [4],
    },
    simf: {
      title: isArabic
        ? "الملتقى البحري السعودي الدولي"
        : "Saudi International Maritime Forum",
      summary: isArabic
        ? "منصة سعودية عالمية للحوار والتعاون حول مستقبل الأمن البحري والطاقة والتجارة."
        : "A Saudi global platform for dialogue and cooperation on the future of maritime security, energy, and trade.",
      sectionIndexes: [0, 1, 6],
    },
  };

  const preset = byType[pageType] || byType.discover;
  const hero = structuredClone(copy.sections[0]);
  if (hero.blockType === "hero") {
    hero.eyebrow = isArabic ? "ستارتايم للفعاليات" : "STARTIME EVENTS";
    hero.heading = preset.title;
    hero.body = preset.summary;
    hero.buttons = [
      {
        label: isArabic ? "تواصل معنا" : "Start a conversation",
        href: `/${locale}/contact`,
        style: "primary",
      },
    ];
  }

  return {
    ...copy,
    pageType,
    slug: pageType,
    title: preset.title,
    summary: preset.summary,
    seo: {
      title: `${preset.title} | Startime`,
      description: preset.summary,
    },
    sections: [
      hero,
      ...preset.sectionIndexes
        .filter((index) => index !== 0)
        .map((index) => structuredClone(copy.sections[index])),
    ],
  };
}

export function getDefaultChrome(locale: Locale): SiteChrome {
  return chrome[locale];
}
