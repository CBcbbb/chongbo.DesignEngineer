# Nike Athletes Closet: card inventory (draft for approval)

Playbook §8 step 3. Headings are working claims, to be finished in step 4. Every claim traces to the Wix page or to `notes.md`.

Capabilities: A web and brand storytelling · B idea to production · C systems and reuse · D craft and interaction.

## Cards, in canonical order

| # | id | Heading (the claim) | Caps | ux | engineer | web | Evidence | Gaps |
|---|---|---|---|---|---|---|---|---|
| — | cover | Nike Athletes Closet: the stories people read, made shoppable | A D | | | | `hero.jpg` still; the recording plays from it on demand; role and outcome line | |
| 1 | problem | People read the stories but rarely tapped through to the products | A | lead | | in | Recording frame: story page with no route to product (or the VOL.1–3 "before" card) | |
| 2 | tags | Tags on the photos turn the story into the shop | A D | in | | lead | Recording clip ~20–24 s (tag on photo) | |
| 3 | product-card | Bigger products, so the story sells them | A | in | | in | Compare slider: `product-card-before/after` | |
| 4 | feed | Sideways pages saved space, so I had to show there was more | D A | in | in | in | Redrawn diagram (vertical scroll vs pages with a peek) + recording clip of the swipe | |
| 5 | system | One frame carries every guest's headline | C A D | in | in | in | Redrawn component sheet + recording clip ~24–28 s (headline typing in) | [Figma file for 2× exports] |
| 6 | guests | Each guest gets the same system and their own poster | A C | | | in | `guest-posters.png` | |
| 7 | draw | A like opens a shoebox | D | in | lead | in | `gift-box.lottie.json`, playable in place | [any capture of it live] |
| 8 | star-voice | Questions keep people coming back between guests | A D | in | in | in | Recording clip ~36–48 s + one crop of `star-voice-qa.png` | |
| 9 | ranking | The ranking leads to similar outfits | A | | | in | `ranking-before/after` at detail size, or a recording frame ~48–50 s | |
| 10 | handoff | The heart shipped flat. Today I'd build it myself | D B | in | in | | Designed (Figma LIKE-0…3 spec + `like-to-draw.lottie.json`) beside shipped (recording ~26 s) | |
| 11 | outcome | One season became several | A | in | in | in | Shipped, ran across several seasons, contract renewed after the first; link to the full recording | |
| — | retouching (optional) | Retouching that matches the brand's flash look | A | | | | One pair of `retouch-*` | [larger originals, else cut] |

The role line sits in the outcome block, not in a card: intern at an advertising agency, working on Nike's app in China, the only UI designer, every screen from VOL.4 on, plus the motion, guest posters and retouching. Nike's marketing team set the brief; Nike's engineers built it.

**Turn in the story:** card 4 (the feed) is the decision with a real risk and a fix. Card 10 is the honest one: what shipped differently and what I'd change.

**Signature module (proposal):** the recording as a chaptered phone. A phone frame plays the real recording; chapter marks ("Tags", "Headline", "Like", "Star Voice", "Ranking") jump to the moment each card talks about, and each card's clip links back to it. It needs a new "chaptered video" block, to propose in `SHARED-CHANGES.md` at step 5.

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
