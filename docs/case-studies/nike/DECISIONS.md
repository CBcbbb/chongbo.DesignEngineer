# Nike: open decisions (for Chongbo, 11 Oct 2026)

The case file is built into the site from the approved v3 prototype, with your two changes: the product card is now a side-by-side comparison, and only the retouching keeps the slider. Below is everything I decided on your behalf overnight. Each line says what I chose; change any of them and I'll update the page.

## Content

1. **Cover image for the work list, the home tray and the social card.** I used the last frame of your shoebox animation (`public/assets/nike/print/cover.jpg`), not the old Wix hero, whose title graphic says "Athlete Closet". Alternative: the six poster cards.
2. **Context line on cards:** "Nike App, China · UI design internship at an advertising agency". It appears on the work list and printed sheets.
3. **Stack:** "Figma, Lottie". I left Photoshop out because you said "I think" for the retouching tool.
4. **"Nike's 618 livestream"** in the Star Voice caption comes from the screen itself (有机会在618 NIKE直播间获得回答). Keep it, or say "Nike's livestream" only?
5. **Tags on each card** show the first two capability tags from the content file, so they match what the printer prints.

## Images

6. **Small originals.** The retouching pair (334 × 500) and the Star Ranking pair (375 px wide) are the sizes uploaded to Wix; nothing larger is in the repo. Export 2× versions from Figma (Retouching frame, RANK LIST OP2) and drop them in `public/assets/nike/` under the same names.
7. **Image quality.** Images go through Next's optimiser at its default quality (75, AVIF/WebP). If text in the screenshots looks soft, adding `qualities: [75, 90]` to `next.config.ts` (a shared file) would let these use 90.
8. **Printed-sheet images** (`public/assets/nike/print/`): each original is placed whole on a black mount at the sheet's ratio, so the printer never crops or stretches your work.
9. **The recording** (7 MB, 750 px wide, muted) lives in the repo; the full-quality file stays on your Mac and on YouTube.

## Shared files (proposed, not changed)

10. `docs/case-studies/SHARED-CHANGES.md` has the layout proposal (contents on the left, sheets, colour roles, card types) and new blocks (chaptered video, swap, Lottie). Nothing in `src/app`, `src/lib`, `content/schema.ts` or the tokens was edited.
11. **Card ids changed** for the AI pipeline's eval set: `brief`, `imagery`, `delight` and `retouching` are gone; `style`, `views`, `components`, `tags`, `ranking`, `draw` and `handoff` are new. `graphic-system`, `product-card`, `star-voice` and `outcome` are kept, so every id `src/lib/ask` names still exists.

## Process

12. **Going live.** You said it can go live once done, so after the tests passed I rebased onto `main` and merged. To undo: revert the merge commit on `main`.
