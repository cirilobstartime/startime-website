import { ArtDirectedImage, ArtDirectedVideo } from "@/components/ArtDirectedImage";
import type { PageSectionSettings } from "@/content/investmentContactCms";

export function PageSectionBackdrop({ settings }: { settings?: PageSectionSettings }) {
  if (!settings?.backgroundImages && !settings?.backgroundVideos) return null;
  return <div className="page-cms-backdrop" aria-hidden="true">
    {settings.backgroundImages ? <ArtDirectedImage images={settings.backgroundImages} fallback="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" /> : null}
    {settings.backgroundVideos ? <ArtDirectedVideo videos={settings.backgroundVideos} /> : null}
  </div>;
}
