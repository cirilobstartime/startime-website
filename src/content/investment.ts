import type { Locale } from "@/content/home";

type InvestmentItem = { title: string; body: string };
type ImpactItem = InvestmentItem & { points: string[] };
type ProjectItem = InvestmentItem & { image: string; logo?: string };
type ProjectPortfolio = { title: string; items: ProjectItem[] };

export type InvestmentContent = {
  hero: { title: string; lead: string; items: string[] };
  philosophy: { label: string; title: string; body: string[] };
  domains: { label: string; title: string; items: InvestmentItem[] };
  portfolios: { label: string; title: string; items: InvestmentItem[] };
  approach: { label: string; title: string; items: InvestmentItem[] };
  impact: { label: string; title: string; items: ImpactItem[] };
  projects: { label: string; title: string; body: string; portfolios: ProjectPortfolio[]; cta: string };
  closing: { title: string; subtitle: string; body: string; cta: string; ctaURL: string };
};

const projectImages = {
  maritime: "/assets/projects/maritime-forum-featured-v2.webp",
  command: "/assets/editorial/startime-triple-s-command-center.webp",
  industrial: "/assets/projects/industrial-security-v2.webp",
  blue: "/assets/projects/blue-economy-v2.webp",
  oil: "/assets/editorial/startime-team-ministry-environment-event.png",
  unmanned: "/assets/projects/unmanned-systems-v2.webp",
  semiconductor: "/assets/projects/semiconductor-v2.webp",
  mining: "/assets/projects/mining-v2.webp",
  drug: "/assets/projects/pharmaceutical-security-v2.webp",
  cities: "/assets/projects/smart-cities-v2.webp",
  women: "/assets/editorial/startime-careers-creative-team.webp",
  lifestyle: "/assets/editorial/news-partnership.webp",
};

const en: InvestmentContent = {
  hero: {
    title: "Investment",
    lead: "We Are Positioned Around",
    items: [
      "Defense Capabilities",
      "National Security",
      "Advanced Technologies",
      "Environmental Priorities",
      "Women Empowerment & Next Gen. Development",
    ],
  },
  philosophy: {
    label: "INVESTMENT PHILOSOPHY",
    title: "Our Projects are Built Around a Clear Vision",
    body: [
      "Our projects are not developed in isolation from our vision. They are shaped within a well-defined investment portfolio centered around five strategic sectors that guide every decision we make.",
      "Through this approach, we innovate, invest in, and develop high-impact projects that create tangible value, directly support the priorities of Saudi Arabia, and contribute to shaping the future of the sectors we serve.",
      "By aligning every project with our strategic direction, we ensure that our investments strengthen our impact, expand our opportunities, and steadily advance us toward the ambitious goals we aspire to achieve.",
    ],
  },
  domains: {
    label: "INVESTMENT DOMAINS",
    title: "Priorities Driving Our Investments Toward Sustainable Impact",
    items: [
      { title: "Defense Capabilities", body: "The advancement of defense capabilities represents a strategic pillar of Saudi Arabia’s national ambitions to increase localization, strengthen technological sovereignty, and develop world-class national capabilities. Accordingly, Startime invests in business initiatives and industry events that accelerate knowledge transfer, expand industrial partnerships, and stimulate investment in advanced defense technologies, contributing to a more competitive, resilient, and self-sustaining defense ecosystem." },
      { title: "National Security", body: "Rapid global transformations require a comprehensive approach to national security that encompasses maritime security, cybersecurity, food security, and supply chain resilience. In response, Startime invests in specialized initiatives and high-level forums that bring together decision-makers, experts, and leaders of critical sectors to advance strategic dialogue, strengthen national preparedness, and support the sustainability of economic and social development." },
      { title: "Advanced Technologies", body: "The world is experiencing an unprecedented race toward artificial intelligence, autonomous intelligent systems, semiconductors, and advanced technologies, all of which serve as key drivers of future economic growth. For this reason, Startime focuses on developing specialized business events and exhibitions that accelerate the adoption of emerging technologies, support their localization, and connect investors with innovators and global industry leaders, reinforcing Saudi Arabia’s position as a regional hub for technology and innovation." },
      { title: "Environmental Priorities", body: "Environmental sustainability, resource management, and the pursuit of carbon neutrality have become national and global priorities that are reshaping economies and industries worldwide. Consequently, Startime invests in initiatives that foster dialogue around environmental challenges and green economy opportunities, promote sustainable development, and transform environmental challenges into long-term investment and development opportunities." },
      { title: "Women Empowerment & Future Next Gen Development", body: "Human capital remains the most critical enabler of Saudi Vision 2030, while women’s participation and the development of future generations stand among Saudi Arabia most important drivers of sustainable economic growth. Therefore, Startime directs its investments toward initiatives and events that advance capability building, strengthen economic participation, and empower future leaders, contributing to a more vibrant, prosperous, and productive society." },
    ],
  },
  portfolios: {
    label: "INVESTMENT PORTFOLIOS",
    title: "We Curate Experiences to Inspire Communities and Create Ultimate Impact",
    items: [
      { title: "Startime Government Portfolio", body: "We develop high-level national initiatives and business events that support the objectives of government entities, Saudi Vision 2030 programs and projects, and future national priorities. Through these initiatives, we contribute to accelerating the achievement of Saudi Arabia’s strategic goals by creating platforms for dialogue and collaboration that bring together decision-makers, experts, and leaders of critical sectors." },
      { title: "Startime Business Portfolio", body: "We create international trade exhibitions, specialized forums, and industry-focused gatherings that serve high-potential economic sectors. These platforms stimulate investment, facilitate knowledge exchange, strengthen commercial partnerships, support market growth, enhance the competitiveness of national industries, and generate sustainable economic opportunities." },
      { title: "Startime Community Portfolio", body: "We design initiatives and community-focused events that address national priorities, contribute to human capital development, enhance quality of life, and empower women and future generations. In parallel, we develop events and initiatives that support the objectives of the non-profit sector, cooperative organizations, productive families, and entrepreneurship projects, creating sustainable social impact aligned with the ambitions of Saudi Vision 2030." },
    ],
  },
  approach: {
    label: "From Idea to Impact",
    title: "A Disciplined Investment Approach That Begins with Foresight and Ends with Impact",
    items: [
      { title: "Opportunity Foresight", body: "We monitor economic, developmental, and sectoral transformations across local and global markets to identify promising opportunities before future markets emerge." },
      { title: "Market Intelligence", body: "We collect data and analyze indicators, trends, regulations, and market dynamics to develop a comprehensive understanding of the sectors we serve." },
      { title: "Gap Analysis", body: "We assess market gaps and unmet needs against global benchmarks and best practices to identify opportunities with the highest potential for value creation." },
      { title: "Concept Development", body: "We transform insights and opportunities into preliminary concepts and project ideas that address emerging challenges and align with national and sector priorities." },
      { title: "Evaluation & Validation", body: "Project concepts undergo rigorous review with industry experts and strategic partners to ensure credibility, scalability, and long-term sustainability." },
      { title: "Feasibility & Sustainability", body: "We evaluate projected impact, economic returns, operational feasibility, and long-term sustainability before approving projects and moving forward with implementation." },
      { title: "Business Model Development", body: "We design the project’s business model, identity, partnership ecosystem, objectives, and performance indicators to establish a strong foundation for success and continuity." },
      { title: "Investment & Establishment", body: "We allocate resources, build strategic partnerships, and establish the necessary enablers required to launch projects with efficiency, competitiveness, and long-term viability." },
      { title: "Operations & Execution", body: "Projects are delivered through internationally recognized methodologies and professional operating frameworks that ensure execution excellence and the achievement of intended outcomes." },
      { title: "Impact Assessment", body: "We measure the economic, knowledge-based, and societal value generated by each project to ensure objectives are achieved, impact is maximized, and national, investment, and community outcomes remain sustainable over time." },
    ],
  },
  impact: {
    label: "Legacy & Impact",
    title: "Startime Investment... A Legacy Passed from One Generation to the Next",
    items: [
      { title: "Global Development Impact", body: "Our investments and specialized projects are designed to contribute to addressing shared development challenges and supporting international efforts toward a more sustainable and prosperous future. Through our initiatives and specialized business events, we foster global partnerships, advance knowledge exchange, and accelerate solutions that support the United Nations Sustainable Development Goals (SDGs).", points: ["Supporting the United Nations Sustainable Development Goals (SDGs)", "Strengthening global partnerships for sustainable development", "Advancing innovation, knowledge, and sustainable economic growth", "Contributing to human capital development and capacity building", "Supporting environmental sustainability and the green economy", "Promoting equality, women's empowerment, and future generations development", "Supporting sustainable economic growth and job creation", "Encouraging international collaboration and knowledge exchange"] },
      { title: "National Impact", body: "Our investment portfolios and specialized projects contribute to advancing national development objectives and strengthening Saudi Arabia’s position as a global hub for business, investment, and innovation. They also support priority sectors, stimulate sustainable economic growth, and create long-term value aligned with the ambitions of Saudi Vision 2030.", points: ["Supporting the achievement of Saudi Vision 2030", "Contributing to progress in global competitiveness indicators", "Attracting foreign direct investment (FDI)", "Contributing to the growth of local content", "Supporting greater efficiency in government spending", "Contributing to non-oil GDP growth", "Supporting localization objectives"] },
      { title: "Industry Impact", body: "We contribute to the advancement of the MICE industry as a key enabler of economic growth, investment attraction, and knowledge exchange. Through our initiatives and projects, we strengthen Saudi Arabia’s competitiveness, attract specialized events, and enhance the sector’s readiness to keep pace with evolving global economic trends.", points: ["Strengthening the competitiveness of the Saudi MICE industry", "Stimulating markets and expanding business opportunities", "Supporting the utilization of venues and logistics infrastructure", "Creating new project opportunities for industry partners", "Facilitating knowledge transfer and national capability development", "Generating employment and job opportunities"] },
      { title: "Partnership Impact", body: "We believe that strategic partnerships are among the most important enablers of sustainable impact and long-term value creation. Therefore, we are committed to building enduring relationships founded on trust, complementary strengths, and mutual value, enhancing the collective ability to achieve shared objectives.", points: ["Strengthening the credibility of government partnerships", "Expanding networks and building strategic alliances", "Enhancing national and international collaboration", "Connecting investors with key stakeholders"] },
      { title: "Startime Growth Impact", body: "These investments represent a progressive pathway toward achieving Startime’s long-term vision, through the development of more mature investment portfolios, the expansion of specialized projects, and the strengthening of our national and international presence, enabling us to create greater and more sustainable impact.", points: ["Growth of Startime investment portfolios", "Expansion in the number of specialized projects", "Strengthening Startime’s national and international presence", "Advancing toward the realization of Startime Vision 2030"] },
    ],
  },
  projects: {
    label: "Startime Projects",
    title: "With Relentless Momentum... We Create More to Empower Communities",
    body: "We develop high-level national initiatives and business events, create specialized international exhibitions and forums, and design impactful community initiatives through three integrated investment portfolios that support the objectives of Saudi Vision 2030, stimulate investment, facilitate knowledge transfer, empower people, strengthen partnerships, and create sustainable economic, knowledge-based, and social impact that extends across generations.",
    cta: "Discover More",
    portfolios: [
      { title: "Startime Government Portfolio", items: [
        { title: "Saudi International Maritime Forum", body: "A sovereign platform that explores the future of maritime security and strengthens national readiness", image: projectImages.maritime, logo: "/assets/project-logos/simf.png" },
        { title: "Saudi International Command & Control Forum", body: "A specialized forum focused on the future of command, control, and multi-domain operations", image: projectImages.command },
        { title: "Global Industrial Security Expo", body: "An international event supporting the protection of critical infrastructure and enhancing industrial operational reliability", image: projectImages.industrial, logo: "/assets/project-logos/industrial-security.jpg" },
        { title: "Saudi International Blue Economy Forum", body: "A national platform that unlocks maritime opportunities to support economic growth and sustainability", image: projectImages.blue, logo: "/assets/project-logos/blue-economy.png" },
        { title: "Saudi International Oil Spill Response Forum", body: "A specialized initiative dedicated to strengthening environmental response readiness and protecting marine resources", image: projectImages.oil },
      ] },
      { title: "Startime Business Portfolio", items: [
        { title: "Saudi International Unmanned Systems Expo", body: "An international exhibition accelerating innovation and the localization of autonomous and semi-autonomous technologies", image: projectImages.unmanned, logo: "/assets/project-logos/unmanned.png" },
        { title: "Saudi International Semiconductor Expo", body: "A strategic event supporting the future of advanced technology industries", image: projectImages.semiconductor, logo: "/assets/project-logos/semiconductor.png" },
        { title: "Saudi International Mining Technologies Expo", body: "A specialized business platform supporting the growth of the mining sector and maximizing the value of its resources", image: projectImages.mining, logo: "/assets/project-logos/mining.png" },
        { title: "Saudi International Drug & Medical Supply Security Exhibition", body: "A specialized event that strengthens healthcare supply security and supports the localization of pharmaceutical industries", image: projectImages.drug, logo: "/assets/project-logos/drug-security.jpg" },
        { title: "Saudi International Urban Planning & Cities Automation Expo", body: "A platform showcasing smart city solutions and sustainable urban transformation", image: projectImages.cities, logo: "/assets/project-logos/smart-cities.png" },
      ] },
      { title: "Startime Community Portfolio", items: [
        { title: "Saudi Women Forum", body: "A national platform that supports women’s empowerment and strengthens their role in sustainable development", image: projectImages.women },
        { title: "Saudi International Lifestyle Medicine Forum", body: "A specialized initiative that promotes preventive healthcare and enhances quality of life for individuals and communities", image: projectImages.lifestyle },
      ] },
    ],
  },
  closing: {
    title: "Do You Have an Idea Worth Bringing to Life?",
    subtitle: "We Welcome Ideas That Create Value and Deliver Sustainable Impact",
    body: "We believe that great projects begin with promising ideas. That is why we welcome collaboration with government entities, leading corporations, entrepreneurs, and initiative owners to explore opportunities for partnership and develop projects that contribute to national priorities while creating lasting economic, knowledge-based, and societal impact.",
    cta: "Share Your Idea With Us",
    ctaURL: "mailto:info@startime.sa",
  },
};

const ar: InvestmentContent = {
  hero: {
    title: "الاستثمار",
    lead: "نتمحور سوقيًا حول",
    items: ["القدرات الدفاعية", "الأمن الوطني", "التقنيات المتقدمة", "القضايا البيئية", "تمكين المرأة وتنمية الأجيال"],
  },
  philosophy: {
    label: "فلسفة الاستثمار",
    title: "مشاريعنا لا تُبنى بمعزل عن رؤيتنا",
    body: ["وإنما تُصاغ ضمن محفظة استثمارية واضحة ترتكز على خمس قطاعات استراتيجية، نضعها نصب أعيننا في كل خطوة؛ لذا نحن نبتكر ونستثمر ونطور مشاريع نوعية تحقق قيمة مضافة حقيقية وتدعم بشكل مباشر أولويات المملكة العربية السعودية، وتسهم في تشكيل مستقبل القطاعات التي نخدمها؛ لنضمن أن مشاريعنا ستعزز أثرنا وتقودنا بثبات نحو تحقيق غاياتنا الطموحة."],
  },
  domains: {
    label: "مسارات الاستثمار",
    title: "أولويات تقود استثمارنا لبناء أثر مستدام",
    items: [
      { title: "القدرات الدفاعية", body: "يمثل تطوير القدرات الدفاعية واحدًا من الركائز الاستراتيجية لمستهدفات المملكة العربية السعودية في رفع نسب التوطين وتعزيز الاستقلالية التقنية وتطوير القدرات الوطنية؛ لذلك نوجه استثمارات ستارتايم نحو المبادرات وفعاليات الأعمال التي تساهم في تسريع نقل المعرفة وتوسيع الشراكات الصناعية وتحفيز الاستثمار في التقنيات الدفاعية المتقدمة، بما يدعم نمو منظومة دفاعية وطنية أكثر تنافسية واستدامة." },
      { title: "الأمن الوطني", body: "تتطلب التحولات العالمية المتسارعة تطوير منظومة أمنية شاملة تشمل الأمن البحري والأمن السيبراني والأمن الغذائي وأمن سلاسل الإمداد؛ ومن هذا المنطلق نستثمر في ستارتايم بتبني المبادرات والملتقيات المتخصصة التي تجمع صناع القرار والخبراء وقادة القطاعات الحيوية لتمكين الحوار الاستراتيجي، وتعزيز الجاهزية الوطنية، ودعم استدامة التنمية الاقتصادية والاجتماعية." },
      { title: "التقنيات المتقدمة", body: "يشهد العالم سباقًا متسارعًا نحو الذكاء الاصطناعي والأنظمة الذكية المستقلة وأشباه الموصلات والتقنيات المتقدمة، وهي قطاعات تمثل محركًا رئيسيًا للنمو الاقتصادي المستقبلي؛ لذلك نركز في ستارتايم على تطوير فعاليات الأعمال والمعارض المتخصصة التي تسرّع تبني التقنيات الناشئة، وتدعم توطينها، وتربط المستثمرين بالمبتكرين والشركات العالمية، بما يعزز مكانة المملكة كمركز إقليمي للتقنية والابتكار." },
      { title: "القضايا البيئية", body: "أصبحت الاستدامة البيئية وإدارة الموارد وتحقيق الحياد الكربوني من الأولويات العالمية والوطنية التي تعيد تشكيل الاقتصادات والقطاعات المختلفة؛ ولهذا نستثمر في ستارتايم على المبادرات التي تدعم الحوار حول التحديات البيئية وفرص الاقتصاد الأخضر، وتسهم في تعزيز الاستدامة وتحويل التحديات البيئية إلى فرص تنموية واستثمارية طويلة الأمد." },
      { title: "تمكين المرأة وتنمية الأجيال", body: "يمثل رأس المال البشري المحرك الأهم لتحقيق مستهدفات رؤية السعودية 2030، وتعد مشاركة المرأة وتنمية قدرات الأجيال القادمة من أبرز الممكنات لتحقيق نمو اقتصادي مستدام؛ لذلك نوجه استثمارات ستارتايم نحو المبادرات والفعاليات التي تدعم بناء القدرات، وتعزيز المشاركة الاقتصادية، وتمكين القيادات المستقبلية، بما يسهم في بناء مجتمع أكثر ازدهارًا وحيوية وإنتاجية." },
    ],
  },
  portfolios: {
    label: "المحافظ الاستثمارية",
    title: "نخصص التجربة لنلهم المجتمعات ونصنع الأثر الذي لا يُضاهى",
    items: [
      { title: "محفظة ستارتايم للحكومات", body: "نطور مبادرات وطنية وفعاليات أعمال نوعية رفيعة المستوى، تدعم مستهدفات مكونات القطاع الحكومي وبرامج ومشاريع رؤية السعودية 2030 وأولويات المستقبل، وتسهم في تسريع تحقيق المستهدفات الاستراتيجية للمملكة العربية السعودية من خلال بناء منصات للحوار والتعاون تجمع صناع القرار والخبراء وقادة القطاعات الحيوية." },
      { title: "محفظة ستارتايم للأعمال", body: "نبتكر معارض تجارية دولية ومنتديات وملتقيات متخصصة تستهدف قطاعات الأعمال الواعدة، وتعمل على تحفيز الاستثمار ونقل المعرفة وتعزيز الشراكات التجارية، بما يدعم نمو الأسواق ويرفع تنافسية القطاعات الوطنية ويخلق فرصًا اقتصادية مستدامة." },
      { title: "محفظة ستارتايم للمجتمع", body: "نصمم مبادرات وفعاليات مجتمعية تعالج قضايا ذات أولوية وطنية وتسهم في تنمية رأس المال البشري وتعزيز جودة الحياة وتمكين المرأة والأجيال القادمة، إلى جانب تطوير أحداث ومبادرات تدعم مستهدفات القطاع غير الربحي والقطاع التعاوني والأسر المنتجة ومشاريع ريادة الأعمال، بما يرسخ أثرًا اجتماعيًا مستدامًا يتماشى مع مستهدفات رؤية السعودية 2030." },
    ],
  },
  approach: {
    label: "من الفكرة إلى الأثر",
    title: "نهج استثماري مدروس يبدأ بالاستبصار وينتهي بالتأثير",
    items: [
      { title: "استشراف الفرص", body: "نرصد التحولات الاقتصادية والتنموية والقطاعية محليًا وعالميًا لاستكشاف الفرص الواعدة قبل ظهور الأسواق المستقبلية." },
      { title: "استخبارات الأسواق", body: "نجمع البيانات ونحلل المؤشرات والتوجهات والتشريعات والمتغيرات المؤثرة لبناء فهم عميق للمشهد القطاعي." },
      { title: "تحليل الفجوات", body: "نقيس الفجوات السوقية والاحتياجات غير المخدومة ونقارنها بأفضل الممارسات والتجارب العالمية لتحديد الفرص ذات الجدوى الأعلى." },
      { title: "تطوير المفهوم", body: "نحول المعطيات والفرص إلى أفكار أولية ومفاهيم مشاريع تستجيب للتحديات وتواكب الأولويات الوطنية والقطاعية." },
      { title: "التحكيم والتقييم", body: "تخضع الأفكار لمراجعات متخصصة بمشاركة الخبراء والشركاء الاستراتيجيين لضمان موثوقيتها وقابليتها للنمو والاستدامة." },
      { title: "الجدوى والاستدامة", body: "نقيّم الأثر المتوقع والعوائد الاقتصادية والجدوى التشغيلية والاستدامة طويلة المدى قبل اعتماد الأعمال والبدء فيها." },
      { title: "بناء نموذج العمل", body: "نصمم نموذج العمل وهوية المشروع ومنظومة الشراكات والأهداف والمؤشرات التي تقود نجاح المشروع وتضمن استدامته." },
      { title: "الاستثمار والتأسيس", body: "نوفر الموارد اللازمة ونبني الشراكات الاستراتيجية ونؤسس الممكنات اللازمة والمطلوبة لإطلاق المشروع بكفاءة وتنافسية." },
      { title: "التشغيل والتنفيذ", body: "ندير المشروع وفق أفضل الممارسات العالمية ومنهجيات التشغيل الاحترافية التي تضمن جودة التنفيذ وتحقيق المستهدف." },
      { title: "قياس الأثر", body: "نقيس القيمة الاقتصادية والمعرفية والمجتمعية للمشروع لضمان تحقيق أهدافه وتعظيم أثره الوطني والاستثماري والمجتمعي واستدامة نتائجه." },
    ],
  },
  impact: {
    label: "الإرث والأثر",
    title: "استثمار ستارتايم... إرث تتوارثه الأجيال",
    items: [
      { title: "الأثر التنموي العالمي", body: "تستهدف استثماراتنا ومشاريعنا النوعية الإسهام في معالجة التحديات التنموية المشتركة ودعم الجهود الدولية الرامية إلى بناء مستقبل أكثر استدامة وازدهارًا. ومن خلال مبادراتنا وفعاليات الأعمال المتخصصة، نعمل على تعزيز الشراكات العالمية وتبادل المعرفة وتسريع الحلول التي تدعم أهداف التنمية المستدامة للأمم المتحدة.", points: ["دعم أهداف التنمية المستدامة للأمم المتحدة (SDGs)", "تعزيز الشراكات العالمية لتحقيق التنمية المستدامة", "دعم الابتكار والمعرفة والاقتصاد المستدام", "المساهمة في تنمية رأس المال البشري وبناء القدرات", "دعم الاستدامة البيئية والاقتصاد الأخضر", "تعزيز المساواة وتمكين المرأة وتنمية الأجيال", "دعم النمو الاقتصادي المستدام وخلق فرص العمل", "تشجيع التعاون الدولي وتبادل الخبرات والمعرفة"] },
      { title: "الأثر الوطني", body: "تُسهم محافظنا الاستثمارية ومشاريعنا النوعية في دعم مستهدفات التنمية الوطنية وتعزيز مكانة المملكة العربية السعودية كمركز عالمي للأعمال والاستثمار والابتكار. كما تعمل على تمكين القطاعات ذات الأولوية وتحفيز النمو الاقتصادي المستدام وخلق قيمة مضافة تتماشى مع مستهدفات رؤية السعودية 2030.", points: ["دعم تحقيق رؤية السعودية 2030", "المساهمة في التقدم بمؤشرات التنافسية العالمية", "جذب الاستثمار الأجنبي المباشر", "المساهمة في رفع المحتوى المحلي", "دعم رفع كفاءة الإنفاق الحكومي", "المساهمة في الناتج المحلي غير النفطي", "دعم مستهدفات التوطين"] },
      { title: "الأثر القطاعي", body: "نعمل على تطوير قطاع اجتماعات الأعمال بوصفه أحد القطاعات الممكنة للنمو الاقتصادي وجذب الاستثمار ونقل المعرفة. ومن خلال مشاريعنا ومبادراتنا، نسهم في تعزيز تنافسية المملكة العربية السعودية واستقطاب الفعاليات المتخصصة ورفع جاهزية القطاع لمواكبة التحولات المتسارعة في المشهد الاقتصادي العالمي.", points: ["رفع تنافسية قطاع اجتماعات الأعمال السعودي", "تنشيط السوق وزيادة فرص الأعمال", "تشغيل المرافق والبنى التحتية اللوجستية", "زيادة فرص المشاريع لشركاء القطاع", "نقل المعرفة وبناء القدرات الوطنية", "توليد الوظائف وخلق فرص العمل"] },
      { title: "أثر الشراكات", body: "نؤمن بأن الشراكات الاستراتيجية تمثل أحد أهم الممكنات لتحقيق الأثر المستدام وتعظيم القيمة المضافة. ولهذا نحرص على بناء منظومة علاقات طويلة الأمد تقوم على الثقة وتكامل الأدوار وتبادل المنافع، بما يعزز القدرة الجماعية على تحقيق الأهداف المشتركة.", points: ["رفع موثوقية الشركاء الحكوميين", "توسيع شبكة العلاقات وبناء التحالفات", "تعزيز التعاون الوطني والدولي", "ربط المستثمرين وأصحاب المصلحة"] },
      { title: "أثر نمو ستارتايم", body: "تمثل هذه الاستثمارات مسارًا متدرجًا نحو تحقيق رؤية ستارتايم طويلة المدى، عبر تطوير محافظ استثمارية أكثر نضجًا وتوسيع نطاق المشاريع النوعية وتعزيز الحضور الوطني والدولي، بما يدعم قدرتنا على صناعة أثر أكبر وأكثر استدامة.", points: ["نمو محافظ ستارتايم الاستثمارية", "زيادة عدد المشاريع النوعية", "توسيع حضور ستارتايم محليًا ودوليًا", "التقدم نحو تحقيق رؤية ستارتايم 2030"] },
    ],
  },
  projects: {
    label: "مشاريع ستارتايم",
    title: "بنبض لا ينقطع... نصنع الكثير لنُمكّن المجتمعات",
    body: "نطور مبادرات وطنية وفعاليات أعمال رفيعة المستوى، ونبتكر معارض ومنتديات دولية متخصصة، ونصمم مبادرات مجتمعية نوعية؛ ضمن ثلاث محافظ استثمارية متكاملة تسهم في دعم مستهدفات رؤية السعودية 2030، وتحفيز الاستثمار، ونقل المعرفة، وتمكين الإنسان، وتعزيز الشراكات، وصناعة أثر اقتصادي ومعرفي ومجتمعي مستدام يمتد عبر الأجيال.",
    cta: "اكتشف المزيد",
    portfolios: [
      { title: "محفظة ستارتايم للحكومات", items: [
        { title: "الملتقى البحري السعودي الدولي", body: "منصة سيادية تستشرف مستقبل الأمن البحري وتعزز الجاهزية الوطنية", image: projectImages.maritime, logo: "/assets/project-logos/simf.png" },
        { title: "الملتقى السعودي الدولي للقيادة والسيطرة", body: "ملتقى متخصص يناقش مستقبل القيادة والسيطرة والعمليات متعددة المجالات", image: projectImages.command },
        { title: "المعرض العالمي للأمن الصناعي", body: "حدث دولي يدعم حماية المنشآت الحيوية ورفع موثوقية العمليات الصناعية", image: projectImages.industrial, logo: "/assets/project-logos/industrial-security.jpg" },
        { title: "الملتقى السعودي الدولي للاقتصاد الأزرق", body: "منصة وطنية تستثمر في الفرص البحرية لدعم النمو والاستدامة الاقتصادية", image: projectImages.blue, logo: "/assets/project-logos/blue-economy.png" },
        { title: "الملتقى السعودي الدولي للاستجابة للتلوث النفطي", body: "مبادرة متخصصة في تعزيز جاهزية الاستجابة البيئية وتحمي الموارد البحرية", image: projectImages.oil },
      ] },
      { title: "محفظة ستارتايم للأعمال", items: [
        { title: "المعرض السعودي الدولي للأنظمة غير المأهولة", body: "معرض دولي يسرّع الابتكار وتوطين تقنيات الأنظمة الذكية المستقلة وشبه المستقلة", image: projectImages.unmanned, logo: "/assets/project-logos/unmanned.png" },
        { title: "المعرض السعودي الدولي لأشباه الموصلات", body: "حدث استراتيجي يدعم بناء مستقبل الصناعات التقنية المتقدمة", image: projectImages.semiconductor, logo: "/assets/project-logos/semiconductor.png" },
        { title: "المعرض السعودي الدولي لتقنيات التعدين", body: "منصة أعمال متخصصة تدعم نمو قطاع التعدين وتعظيم الاستفادة من موارده", image: projectImages.mining, logo: "/assets/project-logos/mining.png" },
        { title: "المعرض السعودي الدولي للأمن الدوائي", body: "حدث نوعي يعزز أمن الإمدادات الصحية وتوطين الصناعات الدوائية", image: projectImages.drug, logo: "/assets/project-logos/drug-security.jpg" },
        { title: "المعرض السعودي الدولي للتخطيط الحضري وأتمتة المدن", body: "منصة تستعرض حلول المدن الذكية والتحول الحضري المستدام", image: projectImages.cities, logo: "/assets/project-logos/smart-cities.png" },
      ] },
      { title: "محفظة ستارتايم للمجتمع", items: [
        { title: "منتدى سيدات المملكة", body: "منصة وطنية تدعم تمكين المرأة وتعزيز دورها في التنمية المستدامة", image: projectImages.women },
        { title: "الملتقى السعودي الدولي لطب نمط الحياة", body: "مبادرة نوعية تُعزز الوقاية الصحية وترتقي بجودة الحياة للأفراد والمجتمعات", image: projectImages.lifestyle },
      ] },
    ],
  },
  closing: {
    title: "هل لديك فكرة تستحق أن ترى النور؟",
    subtitle: "نرحب بالأفكار التي تصنع قيمة وتخلق أثرًا مستدامًا",
    body: "نؤمن بأن المشاريع الكبرى تبدأ بفكرة واعدة؛ لذلك نرحب بالتواصل مع الجهات الحكومية وكبرى الشركات ورواد الأعمال وأصحاب المبادرات النوعية لاستكشاف فرص التعاون وتطوير مشاريع تسهم في دعم الأولويات الوطنية وصناعة أثر اقتصادي ومعرفي ومجتمعي مستدام.",
    cta: "شارك فكرتك معنا",
    ctaURL: "mailto:info@startime.sa",
  },
};

export const investmentContent: Record<Locale, InvestmentContent> = { en, ar };
