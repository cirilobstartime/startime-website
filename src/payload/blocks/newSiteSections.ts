import type { Block, Field } from "payload";
import { discoverContent } from "@/content/discover";
import { visionContent } from "@/content/vision";
import { investmentContent } from "@/content/investment";
import { careersContent } from "@/content/careers";
import { insightsContent } from "@/content/insights";
import { contactContent } from "@/content/contact";
import { latestNewsContent } from "@/content/latestNews";
import { homeContent } from "@/content/home";
import { sectionControlsFor } from "./shared";
import { homepageItemVisualFields, homepageVisualFields, textRole } from "../fields/visualStyle";
import { fallbackImageField, responsiveImagesField, responsiveVideosField } from "../fields/responsiveMedia";

export const newSiteContent = {
  home: homeContent,
  discover: discoverContent,
  vision: visionContent,
  investment: investmentContent,
  careers: careersContent,
  insights: insightsContent,
  contact: contactContent,
  "latest-news": latestNewsContent,
} as const;

export type NewSitePageType = keyof typeof newSiteContent;

const discoverSectionMediaRoles = {
  hero: "discoverHero",
  introduction: "discoverIntroSection",
  timeline: "discoverTimelineSection",
  vision: "discoverVisionSection",
  ceo: "discoverCeoSection",
  methodology: "discoverMethodologySection",
  governance: "discoverGovernance",
  form: "discoverContactSection",
} as const;

const discoverPatternMediaRoles = {
  hero: "discoverHeroPattern",
  introduction: "discoverIntroPattern",
  ceo: "discoverCeoPattern",
  governance: "discoverGovernancePattern",
} as const;

type DiscoverSection = keyof typeof discoverSectionMediaRoles;

/** Put every Discover media control together at the top of its section editor. */
function discoverMediaFields(section: DiscoverSection): Field[] {
  const foregroundRole = section === "hero" ? "discoverHero"
    : section === "ceo" ? "discoverPortrait"
      : section === "methodology" ? "discoverMethodology"
        : section === "governance" ? "discoverGovernance" : "discoverContact";
  const fields: Field[] = [
    ...(["hero", "ceo", "methodology", "governance", "form"].includes(section)
      ? [responsiveImagesField("images", section === "governance" ? "Fallback image behind governance slides by screen" : `${labelFor(section)} photograph by screen`, foregroundRole)]
      : []),
    ...(["hero", "introduction", "ceo", "governance"].includes(section)
      ? [responsiveImagesField("patternImages", "Decorative pattern by screen", discoverPatternMediaRoles[section as keyof typeof discoverPatternMediaRoles])]
      : []),
    ...(section === "timeline" ? [
      { name: "filmSource", label: "Timeline film source", type: "select", defaultValue: "upload", options: [{ label: "Uploaded video", value: "upload" }, { label: "YouTube link", value: "youtube" }], admin: { description: "The same film appears before the animated timeline on mobile and after/below it on larger screens. English and Arabic have independent settings." } } as Field,
      responsiveVideosField("filmVideos", "Timeline film uploads by screen", "discoverFilm"),
      { name: "filmYoutubeURL", label: "YouTube video URL", type: "text", admin: { description: "Use a youtube.com/watch?v=… or youtu.be/… link. The public embed uses youtube-nocookie.com. A missing or invalid URL falls back to the approved local film." } } as Field,
      responsiveImagesField("filmPosters", "Video poster by screen", "discoverFilm"),
      { name: "filmTitle", label: "Accessible film title", type: "text" } as Field,
    ] : []),
    responsiveImagesField("backgroundImages", "Optional full-section background by screen", discoverSectionMediaRoles[section]),
    responsiveVideosField("backgroundVideos", "Optional full-section background video by screen", discoverSectionMediaRoles[section]),
  ];
  return [{
    type: "collapsible",
    label: `Media · ${labelFor(section)}`,
    admin: {
      initCollapsed: false,
      description: section === "governance"
        ? "The first visible Governance slide's image is shared by all slides unless a later slide has its own image. Set it here as the section fallback or inside the first slide. Later slide images are optional; a full-section background is separate. Replace English and Arabic media independently."
        : section === "vision" || section === "introduction"
          ? "This section has no current photograph or film. Its decorative pattern, where present, is selected below; optional full-section background fields are empty until you choose media."
          : "Current approved media is selected below. Replace it in this language only, or upload individual mobile, tablet, laptop, desktop and iMac versions. Optional backgrounds are separate from the foreground image or film.",
    },
    fields,
  }];
}

function discoverControlsFor(section: DiscoverSection): Field[] {
  return sectionControlsFor(discoverSectionMediaRoles[section]).map((field) => {
    if (field.type !== "collapsible" || field.label !== "Advanced background media and element visibility") return field;
    return {
      ...field,
      fields: field.fields.filter((nested) => !("name" in nested && ["backgroundImages", "backgroundVideos"].includes(nested.name))),
    } as Field;
  });
}

export function newSiteSectionSlug(page: string, section: string) {
  return `site${page[0].toUpperCase()}${page.slice(1)}${section[0].toUpperCase()}${section.slice(1)}`;
}

function labelFor(name: string) {
  return name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
}

function fieldFor(name: string, sample: unknown): Field {
  const label = labelFor(name);
  if (Array.isArray(sample)) {
    const first = sample[0];
    return {
      name,
      label,
      type: "array",
      minRows: name === "items" || name === "principles" ? 1 : undefined,
      admin: { description: "Add, remove, and reorder these items for this language." },
      fields: typeof first === "string"
        ? [{ name: "value", label: "Text", type: "textarea" }]
        : Object.entries(first || {}).map(([key, value]) => fieldFor(key, value)),
    };
  }
  if (sample && typeof sample === "object") {
    return {
      name,
      label,
      type: "group",
      fields: Object.entries(sample).map(([key, value]) => fieldFor(key, value)),
    };
  }
  if (name === "image" || name === "logo") {
    return {
      name,
      label,
      type: "upload",
      relationTo: "media",
      admin: { description: "Choose an approved image from Media or upload a new one. The original image is preserved." },
    };
  }
  if (/body|quote|overview|summary|description|statement|details|intro|consent|privacy/i.test(name)) {
    return { name, label, type: "textarea" };
  }
  return { name, label, type: "text" };
}

const discoverPrinciplesField: Field = {
  name: "principles", label: "Governance slides", type: "array", minRows: 1,
  admin: { description: "The first visible slide's image stays behind every slide unless you select a different image for a later slide. Slide images are optional, including their device-specific crops. Edit, reorder or hide each principle independently in English and Arabic." },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "newPageTitle", label: "Main Discover title (optional)", type: "text", admin: { description: "Leave blank to use the title above. Useful for a shorter main-page label." } },
    { name: "body", type: "textarea", required: true },
    responsiveImagesField("images", "Optional slide background by screen · blank uses first slide", "discoverGovernance"),
    { name: "visible", type: "checkbox", defaultValue: true },
    ...homepageItemVisualFields,
  ],
};

const visionPillarsField: Field = {
  name: "items", label: "Vision pillars", type: "array", minRows: 1,
  admin: { description: "Edit, reorder or hide each pillar in this language. The approved artwork is the fallback on every screen until you select its current image or upload a replacement. Device-specific crops are optional." },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "body", type: "textarea", required: true },
    fallbackImageField("image", "Pillar image · default on all screens", "visionPillar", false),
    responsiveImagesField("images", "Optional pillar image overrides by screen", "visionPillar"),
    { name: "visible", label: "Show this pillar", type: "checkbox", defaultValue: true },
    ...homepageItemVisualFields,
  ],
};

const visionProgramsField: Field = {
  name: "items", label: "Vision programs", type: "array", minRows: 1,
  admin: { description: "Edit, reorder or hide every program. The program photo changes with the accordion selection; upload one default image, then only the device-specific compositions you actually need." },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "body", type: "textarea", required: true },
    { name: "target", label: "2030 program target", type: "textarea" },
    fallbackImageField("image", "Program photo · default on all screens", "visionProgram", false),
    responsiveImagesField("images", "Optional program photo overrides by screen", "visionProgram"),
    { name: "visible", label: "Show this program", type: "checkbox", defaultValue: true },
    { name: "showTarget", label: "Show target line", type: "checkbox", defaultValue: true },
    ...homepageItemVisualFields,
  ],
};

const visionRoadmapField: Field = {
  name: "items", label: "Roadmap milestones", type: "array", minRows: 1,
  admin: { description: "Edit, reorder or hide milestones independently in each language. The icon sits INSIDE the animated outline ring; its image does not fill the circle." },
  fields: [
    { name: "year", type: "text", required: true },
    { name: "body", type: "textarea", required: true },
    fallbackImageField("icon", "Milestone icon · default on all screens", "visionRoadmapIcon", false),
    responsiveImagesField("icons", "Optional milestone icon overrides by screen", "visionRoadmapIcon"),
    { name: "visible", label: "Show this milestone", type: "checkbox", defaultValue: true },
    ...homepageItemVisualFields,
  ],
};

const visionParagraphsField: Field = {
  name: "body", label: "Paragraphs", type: "array", minRows: 1,
  admin: { description: "Edit, reorder or hide each paragraph independently. Optional text color and font size can differ at each screen width." },
  fields: [
    { name: "value", label: "Paragraph text", type: "textarea", required: true },
    { name: "visible", label: "Show this paragraph", type: "checkbox", defaultValue: true },
    textRole("style", "Paragraph"),
  ],
};

const investmentSectionRoles = {
  philosophy: "investmentPhilosophy", domains: "investmentDomain", portfolios: "investmentPortfoliosSection",
  approach: "investmentApproachSection", impact: "investmentImpact", projects: "investmentProjectsSection", closing: "investmentClosing",
} as const;
const contactSectionRoles = { hero: "contactHero", form: "contactEnquirySection", headquarters: "contactHeadquartersSection", location: "contactLocationSection" } as const;
const careersSectionRoles = { hero: "careersHero", investing: "careersInvesting", workplace: "careersWorkplace", opportunities: "careersOpportunities", talent: "careersTalent" } as const;

function careersControlsFor(section: keyof typeof careersSectionRoles): Field[] {
  return sectionControlsFor(careersSectionRoles[section]).map((field) => {
    if (field.type !== "collapsible" || field.label !== "Advanced background media and element visibility") return field;
    return { ...field, fields: field.fields.filter((nested) => !("name" in nested && ["backgroundImages", "backgroundVideos"].includes(nested.name))) } as Field;
  });
}

function careersMediaFields(section: keyof typeof careersSectionRoles): Field[] {
  const role = careersSectionRoles[section];
  return [
    ...(section === "hero" || section === "investing" ? [fallbackImageField("image", `${labelFor(section)} image · default on all screens`, role, false), responsiveImagesField("images", `Optional ${labelFor(section)} image overrides by screen`, role)] : []),
    ...(section === "talent" ? [fallbackImageField("pattern", "Talent section pattern · default", "careersTalentPattern", false), responsiveImagesField("patternImages", "Optional pattern overrides by screen", "careersTalentPattern")] : []),
    responsiveImagesField("backgroundImages", `Optional ${labelFor(section)} section background`, role),
    responsiveVideosField("backgroundVideos", `Optional ${labelFor(section)} section video`, role),
  ];
}

function pageVisualControls(role: keyof typeof investmentSectionRoles | keyof typeof contactSectionRoles, page: "investment" | "contact"): Field[] {
  const mediaRole = page === "investment" ? investmentSectionRoles[role as keyof typeof investmentSectionRoles] : contactSectionRoles[role as keyof typeof contactSectionRoles];
  return sectionControlsFor(mediaRole).map((field) => {
    if (field.type !== "collapsible") return field;
    if (field.label === "Advanced background media and element visibility") {
      return { ...field, fields: field.fields.filter((nested) => !("name" in nested && ["backgroundImages", "backgroundVideos"].includes(nested.name))) } as Field;
    }
    if (field.label === "Section appearance") {
      return { ...field, fields: field.fields.map((nested) => nested.type === "group" && "name" in nested && nested.name === "appearance"
        ? { ...nested, fields: nested.fields.filter((option) => !("name" in option && ["backgroundImage", "mobileBackgroundImage", "overlayOpacity"].includes(option.name))) } : nested) } as Field;
    }
    return field;
  });
}

const investmentItemsField = (section: "domains" | "portfolios" | "approach" | "impact"): Field => ({
  name: "items", label: `${labelFor(section)} entries`, type: "array", minRows: 1,
  admin: { description: section === "impact" ? "The first visible Legacy & Impact slide's image stays behind every slide unless a later slide has its own image. Later image uploads and device crops are optional. Edit, reorder or hide entries independently in this language." : "Edit, reorder or hide entries in this language. Empty visual overrides preserve the approved design and animation." },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "body", type: "textarea", required: true },
    ...(section === "portfolios" ? [
      { name: "homepagePortfolio", label: "Shared homepage photograph", type: "select", options: [
        { label: "Government portfolio", value: "government" },
        { label: "Business portfolio", value: "business" },
        { label: "Community portfolio", value: "community" },
      ], admin: { description: "Optional: select the homepage portfolio artwork to reuse. Blank uses the corresponding card position. Only its images are shared—this page keeps its own title, description, colors and visibility. Choose explicitly before reordering cards to keep the same photograph." } } as Field,
      fallbackImageField("image", "Optional Investment card photograph · blank shares homepage", "portfolio", false),
      responsiveImagesField("images", "Optional Investment card photograph overrides by screen", "portfolio"),
    ] : []),
    ...(section === "impact" ? [
      { name: "points", label: "Bullet points", type: "array", fields: [{ name: "value", type: "text" }] } as Field,
      fallbackImageField("image", "Optional slide image · blank uses first slide", "investmentImpact", false),
      responsiveImagesField("images", "Optional slide image crops by screen · blank uses first slide", "investmentImpact"),
    ] : []),
    ...(["domains", "portfolios", "approach"].includes(section) ? [fallbackImageField("icon", `${labelFor(section)} icon · default on all screens`, section === "approach" ? "investmentApproachIcon" : "investmentDomainIcon", false), responsiveImagesField("icons", "Optional icon overrides by screen", section === "approach" ? "investmentApproachIcon" : "investmentDomainIcon")].map((field): Field => section === "portfolios" ? { ...field, admin: { ...field.admin, condition: () => false } } as Field : field) : []),
    { name: "visible", label: "Show this entry", type: "checkbox", defaultValue: true },
    ...homepageItemVisualFields,
  ],
});

const investmentParagraphsField: Field = {
  name: "body", label: "Philosophy paragraphs", type: "array", minRows: 1,
  admin: { description: "Edit, reorder or hide individual paragraphs. Optional color and type size work independently at the five measured screen ranges." },
  fields: [{ name: "value", label: "Paragraph text", type: "textarea", required: true }, { name: "visible", label: "Show paragraph", type: "checkbox", defaultValue: true }, textRole("style", "Paragraph")],
};

const investmentProjectsField: Field = {
  name: "portfolios", label: "Project portfolios", type: "array", minRows: 1,
  admin: { description: "These Investment-page projects are managed here, not in a separate taxonomy. Edit and reorder portfolios and their projects independently for English and Arabic." },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "visible", label: "Show this portfolio", type: "checkbox", defaultValue: true },
    { name: "items", label: "Projects in this portfolio", type: "array", minRows: 1, fields: [
      { name: "title", type: "text", required: true },
      { name: "body", type: "textarea", required: true },
      fallbackImageField("image", "Project image · default on all screens", "investmentProject", false),
      responsiveImagesField("images", "Optional project image overrides by screen", "investmentProject"),
      fallbackImageField("logo", "Project logo", "projectLogo", false),
      { name: "url", label: "Project action destination", type: "text", admin: { description: "Leave blank for the closing-section anchor. Only same-site paths or HTTPS URLs are accepted on the public page." } },
      { name: "visible", label: "Show this project", type: "checkbox", defaultValue: true },
      ...homepageItemVisualFields,
    ] },
  ],
};

const contactFactsField: Field = {
  name: "facts", label: "Headquarters facts", type: "array", minRows: 1,
  admin: { description: "Edit, reorder or hide the individual contact facts. The first email and phone facts become working mailto/tel links from their displayed values." },
  fields: [{ name: "label", type: "text", required: true }, { name: "value", type: "text", required: true }, { name: "visible", type: "checkbox", defaultValue: true }, ...homepageItemVisualFields],
};

function contactLocationField(key: string, sample: unknown): Field {
  if (key === "latitude" || key === "longitude") return {
    name: key, label: key === "latitude" ? "Map latitude" : "Map longitude", type: "text",
    validate: (value: unknown) => !value || typeof value === "string" && Number.isFinite(Number(value)) && Math.abs(Number(value)) <= (key === "latitude" ? 90 : 180) || `Enter a valid ${key} decimal value.`,
    admin: { description: `Optional decimal ${key}. Set BOTH coordinates to show this point in the map and directions link; coordinates take priority over URLs below. Leave both blank to use the URLs.` },
  };
  if (key === "mapEmbedURL" || key === "directionsURL") return {
    name: key, label: key === "mapEmbedURL" ? "Google Maps iframe/embed URL" : "Google Maps directions URL", type: "text",
    admin: { description: key === "mapEmbedURL" ? "Paste a Google Maps embed URL (the iframe src, not full HTML). Used when coordinates above are blank. Only HTTPS Google Maps URLs render publicly." : "Full HTTPS Google Maps destination opened by the button. Coordinates above override this URL when both are entered." },
  };
  return fieldFor(key, sample);
}

function specificMediaFields(page: "investment" | "contact", section: string): Field[] {
  if (page === "investment" && section === "hero") return [];
  const role = page === "investment" ? investmentSectionRoles[section as keyof typeof investmentSectionRoles] : contactSectionRoles[section as keyof typeof contactSectionRoles];
  const fields: Field[] = [
    ...(page === "investment" && section === "closing" ? [fallbackImageField("image", "Current closing photograph · default", "investmentClosing", false), responsiveImagesField("images", "Optional closing photograph overrides by screen", "investmentClosing")] : []),
    ...(page === "contact" && section === "hero" ? [fallbackImageField("image", "Current Contact hero image · default", "contactHero", false), responsiveImagesField("images", "Optional hero images by screen", "contactHero")] : []),
    ...(page === "contact" && section === "location" ? [fallbackImageField("mapArtwork", "Current static map artwork · default", "contactMap", false), responsiveImagesField("mapArtworkImages", "Optional static map artwork overrides", "contactMap")] : []),
    responsiveImagesField("backgroundImages", "Optional full-section background images", role),
    responsiveVideosField("backgroundVideos", "Optional full-section background video", role),
  ];
  return [{ type: "collapsible", label: `Media · ${labelFor(page)} ${labelFor(section)}`, admin: { initCollapsed: false, description: "One default asset works across all devices. Add only the screen-specific composition you need; empty slots inherit Default. The current design remains unchanged until you choose replacement media." }, fields }];
}

const visionSectionRoles = {
  hero: "visionHero",
  path: "visionPathSection",
  vision: "visionStatementSection",
  pillars: "visionPillarsSection",
  programs: "visionProgramsSection",
  roadmap: "visionRoadmapStage",
  commitment: "visionCommitmentSection",
} as const;
type VisionSection = keyof typeof visionSectionRoles;

function visionMediaFields(section: VisionSection): Field[] {
  const fields: Field[] = [
    ...(section === "hero" ? [
      fallbackImageField("backdrop", "Current hero backdrop · default on all screens", "visionHero", false),
      responsiveImagesField("backdropImages", "Hero backdrop overrides by screen", "visionHero"),
      fallbackImageField("portrait", "Current transparent portrait · default on all screens", "visionPortrait", false),
      responsiveImagesField("portraitImages", "Transparent portrait overrides by screen", "visionPortrait"),
    ] : []),
    ...(section === "path" ? [
      fallbackImageField("image", "Current path photograph · default on all screens", "visionPath", false),
      responsiveImagesField("images", "Path photograph overrides by screen", "visionPath"),
    ] : []),
    ...(section === "vision" ? [
      fallbackImageField("pattern", "Statement decorative pattern · default", "visionStatementPattern", false),
      responsiveImagesField("patternImages", "Statement pattern overrides by screen", "visionStatementPattern"),
    ] : []),
    ...(section === "hero" ? [] : [responsiveImagesField("backgroundImages", "Optional full-section background by screen", visionSectionRoles[section])]),
    responsiveVideosField("backgroundVideos", "Optional full-section video by screen", visionSectionRoles[section]),
  ];
  return [{ type: "collapsible", label: `Media · Vision ${labelFor(section)}`, admin: {
    initCollapsed: false,
    description: "One default image serves every device. Optional overrides load only at their viewport; empty slots use the default. Measured frame and 2× upload canvas are shown beside every slot. Existing design and animation remain unchanged when these controls are empty.",
  }, fields }];
}

function visionControlsFor(section: VisionSection): Field[] {
  return sectionControlsFor(visionSectionRoles[section]).map((field) => {
    if (field.type !== "collapsible") return field;
    if (field.label === "Advanced background media and element visibility") {
      return { ...field, fields: field.fields.filter((nested) => !("name" in nested && ["backgroundImages", "backgroundVideos"].includes(nested.name))) } as Field;
    }
    if (field.label === "Section appearance") {
      return { ...field, admin: { ...field.admin, description: "Optional working background color/preset and vertical spacing controls. Leave the preset off to preserve the approved design. Device-specific background media is in Media above." }, fields: field.fields.map((nested) => {
        if (!("name" in nested) || nested.name !== "appearance" || nested.type !== "group") return nested;
        return { ...nested, fields: nested.fields.filter((option) => !("name" in option && ["backgroundImage", "mobileBackgroundImage", "overlayOpacity"].includes(option.name))) };
      }) } as Field;
    }
    return field;
  });
}

const editorialSectionRoles = {
  insights: { hero: "insightsHero", introduction: "insightsIntro", archive: "insightsArchive", areas: "insightsAreas", ambition: "insightsAmbition", credibility: "insightsPrinciples", property: "insightsPrinciples", contribution: "insightsContribute" },
  "latest-news": { hero: "newsHero", archive: "newsArchive" },
} as const;

function editorialFields(page: "insights" | "latest-news", section: string): Field[] {
  const role = editorialSectionRoles[page][section as keyof typeof editorialSectionRoles[typeof page]];
  const fields: Field[] = [
    ...(section === "hero" ? [fallbackImageField("image", page === "insights" ? "Approved hero photograph · default" : "Full-bleed hero background · default", page === "insights" ? "insightsHero" : "newsHeroImage", false), responsiveImagesField("images", page === "insights" ? "Hero photograph by screen" : "Full-bleed hero background by screen", page === "insights" ? "insightsHero" : "newsHeroImage")] : []),
    ...(page === "insights" && section === "introduction" ? [fallbackImageField("image", "Approved introduction photograph · default", "insightsIntroImage", false), responsiveImagesField("images", "Introduction photograph by screen", "insightsIntroImage")] : []),
    ...(page === "insights" && section === "ambition" ? [fallbackImageField("pattern", "Approved decorative pattern · default", "insightsAmbition", false), responsiveImagesField("patternImages", "Pattern by screen", "insightsAmbition")] : []),
  ];
  return [
    ...sectionControlsFor(role),
    { type: "collapsible", label: `Media · ${labelFor(page)} ${labelFor(section)}`, admin: { initCollapsed: false, description: "The approved default asset remains until replaced. Upload once; optional device compositions override only their viewport. Labels show measured frames and 2× upload guidance." }, fields },
    ...homepageVisualFields,
  ];
}

function editorialItemsField(sample: unknown, section: "areas" | "ambition"): Field {
  const base = fieldFor("items", sample);
  return base.type === "array" ? { ...base, fields: [
    ...base.fields.filter((field) => !(section === "areas" && "name" in field && field.name === "image")),
    ...(section === "areas" ? [{ name: "icon", label: "Card icon", type: "select", options: ["shield", "target", "growth", "technology", "leaf", "health", "commerce", "buildings", "resources", "industry"].map((value) => ({ label: labelFor(value), value })), admin: { description: "Optional. Empty uses the approved icon for this card position." } } as Field] : []),
    { name: "visible", label: "Show this item", type: "checkbox", defaultValue: true },
    ...homepageItemVisualFields,
  ] } : base;
}

export const newSiteSectionBlocks: Block[] = Object.entries(newSiteContent).flatMap(([page, translations]) =>
  Object.entries(translations.en)
    .filter(([section]) => (page !== "home" || ["team", "triple", "partners", "news"].includes(section)) && !(page === "careers" && section === "jobs"))
    .map(([section, value]) => ({
    slug: newSiteSectionSlug(page, section),
    labels: {
      singular: `${labelFor(page)} · ${labelFor(section)}`,
      plural: `${labelFor(page)} · ${labelFor(section)}`,
    },
    fields: [
      ...(page === "home" ? [...sectionControlsFor(section === "team" ? "team" : section === "triple" ? "homeTripleSection" : section === "partners" ? "homePartnersSection" : "homeNewsSection"), ...homepageVisualFields]
        : page === "discover" ? [...discoverControlsFor(section as DiscoverSection), ...discoverMediaFields(section as DiscoverSection), ...homepageVisualFields]
          : page === "vision" ? [...visionControlsFor(section as VisionSection), ...visionMediaFields(section as VisionSection), ...homepageVisualFields]
            : page === "investment" ? section === "hero"
              ? [{ name: "internalLabel", label: "Hero · scroll-stage copy only", type: "text", admin: { description: "Only the lead and five scroll-stage statements below are editable. The globe, stars, orbit and all hero background media remain locked to the approved design." } } as Field,
                { name: "visible", label: "Show hero", type: "checkbox", defaultValue: true, admin: { description: "Hide this entire section for this language without deleting its scroll-stage copy. Background media remains locked." } } as Field]
              : [...pageVisualControls(section as keyof typeof investmentSectionRoles, "investment"), ...specificMediaFields("investment", section), ...homepageVisualFields]
              : page === "contact" ? [...pageVisualControls(section as keyof typeof contactSectionRoles, "contact"), ...specificMediaFields("contact", section), ...homepageVisualFields]
              : page === "careers" && section !== "jobs" && section !== "detail" ? [...careersControlsFor(section as keyof typeof careersSectionRoles), ...careersMediaFields(section as keyof typeof careersSectionRoles), ...homepageVisualFields]
              : (page === "insights" || page === "latest-news") ? editorialFields(page, section)
          : [{ name: "internalLabel", label: "Section name in editor", type: "text", ...(page === "investment" && section === "approach" ? { admin: { description: "From Idea to Impact: on desktop, step text and divider lines are centered with equal space on both sides; icons remain on the language-leading edge. Mobile keeps the compact timeline layout." } } : {}) } as Field]),
      ...(
        page === "careers" && section === "jobs" ? []
          : Array.isArray(value) ? [fieldFor("items", value)]
          : typeof value === "string" ? [fieldFor("text", value)]
            : Object.entries(value).filter(([key]) => !(page === "investment" && section === "hero" && key === "title")).map(([key, sample]) => page === "discover" && section === "governance" && key === "principles" ? discoverPrinciplesField : page === "insights" && key === "items" && ["areas", "ambition"].includes(section) ? editorialItemsField(sample, section as "areas" | "ambition") : page === "vision" && key === "items" ? section === "pillars" ? visionPillarsField : section === "programs" ? visionProgramsField : visionRoadmapField : page === "vision" && key === "body" && Array.isArray(sample) ? visionParagraphsField : page === "investment" && section === "philosophy" && key === "body" ? investmentParagraphsField : page === "investment" && ["domains", "portfolios", "approach", "impact"].includes(section) && key === "items" ? investmentItemsField(section as "domains" | "portfolios" | "approach" | "impact") : page === "investment" && section === "projects" && key === "portfolios" ? investmentProjectsField : page === "investment" && section === "hero" && key === "items" ? { name: "items", label: "Five scroll-stage statements", type: "array", minRows: 5, maxRows: 5, admin: { description: "Edit the words for the five existing scroll beats. Their number and globe animation stay fixed." }, fields: [{ name: "value", label: "Statement", type: "text", required: true }] } as Field : page === "careers" && section === "workplace" && key === "points" ? { name: "points", label: "Workplace points", type: "array", minRows: 1, admin: { description: "Add, remove or reorder cards in each language. Artwork and visual overrides move with the card." }, fields: [{ name: "title", type: "text", required: true }, { name: "body", type: "textarea", required: true }, { name: "target", type: "text" }, fallbackImageField("artwork", "This card's artwork · default", "careersWorkplaceIcon", false), responsiveImagesField("artworkImages", "Optional card artwork overrides by screen", "careersWorkplaceIcon"), { name: "visible", type: "checkbox", defaultValue: true }, ...homepageItemVisualFields] } as Field : page === "contact" && section === "form" && key === "fields" ? { name: "fields", label: "Form field labels · fixed order", type: "array", minRows: 7, maxRows: 7, admin: { description: "Seven labels correspond to entity, name, position, phone, email, message and attachment. Keep their order to preserve submitted field meanings." }, fields: [{ name: "value", label: "Visible label", type: "text", required: true }] } as Field : page === "contact" && section === "headquarters" && key === "facts" ? contactFactsField : page === "contact" && section === "location" ? contactLocationField(key, sample) : fieldFor(key, sample))
      ),
      ...(page === "home" && section === "team" ? [
        responsiveImagesField("images", "Team full-section background photograph by screen", "team"),
        responsiveVideosField("videos", "Optional team video by screen", "team"),
        responsiveImagesField("patternImages", "Team decorative pattern by screen", "teamPattern"),
        { name: "ctaURL", label: "Button destination", type: "text" } as Field,
        { name: "showCTA", type: "checkbox", defaultValue: true } as Field,
      ] : []),
      ...(page === "home" && section === "triple" ? [
        responsiveImagesField("images", "Triple S image by screen", "triple"),
        responsiveVideosField("videos", "Triple S video by screen", "triple"),
        responsiveImagesField("patternImages", "Triple S decorative pattern by screen", "triplePattern"),
        { name: "showMedia", label: "Show image in this text-led section", type: "checkbox", defaultValue: false, admin: { description: "The approved design is text-led. Turn this on to display the selected image beneath the copy; uploading a video also displays it automatically." } } as Field,
        { name: "ctaURL", label: "Button destination", type: "text" } as Field,
        { name: "showCTA", type: "checkbox", defaultValue: true } as Field,
      ] : []),
      ...(page === "home" && section === "partners" ? [
        { name: "ctaURL", label: "Button destination", type: "text" } as Field,
        { name: "showCTA", type: "checkbox", defaultValue: true } as Field,
        { name: "logos", label: "Marquee logos", type: "array", admin: { description: "Add, remove and reorder every partner mark independently for this language. Measured image frame: 180 × 104 CSS px on mobile and 215 × 118 CSS px otherwise; use transparent 360 × 208 / 430 × 236 px artwork (2×), with minimal internal whitespace. Empty means no logos—not the old fixed strip." }, fields: [
          fallbackImageField("image", "Partner logo fallback image", "partnerLogo"),
          { name: "alt", type: "text" },
          { name: "destination", label: "Logo link URL · optional", type: "text", admin: { placeholder: "https://partner.example.com", description: "Add a destination to make this logo clickable. Leave blank to show the logo without a link. External websites open in a new tab with nofollow by default." } },
          responsiveImagesField("images", "Logo by screen", "partnerLogo"),
          { name: "visible", type: "checkbox", defaultValue: true },
        ] } as Field,
      ] : []),
      ...(page === "home" && section === "news" ? [
        { name: "selectionMode", label: "Homepage news selection", type: "select", defaultValue: "latest", options: [
          { label: "Latest published news (automatic)", value: "latest" },
          { label: "Choose news or articles manually", value: "manual" },
        ] } as Field,
        { name: "selectedNews", label: "Homepage featured posts", type: "relationship", relationTo: "insights-posts", hasMany: true, admin: { description: "Automatic mode shows only News. Manual mode can feature News and Articles together; drag them into order. Unpublished or hidden items are omitted." } } as Field,
        { name: "maximumItems", type: "number", min: 1, max: 30, defaultValue: 9 } as Field,
        { name: "cardOverrides", label: "Optional styling for individual homepage news cards", type: "array", maxRows: 30, admin: { description: "Choose a story, then override only that card's title/body sizes and colors, background, border or arrow color. Empty fields keep the approved design." }, fields: [
          { name: "post", label: "News story", type: "relationship", relationTo: "insights-posts", required: true },
          ...homepageItemVisualFields,
        ] } as Field,
        { name: "ctaURL", label: "View all destination", type: "text" } as Field,
        { name: "showCTA", type: "checkbox", defaultValue: true } as Field,
      ] : []),
      ...(page === "discover" ? [
        ...(section === "ceo" ? [
          { name: "contactEmail", label: "Contact CEO email address", type: "email", admin: { description: "Destination for Contact the CEO. Leave empty for the approved info@startime.sa." } } as Field,
          { name: "showBioPreview", label: "Show short biography under quote", type: "checkbox", defaultValue: false } as Field,
          { name: "lessLabel", label: "Close biography button", type: "text" } as Field,
          { name: "quoteMark", label: "Opening quotation mark", type: "text", defaultValue: "“" } as Field,
        ] : []),
        ...(section === "hero" ? [{ name: "showScrollCue", label: "Show scroll cue", type: "checkbox", defaultValue: true } as Field] : []),
        ...(section === "governance" ? [
          { name: "showCounter", label: "Show slide counter", type: "checkbox", defaultValue: true } as Field,
        ] : []),
        ...(section === "form" ? [
          { name: "recipientEmail", label: "Form recipient email", type: "email", admin: { description: "Current approved form opens the visitor's email app; attachments cannot be delivered through mailto." } } as Field,
          { name: "showAttachment", label: "Show attachment picker", type: "checkbox", defaultValue: true, admin: { description: "The current mailto form cannot actually send an attached file; disable this until an upload-backed form endpoint is configured." } } as Field,
        ] : []),
      ] : []),
      ...(page === "vision" && section === "hero" ? [
        { name: "showHonorific", label: "Show honorific", type: "checkbox", defaultValue: true } as Field,
        { name: "showName", label: "Show portrait name", type: "checkbox", defaultValue: true } as Field,
        { name: "showRole", label: "Show portrait role", type: "checkbox", defaultValue: true } as Field,
        { name: "showScrollCue", label: "Show scroll cue", type: "checkbox", defaultValue: true } as Field,
      ] : []),
      ...(page === "contact" && section === "hero" ? [{ name: "showScrollCue", label: "Show animated scroll cue", type: "checkbox", defaultValue: true } as Field] : []),
      ...(page === "contact" && section === "form" ? [{ name: "showAttachment", label: "Show attachment field", type: "checkbox", defaultValue: true } as Field] : []),
      ...(page === "careers" && section === "opportunities" ? [
        { name: "filterLabels", label: "Search and filter labels", type: "group", admin: { description: "All visible filter, count, reset and empty-state text for this language. Empty fields retain the approved translation." }, fields: ["search", "searchHint", "category", "tag", "location", "type", "all", "results", "clear", "empty"].map((name) => ({ name, label: labelFor(name), type: name === "empty" ? "textarea" as const : "text" as const })) } as Field,
        { name: "jobOrderMode", label: "Job order on Careers", type: "select", defaultValue: "latest", options: [{ label: "Latest publication first (default)", value: "latest" }, { label: "Selected jobs first in this order", value: "manual" }], admin: { description: "Unselected open jobs follow your selections, latest first. English and Arabic order can differ." } } as Field,
        { name: "selectedJobs", label: "Jobs to show first", type: "relationship", relationTo: "jobs", hasMany: true, admin: { description: "Drag jobs into the desired order. Unpublished, closed or hidden jobs never appear. Used only in manual mode." } } as Field,
      ] : []),
      ...(page === "careers" && section === "hero" ? [{ name: "showScrollCue", label: "Show animated scroll cue", type: "checkbox", defaultValue: true } as Field] : []),
      ...((page === "insights" || page === "latest-news") && section === "archive" ? [
        { name: "allFilterLabel", label: "All posts filter button", type: "text", admin: { description: "Optional translation for All News / All Blogs." } } as Field,
        { name: "categoriesFilterLabel", label: "Category filter accessibility label", type: "text" } as Field,
        { name: "archiveSortMode", label: "Archive order", type: "select", defaultValue: "latest", options: [{ label: "Latest published first (default)", value: "latest" }, { label: "Selected posts first, in this order", value: "manual" }], admin: { description: "Only published posts of this page's type appear. English and Arabic can have different ordering." } } as Field,
        { name: "selectedPosts", label: page === "insights" ? "Articles to show first" : "News to show first", type: "relationship", relationTo: "insights-posts", hasMany: true, filterOptions: { postType: { equals: page === "insights" ? "article" : "news" } }, admin: { description: "In manual mode, drag selected posts into position. Other published posts of the right type follow in latest-first order." } } as Field,
      ] : []),
      ...(page === "insights" && section === "contribution" ? [{ name: "recipientEmail", label: "Contribution recipient", type: "email", admin: { description: "Email address opened by the existing contribution form. Empty keeps info@startime.sa; this form still uses the visitor's email app." } } as Field] : []),
      ...((page === "insights" || page === "latest-news") && section === "hero" ? [{ name: "showScrollCue", label: "Show animated scroll cue", type: "checkbox", defaultValue: true, admin: { description: page === "latest-news" ? "Uses the same vertical bottom-center line and animation as the Contact hero." : undefined } } as Field] : []),
    ],
  })),
);

export const HomepagePanoramaBlock: Block = {
  slug: "newHomepagePanorama",
  labels: { singular: "Homepage panoramic story", plural: "Homepage panoramic stories" },
  fields: [
    ...sectionControlsFor("homePanoramaSection"),
    ...homepageVisualFields,
    responsiveImagesField("panoramaImages", "Panorama by screen", "panorama"),
    responsiveVideosField("panoramaVideos", "Optional panorama video by screen", "panoramaVideo"),
    { name: "skipLabel", type: "text", required: true },
    { name: "skipURL", type: "text", defaultValue: "#home2-value" },
    { name: "showSkip", label: "Show panorama skip button", type: "checkbox", defaultValue: false, admin: { description: "Off while the hero scene 2 skip button is used. Turn on again here whenever needed." } },
    { name: "scenes", type: "array", minRows: 1, maxRows: 12, admin: { description: "One scene per scroll step. Drag to change the sequence; no-glass creates a headline-only scene." }, fields: [
      { name: "heading", type: "text", required: true },
      { name: "description", type: "textarea" },
      { name: "noGlass", type: "checkbox", defaultValue: false },
      { name: "visible", type: "checkbox", defaultValue: true },
      ...homepageItemVisualFields,
    ] },
  ],
};

export const HomepageMembershipBlock: Block = {
  slug: "newHomepageMembership",
  labels: { singular: "Homepage memberships", plural: "Homepage memberships" },
  fields: [
    ...sectionControlsFor("membershipPattern"),
    ...homepageVisualFields,
    { name: "heading", type: "text", required: true },
    responsiveImagesField("patternImages", "Membership background pattern by screen", "membershipPattern"),
    { name: "logos", type: "array", minRows: 1, maxRows: 12, admin: { description: "Add each membership mark independently. The current one-logo UFI/IAEE composite is shown at about 342×40 CSS px mobile, 360×42 tablet and 457×54 laptop/desktop/iMac. Individual separate logos keep their natural ratio and may be smaller." }, fields: [
      fallbackImageField("image", "Membership logo fallback image", "membershipLogo"),
      responsiveImagesField("images", "Membership logo by screen", "membershipLogo"),
      { name: "alt", type: "text", required: true },
      { name: "destination", type: "text" },
      { name: "visible", type: "checkbox", defaultValue: true },
    ] },
  ],
};
