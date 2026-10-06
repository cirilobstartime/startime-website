# New homepage media upload guide

These are the **current frontend frames**, not a generic website preset. Upload figures are 2× raster canvases except the extra-wide panorama image, which lists its practical 1× full-scene frame. They are derived from the public homepage at reference viewports: mobile **390×844**, tablet **768×1024**, laptop **1366×768**, desktop **1920×1080**, and large desktop/iMac **2560×1440** CSS px. The CMS now shows the screen, rendered frame, and upload size beside each field. Full-bleed hero, Impact slides, and section backgrounds use `cover`; prepare a composition for each screen to avoid losing the subject at a different aspect ratio. Other foreground card/logo art uses `contain` and may show space if its aspect differs. A change to copy, card count, or viewport height can change a section's height. Preview the target screen after upload.

Upload **one default image or video** when it is suitable everywhere. The five screen-specific fields are optional overrides only; an empty device field uses the default. A device override should be an already-edited composition with the subject in the intended place. The existing frontend card dimensions, section layout and animation do not change when media is selected. For cards that also expose a separate fallback photograph field, that field remains valid as the shared default.

| Home section / image role | Mobile | Tablet | Laptop | Desktop | Large desktop/iMac |
| --- | ---: | ---: | ---: | ---: | ---: |
| Opening scenes 1–3 | 780×1688 | 1536×2048 | 2732×1536 | 3840×2160 | 5120×2880 |
| Panoramic scene artwork (entire wide scene, 1×) | 6354×844 | 7709×1024 | 5782×768 | 8131×1080 | 10841×1440 |
| Optional panorama video (one visible screen, not the wide image) | 780×1688 | 1536×2048 | 2732×1536 | 3840×2160 | 5120×2880 |
| Value/statistics motif | 780×950 | 1536×950 | 2514×804 | 3520×832 | 3520×832 |
| Investment-domain icon source canvas, each | 452×408 | 452×408 | 452×408 | 452×408 | 452×408 |
| Portfolio card photograph, each | 700×424 | 1456×882 | 744×480 | 732×472 | 732×472 |
| Portfolio patterned area | 700×3080 | 1456×4172 | 2360×1080 | 2360×1398 | 2360×1398 |
| Project slide photograph, each | 700×600 | 1484×718 | 1308×1160 | 1830×1360 | 1830×1360 |
| Project logo artwork, each | 734×258 | 868×302 | 868×302 | 868×302 | 868×302 |
| Impact slide photograph, each | 700×1040 | 1456×1160 | 1468×1120 | 2060×1120 | 2060×1120 |
| Team section photograph | 780×1212 | 1536×1140 | 2732×1140 | 3840×1298 | 5120×1298 |
| Team decorative pattern | 780×1212 | 1536×1140 | 2732×1140 | 3840×1298 | 5120×1298 |
| Triple S optional image/video frame | 700×394 | 1456×820 | 2514×1414 | 2800×1576 | 2800×1576 |
| Triple S pattern inside that optional media frame | 700×394 | 1456×820 | 2514×1414 | 2800×1576 | 2800×1576 |
| Current single membership composite logo | 684×80 | 720×84 | 914×108 | 914×108 | 914×108 |
| Membership patterned strip | 780×408 | 1536×428 | 2732×448 | 3840×488 | 5120×488 |
| Each partner-marquee logo | 360×208 | 430×236 | 430×236 | 430×236 | 430×236 |
| News/insight card thumbnail | 700×700 | 464×402 | 816×550 | 1152×648 | 1152×648 |

The panorama **image** figures describe its entire animated artwork, not just one visible screen; the image is roughly 7.5 times as wide as it is tall. Its CMS labels deliberately give 1× frames because 2× files would be huge. The current optimized source is 7009×931 px and about 944 KB. The optional panorama **video** sits in a single-screen player and has different sizes. Use SVG for decorative patterns and icons where possible. The supplied investment-domain icons have a 226.43×203.97 SVG viewBox; their actual on-screen slot is 78×78 mobile/tablet, 86×86 laptop, and 102×102 desktop/iMac, with a deliberate 2.25× CSS zoom to compensate for built-in whitespace. A tightly cropped replacement may clip. Transparent logos should have minimal built-in whitespace. The one-logo membership dimensions above are for the current UFI/IAEE composite; separate multiple marks preserve their individual ratios and can render smaller. The iMac news and portfolio cards are width-capped, so they reuse the desktop-sized asset.

The supplied news artwork at 641×641 mobile, 741×641 tablet, 863×581 laptop, and 1921×1080 desktop also remains usable: its ratios match, or closely match, the current card frames. The separate full-width article feature image is not a homepage thumbnail.

The 11 approved Impact pairs supplied on 29 September are **701×1041 px mobile portrait** and **1549×1121 px landscape**. They are saved in the local media library as one Default plus one Mobile override per impact entry in both languages. The other four device slots can remain empty and inherit Default. The wider-screen source is smaller than the recommended 2× desktop canvas in the table but is the supplied original; it is not upscaled. Impact imagery now fills its frame edge-to-edge with `cover`. Because its frame ratio changes by viewport, a mismatched source is cropped rather than leaving white bands; add a separate screen composition in the CMS if important artwork is clipped.

Optional **whole-section backgrounds** are separate from foreground images and card photos. These are their 2× reference canvases; each is explicitly labelled in its CMS block:

| Home section background | Mobile | Tablet | Laptop | Desktop | Large desktop/iMac |
| --- | ---: | ---: | ---: | ---: | ---: |
| Value/statistics section | 780×2508 | 1536×2088 | 2732×1876 | 3840×2432 | 5120×2432 |
| Investment-domains section | 780×3592 | 1536×2454 | 2732×2110 | 3840×2386 | 5120×2386 |
| Portfolios section | 780×4124 | 1536×5144 | 2732×2122 | 3840×2806 | 5120×2806 |
| Projects section | 780×3110 | 1536×2652 | 2732×2290 | 3840×2878 | 5120×2878 |
| Impact section | 780×1712 | 1536×1780 | 2732×1504 | 3840×1600 | 5120×1600 |
| Team section | 780×1212 | 1536×1140 | 2732×1140 | 3840×1298 | 5120×1298 |
| Triple S section | 780×1112 | 1536×932 | 2732×982 | 3840×1286 | 5120×1286 |
| Membership strip | 780×408 | 1536×428 | 2732×448 | 3840×488 | 5120×488 |
| Partnerships section | 780×1394 | 1536×1256 | 2732×1346 | 3840×1812 | 5120×1812 |
| News section | 780×2318 | 1536×2118 | 2732×2040 | 3840×2522 | 5120×2522 |
| Panoramic scroll wrapper | 780×8440 | 1536×10240 | 2732×7680 | 3840×10800 | 5120×14400 |

Do not upload a giant raster simply to fill a long scroll wrapper. Use the dedicated panorama artwork or an SVG/pattern for the wrapper. Optional full-section backgrounds use `cover`, so artwork with a different proportion will crop rather than leave empty bands. These recommendations are accurate at the stated reference viewports, not a guarantee for every phone, tablet, laptop, or iMac model.
