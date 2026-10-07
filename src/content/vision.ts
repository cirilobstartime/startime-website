import type { Locale } from "@/content/home";

type VisionItem = { title: string; body: string; image?: string; target?: string };

export type VisionContent = {
  hero: { quote: string; honorific: string; name: string; role: string };
  path: { title: string; body: string[] };
  vision: { label: string; body: string; statement: string };
  pillars: { label: string; title: string; body: string; items: VisionItem[] };
  programs: { label: string; title: string; body: string; items: VisionItem[] };
  roadmap: { label: string; title: string; items: { year: string; body: string }[] };
  commitment: { label: string; title: string; body: string[] };
};

export const visionContent: Record<Locale, VisionContent> = {
  en: {
    hero: {
      quote: "\"Success stories always begin with a vision, and the most successful visions are those that build on strengths\"",
      honorific: "His Royal Highness",
      name: "Prince Mohammed bin Salman bin Abdulaziz Al Saud",
      role: "Crown Prince and Prime Minister",
    },
    path: {
      title: "Following the Path, Inspired by Vision and Values",
      body: [
        "By the grace of Allah, and under visionary leadership guided by an ambitious national vision, the Kingdom of Saudi Arabia continues to strengthen its position as one of the world's fastest-transforming, fastest-growing, and most influential nations. Through a more diversified economy, increasingly competitive sectors, and an expanding international presence, Saudi Arabia is helping shape the future on a global scale.",
        "Inspired by this remarkable journey, we have defined our strategic direction, built our investment portfolios, and identified future opportunities based on the values and principles established by Saudi Vision 2030. We have aligned our efforts toward developing projects and initiatives that support future priorities and contribute to strengthening Saudi Arabia competitive position at both the regional and global levels.",
      ],
    },
    vision: {
      label: "Startime Vision",
      body: "At Startime, we believe that the future belongs to those who possess clarity of vision, the courage to pursue ambitious goals, and the ability to execute with excellence. Therefore, we continue to invest in opportunities, partnerships, and ideas that enable us to:",
      statement: "Lead the MICE industry in the Kingdom of Saudi Arabia and advance to the ranks of globally recognized event creators by 2030",
    },
    pillars: {
      label: "Vision Pillars",
      title: "We Soar Beyond the Skies and Create an Ultimate Impact",
      body: "To achieve our ambitious vision, we have identified five strategic pillars that serve as the foundation for growth, development, investment, and impact creation. These pillars guide our efforts toward building a more influential, competitive, and sustainable organization by 2030.",
      items: [
        { title: "Market Leadership", image: "/assets/vision/market-leadership.webp", body: "We are committed to strengthening Startime’s position as a national benchmark in the creation and management of high-impact business events through the development of more competitive and influential projects that contribute to enhancing Saudi Arabia’s presence within the global events industry." },
        { title: "Global Presence", image: "/assets/vision/global-presence.webp", body: "We seek to expand Startime’s international footprint by building global partnerships, developing internationally attractive projects, and attracting foreign capital and investment, further reinforcing Saudi Arabia’s position as a global hub for business and events." },
        { title: "Investment Growth", image: "/assets/vision/investment-growth.webp", body: "We continue to expand our investment portfolios through the launch of specialized projects across the strategic sectors in which we operate, ensuring diversified growth and maximizing long-term sustainable value." },
        { title: "Institutional Excellence", image: "/assets/vision/institutional-excellence.webp", body: "We strengthen governance, operational capabilities, digital transformation, and intelligent systems to enhance performance efficiency, ensure sustainable growth, and maintain excellence across our operations and projects." },
        { title: "Sustainable Impact", image: "/assets/vision/sustainable-impact.webp", body: "We transform our projects and initiatives into platforms for impact that support the objectives of Saudi Vision 2030, enhance Saudi Arabia competitiveness, and contribute to addressing global development challenges relevant to our investment focus areas." },
      ],
    },
    programs: {
      label: "Vision Programs",
      title: "Enabling Growth and Accelerating the Achievement of Our Vision",
      body: "To transform our vision into measurable outcomes, we have launched a portfolio of strategic programs that serve as the primary drivers of growth, institutional advancement, and impact creation. These programs strengthen our competitiveness, enhance business sustainability, and reinforce our position as a national and global leader.",
      items: [
        { title: "Governance Program", body: "We are committed to establishing an advanced institutional model that promotes transparency, accountability, and effective decision-making, ensuring sustainable growth, safeguarding corporate value, and strengthening Startime’s readiness for expansion and long-term success.", target: "2030 Program Target: Achieve advanced institutional maturity with 90% of operational processes digitally automated." },
        { title: "Partnership Program", body: "We continue to strengthen our national and international partnership ecosystem as one of the most critical enablers of growth and impact, fostering long-term relationships that expand opportunities, create mutual value, and accelerate the realization of our vision.", target: "2030 Program Target: Build the most influential partnership ecosystem in the MICE industry across the regional and global landscape." },
        { title: "Talent Acquisition Program", body: "We actively identify talented individuals, innovators, and exceptional professionals, providing an environment that enables growth and excellence. We attract world-class capabilities capable of leading transformation, innovation, and impact, recognizing human capital as the foundation of sustained success.", target: "2030 Program Target: Build a world-class ecosystem of innovators, talented professionals, and national and international expertise capable of shaping the future of the MICE industry." },
        { title: "Sustainability Program", body: "We integrate the principles of economic, knowledge, social, and environmental sustainability across our projects and initiatives to ensure lasting impact and the continuous creation of value for future generations.", target: "2030 Program Target: Establish sustainability as a fundamental standard across all Startime projects, initiatives, and investments." },
        { title: "Innovation Program", body: "We embed innovation as a way of thinking, a corporate culture, and a tool for developing projects, solutions, and business experiences, enabling us to anticipate the future and lead transformation across the events and MICE industry.", target: "2030 Program Target: Position Startime among the most innovative and influential organizations in the events and MICE industry." },
      ],
    },
    roadmap: {
      label: "Roadmap",
      title: "Milestones Guiding Our Journey Toward Realizing the Vision",
      items: [
        { year: "2024", body: "Financial Restructuring and the Beginning of Strategic Transformation" },
        { year: "2025", body: "Corporate Governance and the Achievement of Institutional Maturity" },
        { year: "2026", body: "Gap Identification, Market Intelligence, and Opportunity Creation" },
        { year: "2027", body: "Establishing Supporting Entities and Strengthening Market Positioning" },
        { year: "2028", body: "Expanding Strategic Partnerships and Strengthening Global Presence" },
        { year: "2029", body: "Listing on Nomu – The Parallel Market" },
        { year: "2030", body: "Realizing the Startime Vision and Achieving Our Strategic Ambitions" },
      ],
    },
    commitment: {
      label: "A Commitment We Have Made... And a Journey We Continue with Confidence",
      title: "Because great visions begin with an idea… and are realized through commitment",
      body: [
        "At Startime, we view our vision as a lasting commitment and a continuing responsibility toward our nation, our partners, and the communities we serve. We are therefore committed to building a Saudi organization that leads the MICE industry domestically and competes with distinction on the global stage.",
        "We continue to pursue our vision with confidence and determination, guided by enduring values, governed by sound institutional practices, and measured by the impact we create. At the same time, we remain committed to investing in opportunities that support future priorities and contribute to strengthening the competitiveness of Saudi Arabia.",
        "We also pledge that our projects, initiatives, and business platforms will continue to serve as vehicles for value creation, knowledge exchange, human empowerment, and partnership development. With unwavering commitment and ambition, we will continue advancing toward the realization of Startime Vision 2030: leading the MICE industry in Saudi Arabia and advancing to the ranks of globally recognized event creators.",
      ],
    },
  },
  ar: {
    hero: {
      quote: "\"دائماً ما تبدأ قصص النجاح برؤية، وأنجح الرؤى هي تلك التي تُبنى على مكامن القوة\"",
      honorific: "صاحب السمو الملكي",
      name: "الأمير محمد بن سلمان بن عبدالعزيز آل سعود – حفظه الله",
      role: "ولي العهد، رئيس مجلس الوزراء",
    },
    path: {
      title: "نقتفي الخطى... ونستلهم الرؤى والقيم",
      body: [
        "بفضل الله، ثم بقيادة ملهمة ورؤية وطنية طموحة، تواصل المملكة العربية السعودية ترسيخ مكانتها كإحدى أسرع دول العالم تحولاً ونمواً وتأثيراً، من خلال اقتصاد أكثر تنوعاً، وقطاعات أكثر تنافسية، وحضور دولي متنامٍ يعيد رسم ملامح المستقبل.",
        "من هذا المنطلق، استلهمنا توجهاتنا، وبنينا محافظ استثماراتنا، واستشرفنا فرصنا المستقبلية انطلاقاً من القيم والمبادئ التي أرستها رؤية السعودية 2030، ووجهنا جهودنا نحو تطوير مشاريع ومبادرات تسهم في دعم أولويات المستقبل وتعزيز المكانة التنافسية للمملكة على المستويين الإقليمي والعالمي.",
      ],
    },
    vision: {
      label: "رؤية ستارتايم",
      body: "وفي ستارتايم، نؤمن بأن المستقبل يصنعه من يمتلك وضوح الرؤية، وجرأة الطموح، وقدرة التنفيذ؛ لذلك نواصل الاستثمار في الفرص والشراكات والأفكار التي تمكننا من:",
      statement: "قيادة سوق اجتماعات الأعمال في المملكة العربية السعودية، والارتقاء إلى مصاف صناع الأحداث عالمياً بحلول عام 2030",
    },
    pillars: {
      label: "محاور الرؤية",
      title: "نحلق لعنان السماء ونصنع أثر لا يضاهى",
      body: "لتحقيق رؤيتنا الطموحة، حددنا خمسة محاور استراتيجية تمثل مرتكزات النمو والتطوير والاستثمار وصناعة الأثر، وتوجه جهودنا نحو بناء مؤسسة أكثر تأثيراً وتنافسية واستدامة بحلول عام 2030",
      items: [
        { title: "الريادة السوقية", image: "/assets/vision/market-leadership.webp", body: "نعمل على ترسيخ مكانة ستارتايم كمرجع وطني في صناعة وتنظيم فعاليات الأعمال النوعية، عبر بناء مشاريع أكثر تأثيراً وتنافسية تسهم في تعزيز حضور المملكة العربية السعودية في المشهد العالمي لصناعة الأحداث." },
        { title: "الحضور العالمي", image: "/assets/vision/global-presence.webp", body: "نسعى إلى توسيع حضور ستارتايم عالمياً من خلال بناء شراكات دولية، وتطوير مشاريع ذات جاذبية عالمية، واستقطاب رأس المال الأجنبي والاستثمارات، بما يعزز مكانة المملكة العربية السعودية كمركز دولي للأعمال والأحداث." },
        { title: "النمو الاستثماري", image: "/assets/vision/investment-growth.webp", body: "نواصل تنمية محافظنا الاستثمارية من خلال إطلاق مشاريع نوعية في القطاعات الاستراتيجية التي تتمحور حولها، بما يضمن تنويع مصادر النمو وتعظيم القيمة المستدامة طويلة المدى." },
        { title: "التميز المؤسسي", image: "/assets/vision/institutional-excellence.webp", body: "نعزز ممكنات الحوكمة والقدرات التشغيلية والتحول الرقمي والأنظمة الذكية، بما يرفع كفاءة الأداء، ويضمن استدامة النمو وجودة التنفيذ على امتداد أعمالنا ومشاريعنا." },
        { title: "الأثر المستدام", image: "/assets/vision/sustainable-impact.webp", body: "نعمل على تحويل مشاريعنا ومبادراتنا إلى منصات تأثير تسهم في دعم مستهدفات رؤية السعودية 2030، وتعزيز تنافسية المملكة، والمساهمة في معالجة القضايا التنموية العالمية ذات الصلة بمسارات استثمارنا." },
      ],
    },
    programs: {
      label: "برامج الرؤية",
      title: "التمكين وتسريع الوصول إلى تحقيق المستهدفات",
      body: "لتحويل رؤيتنا إلى واقع ملموس، أطلقنا مجموعة من البرامج الاستراتيجية التي تمثل المحركات الرئيسية للنمو والتطوير المؤسسي وصناعة الأثر، وتدعم قدرتنا على رفع تنافسيتنا واستدامة أعمالنا واستمرار ريادتنا على المستويين الوطني والعالمي.",
      items: [
        { title: "برنامج الحوكمة", body: "نعمل على ترسيخ نموذج مؤسسي متقدم يعزز الشفافية والمساءلة ويرفع كفاءة اتخاذ القرار، بما يضمن استدامة النمو وحماية القيمة المؤسسية وتعزيز جاهزية ستارتايم للتوسع وتحقيق مستهدفاتها طويلة المدى.", target: "مستهدف البرنامج 2030 الوصول إلى نضج مؤسسي متقدم مع رقمنة وأتمتة 90% من العمليات التشغيلية" },
        { title: "برنامج الشراكات", body: "نعزز منظومة الشراكات الوطنية والدولية باعتبارها أحد أهم الممكنات الاستراتيجية للنمو وصناعة الأثر من خلال بناء علاقات طويلة الأمد تسهم في توسيع الفرص وتعظيم القيمة المتبادلة وتسريع الوصول إلى مستهدفات الرؤية.", target: "مستهدف البرنامج 2030 بناء أكثر منظومة شراكات تأثيراً في قطاع اجتماعات الأعمال على المستويين الإقليمي والعالمي." },
        { title: "برنامج الاستقطاب", body: "نتعمق في البحث لاكتشاف الموهوبين والمبتكرين ونهيئ لهم البيئة المحفزة للنمو، ونستقطب الكفاءات الاستثنائية القادرة على قيادة النمو والابتكار وصناعة التأثير، إيماناً منا بأن رأس المال البشري هو المحرك الأهم لتحقيق التميز المؤسسي واستدامة النجاح.", target: "مستهدف البرنامج 2030 بناء منظومة مبتكرين وموهوبين وكفاءات وطنية وعالمية تقود مستقبل صناعة اجتماعات الأعمال." },
        { title: "برنامج الاستدامة", body: "نعمل على دمج مبادئ الاستدامة الاقتصادية والمعرفية والمجتمعية والبيئية في مشاريعنا ومبادراتنا، بما يضمن استمرار الأثر وتعظيم القيمة للأجيال القادمة.", target: "مستهدف البرنامج 2030 أن تصبح الاستدامة معياراً أصيلاً في جميع مشاريع ستارتايم ومبادراتها واستثماراتها." },
        { title: "برنامج الابتكار", body: "نجعل الابتكار منهج عمل وثقافة مؤسسية وأداة لتطوير المشاريع والحلول وتجارب الأعمال، بما يمكننا من استشراف المستقبل وقيادة التحولات في صناعة الأحداث واجتماعات الأعمال.", target: "مستهدف البرنامج 2030 ترسيخ مكانة ستارتايم كواحدة من أكثر المؤسسات ابتكاراً وتأثيراً في صناعة الأحداث واجتماعات الأعمال." },
      ],
    },
    roadmap: {
      label: "خارطة الطريق",
      title: "محطات تقودنا نحو تحقيق الرؤية",
      items: [
        { year: "2024", body: "الإصلاح المالي وبدء التحول الاستراتيجي" },
        { year: "2025", body: "الحوكمة المؤسسية وتحقيق النضج المؤسسي" },
        { year: "2026", body: "قراءة الفجوات والبحث السوقي وتوليد الفرص" },
        { year: "2027", body: "تأسيس الكيانات الداعمة والتمكين السوقي" },
        { year: "2028", body: "التوسع في بناء الشراكات وتعزيز الحضور العالمي" },
        { year: "2029", body: "الإدراج في نمو - السوق الموازية" },
        { year: "2030", body: "تحقيق رؤية ستارتايم والوصول إلى المستهدف" },
      ],
    },
    commitment: {
      label: "عهدٌ قطعناه ونمضي نحو تحقيقه بخطى ثابتة",
      title: "لأن الرؤى العظيمة تبدأ بفكرة... وتتحقق بالالتزام",
      body: [
        "في ستارتايم، ننظر إلى رؤيتنا باعتبارها عهداً والتزاماً مستمراً تجاه وطننا وشركائنا والمجتمعات التي نخدمها؛ ولذلك نلتزم بمواصلة بناء كيان سعودي يقود سوق صناعة اجتماعات الأعمال محلياً، وينافس باقتدار على الساحة العالمية.",
        "ونمضي نحو تحقيق رؤيتنا بثبات، مستندين إلى نهج مؤسسي راسخ تقوده القيم، وتحكمه الحوكمة، ويقاس بالأثر الذي نصنعه، مع التزامنا بالاستثمار في الفرص التي تدعم أولويات المستقبل وتسهم في تعزيز تنافسية المملكة العربية السعودية.",
        "كما نتعهد بأن تظل مشاريعنا ومبادراتنا ومنصات أعمالنا أدواتٍ لصناعة القيمة، ونقل المعرفة، وتمكين الإنسان، وتعزيز الشراكات؛ وأن نواصل العمل بعزم وإصرار نحو تحقيق رؤية ستارتايم 2030، وصولاً إلى قيادة سوق اجتماعات الأعمال في المملكة العربية السعودية، والارتقاء إلى مصاف صناع الأحداث عالمياً.",
      ],
    },
  },
};
