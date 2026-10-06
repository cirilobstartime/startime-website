/** The three approved homepage media partners (the archive's dark, full-size marks). */
export const homeMediaPartners = [
  { number: 6, en: "Ocean Science & Technology", ar: "علوم وتقنيات المحيطات" },
  { number: 7, en: "Defense Advancement", ar: "تطوير القدرات الدفاعية" },
  { number: 8, en: "Unmanned Systems Technology", ar: "تقنيات الأنظمة غير المأهولة" },
] as const;

export const homeMediaPartnerAsset = (number: number) =>
  `/assets/partners/colored-partner-${String(number).padStart(2, "0")}.png`;
