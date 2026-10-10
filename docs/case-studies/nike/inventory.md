# Nike Athletes Closet: card inventory (draft for approval)

Playbook §8 step 3. Headings are working claims, to be finished in step 4. Every claim traces to the Wix page or to `notes.md`.

Capabilities: A web and brand storytelling · B idea to production · C systems and reuse · D craft and interaction.

## Cards, in canonical order

Three parts follow the cover line: read, shop, return. Copy is in `copy.md`.

| # | id | Heading (the claim) | Caps | ux | engineer | web | Evidence |
|---|---|---|---|---|---|---|---|
| — | cover | Influencer stories in Nike's app, designed to be read, shopped and returned to | A D | | | | `hero.jpg` still; the recording plays from it |
| 01·1 | system | Redesigning the creative system first | A C | in | in | lead | Figma Graphic System frames |
| 01·2 | style | A unified visual style and tone | A | | | in | Poster Cards + one retouch pair |
| 01·3 | views | Several views of one outfit, swiped sideways | D A | in | in | in | Figma Storytelling Feed + recording clip |
| 01·4 | components | Reusable components, built for handover | C | in | in | | Figma component export |
| 02·1 | tags | Shop the look, straight from the photo | A D | lead | | in | Product-tags stills + recording clip |
| 02·2 | product-card | Larger product cards | A | in | | in | Compare slider |
| 02·3 | ranking | A ranking that leads to similar outfits | A | | | in | Ranking before/after |
| 03·1 | draw | A reward for every like | D | in | lead | in | `gift-box.lottie.json` |
| 03·2 | star-voice | Star Voice Q&A: ask now, answered live | A D | in | in | in | `star-voice-qa.png` crop + `star-voice-qa-mobile.png` + clip |
| — | outcome | One season became several | A | in | in | in | Role line; full recording link |
| — | handoff | What I'd do now: take motion from idea to production myself | D B | in | in | | Figma LIKE-0…3 + recording ~26 s |

**Signature module (proposal):** the recording as a chaptered phone, with chapter marks that jump to the moment each card describes. Needs a new "chaptered video" block, to propose in `SHARED-CHANGES.md` at step 5.

## Image inventory

Principle (Chongbo, 2026-10-10): **stills carry visual quality, the recording carries interaction.** The recording is lower quality, so it never replaces a high-quality original; it plays where motion is the point. Keep originals wherever they exist.

| Asset | Decision | Reason |
|---|---|---|
| `RPReplay_Final1684401719.MP4` (on Mac, 100.9 MB) | **Keep** → short clips where interaction is the point (tags, swipe, headline typing, like, Star Voice), MP4 H.264 + poster frames; full recording linked | The shipped thing in use. Never commit the original. |
| `hero.jpg` | **Keep** as the cover still; the recording plays from it on demand | High quality; the recording isn't. |
| `product-card-before/after.png` | **Keep**, re-crop to 4:5 | The clearest before/after; the compare slider. |
| `product-tags.gif` | **Keep the content, change the format**: it has only 2 frames, so show it as a still pair or a short MP4 | Playbook: no GIFs. |
| `gift-box.lottie.json` | **Keep** | Shoebox draw (layers: lid, base, shoe). No capture of it live exists. |
| `like-to-draw.lottie.json` | **Keep** | The designed like, for card 10. |
| Figma "LIKE-0…3" states (node `55:356` area) | **Add** | The designed spec: outline heart → "点赞赢好礼" pill → black heart, count, floating hearts. Proof for card 10. |
| `feed-before/after.png` | **Redraw** as a diagram, keep the originals as reference | 160 px wide; too small to judge. Figma has a "Storytelling Feed" frame (`79:7409`) to check first. |
| `gs-*.png` (10 crops) | **Replace** with full-resolution Figma exports of the Graphic System frames | Same content, higher quality, one sheet per point. |
| `guest-posters.png` | **Keep**, or the Figma "Poster Cards" frame (`74:4671`) at 2× | Proves one system across guests. |
| `star-voice-qa.png` | **Keep** one crop of the annotated flow | 7212 px wide; one point per image. |
| `star-voice-qa-mobile.png` | **Keep** | High quality, and its dark screens sit well in dark mode. |
| `ranking-before/after.png` | **Keep at detail size (1:1)**, or Figma "RANK LIST OP2" at 2× | Only 375 px wide. |
| `retouch-*.png` (4) | **Keep one pair**, from the Figma source images | The Wix files are 334×500; Figma holds the source images. |
| `swoosh.png` | **Recommend cut** (Chongbo to decide) | Nike's mark as decoration on my page; the screenshots already carry the brand. |

**Export route.** This workspace can't download from figma.com, and Figma screenshots stop at the node's own size. High-resolution assets need exporting from Figma (2×, PNG) into a connected folder on the Mac.

## Gaps

1. ~~Volumes and seasons~~ — not stated. Copy says "several seasons" (Wix homepage).
2. ~~Agency name~~ — not named: "an advertising agency".
3. ~~China~~ — yes: "Nike's app in China". Captions translate the Chinese UI.
4. ~~Gift-box capture~~ — none exists. The Lottie is the evidence; copy states it shipped.
5. Figma: https://www.figma.com/design/CwoAjqS2BOOVfueNRTaMlY/Nike-UX-portfolio — pages "Page 1" and "Creative System". [Who made the Creative System deck?] [Are the numbers in the Figma text notes real?] (see notes.md)
6. Retouching originals: in Figma; need exporting.
