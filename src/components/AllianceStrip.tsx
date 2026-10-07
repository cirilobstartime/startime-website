import Image from "next/image";
import Link from "./CmsLink";
import { defaultExternalAttributes } from "@/lib/externalLinks";

const allianceLogos = [
  { src: "/assets/alliance/startime-ufi.webp", alt: "Startime", className: "alliance-logo-startime", width: 460, height: 183 },
  { src: "/assets/alliance/united.webp", alt: "United Advisory Chamber", className: "alliance-logo-united", width: 450, height: 77 },
  { src: "/assets/alliance/impact.webp", alt: "Impact Event Production", className: "alliance-logo-impact", width: 321, height: 106 },
  { src: "/assets/alliance/aljawda.webp", alt: "Aljawda", className: "alliance-logo-aljawda", width: 301, height: 156 },
];

export function AllianceStrip({ rtl = false, label, memberLogo = "/assets/alliance/alliance-member.webp", memberLogoAlt, logos = allianceLogos }: { rtl?: boolean; label?: string; memberLogo?: string; memberLogoAlt?: string; logos?: { src?: string; image?: string; alt: string; href?: string; className?: string; width?: number; height?: number }[] }) {
  return (
    <section className="alliance-strip" aria-label={label || (rtl ? "أعضاء تحالف ستارتايم" : "Startime Alliance members")}>
      <div className="alliance-logo-row" role="list">
        <div className="alliance-member" role="listitem">
          <Image
            className="alliance-member-lockup"
            src={memberLogo}
            alt={memberLogoAlt || (rtl ? "عضو تحالف ستارتايم" : "Startime Alliance Member")}
            width={486}
            height={87}
            sizes="(max-width: 540px) 200px, 250px"
          />
        </div>
        {logos.map((logo, index) => (
          <div className={`alliance-logo ${logo.className || allianceLogos[index]?.className || ""}`} role="listitem" key={`${logo.image || logo.src}-${index}`}>
            {logo.href ? <Link href={logo.href} aria-label={logo.alt} {...defaultExternalAttributes(logo.href)}>
              <Image src={logo.image || logo.src || ""} alt={logo.alt} width={logo.width || 460} height={logo.height || 183} sizes="(max-width: 700px) 42vw, 22vw" />
            </Link> : <Image src={logo.image || logo.src || ""} alt={logo.alt} width={logo.width || 460} height={logo.height || 183} sizes="(max-width: 700px) 42vw, 22vw" />}
          </div>
        ))}
      </div>
    </section>
  );
}
