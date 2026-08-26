import fs from "node:fs";
import path from "node:path";
import configPromise from "@payload-config";
import { getPayload, type Where } from "payload";

type Finding = {
  path: string;
  sourceText?: string;
  text: string;
  type: "english-remains" | "missing-arabic" | "wrong-internal-link";
};

const findings: Finding[] = [];
const visibleKeys = new Set([
  "acceptLabel",
  "address",
  "alt",
  "body",
  "caption",
  "companyHeading",
  "consentLabel",
  "contactHeading",
  "cookieNotice",
  "copyright",
  "ctaLabel",
  "defaultSEODescription",
  "description",
  "eyebrow",
  "footerDescription",
  "heading",
  "headerCtaLabel",
  "helpText",
  "intro",
  "label",
  "meta",
  "mapTitle",
  "navigationLabel",
  "newsletterBody",
  "newsletterHeading",
  "openGraphDescription",
  "openGraphTitle",
  "placeholder",
  "privacyNote",
  "projectCtaLabel",
  "publicationLabel",
  "rejectLabel",
  "settingsLabel",
  "siteName",
  "submitLabel",
  "successHeading",
  "successMessage",
  "summary",
  "title",
  "value",
]);
const ignoredExact = new Set([
  "AR",
  "B2B",
  "EN",
  "SAR",
  "SIMF",
  "Startime",
  "Triple S Arena",
  "UFI",
]);

function checkValue(
  english: unknown,
  arabic: unknown,
  currentPath: string,
  keyName = "",
) {
  if (Array.isArray(english)) {
    if (!Array.isArray(arabic) || english.length !== arabic.length) {
      findings.push({
        path: currentPath,
        sourceText: `${english.length} item(s)`,
        text: Array.isArray(arabic)
          ? `${arabic.length} Arabic item(s)`
          : "Arabic array is missing",
        type: "missing-arabic",
      });
      return;
    }
    english.forEach((entry, index) =>
      checkValue(entry, arabic[index], `${currentPath}[${index}]`),
    );
    return;
  }
  if (
    english &&
    arabic &&
    typeof english === "object" &&
    typeof arabic === "object"
  ) {
    Object.entries(english).forEach(([key, value]) =>
      checkValue(
        value,
        (arabic as Record<string, unknown>)[key],
        `${currentPath}.${key}`,
        key,
      ),
    );
    return;
  }
  if (
    typeof english !== "string" ||
    typeof arabic !== "string" ||
    !visibleKeys.has(keyName) ||
    keyName === "internalLabel" ||
    ignoredExact.has(english) ||
    /^(?:https?:\/\/|mailto:|tel:)/i.test(english) ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(english) ||
    !/[A-Za-z]/.test(english) ||
    (keyName === "value" && currentPath.includes(".options["))
  ) {
    return;
  }
  if (english === arabic && /[A-Za-z]{3}/.test(english)) {
    findings.push({
      path: currentPath,
      sourceText: english,
      text: arabic,
      type: "english-remains",
    });
  } else if (
    english.length > 8 &&
    /[A-Za-z]{4}/.test(english) &&
    !/[\u0600-\u06ff]/.test(arabic)
  ) {
    findings.push({
      path: currentPath,
      sourceText: english,
      text: arabic,
      type: "missing-arabic",
    });
  }
}

function checkArabicLinks(value: unknown, currentPath: string) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      checkArabicLinks(entry, `${currentPath}[${index}]`),
    );
    return;
  }
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([key, entry]) => {
    const entryPath = `${currentPath}.${key}`;
    if (
      typeof entry === "string" &&
      ["href", "ctaHref", "destination", "headerCtaHref"].includes(key) &&
      entry.startsWith("/") &&
      !entry.startsWith("/ar") &&
      !entry.startsWith("/api") &&
      !entry.startsWith("/assets") &&
      !entry.startsWith("/content-admin")
    ) {
      findings.push({
        path: entryPath,
        text: entry,
        type: "wrong-internal-link",
      });
    }
    checkArabicLinks(entry, entryPath);
  });
}

const payload = await getPayload({ config: configPromise });

async function compareCollection(
  collection:
    "forms" | "insight-categories" | "insights-posts" | "media" | "pages",
) {
  const where: Where | undefined =
    collection === "pages"
      ? { visible: { equals: true } }
      : collection === "forms"
        ? { formKey: { in: ["contact", "careers"] } }
        : undefined;
  const [english, arabic] = await Promise.all([
    payload.find({
      collection,
      depth: 0,
      draft: false,
      fallbackLocale: false,
      limit: 250,
      locale: "en",
      overrideAccess: true,
      where,
    }),
    payload.find({
      collection,
      depth: 0,
      draft: false,
      fallbackLocale: false,
      limit: 250,
      locale: "ar",
      overrideAccess: true,
      where,
    }),
  ]);
  const arabicByID = new Map(
    arabic.docs.map((document) => [document.id, document]),
  );
  english.docs.forEach((document) => {
    const translated = arabicByID.get(document.id);
    checkValue(document, translated, `${collection}.${document.id}`);
    checkArabicLinks(translated, `${collection}.${document.id}`);
  });
}

// Audit only content rendered by the current public Startime site. Archived
// microsite/news records are intentionally excluded so they cannot mask a
// regression in the seven live bilingual page families.
for (const collection of ["pages", "forms"] as const) {
  await compareCollection(collection);
}

for (const slug of ["site-settings", "marketing-settings"] as const) {
  const [english, arabic] = await Promise.all([
    payload.findGlobal({
      slug,
      depth: 0,
      draft: false,
      fallbackLocale: false,
      locale: "en",
      overrideAccess: true,
    }),
    payload.findGlobal({
      slug,
      depth: 0,
      draft: false,
      fallbackLocale: false,
      locale: "ar",
      overrideAccess: true,
    }),
  ]);
  checkValue(english, arabic, slug);
  checkArabicLinks(arabic, slug);
}

const reportPath = path.join(
  process.cwd(),
  "translations",
  "arabic-audit.json",
);
fs.writeFileSync(
  reportPath,
  `${JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      findingCount: findings.length,
      findings,
    },
    null,
    2,
  )}\n`,
);
console.log(`Arabic content audit found ${findings.length} issue(s).`);
if (findings.length) {
  console.log(findings.slice(0, 25));
  process.exit(1);
}
process.exit(0);
