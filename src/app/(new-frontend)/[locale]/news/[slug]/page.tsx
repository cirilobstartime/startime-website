import { renderPostDetail } from "@/content/postDetailRoute";

export { generatePostMetadata as generateMetadata } from "@/content/postDetailRoute";
export const dynamic = "force-dynamic";

export default async function LocalizedNewsDetail(props: { params: Promise<{ locale: string; slug: string }> }) {
  return renderPostDetail(props, "news");
}
