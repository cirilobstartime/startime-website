"use client";

import { NewSiteHeader } from "@/components/NewSiteHeader";
import { NewSiteFooter } from "@/components/NewSiteFooter";


import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GraduationCap } from "@phosphor-icons/react/GraduationCap";
import { Lightbulb } from "@phosphor-icons/react/Lightbulb";
import { Sparkle } from "@phosphor-icons/react/Sparkle";
import { Target } from "@phosphor-icons/react/Target";
import { TrendUp } from "@phosphor-icons/react/TrendUp";
import { UsersThree } from "@phosphor-icons/react/UsersThree";
import { careersContent, type CareerJob } from "@/content/careers";
import { type Locale } from "@/content/home";
import { submitPublicForm } from "@/lib/submitPublicForm";
import { ArtDirectedImage, ArtDirectedVideo } from "@/components/ArtDirectedImage";
import { homepageItemStyle, homepageVisualStyle } from "@/content/homepageVisual";
import { careersSectionKeys, type CareersCmsSettings, type CareersSectionKey } from "@/content/careersCms";


const workplaceIcons = [GraduationCap, Lightbulb, UsersThree, Target, TrendUp, Sparkle];
// English and Arabic workplace cards share this order and the same supplied artwork.
const workplaceArtwork = [
  "/assets/ui/work-environment/professional-development.svg",
  "/assets/ui/work-environment/innovation.svg",
  "/assets/ui/work-environment/empowerment.svg",
  "/assets/ui/work-environment/creating-impact.svg",
  "/assets/ui/work-environment/career-growth.svg",
  "/assets/ui/work-environment/inspiring-workplace.svg",
];

const jobFilterCopy = {
  en: { search: "Search jobs", searchHint: "Job title or keyword", category: "Category", tag: "Specialty", location: "Location", type: "Employment type", all: "All", results: "Results", clear: "Clear filters", empty: "No opportunities match these filters." },
  ar: { search: "ابحث عن وظيفة", searchHint: "المسمى الوظيفي أو كلمة مفتاحية", category: "التخصص", tag: "المهارة", location: "الموقع", type: "نوع التوظيف", all: "الكل", results: "النتائج", clear: "مسح الفلاتر", empty: "لا توجد فرص وظيفية تطابق هذه الفلاتر." },
};

function ApplicationFields({ fields, submit, locale, role }: { fields: string[]; submit: string; locale: Locale; role?: string }) {
  const [state, setState] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");
  const names = role
    ? ["fullName", "email", "mobile", "cv", "attachments", "summary"]
    : ["fullName", "email", "mobile", "city", "expertise", "experience", "cv", "attachments", "statement"];
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "submitting") return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setState("submitting");
    setError("");
    try {
      await submitPublicForm({ form, formKey: "careers", locale, sectionID: role ? "job-application" : "talent-network", extra: { jobRole: role || "", submissionType: role ? "job" : "talent-network" } });
      setState("success");
      form.reset();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
      setState("idle");
    }
  }

  if (state === "success") return <p className="careers-form-success" role="status">{locale === "ar" ? "تم استلام طلبك. سيتواصل معك فريقنا عند الحاجة." : "Your application has been received. Our team will be in touch when appropriate."}</p>;
  return (
    <form className="careers-form lead-form" data-form-key="careers" onSubmit={handleSubmit}>
      <input aria-hidden="true" autoComplete="off" name="companyWebsite" tabIndex={-1} style={{ position: "absolute", left: "-10000px" }} />
      {fields.map((field, index) => {
        const isFile = /CV|Attach|السيرة|المرفقات/.test(field);
        const isLong = /Statement|Summary|تعريفية/.test(field);
        const type = isFile ? "file" : /Email|البريد/.test(field) ? "email" : /Mobile|الجوال/.test(field) ? "tel" : "text";
        return <label className={isLong || isFile ? "wide" : ""} key={field}>
          <span>{field}</span>
          {isLong ? <textarea name={names[index]} rows={3} /> : <input name={names[index]} type={type} accept={isFile ? names[index] === "cv" ? ".pdf,.docx" : ".pdf,.docx,.png,.jpg,.jpeg" : undefined} required={field.includes("*")} />}
          {isFile && <small>{locale === "ar" ? (names[index] === "cv" ? "PDF أو DOCX، حتى 5 ميجابايت" : "PDF أو DOCX أو JPG أو PNG، حتى 5 ميجابايت") : (names[index] === "cv" ? "PDF or DOCX, up to 5 MB" : "PDF, DOCX, JPG or PNG, up to 5 MB")}</small>}
        </label>;
      })}
      {error ? <p className="careers-form-error" role="alert">{error}</p> : null}
      <button type="submit" disabled={state === "submitting"}>{state === "submitting" ? (locale === "ar" ? "جارٍ الإرسال…" : "Submitting…") : submit}<span aria-hidden="true">↗</span></button>
    </form>
  );
}

function JobDialog({ job, locale, detail, onClose }: { job: CareerJob; locale: Locale; detail: (typeof careersContent)["en"]["detail"]; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);
  return <dialog className="careers-dialog" ref={dialogRef} onClose={onClose} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current?.close(); }}>
    <button className="careers-dialog-close" type="button" onClick={() => dialogRef.current?.close()} aria-label={locale === "ar" ? "إغلاق" : "Close"}>×</button>
    <div className="careers-dialog-scroll">
      <p className="careers-job-location">{job.location}</p>
      <h2>{job.detailTitle}</h2>
      <section><h3>{detail.overview}</h3><p>{job.overview}</p></section>
      <section><h3>{detail.responsibilities}</h3><ul>{job.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section><h3>{detail.requirements}</h3><ul>{job.requirements.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section className="careers-dialog-apply"><h3>{detail.apply}</h3><ApplicationFields fields={detail.fields} submit={detail.submit} locale={locale} role={job.detailTitle} /></section>
    </div>
  </dialog>;
}

export function CareersPage({ locale, square = false, cmsContent, cmsSettings }: { locale: Locale; route?: "careers" | "careers1"; square?: boolean; cmsContent?: (typeof careersContent)["en"]; cmsSettings?: CareersCmsSettings }) {
  const c = cmsContent || careersContent[locale];
  const rtl = locale === "ar";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedJob, setSelectedJob] = useState<CareerJob | null>(null);
  const [jobSearch, setJobSearch] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [jobTag, setJobTag] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const heroRef = useRef<HTMLElement>(null);
  const filterCopy = { ...jobFilterCopy[locale], ...cmsSettings?.opportunities?.filterLabels };
  const section = (key: CareersSectionKey) => cmsSettings?.[key];
  const element = (key: CareersSectionKey, name: "eyebrow" | "heading" | "body" | "media" | "items" | "pattern" | "cta") => section(key)?.elementVisibility?.[name] !== false;
  const orderedKeys = [...(cmsSettings?.order || []), ...careersSectionKeys].filter((key, index, list) => list.indexOf(key) === index);
  const sectionStyle = (key: CareersSectionKey) => ({ ...homepageVisualStyle(section(key)?.visual), order: orderedKeys.indexOf(key) + 1, display: section(key)?.visible === false ? "none" : undefined });
  const categories = [...new Set(c.jobs.map((job) => job.category).filter((value): value is string => Boolean(value)))];
  const tags = [...new Set(c.jobs.flatMap((job) => job.tags || []))];
  const locationOptions = [...new Set(c.jobs.map((job) => job.city || job.location.split("|")[0].trim()))];
  const typeOptions = [...new Set(c.jobs.map((job) => job.employmentType || job.location.split("|")[1]?.trim()).filter((value): value is string => Boolean(value)))];
  const visibleJobs = c.jobs.filter((job) => {
    const location = job.city || job.location.split("|")[0].trim();
    const type = job.employmentType || job.location.split("|")[1]?.trim();
    const searchable = `${job.title} ${job.detailTitle} ${job.summary} ${job.overview} ${job.category || ""} ${(job.tags || []).join(" ")}`.toLocaleLowerCase(locale);
    return (!jobSearch || searchable.includes(jobSearch.trim().toLocaleLowerCase(locale)))
      && (!jobCategory || job.category === jobCategory)
      && (!jobTag || job.tags?.includes(jobTag))
      && (!jobLocation || location === jobLocation)
      && (!jobType || type === jobType);
  });

  const clearJobFilters = () => {
    setJobSearch("");
    setJobCategory("");
    setJobTag("");
    setJobLocation("");
    setJobType("");
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
    document.querySelectorAll(".careers-reveal").forEach((element) => observer.observe(element));
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = heroRef.current;
      if (!hero) return;
      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty("--careers-hero-progress", String(Math.min(1, Math.max(0, -bounds.top / Math.max(1, hero.offsetHeight)))));
      setScrolled(bounds.bottom <= 70);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, [locale, rtl]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);


  return <main className={`careers-page image-hero-page ${square ? "sharp-variation" : ""} ${rtl ? "rtl" : "ltr"}`}>
      <NewSiteHeader locale={locale} scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

    <section className="careers-hero" ref={heroRef} aria-labelledby="careers-heading" id={section("hero")?.anchorID} style={sectionStyle("hero")}>
      {element("hero", "media") && <ArtDirectedImage className="careers-hero-image" fallback={section("hero")?.image || (rtl ? "/assets/editorial/startime-careers-hero-ar-v1-optimized.webp" : "/assets/editorial/startime-careers-hero-en-v1-optimized.webp")} images={section("hero")?.images} alt="" loading="eager" />}
      {section("hero")?.backgroundImages && <ArtDirectedImage className="careers-section-background" fallback="" images={section("hero")?.backgroundImages} alt="" />}
      <ArtDirectedVideo className="careers-section-video" videos={section("hero")?.backgroundVideos} />
      <div className="careers-hero-shade" aria-hidden="true" />
      <div className="careers-hero-copy">{element("hero", "eyebrow") && <p className="careers-label">{c.hero.lead}</p>}{element("hero", "heading") && <h1 id="careers-heading">{c.hero.title}</h1>}{element("hero", "body") && <p>{c.hero.body}</p>}</div>
      {section("hero")?.showScrollCue !== false && <span className="contact-scroll-cue" aria-hidden="true" />}
    </section>

    <section className="careers-investing" id={section("investing")?.anchorID} style={sectionStyle("investing")}>
      {section("investing")?.backgroundImages && <ArtDirectedImage className="careers-section-background" fallback="" images={section("investing")?.backgroundImages} alt="" />}
      <ArtDirectedVideo className="careers-section-video" videos={section("investing")?.backgroundVideos} />
      <div className="careers-investing-copy careers-reveal">{element("investing", "eyebrow") && <p className="careers-label">{c.investing.label}</p>}{element("investing", "heading") && <h2>{c.investing.title}</h2>}{element("investing", "body") && <p>{c.investing.body}</p>}</div>
      {element("investing", "media") && <div className="careers-investing-image careers-reveal">
        {section("investing")?.images || section("investing")?.image ? <ArtDirectedImage fallback={section("investing")?.image || "/assets/editorial/careers-investing-desktop.webp"} images={section("investing")?.images} alt="" style={{ objectFit: "contain" }} /> : square ? <picture className="careers-investing-picture">
          <source media="(max-width: 600px)" srcSet="/assets/editorial/careers-investing-mobile.webp" />
          <Image src="/assets/editorial/careers-investing-desktop.webp" alt="" fill sizes="(max-width: 900px) 100vw, 48vw" />
        </picture> : <Image src="/assets/editorial/startime-careers-creative-team.webp" alt="" fill sizes="(max-width: 900px) 100vw, 48vw" />}
      </div>}
    </section>

    <section className="careers-workplace" id={section("workplace")?.anchorID} style={sectionStyle("workplace")}>
      {section("workplace")?.backgroundImages && <ArtDirectedImage className="careers-section-background" fallback="" images={section("workplace")?.backgroundImages} alt="" />}
      <ArtDirectedVideo className="careers-section-video" videos={section("workplace")?.backgroundVideos} />
      <div className="careers-section-intro careers-reveal"><div>{element("workplace", "eyebrow") && <p className="careers-label">{c.workplace.label}</p>}{element("workplace", "heading") && <h2>{c.workplace.title}</h2>}</div>{element("workplace", "body") && <p>{c.workplace.body}</p>}</div>
      {element("workplace", "items") &&
      <div className="careers-workplace-grid">{c.workplace.points.map((point, index) => {
        if (section("workplace")?.points?.[index]?.visible === false) return null;
        const Icon = workplaceIcons[index % workplaceIcons.length];
        const artwork = section("workplace")?.points?.[index]?.artwork || workplaceArtwork[index % workplaceArtwork.length];
        return <article className="careers-workplace-point careers-reveal" key={`${point.title}-${index}`} style={homepageItemStyle(section("workplace")?.points?.[index]?.visual)}><span className="careers-workplace-icon" aria-hidden="true">{square ? <ArtDirectedImage fallback={artwork} images={section("workplace")?.points?.[index]?.artworkImages} alt="" fill={false} width={226} height={204} /> : <Icon />}</span><h3>{point.title}</h3><p>{point.body}</p><div><span>{c.workplace.targetLabel}</span><strong>{point.target}</strong></div></article>;
      })}</div>}
    </section>

    <section className="careers-opportunities" id={section("opportunities")?.anchorID || "opportunities"} style={sectionStyle("opportunities")}>
      {section("opportunities")?.backgroundImages && <ArtDirectedImage className="careers-section-background" fallback="" images={section("opportunities")?.backgroundImages} alt="" />}
      <ArtDirectedVideo className="careers-section-video" videos={section("opportunities")?.backgroundVideos} />
      <div className="careers-section-intro careers-reveal"><div>{element("opportunities", "heading") && <h2>{c.opportunities.title}</h2>}</div>{element("opportunities", "body") && <p>{c.opportunities.body}</p>}</div>
      {element("opportunities", "items") && <div className="careers-job-filters" role="search" aria-label={filterCopy.search}>
        <label><span>{filterCopy.search}</span><input type="search" value={jobSearch} onChange={(event) => setJobSearch(event.target.value)} placeholder={filterCopy.searchHint} /></label>
        <label><span>{filterCopy.category}</span><select value={jobCategory} onChange={(event) => setJobCategory(event.target.value)}><option value="">{filterCopy.all}</option>{categories.map((category) => <option value={category} key={category}>{category}</option>)}</select></label>
        <label><span>{filterCopy.tag}</span><select value={jobTag} onChange={(event) => setJobTag(event.target.value)}><option value="">{filterCopy.all}</option>{tags.map((tag) => <option value={tag} key={tag}>{tag}</option>)}</select></label>
        <label><span>{filterCopy.location}</span><select value={jobLocation} onChange={(event) => setJobLocation(event.target.value)}><option value="">{filterCopy.all}</option>{locationOptions.map((location) => <option value={location} key={location}>{location}</option>)}</select></label>
        <label><span>{filterCopy.type}</span><select value={jobType} onChange={(event) => setJobType(event.target.value)}><option value="">{filterCopy.all}</option>{typeOptions.map((type) => <option value={type} key={type}>{type}</option>)}</select></label>
      </div>}
      {element("opportunities", "items") && <div className="careers-job-filter-summary"><span aria-live="polite">{filterCopy.results}: {visibleJobs.length}</span><button type="button" onClick={clearJobFilters}>{filterCopy.clear}</button></div>}
      {element("opportunities", "items") && <div className="careers-job-list">{visibleJobs.length ? visibleJobs.map((job) => <article className="careers-job" key={job.id}><div><span className="careers-job-location">{job.location}</span><h3>{job.title}</h3></div><div><p>{job.summary}</p><button type="button" onClick={() => setSelectedJob(job)}>{c.opportunities.details}<span aria-hidden="true">↗</span></button></div></article>) : <p className="careers-jobs-empty">{filterCopy.empty}</p>}</div>}
    </section>

    <section className="careers-talent" id={section("talent")?.anchorID} style={sectionStyle("talent")}>
      {element("talent", "pattern") && <ArtDirectedImage fallback={section("talent")?.pattern || "/assets/brand/startime-pattern.svg"} images={section("talent")?.patternImages} alt="" className="careers-talent-pattern" />}
      {section("talent")?.backgroundImages && <ArtDirectedImage className="careers-section-background" fallback="" images={section("talent")?.backgroundImages} alt="" />}
      <ArtDirectedVideo className="careers-section-video" videos={section("talent")?.backgroundVideos} />
      <div className="careers-talent-copy careers-reveal">{element("talent", "eyebrow") && <p className="careers-label">{c.talent.label}</p>}{element("talent", "heading") && <h2>{c.talent.title}</h2>}{element("talent", "body") && <p>{c.talent.body}</p>}</div>
      {element("talent", "cta") && <div className="careers-talent-form careers-reveal"><h3>{c.talent.formTitle}</h3><ApplicationFields fields={c.talent.fields} submit={c.talent.submit} locale={locale} /></div>}
    </section>

      <NewSiteFooter locale={locale} />
    {selectedJob && <JobDialog key={selectedJob.id} job={selectedJob} locale={locale} detail={c.detail} onClose={() => setSelectedJob(null)} />}
  </main>;
}
