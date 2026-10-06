import type { Locale } from "@/content/home";

export type ContactContent = {
  hero: { title: string; body: string };
  form: {
    label: string;
    title: string;
    body: string;
    fields: string[];
    fileNote: string;
    consent: string;
    privacy: string;
    submit: string;
    successTitle: string;
    successBody: string;
  };
  headquarters: {
    title: string;
    body: string;
    facts: Array<{ label: string; value: string; href?: string }>;
  };
  location: {
    label: string;
    title: string;
    body: string;
    mapTitle: string;
    cta: string;
    directionsURL: string;
    mapEmbedURL: string;
    latitude: string;
    longitude: string;
  };
};

export const contactContent: Record<Locale, ContactContent> = {
  en: {
    hero: {
      title: "Welcome to Startime",
      body: "We welcome you to an entity that believes meaningful communication is the foundation of inspiring relationships. Our team is here to support you with professionalism and care.",
    },
    form: {
      label: "CONTACT US",
      title: "We Are Pleased to Receive Your Enquiry",
      body: "Our team will respond as soon as possible. We believe effective communication is the foundation of strong professional relationships and are committed to a smooth, clear experience for everyone who contacts us.",
      fields: ["Entity *", "Name *", "Position", "Phone", "Email *", "Message *", "Attachments"],
      fileNote: "PDF, DOCX, PNG, or JPG, maximum 5 MB.",
      consent: "I agree that Startime may use this information to respond to my enquiry.",
      privacy: "Your information is used only to respond to your enquiry.",
      submit: "Send enquiry",
      successTitle: "Your Message Has Been Received",
      successBody: "Thank you for contacting Startime. The relevant team will respond shortly.",
    },
    headquarters: {
      title: "Headquarters — Riyadh, Saudi Arabia",
      body: "We welcome your visit during official working hours: Sunday to Thursday, 9:00 AM to 5:00 PM.",
      facts: [
        { label: "Email", value: "info@startime.sa", href: "mailto:info@startime.sa" },
        { label: "Phone", value: "920010500", href: "tel:920010500" },
        { label: "Address", value: "3507, Riyadh 12341, Saudi Arabia" },
        { label: "Working Hours", value: "Sunday — Thursday | 9:00 AM — 5:00 PM" },
      ],
    },
    location: {
      label: "OUR LOCATION",
      title: "Visit Startime in Riyadh",
      body: "Explore our location on the map or open directions for an easy journey to our headquarters.",
      mapTitle: "Startime headquarters in Riyadh",
      cta: "Open in Google Maps",
      directionsURL: "https://www.google.com/maps/place/%D8%B3%D8%AA%D8%A7%D8%B1%D8%AA%D8%A7%D9%8A%D9%85+STARTIME+Events%E2%80%AD/data=!4m2!3m1!1s0x0:0x4bc875ab3d2b6a0f?sa=X&ved=1t:2428&ictx=111",
      mapEmbedURL: "https://www.google.com/maps?q=STARTIME+Events%2C+Riyadh%2C+Saudi+Arabia&output=embed",
      latitude: "",
      longitude: "",
    },
  },
  ar: {
    hero: {
      title: "حياكم في ستارتايم",
      body: "نرحب بكم في كيان يؤمن بأن التواصل هو أساس بناء العلاقات الملهمة؛ وفريقنا هنا ليكون أقرب إليكم ويدعمكم بكل احترافية واهتمام.",
    },
    form: {
      label: "تواصل معنا",
      title: "يسعدنا استقبال استفساراتكم",
      body: "سيقوم فريقنا بالرد عليكم خلال أقرب وقت ممكن. نؤمن بأن التواصل الفعّال أساس بناء علاقات مهنية قوية، ونحرص على تقديم تجربة سلسة وواضحة لكل من يتواصل معنا.",
      fields: ["الجهة *", "الاسم *", "المنصب", "الهاتف", "البريد الإلكتروني *", "الرسالة *", "المرفقات"],
      fileNote: "PDF أو DOCX أو PNG أو JPG، بحد أقصى 5 ميجابايت.",
      consent: "أوافق على استخدام ستارتايم لهذه المعلومات للرد على استفساري.",
      privacy: "تُستخدم بياناتك للرد على استفسارك فقط.",
      submit: "إرسال",
      successTitle: "وصلتنا رسالتك",
      successBody: "شكرًا لتواصلك. سيقوم الفريق المختص بالرد عليك قريبًا.",
    },
    headquarters: {
      title: "المقر الرئيسي — الرياض",
      body: "نرحب بزيارتكم خلال أوقات العمل الرسمية: الأحد إلى الخميس، 9:00 صباحًا حتى 5:00 مساءً.",
      facts: [
        { label: "البريد الإلكتروني", value: "info@startime.sa", href: "mailto:info@startime.sa" },
        { label: "الهاتف", value: "920010500", href: "tel:920010500" },
        { label: "العنوان", value: "3507 الرياض 12341، المملكة العربية السعودية" },
        { label: "أوقات العمل", value: "الأحد — الخميس | 9:00 ص — 5:00 م" },
      ],
    },
    location: {
      label: "موقعنا",
      title: "زورونا في مقر ستارتايم بالرياض",
      body: "اعرض الموقع على الخريطة أو افتح الاتجاهات للوصول إلى مقرنا بسهولة.",
      mapTitle: "موقع ستارتايم في الرياض",
      cta: "فتح الاتجاهات",
      directionsURL: "https://www.google.com/maps/place/%D8%B3%D8%AA%D8%A7%D8%B1%D8%AA%D8%A7%D9%8A%D9%85+STARTIME+Events%E2%80%AD/data=!4m2!3m1!1s0x0:0x4bc875ab3d2b6a0f?sa=X&ved=1t:2428&ictx=111",
      mapEmbedURL: "https://www.google.com/maps?q=STARTIME+Events%2C+Riyadh%2C+Saudi+Arabia&output=embed",
      latitude: "",
      longitude: "",
    },
  },
};
