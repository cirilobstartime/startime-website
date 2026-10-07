# Global design controls

CMS → Website chrome → **Global design · typography and colors**.

Global defaults cover hero headings, section headings, eyebrows, body text, card titles/descriptions, CTA text, statistics and small text. Each role has independent mobile (≤640), tablet (641–1023), laptop (1024–1599), desktop (1600–1999) and large/iMac (≥2000) CSS-pixel sizes, plus optional weight/line height. Empty values preserve the approved design rather than imposing arbitrary font sizes.

Light-background section headings default to **#2e2449**, with eyebrows **#614787**. Dark/image section colors stay unchanged unless explicitly configured. Colors can be managed separately for light/dark backgrounds, including links, button fills/borders and dividers. CMS-selected solid backgrounds are classified by luminance so their foreground theme follows the chosen background. Explicit section/item colors always win.

The **Page overrides** tab targets a stable CMS page relationship (not its editable URL), for both languages or just English/Arabic. Language-specific entries take precedence over shared entries. Page overrides follow client-side navigation as well as full page loads. Nothing is copied into or overwritten in existing localized sections.

Priority: **item → section → page → global → approved CSS**. Existing section-specific typography, colors, and padding remain higher priority. Optional global/page vertical padding applies only to regular content sections, excluding heroes, sticky timelines and the footer. Icon dimensions and header/footer appearance remain in their existing dedicated globals.

Investment project identity logos render 198 × 100.32 CSS px (a further 10% increase from 180 × 91.2). Logo tabs match homepage sizing: 150–178 × 84 CSS px, or 146 × 84 on mobile. Tab fills are transparent while active borders remain. Transparent/white outer canvas is measured once per source, and an SVG viewport crops the empty margin while rendering the original artwork at full fidelity. Identity artwork aligns with the text edge in LTR/RTL; tab artwork is centered. White pixels blend into the background with CSS multiply. Uploads are not rewritten or recompressed, and replacement CMS logos are measured automatically; CORS-restricted sources safely retain their original canvas.

## Release

Requires the additive `20261005_200000_design_settings` migration. It creates only the new global settings/override tables and indexes. Back up live data before deploying; do not import the local database or overwrite media. Empty settings are safe: the only new default visual changes are the requested light-section brand colors and the investment-logo styling. The migration deliberately retains editor-owned settings on rollback.
