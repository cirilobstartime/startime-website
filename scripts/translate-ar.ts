import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import configPromise from "@payload-config";
import { getPayload } from "payload";

type TranslationJob = {
  context: string;
  key: string;
  text: string;
};

const model = process.env.OLLAMA_ARABIC_MODEL || "malfa-allam-q5:latest";
const projectRoot = process.cwd();
const translationDir = path.join(projectRoot, "translations");
const cachePath = path.join(translationDir, "arabic-cache.json");
const markerPrefix = "__STARTIME_AR_TRANSLATION__";
const cache: Record<string, string> = fs.existsSync(cachePath)
  ? JSON.parse(fs.readFileSync(cachePath, "utf8"))
  : {};
const jobs = new Map<string, TranslationJob>();
const allJobs = new Map<string, TranslationJob>();
const manualTranslations: Record<string, string> = {
  "I agree that Startime may use this information to assess and respond to this sponsorship enquiry.":
    "أوافق على استخدام ستارتايم لهذه المعلومات لتقييم طلب الرعاية والرد عليه.",
  "Indicative sponsorship budget": "الميزانية التقديرية للرعاية",
  "Organization": "الجهة أو الشركة",
  "Organization profile (optional)": "ملف تعريفي بالجهة (اختياري)",
  "Organization type": "نوع الجهة",
  "Organization website": "الموقع الإلكتروني للجهة",
  "Primary engagement objective": "الهدف الرئيسي من المشاركة",
  "Select an area of interest": "اختر فئة الرعاية",
  "Select organization type": "اختر نوع الجهة",
  "Select your primary objective": "اختر الهدف الرئيسي",
  "Sponsorship interest": "فئة الرعاية المطلوبة",
  "What would you like the partnership to achieve?":
    "ما الأهداف التي ترغبون في تحقيقها من الشراكة؟",
  "Access to an Interconnected Global Ecosystem":
    "الوصول إلى منظومة عالمية مترابطة",
  "Expert in Terrorism, Extremism and Maritime Security, Geneva Centre for Security":
    "خبير في الإرهاب والتطرف والأمن البحري، مركز جنيف للسياسات الأمنية",
  SIMF: "المنتدى البحري السعودي الدولي",
  Startime: "ستارتايم",
  "Saudi International Maritime Forum": "المنتدى البحري السعودي الدولي",
  "Triple S Arena": "تريبل إس أرينا",
  "UNDER THE PATRONAGE OF": "تحت رعاية",
  "Vice Chief of the General Staff": "نائب رئيس هيئة الأركان العامة",
  "1.4 Million": "1.4 مليون",
  "of subsea cables": "من الكابلات البحرية",
  "of subsea pipelines worldwide": "من خطوط الأنابيب البحرية حول العالم",
};

fs.mkdirSync(translationDir, { recursive: true });

function jobKey(text: string) {
  return createHash("sha256").update(text).digest("hex");
}

function mark(text: unknown, context: string): unknown {
  if (typeof text !== "string" || !text.trim()) return text;
  if (/^\d+(?:[./-]\d+)*$/.test(text.trim())) return text;
  const key = jobKey(text);
  if (manualTranslations[text]) cache[key] = manualTranslations[text];
  const job = { context, key, text };
  allJobs.set(key, job);
  if (!cache[key]) jobs.set(key, job);
  return `${markerPrefix}${key}`;
}

function arabicizeHref(href: unknown): unknown {
  if (typeof href !== "string" || !href.startsWith("/")) return href;
  if (
    href.startsWith("/ar") ||
    href.startsWith("/api") ||
    href.startsWith("/assets") ||
    href.startsWith("/content-admin")
  ) {
    return href;
  }
  return href === "/" ? "/ar" : `/ar${href}`;
}

const sectionTextKeys = new Set([
  "body",
  "caption",
  "ctaLabel",
  "eyebrow",
  "heading",
  "label",
  "meta",
  "privacyNote",
  "successHeading",
  "successMessage",
  "summary",
  "title",
  "value",
]);

function translateSectionValue(value: unknown, context: string): unknown {
  if (Array.isArray(value)) {
    return value.map((entry, index) =>
      translateSectionValue(entry, `${context}[${index}]`),
    );
  }
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => {
      const childContext = `${context}.${key}`;
      if (
        typeof entry === "string" &&
        sectionTextKeys.has(key) &&
        key !== "internalLabel"
      ) {
        return [key, mark(entry, childContext)];
      }
      if (["href", "ctaHref"].includes(key) && typeof entry === "string") {
        return [key, arabicizeHref(entry)];
      }
      return [key, translateSectionValue(entry, childContext)];
    }),
  );
}

function translateStructuredData(value: unknown, context: string): unknown {
  if (Array.isArray(value)) {
    return value.map((entry, index) =>
      translateStructuredData(entry, `${context}[${index}]`),
    );
  }
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => {
      if (
        typeof entry === "string" &&
        ["name", "description", "headline"].includes(key)
      ) {
        return [key, mark(entry, `${context}.${key}`)];
      }
      return [key, translateStructuredData(entry, `${context}.${key}`)];
    }),
  );
}

function translateFormFields(fields: unknown, formKey: string): unknown {
  if (!Array.isArray(fields)) return fields;
  return fields.map((field, index) => {
    if (!field || typeof field !== "object") return field;
    const typed = field as Record<string, unknown>;
    return {
      ...typed,
      helpText: mark(typed.helpText, `form.${formKey}.field.${index}.helpText`),
      label: mark(typed.label, `form.${formKey}.field.${index}.label`),
      options: Array.isArray(typed.options)
        ? typed.options.map((option, optionIndex) => {
            if (!option || typeof option !== "object") return option;
            const typedOption = option as Record<string, unknown>;
            return {
              ...typedOption,
              label: mark(
                typedOption.label,
                `form.${formKey}.field.${index}.option.${optionIndex}`,
              ),
            };
          })
        : typed.options,
      placeholder: mark(
        typed.placeholder,
        `form.${formKey}.field.${index}.placeholder`,
      ),
    };
  });
}

function translateLinkGroups(value: unknown, context: string): unknown {
  if (!Array.isArray(value)) return value;
  return value.map((group, groupIndex) => {
    if (!group || typeof group !== "object") return group;
    const typed = group as Record<string, unknown>;
    return {
      ...typed,
      heading: mark(typed.heading, `${context}.${groupIndex}.heading`),
      links: Array.isArray(typed.links)
        ? typed.links.map((link, linkIndex) => {
            if (!link || typeof link !== "object") return link;
            const typedLink = link as Record<string, unknown>;
            return {
              ...typedLink,
              href: arabicizeHref(typedLink.href),
              label: mark(
                typedLink.label,
                `${context}.${groupIndex}.link.${linkIndex}`,
              ),
            };
          })
        : typed.links,
    };
  });
}

function translateNavigation(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  return value.map((item, itemIndex) => {
    if (!item || typeof item !== "object") return item;
    const typed = item as Record<string, unknown>;
    return {
      ...typed,
      href: arabicizeHref(typed.href),
      label: mark(typed.label, `site.navigation.${itemIndex}.label`),
      children: Array.isArray(typed.children)
        ? typed.children.map((child, childIndex) => {
            if (!child || typeof child !== "object") return child;
            const typedChild = child as Record<string, unknown>;
            return {
              ...typedChild,
              description: mark(
                typedChild.description,
                `site.navigation.${itemIndex}.child.${childIndex}.description`,
              ),
              href: arabicizeHref(typedChild.href),
              label: mark(
                typedChild.label,
                `site.navigation.${itemIndex}.child.${childIndex}.label`,
              ),
            };
          })
        : typed.children,
    };
  });
}

function resolveMarkers(value: unknown): unknown {
  if (typeof value === "string" && value.startsWith(markerPrefix)) {
    const key = value.slice(markerPrefix.length);
    if (!cache[key]) throw new Error(`Missing Arabic translation for ${key}`);
    return cache[key];
  }
  if (Array.isArray(value)) return value.map(resolveMarkers);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, resolveMarkers(entry)]),
    );
  }
  return value;
}

function stripLocalizedArrayIDs(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        return stripLocalizedArrayIDs(entry);
      }
      return Object.fromEntries(
        Object.entries(entry)
          .filter(([key]) => key !== "id")
          .map(([key, child]) => [key, stripLocalizedArrayIDs(child)]),
      );
    });
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        stripLocalizedArrayIDs(child),
      ]),
    );
  }
  return value;
}

function fitSEOFields(value: unknown): unknown {
  const data = resolveMarkers(value) as Record<string, unknown>;
  if (!data.seo || typeof data.seo !== "object") return data;
  const seo = data.seo as Record<string, unknown>;
  const clip = (entry: unknown, maximum: number) =>
    typeof entry === "string" && entry.length > maximum
      ? entry.slice(0, maximum - 1).trimEnd() + "…"
      : entry;
  return {
    ...data,
    seo: {
      ...seo,
      description: clip(seo.description, 180),
      openGraphDescription: clip(seo.openGraphDescription, 200),
      openGraphTitle: clip(seo.openGraphTitle, 70),
      title: clip(seo.title, 70),
    },
  };
}

function saveCache() {
  fs.writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
}

async function translateOne(
  job: TranslationJob,
  strict = false,
): Promise<string> {
  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    body: JSON.stringify({
      model,
      options: { num_ctx: 4096, num_predict: 2048, temperature: 0.15 },
      prompt: `أنت مترجم ومحرر محتوى سعودي محترف لموقع شركة فعاليات واستثمارات رائدة.

ترجم النص الإنجليزي التالي إلى العربية السعودية المعاصرة المستخدمة بشكل طبيعي في مواقع الشركات داخل المملكة. استخدم لغة واضحة، راقية، وسهلة، وليست ترجمة حرفية أو لغة تراثية ثقيلة. حافظ على المعنى التجاري والإقناعي بالكامل، وعلى الأرقام والأسماء والاقتباسات. لا تضف أي معلومة غير موجودة في النص، ولا تختصره، ولا تشرحه، ولا تغيّر الحقائق.
${strict ? "هذه محاولة تصحيح إلزامية: ترجم النص نفسه فقط وبطول قريب جداً من الأصل. إذا كان العنوان قصيراً فأعد عنواناً قصيراً واحداً فقط. يمنع إضافة جمل أو فقرات أو معلومات تسويقية." : ""}

قواعد المصطلحات:
- Startime = ستارتايم
- Saudi Vision 2030 = رؤية السعودية 2030
- Triple S Arena = تريبل إس أرينا
- Saudi International Maritime Forum = المنتدى البحري السعودي الدولي
- SIMF = المنتدى البحري السعودي الدولي
- B2B = الأعمال بين الشركات
- UFI يبقى UFI

السياق: ${job.context}
النص:
${job.text}

أعد الترجمة العربية فقط من دون شرح أو علامات اقتباس إضافية.`,
      stream: false,
    }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Ollama returned ${response.status}`);
  }
  const result = (await response.json()) as { response?: string };
  const translated = String(result.response || "")
    .trim()
    .replace(/^["“]|["”]$/g, "")
    .trim();
  if (!translated) throw new Error(`Empty translation for ${job.context}`);
  const suspicious =
    job.text.length < 120
      ? translated.includes("\n") ||
        translated.length > Math.max(90, job.text.length * 2.2)
      : translated.length > job.text.length * 1.65 ||
        translated.length < job.text.length * 0.38;
  if (!strict && suspicious) return translateOne(job, true);
  if (strict && suspicious) return translateLiteral(job);
  return translated;
}

async function translateLiteral(job: TranslationJob): Promise<string> {
  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    body: JSON.stringify({
      model,
      options: { num_ctx: 2048, num_predict: 512, temperature: 0 },
      prompt: `ترجم النص التالي فقط إلى عربية سعودية واضحة وطبيعية. لا تكمل العبارة، ولا تضف شرحاً أو معلومات أو أمثلة. أعد الترجمة فقط وبنفس الطول تقريباً:

${job.text}`,
      stream: false,
    }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Ollama literal retry returned ${response.status}`);
  }
  const result = (await response.json()) as { response?: string };
  const translated = String(result.response || "")
    .trim()
    .replace(/^["“]|["”]$/g, "")
    .trim();
  const stillSuspicious =
    !translated ||
    (job.text.length < 120 &&
      (translated.includes("\n") ||
        translated.length > Math.max(90, job.text.length * 2.2))) ||
    (job.text.length >= 120 &&
      (translated.length > job.text.length * 1.65 ||
        translated.length < job.text.length * 0.38));
  if (stillSuspicious) {
    throw new Error(`ALLaM could not faithfully translate: ${job.context}`);
  }
  return translated;
}

async function translateBatch(batch: TranslationJob[]) {
  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    body: JSON.stringify({
      format: "json",
      model,
      options: { num_ctx: 4096, num_predict: 2048, temperature: 0.12 },
      prompt: `أنت مترجم ومحرر محتوى سعودي محترف لموقع شركة فعاليات واستثمارات رائدة.

ترجم كل نص في القائمة إلى العربية السعودية المعاصرة المستخدمة بشكل طبيعي في مواقع الشركات داخل المملكة. استخدم لغة واضحة، راقية، وسهلة، وليست ترجمة حرفية أو لغة تراثية ثقيلة. حافظ على المعنى التجاري والإقناعي بالكامل، وعلى الأرقام والأسماء والاقتباسات. لا تضف أي معلومة غير موجودة في النص، ولا تختصره، ولا تشرحه، ولا تغيّر الحقائق.

قواعد المصطلحات:
- Startime = ستارتايم
- Saudi Vision 2030 = رؤية السعودية 2030
- Triple S Arena = تريبل إس أرينا
- Saudi International Maritime Forum = المنتدى البحري السعودي الدولي
- SIMF = المنتدى البحري السعودي الدولي
- B2B = الأعمال بين الشركات
- UFI يبقى UFI

أعد JSON فقط بهذه الصيغة:
{"translations":[{"id":"المعرف نفسه","text":"الترجمة العربية فقط"}]}

المدخل:
${JSON.stringify(
  batch.map((job, index) => ({
    context: job.context,
    id: String(index),
    text: job.text,
  })),
)}`,
      stream: false,
    }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  if (!response.ok) throw new Error(`Ollama returned ${response.status}`);
  const result = (await response.json()) as { response?: string };
  const parsed = JSON.parse(String(result.response || "{}")) as {
    translations?: Array<{ id?: string; text?: string }>;
  };
  const translated = new Map(
    (parsed.translations || []).map((item) => [
      String(item.id || ""),
      String(item.text || "").trim(),
    ]),
  );
  if (
    batch.some(
      (job, index) =>
        !translated.get(String(index)) ||
        translated.get(String(index)) === job.text,
    )
  ) {
    throw new Error("Incomplete batch translation");
  }
  for (const [index, job] of batch.entries()) {
    cache[job.key] = translated.get(String(index))!;
  }
}

async function translateJobs() {
  const pending = [...jobs.values()];
  console.log(
    `Translating ${pending.length} unique strings with ${model}; ${Object.keys(cache).length} cached.`,
  );
  const batches: TranslationJob[][] = [];
  let queued = 0;
  while (queued < pending.length) {
    const batch: TranslationJob[] = [];
    let characters = 0;
    while (
      queued + batch.length < pending.length &&
      batch.length < 1 &&
      characters +
        pending[queued + batch.length].text.length +
        pending[queued + batch.length].context.length <
        2500
    ) {
      const next = pending[queued + batch.length];
      batch.push(next);
      characters += next.text.length + next.context.length;
    }
    if (!batch.length) batch.push(pending[queued]);
    batches.push(batch);
    queued += batch.length;
  }

  let nextBatch = 0;
  let completed = 0;
  async function worker() {
    while (nextBatch < batches.length) {
      const batchIndex = nextBatch;
      nextBatch += 1;
      const batch = batches[batchIndex];
      try {
        if (batch.length === 1 || batch.some((job) => job.text.length > 220)) {
          for (const job of batch) cache[job.key] = await translateOne(job);
        } else {
          await translateBatch(batch);
        }
      } catch {
        for (const job of batch) cache[job.key] = await translateOne(job);
      }
      completed += batch.length;
      saveCache();
      console.log(`Translated ${completed}/${pending.length}`);
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()]);
}

const payload = await getPayload({ config: configPromise });

const pages = await payload.find({
  collection: "pages",
  depth: 0,
  draft: false,
  fallbackLocale: false,
  limit: 100,
  locale: "en",
  overrideAccess: true,
});
const forms = await payload.find({
  collection: "forms",
  depth: 0,
  draft: false,
  fallbackLocale: false,
  limit: 100,
  locale: "en",
  overrideAccess: true,
});
const categories = await payload.find({
  collection: "insight-categories",
  depth: 0,
  draft: false,
  fallbackLocale: false,
  limit: 100,
  locale: "en",
  overrideAccess: true,
});
const insights = await payload.find({
  collection: "insights-posts",
  depth: 0,
  draft: false,
  fallbackLocale: false,
  limit: 100,
  locale: "en",
  overrideAccess: true,
});
const media = await payload.find({
  collection: "media",
  depth: 0,
  fallbackLocale: false,
  limit: 200,
  locale: "en",
  overrideAccess: true,
});
const site = await payload.findGlobal({
  slug: "site-settings",
  depth: 0,
  draft: false,
  fallbackLocale: false,
  locale: "en",
  overrideAccess: true,
});
const marketing = await payload.findGlobal({
  slug: "marketing-settings",
  depth: 0,
  draft: false,
  fallbackLocale: false,
  locale: "en",
  overrideAccess: true,
});

const pageUpdates = pages.docs.map((page) => {
  const canonical =
    page.pageType === "home" ? "/ar" : `/ar/${String(page.slug || "")}`;
  return {
    id: page.id,
    data: {
      _status: "published",
      navigationLabel: mark(
        page.navigationLabel,
        `page.${page.pageType}.navigationLabel`,
      ),
      redirects: stripLocalizedArrayIDs(page.redirects),
      sections: stripLocalizedArrayIDs(
        translateSectionValue(
          page.sections,
          `page.${page.pageType}.sections`,
        ),
      ),
      seo: page.seo
        ? {
            ...page.seo,
            canonicalURL: canonical,
            description: mark(
              page.seo.description,
              `page.${page.pageType}.seo.description`,
            ),
            openGraphDescription: mark(
              page.seo.openGraphDescription,
              `page.${page.pageType}.seo.openGraphDescription`,
            ),
            openGraphTitle: mark(
              page.seo.openGraphTitle,
              `page.${page.pageType}.seo.openGraphTitle`,
            ),
            structuredData: translateStructuredData(
              page.seo.structuredData,
              `page.${page.pageType}.seo.structuredData`,
            ),
            title: mark(page.seo.title, `page.${page.pageType}.seo.title`),
          }
        : page.seo,
      showInNavigation: page.showInNavigation,
      slug: page.slug,
      summary: mark(page.summary, `page.${page.pageType}.summary`),
      title: mark(page.title, `page.${page.pageType}.title`),
      visible: page.visible,
    },
  };
});

const formUpdates = forms.docs.map((form) => ({
  id: form.id,
  data: {
    _status: "published",
    consentLabel: mark(form.consentLabel, `form.${form.formKey}.consentLabel`),
    fields: stripLocalizedArrayIDs(
      translateFormFields(form.fields, form.formKey),
    ),
    submitLabel: mark(form.submitLabel, `form.${form.formKey}.submitLabel`),
  },
}));

const categoryUpdates = categories.docs.map((category) => ({
  id: category.id,
  data: {
    _status: "published",
    slug: category.slug,
    title: mark(
      category.title,
      `insightCategory.${category.internalTitle}.title`,
    ),
    visible: category.visible,
  },
}));

const insightUpdates = insights.docs.map((insight) => ({
  id: insight.id,
  data: {
    _status: "published",
    content: stripLocalizedArrayIDs(
      Array.isArray(insight.content)
        ? insight.content.map((section, index) => ({
            ...section,
            body: mark(
              section.body,
              `insight.${insight.internalTitle}.content.${index}.body`,
            ),
            heading: mark(
              section.heading,
              `insight.${insight.internalTitle}.content.${index}.heading`,
            ),
          }))
        : insight.content,
    ),
    destination: arabicizeHref(insight.destination),
    intro: mark(insight.intro, `insight.${insight.internalTitle}.intro`),
    publicationLabel: mark(
      insight.publicationLabel,
      `insight.${insight.internalTitle}.publicationLabel`,
    ),
    seo: insight.seo
      ? {
          ...insight.seo,
          description: mark(
            insight.seo.description,
            `insight.${insight.internalTitle}.seo.description`,
          ),
          title: mark(
            insight.seo.title,
            `insight.${insight.internalTitle}.seo.title`,
          ),
        }
      : insight.seo,
    showOnHomepage: insight.showOnHomepage,
    showOnInsightsPage: insight.showOnInsightsPage,
    slug: insight.slug,
    summary: mark(insight.summary, `insight.${insight.internalTitle}.summary`),
    title: mark(insight.title, `insight.${insight.internalTitle}.title`),
    visible: insight.visible,
  },
}));

const mediaUpdates = media.docs.map((item) => ({
  id: item.id,
  data: {
    alt: mark(item.alt, `media.${item.filename}.alt`),
    caption: mark(item.caption, `media.${item.filename}.caption`),
  },
}));

const siteUpdate = {
  _status: "published",
  address: mark(site.address, "site.footer.address"),
  companyHeading: mark(site.companyHeading, "site.footer.companyHeading"),
  contactHeading: mark(site.contactHeading, "site.footer.contactHeading"),
  copyright: mark(site.copyright, "site.footer.copyright"),
  defaultSEODescription: mark(
    site.defaultSEODescription,
    "site.seo.defaultDescription",
  ),
  footerDescription: mark(site.footerDescription, "site.footer.description"),
  footerGroups: stripLocalizedArrayIDs(
    translateLinkGroups(site.footerGroups, "site.footerGroups"),
  ),
  headerCtaHref: arabicizeHref(site.headerCtaHref),
  headerCtaLabel: mark(site.headerCtaLabel, "site.header.cta"),
  navigation: stripLocalizedArrayIDs(translateNavigation(site.navigation)),
  newsletterBody: mark(site.newsletterBody, "site.newsletter.body"),
  newsletterHeading: mark(site.newsletterHeading, "site.newsletter.heading"),
  siteName: mark(site.siteName, "site.seo.siteName"),
};

const marketingUpdate = {
  _status: "published",
  acceptLabel: mark(marketing.acceptLabel, "marketing.cookie.accept"),
  cookieNotice: mark(marketing.cookieNotice, "marketing.cookie.notice"),
  privacyHref: arabicizeHref(marketing.privacyHref),
  rejectLabel: mark(marketing.rejectLabel, "marketing.cookie.reject"),
  settingsLabel: mark(marketing.settingsLabel, "marketing.cookie.settings"),
};

fs.writeFileSync(
  path.join(translationDir, "arabic-translation-manifest.json"),
  `${JSON.stringify([...allJobs.values()], null, 2)}\n`,
);

await translateJobs();

for (const update of pageUpdates) {
  await payload.update({
    collection: "pages",
    data: fitSEOFields(update.data) as never,
    draft: false,
    id: update.id,
    locale: "ar",
    overrideAccess: true,
  });
}
for (const update of formUpdates) {
  await payload.update({
    collection: "forms",
    data: resolveMarkers(update.data) as never,
    draft: false,
    id: update.id,
    locale: "ar",
    overrideAccess: true,
  });
}
for (const update of categoryUpdates) {
  await payload.update({
    collection: "insight-categories",
    data: resolveMarkers(update.data) as never,
    draft: false,
    id: update.id,
    locale: "ar",
    overrideAccess: true,
  });
}
for (const update of insightUpdates) {
  await payload.update({
    collection: "insights-posts",
    data: fitSEOFields(update.data) as never,
    draft: false,
    id: update.id,
    locale: "ar",
    overrideAccess: true,
  });
}
for (const update of mediaUpdates) {
  await payload.update({
    collection: "media",
    data: resolveMarkers(update.data) as never,
    id: update.id,
    locale: "ar",
    overrideAccess: true,
  });
}
await payload.updateGlobal({
  slug: "site-settings",
  data: resolveMarkers(siteUpdate) as never,
  draft: false,
  locale: "ar",
  overrideAccess: true,
});
await payload.updateGlobal({
  slug: "marketing-settings",
  data: resolveMarkers(marketingUpdate) as never,
  draft: false,
  locale: "ar",
  overrideAccess: true,
});

fs.writeFileSync(
  path.join(translationDir, "arabic-import-summary.json"),
  `${JSON.stringify(
    {
      categories: categoryUpdates.length,
      forms: formUpdates.length,
      generatedAt: new Date().toISOString(),
      insights: insightUpdates.length,
      media: mediaUpdates.length,
      model,
      pages: pageUpdates.length,
      strings: jobs.size,
    },
    null,
    2,
  )}\n`,
);

console.log(
  `Published Arabic content for ${pageUpdates.length} pages, ${formUpdates.length} forms, ${insightUpdates.length} insights, ${categoryUpdates.length} categories, and ${mediaUpdates.length} media records.`,
);
process.exit(0);
