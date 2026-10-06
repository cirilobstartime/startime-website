import type { Field } from "payload";

export type CareerMediaRole = "careersHero" | "careersInvesting" | "careersWorkplace" | "careersWorkplaceIcon" | "careersOpportunities" | "careersTalent" | "careersTalentPattern" | "insightsHero" | "insightsIntro" | "insightsIntroImage" | "insightsArchive" | "insightsAreas" | "insightsAmbition" | "insightsPrinciples" | "insightsContribute" | "newsHero" | "newsHeroImage" | "newsArchive";
export type MediaRole = CareerMediaRole | "hero" | "panorama" | "panoramaVideo" | "portfolio" | "impact" | "project" | "team" | "triple" | "homeTripleSection" | "background" | "news" | "partnerLogo" | "membershipLogo" | "projectLogo" | "domainIcon" | "pattern" | "visionStatementPattern" | "statsPattern" | "portfolioPattern" | "teamPattern" | "membershipPattern" | "triplePattern" | "homeValueSection" | "homeDomainsSection" | "homePortfoliosSection" | "homeImpactSection" | "homeProjectsSection" | "homePanoramaSection" | "homePartnersSection" | "homeNewsSection" | "visionHero" | "visionPortrait" | "visionPath" | "visionPillar" | "visionProgram" | "visionRoadmapIcon" | "visionStatementSection" | "visionPathSection" | "visionPillarsSection" | "visionProgramsSection" | "visionRoadmapStage" | "visionCommitmentSection" | "investmentPhilosophy" | "investmentDomain" | "investmentPortfoliosSection" | "investmentApproachSection" | "investmentProjectsSection" | "investmentDomainIcon" | "investmentImpact" | "investmentClosing" | "investmentApproachIcon" | "investmentProject" | "contactHero" | "contactMap" | "contactEnquirySection" | "contactHeadquartersSection" | "contactLocationSection" | "card" | "logo" | "discoverHero" | "discoverPortrait" | "discoverMethodology" | "discoverGovernance" | "discoverContact" | "discoverFilm" | "discoverIntroSection" | "discoverTimelineSection" | "discoverVisionSection" | "discoverCeoSection" | "discoverMethodologySection" | "discoverContactSection" | "discoverHeroPattern" | "discoverIntroPattern" | "discoverCeoPattern" | "discoverGovernancePattern";

// Representative 2x/retina upload canvases based on the actual Home and Discover
// media frames at 390, 768, 1366, 1920 and 2560 CSS-pixel viewports. These are
// guidance, not a promise that every possible viewport has the same ratio.
type MediaSizing = {
  sizes: [string, string, string, string, string];
  frames?: [string, string, string, string, string];
  note: string;
};
const projectImageSizing: MediaSizing = {
  sizes: ["700 × 600", "1484 × 718", "1308 × 1160", "1830 × 1360", "1830 × 1360"],
  frames: ["350×300", "742×358.8", "653.5×580", "915.2×680", "915.2×680"],
  note: "Shared homepage and Investment project photograph frames: 350×300, 742×358.8, 653.5×580, 915.2×680 and 915.2×680 CSS px at the five reference screens. Upload recommendations are rounded 2× image-frame dimensions, not full-screen dimensions. Reuse the same project artwork on both pages. English and Arabic use the same frame; RTL only reverses the columns. Both fallback and device-specific photos fill with cover. A desktop crop can crop vertically on a laptop, so add a laptop composition when its subject matters. No single raster ratio perfectly matches every nearby viewport.",
};
const roleSizes: Record<MediaRole, MediaSizing> = {
  insightsHero: { sizes: ["780 × 1452", "1536 × 1720", "2732 × 1360", "3840 × 1880", "5120 × 1880"], note: "Measured Insights hero frames: 390×726, 768×860, 1366×680, 1920×940 and 2560×940 CSS px. Full-bleed image uses cover; height changes with viewport." },
  insightsIntro: { sizes: ["780 × 1620", "1536 × 1738", "2732 × 1080", "3840 × 1502", "5120 × 1502"], note: "Measured whole introduction section: 390×810, 768×869, 1366×540, 1920×751 and 2560×751 CSS px. Foreground photograph uses a separate slot." },
  insightsIntroImage: { sizes: ["700 × 720", "1456 × 980", "1116 × 752", "1566 × 1054", "1566 × 1054"], note: "Measured foreground photograph frame: 350×360, 728×490, 558×376, 783×527 and 783×527 CSS px. The CMS-selected image uses contain, so the whole upload remains visible; match the frame ratio to avoid unused space." },
  insightsArchive: { sizes: ["780 × 1968", "1536 × 1850", "2732 × 1816", "3840 × 2250", "5120 × 2250"], note: "Measured article archive with one current card: 390×984, 768×925, 1366×908, 1920×1125 and 2560×1125 CSS px. Height changes as articles or filters change." },
  insightsAreas: { sizes: ["780 × 1360", "1536 × 1402", "2732 × 1626", "3840 × 2514", "5120 × 2514"], note: "Measured Insights area carousel section: 390×680, 768×701, 1366×813, 1920×1257 and 2560×1257 CSS px. Cards may change height with copy." },
  insightsAmbition: { sizes: ["780 × 3202", "1536 × 2148", "2732 × 1774", "3840 × 2442", "5120 × 2442"], note: "Measured ambition section: 390×1601, 768×1074, 1366×887, 1920×1221 and 2560×1221 CSS px. The decorative pattern may instead be an SVG." },
  insightsPrinciples: { sizes: ["780 × 2380", "1536 × 1830", "2732 × 1626", "3840 × 2186", "5120 × 2186"], note: "Measured principles section: 390×1190, 768×915, 1366×813, 1920×1093 and 2560×1093 CSS px. Paragraph count changes height." },
  insightsContribute: { sizes: ["780 × 2670", "1536 × 1952", "2732 × 1396", "3840 × 1516", "5120 × 1516"], note: "Measured contribution form section: 390×1335, 768×976, 1366×698, 1920×758 and 2560×758 CSS px. Field/copy changes height." },
  newsHero: { sizes: ["780 × 1688", "1536 × 2048", "2732 × 1536", "3840 × 2160", "5120 × 2880"], note: "Latest News full-viewport background: 390×844, 768×1024, 1366×768, 1920×1080 and 2560×1440 CSS px at the five reference viewports. Height follows the actual screen; cover fills the hero and may crop on nearby aspect ratios. Each optional device override should be pre-composed around its centered headline." },
  newsHeroImage: { sizes: ["780 × 1688", "1536 × 2048", "2732 × 1536", "3840 × 2160", "5120 × 2880"], note: "This is the full-bleed Latest News hero image behind centered text, not a 16:9 inset. Reference viewport frames: 390×844 mobile, 768×1024 tablet, 1366×768 laptop, 1920×1080 desktop, 2560×1440 iMac CSS px. Upload guidance is 2×. The image uses cover; compose separate crops for screens where the focal point would otherwise fall behind text or outside the viewport." },
  newsArchive: { sizes: ["780 × 12024", "1536 × 6636", "2732 × 4162", "3840 × 5068", "5120 × 5068"], note: "Measured News archive with nine current cards: 390×6012, 768×3318, 1366×2081, 1920×2534 and 2560×2534 CSS px. Article count and copy change height; SVG/small texture is preferable for a full-section backdrop." },
  careersHero: { sizes: ["780 × 1418", "1536 × 1720", "2732 × 1536", "3840 × 1880", "5120 × 2506"], note: "Measured hero frames at the five reference screens: 390×709, 768×860, 1366×768, 1920×940 and 2560×1253 CSS px. Uses cover; these dimensions are a 2× upload guide, not a guarantee against crop at nearby viewport heights." },
  careersInvesting: { sizes: ["700 × 660", "1456 × 1264", "1162 × 1010", "1632 × 1416", "1632 × 1416"], note: "Measured media frames: 350×330, 728×632, 581×505, 816×708 and 816×708 CSS px. The approved square variation uses contain, showing the whole upload; match this frame ratio to avoid unused space." },
  careersWorkplace: { sizes: ["780 × 6142", "1536 × 3548", "2732 × 2792", "3840 × 3160", "5120 × 3160"], note: "Measured whole workplace frames: 390×3071, 768×1774, 1366×1396, 1920×1580 and 2560×1580 CSS px with six approved cards. Card count/copy change height." },
  careersWorkplaceIcon: { sizes: ["334 × 334", "360 × 360", "360 × 360", "360 × 360", "360 × 360"], note: "Measured card artwork: 167×167 CSS px on mobile and 180×180 on tablet/laptop/desktop/iMac. SVG is preferred. The source artwork may include transparent margins." },
  careersOpportunities: { sizes: ["780 × 4164", "1536 × 3266", "2732 × 3008", "3840 × 3796", "5120 × 3796"], note: "Measured whole opportunities section with four jobs: 390×2082, 768×1633, 1366×1504, 1920×1898 and 2560×1898 CSS px. Job count and copy change height." },
  careersTalent: { sizes: ["780 × 3128", "1536 × 2440", "2732 × 1814", "3840 × 1972", "5120 × 1972"], note: "Measured talent-network form section: 390×1564, 768×1220, 1366×907, 1920×986 and 2560×986 CSS px. Form copy can change height." },
  careersTalentPattern: { sizes: ["780 × 3128", "1536 × 2440", "2732 × 1814", "3840 × 1972", "5120 × 1972"], note: "Decorative motif covers the same measured talent-network section; prefer SVG so it scales without another upload." },
  investmentPhilosophy: { sizes: ["780 × 1414", "1536 × 1120", "2732 × 1170", "3840 × 1790", "5120 × 1790"], note: "Optional whole philosophy backdrop, measured 390×707, 768×560, 1366×585, 1920×895 and 2560×895 CSS px. The approved new design has no foreground photograph here. Copy changes height." },
  investmentDomain: { sizes: ["780 × 4482", "1536 × 3162", "2732 × 2754", "3840 × 3738", "5120 × 3738"], note: "Optional whole domain section backdrop, measured 390×2241, 768×1581, 1366×1377, 1920×1869 and 2560×1869 CSS px. Rows/icons use the approved animation; adding/removing entries changes height." },
  investmentPortfoliosSection: { sizes: ["780 × 2680", "1536 × 1988", "2732 × 1726", "3840 × 2114", "5120 × 2114"], note: "Optional whole portfolios backdrop, measured 390×1340, 768×994, 1366×863, 1920×1057 and 2560×1057 CSS px. The portfolio cards are separate." },
  investmentApproachSection: { sizes: ["780 × 5012", "1536 × 3556", "2732 × 3858", "3840 × 4386", "5120 × 4062"], note: "Optional whole process/timeline backdrop, measured 390×2506, 768×1778, 1366×1929, 1920×2193 and 2560×2031 CSS px. Step count and copy change height; icon artwork uses its own fields." },
  investmentProjectsSection: { sizes: ["780 × 3186", "1536 × 2904", "2732 × 2576", "3840 × 3242", "5120 × 2868"], note: "Optional whole projects backdrop, measured 390×1593, 768×1452, 1366×1288, 1920×1621 and 2560×1434 CSS px. This is not the project showcase image." },
  investmentImpact: { sizes: ["780 × 2334", "1536 × 1664", "2732 × 1690", "3840 × 2014", "5120 × 2014"], note: "Measured impact background frame: 390×1167, 768×832, 1366×845, 1920×1007 and 2560×1007 CSS px. Full bleed uses cover; copy edits can change height." },
  investmentClosing: { sizes: ["780 × 1360", "1536 × 1360", "2732 × 1198", "3840 × 1598", "5120 × 1598"], note: "Measured closing frame: 390×680, 768×680, 1366×599, 1920×799 and 2560×799 CSS px. Full bleed uses cover; copy can change height." },
  investmentApproachIcon: { sizes: ["116 × 116", "116 × 116", "160 × 160", "160 × 160", "160 × 160"], note: "Measured process marker: 58×58 CSS px on mobile/tablet and 80×80 CSS px on laptop/desktop/iMac. SVG is preferred; the supplied SVG includes internal whitespace and is scaled by the approved CSS." },
  investmentDomainIcon: { sizes: ["48 × 48", "48 × 48", "60 × 60", "64 × 64", "64 × 64"], note: "Small inline icon in each Investment domain or portfolio title. SVG is preferred. The supplied icon artwork has large internal whitespace and is zoomed 3.2× within a fixed slot; use a similarly centered SVG canvas so a replacement stays visually aligned. A tightly cropped icon may clip." },
  investmentProject: projectImageSizing,
  contactHero: { sizes: ["780 × 1316", "1536 × 1440", "2732 × 1360", "3840 × 1800", "5120 × 1800"], note: "Measured Contact hero: 390×658, 768×720, 1366×680, 1920×900 and 2560×900 CSS px. It uses cover and keeps the parallax animation; nearby heights vary." },
  contactMap: { sizes: ["700 × 780", "1456 × 960", "2514 × 1300", "3520 × 1300", "3520 × 1300"], note: "Measured map frame: 350×390, 728×480, 1257×650, 1760×650 and 1760×650 CSS px. The image sits beneath the editable live map iframe; large-screen width is capped." },
  contactEnquirySection: { sizes: ["780 × 2788", "1536 × 2640", "2732 × 2036", "3840 × 2182", "5120 × 2182"], note: "Measured whole enquiry section: 390×1394, 768×1320, 1366×1018, 1920×1091 and 2560×1091 CSS px. Form/content edits change height." },
  contactHeadquartersSection: { sizes: ["780 × 1562", "1536 × 1164", "2732 × 932", "3840 × 1048", "5120 × 1048"], note: "Measured whole headquarters section: 390×781, 768×582, 1366×466, 1920×524 and 2560×524 CSS px. Fact count alters height." },
  contactLocationSection: { sizes: ["780 × 1532", "1536 × 1684", "2732 × 2010", "3840 × 2198", "5120 × 2198"], note: "Measured whole location section: 390×766, 768×842, 1366×1005, 1920×1099 and 2560×1099 CSS px. This is distinct from the map artwork frame." },
  hero: { sizes: ["780 × 1688", "1536 × 2048", "2732 × 1536", "3840 × 2160", "5120 × 2880"], note: "Measured homepage hero image frame: 390×844, 768×1024, 1366×768, 1920×1080, 2560×1440 CSS px at the corresponding reference viewports. Height changes on other devices." },
  panorama: { sizes: ["6354 × 844", "7709 × 1024", "5782 × 768", "8131 × 1080", "10841 × 1440"], note: "Measured WHOLE moving panorama, not one visible screen. These are actual 1× frames at the five reference viewports; 2× files would be unnecessarily huge. The current approved optimized source is 7009×931 px and about 944 KB. Match the panoramic ratio and optimize aggressively." },
  panoramaVideo: { sizes: ["780 × 1688", "1536 × 2048", "2732 × 1536", "3840 × 2160", "5120 × 2880"], note: "The optional panorama video occupies one visible sticky stage, NOT the extra-wide moving panorama image. Its measured player frames are 390×844, 768×1024, 1366×768, 1920×1080 and 2560×1440 CSS px." },
  portfolio: { sizes: ["700 × 424", "1456 × 882", "746 × 482", "734 × 474", "734 × 474"], note: "Shared Home and Investment portfolio photograph frames, measured at 390, 768, 1366, 1920 and 2560 px viewports: approximately 350×212, 728×441, 373×241, 367×237 and 367×237 CSS px. English and Arabic share these frames. Recommendations are rounded 2× image-frame dimensions. Photographs fill with cover; the three-card grid is capped at 1180 px. Investment shares Home artwork unless an editor supplies an optional override." },
  impact: { sizes: ["700 × 1040", "1456 × 1160", "1468 × 1120", "2060 × 1120", "2060 × 1120"], note: "Measured impact frames are 350×520 mobile, 728×580 tablet, 734×560 laptop, and 1030×560 desktop/iMac CSS px. The approved supplied pair is 701×1041 mobile portrait and 1549×1121 landscape for wider screens. Upload the landscape once as Default and the portrait once as Mobile; tablet/laptop/desktop/iMac inherit Default unless you deliberately supply another composition. The Impact frame fills edge-to-edge using cover, so a mismatched ratio crops the edges rather than leaving empty bands; use a separate composition for any screen where that crop hides important content." },
  visionHero: { sizes: ["780 × 1688", "1536 × 2048", "2732 × 1536", "3840 × 1840", "5120 × 1840"], note: "Measured Vision hero backdrop at 390×844, 768×1024, 1366×768, 1920×920 and 2560×920 CSS px. It stays cover, with its approved overlay; nearby viewport heights can vary." },
  visionPortrait: { sizes: ["760 × 980", "1496 × 1188", "1402 × 1400", "1832 × 1560", "2442 × 1560"], note: "Measured transparent Vision hero portrait element at 380×490, 748×594, 701×700, 916×780 and 1221×780 CSS px. Keep the whole person on a transparent canvas; the approved CSS uses contain. Prefer the existing high-resolution cutout when it is sharp enough." },
  visionPath: { sizes: ["700 × 720", "1456 × 840", "1090 × 1030", "1536 × 1424", "1536 × 1424"], note: "Measured Vision path photo frame at 350×360, 728×420, 545×515, 768×712 and 768×712 CSS px. The large-screen photo frame is capped at 768 px; use a separate crop only if the important subject is lost." },
  visionPillar: { sizes: ["700 × 520", "1456 × 814", "1382 × 1038", "1936 × 1320", "1936 × 1320"], note: "Measured Vision pillar image frames at the reference viewports: 350×260 mobile, 728×407 tablet, 691×519 laptop, 968×660 desktop and iMac CSS px. The five supplied defaults are 1440×900 WebP. This image area keeps its existing cover fit; edit a device-specific composition if a focal point is cropped." },
  visionProgram: { sizes: ["700 × 620", "1456 × 890", "1188 × 1276", "1664 × 1608", "1664 × 1608"], note: "Measured Vision programs visual at 350×310, 728×445, 594×638, 832×804 and 832×804 CSS px. The same image changes with the selected accordion program; its approved cover fit remains." },
  visionRoadmapIcon: { sizes: ["42 × 42", "58 × 58", "86 × 86", "106 × 106", "106 × 106"], note: "Measured roadmap SVG icon inside the animated ring at 21×21, 29×29, 43×43, 53×53 and 53×53 CSS px. SVG is preferred; unlike the ring this icon is artwork, not a filled circle." },
  visionPathSection: { sizes: ["780 × 2294", "1536 × 1946", "2732 × 1412", "3840 × 1936", "5120 × 1936"], note: "Measured full Vision path section at 390×1147, 768×973, 1366×706, 1920×968 and 2560×968 CSS px; its height changes when copy changes." },
  visionStatementSection: { sizes: ["780 × 908", "1536 × 636", "2732 × 676", "3840 × 950", "5120 × 1008"], note: "Measured full Vision statement at 390×454, 768×318, 1366×338, 1920×475 and 2560×504 CSS px. Its copy changes the section height; use SVG for any transparent motif." },
  visionPillarsSection: { sizes: ["780 × 2326", "1536 × 2224", "2732 × 1916", "3840 × 2584", "5120 × 2584"], note: "Measured full Vision pillars section at 390×1163, 768×1112, 1366×958, 1920×1292 and 2560×1292 CSS px. This is not the pillar slide image." },
  visionProgramsSection: { sizes: ["780 × 2966", "1536 × 2842", "2732 × 2120", "3840 × 2724", "5120 × 2724"], note: "Measured full Vision programs section at 390×1483, 768×1421, 1366×1060, 1920×1362 and 2560×1362 CSS px. This is not the changing program image." },
  visionRoadmapStage: { sizes: ["780 × 1688", "1536 × 2048", "2732 × 1536", "3840 × 2160", "5120 × 2880"], note: "Measured one visible, sticky roadmap stage at 390×844, 768×1024, 1366×768, 1920×1080 and 2560×1440 CSS px. The whole scroll section is much taller; upload for the visible stage, not for the total scrolling height." },
  visionCommitmentSection: { sizes: ["780 × 1952", "1536 × 1350", "2732 × 1224", "3840 × 1488", "5120 × 1488"], note: "Measured full Vision commitment section at 390×976, 768×675, 1366×612, 1920×744 and 2560×744 CSS px; paragraph edits can alter height." },
  project: projectImageSizing,
  team: { sizes: ["780 × 1212", "1536 × 1140", "2732 × 1140", "3840 × 1298", "5120 × 1298"], note: "Measured full team image/background frame: 390×606, 768×570, 1366×570, 1920×649, 2560×649 CSS px. The 2× dimensions retain the approved aspect at these reference viewports; actual height can change with copy." },
  triple: { sizes: ["700 × 394", "1456 × 820", "2514 × 1414", "2800 × 1576", "2800 × 1576"], note: "Optional Triple S image/video frame inside the padded section: 350×197, 728×410, 1257×707, 1400×788 and 1400×788 CSS px. It is hidden in the approved text-only design until Show image is enabled or a video is uploaded." },
  homeTripleSection: { sizes: ["780 × 1112", "1536 × 932", "2732 × 982", "3840 × 1286", "5120 × 1286"], note: "Optional backdrop for the entire Triple S section, not its hidden 16:9 media area. Measured section: 390×556, 768×466, 1366×491, 1920×643 and 2560×643 CSS px." },
  background: { sizes: ["1080 × 1920", "1536 × 1152", "1920 × 1080", "2560 × 1440", "3200 × 1800"], note: "Optional section-wide backdrop. Section heights vary with copy and screen, so preview the result; use a transparent fill or artwork matching its actual frame ratio for no bands." },
  news: { sizes: ["700 × 700", "464 × 402", "816 × 550", "1152 × 648", "1152 × 648"], note: "Homepage news card frame. News thumbnail uploads have their own per-screen fields in each story." },
  partnerLogo: { sizes: ["360 × 208", "430 × 236", "430 × 236", "430 × 236", "430 × 236"], note: "Measured partner logo image element: 180×104 CSS px on the 390px mobile reference, then 215×118 CSS px. Transparent artwork is contained inside this element; do not add large whitespace in the file." },
  membershipLogo: { sizes: ["684 × 80", "720 × 84", "914 × 108", "914 × 108", "914 × 108"], note: "Measured SINGLE UFI/IAEE composite: about 342×40 CSS px mobile, 360×42 tablet, and 457×54 laptop/desktop/iMac. If multiple separate marks are added, each is limited to 220 CSS px wide and 70 CSS px high (or 44vw where smaller); its actual height follows its own transparent artwork ratio. These labels are for the current one-logo design, not a forced crop for every possible logo." },
  projectLogo: { sizes: ["734 × 258", "868 × 302", "868 × 302", "868 × 302", "868 × 302"], note: "Measured styled logo art: 367×129 CSS px on mobile, 434×151 CSS px on tablet and larger, inside a 308/310×108 CSS px identity area. Transparent artwork remains uncropped; the apparent size includes the approved visual scale." },
  domainIcon: { sizes: ["452 × 408", "452 × 408", "452 × 408", "452 × 408", "452 × 408"], note: "The supplied icon artwork has a 226.43×203.97 SVG viewBox (452×408 is a 2× raster equivalent). The actual visible square slot is 78×78 mobile/tablet, 86×86 laptop, and 102×102 desktop/iMac CSS px. Frontend art is zoomed 2.25× inside that slot to remove the supplied file's internal whitespace. Use matching centered SVG artwork; a tightly cropped new icon may be clipped by that deliberate zoom." },
  pattern: { sizes: ["780 × 780", "1536 × 1536", "2732 × 2732", "3840 × 3840", "5120 × 5120"], note: "Generic decorative motif; use the supplied transparent SVG whenever possible. There is no single exact raster size because the motif is placed differently in each section." },
  visionStatementPattern: { sizes: ["780 × 908", "1536 × 636", "2732 × 676", "3840 × 950", "5120 × 1008"], note: "Measured whole Vision statement pattern frame: 390×454, 768×318, 1366×338, 1920×475 and 2560×504 CSS px. The approved pattern uses contain and is not cropped; transparent SVG is preferred. If a raster upload has a different ratio, it remains whole with unused area." },
  statsPattern: { sizes: ["780 × 950", "1536 × 950", "2514 × 804", "3520 × 832", "3520 × 832"], note: "Measured homepage statistics section: 390×475, 768×475, 1257×402, 1760×416, 1760×416 CSS px. Prefer the supplied scalable transparent SVG." },
  portfolioPattern: { sizes: ["700 × 3080", "1456 × 4172", "2360 × 1080", "2360 × 1398", "2360 × 1398"], note: "Measured homepage portfolio patterned area: 350×1540, 728×2086, 1180×540, 1180×699, 1180×699 CSS px. This tall mobile/tablet area changes with content; SVG is preferred." },
  teamPattern: { sizes: ["780 × 1212", "1536 × 1140", "2732 × 1140", "3840 × 1298", "5120 × 1298"], note: "Measured same full-section frame as the team background: 390×606, 768×570, 1366×570, 1920×649, 2560×649 CSS px. A transparent SVG avoids large raster files." },
  membershipPattern: { sizes: ["780 × 408", "1536 × 428", "2732 × 448", "3840 × 488", "5120 × 488"], note: "Measured homepage membership strip: 390×204, 768×214, 1366×224, 1920×244, 2560×244 CSS px. Prefer the supplied SVG." },
  triplePattern: { sizes: ["700 × 394", "1456 × 820", "2514 × 1414", "2800 × 1576", "2800 × 1576"], note: "Triple S decorative artwork sits INSIDE the optional 16:9 media frame, not across the whole section. Measured frame: 350×197, 728×410, 1257×707, 1400×788, 1400×788 CSS px. The approved text-only design does not display it until Show image is enabled or a video is uploaded; prefer SVG." },
  homeValueSection: { sizes: ["780 × 2508", "1536 × 2088", "2732 × 1876", "3840 × 2432", "5120 × 2432"], note: "Optional whole-section background. Measured Home value section: 390×1254, 768×1044, 1366×938, 1920×1216, 2560×1216 CSS px. Text edits change its height." },
  homeDomainsSection: { sizes: ["780 × 3592", "1536 × 2454", "2732 × 2110", "3840 × 2386", "5120 × 2386"], note: "Optional whole-section background. Measured investment-domain scroll section: 390×1796, 768×1227, 1366×1055, 1920×1193, 2560×1193 CSS px. Changing item count changes height." },
  homePortfoliosSection: { sizes: ["780 × 4124", "1536 × 5144", "2732 × 2122", "3840 × 2806", "5120 × 2806"], note: "Optional whole-section background, not the portfolio card image. Measured: 390×2062, 768×2572, 1366×1061, 1920×1403, 2560×1403 CSS px. Card count changes height." },
  homeImpactSection: { sizes: ["780 × 1712", "1536 × 1780", "2732 × 1504", "3840 × 1600", "5120 × 1600"], note: "Optional whole-section background. Measured impact scroll section: 390×856, 768×890, 1366×752, 1920×800, 2560×800 CSS px." },
  homeProjectsSection: { sizes: ["780 × 3110", "1536 × 2652", "2732 × 2290", "3840 × 2878", "5120 × 2878"], note: "Optional whole-section background, not the project slide. Measured: 390×1555, 768×1326, 1366×1145, 1920×1439, 2560×1439 CSS px. Project count changes height." },
  homePanoramaSection: { sizes: ["780 × 8440", "1536 × 10240", "2732 × 7680", "3840 × 10800", "5120 × 14400"], note: "Optional entire scroll-section background, not the 7.5:1 panoramic artwork. Measured scroll wrapper is five viewport-heights tall; use panoramaImages for the visible scene instead." },
  homePartnersSection: { sizes: ["780 × 1394", "1536 × 1256", "2732 × 1346", "3840 × 1812", "5120 × 1812"], note: "Optional whole-section background. Measured partnership area: 390×697, 768×628, 1366×673, 1920×906, 2560×906 CSS px. Logo count and content can change it." },
  homeNewsSection: { sizes: ["780 × 2318", "1536 × 2118", "2732 × 2040", "3840 × 2522", "5120 × 2522"], note: "Optional whole-section background, not the news thumbnails. Measured: 390×1159, 768×1059, 1366×1020, 1920×1261, 2560×1261 CSS px. Headlines/cards can change height." },
  card: { sizes: ["700 × 700", "1456 × 1160", "1468 × 1120", "2060 × 1120", "2060 × 1120"], note: "Generic content card; check the actual frame when using this outside the homepage." },
  logo: { sizes: ["434 × 200", "434 × 200", "434 × 200", "434 × 200", "434 × 200"], note: "Transparent artwork. Keep intrinsic whitespace minimal so the logo does not look too small." },
  discoverHero: { sizes: ["780 × 1384", "1536 × 1440", "2732 × 1320", "3840 × 1680", "5120 × 1680"], note: "Measured Discover hero image frames at reference viewports: 390×692, 768×720, 1366×660, 1920×840 and 2560×840 CSS px. The 1600×900 desktop frame is 1600×774; the 3440×1440 ultra-wide frame is 3440×840. The hero uses cover, so compose each device crop to the visible frame ratio. The same iMac/large upload serves every screen from 2000 CSS px upward; at 3440×1440, a 2× frame-matched source would be 6880×1680 px. Keep important subjects in the shared central safe area if one image must serve both 2560 and ultra-wide screens." },
  discoverPortrait: { sizes: ["776 × 776", "1528 × 856", "1360 × 1074", "1752 × 1116", "1752 × 1116"], note: "Measured CEO portrait frame: 388×388, 764×428, 680×537, 876×558, 876×558 CSS px. Keep the person inside the transparent canvas." },
  discoverMethodology: { sizes: ["696 × 656", "1448 × 776", "1218 × 1114", "1706 × 1308", "1706 × 1308"], note: "Measured methodology image frame: 348×328, 724×388, 609×557, 853×654, 853×654 CSS px." },
  discoverGovernance: { sizes: ["780 × 1490", "1536 × 1400", "2732 × 1390", "3840 × 1924", "5120 × 1924"], note: "Measured governance section background: 390×745, 768×700, 1366×695, 1920×962, 2560×962 CSS px. Content can change this height." },
  discoverContact: { sizes: ["Not displayed", "Not displayed", "842 × 1206", "994 × 1206", "994 × 1206"], note: "The approved governance-contact image is hidden on mobile and tablet. Measured visible frame: 421×603 CSS px on laptop, 497×603 on desktop/iMac. Upload narrow-screen versions only if this design is later changed to show them." },
  discoverFilm: { sizes: ["700 × 394", "1456 × 820", "932 × 522", "2996 × 1684", "2996 × 1684"], note: "Measured uncropped 16:9 film player: 350×197, 728×410, 466×261, 1498×842, 1498×842 CSS px. A compressed 1920×1080 16:9 video may be sufficient on all screens if file size matters." },
  discoverIntroSection: { sizes: ["780 × 1088", "1536 × 898", "2732 × 872", "3520 × 1044", "3520 × 1044"], note: "Optional whole Discover introduction backdrop. Measured section: 390×544, 768×449, 1366×436, 1760×522, 1760×522 CSS px. Copy changes height." },
  discoverTimelineSection: { sizes: ["780 × 5740", "1536 × 6964", "2732 × 5222", "3840 × 3650", "5120 × 3734"], note: "Optional entire Discover timeline scroll-section background; it is much taller than the visible film. Measured section: 390×2870, 768×3482, 1366×2611, 1920×1825, 2560×1867 CSS px. Use the dedicated film fields for video." },
  discoverVisionSection: { sizes: ["780 × 858", "1536 × 602", "2732 × 538", "3520 × 912", "3520 × 912"], note: "Optional whole Discover vision backdrop. Measured section: 390×429, 768×301, 1366×269, 1760×456, 1760×456 CSS px." },
  discoverCeoSection: { sizes: ["780 × 1936", "1536 × 1612", "2732 × 1080", "3840 × 1120", "5120 × 1120"], note: "Optional whole CEO section backdrop, distinct from the portrait. Measured section: 390×968, 768×806, 1366×540, 1920×560, 2560×560 CSS px." },
  discoverMethodologySection: { sizes: ["700 × 1736", "1456 × 1432", "2514 × 1120", "3520 × 1314", "3520 × 1314"], note: "Optional whole methodology section backdrop, distinct from its editorial image. Measured: 350×868, 728×716, 1257×560, 1760×657, 1760×657 CSS px." },
  discoverContactSection: { sizes: ["780 × 1962", "1536 × 1900", "2732 × 1754", "3840 × 1954", "5120 × 1954"], note: "Optional whole governance contact backdrop, distinct from its photo. Measured: 390×981, 768×950, 1366×877, 1920×977, 2560×977 CSS px. Form content changes height." },
  discoverHeroPattern: { sizes: ["936 × 668", "1844 × 1316", "1640 × 1170", "1800 × 1286", "1800 × 1286"], note: "Measured decorative hero motif frame: 468×334, 922×658, 820×585, 900×643, 900×643 CSS px. Prefer SVG, which remains sharp at any size." },
  discoverIntroPattern: { sizes: ["358 × 256", "706 × 504", "1256 × 898", "1360 × 972", "1360 × 972"], note: "Measured introduction corner motif frame: about 179×128, 353×252, 628×449, 680×486, 680×486 CSS px. Prefer SVG." },
  discoverCeoPattern: { sizes: ["780 × 1936", "1536 × 1612", "2732 × 1080", "3840 × 1120", "5120 × 1120"], note: "Approved CEO motif covers the whole section. Prefer SVG; height changes with biography/quote content." },
  discoverGovernancePattern: { sizes: ["780 × 1490", "1536 × 1400", "2732 × 1390", "3840 × 1924", "5120 × 1924"], note: "Approved governance motif covers the section. Prefer SVG; frame is the same as the governance background." },
};

export function mediaRoleGuidance(role: MediaRole) {
  return roleSizes[role];
}

const referenceScreens = ["390×844", "768×1024", "1366×768", "1920×1080", "2560×1440"] as const;
const screenRanges = ["≤640 px", "641–1023 px", "1024–1599 px", "1600–1999 px", "≥2000 px"] as const;
const fullBleedRoles = new Set<MediaRole>([
  "insightsHero", "insightsIntro", "insightsArchive", "insightsAreas", "insightsAmbition", "insightsPrinciples", "insightsContribute", "newsHero", "newsHeroImage", "newsArchive",
  "careersHero", "careersWorkplace", "careersOpportunities", "careersTalent", "careersTalentPattern",
  "hero", "panoramaVideo", "team", "impact", "project", "portfolio", "background", "membershipPattern", "homeTripleSection",
  "homeValueSection", "homeDomainsSection", "homePortfoliosSection", "homeImpactSection",
  "homeProjectsSection", "homePanoramaSection", "homePartnersSection", "homeNewsSection",
  "visionHero", "visionPath", "visionPillar", "visionProgram", "visionPathSection", "visionStatementSection",
  "visionPillarsSection", "visionProgramsSection", "visionRoadmapStage", "visionCommitmentSection",
  "discoverHero", "discoverMethodology", "discoverGovernance", "discoverContact",
  "discoverIntroSection", "discoverTimelineSection", "discoverVisionSection", "discoverCeoSection",
  "discoverMethodologySection", "discoverContactSection",
  "investmentImpact", "investmentClosing", "investmentProject", "contactHero", "contactMap", "contactEnquirySection", "contactHeadquartersSection", "contactLocationSection",
  "investmentPhilosophy", "investmentDomain", "investmentPortfoliosSection", "investmentApproachSection", "investmentProjectsSection",
]);

function frameAt(size: string, oneToOne: boolean): string {
  if (size === "Not displayed") return "not displayed";
  const [width, height] = size.split("×").map((value) => Number(value.trim()));
  return `${oneToOne ? width : width / 2}×${oneToOne ? height : height / 2}`;
}

/** A legacy/master fallback is one file, so its label must not imply five-device art direction. */
export function fallbackImageField(name: string, label: string, role: MediaRole, required = true): Field {
  const { sizes, note } = roleSizes[role];
  return {
    name,
    label: role === "project" || role === "investmentProject" ? `${label} · upload ${sizes[3].replaceAll(" ", "")} px` : label,
    type: "upload",
    relationTo: "media",
    required,
    admin: {
      description: `Default image shown on every device unless that device has its own upload below. Recommended desktop-quality source ${sizes[3]} px (2× measured frame); an existing image of comparable quality is also fine. Upload once here—do not repeat the same file in five slots. ${note} The approved frontend fit and layout stay unchanged.`,
    },
  };
}

/** One art-directed source per viewport. Each label describes its specific frame. */
export function responsiveImagesField(name: string, label: string, role: MediaRole = "card"): Field {
  const { sizes, frames, note } = roleSizes[role];
  const iconSlots = ["78×78", "78×78", "86×86", "102×102", "102×102"];
  const oneToOne = role === "panorama";
  const fullBleed = fullBleedRoles.has(role);
  return {
    name,
    label,
    type: "group",
    admin: { description: `A separate fallback image, when provided, is the default for all devices. This group's Default upload replaces that fallback on all devices; only add a device-specific image for a different composition. An empty slot uses the explicit Default or separate fallback, never another device's crop. With no default, an upload in one device slot appears only on that device. Each label gives a measured reference SCREEN, rendered FRAME and recommended UPLOAD size; these are reference dimensions, not compulsory exact pixels. ${note} ${role === "domainIcon" ? "Supplied icons have internal whitespace and are deliberately enlarged within their slot." : `The upload figures are ${oneToOne ? "1× actual-frame" : "2× source-canvas"} recommendations.`} ${fullBleed ? "Photographs and full-bleed media use COVER. Match the frame aspect ratio to minimize cropping at the reference viewport; nearby viewport ratios still vary." : "Contained artwork remains fully visible; differing ratios can leave space around it."} No page layout or animation changes when an editor chooses an image.` },
    fields: [
      { name: "default", label: `Default · one image for all devices${frames ? ` · upload ${sizes[3].replaceAll(" ", "")} px` : ""}`, type: "upload", relationTo: "media", admin: { description: `Optional if this item already has a separate fallback image. Used on every device without its own override. For desktop-quality source at the measured 1920×1080 viewport, recommended ${sizes[3]} px. ${note}` } },
      ...(["mobile", "tablet", "laptop", "desktop", "imac"] as const).map((viewport, index) => ({
      name: viewport,
      label: `${viewport === "imac" ? "iMac / large" : viewport[0].toUpperCase() + viewport.slice(1)} · ${frames ? `${screenRanges[index]} · ` : ""}screen ${referenceScreens[index]} · ${sizes[index] === "Not displayed" ? "not displayed" : role === "domainIcon" ? `slot ${iconSlots[index]} · upload ${sizes[index].replaceAll(" ", "")} px` : `frame ${frames?.[index] || frameAt(sizes[index], oneToOne)} · upload ${sizes[index].replaceAll(" ", "")} px${oneToOne ? " (1×)" : ""}`}${role === "discoverHero" && viewport === "imac" ? " · ultra-wide 3440×1440: frame 3440×840, upload 6880×1680 px (same slot)" : ""}`,
      type: "upload" as const,
      relationTo: "media" as const,
      filterOptions: { mimeType: { in: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"] } },
    })),
    ],
  };
}

export function responsiveVideosField(name: string, label: string, role: MediaRole = "hero"): Field {
  const { sizes, note } = roleSizes[role];
  const fullBleed = fullBleedRoles.has(role);
  return {
    name,
    label,
    type: "group",
    admin: { description: `Upload one default MP4/WebM for all devices. Add a device-specific video ONLY when a different edit is needed; empty slots use the default. ${note} Frame and upload dimensions below are measured reference guidance. ${fullBleed ? "The existing background uses COVER." : "The existing player uses CONTAIN and shows the whole video."} Compress before upload; the approved layout and animation remain unchanged.` },
    fields: [
      { name: "default", label: "Default · one video for all devices", type: "upload", relationTo: "media", filterOptions: { mimeType: { in: ["video/mp4", "video/webm"] } }, admin: { description: `A single optimized video plays at all screen sizes unless a device override is selected. ${note}` } },
      ...(["mobile", "tablet", "laptop", "desktop", "imac"] as const).map((viewport, index) => ({
      name: viewport,
      label: `${viewport === "imac" ? "iMac / large" : viewport[0].toUpperCase() + viewport.slice(1)} video · screen ${referenceScreens[index]} · ${sizes[index] === "Not displayed" ? "not displayed" : `frame ${frameAt(sizes[index], false)} · upload ${sizes[index].replaceAll(" ", "")} px`}`,
      type: "upload" as const,
      relationTo: "media" as const,
      filterOptions: { mimeType: { in: ["video/mp4", "video/webm"] } },
    })),
    ],
  };
}
