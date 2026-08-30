import path from "node:path";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import type {
  Locale,
  LogoMarqueeSection,
  PageSection,
} from "../src/content/types";

const payload = await getPayload({ config: configPromise });
const assetRoot = path.join(process.cwd(), "public", "assets", "partners");

const partners = [
  ["Ministry of Defense", "وزارة الدفاع"],
  ["Royal Saudi Naval Forces", "القوات البحرية الملكية السعودية"],
  ["Startime", "ستارتايم"],
  ["Impact Event Production", "إمباكت لإنتاج الفعاليات"],
  ["General Authority for Military Industries", "الهيئة العامة للصناعات العسكرية"],
  ["Ocean Science & Technology", "علوم وتقنيات المحيطات"],
  ["Defense Advancement", "تطوير القدرات الدفاعية"],
  ["Unmanned Systems Technology", "تقنيات الأنظمة غير المأهولة"],
  ["United Advisory Chambers", "الغرف الاستشارية المتحدة"],
  ["Navantia", "نافانتيا"],
  ["Fincantieri Arabia", "فينكانتيري العربية"],
  ["Bridge Exhibitions", "بريدج للمعارض"],
  ["Leonardo", "ليوناردو"],
  ["SAMI Navantia Naval Industries", "سامي نافانتيا للصناعات البحرية"],
  ["Maritime partners", "شركاء القطاع البحري"],
] as const;

const mediaIDs: Array<number | string> = [];

for (const [index, [englishAlt]] of partners.entries()) {
  const sourceName = `partner-${String(index + 1).padStart(2, "0")}.png`;
  const marker = `Homepage partner logo ${String(index + 1).padStart(2, "0")}`;
  const existing = await payload.find({
    collection: "media",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { usageNotes: { contains: marker } },
  });
  const data = {
    alt: englishAlt,
    usageNotes: `${marker}. Recommended replacement source: transparent SVG or PNG around 600 × 280 px with comfortable clear space. Raster uploads are converted to WebP automatically.`,
  };
  const media = existing.docs[0]
    ? await payload.update({
        collection: "media",
        id: existing.docs[0].id,
        data,
        filePath: path.join(assetRoot, sourceName),
        locale: "en",
        overrideAccess: true,
      })
    : await payload.create({
        collection: "media",
        data,
        filePath: path.join(assetRoot, sourceName),
        locale: "en",
        overrideAccess: true,
      });
  mediaIDs.push(media.id);
}

function partnerSection(locale: Locale): LogoMarqueeSection {
  const isArabic = locale === "ar";
  return {
    blockType: "logoMarquee",
    internalLabel: isArabic
      ? "شريط شركاء الصفحة الرئيسية"
      : "Homepage partners marquee",
    displayOrder: 25,
    visible: true,
    heading: isArabic
      ? "شركاؤنا في صناعة الأثر"
      : "Our partners in creating impact",
    body: isArabic
      ? "تتسع شبكة شراكاتنا مع جهات وطنية ودولية تجمعنا بها رؤية مشتركة لصناعة قيمة مستدامة."
      : "Our network brings together national and international organizations with a shared commitment to lasting value.",
    speed: "slow",
    appearance: {
      theme: "dark",
      spacing: "standard",
      backgroundColor: "#0d0924",
    },
    logos: partners.map(([englishAlt, arabicAlt], index) => ({
      logo: { id: mediaIDs[index] },
      alt: isArabic ? arabicAlt : englishAlt,
      visible: true,
    })),
  };
}

for (const locale of ["en", "ar"] satisfies Locale[]) {
  const result = await payload.find({
    collection: "pages",
    depth: 0,
    draft: true,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: true,
    where: { pageType: { equals: "home" } },
  });
  const page = result.docs[0];
  if (!page) throw new Error(`Homepage is missing for ${locale}.`);

  const incoming = partnerSection(locale);
  const original = (page.sections || []) as PageSection[];
  const existingIndex = original.findIndex(
    (section) => section.blockType === "logoMarquee",
  );
  const sections = [...original];

  if (existingIndex >= 0) {
    const existing = sections[existingIndex] as LogoMarqueeSection;
    sections[existingIndex] = {
      ...incoming,
      id: existing.id,
      internalLabel: existing.internalLabel || incoming.internalLabel,
    };
  } else {
    const projectIndex = sections.findIndex(
      (section) => section.blockType === "projectShowcase",
    );
    sections.splice(projectIndex >= 0 ? projectIndex : sections.length, 0, incoming);
  }

  await payload.update({
    collection: "pages",
    id: page.id,
    data: { _status: "published", sections } as never,
    draft: false,
    locale,
    overrideAccess: true,
  });
}

console.log(
  "Published the supplied partner logo marquee in English and Arabic without changing other homepage sections.",
);
