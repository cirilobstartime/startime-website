import type { Locale } from "@/content/home";
import type { HomepageItemVisual } from "@/content/homepageVisual";

type InsightArea = { title: string; body: string; image: string; icon?: string; itemVisual?: HomepageItemVisual };
type KnowledgeMetric = { value: string; label: string; body: string; itemVisual?: HomepageItemVisual };

type InsightsContent = {
  hero: { label: string; title: string; continuation: string; body: string };
  introduction: string;
  archive: { label: string; title: string };
  areas: { label: string; title: string; items: InsightArea[] };
  ambition: { label: string; title: string; items: KnowledgeMetric[] };
  credibility: { label: string; title: string; paragraphs: string[] };
  property: { label: string; title: string; body: string };
  contribution: { label: string; title: string; body: string; fields: string[]; submit: string };
};

const areaImages = [
  "/assets/projects/maritime-forum-featured-v2.webp",
  "/assets/projects/unmanned-systems-v2.webp",
  "/assets/editorial/startime-investment-aerial-day-v2.webp",
  "/assets/projects/semiconductor-v2.webp",
  "/assets/projects/blue-economy-v2.webp",
  "/assets/projects/pharmaceutical-security-v2.webp",
  "/assets/projects/smart-cities-v2.webp",
  "/assets/editorial/home5-heritage-doorway.webp",
  "/assets/projects/mining-v2.webp",
  "/assets/projects/industrial-security-v2.webp",
];

const en: InsightsContent = {
  hero: {
    label: "Startime Insights",
    title: "Rooted in Our Local Culture, Guided by a Global Mindset",
    continuation: "Anticipating the Future",
    body: "Insights and analyses that explore the transformations shaping the future",
  },
  introduction: "At Startime, we view knowledge as one of the most powerful enablers of shaping the future and creating sustainable value. Through the Startime Insights Platform, we document our perspectives, analyses, and forward-looking assessments of the issues, trends, and transformations shaping the future, while sharing knowledge-driven content that enriches professional dialogue, fosters the exchange of expertise, and contributes to a deeper understanding of the opportunities and challenges facing priority economic and development sectors.",
  archive: { label: "Startime Blog", title: "Latest Blog Articles and Insights" },
  areas: {
    label: "Insight Areas",
    title: "Specialized Knowledge for Anticipating the Future",
    items: [
      { title: "National Security", body: "Analysis and perspectives exploring the challenges, shifts, and developments influencing national security, stability, and resilience in an evolving world.", image: areaImages[0] },
      { title: "Defense Capabilities", body: "Specialized insights highlighting defense industries, localization, military technologies, and the enablers of building sovereign national capabilities.", image: areaImages[1] },
      { title: "Economy & Investment", body: "In-depth perspectives on economic trends, investment opportunities, and the drivers of sustainable growth and competitiveness.", image: areaImages[2] },
      { title: "Advanced Technologies", body: "Forward-looking content exploring emerging technologies and their role in reshaping economies, industries, and societies.", image: areaImages[3] },
      { title: "Sustainability & Environment", body: "Insights examining global environmental transformations, sustainability opportunities, resource management, and the green economy.", image: areaImages[4] },
      { title: "Health & Quality of Life", body: "Specialized knowledge covering emerging healthcare trends and solutions that contribute to healthier, more prosperous communities.", image: areaImages[5] },
      { title: "Commerce & Business", body: "Analysis and perspectives on evolving markets, value chains, business opportunities, and trade dynamics within a rapidly changing global economy.", image: areaImages[6] },
      { title: "Cultural Heritage", body: "Perspectives exploring the role of cultural heritage in preserving identity, enriching communities, and creating sustainable cultural and economic value for future generations.", image: areaImages[7] },
      { title: "Natural Resources", body: "Content focused on maximizing the value of natural resources and advancing responsible resource management to support long-term development.", image: areaImages[8] },
      { title: "Industry 4.0", body: "Specialized insights into the Fourth Industrial Revolution, smart transformation, automation, and the technologies redefining the future of industry.", image: areaImages[9] },
    ],
  },
  ambition: {
    label: "Knowledge Ambition 2030",
    title: "Expanding Knowledge... Growing Impact",
    items: [
      { value: "+500", label: "Specialized Insights & Articles", body: "Knowledge-driven content that enriches professional dialogue and deepens understanding of future-focused issues and sectors." },
      { value: "+100", label: "Research Studies & Knowledge Papers", body: "Research-based and analytical content that supports informed understanding, decision-making, and professional discourse." },
      { value: "+1,000", label: "Trusted References & Sources", body: "Global studies, reports, research publications, and credible sources that strengthen the quality and reliability of our content." },
      { value: "10", label: "Strategic Knowledge Domains", body: "Covering the key development priorities, transformation drivers, and future sectors aligned with Startime’s vision." },
      { value: "+50,000", label: "Readers & Professionals", body: "A growing knowledge community of professionals, researchers, and decision-makers across local and international markets." },
      { value: "+10,000", label: "Knowledge Citations & References", body: "Reference-quality content that contributes to studies, research papers, and professional publications." },
    ],
  },
  credibility: {
    label: "Scientific Credibility",
    title: "Knowledge Is a Responsibility Before It Becomes Content",
    paragraphs: [
      "We are committed to developing content that investors, researchers, specialists, students, and professional organizations can rely on, reference, and cite in support of investment decisions, market research, and professional discussions, contributing to the expansion of knowledge and the advancement of content quality.",
      "We regard knowledge as a responsibility. Therefore, all published materials undergo review, editorial refinement, and documentation prior to publication. We are also committed to maintaining a clear distinction between facts, opinions, and professional analysis, while properly citing authoritative references and sources whenever required by the nature of the content.",
    ],
  },
  property: {
    label: "Intellectual Property",
    title: "Protecting Knowledge, Encouraging Its Exchange",
    body: "At Startime, we believe that knowledge derives its true value from being shared, utilized, and built upon, while respecting the intellectual property rights of its creators. Therefore, all content published through the Startime Insights Platform is protected by applicable intellectual property and copyright laws. Citation and quotation for research, educational, and media purposes are permitted, provided that proper source attribution is clearly maintained. All publishing rights and commercial usage rights, however, remain exclusively reserved by Startime.",
  },
  contribution: {
    label: "Share Your Insights",
    title: "Because knowledge grows through dialogue and is strengthened by the exchange of expertise",
    body: "We welcome contributions from researchers, subject-matter experts, professionals, and individuals with distinctive experiences who seek to enrich knowledge through meaningful content that creates real value, supports development, and contributes to understanding the future of the sectors at the heart of our focus.",
    fields: ["Full Name*", "Organization / Employer*", "Job Title*", "Area of Expertise", "Mobile Number", "Email Address*", "Insight / Article Title", "Attachments"],
    submit: "Submit",
  },
};

const ar: InsightsContent = {
  hero: {
    label: "رؤى ستارتايم",
    title: "بثقافتنا المحلية وعقليتنا العالمية",
    continuation: "نستبصر المستقبل",
    body: "رؤى وتحليلات تستشرف التحولات التي تشكل ملامح المستقبل.",
  },
  introduction: "في ستارتايم، ننظر إلى المعرفة باعتبارها أحد أهم الممكنات لصناعة المستقبل وبناء القيمة المستدامة، ولذلك نوثق من خلال منصة الرؤى قراءاتنا وتحليلاتنا واستشرافنا للقضايا والتحولات التي تشكل ملامح المستقبل، ونشارك محتوى معرفيًا يثري الحوار المهني، ويدعم تبادل الخبرات، ويسهم في بناء فهم أعمق للفرص والتحديات التي تواجه القطاعات الاقتصادية والتنموية ذات الأولوية.",
  archive: { label: "مدونة ستارتايم", title: "أحدث المقالات والرؤى" },
  areas: {
    label: "مجالات الرؤى",
    title: "معرفة متخصصة لاستشراف المستقبل",
    items: [
      { title: "الأمن الوطني", body: "تحليلات تستكشف التحديات والمتغيرات التي تؤثر في أمن الدول واستقرارها وقدرتها على مواكبة التغير.", image: areaImages[0] },
      { title: "القدرات الدفاعية", body: "معرفة متخصصة تسلط الضوء على الصناعات الدفاعية والتوطين والتقنيات العسكرية وممكنات بناء القدرات الوطنية.", image: areaImages[1] },
      { title: "الاقتصاد والاستثمار", body: "قراءات معمقة للتوجهات الاقتصادية والفرص الاستثمارية والعوامل التي تقود النمو والتنافسية المستدامة.", image: areaImages[2] },
      { title: "التقنيات المتقدمة", body: "محتوى يستشرف مستقبل التقنيات الناشئة ودورها في إعادة تشكيل الاقتصادات والقطاعات والمجتمعات.", image: areaImages[3] },
      { title: "الاستدامة والبيئة", body: "رؤى تواكب التحولات البيئية العالمية وتناقش فرص الاستدامة وإدارة الموارد والاقتصاد الأخضر.", image: areaImages[4] },
      { title: "الصحة وجودة الحياة", body: "معرفة متخصصة تستعرض التوجهات الصحية الحديثة والحلول التي تسهم في بناء مجتمعات مزدهرة.", image: areaImages[5] },
      { title: "التجارة والأعمال", body: "تحليلات ورؤى تتناول تطور الأسواق وسلاسل القيمة وفرص الأعمال والتجارة في الاقتصاد العالمي المتغير.", image: areaImages[6] },
      { title: "الموروث الثقافي", body: "قراءات تستكشف مستقبل السياحة ودورها في التنمية الاقتصادية وتعزيز الوجهات وبناء التجارب المستدامة.", image: areaImages[7] },
      { title: "الموارد الطبيعية", body: "محتوى يسلط الضوء على تعظيم الاستفادة من الثروات الطبيعية وإدارة الموارد بما يدعم التنمية طويلة المدى.", image: areaImages[8] },
      { title: "الصناعة 4.0", body: "رؤى متخصصة حول الثورة الصناعية الرابعة والتحول الذكي والأتمتة والتقنيات التي تعيد تشكيل مستقبل الصناعة.", image: areaImages[9] },
    ],
  },
  ambition: {
    label: "طموح المعرفة 2030",
    title: "معرفة تتوسع... وتأثير يتنامى",
    items: [
      { value: "+500", label: "رؤية ومقالة متخصصة", body: "إنتاج معرفي يثري الحوار المهني ويعمق الفهم حول القضايا والقطاعات المستقبلية." },
      { value: "+100", label: "دراسة وورقة معرفية", body: "محتوى بحثي وتحليلي يدعم الفهم وصناعة القرار والحوار المهني." },
      { value: "+1,000", label: "مرجع ومصدر موثوق", body: "دراسات وتقارير وأبحاث عالمية ومصادر تدعم جودة المحتوى وموثوقية الاستدلال." },
      { value: "10", label: "مجالات إستراتيجية", body: "تغطي أولويات التنمية والتحول والقطاعات المستقبلية التي ترتبط برؤية ستارتايم." },
      { value: "+50,000", label: "قارئ ومتخصص", body: "مجتمع معرفي من المهنيين والباحثين وصناع القرار محليًا ودوليًا." },
      { value: "+10,000", label: "استشهاد واقتباس معرفي", body: "محتوى مرجعي يساهم في الدراسات والأبحاث والتقارير المهنية." },
    ],
  },
  credibility: {
    label: "الموثوقية العلمية",
    title: "المعرفة مسؤولية قبل أن تكون محتوى",
    paragraphs: [
      "نسعى إلى تطوير محتوى يمكن المستثمرين والباحثين والمتخصصين والطلاب والجهات المهنية الاستفادة منه والاستشهاد به لدعم القرار الاستثماري والأبحاث السوقية والمناقشات المهنية، بما يسهم في توسيع دائرة المعرفة وتعزيز جودة المحتوى.",
      "نلتزم بالتعامل مع المعرفة باعتبارها مسؤولية، ولذلك تخضع المواد المنشورة للمراجعة والتحرير والتوثيق قبل نشرها، مع الحرص على الفصل بين الحقائق والآراء والتحليلات المهنية، والإشارة إلى المصادر المرجعية متى ما تطلبت طبيعة المحتوى ذلك.",
    ],
  },
  property: {
    label: "الملكية الفكرية",
    title: "نحمي المعرفة ونشجع تداولها",
    body: "تؤمن ستارتايم بأن المعرفة تكتسب قيمتها من تداولها والاستفادة منها، مع احترام حقوق الملكية الفكرية لمصدريها. لذلك تخضع جميع المواد المنشورة في منصة الرؤى للحماية القانونية، ويُسمح بالاستشهاد والاقتباس منها لأغراض البحث والتعليم والإعلام مع توثيق المصدر، بينما يحتفظ المحتوى بكامل حقوق النشر والاستخدام التجاري لستارتايم.",
  },
  contribution: {
    label: "شاركنا الرؤى",
    title: "لأن المعرفة تنمو بالحوار وتتكامل بتبادل الخبرات",
    body: "نرحب بمساهمات الباحثين والخبراء والمهنيين وأصحاب التجارب النوعية الراغبين في إثراء المعرفة بمحتوى يضيف قيمة حقيقية ويسهم في دعم التنمية واستشراف مستقبل القطاعات التي نتمحور حولها.",
    fields: ["الاسم*", "جهة العمل*", "المنصب*", "مجال التخصص", "محمول", "بريد إلكتروني", "موضوع المدونة", "المرفقات"],
    submit: "أرسل",
  },
};

export const insightsContent: Record<Locale, InsightsContent> = { en, ar };
