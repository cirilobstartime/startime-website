"use client";

import Link from "./CmsLink";
import { postPath } from "@/lib/postPath";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple";
import { Printer } from "@phosphor-icons/react/Printer";
import { ShareNetwork } from "@phosphor-icons/react/ShareNetwork";
import { FacebookLogo } from "@phosphor-icons/react/FacebookLogo";
import { LinkedinLogo } from "@phosphor-icons/react/LinkedinLogo";
import { XLogo } from "@phosphor-icons/react/XLogo";
import { WhatsappLogo } from "@phosphor-icons/react/WhatsappLogo";
import { Copy } from "@phosphor-icons/react/Copy";
import { NewSiteHeader } from "@/components/NewSiteHeader";
import { NewSiteFooter } from "@/components/NewSiteFooter";
import { PostFeatureImage, ResponsiveNewsImage } from "@/components/ResponsiveNewsImage";
import type { Locale } from "@/content/home";
import { getPostCategory, getPostCopy, getPostFeatureImage, getPostSummary, insightPosts, postCategoryLabel, postTypeLabel, type InsightPost } from "@/content/insightPosts";

function linkedText(text: string, locale: Locale): ReactNode[] {
  const links: Array<[string, string]> = locale === "ar"
    ? [
        ["رؤية ستارتايم 2030", `/${locale}/vision`],
        ["رؤية السعودية 2030", `/${locale}/vision`],
        ["محفظة ستارتايم الحكومية", `/${locale}/investment`],
        ["محفظة ستارتايم للأعمال", `/${locale}/investment`],
        ["محفظة ستارتايم للمجتمع", `/${locale}/investment`],
        ["المعرض السعودي الدولي للأنظمة غير المأهولة", `/${locale}#home2-projects`],
        ["الملتقى البحري السعودي الدولي", `/${locale}#home2-projects`],
      ]
    : [
        ["Startime Vision 2030", `/${locale}/vision`],
        ["Saudi Vision 2030", `/${locale}/vision`],
        ["Startime Government Portfolio", `/${locale}/investment`],
        ["Startime Business Portfolio", `/${locale}/investment`],
        ["Startime Community Portfolio", `/${locale}/investment`],
        ["Saudi International Unmanned Systems Expo", `/${locale}#home2-projects`],
        ["Saudi International Maritime Forum", `/${locale}#home2-projects`],
      ];
  const pattern = new RegExp(`(${links.map(([phrase]) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  const lookup = new Map(links);
  return text.split(pattern).filter(Boolean).map((part, index) => {
    const href = lookup.get(part);
    return href ? <Link href={href} key={`${part}-${index}`}>{part}</Link> : <span key={`${part}-${index}`}>{part}</span>;
  });
}

function isSectionHeading(text: string) {
  return text.length < 115 && !/[.!؟؛:]\s*["'”’)]?$/.test(text);
}

export function InsightDetailPage({ locale, post, posts = insightPosts }: { locale: Locale; post: InsightPost; posts?: InsightPost[] }) {
  const copy = getPostCopy(post, locale);
  const rtl = locale === "ar";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const related = useMemo(() => posts.filter((item) => item.type === post.type && item.slug !== post.slug).slice(0, 3), [post.slug, post.type, posts]);
  const archiveHref = post.type === "news" ? `/${locale}/latest-news` : `/${locale}/insights`;
  const sharePageURL = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : "";
  const featureImage = getPostFeatureImage(post);

  const copyPostLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShareMessage(rtl ? "تم نسخ الرابط" : "Link copied");
      setShareOpen(false);
    } catch {
      const input = document.createElement("textarea");
      input.value = url;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.append(input);
      input.select();
      const copied = document.execCommand("copy");
      input.remove();
      setShareMessage(copied ? (rtl ? "تم نسخ الرابط" : "Link copied") : (rtl ? "تعذر نسخ الرابط" : "Could not copy link"));
      if (copied) setShareOpen(false);
    }
  };

  const downloadPost = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const article = document.querySelector(".post-detail-page .insight-detail-body");
      if (!article) throw new Error("Article content unavailable");
      const imageResponse = await fetch(featureImage.src);
      if (!imageResponse.ok) throw new Error("Article image unavailable");
      const imageBlob = await imageResponse.blob();
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(imageBlob);
      });
      const pdfRoot = document.createElement("div");
      pdfRoot.dir = rtl ? "rtl" : "ltr";
      pdfRoot.style.cssText = `width:760px;padding:40px 52px;color:#30343a;background:#fff;font-family:${getComputedStyle(article).fontFamily};box-sizing:border-box;`;
      const heading = document.createElement("header");
      heading.style.cssText = "margin-bottom:30px;text-align:center";
      const eyebrow = document.createElement("p");
      eyebrow.textContent = postTypeLabel(post.type, locale);
      eyebrow.style.cssText = "margin:0 0 16px;color:#2e2449;font-size:14px";
      const title = document.createElement("h1");
      title.textContent = copy.title;
      title.style.cssText = "margin:0;color:#2e2449;font-size:34px;line-height:1.3";
      const summary = document.createElement("p");
      summary.textContent = getPostSummary(post, locale);
      summary.style.cssText = "margin:20px 0 0;color:#5c5666;font-size:16px;line-height:1.7";
      heading.append(eyebrow, title, summary);
      const image = document.createElement("img");
      image.src = imageData;
      image.alt = featureImage.alt?.[locale] ?? "";
      image.style.cssText = "display:block;width:100%;height:auto;margin:0 0 32px";
      const articleCopy = article.cloneNode(true) as HTMLElement;
      articleCopy.className = "";
      articleCopy.style.cssText = "width:100%;margin:0;padding:0;font-size:16px;line-height:1.9";
      articleCopy.querySelectorAll("p").forEach((paragraph) => {
        paragraph.style.cssText = "margin:0 0 26px;color:#30343a;font-size:16px;line-height:1.9";
      });
      articleCopy.querySelectorAll("h2").forEach((subheading) => {
        subheading.style.cssText = "margin:40px 0 18px;color:#2e2449;font-size:24px;line-height:1.4";
      });
      articleCopy.querySelectorAll("a").forEach((link) => {
        link.style.color = "#2e2449";
      });
      pdfRoot.append(heading, image, articleCopy);
      const { default: html2pdf } = await import("html2pdf.js");
      await html2pdf().set({
        margin: 0,
        filename: `${post.slug}-${locale}.pdf`,
        image: { type: "jpeg", quality: 0.9 },
        html2canvas: { scale: 1.6, backgroundColor: "#ffffff", useCORS: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      }).from(pdfRoot).save();
    } catch {
      setShareMessage(rtl ? "تعذر تنزيل المقال" : "Could not download article");
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    const update = () => setScrolled(window.scrollY > 48);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [locale, rtl]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  return <main className={`insight-detail-page post-detail-page sharp-variation ${rtl ? "rtl" : "ltr"}`}>
    <NewSiteHeader locale={locale} scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

    <aside className="post-detail-actions" aria-label={rtl ? "إجراءات المقال" : "Article actions"}>
      <button type="button" onClick={() => setShareOpen((open) => !open)} aria-expanded={shareOpen} aria-controls="post-share-options" aria-label={rtl ? "مشاركة المقال" : "Share article"} title={rtl ? "مشاركة" : "Share"}><ShareNetwork aria-hidden="true" /></button>
      {shareOpen ? <div className="post-detail-share-options" id="post-share-options" aria-label={rtl ? "خيارات المشاركة" : "Share options"}>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharePageURL)}`} target="_blank" rel="nofollow noopener noreferrer" aria-label="Facebook"><FacebookLogo aria-hidden="true" /><span>Facebook</span></a>
        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(sharePageURL)}&text=${encodeURIComponent(copy.title)}`} target="_blank" rel="nofollow noopener noreferrer" aria-label="X"><XLogo aria-hidden="true" /><span>X</span></a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharePageURL)}`} target="_blank" rel="nofollow noopener noreferrer" aria-label="LinkedIn"><LinkedinLogo aria-hidden="true" /><span>LinkedIn</span></a>
        <a href={`https://wa.me/?text=${encodeURIComponent(`${copy.title} ${sharePageURL}`)}`} target="_blank" rel="nofollow noopener noreferrer" aria-label="WhatsApp"><WhatsappLogo aria-hidden="true" /><span>WhatsApp</span></a>
        <button type="button" onClick={copyPostLink}><Copy aria-hidden="true" /><span>{rtl ? "نسخ الرابط" : "Copy link"}</span></button>
      </div> : null}
      <button type="button" onClick={() => window.print()} aria-label={rtl ? "طباعة المقال" : "Print article"} title={rtl ? "طباعة" : "Print"}><Printer aria-hidden="true" /></button>
      <button type="button" onClick={downloadPost} disabled={downloading} aria-label={rtl ? "تنزيل المقال الكامل" : "Download full article"} title={rtl ? "تنزيل المقال" : "Download article"}><DownloadSimple aria-hidden="true" /></button>
      <span className="post-detail-action-status" role="status" aria-live="polite">{shareMessage}</span>
    </aside>

    <section className="insight-detail-hero post-detail-hero">
      <div className="insight-detail-hero-copy post-detail-intro"><p>{postTypeLabel(post.type, locale)} <span aria-hidden="true">/</span> {post.categoryLabel || postCategoryLabel(getPostCategory(post), locale)}</p><h1>{copy.title}</h1><span>{getPostSummary(post, locale)}</span></div>
      <figure className="post-detail-feature">
        <PostFeatureImage post={post} locale={locale} />
      </figure>
    </section>

    <article className="insight-detail-body">
      {post.richContent?.length ? post.richContent.map((section, index) => <div key={section.id || index}>{section.heading ? <h2>{section.heading}</h2> : null}<RichText data={section.body} /></div>) : copy.body.map((paragraph, index) => isSectionHeading(paragraph)
        ? <h2 key={`${index}-${paragraph.slice(0, 20)}`}>{linkedText(paragraph, locale)}</h2>
        : <p key={`${index}-${paragraph.slice(0, 20)}`}>{linkedText(paragraph, locale)}</p>)}
    </article>

    <section className="insight-related">
      <div className="insight-related-heading"><p>{post.type === "news" ? (rtl ? "المزيد من الأخبار" : "More News") : (rtl ? "المزيد من الرؤى" : "More Insights")}</p><h2>{post.type === "news" ? (rtl ? "واصل استكشاف أحدث أخبارنا" : "Continue Exploring Our Latest News") : (rtl ? "واصل استكشاف مقالاتنا ورؤانا" : "Continue Exploring Our Articles and Insights")}</h2></div>
      <div className="insights-archive-grid">
        {related.map((item) => {
          const itemCopy = getPostCopy(item, locale);
          return <article className="insights-post-card" key={item.slug}><Link href={postPath(locale, item)}><div className="insights-post-card-media news-responsive-media"><ResponsiveNewsImage post={item} sizes="(max-width: 760px) 100vw, 33vw" /></div><div className="insights-post-card-copy"><span>{item.categoryLabel || postCategoryLabel(getPostCategory(item), locale)}</span><h3>{itemCopy.title}</h3><p>{getPostSummary(item, locale)}</p></div></Link></article>;
        })}
      </div>
      <Link className="insight-related-all" href={archiveHref}>{post.type === "news" ? (rtl ? "عرض جميع الأخبار" : "Find All News") : (rtl ? "عرض جميع الرؤى" : "View All Insights")}</Link>
    </section>

    <NewSiteFooter locale={locale} />
  </main>;
}
