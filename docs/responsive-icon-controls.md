# Responsive icon controls

Website chrome → **Icon dimensions** controls shared English/Arabic public-site icon sizes. Tabs cover content artwork, action arrows, carousel symbols, social/contact icons, the menu control, and form icons. Width and height are rendered CSS pixels, not media upload dimensions.

Screens: mobile ≤640px; tablet 641–1023px; laptop 1024–1599px; desktop 1600–1999px; large/iMac ≥2000px. Each screen and axis is independent. Blank retains the approved CSS size. No image/media uploads are changed.

Main-page sections have **Advanced visual controls → Icon dimensions by screen**. Cards/slides with item styling have the same controls under **This item only**. An item override wins over its section, then the site-wide group setting, then the existing design. Logos, background images, patterns, and roadmap progress rings are intentionally excluded.

The homepage opening has editable Discover More text, destination, text/border colors, and visibility. The heading itself is no longer linked. Scene two has a separate editable presentation-skip label and visibility. It jumps instantly past the hero and panorama to the next rendered section, resolving current section visibility/order rather than a fixed scroll distance. The panorama's own skip label/link/visibility remain in CMS.

## Future release

This change is currently local only. The additive `20261005_180000_icon_settings` migration creates the new global settings table without editing existing CMS content. Follow the normal backup/release procedure; never copy local databases or uploads over live data.

The local homepage content update was applied with `scripts/configure-local-presentation.ts`, which is explicitly restricted to the local database. On an approved live release, change **only** the relevant current homepage opening button fields and panorama `showSkip` setting in each locale. Do not import entire local sections: production may contain newer editor changes.
