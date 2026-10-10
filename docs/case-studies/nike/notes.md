# Nike Athlete Closet: confirmed facts

Source of truth for the rewrite. Wix copy (https://ningchongbo.wixsite.com/homepage/nike) is the baseline; anything not on Wix or below must be checked with Chongbo before it goes into copy.

## Confirmed by Chongbo (2026-10-10)

- **Role.** Intern at an advertising agency working for Nike. The only UI designer; designed all the UI. Use "designed", not "led".
- **Timing.** Designed in two months. The feature then rolled out gradually and ran across several seasons.
- **Motion.** Chongbo made the Lottie files himself. Everything in the case study shipped as designed except the like animation: the front-end engineers built a simplified version, a solid red heart in place of his gradient heart (visible in the recording at ~26 s).
- **Hardest decision: the horizontal feed.** The feature was originally vertical. He introduced horizontal page-flipping to save space, then had to solve the risk that people wouldn't know to swipe sideways: the layout visually suggests the story isn't finished, to pull people across. Nearly dropped it, kept it. Product tag placement caused no problems.
- **Pushback.** None, apart from the client's own colour requirements: the client's colours had to be used.
- **Star Voice Q&A.** Shipped in the app. Unknown whether it was his idea or in the brief, so copy must not claim either.
- **Name.** Chongbo said the Wix homepage's "Athlete Closet" is right, but the shipped lock-up in the recording reads "NIKE ATHLETES CLOSET". Re-confirming.
- **Recording.** The YouTube Short (https://www.youtube.com/shorts/4cFA1T_9m8w) is the full recording. Original: `RPReplay_Final1684401719.MP4`, 100.9 MB, 50 s, 828×1792, 60 fps, H.264 + AAC (from "CB's Projects/Nike video" on his Mac).

## What the recording shows (approx. timestamps)

- 0–4 s: entry from the app's Explore tab.
- 4–10 s: full-screen story pages, VOL.4, guest "鬼鬼".
- 12–20 s: cover with the vertical "NIKE ATHLETES CLOSET" lock-up; chapter tabs (封面 / 第一套 / 第二套 / 第三套 / #星推官 / 星问答 / 星排榜).
- 20–24 s: product tag on a photo ("Zoom Vomero 5"); product card carousel with the next card cut off at the edge.
- 24–28 s: headline frame typing in ("02 民族特色碰撞新灵感"); like with the simplified red heart.
- 30–36 s: more product cards and tags ("Dunk").
- 36–48 s: #星推官 guest teaser; Star Voice Q&A (星问答) with voice waveform and voted questions.
- 48–50 s: Star Ranking (星排榜).
- Not visible: the gift-box prize draw.

## Cut

- "Data-informed iteration" and "user behaviour insights": no data to back them.
- `nike.ts` additions not on Wix: "each season's stories could change without a redesign", "a new season only needs new pictures, not new layouts", and attributing the Star Voice recommendation to "the client".

## Open

- Who designed the "before" screens.
- Interview questions in progress (playbook §8 step 2).
- Slug `nike-athletes-closet` is referenced in shared files (`src/lib/ask/*`, `src/lib/site.ts`, tests). Title changes in `nike.ts`; any slug change goes through `SHARED-CHANGES.md`.
