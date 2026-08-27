import path from "node:path";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { approvedInsightContent } from "../src/content/approvedInsights";
import { approvedArabicInsightContent } from "../src/content/approvedArabicInsights";
import { getDefaultChrome, getDefaultPage } from "../src/content/defaults";
import { livePageTypes } from "../src/content/liveSiteDefaults";
import type { Locale, PageSection } from "../src/content/types";

const projectRoot = process.cwd();
// Routine reseeds remain English-only so they cannot overwrite reviewed live
// Arabic content. New disposable environments can explicitly install the
// source-controlled English and Arabic defaults with `npm run seed:bilingual`.
const locales: Locale[] =
  process.env.SEED_BILINGUAL === "true" ||
  process.env.SEED_ARABIC_PLACEHOLDERS === "true"
    ? ["en", "ar"]
    : ["en"];
const pageTypes = [...livePageTypes];
const internalPageTitles: Record<string, string> = {
  home: "Homepage",
  discover: "Discover Startime",
  portfolio: "Portfolio",
  solutions: "Solutions",
  "triple-s-arena": "Triple S Arena",
  "join-us": "Join Us",
  contact: "Contact Startime",
};

const insightCategories = [
  {
    internalTitle: "B2B Hosting",
    slug: "b2b-hosting",
    title: "B2B Hosting",
    titleAr: "استضافة الأعمال",
  },
  {
    internalTitle: "Partnership",
    slug: "partnership",
    title: "Partnership",
    titleAr: "الشراكات",
  },
  {
    internalTitle: "Governance",
    slug: "governance",
    title: "Governance",
    titleAr: "الحوكمة",
  },
  {
    internalTitle: "Global Events",
    slug: "global-events",
    title: "Global Events",
    titleAr: "الفعاليات العالمية",
  },
  {
    internalTitle: "Sovereign Events",
    slug: "sovereign-events",
    title: "Sovereign Events",
    titleAr: "الفعاليات السيادية",
  },
  {
    internalTitle: "National Ceremony",
    slug: "national-ceremony",
    title: "National Ceremony",
    titleAr: "المناسبات الوطنية",
  },
];

const insightPosts = [
  {
    category: "B2B Hosting",
    image: "/assets/editorial/news-delegation.webp",
    internalTitle: "Russian Gaming Delegation B2B Visit",
    publishedAt: "2025-10-01T00:00:00.000Z",
    slug: "russian-delegation-gaming-industry",
    title: "As Part of the B2B Hosting Service…",
    summary:
      "Startime hosted a high-level Russian delegation to explore opportunities across the gaming industry.",
    intro:
      "An official visit from Moscow brought together representatives of the Chamber of Commerce and Industry, Export Center, Creative Industries Agency, and leading gaming companies.",
    content: [
      {
        heading: "Exploring a new field of collaboration",
        body: "On 13 October 2025, Startime welcomed a high-level Russian delegation to its headquarters in Riyadh. The delegation included representatives from the Moscow Chamber of Commerce and Industry, the Moscow Export Center, the Moscow Creative Industries Agency, and executives from leading Russian electronic-gaming companies.\n\nReceived by Startime Founder and CEO Shaya Al Kahtani, the meeting focused on joint cooperation in developing the gaming industry and strengthening trade exchange between Saudi Arabia and the Russian Federation.",
      },
      {
        heading: "Localizing advanced technologies",
        body: "Startime places the localization of advanced technologies at the forefront of its strategic priorities, in alignment with Saudi Vision 2030 and the ambition to build a knowledge economy driven by innovation. The discussion explored coordination with local investors to attract AI-powered gaming experiences, enrich local content, and strengthen the Kingdom’s position as a regional gaming hub.",
      },
      {
        heading: "Business hosting with long-term value",
        body: "The visit reflected growing interest from Russian companies in the Saudi market and its rapidly expanding gaming sector. Through this engagement, Startime reinforced its role in business hosting and activation, empowering creative industries and cultivating international partnerships.",
      },
    ],
  },
  {
    category: "Global Events",
    image: "/assets/editorial/news-hosting.webp",
    internalTitle: "Football Legends Tours Agreement",
    publishedAt: "2025-09-02T00:00:00.000Z",
    slug: "football-legends-tours-agreement",
    title:
      "Empowering its Partners and Cementing its Role in Hosting Global Events",
    summary:
      "A new international sports agreement brings a three-year Football Legends tour series to Saudi Arabia.",
    intro:
      "Startime signed an international agreement with UK-based Onlydo Events to host a three-year series of Football Legends Tours in Saudi Arabia.",
    content: [
      {
        heading: "A global sports experience for Saudi Arabia",
        body: "The agreement was signed at Startime’s Riyadh headquarters by Startime Founder and CEO Shaya Al Kahtani and Onlydo Events Founder Stuart Blyth, with Quartz Energy CEO Omar Abdulsalam acting as the official liaison. The first tour was planned to launch in January 2026 with an England and Brazil Legends match.\n\nThe initiative supports Saudi Vision 2030 by using sport to enhance quality of life, diversify the economy, and strengthen the Kingdom’s global presence.",
      },
      {
        heading: "Integrated delivery and audience activation",
        body: "As lead organizer in Saudi Arabia, Startime’s remit covers hosting, marketing, government coordination, media management, and premium logistics for international guests. Fan activations include meet-and-greets, football clinics, and branded sponsor events designed to connect the tour with local audiences and commercial partners.",
      },
      {
        heading: "Building cultural and athletic bridges",
        body: "Football Legends Tours blend entertainment with cultural engagement, reconnecting fans with iconic players while stimulating tourism, sponsorship, international viewership, and media opportunities. The agreement marked a strategic step in combining global expertise with Saudi ambition.",
      },
    ],
  },
  {
    category: "Governance",
    image: "/assets/editorial/news-governance.webp",
    internalTitle: "Corporate Governance Transformation",
    publishedAt: "2025-09-03T00:00:00.000Z",
    slug: "corporate-governance-transformation",
    title: "A Transformational Leap in Corporate Governance",
    summary:
      "Startime completed a strategic governance overhaul that reinforces its leadership in the business events sector.",
    intro:
      "Startime completed a comprehensive corporate governance transformation designed to strengthen transparency, efficiency, accountability, and long-term sustainability.",
    content: [
      {
        heading: "A strategic governance framework",
        body: "Launched in March 2024 and concluded in August 2025, the initiative responded to international governance standards and enterprise-management best practices. It introduced a robust framework of policies and programs across the organization.",
      },
      {
        heading: "Programs built for resilient growth",
        body: "Key initiatives included the Startime Talent and Experts Program, Risk Management Framework, Workplace Wellbeing and Satisfaction Initiative, Financial Efficiency and Performance Program, Strategic Partnerships Platform, and the Startime Investment Portfolio.\n\nExecutive performance indicators recorded significant growth during the transformation, demonstrating that the program was designed as a strategic business lever rather than a purely administrative change.",
      },
      {
        heading: "A platform for sustainable value",
        body: "The transformation strengthens Startime’s ability to make informed decisions, manage risk, and deliver lasting value to stakeholders. It marks a defining chapter in the company’s evolution as an architect of business events in Saudi Arabia and beyond.",
      },
    ],
  },
  {
    category: "Sovereign Events",
    image: "/assets/editorial/news-sovereign.webp",
    internalTitle: "National Defense University Graduation",
    publishedAt: "2025-07-01T00:00:00.000Z",
    slug: "national-defense-university-graduation",
    title: "Rooted in its Leadership in Sovereign Event Management",
    summary:
      "Startime delivered the National Defense University graduation ceremony in Riyadh.",
    intro:
      "Startime delivered the National Defense University graduation ceremony in Riyadh under the patronage of His Royal Highness Prince Khalid bin Salman bin Abdulaziz Al Saud, Minister of Defense.",
    content: [
      {
        heading: "Precision shaped by protocol",
        body: "Attended by senior military and civilian officials, the ceremony required a precise balance of military protocol and creative production. Startime oversaw hall preparation, décor, stage design, screens, hospitality, program management, and content curation.",
      },
      {
        heading: "A complete ceremonial experience",
        body: "The delivery included short films and documentary content, professional photography and videography, and premium ceremonial gifts. Each detail was developed to give the official occasion a coherent visual and emotional identity.",
      },
      {
        heading: "A national responsibility",
        body: "Following the event, National Defense University Director Lieutenant General Mohammed bin Jadoua Al-Ruwaili recognized the quality of Startime’s delivery. For Startime, sovereign occasions are not simply logistical assignments; they are opportunities to reinforce national values and help build an enduring institutional memory.",
      },
    ],
  },
  {
    category: "Partnership",
    image: "/assets/editorial/news-partnership.webp",
    internalTitle: "KJO Cultural Services Contract Renewal",
    publishedAt: "2025-09-04T00:00:00.000Z",
    slug: "kjo-cultural-services-contract-renewal",
    title: "Enduring Partnership, Renewed Trust",
    summary:
      "KJO extended its cultural and recreational services contract with Startime.",
    intro:
      "Khafji Joint Operations renewed its cultural and recreational services partnership with Startime after a successful first year of integrated programming.",
    content: [
      {
        heading: "Supporting people and community",
        body: "In line with Saudi Vision 2030 and its focus on human-capital development, KJO has built a long-standing program of professional empowerment and social enrichment for employees, their families, and the wider Khafji community.",
      },
      {
        heading: "An integrated year-round program",
        body: "Startime manages the planning and execution of activities across KJO facilities and external venues in Saudi Arabia and Kuwait, providing specialist personnel, logistics, and creative content.\n\nThe first year included a three-month Spring Camp, Saudi and Kuwaiti national-day celebrations, Ramadan and Eid experiences, curated trips, and the KJO Summer Beach Program.",
      },
      {
        heading: "Trust earned through execution",
        body: "Operational agility, production quality, and audience understanding earned strong satisfaction and led KJO to renew the contract for another year. The extension reflects confidence in Startime’s ability to deliver cultural and recreational programs that improve quality of life and sustain long-term collaboration.",
      },
    ],
  },
  {
    category: "National Ceremony",
    image: "/assets/editorial/news-graduation.webp",
    internalTitle: "King Khalid Military College Graduation",
    publishedAt: "2024-06-01T00:00:00.000Z",
    slug: "king-khalid-military-college-graduation",
    title: "For the Second Consecutive Year",
    summary:
      "Startime organized the graduation ceremony of King Khalid Military College officers.",
    intro:
      "Startime contributed to the King Khalid Military College graduation ceremony for the second consecutive year, delivering an integrated ceremonial and technical experience.",
    content: [
      {
        heading: "A milestone of service and achievement",
        body: "Held in May 2024 under the patronage of His Royal Highness Prince Abdullah bin Bandar bin Abdulaziz Al Saud, Minister of the National Guard, the event marked the graduation of the 35th University Officer Qualification Course and the 40th cohort of cadets.",
      },
      {
        heading: "Honoring national sacrifice",
        body: "Among the graduates were ten sons of fallen heroes from the Ministry of Defense, National Guard, and Ministry of Interior. The ceremony honored both achievement and sacrifice, combining the royal anthem, a Qur’an recitation, official addresses, a military parade, and the college anthem.",
      },
      {
        heading: "Integrated ceremonial delivery",
        body: "Startime delivered site preparation, program management, audiovisual production, and documentation, ensuring every detail reflected the dignity of the occasion. The project reinforced the company’s commitment to national events that embody loyalty, unity, and pride.",
      },
    ],
  },
];

const formDefinitions = [
  {
    formKey: "contact",
    internalTitle: "Main contact form",
    submitLabel: "Send enquiry",
    submitLabelAr: "إرسال",
    fields: [
      {
        name: "entity",
        label: "Entity",
        type: "text",
        required: true,
        width: "half",
        autocomplete: "organization",
        maxLength: 200,
      },
      {
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        width: "half",
        autocomplete: "name",
        maxLength: 160,
      },
      {
        name: "position",
        label: "Position",
        type: "text",
        width: "half",
        autocomplete: "organization-title",
        maxLength: 160,
      },
      {
        name: "phone",
        label: "Phone",
        type: "tel",
        width: "half",
        autocomplete: "tel",
        maxLength: 50,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        width: "half",
        autocomplete: "email",
        maxLength: 200,
      },
      {
        name: "message",
        label: "Message",
        type: "textarea",
        required: true,
        width: "full",
        maxLength: 3000,
      },
      {
        name: "attachments",
        label: "Attachments",
        type: "file",
        width: "full",
        helpText: "PDF, DOCX, PNG, or JPG, maximum 5 MB.",
        allowedFileTypes: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/png",
          "image/jpeg",
        ],
      },
      {
        name: "consent",
        label:
          "I agree that Startime may use this information to respond to my enquiry.",
        type: "checkbox",
        required: true,
        width: "full",
      },
    ],
    fieldsAr: [
      { name: "entity", label: "الجهة", type: "text", required: true, width: "half", autocomplete: "organization", maxLength: 200 },
      { name: "name", label: "الاسم", type: "text", required: true, width: "half", autocomplete: "name", maxLength: 160 },
      { name: "position", label: "المنصب", type: "text", width: "half", autocomplete: "organization-title", maxLength: 160 },
      { name: "phone", label: "الهاتف", type: "tel", width: "half", autocomplete: "tel", maxLength: 50 },
      { name: "email", label: "البريد الإلكتروني", type: "email", required: true, width: "half", autocomplete: "email", maxLength: 200 },
      { name: "message", label: "الرسالة", type: "textarea", required: true, width: "full", maxLength: 3000 },
      { name: "attachments", label: "المرفقات", type: "file", width: "full", helpText: "PDF أو DOCX أو PNG أو JPG، بحد أقصى 5 ميجابايت.", allowedFileTypes: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/png", "image/jpeg"] },
      { name: "consent", label: "أوافق على استخدام ستارتايم لهذه المعلومات للرد على استفساري.", type: "checkbox", required: true, width: "full" },
    ],
  },
  {
    formKey: "careers",
    internalTitle: "General career application",
    submitLabel: "Submit application",
    submitLabelAr: "إرسال الطلب",
    fields: [
      {
        name: "fullName",
        label: "Full name",
        type: "text",
        required: true,
        width: "half",
        autocomplete: "name",
        maxLength: 160,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        width: "half",
        autocomplete: "email",
        maxLength: 200,
      },
      {
        name: "phone",
        label: "Phone number",
        type: "tel",
        width: "half",
        autocomplete: "tel",
        maxLength: 50,
      },
      {
        name: "careerArea",
        label: "Career area",
        type: "text",
        required: true,
        width: "half",
        maxLength: 160,
      },
      {
        name: "linkedin",
        label: "LinkedIn or portfolio URL",
        type: "url",
        width: "full",
        maxLength: 500,
      },
      {
        name: "cv",
        label: "CV or portfolio",
        type: "file",
        required: true,
        width: "full",
        helpText: "PDF or DOCX, maximum 5 MB.",
        allowedFileTypes: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      },
      {
        name: "message",
        label: "Tell us about the work you want to do",
        type: "textarea",
        width: "full",
        maxLength: 2500,
      },
      {
        name: "consent",
        label:
          "I agree that Startime may retain my application for relevant opportunities.",
        type: "checkbox",
        required: true,
        width: "full",
      },
    ],
    fieldsAr: [
      { name: "fullName", label: "الاسم الكامل", type: "text", required: true, width: "half", autocomplete: "name", maxLength: 160 },
      { name: "email", label: "البريد الإلكتروني", type: "email", required: true, width: "half", autocomplete: "email", maxLength: 200 },
      { name: "phone", label: "رقم الهاتف", type: "tel", width: "half", autocomplete: "tel", maxLength: 50 },
      { name: "careerArea", label: "المجال المهني", type: "text", required: true, width: "half", maxLength: 160 },
      { name: "linkedin", label: "رابط لينكدإن أو معرض الأعمال", type: "url", width: "full", maxLength: 500 },
      { name: "cv", label: "السيرة الذاتية أو معرض الأعمال", type: "file", required: true, width: "full", helpText: "PDF أو DOCX، بحد أقصى 5 ميجابايت.", allowedFileTypes: ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"] },
      { name: "message", label: "عرّفنا بالعمل الذي ترغب في تقديمه", type: "textarea", width: "full", maxLength: 2500 },
      { name: "consent", label: "أوافق على احتفاظ ستارتايم بطلبي للفرص المناسبة.", type: "checkbox", required: true, width: "full" },
    ],
  },
  {
    formKey: "supplier-registration",
    internalTitle: "Supplier registration",
    submitLabel: "Submit registration",
    fields: [
      {
        name: "companyName",
        label: "Company legal name",
        type: "text",
        required: true,
        width: "half",
        autocomplete: "organization",
        maxLength: 200,
      },
      {
        name: "contactName",
        label: "Primary contact",
        type: "text",
        required: true,
        width: "half",
        autocomplete: "name",
        maxLength: 160,
      },
      {
        name: "email",
        label: "Work email",
        type: "email",
        required: true,
        width: "half",
        autocomplete: "email",
        maxLength: 200,
      },
      {
        name: "phone",
        label: "Phone number",
        type: "tel",
        required: true,
        width: "half",
        autocomplete: "tel",
        maxLength: 50,
      },
      {
        name: "category",
        label: "Primary supplier category",
        type: "text",
        required: true,
        width: "full",
        maxLength: 200,
      },
      {
        name: "profile",
        label: "Company profile",
        type: "file",
        required: true,
        width: "full",
        helpText: "PDF, maximum 5 MB.",
        allowedFileTypes: ["application/pdf"],
      },
      {
        name: "experience",
        label: "Relevant experience and capabilities",
        type: "textarea",
        required: true,
        width: "full",
        maxLength: 3000,
      },
      {
        name: "consent",
        label:
          "I confirm that the information supplied is accurate and may be reviewed for procurement opportunities.",
        type: "checkbox",
        required: true,
        width: "full",
      },
    ],
  },
  {
    formKey: "newsletter",
    internalTitle: "Insights newsletter",
    submitLabel: "Subscribe",
    fields: [
      {
        name: "email",
        label: "Work email",
        type: "email",
        required: true,
        width: "full",
        autocomplete: "email",
        maxLength: 200,
      },
      {
        name: "consent",
        label:
          "I agree to receive selected Startime updates and can unsubscribe at any time.",
        type: "checkbox",
        required: true,
        width: "full",
      },
    ],
  },
  {
    formKey: "simf-sponsorship",
    internalTitle: "SIMF sponsorship enquiry",
    submitLabel: "Submit sponsorship enquiry",
    submitLabelAr: "إرسال طلب الرعاية",
    fields: [
      {
        name: "fullName",
        label: "Full name",
        type: "text",
        required: true,
        width: "half",
        autocomplete: "name",
        maxLength: 160,
      },
      {
        name: "workEmail",
        label: "Work email",
        type: "email",
        required: true,
        width: "half",
        autocomplete: "email",
        maxLength: 200,
      },
      {
        name: "phone",
        label: "Phone number",
        type: "tel",
        required: true,
        width: "half",
        autocomplete: "tel",
        maxLength: 50,
      },
      {
        name: "jobTitle",
        label: "Job title",
        type: "text",
        required: true,
        width: "half",
        autocomplete: "organization-title",
        maxLength: 150,
      },
      {
        name: "organization",
        label: "Organization",
        type: "text",
        required: true,
        width: "half",
        autocomplete: "organization",
        maxLength: 200,
      },
      {
        name: "website",
        label: "Organization website",
        type: "url",
        width: "half",
        autocomplete: "url",
        maxLength: 500,
      },
      {
        name: "organizationType",
        label: "Organization type",
        type: "select",
        required: true,
        width: "half",
        placeholder: "Select organization type",
        options: [
          { label: "Government or public sector", value: "government" },
          { label: "Defence or security", value: "defence-security" },
          { label: "Maritime or logistics", value: "maritime-logistics" },
          { label: "Energy or infrastructure", value: "energy-infrastructure" },
          {
            label: "Technology or cybersecurity",
            value: "technology-cybersecurity",
          },
          { label: "Professional services", value: "professional-services" },
          { label: "Other", value: "other" },
        ],
      },
      {
        name: "sponsorshipInterest",
        label: "Sponsorship interest",
        type: "select",
        required: true,
        width: "half",
        placeholder: "Select an area of interest",
        options: [
          { label: "Strategic Sponsor", value: "strategic-sponsor" },
          { label: "Energy Sector Sponsor", value: "sector-energy" },
          { label: "Logistics Sector Sponsor", value: "sector-logistics" },
          { label: "Technology Sector Sponsor", value: "sector-technology" },
          { label: "Diamond Sponsor", value: "diamond" },
          { label: "Platinum Sponsor", value: "platinum" },
          { label: "Gold Sponsor", value: "gold" },
          { label: "Silver Sponsor", value: "silver" },
          { label: "Co-Sponsor", value: "co-sponsor" },
          { label: "Official Carrier", value: "official-carrier" },
          { label: "Hospitality Sponsor", value: "hospitality" },
          { label: "Recommend the best route", value: "recommend" },
        ],
      },
      {
        name: "preferredEngagement",
        label: "Primary engagement objective",
        type: "select",
        required: true,
        width: "half",
        placeholder: "Select your primary objective",
        options: [
          { label: "Institutional visibility", value: "visibility" },
          {
            label: "Government and executive engagement",
            value: "executive-engagement",
          },
          {
            label: "Thought leadership or speaking",
            value: "thought-leadership",
          },
          { label: "Exhibition or technology showcase", value: "exhibition" },
          { label: "Hospitality and guest experience", value: "hospitality" },
          { label: "Media and content reach", value: "media" },
          {
            label: "Business meetings and partnerships",
            value: "business-meetings",
          },
        ],
      },
      {
        name: "estimatedBudget",
        label: "Indicative sponsorship budget",
        type: "select",
        width: "full",
        placeholder: "Prefer not to say / select a range",
        options: [
          { label: "Under SAR 250,000", value: "under-250k" },
          { label: "SAR 250,000–500,000", value: "250k-500k" },
          { label: "SAR 500,000–1,000,000", value: "500k-1m" },
          { label: "SAR 1,000,000+", value: "1m-plus" },
          { label: "To be discussed", value: "discuss" },
        ],
      },
      {
        name: "objectives",
        label: "What would you like the partnership to achieve?",
        type: "textarea",
        required: true,
        width: "full",
        helpText:
          "Tell us about your audience, strategic objectives, preferred activations, or partnership ideas.",
        maxLength: 3000,
      },
      {
        name: "companyProfile",
        label: "Organization profile (optional)",
        type: "file",
        width: "full",
        helpText: "PDF, maximum 5 MB.",
        allowedFileTypes: ["application/pdf"],
      },
      {
        name: "consent",
        label:
          "I agree that Startime may use this information to assess and respond to this sponsorship enquiry.",
        type: "checkbox",
        required: true,
        width: "full",
      },
    ],
    fieldsAr: [
      {
        name: "fullName",
        label: "الاسم الكامل",
        type: "text",
        required: true,
        width: "half",
        autocomplete: "name",
        maxLength: 160,
      },
      {
        name: "workEmail",
        label: "البريد الإلكتروني للعمل",
        type: "email",
        required: true,
        width: "half",
        autocomplete: "email",
        maxLength: 200,
      },
      {
        name: "phone",
        label: "رقم الهاتف",
        type: "tel",
        required: true,
        width: "half",
        autocomplete: "tel",
        maxLength: 50,
      },
      {
        name: "jobTitle",
        label: "المسمى الوظيفي",
        type: "text",
        required: true,
        width: "half",
        autocomplete: "organization-title",
        maxLength: 150,
      },
      {
        name: "organization",
        label: "الجهة أو الشركة",
        type: "text",
        required: true,
        width: "half",
        autocomplete: "organization",
        maxLength: 200,
      },
      {
        name: "website",
        label: "الموقع الإلكتروني للجهة",
        type: "url",
        width: "half",
        autocomplete: "url",
        maxLength: 500,
      },
      {
        name: "organizationType",
        label: "نوع الجهة",
        type: "select",
        required: true,
        width: "half",
        placeholder: "اختر نوع الجهة",
        options: [
          { label: "جهة حكومية أو قطاع عام", value: "government" },
          { label: "الدفاع أو الأمن", value: "defence-security" },
          { label: "البحري أو الخدمات اللوجستية", value: "maritime-logistics" },
          { label: "الطاقة أو البنية التحتية", value: "energy-infrastructure" },
          {
            label: "التقنية أو الأمن السيبراني",
            value: "technology-cybersecurity",
          },
          { label: "الخدمات المهنية", value: "professional-services" },
          { label: "أخرى", value: "other" },
        ],
      },
      {
        name: "sponsorshipInterest",
        label: "فئة الرعاية المطلوبة",
        type: "select",
        required: true,
        width: "half",
        placeholder: "اختر مجال الاهتمام",
        options: [
          { label: "الراعي الاستراتيجي", value: "strategic-sponsor" },
          { label: "راعي قطاع الطاقة", value: "sector-energy" },
          { label: "راعي قطاع الخدمات اللوجستية", value: "sector-logistics" },
          { label: "راعي قطاع التقنية", value: "sector-technology" },
          { label: "الراعي الماسي", value: "diamond" },
          { label: "الراعي البلاتيني", value: "platinum" },
          { label: "الراعي الذهبي", value: "gold" },
          { label: "الراعي الفضي", value: "silver" },
          { label: "الرعاية المشتركة", value: "co-sponsor" },
          { label: "الناقل الرسمي", value: "official-carrier" },
          { label: "راعي الضيافة", value: "hospitality" },
          { label: "اقترحوا المسار الأنسب", value: "recommend" },
        ],
      },
      {
        name: "preferredEngagement",
        label: "الهدف الرئيسي من المشاركة",
        type: "select",
        required: true,
        width: "half",
        placeholder: "اختر الهدف الرئيسي",
        options: [
          { label: "الحضور المؤسسي", value: "visibility" },
          { label: "التواصل الحكومي والتنفيذي", value: "executive-engagement" },
          { label: "القيادة الفكرية أو التحدث", value: "thought-leadership" },
          { label: "المعرض أو عرض التقنية", value: "exhibition" },
          { label: "الضيافة وتجربة الضيوف", value: "hospitality" },
          { label: "الوصول الإعلامي والمحتوى", value: "media" },
          { label: "اجتماعات الأعمال والشراكات", value: "business-meetings" },
        ],
      },
      {
        name: "estimatedBudget",
        label: "الميزانية التقديرية للرعاية",
        type: "select",
        width: "full",
        placeholder: "أفضل عدم الإفصاح / اختر النطاق",
        options: [
          { label: "أقل من 250,000 ريال", value: "under-250k" },
          { label: "250,000–500,000 ريال", value: "250k-500k" },
          { label: "500,000–1,000,000 ريال", value: "500k-1m" },
          { label: "أكثر من 1,000,000 ريال", value: "1m-plus" },
          { label: "تُناقش لاحقاً", value: "discuss" },
        ],
      },
      {
        name: "objectives",
        label: "ما الأهداف التي ترغبون في تحقيقها من الشراكة؟",
        type: "textarea",
        required: true,
        width: "full",
        helpText:
          "عرّفنا بالجمهور المستهدف والأهداف الاستراتيجية والتفعيلات أو أفكار الشراكة.",
        maxLength: 3000,
      },
      {
        name: "companyProfile",
        label: "ملف تعريفي بالجهة (اختياري)",
        type: "file",
        width: "full",
        helpText: "PDF، بحد أقصى 5 ميجابايت.",
        allowedFileTypes: ["application/pdf"],
      },
      {
        name: "consent",
        label:
          "أوافق على استخدام ستارتايم لهذه المعلومات لتقييم طلب الرعاية والرد عليه.",
        type: "checkbox",
        required: true,
        width: "full",
      },
    ],
  },
];

function collectMedia(value: unknown, paths = new Set<string>()): Set<string> {
  if (typeof value === "string" && value.startsWith("/assets/")) {
    paths.add(value);
  } else if (Array.isArray(value)) {
    value.forEach((entry) => collectMedia(entry, paths));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((entry) => collectMedia(entry, paths));
  }
  return paths;
}

function replaceMedia(
  value: unknown,
  mediaIDs: Map<string, number | string>,
): unknown {
  if (typeof value === "string" && value.startsWith("/assets/")) {
    return mediaIDs.get(value) || value;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => replaceMedia(entry, mediaIDs));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        replaceMedia(entry, mediaIDs),
      ]),
    );
  }
  return value;
}

function mediaAlt(assetPath: string): string {
  return path
    .basename(assetPath, path.extname(assetPath))
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

const payload = await getPayload({ config: configPromise });
function richText(body: string) {
  return {
    root: {
      type: "root",
      children: body.split(/\n\n+/).filter(Boolean).map((text) => ({
        type: "paragraph",
        children: [{ type: "text", detail: 0, format: 0, mode: "normal", style: "", text, version: 1 }],
        direction: null, format: "", indent: 0, textFormat: 0, textStyle: "", version: 1,
      })),
      direction: null, format: "", indent: 0, version: 1,
    },
  };
}
const allMediaPaths = new Set<string>();

const formIDs = new Map<string, number | string>();
for (const definition of formDefinitions) {
  const existing = await payload.find({
    collection: "forms",
    limit: 1,
    overrideAccess: true,
    where: { formKey: { equals: definition.formKey } },
  });
  let formID = existing.docs[0]?.id;
  for (const locale of locales) {
    const localizedDefinition = definition as typeof definition & {
      fieldsAr?: typeof definition.fields;
      submitLabelAr?: string;
    };
    const baseDefinition = Object.fromEntries(
      Object.entries(localizedDefinition).filter(
        ([key]) => key !== "fieldsAr" && key !== "submitLabelAr",
      ),
    );
    const data = {
      ...baseDefinition,
      conversionCurrency: "SAR",
      conversionValue: 0,
      fields:
        locale === "ar" && localizedDefinition.fieldsAr
          ? localizedDefinition.fieldsAr
          : definition.fields,
      submitLabel:
        locale === "ar" && localizedDefinition.submitLabelAr
          ? localizedDefinition.submitLabelAr
          : definition.submitLabel,
      _status: "published",
      active: true,
      rateLimit: { requests: 5, windowMinutes: 15 },
    };
    if (!formID) {
      const created = await payload.create({
        collection: "forms",
        data: data as never,
        draft: false,
        locale,
        overrideAccess: true,
      });
      formID = created.id;
    } else {
      await payload.update({
        collection: "forms",
        id: formID,
        data: data as never,
        draft: false,
        locale,
        overrideAccess: true,
      });
    }
  }
  formIDs.set(definition.formKey, formID!);
}

for (const locale of locales) {
  for (const pageType of pageTypes) {
    collectMedia(getDefaultPage(locale, pageType), allMediaPaths);
  }
  collectMedia(getDefaultChrome(locale), allMediaPaths);
}
for (const post of insightPosts) {
  allMediaPaths.add(post.image);
}

const mediaIDs = new Map<string, number | string>();
for (const assetPath of allMediaPaths) {
  const existing = await payload.find({
    collection: "media",
    limit: 1,
    overrideAccess: true,
    locale: "en",
    where: { alt: { equals: mediaAlt(assetPath) } },
  });
  const media =
    existing.docs[0] ||
    (await payload.create({
      collection: "media",
      data: {
        alt: mediaAlt(assetPath),
        usageNotes: `Seeded from ${assetPath}`,
      },
      filePath: path.join(projectRoot, "public", assetPath),
      locale: "en",
      overrideAccess: true,
    }));
  mediaIDs.set(assetPath, media.id);
}

const insightCategoryIDs = new Map<string, number | string>();
for (const [index, category] of insightCategories.entries()) {
  const existing = await payload.find({
    collection: "insight-categories",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { internalTitle: { equals: category.internalTitle } },
  });
  let categoryID = existing.docs[0]?.id;
  for (const locale of locales) {
    const data = {
      _status: "published",
      displayOrder: (index + 1) * 10,
      internalTitle: category.internalTitle,
      slug: category.slug,
      title: locale === "ar" ? category.titleAr : category.title,
      visible: true,
    };
    if (!categoryID) {
      const created = await payload.create({
        collection: "insight-categories",
        data: data as never,
        draft: false,
        locale,
        overrideAccess: true,
      });
      categoryID = created.id;
    } else {
      await payload.update({
        collection: "insight-categories",
        id: categoryID,
        data: data as never,
        draft: false,
        locale,
        overrideAccess: true,
      });
    }
  }
  insightCategoryIDs.set(category.internalTitle, categoryID!);
}

for (const post of insightPosts) {
  const approved = approvedInsightContent[post.internalTitle];
  const existing = await payload.find({
    collection: "insights-posts",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { internalTitle: { equals: post.internalTitle } },
  });
  let postID = existing.docs[0]?.id;
  for (const locale of locales) {
    const localizedInsight =
      locale === "ar"
        ? approvedArabicInsightContent[post.internalTitle]
        : approved;
    if (!localizedInsight) {
      throw new Error(`Missing ${locale} insight copy for ${post.internalTitle}.`);
    }
    const destination =
      locale === "ar" ? `/ar/insights/${post.slug}` : `/insights/${post.slug}`;
    const data = {
      _status: "published",
      category: insightCategoryIDs.get(post.category)!,
      content: localizedInsight.content.map(({ body, heading }) => ({
        ...(heading ? { heading } : {}),
        body: richText(body),
      })),
      destination,
      featuredImage: mediaIDs.get(post.image)!,
      internalTitle: post.internalTitle,
      intro: localizedInsight.intro || null,
      publishedAt: post.publishedAt,
      publicationLabel: approved.publicationLabel,
      seo: {
        description: post.summary,
        indexable: true,
        title: `${localizedInsight.title} | Startime`.slice(0, 70),
      },
      showOnHomepage: true,
      showOnInsightsPage: true,
      slug: post.slug,
      summary: "summary" in localizedInsight ? localizedInsight.summary : post.summary,
      title: localizedInsight.title,
      visible: true,
    };
    if (!postID) {
      const created = await payload.create({
        collection: "insights-posts",
        data: data as never,
        draft: false,
        locale,
        overrideAccess: true,
      });
      postID = created.id;
    } else {
      await payload.update({
        collection: "insights-posts",
        id: postID,
        data: data as never,
        draft: false,
        locale,
        overrideAccess: true,
      });
    }
  }
}

for (const pageType of pageTypes) {
  const existing = await payload.find({
    collection: "pages",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { pageType: { equals: pageType } },
  });
  let pageID = existing.docs[0]?.id;

  for (const locale of locales) {
    const page = getDefaultPage(locale, pageType);
    const sections = (replaceMedia(page.sections, mediaIDs) as PageSection[]).map(
      (section) => {
        if (section.blockType !== "form" || typeof section.form !== "string") {
          return section;
        }
        return {
          ...section,
          form: formIDs.get(section.form) || section.form,
        };
      },
    );
    const localizedData = {
      _status: "published",
      internalTitle: internalPageTitles[pageType] || page.title,
      pageType,
      sections,
      seo: {
        ...page.seo,
        description: page.seo?.description?.slice(0, 180),
        title: page.seo?.title?.slice(0, 70),
      },
      slug: pageType === "home" ? "home" : page.slug,
      summary: page.summary,
      title: page.title,
      visible: true,
      showInNavigation: pageType !== "contact",
    };

    if (!pageID) {
      const created = await payload.create({
        collection: "pages",
        data: localizedData as never,
        draft: false,
        locale,
        overrideAccess: true,
      });
      pageID = created.id;
    } else {
      await payload.update({
        collection: "pages",
        id: pageID,
        data: localizedData as never,
        draft: false,
        locale,
        overrideAccess: true,
      });
    }
  }
}

// Retain older records for recovery, but keep the public site limited to the
// approved current Startime information architecture.
const obsoletePages = await payload.find({
  collection: "pages",
  depth: 0,
  limit: 500,
  overrideAccess: true,
  where: { pageType: { not_in: pageTypes } },
});
for (const obsoletePage of obsoletePages.docs) {
  for (const locale of locales) {
    await payload.update({
      collection: "pages",
      id: obsoletePage.id,
      data: {
        internalTitle: obsoletePage.internalTitle?.startsWith("Archived —")
          ? obsoletePage.internalTitle
          : `Archived — ${obsoletePage.internalTitle || obsoletePage.title || obsoletePage.slug}`,
        pageType: "generic",
        showInNavigation: false,
        visible: false,
      },
      draft: false,
      locale,
      overrideAccess: true,
    });
  }
}

for (const locale of locales) {
  const chrome = getDefaultChrome(locale);
  const { organization, ...chromeFields } = chrome;
  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      ...(replaceMedia(chromeFields, mediaIDs) as Record<string, unknown>),
      organizationAddress: {
        addressCountry: organization.addressCountry,
        addressLocality: organization.addressLocality,
        addressRegion: organization.addressRegion,
        latitude: organization.latitude,
        longitude: organization.longitude,
        postalCode: organization.postalCode,
        streetAddress: organization.streetAddress,
      },
      organizationAlternateName: organization.alternateName,
      organizationDescription: organization.description,
      organizationEmail: organization.email,
      organizationKeywords: organization.keywords.map((keyword) => ({ keyword })),
      organizationLegalName: organization.legalName,
      organizationLogo: replaceMedia(organization.logo, mediaIDs),
      organizationPhone: organization.phone,
      organizationURL: organization.url,
      foundingDate: organization.foundingDate,
      _status: "published",
    } as never,
    draft: false,
    locale,
    overrideAccess: true,
  });
}

console.log(
  `Seeded ${pageTypes.length} page records for ${locales.join(", ")}, site chrome, and ${mediaIDs.size} media assets.`,
);
process.exit(0);
