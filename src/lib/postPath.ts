import { publicPath, type PublicLocale } from "./publicPath";

/** Editorial detail URLs are determined by the post type, not its category. */
export function postPath(locale: PublicLocale, post: { slug: string; type?: string; postType?: string }): string {
  const type = post.type ?? post.postType;
  return publicPath(locale, `${type === "article" || type === "insight" ? "insights" : "news"}/${post.slug}`);
}
