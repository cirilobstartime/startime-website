/** Approved homepage Impact artwork, in the same order as the bilingual impact copy. */
export const impactMedia = [
  "vision-2030",
  "local-content",
  "industry-technology",
  "saudi-mice",
  "global-issues",
  "fdi",
  "women-generations",
  "quality-of-life",
  "creative-economy",
  "soft-power",
  "innovation",
].map((name) => ({
  default: `/assets/impact/${name}-desktop.webp`,
  mobile: `/assets/impact/${name}-mobile.webp`,
}));
