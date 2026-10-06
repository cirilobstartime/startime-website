# Main Discover page media upload guide

These dimensions come from the current main `/en/discover` layout at **390×844 mobile**, **768×1024 tablet**, **1366×768 laptop**, **1920×1080 desktop**, and **2560×1440 iMac/large desktop** reference viewports. They are 2× source canvases; the CMS shows each reference screen, rendered frame, and recommended upload size beside its field. Full-bleed hero, methodology, governance, contact, and optional background images use `cover`; prepare screen-specific compositions so important content stays visible. The CEO cutout portrait uses `contain` and is anchored at the bottom so the head stays visible. Arabic has the same media frames in mirrored RTL layout. A device with a different viewport height or edited copy can change the actual section height.

For each image, pattern, video and film poster, the CMS provides **one default upload for all devices** plus five optional screen-specific overrides. Upload the file once when one composition works everywhere. An empty screen slot uses the default—not another screen's crop. The approved frontend layout, scroll effects and `cover`/`contain` behavior are unchanged.

| Visible image or video role | Mobile | Tablet | Laptop | Desktop | iMac/large desktop |
| --- | ---: | ---: | ---: | ---: | ---: |
| Hero photograph | 780×1384 | 1536×1440 | 2732×1320 | 3840×1680 | 5120×1680 |
| Hero decorative motif | 936×668 | 1844×1316 | 1640×1170 | 1800×1286 | 1800×1286 |
| Introduction corner motif | 358×256 | 706×504 | 1256×898 | 1360×972 | 1360×972 |
| Timeline film and uploaded-video poster | 700×394 | 1456×820 | 932×522 | 2996×1684 | 2996×1684 |
| CEO portrait | 776×776 | 1528×856 | 1360×1074 | 1752×1116 | 1752×1116 |
| CEO whole-section pattern | 780×1936 | 1536×1612 | 2732×1080 | 3840×1120 | 5120×1120 |
| Methodology photograph | 696×656 | 1448×776 | 1218×1114 | 1706×1308 | 1706×1308 |
| Governance background / each principle's background | 780×1490 | 1536×1400 | 2732×1390 | 3840×1924 | 5120×1924 |
| Governance pattern | 780×1490 | 1536×1400 | 2732×1390 | 3840×1924 | 5120×1924 |
| Contact-area photograph | Not displayed | Not displayed | 842×1206 | 994×1206 | 994×1206 |

For the Discover hero specifically, the **iMac/large slot begins at 2000 CSS px**. The 2560×1440 reference renders a 2560×840 frame (5120×1680 recommended 2× upload), while a 3440×1440 ultra-wide display renders a 3440×840 frame (6880×1680 at 2×). Both screens select the *same* iMac/large upload, so one composition cannot exactly match both aspect ratios. Keep the subject in their shared central area and preview both widths. The current 2880×1540 upload is much taller than the 2560×840 frame, so `cover` crops its top and bottom; this is image composition, not a missing upload or a layout defect. The 1600×900 desktop frame is 1600×774 (3200×1548 at 2×), while the 1920×1080 desktop reference remains 1920×840.

The approved main Discover Vision section is text-only: there is **no foreground photo upload field** for it. It still has an optional whole-section background field. The contact photo is hidden on mobile and tablet in the current design, so uploading narrow-screen alternatives cannot make it visible there. Decorative motifs should ideally remain SVG. An uploaded video poster is used with uploaded MP4/WebM, not a YouTube embed.

Optional whole-section backgrounds and background videos use these distinct frame canvases (not the foreground media sizes):

| Discover section backdrop | Mobile | Tablet | Laptop | Desktop | iMac/large desktop |
| --- | ---: | ---: | ---: | ---: | ---: |
| Hero | 780×1384 | 1536×1440 | 2732×1320 | 3840×1680 | 5120×1680 |
| Introduction | 780×1088 | 1536×898 | 2732×872 | 3520×1044 | 3520×1044 |
| Animated timeline scroll wrapper | 780×5740 | 1536×6964 | 2732×5222 | 3840×3650 | 5120×3734 |
| Vision | 780×858 | 1536×602 | 2732×538 | 3520×912 | 3520×912 |
| CEO | 780×1936 | 1536×1612 | 2732×1080 | 3840×1120 | 5120×1120 |
| Methodology | 700×1736 | 1456×1432 | 2514×1120 | 3520×1314 | 3520×1314 |
| Governance | 780×1490 | 1536×1400 | 2732×1390 | 3840×1924 | 5120×1924 |
| Contact/form | 780×1962 | 1536×1900 | 2732×1754 | 3840×1954 | 5120×1954 |

The timeline film is much smaller than its animated scroll wrapper; use the film fields for the video and poster. Do not create a huge raster for a long scroll section just because its optional backdrop canvas is listed here. The timeline film itself uses `contain` to remain uncropped; full-bleed section backgrounds use `cover` and will crop when their aspect ratio differs. Preview the target screen before approval.
