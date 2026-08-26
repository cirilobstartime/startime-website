import type { Locale, PublicPage } from "./types";

type PolicySection = {
  heading: string;
  paragraphs: string[];
};

function textNode(text: string) {
  return {
    type: "text",
    detail: 0,
    format: 0,
    mode: "normal",
    style: "",
    text,
    version: 1,
  };
}

function richTextDocument(sections: PolicySection[], locale: Locale) {
  const direction = locale === "ar" ? "rtl" : "ltr";
  return {
    root: {
      type: "root",
      children: sections.flatMap((section) => [
        {
          type: "heading",
          children: [textNode(section.heading)],
          direction,
          format: "",
          indent: 0,
          tag: "h2",
          version: 1,
        },
        ...section.paragraphs.map((paragraph) => ({
          type: "paragraph",
          children: [textNode(paragraph)],
          direction,
          format: "",
          indent: 0,
          textFormat: 0,
          textStyle: "",
          version: 1,
        })),
      ]),
      direction,
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

const englishPolicy: PolicySection[] = [
  {
    heading: "1. Introduction",
    paragraphs: [
      "Startime is committed to implementing the highest cybersecurity standards to safeguard all data, systems, and operational processes within Triple S Arena. This commitment aligns with the requirements of the National Cybersecurity Authority (NCA) and internationally recognized frameworks.",
      "This policy aims to ensure confidentiality, integrity, and availability of information, while providing a secure digital environment that supports Startime’s operational excellence and digital transformation objectives.",
    ],
  },
  {
    heading: "2. Scope",
    paragraphs: [
      "This policy applies to all Triple S Arena users, including employees, clients, partners, vendors, and contractors. It also covers all data stored or processed within the system, all connected infrastructure, and all access, modification, sharing, and workflow activities performed through the platform.",
    ],
  },
  {
    heading: "3. Data Protection & Privacy",
    paragraphs: [
      "Startime treats data as a critical organizational asset. All information is classified according to its sensitivity, including financial data, contractual records, operational files, and personal information related to employees, clients, and vendors.",
      "The platform enforces strict privacy controls, including encryption of data in transit and at rest, restricted access based on user roles, and compliance with national privacy regulations. No data may be shared outside the system without formal authorization, and all operational records are maintained in a secure and controlled environment.",
    ],
  },
  {
    heading: "4. Identity & Access Management",
    paragraphs: [
      "Triple S Arena employs a robust Role-Based Access Control (RBAC) model to ensure that each user receives only the permission required for their role.",
      "Multi-Factor Authentication is mandatory for all users, and access rights are reviewed regularly to prevent excessive or unauthorized access. All login, modification, deletion, and sharing activities are logged in a centralized audit trail.",
      "Shared accounts are strictly prohibited, and any request for additional access must be formally approved.",
    ],
  },
  {
    heading: "5. Account & Session Security",
    paragraphs: [
      "Startime enforces strong password policies, periodic password renewal, automatic session timeout, and continuous monitoring of failed login attempts. Conditional access controls are applied based on device type and geographic location.",
      "Any unusual activity triggers immediate protective measures to ensure account and system integrity.",
    ],
  },
  {
    heading: "6. System & Infrastructure Security",
    paragraphs: [
      "The platform uses industry-standard encryption technologies, including TLS 1.3 for data in transit and AES-256 for data at rest.",
      "Systems undergo regular security updates, continuous vulnerability monitoring, and segmentation of sensitive environments. Backup and recovery procedures ensure business continuity in the event of a system failure or cyber incident.",
    ],
  },
  {
    heading: "7. Incident Response",
    paragraphs: [
      "Startime maintains a comprehensive Incident Response Plan that outlines procedures for reporting, analyzing, documenting, and resolving cybersecurity incidents.",
      "In the event of a breach or attempted intrusion, the organization takes immediate action to contain the threat, restore operations, and coordinate with relevant authorities as required by Saudi regulations.",
    ],
  },
  {
    heading: "8. Awareness & Training",
    paragraphs: [
      "Startime provides ongoing cybersecurity training to all employees, reinforcing awareness of cyber threats and safe digital practices.",
      "Periodic phishing simulations and security drills are conducted to ensure readiness and adherence to security protocols.",
    ],
  },
  {
    heading: "9. User Responsibilities",
    paragraphs: [
      "All users are responsible for protecting their login credentials, refraining from unauthorized data sharing, reporting unusual activity, and complying with all security and acceptable-use policies.",
      "Any violation of these responsibilities is considered a breach of Startime’s cybersecurity standards.",
    ],
  },
  {
    heading: "10. Compliance & Review",
    paragraphs: [
      "Startime adheres fully to the cybersecurity controls mandated by the NCA, as well as international standards such as ISO 27001 and NIST CSF.",
      "This policy is reviewed periodically to ensure alignment with evolving cybersecurity threats and regulatory requirements.",
    ],
  },
];

const arabicPolicy: PolicySection[] = [
  {
    heading: "1. المقدمة",
    paragraphs: [
      "تلتزم ستارتايم بتطبيق أعلى معايير الأمن السيبراني لحماية جميع البيانات والأنظمة والعمليات التشغيلية داخل تريبل إس أرينا، بما يتوافق مع متطلبات الهيئة الوطنية للأمن السيبراني (NCA) والأطر المعترف بها دوليًا.",
      "تهدف هذه السياسة إلى ضمان سرية المعلومات وسلامتها وتوافرها، وتوفير بيئة رقمية آمنة تدعم التميز التشغيلي لستارتايم وأهدافها في التحول الرقمي.",
    ],
  },
  {
    heading: "2. نطاق التطبيق",
    paragraphs: [
      "تسري هذه السياسة على جميع مستخدمي تريبل إس أرينا، بما في ذلك الموظفون والعملاء والشركاء والموردون والمتعاقدون. كما تشمل جميع البيانات المخزنة أو المعالجة داخل النظام، والبنية التحتية المتصلة به، وجميع عمليات الوصول والتعديل والمشاركة ومسارات العمل التي تتم عبر المنصة.",
    ],
  },
  {
    heading: "3. حماية البيانات والخصوصية",
    paragraphs: [
      "تتعامل ستارتايم مع البيانات باعتبارها أصلًا مؤسسيًا بالغ الأهمية. وتُصنّف جميع المعلومات وفق مستوى حساسيتها، بما يشمل البيانات المالية والسجلات التعاقدية والملفات التشغيلية والمعلومات الشخصية المتعلقة بالموظفين والعملاء والموردين.",
      "تطبق المنصة ضوابط صارمة للخصوصية، تشمل تشفير البيانات أثناء النقل والتخزين، وتقييد الوصول وفق أدوار المستخدمين، والالتزام بأنظمة الخصوصية الوطنية. ولا يجوز مشاركة أي بيانات خارج النظام دون تصريح رسمي، كما تُحفظ جميع السجلات التشغيلية في بيئة آمنة ومنضبطة.",
    ],
  },
  {
    heading: "4. إدارة الهوية وصلاحيات الوصول",
    paragraphs: [
      "تعتمد تريبل إس أرينا نموذجًا محكمًا للتحكم في الوصول بناءً على الأدوار (RBAC)، لضمان حصول كل مستخدم على الصلاحيات اللازمة لدوره فقط.",
      "تُعد المصادقة متعددة العوامل إلزامية لجميع المستخدمين، وتتم مراجعة صلاحيات الوصول بشكل دوري لمنع الوصول الزائد أو غير المصرح به. كما تُسجل جميع عمليات تسجيل الدخول والتعديل والحذف والمشاركة في سجل تدقيق مركزي.",
      "يُحظر استخدام الحسابات المشتركة منعًا باتًا، ويجب اعتماد أي طلب للحصول على صلاحيات إضافية بصورة رسمية.",
    ],
  },
  {
    heading: "5. أمن الحسابات والجلسات",
    paragraphs: [
      "تطبق ستارتايم سياسات قوية لكلمات المرور، وتجديدها دوريًا، وإنهاء الجلسات تلقائيًا، والمراقبة المستمرة لمحاولات تسجيل الدخول الفاشلة. كما تُطبق ضوابط وصول مشروطة بناءً على نوع الجهاز والموقع الجغرافي.",
      "يؤدي رصد أي نشاط غير اعتيادي إلى تفعيل إجراءات حماية فورية للحفاظ على سلامة الحساب والنظام.",
    ],
  },
  {
    heading: "6. أمن الأنظمة والبنية التحتية",
    paragraphs: [
      "تستخدم المنصة تقنيات تشفير متوافقة مع معايير القطاع، بما في ذلك TLS 1.3 للبيانات أثناء النقل وAES-256 للبيانات أثناء التخزين.",
      "تخضع الأنظمة لتحديثات أمنية دورية ومراقبة مستمرة للثغرات وعزل للبيئات الحساسة. وتضمن إجراءات النسخ الاحتياطي والاستعادة استمرارية الأعمال في حال تعطل النظام أو وقوع حادث سيبراني.",
    ],
  },
  {
    heading: "7. الاستجابة للحوادث",
    paragraphs: [
      "تطبق ستارتايم خطة شاملة للاستجابة للحوادث، توضح إجراءات الإبلاغ عن حوادث الأمن السيبراني وتحليلها وتوثيقها ومعالجتها.",
      "عند وقوع اختراق أو محاولة تسلل، تتخذ الشركة إجراءات فورية لاحتواء التهديد واستعادة العمليات والتنسيق مع الجهات ذات العلاقة وفق ما تتطلبه الأنظمة السعودية.",
    ],
  },
  {
    heading: "8. التوعية والتدريب",
    paragraphs: [
      "تقدم ستارتايم تدريبًا مستمرًا في الأمن السيبراني لجميع الموظفين، لتعزيز الوعي بالتهديدات السيبرانية والممارسات الرقمية الآمنة.",
      "كما تُجرى محاكاة دورية للتصيد الإلكتروني وتمارين أمنية لضمان الجاهزية والالتزام بالبروتوكولات الأمنية.",
    ],
  },
  {
    heading: "9. مسؤوليات المستخدمين",
    paragraphs: [
      "يتحمل جميع المستخدمين مسؤولية حماية بيانات تسجيل الدخول الخاصة بهم، والامتناع عن مشاركة البيانات دون تصريح، والإبلاغ عن أي نشاط غير اعتيادي، والالتزام بجميع سياسات الأمن والاستخدام المقبول.",
      "ويُعد أي إخلال بهذه المسؤوليات مخالفة لمعايير الأمن السيبراني المعتمدة لدى ستارتايم.",
    ],
  },
  {
    heading: "10. الالتزام والمراجعة",
    paragraphs: [
      "تلتزم ستارتايم بالكامل بضوابط الأمن السيبراني الصادرة عن الهيئة الوطنية للأمن السيبراني، وبالمعايير الدولية مثل ISO 27001 وإطار NIST CSF.",
      "تُراجع هذه السياسة بشكل دوري لضمان مواكبتها للتهديدات السيبرانية المتغيرة والمتطلبات التنظيمية.",
    ],
  },
];

export function getTripleSPolicyPage(locale: Locale): PublicPage {
  const ar = locale === "ar";
  const title = ar
    ? "سياسة حماية البيانات والأنظمة – تريبل إس أرينا"
    : "Triple S Arena – Data & Systems Protection Policy";
  const summary = ar
    ? "سياسة ستارتايم لحماية البيانات والأنظمة والعمليات التشغيلية داخل تريبل إس أرينا."
    : "Startime’s policy for protecting data, systems, and operational processes within Triple S Arena.";

  return {
    pageType: "triple-s-policy",
    slug: "triple-s-arena/cybersecurity-policy",
    title,
    summary,
    seo: {
      title: ar
        ? "سياسة الأمن السيبراني لتريبل إس أرينا | ستارتايم"
        : "Triple S Arena Cybersecurity Policy | Startime",
      description: summary,
      indexable: true,
      followLinks: true,
      includeInSitemap: true,
      sitemapChangeFrequency: "yearly",
      sitemapPriority: 0.4,
    },
    sections: [
      {
        blockType: "hero",
        displayOrder: 10,
        visible: true,
        eyebrow: ar ? "حماية البيانات والأنظمة" : "DATA & SYSTEMS PROTECTION",
        heading: title,
        body: summary,
        heroHeight: "standard",
        media: "/assets/editorial/triple-s-arena.webp",
      },
      {
        blockType: "richTextContent",
        displayOrder: 20,
        visible: true,
        eyebrow: ar ? "سياسة الأمن السيبراني" : "CYBERSECURITY POLICY",
        heading: ar ? "إطار آمن للتشغيل الرقمي" : "A Secure Framework for Digital Operations",
        content: richTextDocument(ar ? arabicPolicy : englishPolicy, locale),
        appearance: {
          theme: "light",
          spacing: "standard",
          backgroundColor: "#f4f1ec",
        },
      },
    ],
  };
}
