import type {
  Button,
  CardGridSection,
  Locale,
  PageSection,
  PublicPage,
} from "./types";

export const livePageTypes = [
  "home",
  "discover",
  "portfolio",
  "solutions",
  "triple-s-arena",
  "join-us",
  "contact",
] as const;

type LivePageType = (typeof livePageTypes)[number];

const media = {
  heroVideo: "/assets/video/startime-home-hero.mp4",
  heroFallback: "/assets/editorial/startime-strategic-events-hero-v2.webp",
  leadership: "/assets/editorial/startime-saudi-leadership-v2.webp",
  planning: "/assets/editorial/startime-strategic-planning-v2.webp",
  people: "/assets/editorial/startime-people-culture.png",
  collaboration: "/assets/editorial/startime-how-we-work.png",
  portfolio: "/assets/editorial/startime-strategic-events-hero-v2.webp",
  operations: "/assets/editorial/triple-s-arena-original.webp",
  tripleArena: "/assets/editorial/triple-s-arena.webp",
  journey: "/assets/editorial/startime-journey-event-production.webp",
  solutionsOperations:
    "/assets/editorial/startime-solutions-event-operations.webp",
  solutionsExperience:
    "/assets/editorial/startime-solutions-immersive-experience.webp",
  tripleCommand:
    "/assets/editorial/startime-triple-s-command-center.webp",
  careers: "/assets/editorial/startime-careers-creative-team.webp",
  contact: "/assets/editorial/startime-contact-client-relations.webp",
  partnership: "/assets/editorial/news-hosting.webp",
  ceo: "/assets/editorial/news-governance.webp",
  simf: "/assets/projects/simf.png",
  simfImage: "/assets/projects/maritime-forum-featured-v2.webp",
  blue: "/assets/projects/blue-economy-v2.webp",
  industrial: "/assets/projects/industrial-security-v2.webp",
  semiconductor: "/assets/projects/semiconductor-v2.webp",
  cities: "/assets/projects/smart-cities-v2.webp",
  mining: "/assets/projects/mining-v2.webp",
  drug: "/assets/projects/pharmaceutical-security-v2.webp",
  unmanned: "/assets/projects/unmanned-systems-v2.webp",
  ufi: "/assets/brand/ufi.svg",
};

const englishProjects = [
  {
    title: "Saudi International Maritime Forum",
    summary:
      "A sovereign platform strengthening maritime security and international naval defense cooperation.",
    logo: media.simf,
    image: media.simfImage,
    href: "https://sim.startime.sa",
    featured: true,
  },
  {
    title: "Saudi International Blue Economy Expo",
    summary:
      "Unlocking blue-economy opportunities across energy, transport, tourism, and food security.",
    logo: media.blue,
    image: media.blue,
    href: "",
  },
  {
    title: "Global Industrial Security Expo",
    summary:
      "Elevating protection standards for critical facilities and strategic infrastructure.",
    logo: media.industrial,
    image: media.industrial,
    href: "",
  },
  {
    title: "Saudi International Semiconductor Expo",
    summary:
      "Advancing semiconductor localization, high-value technology supply chains, and global investment.",
    logo: media.semiconductor,
    image: media.semiconductor,
    href: "",
  },
  {
    title: "Saudi International Urban Planning & Smart Cities Expo",
    summary:
      "Shaping smart, sustainable cities through planning, automation, and data-driven infrastructure.",
    logo: media.cities,
    image: media.cities,
    href: "",
  },
  {
    title: "Saudi International Mining Technologies Expo",
    summary:
      "Accelerating advanced mining technologies and sustainable resource development.",
    logo: media.mining,
    image: media.mining,
    href: "",
  },
  {
    title: "Saudi International Drug Security Expo",
    summary:
      "Strengthening pharmaceutical supply chains, local manufacturing, and national health security.",
    logo: media.drug,
    image: media.drug,
    href: "",
  },
  {
    title: "Saudi International Unmanned Systems Expo",
    summary:
      "Connecting autonomous systems, advanced manufacturing, AI innovation, and strategic investment.",
    logo: media.unmanned,
    image: media.unmanned,
    href: "",
  },
];

const arabicProjects = [
  {
    title: "الملتقى البحري السعودي الدولي",
    summary:
      "منصة سيادية تعزّز الأمن البحري والتعاون الدولي في القدرات الدفاعية البحرية.",
    logo: media.simf,
    image: media.simfImage,
    href: "https://sim.startime.sa/ar",
    featured: true,
  },
  {
    title: "المعرض السعودي الدولي للاقتصاد الأزرق",
    summary:
      "إطلاق فرص الاقتصاد الأزرق في الطاقة والنقل والسياحة والأمن الغذائي.",
    logo: media.blue,
    image: media.blue,
    href: "",
  },
  {
    title: "المعرض العالمي للأمن الصناعي",
    summary:
      "رفع معايير حماية المنشآت الحيوية والبنية التحتية الاستراتيجية.",
    logo: media.industrial,
    image: media.industrial,
    href: "",
  },
  {
    title: "المعرض السعودي الدولي لأشباه الموصلات",
    summary:
      "دعم توطين أشباه الموصلات وبناء سلاسل تقنية عالية القيمة وجذب الاستثمار.",
    logo: media.semiconductor,
    image: media.semiconductor,
    href: "",
  },
  {
    title: "المعرض السعودي الدولي للتخطيط الحضري وأتمتة المدن",
    summary:
      "تطوير مدن ذكية ومستدامة بالتخطيط والأتمتة والبنية التحتية القائمة على البيانات.",
    logo: media.cities,
    image: media.cities,
    href: "",
  },
  {
    title: "المعرض السعودي الدولي لتقنيات التعدين",
    summary:
      "تسريع تقنيات التعدين المتقدمة والتنمية المستدامة للموارد المعدنية.",
    logo: media.mining,
    image: media.mining,
    href: "",
  },
  {
    title: "المعرض السعودي الدولي للأمن الدوائي",
    summary:
      "تعزيز سلاسل الإمداد الدوائي والتصنيع المحلي والأمن الصحي الوطني.",
    logo: media.drug,
    image: media.drug,
    href: "",
  },
  {
    title: "المعرض السعودي الدولي للأنظمة غير المأهولة",
    summary:
      "ربط الأنظمة المستقلة والتصنيع المتقدم وابتكارات الذكاء الاصطناعي بالاستثمار.",
    logo: media.unmanned,
    image: media.unmanned,
    href: "",
  },
];

function button(
  label: string,
  href: string,
  style: Button["style"] = "primary",
): Button {
  return {
    href,
    label,
    style,
    icon: "arrow-up-right",
    openInNewTab: /^https?:\/\//.test(href),
  };
}

function projectSection(
  locale: Locale,
  order = 30,
  linkToPortfolio = false,
): PageSection {
  const ar = locale === "ar";
  return {
    blockType: "projectShowcase",
    displayOrder: order,
    visible: true,
    eyebrow: ar
      ? "نستثمر بشغف في قطاعات واعدة"
      : "WE INVEST PASSIONATELY IN HIGH-POTENTIAL SECTORS",
    heading: ar
      ? "مشاريع عملاقة تُولّد القيمة… وتُعزّز الأثر"
      : "Mega projects that generate value… and amplify impact",
    body: ar
      ? "نبتكر منصات وفعاليات استراتيجية تربط الفرص بالقطاعات الواعدة وتحوّل الرؤى إلى أثر طويل المدى."
      : "We create strategic platforms that connect opportunity with high-potential sectors and turn ambitious ideas into lasting impact.",
    ctaLabel: linkToPortfolio
      ? ar
        ? "استكشف محفظتنا"
        : "Explore our portfolio"
      : undefined,
    ctaHref: linkToPortfolio ? (ar ? "/ar/portfolio" : "/portfolio") : undefined,
    projectCtaLabel: ar ? "استكشف المنتدى" : "Explore the Forum",
    projects: ar ? arabicProjects : englishProjects,
    appearance: { backgroundColor: "#f2ede7" },
  };
}

const partnerLogos = [
  ["Ministry of Defense", "وزارة الدفاع", "/assets/partners/partner-01.png"],
  ["Royal Saudi Naval Forces", "القوات البحرية الملكية السعودية", "/assets/partners/partner-02.png"],
  ["Startime", "ستارتايم", "/assets/partners/partner-03.png"],
  ["Impact Event Production", "إمباكت لإنتاج الفعاليات", "/assets/partners/partner-04.png"],
  ["General Authority for Military Industries", "الهيئة العامة للصناعات العسكرية", "/assets/partners/partner-05.png"],
  ["Ocean Science & Technology", "علوم وتقنيات المحيطات", "/assets/partners/partner-06.png"],
  ["Defense Advancement", "ديفنس أدفانسمنت", "/assets/partners/partner-07.png"],
  ["Unmanned Systems Technology", "تقنيات الأنظمة غير المأهولة", "/assets/partners/partner-08.png"],
  ["United Advisory Chambers", "الغرف الاستشارية المتحدة", "/assets/partners/partner-09.png"],
  ["Navantia", "نافانتيا", "/assets/partners/partner-10.png"],
  ["Fincantieri Arabia", "فينكانتيري العربية", "/assets/partners/partner-11.png"],
  ["Bridge Exhibitions", "بريدج للمعارض", "/assets/partners/partner-12.png"],
  ["Leonardo", "ليوناردو", "/assets/partners/partner-13.png"],
  ["SAMI Navantia Naval Industries", "سامي نافانتيا للصناعات البحرية", "/assets/partners/partner-14.png"],
  ["Zamil and maritime industry partners", "الزامل وشركاء الصناعات البحرية", "/assets/partners/partner-15.png"],
] as const;

function page(
  locale: Locale,
  pageType: LivePageType,
  title: string,
  summary: string,
  sections: PageSection[],
): PublicPage {
  const slug = pageType === "home" ? "home" : pageType;
  const suffix = pageType === "home" ? "" : `/${pageType}`;
  const localizedPath = locale === "ar" ? `/ar${suffix}` : suffix || "/";
  return {
    pageType,
    slug,
    title,
    summary,
    sections,
    seo: {
      title: pageType === "home" ? title : `${title} | Startime`,
      description: summary,
      indexable: true,
      followLinks: true,
      includeInSitemap: true,
      structuredData: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": `https://startime.sa${localizedPath}#webpage`,
            name: title,
            description: summary,
            inLanguage: locale === "ar" ? "ar-SA" : "en-SA",
            url: `https://startime.sa${localizedPath}`,
            isPartOf: {
              "@type": "WebSite",
              "@id": "https://startime.sa/#website",
              name: "Startime",
              url: "https://startime.sa/",
            },
          },
        ],
      },
    },
  };
}

function home(locale: Locale): PublicPage {
  const ar = locale === "ar";
  return page(
    locale,
    "home",
    ar
      ? "ستار تايم | شركة تنظيم فعاليات ومعارض في السعودية"
      : "Startime Event and Exhibition Management Company in Saudi Arabia",
    ar
      ? "شركة ستار تايم الرائدة في تنظيم الفعاليات والمعارض والمؤتمرات السيادية والدولية في المملكة العربية السعودية. حلول إدارة مشاريع ذكية وفق أعلى المعايير العالمية."
      : "Startime is a leading company specializing in organizing events, exhibitions, and sovereign and international conferences in the Kingdom of Saudi Arabia. Smart project management solutions aligned with the highest international standards.",
    [
      {
        blockType: "hero",
        displayOrder: 10,
        visible: true,
        internalLabel: "Homepage video hero",
        eyebrow: ar ? "حدث رئيسي لستارتايم" : "A STARTIME FLAGSHIP EVENT",
        heading: ar
          ? "الملتقى البحري السعودي الدولي الرابع"
          : "The Fourth Saudi International Maritime Forum",
        body: ar
          ? "منصة سعودية عالمية للحوار والتعاون في مستقبل أمن الطاقة والتجارة والبيانات عبر البحار"
          : "A Saudi global platform for dialogue and cooperation on the future of maritime energy security, trade resilience, and data flows across the seas.",
        media: media.heroVideo,
        mobileMedia: media.heroFallback,
        buttons: [
          button(ar ? "المزيد" : "Learn More", ar ? "https://sim.startime.sa/ar" : "https://sim.startime.sa"),
          button(ar ? "تواصل معنا" : "Contact Us", ar ? "/ar/contact" : "/contact", "outline"),
        ],
        eventDetails: [
          { label: ar ? "التاريخ" : "Date", value: ar ? "23–25 نوفمبر 2026" : "23–25 November 2026" },
          {
            label: ar ? "الموقع" : "Location",
            value: ar
              ? "فندق ومركز مؤتمرات سوفيتيل | الرياض، المملكة العربية السعودية"
              : "Sofitel Riyadh Hotel & Convention Center | Riyadh, Kingdom of Saudi Arabia",
          },
        ],
      },
      {
        blockType: "credibility",
        displayOrder: 20,
        visible: true,
        label: ar ? "نفخر بعضويتنا في" : "A proud member of",
        media: media.ufi,
        logos: [
          { logo: media.ufi },
          { logo: "/assets/brand/ufi-iaee.svg" },
        ],
      },
      {
        blockType: "logoMarquee",
        displayOrder: 25,
        visible: true,
        internalLabel: "Homepage partners marquee",
        heading: ar ? "شركاؤنا في صناعة الأثر" : "Our partners in creating impact",
        body: ar
          ? "تتسع شبكة شراكاتنا مع جهات وطنية ودولية تجمعنا بها رؤية مشتركة لصناعة قيمة مستدامة."
          : "Our network brings together national and international organizations with a shared commitment to lasting value.",
        speed: "slow",
        logos: partnerLogos.map(([altEn, altAr, logo]) => ({
          alt: ar ? altAr : altEn,
          logo,
          visible: true,
        })),
        appearance: {
          theme: "dark",
          spacing: "standard",
          backgroundColor: "#0d0924",
        },
      },
      projectSection(locale, 30, true),
      {
        blockType: "mediaFeature",
        displayOrder: 40,
        visible: true,
        eyebrow: ar ? "نظام ستارتايم الذكي" : "TRIPLE S ARENA",
        heading: ar ? "ساحة التشغيل الرقمية" : "Triple S Arena",
        body: ar
          ? "من الابتكار إلى الإغلاق، تُدار مشاريعنا بمنهجية تنبض بالهوية السعودية وتُنفذ بمعايير عالمية صارمة، مستندين إلى منظومتنا الذكية التي تُؤتمت فيها كل خطوة وتُحكم فيها الجودة وتُصان فيها الموثوقية."
          : "From innovation to closure, our projects are managed through a methodology rooted in Saudi identity and executed with uncompromising global standards, powered by an intelligent ecosystem where every step is automated, quality is enforced, and reliability is preserved.",
        media: media.operations,
        mediaPosition: "start",
        theme: "light",
        appearance: { backgroundColor: "#eef0f4" },
        ctaLabel: ar ? "تعرف على المزيد" : "Learn More",
        ctaHref: ar ? "/ar/triple-s-arena" : "/triple-s-arena",
      },
      {
        blockType: "imageStory",
        displayOrder: 50,
        visible: true,
        eyebrow: ar ? "طريقة عملنا" : "HOW WE WORK",
        heading: ar
          ? "تنمو أعمالنا باتخاذ نهج التعاون واستدامة الشراكات"
          : "A work environment pulsating with passion, creating impact",
        body: ar
          ? "يومًا بعد يوم، تنمو شبكة شركائنا التي نعتز بها، وهذا ما يدفعنا دومًا للعمل معهم جنبًا إلى جنب لقيادة التأثير والإلهام في مجتمعات الأعمال."
          : "Our growth is driven by collaboration and sustainable partnerships. Day after day, our valued network continues to grow, fueling our commitment to work side by side in shaping impact and inspiring business communities.",
        images: [{ media: media.collaboration, caption: ar ? "نعمل معًا لصناعة الأثر" : "Working together to shape impact" }],
        ctaLabel: ar ? "تواصل معنا" : "Contact Us",
        ctaHref: ar ? "/ar/contact" : "/contact",
      },
      {
        blockType: "mediaFeature",
        displayOrder: 60,
        visible: true,
        eyebrow: ar ? "فريقنا" : "OUR TEAM",
        heading: ar
          ? "بيئة عمل تنبض بالشغف… وتصنع الأثر"
          : "A workplace driven by passion… and built to create impact",
        body: ar
          ? "نهيئ بيئة عمل تُلهم الإبداع وتحتضن المواهب وتدفعها للتميز؛ نعمل كفريق واحد بروح مشتركة ونؤمن بالتعاون ونحتفي بالإنجاز ونمنح كل فرد مساحة لينمو ويقود أثره. نبحث دائمًا عن أشخاص يشبهون طموحنا ويضيفون إلى رحلتنا."
          : "We cultivate a work environment that inspires creativity, embraces talent, and empowers every individual to excel. We operate as one team, celebrate achievement, and give each member room to grow and lead their own impact.",
        media: media.people,
        mediaPosition: "end",
        theme: "light",
        appearance: { backgroundColor: "#f8f6fa" },
        ctaLabel: ar ? "انضم إلينا" : "Join Us",
        ctaHref: ar ? "/ar/join-us" : "/join-us",
      },
    ],
  );
}

const discoverGovernanceIcons = [
  "/assets/icons/discover-governance/organizational-strength.svg",
  "/assets/icons/discover-governance/operational-risk-management.svg",
  "/assets/icons/discover-governance/decision-making-excellence.svg",
  "/assets/icons/discover-governance/stakeholder-transparency.svg",
  "/assets/icons/discover-governance/national-international-compliance.svg",
  "/assets/icons/discover-governance/experience-impact-governance.svg",
  "/assets/icons/discover-governance/effective-corporate-communication.svg",
  "/assets/icons/discover-governance/internal-accountability-transparency.svg",
] as const;

const discoverGovernance: Record<Locale, CardGridSection["cards"]> = {
  en: [
    ["Organizational Strength", "Operational cycles built on experience and a clear organizational structure that ensures workflow efficiency and decision consistency across all levels."],
    ["Operational Risk Management", "A proactive methodology to anticipate, assess, manage, and mitigate risks before they impact project quality or outcomes."],
    ["Decision-Making Excellence", "An active Board of Directors supported by data-driven insights and a strategic vision that enhances performance reliability and ensures goal achievement."],
    ["Stakeholder Transparency", "Clear and consistent communication that strengthens trust and builds long-term partnerships with all stakeholders and collaborators."],
    ["National & International Compliance", "Professional memberships, certifications, and strict adherence to local regulations and global standards in the business events sector."],
    ["Experience & Impact Governance", "Precise management of every experience, automated through intelligent systems and documented to ensure balanced, measurable, and inspiring impact."],
    ["Effective Corporate Communication", "Internal and external communication channels that reinforce message clarity and unify the organization’s voice across all interactions."],
    ["Internal Accountability & Transparency", "A high-performance oversight system that ensures clear responsibilities and elevates operational efficiency across all departments and levels."],
  ].map(([title, body], index) => ({
    title,
    body,
    iconMedia: discoverGovernanceIcons[index],
  })),
  ar: [
    ["متانة البنية المؤسسية", "دورات تشغيلية مبنية على التجربة وهيكل تنظيمي واضح يضمن انسيابية العمل واتساق القرارات عبر جميع المستويات."],
    ["إدارة المخاطر التشغيلية", "منهجية استباقية للتنبؤ بالمخاطر بجميع فئاتها ورصدها وإدارتها ومعالجتها قبل التأثير على جودة المخرجات والمشاريع."],
    ["جودة اتخاذ القرارات", "مجلس مديرين فاعل وقرارات مبنية على بيانات دقيقة ورؤية استراتيجية تعزز موثوقية الأداء وتضمن تحقيق الأهداف."],
    ["شفافية مع أصحاب المصلحة", "تواصل واضح ومتسق يعزز الثقة ويضمن شراكات طويلة الأمد مع جميع أصحاب المصلحة والمتعاملين."],
    ["الامتثال الوطني والدولي", "عضويات وشهادات احتراف والتزام صارم بالأنظمة المحلية والمعايير العالمية في قطاع فعاليات الأعمال."],
    ["حوكمة التجارب والتأثير", "إدارة دقيقة لكل تجربة وأتمتة عملياتها عبر أنظمة ذكية وتوثيقها لضمان أثر متوازن ومحسوب ومُلهم."],
    ["اتصال مؤسسي فعال", "قنوات اتصال داخلية وخارجية تدعم وضوح الرسالة وتوحد لغة التواصل والتنسيق مع البيئة الخارجية."],
    ["مساءلة وشفافية داخلية", "نظام رقابي عالي الأداء يضمن وضوح المسؤوليات ورفع كفاءة الأداء عبر جميع المستويات والدوائر التشغيلية."],
  ].map(([title, body], index) => ({
    title,
    body,
    iconMedia: discoverGovernanceIcons[index],
  })),
};

function discover(locale: Locale): PublicPage {
  const ar = locale === "ar";
  return page(
    locale,
    "discover",
    ar ? "اكتشف ستارتايم" : "Discover Startime",
    ar
      ? "بتجربتنا العريقة نستشرف المستقبل ونصنع أثرًا سعوديًا بمعايير عالمية."
      : "With rich experience, Startime looks ahead and creates Saudi impact to global standards.",
    [
      {
        blockType: "hero",
        displayOrder: 10,
        visible: true,
        eyebrow: ar ? "ستارتايم" : "STARTIME",
        heading: ar ? "بتجربتنا العريقة نستشرف المستقبل" : "With Our Rich Experience, We Envision the Future",
        body: ar
          ? "ستارتايم لم تولد من فراغ، بل انطلقت من رؤية واعية وعزم مستمد من قيادة رشيدة لتعيد تعريف صناعة اجتماعات الأعمال في المملكة وترسخ مكانتها عالميًا."
          : "Startime was not born by chance. It rose from a conscious vision and a will inspired by wise leadership to redefine the MICE sector in Saudi Arabia and solidify its global standing.",
        media: media.heroVideo,
        mobileMedia: media.heroFallback,
        mediaType: "video",
        heroHeight: "viewport",
      },
      {
        blockType: "mediaFeature",
        displayOrder: 20,
        visible: true,
        eyebrow: ar ? "رحلتنا" : "OUR JOURNEY",
        heading: ar ? "بدأت رحلتنا في 2009" : "Our Journey Began in 2009",
        body: ar
          ? "كمنشأة سعودية واعدة تعمل في قطاع صناعة اجتماعات الأعمال، استمرينا في النمو السوقي والتوسع الخدمي سعيًا إلى تمكين شركائنا من الحكومات ومنشآت القطاع الخاص والقطاع غير الربحي رياديًا."
          : "As a promising Saudi enterprise in the MICE sector, we have continuously grown and expanded our services. Our mission is to empower partners across government, private, and non-profit sectors to achieve leadership.",
        media: media.journey,
        mediaPosition: "end",
        theme: "light",
        appearance: { backgroundColor: "#ffffff" },
      },
      {
        blockType: "timeline",
        displayOrder: 30,
        visible: true,
        eyebrow: ar ? "إرث متجدد" : "A RENEWED LEGACY",
        heading: ar ? "محطات صنعت رحلتنا" : "Milestones That Shaped Our Journey",
        body: ar ? "طموحنا يُدار بزمن محسوب." : "Our ambition is managed within a calculated timeframe.",
        steps: (ar
          ? [
              ["2009", "من أرض نجد… بدأت الحكاية", "تأسست ستارتايم برؤية سعودية أصيلة، لتعيد تعريف صناعة اجتماعات الأعمال."],
              ["2014", "بناء الشراكات التي تُوقّع على المستقبل", "وسعنا حضورنا عبر بناء شراكات واعدة رسخت مكانتنا بالسوق السعودي."],
              ["2019", "مواكبة التحول الوطني", "انطلقنا بخطى ثابتة نحو صناعة وتطوير أحداث مبتكرة تدعم رؤية السعودية 2030."],
              ["2024", "نضج استراتيجي وتكامل مؤسسي", "حوكمنا عملياتنا التشغيلية وأصبحنا أكثر استعدادًا لتوسيع الأثر المحلي والدولي."],
              ["2025", "إطلاق محافظ ستارتايم الاستثمارية", "+30 مشروعًا نوعيًا عبر خمسة مسارات استراتيجية تعكس طموح المملكة."],
            ]
          : [
              ["2009", "From the Heart of Najd… Our Story Began", "Startime was founded with an authentic Saudi vision, redefining the business events industry from its very first step."],
              ["2014", "Building Partnerships That Shape the Future", "We expanded our presence by forging promising partnerships that strengthened our position in the Saudi market."],
              ["2019", "Aligning with the National Transformation", "We advanced with confidence, creating and developing innovative events that support Saudi Vision 2030."],
              ["2024", "Strategic Maturity & Institutional Integration", "We enhanced our operational governance, becoming fully prepared to expand our impact locally and globally."],
              ["2025", "Launching Startime’s Investment Portfolios", "More than 30 high-impact events across five strategic tracks, each reflecting Saudi ambition."],
            ]).map(([label, title, body]) => ({ label, title, body })),
        appearance: {
          theme: "light",
          spacing: "standard",
          backgroundColor: "#eee8e1",
        },
      },
      {
        blockType: "mediaFeature",
        displayOrder: 40,
        visible: true,
        eyebrow: ar ? "طموحنا" : "OUR AMBITION",
        heading: ar ? "طموحنا يُدار بزمن محسوب" : "Our Ambition is Guided by Precise Timing",
        body: ar
          ? "نبدع في صناعة وإدارة أحداث مبتكرة تجسد ثقافتنا وتلهم مجتمعاتنا وتُوقع على أثر لا يُضاهى. نمضي بخطى ثابتة نحو قيادة سوق اجتماعات الأعمال في المملكة والارتقاء إلى مصاف صناع الأحداث عالميًا بحلول 2030."
          : "We master the art of producing and managing innovative events that embody our culture, inspire our communities, and leave enduring impact. We move with a clear vision to lead Saudi Arabia’s MICE industry and stand among the world’s key event creators by 2030.",
        media: media.planning,
        mediaPosition: "start",
        theme: "dark",
        appearance: { backgroundColor: "#30263d" },
      },
      {
        blockType: "cardGrid",
        displayOrder: 50,
        visible: true,
        eyebrow: ar ? "الحوكمة" : "GOVERNANCE",
        heading: ar ? "منظومة مؤسسية تصون الجودة والأثر" : "An Institutional System That Protects Quality and Impact",
        cards: discoverGovernance[locale],
        layout: "icons",
        appearance: {
          theme: "light",
          spacing: "standard",
          backgroundColor: "#f8f6fa",
        },
      },
      {
        blockType: "callToAction",
        displayOrder: 60,
        visible: true,
        eyebrow: ar ? "كلمة الرئيس التنفيذي" : "A WORD FROM THE CEO",
        heading: ar ? "المسؤولية تصنع المستقبل" : "Responsibility Shapes the Future",
        body: ar
          ? "يتحتم علينا أن نكون بقدر كافٍ من المسؤولية، وأن نضاعف جهودنا ونسابق الخطى جنبًا إلى جنب مع شركائنا لدعم النهضة الاقتصادية والاجتماعية الشاملة والمستدامة التي أحدثتها قيادتنا الملهمة. — شايع القحطاني، المؤسس والرئيس التنفيذي"
          : "We must embrace a profound sense of responsibility, amplify our efforts, and move in step with our partners to support the comprehensive and sustainable economic and social renaissance driven by our inspiring leadership. — Shaya Al-Qahtani, Founder & CEO",
        media: media.ceo,
        appearance: {
          theme: "brand",
          spacing: "large",
          backgroundColor: "#5b4280",
        },
      },
    ],
  );
}

function portfolio(locale: Locale): PublicPage {
  const ar = locale === "ar";
  const strategicTracks: CardGridSection = {
    blockType: "cardGrid",
    displayOrder: 20,
    visible: true,
    eyebrow: ar ? "مساراتنا الاستراتيجية" : "STRATEGIC TRACKS",
    heading: ar
      ? "نتمحور سوقيًا حول خمس مسارات"
      : "We Are Positioned Around Five Strategic Tracks",
    cards: (ar
      ? [
          ["الأمن الوطني", "shield"],
          ["القدرات الدفاعية", "anchor"],
          ["القضايا البيئية", "mountains"],
          ["التقنيات المتقدمة", "circuitry"],
          ["تمكين المرأة", "users"],
        ]
      : [
          ["National Security", "shield"],
          ["Defense Capabilities", "anchor"],
          ["Environmental Priorities", "mountains"],
          ["Advanced Technologies", "circuitry"],
          ["Women Empowerment", "users"],
        ]).map(([title, icon]) => ({ title, icon })),
    layout: "tracks",
    appearance: {
      theme: "dark",
      spacing: "standard",
      backgroundColor: "#111019",
      overlayOpacity: 42,
    },
  };
  const focusCards = ar
    ? [
        ["دعم مستهدفات رؤية السعودية 2030", "نُسهم في تحويل مستهدفات الرؤية إلى مبادرات واقعية تُعزز الاقتصاد الوطني وتدعم التحول الشامل."],
        ["تعزيز المحتوى المحلي وتنمية القدرات الوطنية", "نرفع القيمة المحلية عبر مشاريع تُنمّي الكفاءات السعودية وتُعزز الاعتماد على القدرات الوطنية في مختلف القطاعات."],
        ["توطين الصناعات والتقنيات المتقدمة", "نُهيّئ منصات تُسهم في نقل المعرفة وتوطين التقنيات الحديثة، بما يدعم الصناعات الوطنية ويُعزز جاهزيتها المستقبلية."],
        ["تعزيز تنافسية قطاع اجتماعات الأعمال عالميًا", "نُعيد تشكيل مكانة المملكة في قطاع MICE بإطلاق تجارب بمعايير عالمية وهوية سعودية أصيلة تُنافس دوليًا."],
        ["دعم التزام المملكة بالقضايا العالمية", "نُبرز دور السعودية في معالجة التحديات الدولية مثل المناخ، والصحة، والأمن الغذائي، والاستدامة، بما يعكس مسؤوليتها العالمية."],
        ["جذب الاستثمار الأجنبي المباشر", "نُنشئ منصات نوعية تُعرّف المستثمرين العالميين بفرص النمو في المملكة وتُسهم في تعزيز تدفق الاستثمارات الأجنبية."],
        ["تمكين المرأة وتنمية الأجيال", "نُعزز مشاركة المرأة في قيادة المجتمعات ونعزز صحتها المهنية وندعم ريادتها للأعمال، ونسهم أيضًا في تنمية الطفل ورفع جودة حياة الأسرة."],
        ["تحسين جودة الحياة في المملكة", "نُقدم فعاليات تُسهم في تعزيز الرفاه المجتمعي، والصحة العامة، والأنشطة الثقافية والترفيهية التي تدعم نمط حياة متوازن."],
        ["دعم الاقتصاد الإبداعي والصناعات الثقافية", "نُسهم في نمو الصناعات الإبداعية عبر تجارب تُبرز الهوية السعودية وتُعزز الاقتصاد الثقافي الوطني."],
        ["تعزيز القوة الناعمة للمملكة عالميًا", "نُظهر صورة السعودية الحديثة عبر فعاليات دولية تُعزز حضورها وتأثيرها العالمي في الثقافة والابتكار والدبلوماسية المجتمعية."],
        ["دعم الابتكار وريادة الأعمال", "نُحفّز منظومة الابتكار عبر منصات تُبرز المشاريع الريادية وتُسهم في بناء اقتصاد معرفي متقدم."],
      ]
    : [
        ["Supporting Saudi Vision 2030 Objectives", "We help translate the Saudi Vision ambitions into tangible initiatives that strengthen the national economy and accelerate comprehensive transformation."],
        ["Enhancing Local Content & Developing National Capabilities", "We elevate local value through projects that build Saudi talent and reinforce reliance on national capabilities across key sectors."],
        ["Localizing Industries & Advanced Technologies", "We create platforms that enable knowledge transfer and technology localization, empowering national industries and enhancing their future readiness."],
        ["Advancing the Global Competitiveness of Saudi MICE", "We redefine the Kingdom’s position in the MICE sector by delivering world-class experiences rooted in an authentic Saudi identity."],
        ["Supporting the Kingdom’s Commitment to Global Issues", "We highlight Saudi Arabia’s leadership in addressing global challenges such as climate, health, food security, and sustainability."],
        ["Attracting Foreign Direct Investment (FDI)", "We develop strategic platforms that introduce global investors to high-growth opportunities in the Kingdom and strengthen FDI inflows."],
        ["Empowering Women & Developing Future Generations", "We elevate women’s participation in leadership, health, professional growth, and entrepreneurship, while supporting child development and enhancing family quality of life."],
        ["Enhancing Quality of Life in the Saudi Arabia", "We deliver experiences that promote community well-being, public health, and cultural and recreational engagement that support a balanced lifestyle."],
        ["Supporting the Creative Economy & Cultural Industries", "We contribute to the growth of creative industries through experiences that showcase Saudi identity and strengthen the national cultural economy."],
        ["Strengthening the Saudi Arabia Soft Power Globally", "We project the modern image of Saudi Arabia through international events that enhance its global presence and influence in culture, innovation, and societal diplomacy."],
        ["Advancing Innovation & Entrepreneurship", "We stimulate the innovation ecosystem through platforms that spotlight pioneering ventures and support the development of a knowledge-based economy."],
      ];
  const focus: CardGridSection = {
    blockType: "cardGrid",
    displayOrder: 40,
    visible: true,
    eyebrow: ar ? "التركيز" : "FOCUS",
    heading: ar
      ? "نهج يُعظّم القيمة ويحقق الأثر"
      : "A Framework That Maximizes Value and Drives Impact",
    cards: focusCards.map(([title, body], index) => ({
      title,
      body,
      icon: ["compass", "users", "circuitry", "globe", "mountains", "chart", "sparkle", "heartbeat", "lightbulb", "megaphone", "gear", "buildings"][index],
    })),
    layout: "focus",
    appearance: {
      theme: "light",
      spacing: "standard",
      backgroundColor: "#f8f6fa",
    },
  };
  return page(
    locale,
    "portfolio",
    ar ? "محفظتنا" : "Our Portfolio",
    ar ? "مشاريع واستثمارات نوعية تصنع قيمة مستدامة في قطاعات واعدة." : "High-impact projects and investments creating lasting value across high-potential sectors.",
    [
      {
        blockType: "hero",
        displayOrder: 10,
        visible: true,
        eyebrow: ar ? "محفظة ستارتايم" : "STARTIME PORTFOLIO",
        heading: ar ? "نستثمر بشغف في قطاعات واعدة" : "We Invest Passionately in High-Potential Sectors",
        body: ar ? "نبتكر منصات ومشاريع عملاقة تُولّد القيمة وتُعزّز الأثر." : "We create flagship platforms and ambitious ventures that generate value and amplify impact.",
        media: media.portfolio,
      },
      strategicTracks,
      projectSection(locale, 30),
      focus,
    ],
  );
}

const solutionCards: Record<Locale, CardGridSection["cards"]> = {
  en: [
    ["We Create Events", "We do not wait for the experience; we ignite it. Every event is an extension of an authentic Saudi vision, managed with deliberate precision, executed to global standards, and sealed with enduring impact."],
    ["We Host B2B", "We pave the ground for opportunity, transform spaces into platforms of connection, and engage partners across the globe to create ventures shaped by our living identity and timeless approach."],
    ["We Organize Private Events", "We embody our partners’ aspirations and deliver high-sensitivity events with meticulous attention to detail, deep protocol understanding, and refinement that is felt, not spoken."],
    ["We Manage Community Events", "We listen to the community and design experiences as an extension of its pulse, balancing flow, structure, inspiring charm, respectful order, and memorable detail."],
    ["We Produce Events", "We build the moment with creative pulse and operational mastery, where every detail is measured, every element intentional, and every outcome signed with impact."],
  ].map(([title, body], index) => ({ title, body, icon: ["sparkle", "handshake", "shield", "users", "gear"][index] })),
  ar: [
    ["نصنع الأحداث", "لا ننتظر التجربة بل نُشعلها، ولا نكرر السوق بل نعيد تشكيله؛ فكل فعالية نصنعها امتداد لرؤية سعودية أصيلة تُدار بزمن محسوب وتُنفذ بمعايير عالمية وتُخلد أثرًا لا يُضاهى."],
    ["نستضيف الأعمال", "لا ننتظر الفرص بل نُهيئ لها الأرض، ونحوّل المساحات إلى منصات لقاء ونصمم اللحظة لبناء الشغف ونقدم التجربة باحتراف وجاذبية لصناعة أثر مستدام."],
    ["نُنظّم الأحداث الخاصة", "نتجسّد غايات شركائنا ونصمم التجارب ونُدير اللحظات بثقة واحتراف، وننفذ الفعاليات شديدة الحساسية بفهم عميق للبروتوكول وتركيز صارم على التفاصيل."],
    ["نُدير الفعاليات المجتمعية", "نُحرّك اللحظة من قلب المجتمع ونصمم التجربة امتدادًا لنبضه، بأسلوب يوازن بين الانسيابية والتنظيم وجاذبية تُلهم وانضباط يُحترم."],
    ["نُنتج الأحداث", "نحوّل التصور إلى واقع والفكرة إلى تجربة متكاملة تُدار بثقة وتُنفذ بمعايير خاصة، حيث كل مرحلة تُدار باحتراف وكل تفصيل يُنفذ بدقة."],
  ].map(([title, body], index) => ({ title, body, icon: ["sparkle", "handshake", "shield", "users", "gear"][index] })),
};

function solutions(locale: Locale): PublicPage {
  const ar = locale === "ar";
  return page(
    locale,
    "solutions",
    ar ? "حلولنا" : "Solutions",
    ar ? "حلول متكاملة تحول الرؤية إلى تجارب ونتائج وأثر مستدام." : "Integrated event solutions that transform vision into experiences, results, and lasting impact.",
    [
      {
        blockType: "hero",
        displayOrder: 10,
        visible: true,
        heading: ar ? "نلهم المجتمعات" : "Inspiring Communities",
        body: ar ? "بقيمنا التي لا نحيد عنها أبدًا قدمنا تجارب استثنائية وساهمنا بفاعلية في تمكين شركائنا لتحقيق تطلعاتهم وأهدافهم." : "Rooted in our unwavering values, we have delivered extraordinary experiences and actively empowered our partners to achieve their aspirations and goals.",
        media: media.solutionsOperations,
        eventDetails: [
          { label: ar ? "استشارات الفعاليات" : "Event Consultation", value: "500+" },
          { label: ar ? "اجتماعات الأعمال" : "B2B Meeting", value: "750+" },
          { label: ar ? "الفعاليات الدولية" : "International Events", value: "38" },
        ],
      },
      {
        blockType: "mediaFeature",
        displayOrder: 20,
        visible: true,
        eyebrow: ar ? "نتصل بالجميع" : "WE CONNECT EVERYONE",
        heading: ar ? "نهتم بشركائنا ونصنع تجارب مؤثرة" : "Meaningful Experiences That Leave a Lasting Imprint",
        body: ar ? "نهتم بشركائنا، ونصنع تجارب مؤثرة تُوقّع على ذاكرة مجتمعاتنا." : "We care deeply about our partners, creating meaningful experiences that leave a lasting imprint on our communities.",
        media: media.solutionsExperience,
        mediaPosition: "end",
        theme: "light",
        appearance: { backgroundColor: "#ffffff" },
      },
      {
        blockType: "cardGrid",
        displayOrder: 30,
        visible: true,
        eyebrow: ar ? "حلول ستارتايم" : "STARTIME SOLUTIONS",
        heading: ar ? "رؤيتنا تتحول إلى واقع" : "Turning Vision Into Reality",
        body: ar ? "تعرف على أبرز المبادرات والخدمات التي تقدمها ستارتايم لتحويل الأفكار إلى نتائج ملموسة وتحقيق أثر مستدام." : "Discover Startime’s initiatives and solutions that transform ideas into measurable impact and lasting success.",
        cards: solutionCards[locale],
        layout: "editorial",
        appearance: {
          theme: "light",
          spacing: "standard",
          backgroundColor: "#f2ede7",
        },
      },
      {
        blockType: "callToAction",
        displayOrder: 40,
        visible: true,
        heading: ar ? "ابدأ بصناعة الأثر" : "Start Turning Vision Into Impact",
        body: ar ? "تواصل مع فريق علاقات الشركاء لمناقشة الفكرة والطموح والنتائج التي تريد تحقيقها." : "Contact our corporate relations team to discuss your idea, ambition, and the outcomes you want to achieve.",
        media: media.partnership,
        buttons: [
          button(
            ar ? "تواصل معنا" : "Contact the Corporate Relations Team",
            ar ? "/ar/contact" : "/contact",
          ),
          {
            href: "/assets/downloads/startime-profile.pdf",
            icon: "download",
            label: ar ? "تحميل الملف التعريفي" : "Download the Profile",
            openInNewTab: true,
            style: "outline",
            trackingID: "solutions-profile-download",
          },
        ],
        appearance: {
          theme: "dark",
          spacing: "large",
          backgroundColor: "#30263d",
        },
      },
    ],
  );
}

function tripleSArena(locale: Locale): PublicPage {
  const ar = locale === "ar";
  return page(
    locale,
    "triple-s-arena",
    ar ? "نظام ستارتايم الذكي" : "Triple S Arena",
    ar ? "ساحة تشغيل رقمية تربط الفرق والمشاريع والموردين والعملاء في منصة ذكية واحدة." : "A digital operations arena unifying teams, projects, vendors, and clients in one intelligent platform.",
    [
      {
        blockType: "hero",
        displayOrder: 10,
        visible: true,
        eyebrow: ar ? "ساحة التشغيل الرقمية" : "THE DIGITAL OPERATIONS ARENA",
        heading: ar ? "نظام ستارتايم الذكي" : "Triple S Arena…",
        body: ar ? "نظام مؤسسي ذكي طورناه داخليًا ونعتمد عليه في تشغيل عملياتنا اليومية بسلاسة ودقة مطلقة وتحويلها إلى منظومة رقمية متكاملة." : "A fully in-house developed platform powering our daily operations with seamless precision and transforming them into an integrated digital ecosystem.",
        media: media.tripleArena,
        buttons: [button(ar ? "تسجيل الدخول" : "Login", "http://sssarena.com/odoo", "outline")],
      },
      {
        blockType: "cardGrid",
        displayOrder: 20,
        visible: true,
        heading: ar ? "منظومة واحدة لتشغيل أكثر دقة" : "One Ecosystem for More Precise Operations",
        cards: (ar
          ? [
              ["مواكبة التحول الرقمي", "تحويل العمليات التشغيلية إلى منظومة مؤتمتة بالكامل تربط كل الوحدات في منصة واحدة.", "circuitry"],
              ["خفض الأخطاء التشغيلية", "أتمتة الإجراءات وضبط الصلاحيات وتفعيل التنبيهات الذكية لضمان دقة شبه كاملة.", "check"],
              ["تطبيق مبادئ الحوكمة", "توثيق الإجراءات وإدارة الصلاحيات والموافقات الذكية لضمان الشفافية والمسؤولية.", "shield"],
              ["تحسين تجربة أصحاب المصلحة", "نظام CRM ذكي يضمن تواصلًا فعّالًا وتخصيصًا دقيقًا وتجربة سلسة لكل جهة.", "users"],
            ]
          : [
              ["Digital Transformation Alignment", "Modernizing operational workflows into a fully automated, end-to-end ecosystem that unifies all functions within a single intelligent platform.", "circuitry"],
              ["Operational Error Reduction", "Streamlining processes through automation, role-based access control, and proactive smart alerts to achieve near-zero execution errors.", "check"],
              ["Governance & Compliance Enablement", "Standardizing procedures, enforcing permission frameworks, and activating smart approval cycles to ensure transparency, accountability, and regulatory alignment.", "shield"],
              ["Enhanced Stakeholder Experience", "An intelligent, experience-driven CRM that delivers seamless communication, precise personalization, and a frictionless journey for every stakeholder.", "users"],
            ]).map(([title, body, icon]) => ({ title, body, icon })),
        buttons: [
          button(
            ar ? "عرض سياسة الأمن السيبراني" : "View Cybersecurity Policy",
            ar
              ? "/ar/triple-s-arena/cybersecurity-policy"
              : "/triple-s-arena/cybersecurity-policy",
            "outline",
          ),
        ],
        layout: "icons",
        appearance: {
          theme: "light",
          spacing: "standard",
          backgroundColor: "#eee8e1",
        },
      },
      {
        blockType: "mediaFeature",
        displayOrder: 30,
        visible: true,
        heading: ar ? "حوكمة فعّالة وتجربة سلسة لكل مستخدم" : "Robust Governance and a Consistent Experience for Every User",
        body: ar ? "تمثل المنصة ساحة تشغيل رقمي احترافية تربط فريق العمل والمشاريع والموردين والعملاء في مكان واحد، لتضمن تنفيذًا دقيقًا وحوكمة فعالة وتجربة سلسة." : "The platform unifies teams, projects, vendors, and clients in one professional digital operations arena, ensuring flawless execution, robust governance, and a smooth, consistent experience.",
        media: media.tripleCommand,
        mediaPosition: "start",
        theme: "dark",
        appearance: { backgroundColor: "#30263d" },
      },
    ],
  );
}

function joinUs(locale: Locale): PublicPage {
  const ar = locale === "ar";
  const teamCards = ar
    ? [
        ["ناصر القحطاني", "نائب الرئيس للحوكمة والمخاطر والامتثال", "نؤمن تمامًا بأهمية الاستثمار في رأس المال البشري، لذا قدمنا أنموذجًا يحتذى به في الاهتمام الكبير والاتصال الفاعل بمنسوبينا، مما جعلنا نحظى ببيئة عمل جاذبة ومحفزة.", "/assets/team/nasser-al-qahtani-transparent.png"],
        ["معتز منصور", "العضو المنتدب", "لطالما ارتبط اسم ستارتايم بكونها بيئة محفزة للإبداع والابتكار، فان انجذابي للعمل بها لم يكن محض صدفٍة، فأنا على قناعٍة راسخٍة بأنه ومن خلال ستارتايم، أستطيع ابتكار فعاليات استراتيجية تُسهم بشكل حقيقي في تحقيق رؤية السعودية 2030.", "/assets/team/mutaz-mansour-transparent.png"],
        ["خالد القحطاني", "مدير علاقات الشركاء", "إن تكليفي بقيادة الاتصال المؤسسي مع شركاء وعملاء ستارتايم منحني ثقة متجددة وحماسًا كبيرًا لصناعة علاقات استراتيجية راسخة؛ فأنا فخورة بانتمائي لهذا الكيان الملهم الذي يهتم بتقوية جسور التواصل مع شركاؤه وأصحاب المصلحة.", "/assets/team/khaled-al-qahtani-transparent.png"],
        ["زينب مديني", "رئيس دائرة الأعمال", "في ستارتايم، وجدت البيئة المثالية لتطوير أساليب العمل وتحويل الرؤى السوقية إلى فرص ملموسة؛ شغفي هنا يكمن في تقديم حلول مبتكرة تتلاقى مع سياسات الشركة الذكية التي تحفزني وتدفعني لتحقيق نتائج نوعية تواكب مستهدفات تلك الشركة الطموحة", "/assets/team/zayneb-mdini-transparent.png"],
        ["وليد رمضان", "رئيس العمليات", "لطالما كان التميّز التشغيلي هو الدافع الأكبر لي، وأؤمن بأن الأثر الحقيقي يتحقق عندما تلتقي الاستراتيجية بالتنفيذ المنضبط، فقد منحني انضمامي إلى ستارتايم منصة لتطوير الأنظمة التشغيلية وصقل الإجراءات وبناء ثقافة تجمع بين الدقة والمرونة؛ وأنا فخور بأن أكون جزءًا من كيان يضع معايير جديدة في القيادة التشغيلية.", "/assets/team/waleed-ramadan-transparent.png"],
        ["روابي الشهري", "السكرتيرة التنفيذية", "كنت دائمًا أؤمن بأن جوهر أي منظمة ناجحة يكمن في قدرتها على التنظيم والتواصل والاتساق. وفي ستارتايم، وجدت بيئة تقدّر الهيكلة والوضوح والاتصال الفاعل؛ بيئة تمكّنني من دعم القيادة بثقة والمساهمة في انسيابية العمل التشغيلي.", "/assets/team/rawabi-al-shehri-transparent.png"],
      ]
    : [
        ["Nasser Al-Qahtani", "Deputy CEO, GRC", "We firmly believe in the importance of investing in human resources; that's why we’ve set a benchmark in employee care and effective communication, earning a workplace that inspires, attracts, and empowers.", "/assets/team/nasser-al-qahtani-transparent.png"],
        ["Mutaz Mansour", "Managing Director", "Startime has always been synonymous with a creative and innovative house; my attraction to working here was no coincidence. I am deeply convinced that through Startime, I can innovate strategic events that genuinely contribute to advancing Saudi Vision 2030.", "/assets/team/mutaz-mansour-transparent.png"],
        ["Khaled Al-Qahtani", "Corporate Relations Manager", "Being entrusted with leading corporate communications for Startime partners and clients has renewed my confidence and fueled my passion for building strong, strategic relationships. I’m proud to belong to this inspiring entity, which is deeply committed to strengthening connections with its partners and stakeholders.", "/assets/team/khaled-al-qahtani-transparent.png"],
        ["Zayneb Mdini", "Business Director", "At Startime, I found the ideal environment to refine business strategies and transform market visions into tangible opportunities. My passion lies in delivering innovative solutions that align with Startime’s smart commercial policies, motivating me to achieve high-impact results that reflect its ambitious goals.", "/assets/team/zayneb-mdini-transparent.png"],
        ["Waleed Ramadan", "Operations Director", "Operational excellence has always been my driving force, and I’ve long believed that true impact is achieved when strategy meets disciplined execution. Joining Startime has given me the platform to elevate operational systems, refine processes, and build a culture where precision and agility work hand in hand.", "/assets/team/waleed-ramadan-transparent.png"],
        ["Rawabi Al-Shehri", "Executive Secretary", "I’ve always believed that the heart of any successful organization lies in its ability to stay organized, connected, and aligned. At Startime, I found a workplace that values structure, clarity, and meaningful communication—an environment that empowers me to support leadership with confidence and contribute to a seamless operational flow.", "/assets/team/rawabi-al-shehri-transparent.png"],
      ];
  return page(
    locale,
    "join-us",
    ar ? "انضم إلينا" : "Join Us",
    ar ? "كن جزءًا من عائلة استثنائية تصنع الأثر." : "Be part of an exceptional family built to create impact.",
    [
      {
        blockType: "hero",
        displayOrder: 10,
        visible: true,
        heading: ar ? "كن جزءًا من عائلة استثنائية" : "Be Part of an Exceptional Family",
        body: ar ? "نبحث عن أشخاص يشبهون طموحنا ويضيفون إلى رحلتنا." : "We are always looking for people who share our ambition and can elevate our journey.",
        media: media.careers,
        buttons: [button(ar ? "تقدم الآن" : "Apply Now", "#career-application")],
      },
      {
        blockType: "cardGrid",
        displayOrder: 20,
        visible: true,
        eyebrow: ar ? "فريق ستارتايم" : "MEET THE TEAM",
        heading: ar ? "فريق يصنع الأثر" : "The People Behind the Impact",
        body: ar
          ? "خبرات متنوعة يجمعها طموح واحد لصناعة تجارب استثنائية وأثر مستدام."
          : "Distinct expertise, united by one ambition: to create exceptional experiences and lasting impact.",
        cards: teamCards.map(([title, meta, body, media]) => ({
          title,
          meta,
          body,
          media,
        })),
        layout: "team",
        appearance: {
          theme: "light",
          spacing: "standard",
          backgroundColor: "#f8f6fa",
        },
      },
      {
        blockType: "form",
        anchorID: "career-application",
        displayOrder: 30,
        visible: true,
        eyebrow: ar ? "انضم إلينا" : "JOIN US",
        heading: ar ? "ابدأ رحلتك مع ستارتايم" : "Start Your Journey With Startime",
        body: ar ? "عرّفنا بنفسك وخبراتك والمجال الذي ترغب في تطويره معنا." : "Tell us about yourself, your experience, and the kind of work you want to develop with us.",
        form: "careers",
        privacyNote: ar ? "نستخدم بياناتك فقط لمراجعة طلب التوظيف والتواصل معك." : "Your information is used only to review your application and contact you.",
        successHeading: ar ? "شكرًا لتقديمك" : "Thank You for Applying",
        successMessage: ar ? "استلمنا طلبك وسيقوم فريقنا بمراجعته." : "We have received your application and our team will review it.",
        appearance: {
          theme: "light",
          spacing: "standard",
          backgroundColor: "#f2ede7",
        },
      },
    ],
  );
}

function contact(locale: Locale): PublicPage {
  const ar = locale === "ar";
  return page(
    locale,
    "contact",
    ar ? "تواصل معنا" : "Contact Us",
    ar ? "تواصل فعّال يبني علاقات مهنية قوية ومستدامة." : "Meaningful communication is the foundation of strong, lasting professional relationships.",
    [
      {
        blockType: "hero",
        displayOrder: 10,
        visible: true,
        heading: ar ? "حياكم في ستارتايم" : "Welcome to Startime",
        body: ar ? "نرحب بكم في كيان يؤمن بأن التواصل هو أساس بناء العلاقات الملهمة؛ وفريقنا هنا ليكون أقرب إليكم ويدعمكم بكل احترافية واهتمام." : "We welcome you to an entity that believes meaningful communication is the foundation of inspiring relationships. Our team is here to support you with professionalism and care.",
        media: media.contact,
      },
      {
        blockType: "form",
        displayOrder: 20,
        visible: true,
        eyebrow: ar ? "تواصل معنا" : "CONTACT US",
        heading: ar ? "يسعدنا استقبال استفساراتكم" : "We Are Pleased to Receive Your Enquiry",
        body: ar ? "سيقوم فريقنا بالرد عليكم خلال أقرب وقت ممكن. نؤمن بأن التواصل الفعّال أساس بناء علاقات مهنية قوية، ونحرص على تقديم تجربة سلسة وواضحة لكل من يتواصل معنا." : "Our team will respond as soon as possible. We believe effective communication is the foundation of strong professional relationships and are committed to a smooth, clear experience for everyone who contacts us.",
        form: "contact",
        privacyNote: ar ? "تُستخدم بياناتك للرد على استفسارك فقط." : "Your information is used only to respond to your enquiry.",
        successHeading: ar ? "وصلتنا رسالتك" : "Your Message Has Been Received",
        successMessage: ar ? "شكرًا لتواصلك. سيقوم الفريق المختص بالرد عليك قريبًا." : "Thank you for contacting Startime. The relevant team will respond shortly.",
        appearance: {
          theme: "light",
          spacing: "standard",
          backgroundColor: "#ffffff",
        },
      },
      {
        blockType: "cardGrid",
        displayOrder: 30,
        visible: true,
        heading: ar ? "المقر الرئيسي — الرياض" : "Headquarters — Riyadh, Saudi Arabia",
        body: ar ? "نرحب بزيارتكم خلال أوقات العمل الرسمية: الأحد إلى الخميس، 9:00 صباحًا حتى 5:00 مساءً." : "We welcome your visit during official working hours: Sunday to Thursday, 9:00 AM to 5:00 PM.",
        cards: [
          { title: ar ? "البريد الإلكتروني" : "Email", body: "info@startime.sa", icon: "megaphone" },
          { title: ar ? "الهاتف" : "Phone", body: "920010500", icon: "users" },
          { title: ar ? "العنوان" : "Address", body: ar ? "3507 الرياض 12341، المملكة العربية السعودية" : "3507, Riyadh 12341, Saudi Arabia", icon: "buildings" },
          { title: ar ? "أوقات العمل" : "Working Hours", body: ar ? "الأحد — الخميس | 9:00 ص — 5:00 م" : "Sunday — Thursday | 9:00 AM — 5:00 PM", icon: "calendar" },
        ],
        layout: "proof",
        appearance: {
          theme: "dark",
          spacing: "standard",
          backgroundColor: "#30263d",
        },
      },
      {
        blockType: "map",
        displayOrder: 40,
        visible: true,
        eyebrow: ar ? "موقعنا" : "OUR LOCATION",
        heading: ar ? "زورونا في مقر ستارتايم بالرياض" : "Visit Startime in Riyadh",
        body: ar
          ? "اعرض الموقع على الخريطة أو افتح الاتجاهات للوصول إلى مقرنا بسهولة."
          : "Explore our location on the map or open directions for an easy journey to our headquarters.",
        embedURL:
          "https://www.google.com/maps?q=STARTIME+Events%2C+Riyadh%2C+Saudi+Arabia&output=embed",
        mapTitle: ar ? "موقع ستارتايم في الرياض" : "Startime headquarters in Riyadh",
        button: {
          label: ar ? "فتح الاتجاهات" : "Open in Google Maps",
          href: "https://www.google.com/maps/place/%D8%B3%D8%AA%D8%A7%D8%B1%D8%AA%D8%A7%D9%8A%D9%85+STARTIME+Events%E2%80%AD/data=!4m2!3m1!1s0x0:0x4bc875ab3d2b6a0f?sa=X&ved=1t:2428&ictx=111",
          style: "primary",
          icon: "arrow-up-right",
          trackingID: "contact-map-directions",
          openInNewTab: true,
        },
        appearance: {
          theme: "light",
          spacing: "standard",
          backgroundColor: "#f4f3ef",
        },
      },
    ],
  );
}

const builders: Record<LivePageType, (locale: Locale) => PublicPage> = {
  home,
  discover,
  portfolio,
  solutions,
  "triple-s-arena": tripleSArena,
  "join-us": joinUs,
  contact,
};

export function getLivePage(locale: Locale, pageType = "home"): PublicPage {
  const selected = livePageTypes.includes(pageType as LivePageType)
    ? (pageType as LivePageType)
    : "home";
  return builders[selected](locale);
}
