import type { Locale } from "@/content/home";

type Milestone = {
  year: string;
  title: string;
  body: string;
};

type Principle = {
  title: string;
  newPageTitle?: string;
  body: string;
};

type DiscoverContent = {
  hero: { brand: string; title: string };
  introduction: { label: string; title: string; body: string };
  timeline: Milestone[];
  vision: { label: string; title: string; body: string[] };
  ceo: {
    quote: string;
    name: string;
    role: string;
    learnMore: string;
    contact: string;
    bioTitle: string;
    bio: string[];
  };
  methodology: { label: string; title: string; body: string };
  governance: { label: string; title: string; body: string; principles: Principle[] };
  form: {
    title: string;
    fields: string[];
    submit: string;
  };
};

const en: DiscoverContent = {
  hero: {
    brand: "Startime",
    title: "With Our Rich Experience, We Envision the Future",
  },
  introduction: {
    label: "Innovation & Event Creation",
    title: "A Passion That Never Rests",
    body: "Since its inception, Startime has been driven by an ambitious Saudi vision, an authentic identity, and an institutional methodology governed by the highest international standards. Supported by a growing network of partners across the Kingdom and around the world, we continue to move forward with confidence in redefining the concepts of the MICE industry and delivering distinctive events that create value, strengthen partnerships, and generate a sustainable impact that extends beyond the event itself to the economy, knowledge, and society.",
  },
  timeline: [
    {
      year: "2009",
      title: "From the Heart of Najd… Our Story Began",
      body: "Startime was founded on an authentic Saudi vision to redefine the MICE industry, with an ambition that extends beyond event management to creating lasting value and meaningful impact.",
    },
    {
      year: "2014",
      title: "Building Promising Partnerships",
      body: "We expanded our presence through the development of national and international partnerships that strengthened our position and enhanced our ability to deliver more impactful business experiences.",
    },
    {
      year: "2019",
      title: "Keeping Pace with National Transformation",
      body: "We moved forward with confidence toward developing business platforms and distinctive events that support the objectives of Saudi Vision 2030 and contribute to strengthening the competitiveness of Saudi Arabia.",
    },
    {
      year: "2024",
      title: "Strategic Maturity and Institutional Integration",
      body: "We strengthened our corporate governance framework and enhanced our operational capabilities, becoming better positioned to expand our impact both locally and internationally.",
    },
    {
      year: "2025",
      title: "Launching Startime Investment Portfolios",
      body: "We entered a new phase of growth through the launch of three integrated investment portfolios and five strategic tracks, encompassing more than 30 specialized projects and initiatives.",
    },
    {
      year: "2030",
      title: "Realizing the Startime Vision",
      body: "Leading the MICE industry in the Kingdom of Saudi Arabia and advancing to the ranks of globally recognized event creators by 2030.",
    },
  ],
  vision: {
    label: "Startime Vision",
    title: "Our Ambition is Guided by a Clear Timeline",
    body: [
      "At Startime, we measure success not only by what we accomplish today, but also by the impact we create for the future. Through our investment portfolios and specialized projects, we continue to build sustainable value that supports growth, strengthens partnerships, and advances national development priorities.",
      "With confidence, foresight, and a clear sense of purpose, we move steadily toward our ultimate goal: to lead the MICE industry in the Kingdom of Saudi Arabia and emerge among the world's leading event creators by 2030.",
    ],
  },
  ceo: {
    quote: "We must embrace a profound sense of responsibility, amplify our efforts, and move in step with our partners to support the comprehensive and sustainable economic and social renaissance driven by our inspiring leadership, through its ambitious vision and unprecedented national achievements.",
    name: "Shaya Al-Qahtani",
    role: "Founder & CEO",
    learnMore: "Learn More",
    contact: "Contact the CEO",
    bioTitle: "Shaya Rajeh Al-Qahtani",
    bio: [
      "A Saudi entrepreneur and investor with a distinguished professional record and a highly influential business journey, guided by a vision that believes great opportunities are created when ambition converges with institutional excellence and meaningful partnerships. Over the course of many years in the business sector, he has contributed to the establishment and growth of a number of Saudi companies and ventures that have been closely associated with value creation, economic growth, and strengthening the presence of Saudi Arabia across promising strategic sectors.",
      "His professional journey reflects a sustained commitment to creating opportunities that bring together investors, decision-makers, experts, and entrepreneurs, driven by a conviction that sustainable development is built upon knowledge, collaboration, and the integration of efforts. Through his leadership of several organizations and his active contributions to national and sector-specific committees, he supports the advancement of Saudi Arabia’s business tourism ecosystem and the broader MICE industry, while promoting professional practices that align with Saudi Arabia global aspirations and contribute to strengthening its competitiveness on the international stage.",
      "His impact also extends to supporting initiatives dedicated to youth, innovators, entrepreneurs, and productive families, inspired by a firm belief that investment in people remains the most powerful driver of growth and prosperity. This commitment is reflected in his support for programs and projects that open new horizons for innovation, empower national talent, and transform promising ideas into sustainable development opportunities.",
      "Today, he continues to lead Startime with a vision focused on developing long-term, impact-driven projects and business platforms, accelerating innovation, fostering strategic partnerships, and contributing to the advancement of Saudi Arabia as a global destination for business, investment, and world-class event creation in alignment with the objectives of Saudi Vision 2030.",
    ],
  },
  methodology: {
    label: "A methodology that embodies the vision and immortalizes the impact",
    title: "Our promise is shaped by solutions, born of foresight, fulfilled through impact",
    body: "We redefine the event industry through a chain of operations, designed with creativity, managed with precision, and delivered with confidence; We design and execute events that pulse with Saudi identity presented to global standards, launching experiences that inspire, express, and elevate the Saudi Arabia as a host of the future",
  },
  governance: {
    label: "Corporate Governance",
    title: "Institutional Maturity Accelerating Our Journey Forward",
    body: "At Startime, corporate governance forms the foundation that guides our decisions, strengthens operational excellence, and reinforces trust with our partners and stakeholders, ensuring sustainable growth and long-term impact.",
    principles: [
      { title: "Organizational Strength", body: "Operational cycles built on experience and a clear organizational structure that ensures workflow efficiency and decision consistency across all levels." },
      { title: "Operational Risk Management", body: "A proactive methodology to anticipate, assess, manage, and mitigate risks of all types before they impact project quality or outcomes." },
      { title: "Decision‑Making Excellence", body: "An active Board of Directors supported by data‑driven insights and a strategic vision that enhances performance reliability and ensures goal achievement." },
      { title: "Stakeholder Transparency", body: "Clear and consistent communication that strengthens trust and builds long‑term partnerships with all stakeholders and collaborators." },
      { title: "National & International Compliance", body: "Professional memberships, certifications, and strict adherence to local regulations and global standards in the business events sector." },
      { title: "Experience & Impact Governance", body: "Precise management of every experience, automated through intelligent systems and fully documented to ensure balanced, measurable, and inspiring impact." },
      { title: "Effective Corporate Communication", body: "Internal and external communication channels that reinforce message clarity and unify the organization’s voice across all interactions." },
      { title: "Internal Accountability & Transparency", body: "A high‑performance oversight system that ensures clear responsibilities and elevates operational efficiency across all departments and levels." },
    ],
  },
  form: {
    title: "Connect with the Corporate Governance Team",
    fields: ["Department", "Name", "Position", "Phone", "Email", "Message", "Attachments"],
    submit: "Submit",
  },
};

const ar: DiscoverContent = {
  hero: {
    brand: "ستارتايم",
    title: "بتجربتنا العريقة نستشرف المستقبل",
  },
  introduction: {
    label: "الابتكار وصناعة الأحداث",
    title: "شغفنا الذي لن يهدأ أبداً",
    body: "منذ انطلاقة ستارتايم، ونحن نعمل برؤية سعودية طموحة، وهوية أصيلة، ومنهجية مؤسسية تُدار وفق أعلى المعايير العالمية. وبمساندة شبكة متنامية من الشركاء داخل المملكة وحول العالم، نمضي بثبات نحو إعادة تعريف مفاهيم صناعة اجتماعات الأعمال، وصناعة أحداث نوعية تخلق القيمة، وتعزز الشراكات، وتُحدث أثراً مستداماً يتجاوز حدود الحدث ليصل إلى الاقتصاد والمعرفة والمجتمع.",
  },
  timeline: [
    { year: "2009", title: "من أرض نجد... بدأت الحكاية", body: "تأسست ستارتايم برؤية سعودية أصيلة لإعادة تعريف صناعة اجتماعات الأعمال، وبطموح يتجاوز تنظيم الأحداث إلى صناعة القيمة والأثر." },
    { year: "2014", title: "بناء الشراكات الواعدة", body: "وسعنا حضورنا من خلال بناء شراكات وطنية وعالمية أسهمت في ترسيخ مكانتنا وتعزيز قدرتنا على تقديم تجارب أعمال أكثر تأثيراً." },
    { year: "2019", title: "مواكبة التحول الوطني", body: "انطلقنا بخطى واثقة نحو تطوير منصات أعمال وأحداث نوعية تدعم مستهدفات رؤية السعودية 2030 وتسهم في تعزيز تنافسية المملكة العربية السعودية" },
    { year: "2024", title: "نضج استراتيجي وتكامل مؤسسي", body: "عززنا حوكمتنا المؤسسية وطورنا قدراتنا التشغيلية لنكون أكثر جاهزية للتوسع وتحقيق أثر محلي ودولي مستدام." },
    { year: "2025", title: "إطلاق محافظ ستارتايم الاستثمارية", body: "انتقلنا إلى مرحلة جديدة من النمو عبر إطلاق ثلاث محافظ استثمارية متكاملة وخمسة مسارات استراتيجية تضم أكثر من 30 مشروعاً ومبادرة نوعية." },
    { year: "2030", title: "تحقيق رؤية ستارتايم", body: "قيادة سوق اجتماعات الأعمال في المملكة العربية السعودية، والارتقاء إلى مصاف صناع الأحداث عالمياً بحلول عام 2030" },
  ],
  vision: {
    label: "رؤية ستارتايم",
    title: "طموحنا يُدار بزمن محسوب",
    body: [
      "في ستارتايم، نقيس نجاحنا بما ننجزه اليوم وبما نتركه من أثر يستشرف المستقبل؛ فمن خلال محافظنا الاستثمارية ومشاريعنا النوعية، نواصل بناء قيمة مستدامة تدعم النمو وتعزز الشراكات وتخدم أولويات التنمية الوطنية.",
      "نمضي بثبات ونظرة ثاقبة نحو غاية واضحة؛ أن نقود سوق اجتماعات الأعمال في المملكة العربية السعودية، وأن نرتقي إلى مصاف صناع الأحداث عالمياً بحلول عام 2030",
    ],
  },
  ceo: {
    quote: "يتحتم علينا أن نكون بقدر كافي من المسؤولية، وأن نضاعف جهودنا ونسابق الخطى جنباً إلى جنب مع شركائنا، لدعم النهضة الاقتصادية والاجتماعية الشاملة والمستدامة التي أحدثتها قيادتنا الملهمة من خلال رؤيتها الطموحة ومنجزاتها الوطنية غير المسبوقة",
    name: "شايع القحطاني",
    role: "المؤسس الرئيس التنفيذي",
    learnMore: "اعرف المزيد",
    contact: "تواصل مع الرئيس التنفيذي",
    bioTitle: "شايع راجح القحطاني",
    bio: [
      "رجل أعمال ومستثمر سعودي؛ صاحب سجل مهني حافل ومسيرة أعمال مؤثرة تستند إلى رؤية تؤمن بأن الفرص الكبرى تصنع عندما يتلاقى الطموح بالعمل المؤسسي والشراكات الفاعلة؛ فعلى امتداد سنوات من العمل في قطاع الأعمال، أسهم في تأسيس وبناء عدد من الشركات والمشاريع السعودية التي ارتبطت ببناء القيمة، وتحفيز النمو، وتعزيز حضور المملكة العربية السعودية في قطاعات اقتصادية واعدة.",
      "تعكس رحلته المهنية اهتماماً متواصلاً ببناء الفرص التي تجمع المستثمرين وصناع القرار والخبراء ورواد الأعمال، إيماناً منه بأن التنمية المستدامة تُبنى على المعرفة والتعاون وتكامل الجهود؛ ومن خلال رئاسته لعدد من اللجان والفرق، ومساهماته الفاعلة في اللجان الوطنية والقطاعية، يشارك في دعم مسيرة تطوير منظومة سياحة الأعمال وسوق صناعة اجتماعات الأعمال، وتعزيز تبني الممارسات المهنية التي تواكب مكانة المملكة العربية السعودية وتساهم في تعزيز تنافسيتها بمؤشرات التنافسية العالمية.",
      "كما يمتد أثره إلى دعم المبادرات الموجهة للشباب والمبتكرين ورواد الأعمال والأسر المنتجة، انطلاقاً من قناعة راسخة بأن الاستثمار في الإنسان هو المحرك الأهم للنمو والازدهار. وقد انعكس هذا التوجه في دعمه للبرامج والمشاريع التي تفتح آفاقاً جديدة للابتكار وتمكين الكفاءات الوطنية وتحويل الأفكار الواعدة إلى فرص تنموية مستدامة.",
      "واليوم، يواصل قيادة ستارتايم برؤية تتطلع إلى بناء مشاريع ومنصات أعمال ذات أثر طويل المدى، وتسريع وتيرة الابتكار، وتعزيز الشراكات النوعية، والمساهمة في ترسيخ مكانة المملكة العربية السعودية كوجهة عالمية للأعمال والاستثمار وصناعة الأحداث النوعية في إطار مستهدفات رؤية السعودية 2030.",
    ],
  },
  methodology: {
    label: "نهجٌ يُجسّد الرؤية... ويُخلّد الأثر",
    title: "وعدنا يصاغ بحلول تبدأ بالاستبصار وتنتهي بالتأثير",
    body: "نعيد تعريف صناعة الأحداث عبر سلسلة مشاريع تُبنى بإبداع وتُدار باحتراف وتُنفّذ بثقة؛ حيث نصمم وننفذ فعاليات أعمال تنبض بالهوية السعودية وتقدم بمعايير عالمية لتطلق تجارب تلهم وتعبر وترسخ مكانة المملكة العربية السعودية كمستضيف للمستقبل",
  },
  governance: {
    label: "الحوكمة المؤسسية",
    title: "نضج مؤسسي لتسريع الوصول إلى غاياتنا",
    body: "في ستارتايم، تشكل الحوكمة المؤسسية الإطار الذي يوجه قراراتنا، ويعزز كفاءة أعمالنا، ويرسخ الثقة مع شركائنا وأصحاب المصلحة، بما يضمن استدامة النمو وتحقيق أثر طويل المدى.",
    principles: [
      { title: "القيادة والاستشراف الاستراتيجي", body: "رؤية واضحة وآليات حوكمة فاعلة تضمن مواءمة القرارات مع مستهدفات النمو وتوجهات المستقبل، وترسخ قدرتنا على اغتنام الفرص وصناعة القيمة." },
      { title: "التميز المؤسسي والتشغيلي", body: "منظومة عمل متكاملة تعتمد على أفضل الممارسات المؤسسية لضمان الكفاءة التشغيلية، وتحقيق الاتساق في الأداء، وتعزيز جودة المخرجات عبر جميع الأعمال والمشاريع." },
      { title: "إدارة المخاطر واستمرارية الأعمال", body: "منهجية استباقية لرصد المخاطر وتحليلها وإدارتها، بما يعزز جاهزية الأعمال واستدامتها ويحافظ على موثوقية التنفيذ وجودة النتائج." },
      { title: "اتخاذ القرار المبني على البيانات", body: "نطور قراراتنا استناداً إلى مؤشرات أداء واضحة وتحليلات دقيقة ورؤية استراتيجية تمكّننا من تحقيق أهدافنا بكفاءة وفاعلية." },
      { title: "الشفافية والمساءلة", body: "ثقافة مؤسسية تعزز النزاهة والوضوح، وترسخ المساءلة على مختلف المستويات، بما يدعم الثقة ويضمن وضوح الأدوار والمسؤوليات." },
      { title: "الامتثال والمعايير العالمية", newPageTitle: "الامتثال للمعايير", body: "التزام راسخ بالأنظمة والتشريعات المحلية والمعايير الدولية، مدعوم بالعضويات والاعتمادات المهنية التي تعكس مستوى نضجنا المؤسسي." },
      { title: "تجربة أصحاب المصلحة", body: "علاقات طويلة الأمد تُبنى على الثقة والتواصل الفعال وجودة التجربة، بما يعزز الشراكات ويحقق قيمة مستدامة لجميع الأطراف ذات العلاقة." },
      { title: "الابتكار والتحول الرقمي", body: "توظيف الأنظمة الذكية والتقنيات الحديثة لتطوير العمليات وتعزيز الكفاءة ورفع القدرة على قياس الأثر وتحقيق مستويات أعلى من التميز المؤسسي." },
    ],
  },
  form: {
    title: "تواصل مع فريق الموارد المؤسسية",
    fields: ["الجهة", "الاسم", "المنصب", "هاتف", "بريد إلكتروني", "الرسالة", "المرفقات"],
    submit: "إرسال",
  },
};

export const discoverContent: Record<Locale, DiscoverContent> = { en, ar };
