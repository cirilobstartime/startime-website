import type { ViewportImages } from "@/components/ArtDirectedImage";

export const portfolioImages = [
  "/assets/portfolios/startime-government-portfolio.webp",
  "/assets/portfolios/startime-business-portfolio.webp",
  "/assets/portfolios/startime-community-portfolio.webp",
] as const;

export type PortfolioPhoto = { image?: string; images?: ViewportImages };

/** A new default replaces all inherited crops; a device-only override does not. */
export function resolvePortfolioPhoto(shared: PortfolioPhoto | undefined, own: PortfolioPhoto | undefined, index: number): PortfolioPhoto & { image: string } {
  const image = own?.images?.default || own?.image || shared?.images?.default || shared?.image || portfolioImages[index % portfolioImages.length];
  const images = own?.image || own?.images?.default
    ? own.images
    : { ...shared?.images, ...own?.images };
  return { image, images };
}
