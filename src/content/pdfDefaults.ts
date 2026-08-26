import type {
  Button,
  CallToActionSection,
  CardGridSection,
  HeroSection,
  Locale,
  NewsMosaicSection,
  PageSection,
  PublicPage,
  TimelineSection,
} from "./types";

const media = {
  hero: "/assets/editorial/startime-strategic-events-hero-v2.webp",
  eventStage: "/assets/editorial/startime-how-we-work.png",
  about: "/assets/editorial/startime-saudi-leadership-v2.webp",
  maritimePort: "/assets/editorial/startime-maritime-port-v2.webp",
  maritime: "/assets/editorial/maritime-hero.webp",
  operations: "/assets/editorial/triple-s-arena-original.webp",
  people: "/assets/editorial/startime-people-culture.png",
  partnership: "/assets/editorial/startime-strategic-planning-v2.webp",
  news: "/assets/editorial/news-delegation.webp",
  governance: "/assets/editorial/news-governance.webp",
  sovereign: "/assets/editorial/news-sovereign.webp",
  newsGraduation: "/assets/editorial/news-graduation.webp",
  newsPartnership: "/assets/editorial/news-partnership.webp",
  newsHosting: "/assets/editorial/news-hosting.webp",
  simfLogo: "/assets/simf/simf-logo.webp",
  seabedSecurity: "/assets/simf/seabed-security.webp",
  maritimeSupplyChain: "/assets/simf/maritime-supply-chain.webp",
  energySupplyChain: "/assets/simf/energy-supply-chain.webp",
  forumDialogue: "/assets/simf/forum-dialogue.png",
  fayyadhAlRuwaili: "/assets/simf/fayyadh-al-ruwaili.webp",
  fahdAlGhofaily: "/assets/simf/fahd-al-ghofaily.webp",
  mohammedAlGharibi: "/assets/simf/mohammed-al-gharibi.webp",
  tomaszSzubrycht: "/assets/simf/tomasz-szubrycht.png",
  christinaSchori: "/assets/simf/christina-schori.png",
  sugioTakahashi: "/assets/simf/sugio-takahashi.png",
};

const insightArticles: NewsMosaicSection["articles"] = [
  {
    kicker: "B2B hosting · October 2025",
    title: "As part of the B2B hosting service..",
    summary:
      "Startime hosted a high-level Russian delegation to explore opportunities across the gaming industry.",
    media: media.news,
    href: "/insights/russian-delegation-gaming-industry",
  },
  {
    kicker: "Partnership · September 2025",
    title: "Enduring Partnership, Renewed Trust",
    summary:
      "KJO extended its cultural and recreational services contract with Startime.",
    media: media.newsPartnership,
    href: "/insights/kjo-cultural-services-contract-renewal",
  },
  {
    kicker: "Governance · September 2025",
    title: "A Transformational Leap in Corporate Governance",
    summary:
      "Startime completed a strategic governance overhaul that reinforces its leadership in the business events sector.",
    media: media.governance,
    href: "/insights/corporate-governance-transformation",
  },
  {
    kicker: "Global events · September 2025",
    title:
      "Empowering its Partners and Cementing its Role in Hosting Global Events",
    summary:
      "A new international sports agreement brings a three-year Football Legends tour series to Saudi Arabia.",
    media: media.newsHosting,
    href: "/insights/football-legends-tours-agreement",
  },
  {
    kicker: "Sovereign events · July 2025",
    title: "Rooted in its leadership in sovereign event management",
    summary:
      "Startime delivered the National Defense University graduation ceremony in Riyadh.",
    media: media.sovereign,
    href: "/insights/national-defense-university-graduation",
  },
  {
    kicker: "National ceremony · June 2024",
    title: "For the Second Consecutive Year",
    summary:
      "Startime organized the graduation ceremony of King Khalid Military College officers.",
    media: media.newsGraduation,
    href: "/insights/king-khalid-military-college-graduation",
  },
];

const routes: Record<string, string> = {
  home: "",
  about: "about",
  "events-investments": "events-investments",
  solutions: "solutions",
  "impact-experience": "impact-experience",
  simf: "simf",
  "simf-sponsor": "simf/sponsor",
  "triple-s-arena": "triple-s-arena",
  insights: "insights",
  article: "insights/seabed-security-maritime-supply-chains",
  careers: "careers",
  contact: "contact",
  "partner-with-us": "partner-with-us",
  "media-centre": "media-centre",
  "supplier-registration": "supplier-registration",
};

const seoTitles: Record<string, string> = {
  home: "Startime | Strategic Events and Exhibitions Company in Saudi Arabia",
  about: "About Startime | Saudi Strategic Events and Exhibitions Company",
  "events-investments":
    "Strategic Events and Exhibition Portfolio | Startime Saudi Arabia",
  solutions: "Event Strategy, Management and Exhibition Solutions | Startime",
  "impact-experience":
    "Startime Experience and Event Case Studies | Saudi Arabia",
  "triple-s-arena": "Triple S Arena | Startime Event Operations Platform",
  insights: "Startime News, Event Insights and Industry Reports",
  careers: "Careers at Startime | Event Industry Jobs in Saudi Arabia",
  contact: "Contact Startime | Events and Exhibitions Company in Riyadh",
  "partner-with-us": "Strategic Event Partnerships | Partner With Startime",
  "media-centre":
    "Startime Media Centre | News, Press Releases and Brand Assets",
  "supplier-registration": "Register as a Startime Supplier",
};

function hero(
  heading: string,
  body: string,
  image = media.hero,
  buttons: Button[] = [
    {
      label: "Contact Startime",
      href: "/en/contact",
      style: "primary" as const,
    },
  ],
): HeroSection {
  return {
    blockType: "hero",
    displayOrder: 10,
    visible: true,
    eyebrow: "STARTIME",
    heading,
    body,
    media: image,
    buttons,
  };
}

function grid(
  heading: string,
  body: string,
  cards: CardGridSection["cards"],
  layout: CardGridSection["layout"] = "icons",
  order = 20,
): CardGridSection {
  return {
    blockType: "cardGrid",
    displayOrder: order,
    visible: true,
    heading,
    body,
    cards,
    layout,
  };
}

function timeline(
  heading: string,
  body: string,
  steps: TimelineSection["steps"],
  order = 30,
): TimelineSection {
  return {
    blockType: "timeline",
    displayOrder: order,
    visible: true,
    heading,
    body,
    steps,
    appearance: { theme: "dark", spacing: "large" },
  };
}

function cta(
  heading: string,
  body: string,
  primary: { label: string; href: string },
  secondary?: { label: string; href: string },
  order = 90,
): CallToActionSection {
  return {
    blockType: "callToAction",
    displayOrder: order,
    visible: true,
    heading,
    body,
    media: media.partnership,
    appearance: { theme: "dark", spacing: "large" },
    buttons: [
      { ...primary, style: "primary", icon: "arrow-up-right" },
      ...(secondary
        ? [{ ...secondary, style: "outline" as const, icon: "download" }]
        : []),
    ],
  };
}

function simfPage(locale: Locale): {
  title: string;
  description: string;
  sections: PageSection[];
} {
  const ar = locale === "ar";
  return {
    title: ar
      ? "المنتدى السعودي الدولي البحري"
      : "Saudi International Maritime Forum",
    description: ar
      ? "منصة سعودية دولية رفيعة المستوى لتعزيز الحوار والتعاون في الأمن البحري وحماية قاع البحار وسلاسل الإمداد."
      : "A high-level Saudi international platform advancing dialogue and cooperation in maritime security, seabed protection, and resilient supply chains.",
    sections: [
      {
        blockType: "hero",
        displayOrder: 10,
        visible: true,
        eyebrow: ar ? "برعاية صاحب السمو الملكي" : "UNDER THE PATRONAGE OF",
        heading: ar
          ? "المنتدى السعودي الدولي البحري الرابع"
          : "Fourth Saudi International Maritime Forum",
        body: ar
          ? "مستقبل أمن قاع البحار وسلاسل الإمداد البحرية في عالم يشهد تحولات حاسمة — برعاية صاحب السمو الملكي الأمير خالد بن سلمان بن عبدالعزيز آل سعود، وزير الدفاع."
          : "The Future of Seabed Security & Maritime Supply Chains in a Critically Changing World — under the patronage of His Royal Highness Prince Khalid bin Salman bin Abdulaziz Al Saud, Minister of Defense.",
        media: media.eventStage,
        buttons: [
          {
            label: ar ? "كن راعياً" : "Become a Sponsor",
            href: "/en/simf/sponsor",
            style: "primary",
            icon: "arrow-up-right",
          },
          {
            label: ar ? "استكشف البرنامج" : "Explore the Programme",
            href: "#forum-programme",
            style: "outline",
          },
        ],
        eventDetails: [
          {
            label: ar ? "التاريخ" : "Event dates",
            value: ar ? "23–25 نوفمبر 2026" : "23–25 November 2026",
          },
          {
            label: ar ? "الموقع" : "Location",
            value: ar
              ? "فندق ومركز مؤتمرات سوفيتل الرياض، المملكة العربية السعودية"
              : "Sofitel Riyadh Hotel & Convention Center, Saudi Arabia",
          },
        ],
      },
      {
        blockType: "mediaFeature",
        displayOrder: 20,
        visible: true,
        eyebrow: ar ? "منصة سعودية عالمية" : "A GLOBAL SAUDI PLATFORM",
        heading: ar
          ? "تعزيز الحوار والتعاون في الأمن البحري"
          : "Advancing Dialogue and Cooperation in Maritime Security",
        body: ar
          ? "المنتدى السعودي الدولي البحري حدث دولي رفيع المستوى يجمع القادة وكبار المسؤولين والخبراء لتبادل الرؤى والخبرات وبناء فهم عالمي مشترك لمستقبل الأمن البحري في ظل التحولات الجيوسياسية والتقنية المتسارعة. ويعكس الدور الاستراتيجي للمملكة في تعزيز الاستقرار البحري ودعم اقتصاد عالمي مستدام."
          : "The Saudi International Maritime Forum is a high-level international event that brings together leaders, senior officials, and experts to exchange insights and expertise and foster a shared global understanding of the future of maritime security amid accelerating geopolitical and technological transformations. It reflects Saudi Arabia’s strategic role in strengthening maritime stability and supporting a sustainable global economy.",
        media: media.maritimePort,
        mediaPosition: "end",
        theme: "light",
      },
      {
        ...grid(
          ar
            ? "الأمن البحري بالأرقام"
            : "The Maritime Systems the World Depends On",
          ar
            ? "حقائق توضح حجم البنية التحتية والتجارة والطاقة التي تعتمد على أمن البحار."
            : "The fourth forum focuses on the infrastructure, trade, and energy systems that make maritime security a global economic priority.",
          [
            {
              title: "1.4 Million",
              meta: ar ? "كيلومتر" : "Kilometres",
              body: ar ? "من الكابلات البحرية" : "of subsea cables",
            },
            {
              title: "USD 19 Trillion",
              meta: ar ? "سنوياً" : "Annually",
              body: ar
                ? "من المعاملات المالية المنقولة عبر البحار"
                : "in financial transactions transmitted across the seas",
            },
            {
              title: "80%",
              meta: ar ? "من السلع العالمية" : "of Global Goods",
              body: ar ? "تنقل عن طريق البحر" : "are transported by sea",
            },
            {
              title: "100 Million",
              meta: ar ? "حاوية شحن" : "Shipping Containers",
              body: ar
                ? "تمر عبر الموانئ سنوياً"
                : "move through ports annually",
            },
            {
              title: "900,000+",
              meta: ar ? "كيلومتر" : "Kilometres",
              body: ar
                ? "من خطوط الأنابيب تحت سطح البحر"
                : "of subsea pipelines worldwide",
            },
            {
              title: "400+",
              meta: ar ? "كابل بحري نشط" : "Active Subsea Cables",
              body: ar
                ? "تربط قارات العالم"
                : "connecting the world’s continents",
            },
            {
              title: "200%+",
              meta: ar
                ? "زيادة في التهديدات السيبرانية البحرية"
                : "Increase in Maritime Cyber Threats",
              body: ar
                ? "خلال الأعوام الخمسة الماضية"
                : "over the past five years",
            },
            {
              title: "300%",
              meta: ar ? "زيادة في الهجمات" : "Increase in Attacks",
              body: ar
                ? "على البنية التحتية البحرية"
                : "on maritime infrastructure",
            },
          ],
          "proof",
          30,
        ),
        eyebrow: ar ? "النسخة الرابعة" : "THE FOURTH EDITION",
        appearance: { theme: "dark", spacing: "standard" },
      },
      {
        ...grid(
          ar ? "برنامج المنتدى" : "Forum Programme",
          ar
            ? "دعم الجهود الدولية لحماية قاع البحار، ورفع كفاءة سلاسل إمداد الطاقة والتجارة، والمساهمة في الاستقرار الاقتصادي العالمي."
            : "Strengthening the maritime security ecosystem by supporting international efforts to safeguard the seabed, enhance the efficiency of energy and trade supply chains, and contribute to global economic stability.",
          [
            {
              title: ar
                ? "أمن قاع البحار والبنية التحتية الرقمية"
                : "Seabed Security and Digital Infrastructure",
              body: ar
                ? "بحث تحديات حماية الكابلات والبنية التحتية تحت سطح البحر، وتعزيز الأمن السيبراني البحري، ودور الدول في حماية الاقتصاد الرقمي العالمي."
                : "Examining the challenges of protecting subsea cables and digital infrastructure, strengthening maritime cybersecurity, and highlighting the role of nations in safeguarding the global digital economy.",
              media: media.seabedSecurity,
            },
            {
              title: ar
                ? "أمن سلاسل الإمداد البحري والبنية اللوجستية"
                : "Maritime Supply Chain Security and Logistics Infrastructure",
              body: ar
                ? "استشراف مستقبل التجارة البحرية وتعزيز مرونة سلاسل الإمداد وكفاءة الموانئ والممرات البحرية بالتقنيات المتقدمة."
                : "Exploring the future of maritime trade, strengthening supply-chain resilience, and enhancing the efficiency of ports and maritime corridors through advanced technologies.",
              media: media.maritimeSupplyChain,
            },
            {
              title: ar
                ? "أمن سلاسل إمداد الطاقة"
                : "Energy Supply Chain Security",
              body: ar
                ? "حماية منظومات الطاقة الممتدة عبر البحار، من النفط والغاز إلى البنية التحتية تحت سطح البحر والممرات الحيوية."
                : "Protecting energy systems extending across the seas, from oil and gas pipelines to subsea infrastructure, amid geopolitical threats and the critical importance of vital maritime corridors.",
              media: media.energySupplyChain,
            },
          ],
          "editorial",
          40,
        ),
        anchorID: "forum-programme",
        eyebrow: ar ? "محاور استراتيجية" : "STRATEGIC THEMES",
        appearance: { theme: "light", spacing: "large" },
      },
      {
        blockType: "mediaFeature",
        displayOrder: 45,
        visible: true,
        eyebrow: ar ? "من يشارك" : "WHO THE FORUM CONVENES",
        heading: ar
          ? "صنّاع قرار وخبرات تشغيلية وتقنية في مساحة واحدة"
          : "Decision-Makers, Operators and Technical Expertise in One Forum",
        body: ar
          ? "يجمع المنتدى القيادات البحرية والعسكرية، والجهات الحكومية، والوفود الدولية، وشركات الدفاع والأمن، ومشغلي الموانئ والخدمات اللوجستية، وقطاعات الطاقة والبنية التحتية، ومزودي التقنية والأمن السيبراني، والجامعات ومراكز البحث. صُممت هذه المنظومة لتحويل الحوار رفيع المستوى إلى معرفة وشراكات ومسارات تعاون عملية."
          : "The forum brings together naval and military leadership, government entities, international delegations, defence and security companies, port and logistics operators, energy and infrastructure organizations, technology and cybersecurity providers, universities, and research centres. This ecosystem is designed to turn high-level dialogue into knowledge, partnerships, and practical cooperation.",
        media: media.forumDialogue,
        mediaPosition: "start",
        theme: "dark",
      },
      {
        ...grid(
          ar ? "مشاركون بارزون" : "Featured Participants",
          ar
            ? "قادة وخبراء دوليون يسهمون في تشكيل مستقبل الأمن البحري."
            : "International leaders and experts shaping the future of maritime security.",
          [
            {
              title: ar
                ? "معالي الفريق الأول الركن فياض بن حامد الرويلي"
                : "H.E. General Fayyadh bin Hamed Al-Ruwaili",
              body: ar
                ? "رئيس هيئة الأركان العامة"
                : "Chief of the General Staff",
              meta: ar ? "المملكة العربية السعودية" : "Saudi Arabia",
              media: media.fayyadhAlRuwaili,
            },
            {
              title: ar
                ? "معالي الفريق الركن فهد بن عبدالله الغفيلي"
                : "H.E. Lieutenant General Fahd bin Abdullah Al-Ghofaily",
              body: ar
                ? "نائب رئيس هيئة الأركان العامة"
                : "Vice Chief of the General Staff",
              meta: ar ? "المملكة العربية السعودية" : "Saudi Arabia",
              media: media.fahdAlGhofaily,
            },
            {
              title: ar
                ? "معالي الفريق الركن البحري محمد بن عبدالرحمن الغريبي"
                : "H.E. Lieutenant General Mohammed bin Abdulrahman Al-Gharibi",
              body: ar
                ? "رئيس أركان القوات البحرية الملكية السعودية"
                : "Chief of Staff of the Royal Saudi Naval Forces",
              meta: ar ? "المملكة العربية السعودية" : "Saudi Arabia",
              media: media.mohammedAlGharibi,
            },
            {
              title: "Rear Admiral Prof. Tomasz Ryszard Szubrycht",
              body: ar
                ? "قائد الأكاديمية البحرية البولندية"
                : "Commandant, Polish Naval Academy",
              meta: ar ? "بولندا" : "Poland",
              media: media.tomaszSzubrycht,
            },
            {
              title: "Dr. Christina Schori Liang",
              body: ar
                ? "خبيرة في الإرهاب والتطرف والأمن البحري، مركز جنيف للسياسات الأمنية"
                : "Expert in Terrorism, Extremism and Maritime Security, Geneva Centre for Security Policy",
              meta: ar ? "سويسرا" : "Switzerland",
              media: media.christinaSchori,
            },
            {
              title: "Dr. Sugio Takahashi",
              body: ar
                ? "خبير في استراتيجيات الدفاع والأمن، المعهد الوطني للدراسات الدفاعية"
                : "Expert in Defense and Security Strategies, National Institute for Defense Studies",
              meta: ar ? "اليابان" : "Japan",
              media: media.sugioTakahashi,
            },
          ],
          "swiper",
          50,
        ),
        eyebrow: ar ? "خبرات دولية" : "GLOBAL EXPERTISE",
        anchorID: "featured-participants",
        appearance: { theme: "dark", spacing: "large" },
      },
      {
        ...timeline(
          ar ? "أربعة أسباب لتصبح راعياً" : "Four Reasons to Become a Sponsor",
          ar
            ? "فرصة نوعية لبناء الشراكات والوصول إلى منظومة الأمن البحري."
            : "A timely opportunity to enable partnerships and strengthen access to maritime security ecosystems.",
          [
            {
              label: "01",
              title: ar
                ? "حضور مؤسسي أمام الجهات الأكثر تأثيراً"
                : "Institutional Presence Before Global Maritime Leaders",
              body: ar
                ? "مكانة بارزة أمام صناع القرار من الجهات الحكومية والشركات العالمية التي تقود الحوار حول الأمن البحري وسلاسل الإمداد."
                : "A prominent position before decision-makers from government entities and global companies leading dialogue on maritime security and supply-chain issues.",
            },
            {
              label: "02",
              title: ar
                ? "وصول استراتيجي إلى اجتماعات الأعمال مع الحكومة"
                : "Strategic Access to the B2G Meetings Track",
              body: ar
                ? "وصول ذو أولوية إلى مسار تنفيذي حصري للرعاة تُناقش فيه الفرص وتُبنى الشراكات وقنوات التعاون."
                : "Priority access to an exclusive executive track where opportunities are discussed, partnerships are built, and channels of cooperation are established.",
            },
            {
              label: "03",
              title: ar
                ? "ارتباط العلامة بقطاع عالمي سريع النمو"
                : "Brand Association With a Fast-Growing Strategic Sector",
              body: ar
                ? "ترسيخ موقع العلامة في قطاع يشمل أمن الكابلات البحرية والأنظمة غير المأهولة والأمن السيبراني واستدامة سلاسل الإمداد."
                : "Establish a position within a sector spanning subsea cable protection, unmanned systems, maritime cybersecurity, and supply-chain sustainability.",
            },
            {
              label: "04",
              title: ar
                ? "الوصول إلى منظومة دولية مترابطة"
                : "Access to an Interconnected Global Ecosystem",
              body: ar
                ? "التواصل مع منظومة واسعة من الجهات والخبراء واستكشاف فرص واعدة للتعاون والشراكات الاستراتيجية."
                : "Engage a broad ecosystem concerned with energy security, maritime corridors, unmanned technologies, and cybersecurity to explore strategic cooperation.",
            },
          ],
          60,
        ),
        anchorID: "sponsorship",
      },
      cta(
        ar
          ? "كن شريكاً في تشكيل مستقبل الأمن البحري"
          : "Shape the Future of Maritime Security",
        ar
          ? "ضع مؤسستك في قلب حوار دولي رفيع المستوى وافتح مسارات جديدة للشراكة والتعاون."
          : "Place your organization at the heart of a high-level international dialogue and open new pathways for partnership and cooperation.",
        {
          label: ar ? "كن راعياً" : "Become a Sponsor",
          href: "/en/simf/sponsor",
        },
        {
          label: ar ? "تواصل مع فريق المنتدى" : "Contact the Forum Team",
          href: "/en/contact",
        },
        70,
      ),
    ],
  };
}

function simfSponsorPage(locale: Locale): {
  title: string;
  description: string;
  sections: PageSection[];
} {
  const ar = locale === "ar";
  return {
    title: ar ? "رعاية المنتدى البحري" : "Sponsor the Maritime Forum",
    description: ar
      ? "استكشف فرص الرعاية للمنتدى السعودي الدولي البحري الرابع."
      : "Explore sponsorship opportunities for the Fourth Saudi International Maritime Forum.",
    sections: [
      {
        blockType: "hero",
        displayOrder: 10,
        visible: true,
        eyebrow: ar ? "فرص الرعاية 2026" : "2026 SPONSORSHIP",
        heading: ar
          ? "ضع مؤسستك في قلب مستقبل الأمن البحري"
          : "Position Your Organization at the Centre of Maritime Security",
        body: ar
          ? "تمنح رعاية المنتدى مؤسستك حضوراً مؤثراً أمام صناع القرار وقادة القطاع والخبراء الدوليين، مع وصول نوعي إلى مسارات بناء الشراكات والتعاون."
          : "Forum sponsorship creates meaningful visibility with decision-makers, industry leaders, and international experts—plus privileged access to partnership-building opportunities.",
        media: media.hero,
        buttons: [
          {
            label: ar ? "ابدأ طلب الرعاية" : "Start Your Enquiry",
            href: "#sponsor-enquiry",
            style: "primary",
          },
          {
            label: ar ? "العودة إلى المنتدى" : "Back to the Forum",
            href: "/en/simf",
            style: "outline",
          },
        ],
      },
      {
        ...grid(
          ar
            ? "قيمة استراتيجية تتجاوز الظهور"
            : "Strategic Value Beyond Visibility",
          ar
            ? "صُممت فرص الرعاية لربط العلامات التجارية المؤثرة بالجهات والخبرات والحوارات التي تشكل مستقبل القطاع."
            : "Sponsorship opportunities connect influential organizations with the institutions, expertise, and conversations shaping the sector.",
          [
            {
              title: ar ? "وصول تنفيذي" : "Executive Access",
              body: ar
                ? "تواصل منظم مع الجهات الحكومية وقادة القطاع عبر مسارات مؤسسية رفيعة المستوى."
                : "Structured engagement with government stakeholders and industry leaders through high-level institutional tracks.",
            },
            {
              title: ar ? "مكانة فكرية" : "Thought Leadership",
              body: ar
                ? "مواءمة خبرات مؤسستك مع محاور المنتدى الاستراتيجية وصناعة معرفة ذات صلة."
                : "Align your organization’s expertise with strategic forum themes and relevant knowledge exchange.",
            },
            {
              title: ar ? "شراكات نوعية" : "Qualified Partnerships",
              body: ar
                ? "فتح مسارات تعاون مع منظومة مترابطة من الجهات والموردين والمبتكرين."
                : "Open cooperation pathways across an interconnected ecosystem of institutions, providers, and innovators.",
            },
          ],
          "columns",
          20,
        ),
        appearance: { theme: "light", spacing: "standard" },
      },
      {
        ...grid(
          ar
            ? "مسارات رعاية مصممة حسب أهدافك"
            : "Sponsorship Pathways Built Around Your Objectives",
          ar
            ? "يقدم دليل الرعاية مسارات متعددة للحضور المؤسسي والقطاعي والتجريبي. يرشح فريق المنتدى الفئة الأنسب وفق أهداف الجهة والجمهور والتفعيل المطلوب."
            : "The sponsorship guide provides multiple routes for institutional, sector, and experiential participation. The forum team will recommend the right category around your objectives, audience, and activation plan.",
          [
            {
              eyebrow: ar ? "حضور مؤسسي" : "Institutional leadership",
              title: ar ? "الراعي الاستراتيجي" : "Strategic Sponsor",
              body: ar
                ? "أعلى مستوى من المشاركة، لفئة حصرية ذات حضور مؤسسي راسخ أمام القيادات البحرية والعسكرية والجهات الحكومية والوفود الدولية."
                : "The highest and most exclusive level of participation, designed for an organization seeking prominent institutional presence with naval and military leaders, government entities, and international delegations.",
            },
            {
              eyebrow: ar ? "مواءمة قطاعية" : "Sector alignment",
              title: ar ? "رعاة القطاعات" : "Sector Sponsors",
              body: ar
                ? "مسارات حصرية للطاقة والخدمات اللوجستية والتقنية، تربط خبرة الجهة بمحاور المنتدى ذات الصلة."
                : "Exclusive Energy, Logistics, and Technology routes that align an organization’s expertise with the forum’s strategic themes.",
            },
            {
              eyebrow: ar ? "مستويات مرنة" : "Scalable participation",
              title: ar
                ? "الماسية والبلاتينية والذهبية والفضية"
                : "Diamond, Platinum, Gold and Silver",
              body: ar
                ? "مستويات متنوعة تجمع الظهور المؤسسي والإعلامي وتجربة الضيوف وفرص المشاركة خلال المنتدى."
                : "Tiered opportunities combining institutional visibility, media presence, guest experience, and participation during the forum.",
            },
            {
              eyebrow: ar ? "شراكات مخصصة" : "Purpose-built partnerships",
              title: ar
                ? "الرعاية المشتركة والضيافة والناقل الرسمي"
                : "Co-Sponsor, Hospitality and Official Carrier",
              body: ar
                ? "خيارات متخصصة للجهات التي ترغب في بناء تعاون محدد أو امتلاك تجربة بعينها ضمن رحلة المنتدى."
                : "Specialist routes for organizations that want to support a defined collaboration or own a specific part of the forum experience.",
            },
          ],
          "columns",
          25,
        ),
        appearance: {
          theme: "light",
          spacing: "large",
          backgroundColor: "#eee8e1",
        },
      },
      {
        blockType: "mediaFeature",
        displayOrder: 30,
        visible: true,
        eyebrow: ar ? "مسار مخصص للرعاة" : "A SPONSOR-ONLY ADVANTAGE",
        heading: ar
          ? "حوّل الحضور إلى علاقات وفرص قابلة للتنفيذ"
          : "Turn Presence Into Actionable Relationships",
        body: ar
          ? "يحصل الرعاة على أولوية الوصول إلى مسار اجتماعات الأعمال مع الجهات الحكومية، حيث تُناقش الفرص وتُبنى الشراكات وتُفتح قنوات التعاون مع أصحاب المصلحة."
          : "Sponsors receive priority access to the Business-to-Government meetings track, where opportunities are discussed, partnerships are built, and direct channels of cooperation are established with stakeholders.",
        media: media.maritimePort,
        mediaPosition: "end",
        theme: "dark",
      },
      {
        ...timeline(
          ar
            ? "قيمة تمتد قبل المنتدى وخلاله وبعده"
            : "Value Before, During and After the Forum",
          ar
            ? "تُبنى مزايا كل فئة كرحلة متكاملة للحضور والتفاعل وقياس الأثر، ويتم اعتماد التفاصيل النهائية ضمن اتفاقية الرعاية."
            : "Each category is structured as a connected journey of visibility, engagement, and measurable follow-through. Final deliverables are confirmed in the sponsorship agreement.",
          [
            {
              label: ar ? "قبل المنتدى" : "Before the forum",
              title: ar
                ? "إعلان وحضور مؤسسي مبكر"
                : "Early Announcement and Institutional Visibility",
              body: ar
                ? "إعلانات الشراكة، الظهور عبر القنوات الرسمية، المحتوى الإعلامي، الدعوات، والحضور الرقمي بحسب فئة الرعاية."
                : "Partnership announcements, official-channel visibility, media content, invitations, and digital presence according to the selected category.",
            },
            {
              label: ar ? "خلال المنتدى" : "During the forum",
              title: ar
                ? "تجربة ومشاركة عالية القيمة"
                : "High-Value Presence and Engagement",
              body: ar
                ? "تغطية إعلامية، حضور مؤسسي، فرص جلسات ومعرض، ضيافة، وتجارب مخصصة تدعم التواصل مع الجمهور المستهدف."
                : "Media coverage, institutional visibility, session and exhibition opportunities, hospitality, and tailored experiences that support relevant engagement.",
            },
            {
              label: ar ? "بعد المنتدى" : "After the forum",
              title: ar
                ? "توثيق ومخرجات قابلة للمتابعة"
                : "Documentation and Follow-Through",
              body: ar
                ? "تقرير ختامي ومواد توثيقية وأصول إعلامية مرتبطة بالمشاركة، وفق المزايا المعتمدة للفئة."
                : "A final report, documentation assets, and participation-related media materials according to the agreed package.",
            },
          ],
          40,
        ),
        appearance: { theme: "dark", spacing: "large" },
      },
    ],
  };
}

const eventCards: CardGridSection["cards"] = [
  {
    eyebrow: "Established flagship event",
    title: "Saudi International Maritime Forum",
    body: "A strategic international platform bringing together naval leaders, government officials, defence companies, maritime organizations, technology providers, and experts to address the future of maritime security.",
    media: "/assets/projects/maritime-forum-featured-v2.webp",
    meta: "23–25 November 2026 · Riyadh, Saudi Arabia",
    button: {
      label: "Explore the forum",
      href: "/en/simf",
      style: "text",
    },
  },
  {
    eyebrow: "In development",
    title: "Saudi International Blue Economy Expo",
    body: "A proposed international platform focused on maritime investment, coastal industries, ocean sustainability, logistics, fisheries, tourism, and the economic potential of Saudi Arabia’s maritime resources.",
    media: "/assets/projects/blue-economy-v2.webp",
  },
  {
    eyebrow: "In development",
    title: "Global Industrial Security Expo",
    body: "A strategic platform focused on protecting industrial facilities, energy infrastructure, manufacturing operations, supply chains, and critical national assets.",
    media: "/assets/projects/industrial-security-v2.webp",
  },
  {
    eyebrow: "In development",
    title: "Saudi International Semiconductor Expo",
    body: "Connecting manufacturers, technology companies, investors, research institutions, and government stakeholders supporting localization and advanced industry development.",
    media: "/assets/projects/semiconductor-v2.webp",
  },
  {
    eyebrow: "In development",
    title: "Saudi International Urban Planning and Smart Cities Expo",
    body: "Connecting urban leaders, developers, technology providers, mobility companies, infrastructure operators, and government institutions shaping the cities of the future.",
    media: "/assets/projects/smart-cities-v2.webp",
  },
  {
    eyebrow: "In development",
    title: "Saudi International Mining Technologies Expo",
    body: "A business platform focused on mining innovation, mineral investment, automation, sustainable extraction, and enabling technologies.",
    media: "/assets/projects/mining-v2.webp",
  },
  {
    eyebrow: "In development",
    title: "Saudi International Pharmaceutical Security Expo",
    body: "Supporting pharmaceutical resilience, medicine availability, local manufacturing, healthcare logistics, supply-chain security, and national preparedness.",
    media: "/assets/projects/pharmaceutical-security-v2.webp",
  },
  {
    eyebrow: "Upcoming",
    title: "Saudi International Unmanned Systems Expo",
    body: "Connecting unmanned systems, robotics, artificial intelligence, advanced electronics, defence applications, industrial innovation, and autonomous technologies.",
    media: "/assets/projects/unmanned-systems-v2.webp",
  },
];

const solutionCards: CardGridSection["cards"] = [
  {
    icon: "compass",
    title: "Event Strategy and Creation",
    body: "Sector research, feasibility, concept development, audience strategy, programme architecture, branding, and commercial planning.",
  },
  {
    icon: "chart",
    title: "Event Investment and Development",
    body: "Ownership models, joint ventures, partnership structures, intellectual property development, portfolio growth, and long-term expansion.",
  },
  {
    icon: "shield",
    title: "Government and Sovereign Events",
    body: "Protocol, senior delegation coordination, institutional communication, security coordination, and confidential delivery.",
  },
  {
    icon: "handshake",
    title: "Sponsorship and Commercial Development",
    body: "Commercial strategy, sponsorship architecture, exhibition sales, pavilion development, account management, and partner reporting.",
  },
  {
    icon: "lightbulb",
    title: "Conference and Content Development",
    body: "Programme strategy, advisory boards, speaker management, agenda development, research, moderation, and knowledge content.",
  },
  {
    icon: "users",
    title: "B2B and B2G Programmes",
    body: "Hosted buyer programmes, business matchmaking, government meetings, executive roundtables, appointments, and outcome reporting.",
  },
  {
    icon: "gear",
    title: "Event Production and Operations",
    body: "Venue planning, production, registration, accreditation, hospitality, logistics, suppliers, health and safety, and on-site operations.",
  },
  {
    icon: "megaphone",
    title: "Marketing and Audience Development",
    body: "Brand strategy, campaigns, PR, delegate acquisition, exhibitor marketing, media partnerships, social content, and performance analysis.",
  },
  {
    icon: "circuitry",
    title: "Technology and Data",
    body: "Project dashboards, workflow automation, CRM, supplier and participant management, role-based access, approval trails, operational alerts, and event analytics.",
  },
  {
    icon: "chart",
    title: "Measurement, Reporting and Legacy",
    body: "Outcome frameworks, stakeholder feedback, performance reporting, lead analysis, post-event evaluation, and legacy planning.",
  },
];

const pageData: Record<
  string,
  { title: string; description: string; sections: PageSection[] }
> = {
  simf: simfPage("en"),
  "simf-sponsor": simfSponsorPage("en"),
  home: {
    title: "Strategic Events That Move Industries Forward",
    description:
      "Startime creates, invests in, and operates strategic events and exhibitions that connect governments, industries, investors, and innovators.",
    sections: [
      {
        ...hero(
          "Strategic Events That Move Industries Forward",
          "Startime is a Saudi creator, investor, and operator of strategic events and exhibitions connecting government, industry, investment, innovation, and international organizations around the sectors shaping Saudi Arabia’s future.",
          media.hero,
          [
            {
              label: "Explore Our Events",
              href: "/en/events-investments",
              style: "primary",
            },
            {
              label: "Partner With Startime",
              href: "/en/partner-with-us",
              style: "outline",
            },
          ],
        ),
        eventDetails: [
          {
            label: "Fourth Saudi International Maritime Forum",
            value: "23–25 November 2026",
          },
          {
            label: "Venue",
            value: "Sofitel Riyadh Hotel and Convention Centre",
          },
        ],
      },
      {
        blockType: "mediaFeature",
        displayOrder: 20,
        visible: true,
        eyebrow: "ABOUT STARTIME",
        heading: "Creating Platforms With Lasting Impact",
        body: "Since 2009, Startime has evolved into a strategic business events organization developing influential platforms across sectors of national and international importance. We create concepts, build partnerships, manage complex operations, and grow event properties over multiple editions.",
        media: media.about,
        mediaPosition: "end",
        theme: "light",
        ctaLabel: "Discover Startime",
        ctaHref: "/en/about",
      },
      grid(
        "We Create. We Invest. We Operate.",
        "An integrated model designed to build valuable event properties over the long term.",
        [
          {
            title: "Create",
            body: "We identify high-potential sectors and transform strategic opportunities into credible concepts, brands, programmes, and business communities.",
          },
          {
            title: "Invest",
            body: "We develop long-term event properties through strategic partnerships, commercial models, sector expertise, and institutional collaboration.",
          },
          {
            title: "Operate",
            body: "We manage strategy, commercial development, content, marketing, stakeholder engagement, technology, production, and on-site delivery.",
          },
        ],
        "columns",
        30,
      ),
      {
        ...grid(
          "Saudi Expertise. International Standards.",
          "Startime combines deep Saudi market knowledge with operating standards for government institutions, international companies, investors, and global industry communities.",
          [
            { title: "Operating since 2009", icon: "check" },
            { title: "Headquartered in Riyadh", icon: "check" },
            { title: "Member of UFI", icon: "check" },
            {
              title: "Government and sovereign event experience",
              icon: "check",
            },
            { title: "International stakeholder network", icon: "check" },
            { title: "Proprietary operations platform", icon: "check" },
            {
              title: "Strategic portfolio across high-potential sectors",
              icon: "check",
            },
            {
              title: "Integrated Arabic and English capabilities",
              icon: "check",
            },
          ],
          "checklist",
          40,
        ),
        appearance: { theme: "dark", spacing: "standard" },
      },
      grid(
        "Focused on the Sectors Shaping the Future",
        "Our portfolio focuses on industries where Saudi Arabia is building new capabilities, attracting investment, localizing technology, and strengthening resilience.",
        [
          {
            icon: "shield",
            title: "Security and Defence",
            body: "Defence capabilities, maritime security, critical infrastructure protection, and international cooperation.",
          },
          {
            icon: "anchor",
            title: "Maritime and Blue Economy",
            body: "Ocean resources, ports, logistics, coastal development, energy routes, and marine sustainability.",
          },
          {
            icon: "circuitry",
            title: "Advanced Technology",
            body: "AI, semiconductors, robotics, autonomous systems, electronics, and digital infrastructure.",
          },
          {
            icon: "factory",
            title: "Industrial Development",
            body: "Advanced manufacturing, supply-chain resilience, localization, and operational transformation.",
          },
          {
            icon: "buildings",
            title: "Urban Transformation",
            body: "Urban planning, smart cities, mobility, sustainable infrastructure, and future communities.",
          },
          {
            icon: "mountains",
            title: "Mining and Natural Resources",
            body: "Mining technology, mineral investment, sustainable extraction, and resource development.",
          },
          {
            icon: "heartbeat",
            title: "Healthcare and Pharmaceutical Resilience",
            body: "Pharmaceutical security, local manufacturing, healthcare supply chains, and medical innovation.",
          },
        ],
        "tabs",
        50,
      ),
      grid(
        "Our Events and Investments",
        "Established flagships, upcoming exhibitions, and strategic properties under development—each built around a sector need and long-term opportunity.",
        eventCards,
        "swiper",
        60,
      ),
      {
        blockType: "mediaFeature",
        displayOrder: 65,
        visible: true,
        eyebrow: "FEATURED CASE STUDY",
        heading: "Building a Global Platform for Maritime Security Dialogue",
        body: "The Saudi International Maritime Forum brings together naval leaders, government officials, defence companies, maritime organizations, technology providers, and experts. Startime shaped the platform around institutional relevance, international participation, high-level content, and a governed operating model designed to grow across editions.",
        media: media.maritimePort,
        mediaPosition: "end",
        theme: "dark",
      },
      {
        blockType: "mediaFeature",
        displayOrder: 70,
        visible: true,
        eyebrow: "TRIPLE S ARENA",
        heading: "The Digital Operations Ecosystem Behind Every Startime Event",
        body: "Triple S Arena connects teams, projects, clients, suppliers, approvals, tasks, participants, and operational data in one governed environment—supporting accountability, documentation, risk management, and performance reporting.",
        media: media.operations,
        mediaPosition: "start",
        theme: "dark",
        ctaLabel: "Explore Triple S Arena",
        ctaHref: "/en/triple-s-arena",
      },
      grid(
        "Integrated Solutions Across the Event Lifecycle",
        "From strategy and investment through content, commercial development, production, audience growth, and measurement, Startime connects every discipline required to build a credible platform.",
        solutionCards,
        "list",
        68,
      ),
      {
        blockType: "newsMosaic",
        displayOrder: 80,
        visible: true,
        eyebrow: "INSIGHTS & NEWS",
        heading: "The Latest From Startime",
        ctaLabel: "View All Insights",
        ctaHref: "/en/insights",
        layout: "swiper",
        articles: insightArticles.slice(0, 6),
      },
      {
        ...grid(
          "Built Through Trusted Partnerships",
          "Our platforms connect government entities, international organizations, associations, investors, sponsors, technology providers, and specialist delivery partners around shared strategic value.",
          [
            {
              title: "Government and institutions",
              body: "Alignment with national initiatives, sector priorities, and senior stakeholder engagement.",
            },
            {
              title: "International organizations",
              body: "Global expertise, standards, networks, and market access.",
            },
            {
              title: "Commercial and knowledge partners",
              body: "Shared value through sponsorship, investment, content, and specialist collaboration.",
            },
          ],
          "columns",
          78,
        ),
        appearance: {
          theme: "light",
          spacing: "standard",
          backgroundColor: "#eee8e1",
        },
      },
      {
        blockType: "credibility",
        displayOrder: 79,
        visible: true,
        label:
          "Startime is a member of UFI, the Global Association of the Exhibition Industry.",
        media: "/assets/brand/ufi.svg",
      },
      cta(
        "Build the Next Strategic Platform With Startime",
        "Whether you are developing a national initiative, launching a sector-focused exhibition, seeking an operating partner, or exploring an event investment opportunity, Startime brings together the strategy, relationships, technology, and execution required to build lasting value.",
        { label: "Discuss a Strategic Event", href: "/en/contact" },
        { label: "Request Our Corporate Profile", href: "/en/contact" },
        90,
      ),
    ],
  },
  about: {
    title: "About Startime",
    description:
      "A Saudi strategic events and exhibitions company with global ambition.",
    sections: [
      hero(
        "From Event Delivery to Strategic Industry Platforms",
        "Since 2009, Startime has evolved into a Saudi business events organization creating, developing, and operating strategic platforms across sectors of national and international importance.",
        media.people,
      ),
      {
        blockType: "mediaFeature",
        displayOrder: 20,
        visible: true,
        eyebrow: "WHO WE ARE",
        heading: "A Saudi Company With Global Ambition",
        body: "Headquartered in Riyadh, Startime operates at the intersection of events, industry development, investment, government engagement, and international collaboration. We build event concepts, business communities, commercial partnerships, and platforms designed to grow over multiple editions.",
        media: media.partnership,
        mediaPosition: "end",
        theme: "light",
        ctaLabel: "Explore our events",
        ctaHref: "/en/events-investments",
      },
      timeline(
        "A Journey Built Since 2009",
        "Our evolution reflects Saudi Arabia’s growing global engagement and our ambition to create internationally relevant event properties.",
        [
          {
            label: "2009",
            title: "Startime established",
            body: "Event management, exhibitions, corporate communication, media production, and integrated services.",
          },
          {
            label: "Growth",
            title: "Institutional and international experience",
            body: "Capabilities expanded across business, government, sovereign, and international environments.",
          },
          {
            label: "2019",
            title: "The first Saudi International Maritime Forum",
            body: "The inaugural forum established a strategic platform for international maritime security dialogue in Riyadh.",
          },
          {
            label: "2022",
            title: "The second maritime forum",
            body: "The platform returned in Jeddah with international military, government, and industry participation.",
          },
          {
            label: "Digital transformation",
            title: "Triple S Arena developed",
            body: "A governed operating environment strengthened project control, approvals, accountability, and operational visibility.",
          },
          {
            label: "Global engagement",
            title: "Startime joins UFI",
            body: "Membership connected Startime to the Global Association of the Exhibition Industry and its international professional community.",
          },
          {
            label: "Portfolio expansion",
            title: "Strategic platform creator",
            body: "The company began developing event properties across security, maritime industries, advanced technology, industry, mining, smart cities, and healthcare resilience.",
          },
          {
            label: "2026 and beyond",
            title: "Saudi platforms with global relevance",
            body: "Startime continues expanding flagship events, international partnerships, event investments, and its long-term portfolio.",
          },
        ],
      ),
      grid(
        "Vision, Mission and Ultimate Impact",
        "The principles guiding every platform we create.",
        [
          {
            icon: "globe",
            title: "Vision",
            body: "To create strategic event platforms originating in Saudi Arabia that earn international relevance and advance priority industries.",
          },
          {
            icon: "compass",
            title: "Mission",
            body: "To connect government, industry, investment, knowledge, and innovation through professionally governed events and exhibitions.",
          },
          {
            icon: "sparkle",
            title: "Ultimate Impact",
            body: "Lasting economic, institutional, commercial, and industry value that extends well beyond event day.",
          },
        ],
        "icons",
        40,
      ),
      grid(
        "Leadership, Governance and Values",
        "Built for responsible growth, transparent decision-making, and trusted stakeholder relationships.",
        [
          {
            title: "Strategic thinking",
            body: "We start with the sector need and the long-term opportunity.",
          },
          {
            title: "Credibility",
            body: "We build trust through evidence, consistency, transparency, and delivery.",
          },
          {
            title: "Partnership",
            body: "We create shared value through collaborative institutional and commercial models.",
          },
          {
            title: "Excellence",
            body: "We combine local insight with international operating standards.",
          },
          {
            title: "Innovation",
            body: "We use technology and new thinking to continuously improve.",
          },
          {
            title: "Accountability",
            body: "Clear ownership, governed workflows, and measurable results underpin our work.",
          },
          {
            title: "Trust and confidentiality",
            body: "We protect the confidence placed in us by government entities, clients, partners, participants, and stakeholders.",
          },
          {
            title: "Integrated execution",
            body: "Strategy, partnerships, content, technology, commercial development, production, and operations work as one model.",
          },
          {
            title: "Measurable impact",
            body: "Objectives, delivery, and outcomes are evaluated so value continues beyond the closing day.",
          },
        ],
        "proof",
        50,
      ),
      grid(
        "Leadership",
        "Startime is led by professionals with experience across strategy, government relations, event investment, commercial development, content, technology, production, and operations.",
        [
          {
            icon: "compass",
            title: "Strategic leadership",
            body: "Sets portfolio direction, investment priorities, institutional alignment, and long-term growth.",
          },
          {
            icon: "handshake",
            title: "Commercial and partnership leadership",
            body: "Builds sustainable models with governments, investors, sponsors, associations, and international partners.",
          },
          {
            icon: "gear",
            title: "Delivery leadership",
            body: "Connects multidisciplinary teams through clear accountability, risk management, and operational control.",
          },
        ],
        "icons",
        55,
      ),
      grid(
        "Governance and 2030 Ambition",
        "Responsible growth requires clear decisions, transparent reporting, disciplined risk management, and a portfolio aligned with Saudi Arabia’s long-term economic and industry priorities.",
        [
          {
            icon: "shield",
            title: "Governed decision-making",
            body: "Defined authority, documented approvals, responsible data handling, and accountable execution.",
          },
          {
            icon: "globe",
            title: "UFI membership",
            body: "Connection to the global exhibition industry and its international standards, research, and professional community.",
          },
          {
            icon: "sparkle",
            title: "2030 ambition",
            body: "A diversified portfolio of Saudi-origin platforms with international relevance and measurable sector value.",
          },
        ],
        "proof",
        60,
      ),
      cta(
        "Build the Future With Startime",
        "Work with a Saudi team combining strategic ambition, sector knowledge, institutional relationships, and disciplined execution.",
        { label: "Partner With Startime", href: "/en/partner-with-us" },
        { label: "Contact Us", href: "/en/contact" },
      ),
    ],
  },
  "events-investments": {
    title: "Events and Investments",
    description:
      "Explore Startime’s portfolio of established, upcoming, and developing strategic event properties.",
    sections: [
      hero(
        "A Portfolio Built Around Strategic Opportunity",
        "We create, invest in, and operate event properties that connect high-priority industries with government, capital, knowledge, technology, and international markets.",
        media.hero,
      ),
      grid(
        "Our Portfolio Approach",
        "Every platform begins with a sector need, a defined audience, credible institutional relevance, and a model capable of growing across multiple editions.",
        [
          {
            icon: "shield",
            title: "Established flagship events",
            body: "Proven platforms with institutional credibility and established stakeholder communities.",
          },
          {
            icon: "sparkle",
            title: "Upcoming events",
            body: "Market-ready concepts moving toward launch and audience development.",
          },
          {
            icon: "lightbulb",
            title: "Events in development",
            body: "Strategic properties being shaped with sector partners, investors, and government stakeholders.",
          },
          {
            icon: "gear",
            title: "Managed events",
            body: "Events delivered for government entities, institutions, associations, and corporate clients.",
          },
          {
            icon: "chart",
            title: "Investment opportunities",
            body: "Event properties open to investors, founding partners, sector sponsors, and institutional collaboration.",
          },
        ],
      ),
      grid(
        "Our Events and Investments",
        "A diversified pipeline across security, maritime, technology, industry, cities, mining, healthcare, and autonomous systems.",
        eventCards,
        "swiper",
        30,
      ),
      grid(
        "What Each Platform Advances",
        "The portfolio is structured around defined sector needs, participant communities, and long-term areas of opportunity.",
        [
          {
            icon: "anchor",
            title: "Saudi International Maritime Forum",
            body: "Maritime security, naval cooperation, critical infrastructure, supply-chain resilience, cybersecurity, and advanced maritime technologies.",
          },
          {
            icon: "globe",
            title: "Saudi International Blue Economy Expo",
            body: "Ports, logistics, coastal development, ocean sustainability, fisheries, tourism, marine technology, investment, and research.",
          },
          {
            icon: "shield",
            title: "Global Industrial Security Expo",
            body: "Critical infrastructure protection, operational technology security, industrial safety, surveillance, emergency response, and business continuity.",
          },
          {
            icon: "circuitry",
            title: "Saudi International Semiconductor Expo",
            body: "Design, manufacturing, advanced electronics, research, supply-chain localization, talent, investment, and international partnerships.",
          },
          {
            icon: "buildings",
            title: "Saudi International Urban Planning and Smart Cities Expo",
            body: "Urban planning, digital infrastructure, mobility, utilities, sustainable buildings, public spaces, and future communities.",
          },
          {
            icon: "mountains",
            title: "Saudi International Mining Technologies Expo",
            body: "Exploration, mining equipment, automation, processing, safety, sustainable extraction, investment, and mineral supply chains.",
          },
          {
            icon: "heartbeat",
            title: "Saudi International Pharmaceutical Security Expo",
            body: "Manufacturing, medicine supply chains, cold-chain logistics, procurement, quality, research, digital health, and national resilience.",
          },
          {
            icon: "gear",
            title: "Saudi International Unmanned Systems Expo",
            body: "Aerial, ground, maritime, and industrial autonomous systems, robotics, AI, sensors, electronics, and defence applications.",
          },
        ],
        "list",
        40,
      ),
      timeline(
        "How New Event Properties Are Developed",
        "Startime works with government entities, investors, industry organizations, associations, and companies to turn sector opportunities into governed, repeatable platforms.",
        [
          {
            title: "Analyse the opportunity",
            body: "Sector research, opportunity analysis, and feasibility studies establish the strategic and commercial case.",
          },
          {
            title: "Shape the property",
            body: "Concept creation, brand development, programme strategy, audiences, and commercial models define the platform.",
          },
          {
            title: "Build the partnership",
            body: "Government alignment, institutional partnerships, joint ventures, founding partners, and sponsorship structures support launch.",
          },
          {
            title: "Launch and grow",
            body: "Integrated operations, performance review, market insight, and long-term development strengthen each edition.",
          },
        ],
        50,
      ),
      cta(
        "Develop an Event With Startime",
        "Bring a sector opportunity, national initiative, investment thesis, or existing event property to a team equipped to develop and operate it for long-term value.",
        { label: "Discuss an Event Opportunity", href: "/en/contact" },
        { label: "Partner With Us", href: "/en/partner-with-us" },
      ),
    ],
  },
  solutions: {
    title: "Solutions",
    description:
      "Integrated strategic, commercial, content, technology, production, and operational solutions across the event lifecycle.",
    sections: [
      hero(
        "Integrated Solutions Across the Event Lifecycle",
        "Startime combines strategy, sector understanding, commercial development, content, marketing, technology, production, and operations within one accountable delivery model.",
        media.eventStage,
      ),
      grid(
        "Who We Serve",
        "Solutions shaped around the objectives and governance needs of each stakeholder environment.",
        [
          {
            icon: "shield",
            title: "Government entities",
            body: "National initiatives, sovereign programmes, protocol-led forums, and confidential stakeholder environments.",
          },
          {
            icon: "buildings",
            title: "Industry organizations",
            body: "Sector platforms that convene members, knowledge, policy, technology, and commercial opportunity.",
          },
          {
            icon: "globe",
            title: "International event owners",
            body: "Saudi market entry, localization, partnerships, operations, audience development, and long-term growth.",
          },
          {
            icon: "chart",
            title: "Investors and event partners",
            body: "Event theses, joint ventures, commercial models, portfolio development, and performance reporting.",
          },
          {
            icon: "users",
            title: "Corporate organizations",
            body: "Strategic forums, leadership meetings, launches, exhibitions, and stakeholder experiences.",
          },
          {
            icon: "handshake",
            title: "Sponsors and exhibitors",
            body: "Relevant participation, market access, business meetings, brand activation, qualified leads, and measurable reporting.",
          },
        ],
        "icons",
        20,
      ),
      grid(
        "Our Solutions",
        "Specialist capabilities integrated around one strategy and one operating rhythm.",
        solutionCards,
        "icons",
        30,
      ),
      timeline(
        "How We Work",
        "A governed process from strategic opportunity to measurable legacy.",
        [
          {
            title: "Discover",
            body: "Clarify objectives, stakeholders, opportunity, constraints, and measures of success.",
            icon: "compass",
          },
          {
            title: "Design",
            body: "Shape the concept, audience, programme, brand, experience, and operating model.",
            icon: "lightbulb",
          },
          {
            title: "Develop",
            body: "Build partnerships, content, commercial architecture, campaigns, and systems.",
            icon: "handshake",
          },
          {
            title: "Mobilize",
            body: "Align teams, suppliers, schedules, approvals, risk, and production.",
            icon: "gear",
          },
          {
            title: "Deliver",
            body: "Operate the live experience with disciplined control and stakeholder care.",
            icon: "check",
          },
          {
            title: "Measure",
            body: "Report performance, outcomes, feedback, leads, and operational learning.",
            icon: "chart",
          },
          {
            title: "Grow",
            body: "Translate insight into stronger future editions and long-term platform value.",
            icon: "sparkle",
          },
        ],
        40,
      ),
      cta(
        "Bring Your Next Event Challenge to Startime",
        "From creating a new platform to transforming an existing event, our integrated team can shape the strategy and deliver the full lifecycle.",
        { label: "Discuss Your Requirements", href: "/en/contact" },
        { label: "View Our Experience", href: "/en/impact-experience" },
      ),
    ],
  },
  "impact-experience": {
    title: "Impact and Experience",
    description:
      "See how Startime turns complex mandates and stakeholder environments into credible platforms, measurable outcomes, and lasting industry value.",
    sections: [
      hero(
        "Impact That Continues After the Event",
        "Startime designs every platform around the value it must create—for institutions, industries, partners, participants, and the communities that continue long after the doors close.",
        media.sovereign,
        [
          {
            label: "Discuss Your Objectives",
            href: "/en/contact",
            style: "primary",
          },
          {
            label: "Explore a Flagship Case",
            href: "/en/simf",
            style: "outline",
          },
        ],
      ),
      {
        blockType: "mediaFeature",
        displayOrder: 20,
        visible: true,
        eyebrow: "FEATURED CASE STUDY",
        heading: "Building a Global Platform for Maritime Security Dialogue",
        body: "The Saudi International Maritime Forum translates a complex strategic mandate into a trusted international platform. Senior naval leadership, government institutions, defence organizations, researchers, experts, and technology providers meet around maritime defence, critical infrastructure, undersea systems, supply-chain resilience, cybersecurity, and unmanned technologies.",
        media: media.maritimePort,
        mediaPosition: "end",
        theme: "light",
        ctaLabel: "Explore the forum",
        ctaHref: "/en/simf",
      },
      {
        ...grid(
          "What Meaningful Impact Looks Like",
          "Each platform begins with a clear definition of the change it should enable, then every commercial, content, experience, and operational decision is aligned to it.",
          [
            {
              icon: "check",
              title: "The right institutions and decision-makers are present",
            },
            {
              icon: "check",
              title: "Dialogue is relevant, credible, and action-oriented",
            },
            {
              icon: "check",
              title: "Partners gain qualified access and measurable value",
            },
            {
              icon: "check",
              title: "Participants move through a clear, intuitive journey",
            },
            {
              icon: "check",
              title: "Operations protect trust, protocol, and continuity",
            },
            {
              icon: "check",
              title: "Learning strengthens the next edition and its legacy",
            },
          ],
          "checklist",
          30,
        ),
        appearance: { theme: "dark", spacing: "standard" },
      },
      {
        blockType: "imageStory",
        displayOrder: 40,
        visible: true,
        eyebrow: "FROM MANDATE TO MOMENTUM",
        heading: "A Platform Stakeholders Can Trust",
        body: "High-impact events must make a complex environment feel clear. Startime connects institutional priorities, programme strategy, commercial value, participant experience, and live delivery into one coherent platform—so every stakeholder understands where they fit and what happens next.",
        images: [
          {
            media: media.sovereign,
            caption: "Senior institutional engagement",
          },
          {
            media: media.partnership,
            caption: "Partnership and programme development",
          },
        ],
        ctaLabel: "See How We Work",
        ctaHref: "/en/solutions",
      },
      {
        ...grid(
          "A Measurement Framework Built Around the Mandate",
          "Reporting is configured before delivery, giving clients and partners a clear line between activity, performance, outcomes, and future opportunity.",
          [
            {
              eyebrow: "REACH",
              title: "Stakeholder Quality",
              body: "Seniority, relevance, geography, institutional representation, and participation across priority communities.",
            },
            {
              eyebrow: "BUSINESS",
              title: "Qualified Outcomes",
              body: "Meetings, leads, partnerships, investment dialogue, procurement opportunities, and structured follow-up.",
            },
            {
              eyebrow: "KNOWLEDGE",
              title: "Strategic Exchange",
              body: "Programme quality, policy dialogue, technical exchange, participation, and actionable insight.",
            },
            {
              eyebrow: "COMMERCIAL",
              title: "Partner Performance",
              body: "Sponsorship, exhibition, delegate, activation, and partnership performance against agreed plans.",
            },
            {
              eyebrow: "EXPERIENCE",
              title: "Stakeholder Confidence",
              body: "Service quality, accessibility, feedback, issue resolution, and confidence at every touchpoint.",
            },
            {
              eyebrow: "LEGACY",
              title: "Long-Term Platform Value",
              body: "Community growth, repeat participation, stronger future editions, collaboration, and continued strategic relevance.",
            },
          ],
          "proof",
          50,
        ),
        appearance: { theme: "light", spacing: "large" },
      },
      {
        blockType: "mediaFeature",
        displayOrder: 60,
        visible: true,
        eyebrow: "GOVERNED DELIVERY",
        heading: "One Operating Environment Behind Every Experience",
        body: "Triple S Arena connects teams, approvals, suppliers, schedules, documents, risks, participants, and operational data. That shared environment protects accountability, accelerates decisions, and gives each edition a stronger evidence base for learning and improvement.",
        media: media.operations,
        mediaPosition: "start",
        theme: "dark",
        ctaLabel: "Explore Triple S Arena",
        ctaHref: "/en/triple-s-arena",
      },
      grid(
        "Built Around Stakeholder Value",
        "Each stakeholder enters an event with different objectives, so the experience and measurement framework are configured around the outcomes that matter to them.",
        [
          {
            title: "Government entities",
            body: "Institutional positioning, strategic dialogue, international engagement, policy awareness, and sector development.",
          },
          {
            title: "Sponsors",
            body: "Decision-maker access, thought leadership, business meetings, relevant visibility, activation, and measurable reporting.",
          },
          {
            title: "Exhibitors",
            body: "Market access, qualified visitors, business leads, government engagement, partnerships, and commercial opportunities.",
          },
          {
            title: "Delegates",
            body: "Knowledge, access, networking, relevant meetings, and practical industry insight.",
          },
          {
            title: "Speakers",
            body: "Professional support, relevant audiences, credible dialogue, and thought-leadership visibility.",
          },
        ],
        "columns",
        65,
      ),
      timeline(
        "How Impact Is Engineered",
        "A disciplined path connects strategic intent to live delivery and measurable legacy.",
        [
          {
            label: "ALIGN",
            title: "Define the mandate",
            body: "Clarify the institutional objective, priority stakeholders, desired outcomes, constraints, and measures of success.",
          },
          {
            label: "DESIGN",
            title: "Shape the platform",
            body: "Build the audience, programme, partnership, commercial, brand, and experience architecture around that mandate.",
          },
          {
            label: "CONNECT",
            title: "Mobilize the ecosystem",
            body: "Align decision-makers, partners, speakers, suppliers, participants, teams, and approvals around one delivery model.",
          },
          {
            label: "DELIVER",
            title: "Operate with confidence",
            body: "Protect protocol, service quality, safety, timing, communication, and stakeholder care throughout the live experience.",
          },
          {
            label: "GROW",
            title: "Measure, learn, and compound value",
            body: "Translate performance, feedback, leads, and operational learning into stronger relationships and future editions.",
          },
        ],
        70,
      ),
      cta(
        "Turn Your Strategic Objective Into Lasting Value",
        "Bring Startime the mandate, the opportunity, or the event challenge. We will shape the platform, operating model, and measurement framework required to move it forward.",
        { label: "Discuss Your Objectives", href: "/en/contact" },
        { label: "Explore Our Solutions", href: "/en/solutions" },
        80,
      ),
    ],
  },
  "triple-s-arena": {
    title: "Triple S Arena",
    description:
      "The governed digital operations ecosystem behind Startime events.",
    sections: [
      hero(
        "One Governed Environment for the Entire Event Lifecycle",
        "Triple S Arena connects teams, clients, suppliers, approvals, tasks, participants, documents, risks, and operational data—giving every stakeholder a clearer view of delivery.",
        media.eventStage,
      ),
      grid(
        "The Operational Challenge",
        "Complex events fail when information fragments across inboxes, spreadsheets, files, and disconnected tools.",
        [
          {
            icon: "users",
            title: "Many stakeholders",
            body: "Government, clients, partners, speakers, exhibitors, delegates, suppliers, and internal teams.",
          },
          {
            icon: "gear",
            title: "Interdependent work",
            body: "Approvals, production, content, marketing, sales, logistics, accreditation, protocol, and risk.",
          },
          {
            icon: "shield",
            title: "Governance requirements",
            body: "Clear ownership, controlled access, documented decisions, auditable status, and reliable reporting.",
          },
        ],
        "icons",
        20,
      ),
      timeline(
        "A Connected Event Lifecycle",
        "Structured workflows support every stage without losing context between teams.",
        [
          {
            title: "Opportunity and initiation",
            body: "Objectives, scope, stakeholders, governance, and baseline planning.",
          },
          {
            title: "Strategy and design",
            body: "Concept, audience, programme, commercial plan, brand, and experience.",
          },
          {
            title: "Development",
            body: "Partnerships, content, campaigns, suppliers, production, and documentation.",
          },
          {
            title: "Mobilization",
            body: "Readiness, dependencies, risk, approvals, credentials, and venue coordination.",
          },
          {
            title: "Live operations",
            body: "Command, task status, incidents, service requests, and stakeholder communication.",
          },
          {
            title: "Closure",
            body: "Reconciliation, handover, evidence, issue closure, and supplier completion.",
          },
          {
            title: "Reporting and growth",
            body: "Performance, feedback, outcomes, learning, and future-edition planning.",
          },
        ],
        30,
      ),
      grid(
        "Core Modules",
        "Editors can present only verified features and availability as the platform evolves.",
        [
          { title: "Project planning", icon: "compass" },
          { title: "Workflow and approvals", icon: "check" },
          { title: "Stakeholder management", icon: "users" },
          { title: "Supplier coordination", icon: "handshake" },
          { title: "Tasks and risks", icon: "shield" },
          { title: "Document control", icon: "gear" },
          { title: "Operational dashboards", icon: "chart" },
          { title: "Event reporting", icon: "sparkle" },
        ],
        "proof",
        40,
      ),
      grid(
        "Stakeholder Experience",
        "Different stakeholders work in one connected environment while seeing only the information and actions relevant to their responsibilities.",
        [
          {
            icon: "users",
            title: "Clients and leadership",
            body: "Portfolio visibility, decisions, approvals, readiness, risk, and performance reporting.",
          },
          {
            icon: "gear",
            title: "Delivery teams and suppliers",
            body: "Tasks, dependencies, documents, requirements, deadlines, and live operational coordination.",
          },
          {
            icon: "check",
            title: "Participants and partners",
            body: "Structured onboarding, submissions, communications, credentials, and service requests.",
          },
        ],
        "icons",
        45,
      ),
      grid(
        "Governance, Security and Data Protection",
        "Triple S Arena is designed around role-based access, responsible data handling, documented workflows, and operational accountability. Hosting, certifications, and technical security claims are published only when verified by Startime.",
        [
          {
            icon: "shield",
            title: "Role-based access",
            body: "Stakeholders see the functions and information appropriate to their responsibilities.",
          },
          {
            icon: "check",
            title: "Approval records",
            body: "Decisions and status changes remain attached to governed workflows.",
          },
          {
            icon: "chart",
            title: "Accountable reporting",
            body: "Project and event information is structured for reliable oversight and review.",
          },
        ],
        "icons",
        50,
      ),
      grid(
        "Availability",
        "Triple S Arena is part of Startime’s operating ecosystem. Access, modules, deployment model, and integration scope are configured around verified project requirements.",
        [
          {
            icon: "circuitry",
            title: "Configured for Startime projects",
            body: "Capabilities are activated according to the needs and governance of each event.",
          },
          {
            icon: "shield",
            title: "Claims published only when verified",
            body: "Security, hosting, certification, and technical statements remain controlled by authorized editors.",
          },
        ],
        "proof",
        60,
      ),
      cta(
        "See Triple S Arena in Context",
        "Discuss how the platform supports Startime’s event operating model and stakeholder experience.",
        { label: "Request a Demonstration", href: "/en/contact" },
        { label: "Discuss an Event", href: "/en/contact" },
      ),
    ],
  },
  insights: {
    title: "Insights",
    description:
      "Startime news, event announcements, sector analysis, expert perspectives, and research.",
    sections: [
      hero(
        "Ideas, News and Perspectives From the Industries We Serve",
        "Explore analysis, announcements, interviews, case studies, and practical thinking from Startime and its strategic event communities.",
        media.news,
      ),
      {
        blockType: "newsMosaic",
        displayOrder: 20,
        visible: true,
        eyebrow: "LATEST FROM STARTIME",
        heading: "News, Perspectives and Event Intelligence",
        layout: "grid",
        pageSize: 9,
        articles: insightArticles,
      },
      cta(
        "Stay Connected to Startime",
        "Receive selected announcements, new insights, and portfolio updates.",
        { label: "Contact Our Team", href: "/en/contact" },
      ),
    ],
  },
  article: {
    title:
      "Seabed Security and Maritime Supply Chains in a Critically Changing World",
    description:
      "Why protecting subsea infrastructure and maritime supply chains has become a strategic international priority.",
    sections: [
      hero(
        "Seabed Security and Maritime Supply Chains in a Critically Changing World",
        "The infrastructure beneath the world’s oceans supports global communication, energy transportation, trade, defence, and economic stability. As geopolitical tensions, cyber threats, technological change, and supply-chain disruption increase, its protection has become a strategic international priority.",
        media.seabedSecurity,
        [
          {
            label: "Explore all insights",
            href: "/en/insights",
            style: "outline",
          },
        ],
      ),
      grid(
        "A Connected Maritime Security Challenge",
        "Subsea cables, pipelines, energy routes, data networks, ports, and maritime logistics systems form a critical part of the global economy. Disruption can affect governments, businesses, financial markets, energy systems, and public services.",
        [
          {
            title: "Why seabed infrastructure matters",
            body: "Undersea systems have become essential to global economic, energy, defence, and digital continuity.",
          },
          {
            title: "Emerging physical and cyber threats",
            body: "Physical security and cybersecurity must be addressed together across shared maritime systems.",
          },
          {
            title: "Unmanned systems, technology and data",
            body: "Advanced sensors, autonomous systems, artificial intelligence, monitoring, and data analysis will play a growing role.",
          },
          {
            title: "Maritime supply-chain resilience",
            body: "Ports, logistics networks, energy routes, and international trade require coordinated planning and resilient operations.",
          },
          {
            title: "International cooperation",
            body: "Defence, government, industry, and research communities must collaborate to protect infrastructure that crosses jurisdictions.",
          },
          {
            title: "Saudi Arabia’s strategic maritime position",
            body: "Saudi Arabia connects vital energy routes, trade corridors, ports, infrastructure, and international maritime interests.",
          },
          {
            title: "How the maritime forum supports dialogue",
            body: "The Saudi International Maritime Forum convenes leadership, experts, institutions, and technology providers around shared challenges and practical cooperation.",
          },
        ],
        "list",
        20,
      ),
      cta(
        "Join the Maritime Security Conversation",
        "Explore the Fourth Saudi International Maritime Forum and connect with senior leaders, experts, government institutions, and technology providers addressing the future of maritime security.",
        { label: "Explore the Forum", href: "/en/simf" },
        {
          label: "Request Sponsorship Information",
          href: "/en/simf/sponsor",
        },
      ),
    ],
  },
  careers: {
    title: "Careers",
    description:
      "Build your career with a Saudi events company creating strategic platforms with international reach.",
    sections: [
      hero(
        "Build Platforms That Shape Industries",
        "Join a Saudi team creating strategic events for government institutions, industries, investors, and international business communities.",
        media.people,
        [
          {
            label: "View Open Positions",
            href: "#open-positions",
            style: "primary",
          },
        ],
      ),
      grid(
        "Why Startime",
        "A workplace for people who enjoy responsibility, collaboration, learning, and ambitious delivery.",
        [
          {
            icon: "sparkle",
            title: "Meaningful work",
            body: "Contribute to platforms connected to priority industries and national opportunity.",
          },
          {
            icon: "users",
            title: "Multidisciplinary collaboration",
            body: "Work alongside commercial, creative, operational, technical, and institutional specialists.",
          },
          {
            icon: "chart",
            title: "Growth through responsibility",
            body: "Own outcomes, learn from complex projects, and build capabilities across event lifecycles.",
          },
          {
            icon: "globe",
            title: "Saudi roots, international exposure",
            body: "Engage with leading organizations, experts, suppliers, and participants from diverse markets.",
          },
        ],
        "icons",
        20,
      ),
      grid(
        "Our Culture",
        "We value curiosity, responsibility, generosity, precision, and the confidence to solve complex problems together.",
        [
          {
            icon: "users",
            title: "Collaborative by design",
            body: "Strategy, commercial, content, creative, technology, and operations work as one team.",
          },
          {
            icon: "check",
            title: "Ownership with support",
            body: "People are trusted to own outcomes while sharing information and asking for help early.",
          },
          {
            icon: "sparkle",
            title: "Learning through ambitious work",
            body: "Every platform creates new exposure to sectors, markets, technologies, and stakeholder environments.",
          },
        ],
        "proof",
        25,
      ),
      grid(
        "Career Areas",
        "Our work brings together distinct disciplines under one operating model.",
        [
          { title: "Strategy and event development" },
          { title: "Partnerships and commercial development" },
          { title: "Conference and content" },
          { title: "Marketing and communications" },
          { title: "Experience and creative" },
          { title: "Production and operations" },
          { title: "Technology and data" },
          { title: "Finance, procurement and corporate services" },
        ],
        "proof",
        30,
      ),
      {
        ...grid(
          "Open Positions and Early Careers",
          "Current vacancies, graduate opportunities, and internships can be activated, edited, or hidden independently in the CMS.",
          [
            {
              icon: "buildings",
              title: "Open positions",
              body: "Published roles include responsibilities, experience, location, employment type, and a clear application path.",
            },
            {
              icon: "lightbulb",
              title: "Graduate and internship programme",
              body: "Structured opportunities help emerging talent build practical experience across real event projects.",
            },
          ],
          "icons",
          35,
        ),
        anchorID: "open-positions",
      },
      timeline(
        "Our Recruitment Process",
        "A clear process designed to understand your experience, potential, and fit.",
        [
          {
            title: "Application",
            body: "Share your profile, relevant experience, and the kind of work you want to do.",
          },
          {
            title: "Initial review",
            body: "Our team reviews your background against current and future opportunities.",
          },
          {
            title: "Conversation",
            body: "Discuss your experience, approach, expectations, and questions.",
          },
          {
            title: "Practical assessment",
            body: "Selected roles may include a relevant task, portfolio discussion, or technical assessment.",
          },
          {
            title: "Offer and onboarding",
            body: "Successful candidates receive a clear offer and structured introduction to Startime.",
          },
        ],
        40,
      ),
      cta(
        "Bring Your Talent to Startime",
        "If a suitable position is not currently listed, submit a general application for future opportunities, graduate programmes, and internships.",
        { label: "Submit a General Application", href: "/en/contact" },
      ),
    ],
  },
  contact: {
    title: "Contact Startime",
    description:
      "Contact Startime about events, partnerships, investment, suppliers, media, careers, or general enquiries.",
    sections: [
      hero(
        "Start a Conversation With Startime",
        "Tell us what you are building, exploring, or trying to solve. We will route your enquiry to the right team.",
        media.hero,
      ),
      grid(
        "How Can We Help?",
        "Choose the route that best matches your enquiry.",
        [
          {
            icon: "sparkle",
            title: "Develop a strategic event",
            body: "Create or transform an event, exhibition, forum, or industry platform.",
          },
          {
            icon: "handshake",
            title: "Partnership and investment",
            body: "Explore event ownership, joint ventures, sponsorships, and institutional collaboration.",
          },
          {
            icon: "users",
            title: "Participate in an event",
            body: "Ask about exhibiting, sponsorship, speaking, delegation, or attendance.",
          },
          {
            icon: "megaphone",
            title: "Media enquiry",
            body: "Request information, interviews, facts, approved assets, or event media support.",
          },
          {
            icon: "gear",
            title: "Supplier enquiry",
            body: "Register your capabilities for relevant procurement and delivery opportunities.",
          },
          {
            icon: "buildings",
            title: "Careers",
            body: "Ask about open roles, graduate opportunities, internships, or general applications.",
          },
        ],
        "icons",
        20,
      ),
      grid(
        "Direct Contact",
        "Our team aims to acknowledge enquiries promptly and route them to the appropriate department.",
        [
          {
            title: "Startime Events",
            body: "Riyadh 12341 3507, Kingdom of Saudi Arabia",
            icon: "buildings",
          },
          { title: "Call us", body: "920010500", icon: "users" },
          { title: "Email us", body: "info@startime.sa", icon: "megaphone" },
          {
            title: "Working hours",
            body: "Sunday to Thursday, 9:00 AM to 5:00 PM",
            icon: "check",
          },
        ],
        "proof",
        30,
      ),
      grid(
        "What Happens Next",
        "Your enquiry is reviewed and directed to the relevant Startime team.",
        [
          {
            title: "Initial acknowledgement",
            body: "Business enquiries should normally receive an initial response within two working days.",
          },
          {
            title: "Specialist review",
            body: "The relevant team reviews your objectives, timeline, organization, and required support.",
          },
          {
            title: "Clear follow-up",
            body: "We contact you through the details provided to confirm next steps or request any additional information.",
          },
        ],
        "columns",
        40,
      ),
    ],
  },
  "partner-with-us": {
    title: "Partner With Startime",
    description:
      "Explore strategic, institutional, commercial, investment, and delivery partnerships with Startime.",
    sections: [
      hero(
        "Build Strategic Platforms Through Partnership",
        "The most influential events are built through aligned objectives, complementary capabilities, shared value, and long-term commitment.",
        media.hero,
      ),
      grid(
        "Partnership Models",
        "Flexible structures designed around the opportunity and each partner’s role.",
        [
          {
            icon: "shield",
            title: "Government and institutional partnerships",
            body: "Platforms aligned with national initiatives, sector priorities, policy dialogue, and stakeholder engagement.",
          },
          {
            icon: "chart",
            title: "Event investment and joint ventures",
            body: "Co-development, ownership structures, intellectual property, commercial models, and portfolio growth.",
          },
          {
            icon: "handshake",
            title: "Strategic sponsorship",
            body: "Partnership architecture connecting brands to relevant decision-makers, markets, content, and experiences.",
          },
          {
            icon: "globe",
            title: "International event partnerships",
            body: "Saudi localization, institutional access, audience development, operations, and market expansion.",
          },
          {
            icon: "users",
            title: "Associations and knowledge partners",
            body: "Advisory input, standards, expertise, content, membership engagement, and international networks.",
          },
          {
            icon: "gear",
            title: "Technology and delivery partners",
            body: "Specialist solutions supporting platforms, production, operations, data, participant experience, and measurement.",
          },
        ],
        "icons",
        20,
      ),
      grid(
        "What Startime Brings",
        "A partnership with Startime combines local market depth, institutional relationships, strategic thinking, commercial capability, integrated delivery, and governed technology.",
        [
          {
            icon: "compass",
            title: "Strategy and sector understanding",
            body: "Opportunity framing, audience architecture, business models, programme direction, and long-term platform development.",
          },
          {
            icon: "handshake",
            title: "Relationships and market access",
            body: "Connections across government, industry, investment, associations, experts, and international communities.",
          },
          {
            icon: "gear",
            title: "Integrated delivery capability",
            body: "One accountable operating model spanning commercial, content, marketing, production, technology, and measurement.",
          },
        ],
        "proof",
        25,
      ),
      timeline(
        "How Partnership Develops",
        "A transparent path from strategic alignment to governed delivery and growth.",
        [
          {
            title: "Explore alignment",
            body: "Clarify the opportunity, objectives, stakeholders, and potential roles.",
          },
          {
            title: "Shape the model",
            body: "Define value, responsibilities, governance, commercial structure, and measures.",
          },
          {
            title: "Formalize",
            body: "Agree scope, commitments, rights, decision-making, and reporting.",
          },
          {
            title: "Deliver",
            body: "Mobilize teams and execute through one coordinated operating framework.",
          },
          {
            title: "Measure and grow",
            body: "Review performance, learning, value created, and future potential.",
          },
        ],
        30,
      ),
      cta(
        "Explore a Partnership With Startime",
        "Share the opportunity, organization, sector, and partnership model you would like to discuss.",
        { label: "Start a Partnership Conversation", href: "/en/contact" },
      ),
    ],
  },
  "media-centre": {
    title: "Media Centre",
    description:
      "Access Startime news, facts, approved photography, brand assets, and media contact information.",
    sections: [
      hero(
        "Information and Assets for Media",
        "A central source for company updates, event news, verified facts, approved imagery, brand materials, and interview enquiries.",
        media.news,
      ),
      grid(
        "Media Resources",
        "Use current, approved material and contact the media team when context or permissions are required.",
        [
          {
            icon: "megaphone",
            title: "Press releases and company news",
            body: "Official announcements, partnerships, event milestones, and corporate developments.",
          },
          {
            icon: "users",
            title: "Interviews and expert comment",
            body: "Requests for Startime leadership, event representatives, and relevant subject-matter perspectives.",
          },
          {
            icon: "check",
            title: "Company factsheet",
            body: "Verified company description, history, headquarters, portfolio, memberships, and key information.",
          },
          {
            icon: "sparkle",
            title: "Approved photography",
            body: "Curated corporate, event, leadership, and operational imagery with usage guidance.",
          },
          {
            icon: "globe",
            title: "Brand assets",
            body: "Approved Startime logos, colour references, and basic brand-use guidance.",
          },
          {
            icon: "shield",
            title: "Media contact",
            body: "A direct route for journalists, producers, editors, and event media partners.",
          },
        ],
        "icons",
        20,
      ),
      cta(
        "Contact the Startime Media Team",
        "Tell us the publication, deadline, subject, and material or interview you need.",
        { label: "Send a Media Enquiry", href: "/en/contact" },
      ),
    ],
  },
  "supplier-registration": {
    title: "Supplier Registration",
    description:
      "Register your company for potential Startime procurement and event delivery opportunities.",
    sections: [
      hero(
        "Work With Startime as a Supplier",
        "We collaborate with qualified suppliers and specialists who can support high-quality, safe, reliable, and well-governed event delivery.",
        media.eventStage,
      ),
      grid(
        "Supplier Categories",
        "Registration supports future sourcing and does not guarantee an invitation, contract, or purchase order.",
        [
          { title: "Event production and technical services", icon: "gear" },
          {
            title: "Venue, staging and temporary structures",
            icon: "buildings",
          },
          {
            title: "Registration, accreditation and technology",
            icon: "circuitry",
          },
          {
            title: "Creative, branding and content production",
            icon: "sparkle",
          },
          { title: "Logistics, transport and hospitality", icon: "users" },
          { title: "Security, safety and specialist services", icon: "shield" },
          {
            title: "Marketing, media and audience services",
            icon: "megaphone",
          },
          { title: "Professional and corporate services", icon: "handshake" },
        ],
        "proof",
        20,
      ),
      grid(
        "Registration Requirements",
        "Prepare accurate, current documents. Requirements may vary by category and project.",
        [
          { title: "Company profile and contact details" },
          { title: "Commercial registration and relevant licences" },
          { title: "Tax and statutory documentation" },
          { title: "Relevant project experience and references" },
          {
            title:
              "Quality, health, safety, and security information where applicable",
          },
          {
            title:
              "Banking and insurance information when requested through an approved procurement process",
          },
        ],
        "list",
        30,
      ),
      cta(
        "Register Your Company",
        "Submit your capabilities for review by the relevant procurement and delivery teams. Startime will contact selected suppliers when a suitable opportunity arises.",
        { label: "Begin Supplier Registration", href: "/en/contact" },
      ),
    ],
  },
};

export function getPdfPage(locale: Locale, pageType = "home"): PublicPage {
  const selected =
    locale === "ar" && pageType === "simf"
      ? simfPage("ar")
      : locale === "ar" && pageType === "simf-sponsor"
        ? simfSponsorPage("ar")
        : pageData[pageType] || pageData.home;
  const localizeInternalLinks = (value: unknown): unknown => {
    if (typeof value === "string") {
      if (value === "/en") return locale === "ar" ? "/ar" : "/";
      if (value.startsWith("/en/")) {
        return `${locale === "ar" ? "/ar" : ""}${value.slice(3)}`;
      }
      return value;
    }
    if (Array.isArray(value)) return value.map(localizeInternalLinks);
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([key, entry]) => [
          key,
          localizeInternalLinks(entry),
        ]),
      );
    }
    return value;
  };
  const sections = localizeInternalLinks(
    structuredClone(selected.sections),
  ) as PageSection[];
  const pagePath = routes[pageType] ? `/${routes[pageType]}` : "/";
  const localizedPath =
    locale === "ar" ? (pagePath === "/" ? "/ar" : `/ar${pagePath}`) : pagePath;
  const schemaGraph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": "https://startime.sa/#organization",
      name: "Startime",
      url: "https://startime.sa/",
      logo: "https://startime.sa/assets/brand/startime-dark.svg",
      address: {
        "@type": "PostalAddress",
        addressCountry: "SA",
        addressLocality: "Riyadh",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://startime.sa/#website",
      name: "Startime",
      publisher: { "@id": "https://startime.sa/#organization" },
      url: "https://startime.sa/",
      inLanguage: locale === "ar" ? "ar-SA" : "en-SA",
    },
    {
      "@type": "WebPage",
      "@id": `https://startime.sa${localizedPath}#webpage`,
      name: selected.title,
      description: selected.description,
      isPartOf: { "@id": "https://startime.sa/#website" },
      url: `https://startime.sa${localizedPath}`,
      inLanguage: locale === "ar" ? "ar-SA" : "en-SA",
    },
  ];
  if (pageType === "simf") {
    schemaGraph.push({
      "@type": "Event",
      "@id": "https://startime.sa/simf#event",
      name: selected.title,
      description: selected.description,
      startDate: "2026-11-23",
      endDate: "2026-11-25",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      image:
        "https://startime.sa/assets/editorial/startime-maritime-hero-v3.webp",
      location: {
        "@type": "Place",
        name: "Sofitel Riyadh Hotel & Convention Center",
        address: {
          "@type": "PostalAddress",
          addressCountry: "SA",
          addressLocality: "Riyadh",
        },
      },
      organizer: { "@id": "https://startime.sa/#organization" },
      url: `https://startime.sa${localizedPath}`,
    });
  }
  return {
    pageType,
    sections,
    seo: {
      title: seoTitles[pageType] || `${selected.title} | Startime`,
      description: selected.description,
      followLinks: true,
      indexable: true,
      structuredData: {
        "@context": "https://schema.org",
        "@graph": schemaGraph,
      },
    },
    slug: routes[pageType] || pageType,
    summary: selected.description,
    title: selected.title,
  };
}

export const pdfPageTypes = Object.keys(pageData);
