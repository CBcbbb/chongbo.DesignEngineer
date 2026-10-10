# Nike Athletes Closet: card inventory (draft for approval)

Playbook §8 step 3. Headings are working claims, to be finished in step 4. Every claim traces to the Wix page or to `notes.md`.

Capabilities: A web and brand storytelling · B idea to production · C systems and reuse · D craft and interaction.

## Cards, in canonical order

| # | id | Heading (the claim) | Caps | ux | engineer | web | Evidence | Gaps |
|---|---|---|---|---|---|---|---|---|
| — | cover | Nike Athletes Closet: the stories people read, made shoppable | A D | | | | Recording loop (phone, 9:16) + role and outcome line | [volumes designed] |
| 1 | problem | People read the stories but rarely tapped through to the products | A | lead | | in | Recording frame: story page with no route to product (or the VOL.1–3 "before" card) | |
| 2 | tags | Tags on the photos turn the story into the shop | A D | in | | lead | Recording clip ~20–24 s (tag on photo) | |
| 3 | product-card | Bigger products, so the story sells them | A | in | | in | Compare slider: `product-card-before/after` | |
| 4 | feed | Sideways pages saved space, so I had to show there was more | D A | in | in | in | Redrawn diagram (vertical scroll vs pages with a peek) + recording clip of the swipe | |
| 5 | system | One frame carries every guest's headline | C A D | in | in | in | Redrawn component sheet + recording clip ~24–28 s (headline typing in) | [Figma file for 2× exports] |
| 6 | guests | Each guest gets the same system and their own poster | A C | | | in | `guest-posters.png` | |
| 7 | draw | A like opens a shoebox | D | in | lead | in | `gift-box.lottie.json`, playable in place | [any capture of it live] |
| 8 | star-voice | Questions keep people coming back between guests | A D | in | in | in | Recording clip ~36–48 s + one crop of `star-voice-qa.png` | |
| 9 | ranking | The ranking leads to similar outfits | A | | | in | `ranking-before/after` at detail size, or a recording frame ~48–50 s | |
| 10 | handoff | The heart shipped flat. Today I'd build it myself | D B | in | in | | Designed (`like-to-draw.lottie.json`) beside shipped (recording ~26 s) | |
| 11 | outcome | One season became several | A | in | in | in | Metric strip: seasons / volumes, shipped; link to full recording | [volumes designed] [seasons run] |
| — | retouching (optional) | Retouching that matches the brand's flash look | A | | | | One pair of `retouch-*` | [larger originals, else cut] |

The role line sits in the outcome block, not in a card: intern at an advertising agency, the only UI designer, every screen from VOL.4 on, plus the motion, guest posters and retouching. Nike's marketing team set the brief; Nike's engineers built it.

**Turn in the story:** card 4 (the feed) is the decision with a real risk and a fix. Card 10 is the honest one: what shipped differently and what I'd change.

**Signature module (proposal):** the recording as a chaptered phone. A phone frame plays the real recording; chapter marks ("Tags", "Headline", "Like", "Star Voice", "Ranking") jump to the moment each card talks about, and each card's clip links back to it. It needs a new "chaptered video" block, to propose in `SHARED-CHANGES.md` at step 5.

## Image inventory

| Asset | Decision | Reason |
|---|---|---|
| `RPReplay_Final1684401719.MP4` (on Mac, 100.9 MB) | **Keep** → cover loop + one clip per card, MP4 H.264 + poster frames | The shipped thing in use: highest-value evidence. Never commit the original. |
| `hero.jpg` | **Cut** from page; keep as Open Graph image only | The recording replaces it as cover. |
| `product-card-before/after.png` | **Keep**, re-crop to 4:5 | The clearest before/after; the compare slider. |
| `product-tags.gif` | **Cut** | GIF; the recording shows the same thing live. |
| `gift-box.lottie.json` | **Keep** | Shoebox draw (layers: lid, base, shoe). |
| `like-to-draw.lottie.json` | **Keep** | The designed heart, for card 10. |
| `feed-before/after.png` | **Redraw** as a diagram | Wireframes at 160 px and 900 px; too rough and small. |
| `gs-*.png` (10 crops) | **Redraw** into one component sheet, 16:10 | Scattered crops; one sheet shows the system at a glance. |
| `guest-posters.png` | **Keep**, re-crop | Proves one system across guests. |
| `star-voice-qa.png` | **Keep** one crop of the annotated flow | 7212 px wide; one point per image. |
| `star-voice-qa-mobile.png` | **Cut** | The recording shows the same screen in use. |
| `ranking-before/after.png` | **Keep at detail size (1:1)**, or cut with card 9 | Only 375 px wide. |
| `retouch-*.png` (4) | **Cut**, unless larger originals exist | 334 px wide: too small to judge. |
| `swoosh.png` | **Cut** | Decorative use of Nike's mark; adds nothing. |

## Gaps

1. [Which volumes I designed: VOL.4 to VOL.?, and how many seasons the feature ran.]
2. [Agency name, or keep "an advertising agency".]
3. [Say it's Nike's app in China?] The recording's UI is Chinese, so captions need English translations either way.
4. [Gift-box draw: shipped (stated) but not in the recording. Any other capture?]
5. [Figma file, for high-resolution component exports and the designed heart.]
6. [Larger retouching originals, if the retouching card stays.]
