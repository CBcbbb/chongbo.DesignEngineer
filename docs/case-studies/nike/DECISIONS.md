# Nike: open decisions (for Chongbo, 11 Oct 2026)

The case file is built into the site from the approved v3 prototype, with your two changes: the product card is now a side-by-side comparison, and only the retouching keeps the slider. Below is everything I decided on your behalf overnight. Each line says what I chose; change any of them and I'll update the page.

## Content

1. **Cover image for the work list, the home tray and the social card.** I used the last frame of your shoebox animation (`public/assets/nike/print/cover.jpg`), not the old Wix hero, whose title graphic says "Athlete Closet". Alternative: the six poster cards.
2. **Context line on cards:** "Nike App, China · UI design internship at an advertising agency". It appears on the work list and printed sheets.
3. **Stack:** "Figma, Lottie". I left Photoshop out because you said "I think" for the retouching tool.
4. **"Nike's 618 livestream"** in the Star Voice caption comes from the screen itself (有机会在618 NIKE直播间获得回答). Keep it, or say "Nike's livestream" only?
5. ~~**Tags on each card**~~ Removed in 21 below.

## Images

6. **Small originals.** The retouching pair (334 × 500) and the Star Ranking pair (375 px wide) are the sizes uploaded to Wix; nothing larger is in the repo. Export 2× versions from Figma (Retouching frame, RANK LIST OP2) and drop them in `public/assets/nike/` under the same names.
7. **Image quality.** Images go through Next's optimiser at its default quality (75, AVIF/WebP). If text in the screenshots looks soft, adding `qualities: [75, 90]` to `next.config.ts` (a shared file) would let these use 90.
8. **Printed-sheet images** (`public/assets/nike/print/`): each original is placed whole on a black mount at the sheet's ratio, so the printer never crops or stretches your work.
9. **The recording** (7 MB, 750 px wide, muted) lives in the repo; the full-quality file stays on your Mac and on YouTube.

## Shared files (proposed, not changed)

10. `docs/case-studies/SHARED-CHANGES.md` has the layout proposal (contents on the left, sheets, colour roles, card types) and new blocks (chaptered video, swap, Lottie). Nothing in `src/app`, `src/lib`, `content/schema.ts` or the tokens was edited.
11. **Card ids changed** for the AI pipeline's eval set: `brief`, `imagery` and `delight` are gone; `style`, `views`, `components`, `tags`, `ranking`, `draw` and `handoff` are new. `graphic-system`, `retouching`, `product-card`, `star-voice` and `outcome` are kept, so every id `src/lib/ask` names still exists.

## Changes after your review (11 Oct, morning)

13. **One card, one screen.** On tablets and computers every card is the same height and fits the window; images scale into the space and keep their ratio. Phones scroll as before.
14. **Retouching is its own card (01.3, "Retouched to one tone")**, with both pairs as sliders. The posters card is now "A unified visual style". Both headings are new: change them if you'd put it differently.
15. **Captions under images are gone.** Labels inside the evidence stay (Before/After, layer names, Specified/Shipped).
16. **Wireframe:** shown as an inset on the final screens; pressing it swaps them. The wireframe now has its white background.
17. **The recording** sits uncropped in a device frame. "VOL.4" is gone from the recording line and the product-card labels; after the late-morning round it appears once on the page, in 01.1, where it says when you joined.

## Changes after your review (11 Oct, late morning): one thing said once

18. **Cover.** The intro paragraph is gone; the line under the title says what the feature is, and three facts say the rest: Role, Team, Outcome (after HHCD's cover). Full text in `copy.md` (draft 8).
19. **Outcome wording:** "Launched nationwide. Nike renewed the contract for the following seasons." I wrote "Launched" because the feature ran over several seasons; if it's still running today, "Live nationwide" is the HHCD-style alternative. Your call.
20. **The closing outcome card is gone**, because the cover now says the same thing. Part 04 is "Reflection", with one card (What I'd do now). The printer's outcome sheet links to the cover's Outcome line.
21. **Card labels:** index only. The kind labels and capability pills repeated the evidence ("Before and after"), the heading ("Visual style") or each other ("Design system" + "Design systems"). The cover chips still map the three capabilities.
22. **Copy:** every body sentence that restated its heading is cut or rewritten (full list in `copy.md`). One heading changed: 02.2 is now "Products as part of the story" (was "Larger product cards", which the body then repeated). Star Voice's four-step loop (Preview, Ask, Vote, Answered live) is gone: the heading and body already say it.
23. **Recording:** heading "Screen recording"; the YouTube link sits under it (it was on the outcome card).
24. **Layout:** 01.1 is back to text on top and the tabs down the left of the canvas. The label-to-heading gap is fixed (a reset was zeroing it). The wireframe inset is pinned to the canvas's top-right corner and overhangs it. 02.2's phone screens are larger (tighter field, no width cap): about 274 × 538 px at 1440 × 900, the most a card one screen tall allows for two full phones side by side.

## Images: originals needed

Measured at 1440 × 900 on a 2× screen: a file needs to be twice its display width to look sharp.

| Card | File (in `public/assets/nike/`) | Now | Shown at | Please export |
|---|---|---|---|---|
| 01.3 Retouching | `retouch-1-original.png`, `retouch-1-after.png`, `retouch-2-original.png`, `retouch-2-after.png` | 334 × 500 (from Wix) | 313 × 470 | The four photos from your Photoshop files or the Figma "Retouching" frame, at least 1000 px wide. Same crop for each original/retouched pair. |
| 02.3 Star Ranking | `ranking-before.png`, `ranking-after.png` | 375 px wide | 188 px | The old list and RANK LIST OP2 from Figma at 3×. |
| 01.1 Framing device | `gs-logo-lockup.png`, `gs-header-one-line.png`, `gs-key-message.png`, `gs-text-simplified.png`, `gs-image-text-combo.png` | about 500 px wide (sharp, but they can only be shown small) | 253 px | The five configurations from the "Creative System" page at 4×, so they can fill the canvas. |

Drop them in under the same names and I'll update the sizes. Until then these eleven are served as they are (no recompression), which is the best the current files can look. Everything else on the page is at least twice its display size.

25. **Recompression.** The site's image optimiser saves at quality 75, which can soften text in screenshots. Raising it needs a one-line change to `next.config.ts` (shared, proposed in `SHARED-CHANGES.md`).

## Process

12. **Going live.** You said it can go live once done, so after the tests passed I rebased onto `main` and merged. To undo: revert the merge commit on `main`.
