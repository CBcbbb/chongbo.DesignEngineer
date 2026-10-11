# Nike Athlete Closet: confirmed facts

Source of truth for the rewrite. Wix copy (https://ningchongbo.wixsite.com/homepage/nike) is the baseline; anything not on Wix or below must be checked with Chongbo before it goes into copy.

## Confirmed by Chongbo (2026-10-10)

- **Role.** Intern at an advertising agency working for Nike. The only UI designer; designed all the UI. Use "designed", not "led".
- **Timing.** Designed in two months. The feature then rolled out gradually and ran across several seasons.
- **Motion.** Chongbo made the Lottie files himself. Everything in the case study shipped as designed except the like animation: the front-end engineers built a simplified version, a solid red heart in place of his gradient heart (visible in the recording at ~26 s).
- **Hardest decision: the horizontal feed.** The feature was originally vertical. He introduced horizontal page-flipping to save space, then had to solve the risk that people wouldn't know to swipe sideways: the layout visually suggests the story isn't finished, to pull people across. Nearly dropped it, kept it. Product tag placement caused no problems.
- **Pushback.** None, apart from the client's own colour requirements: the client's colours had to be used.
- **Star Voice Q&A.** Shipped in the app. Unknown whether it was his idea or in the brief, so copy must not claim either.
- **Name.** "Athletes Closet", as shipped in the app's lock-up ("NIKE ATHLETES CLOSET").
- **Team.** Nike's marketing team set the brief and concept. Chongbo designed all the UI, the guest posters, and did the retouching (Photoshop). The team also had a copywriter and a photographer. The engineers were Nike's. Chongbo didn't deal with the client directly.
- **Outcome.** The contract originally covered the first season. After it performed well, the client commissioned the following seasons. Source: his manager. No quotable client feedback exists; none will be written.
- **Motion handoff.** He handed the like animation over in Figma; unclear why it wasn't used.
- **Headline typing animation** (recording ~24–28 s): his design.
- **Before and after.** VOL.1–3 were designed by someone else; those are the "before" screens. He joined when VOL.4 was due and designed it and every later volume. All the redesign reasoning is already on Wix.
- **Lottie files.** Made at the time (he believes).
- **What he'd change now.** He'd deliver it himself (build it, using AI tools) rather than hand over a Figma file.
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

## Round 3 (2026-10-10)

- Volumes and seasons: don't state a count. Agency: not named. Say "Nike's app in China".
- Gift-box draw: no capture exists beyond the Lottie.
- **Keep originals.** Stills carry quality; the recording is lower quality and only carries interaction.
- Figma file: https://www.figma.com/design/CwoAjqS2BOOVfueNRTaMlY/Nike-UX-portfolio. Pages: "Page 1" (UI screens, LIKE-0…3 states, presentation frames, retouching, Star Voice) and "Creative System" (dated 6 Feb 2023: logo lock-up, typography, colour, graphic systems, motion, application examples).
- Designed like spec (Figma, LIKE-0…3): outline heart with an orange dot → pill extends to "点赞" → "点赞赢好礼" (like to win a gift) → tap: text changes to "256人已点赞", heart turns black, hearts float out.

### Not sources: AI-drafted text in the Figma file

Three text nodes (`12:3537`, `12:3538`, `14:3539`) are AI-written drafts (they end by offering Notion templates). They contradict confirmed facts and each other:
- durations of 6 weeks and 8 weeks (Wix and Chongbo: two months);
- "led", "main designer", "data-driven", "A/B testing";
- numbers: click-through 4.2% → 12.6%, draw participation 18% → 47%, time on page 42 s → 58 s, 3,400+ questions per episode, 73% audio play rate, delivery 30% faster.
None of these are used unless Chongbo confirms them as real. One detail to check: "answered in Nike's 618 livestream".

## Prototype (step 5)

- `docs/design/case-nike.html`, published as a private artifact. Assets are referenced as `assets/nike/…`; to view locally, symlink `docs/design/assets` → `../../public/assets` (not committed).
- `recording.mp4` is a 750 px, muted, H.264 encode of the full 50 s recording (7 MB). Chapters: lock-up 0:13, headline 0:19, views 0:22, tag 0:25, cards 0:26, like 0:28, Star Voice 0:42, ranking 0:48.
- Figma frames rendered at their natural size (1920×1080) and cropped: `system-text-frames.png`, `storytelling-feed.png` (slide titles masked), `poster-cards.jpg`. `like-states.png` is Chongbo's own export.
- `hero.jpg` stays in the repo as the Open Graph image; its title graphic says "Athlete Closet" and duplicates the page title, so it's off the page.

## Images (2026-10-10, v2)

- `public/assets/nike/` holds the Wix originals: the scraper strips Wix's resize parameters and downloads each file as uploaded. So `retouch-*.png` (334×500) and `ranking-*.png` (375 wide) are the sizes uploaded to Wix; anything larger would come from Chongbo's source files.
- The page now uses originals unresized: `product-card-*.png`, `guest-posters.png`, `product-tags-1/2.png` (the GIF's two frames, lossless), `star-voice-crop.jpg` (a crop of `star-voice-qa.png` at native resolution).

## Prototype v3 (2026-10-10, overnight)

- Orange cover, orange part openers (01 Read / 02 Shop / 03 Return / 04 Outcome) with huge numbers; black sheets for story and motion evidence and the outcome.
- New interactions: framing-device switcher (five configurations from the original Figma crops, keyboard arrows work); retouch compare slider on the orange field; product card compare on orange; Star Voice loop (Preview, Ask, Vote, Answered live).
- Checked: no image rendered off its native ratio or above its native size, at 1440 and 390, light and dark; no horizontal scroll.

## Built into the site (11 Oct 2026)

- `src/components/case/nike/`: `NikeCase.tsx` (server: layout and art direction), `NikeClient.tsx` (recording, seek, compare, switcher, swap, shoebox, contents), `nike.css` (scoped to `.nk`). The Wix-copy components (`Slideshow.tsx`, `LottiePlayer.tsx`) are gone; `fonts.ts` stays for WildEcho.
- Copy comes from `content/projects/nike.ts`, so printed sheets and the page use the same words.
- Changes from prototype v3: card heads split claim left / reasoning right (Granola); headings at weight 500; larger radii; grain backdrops; product card as a side-by-side pair (Chongbo's review); retouching keeps the slider; controls at least 44px, contents links 32px.
- Checks: lint, typecheck, 59 unit tests, build, 60 Playwright tests including axe on every route at 1440 and 390, no image off its native ratio, all Nike colour pairs ≥ 4.5:1 in both modes.
- Local builds need Google Fonts for WildEcho's `fonts.ts`, which this sandbox can't reach; I stubbed it locally for testing and restored it before committing.

## Round 4 (2026-10-11)

- **Outcome, in his words:** it went fully live in Nike's app across China, and because it went well, Nike renewed the contract with the agency. Shown on the cover after HHCD's pattern: "Launched nationwide. Nike renewed the contract for the following seasons."
- **No repetition.** He wants each thing said once: no lede and intro saying the same, no heading restated in the body, no outcome on the cover and again at the end.
- Layout: 01.1 with tabs down the left of the canvas (not text beside the evidence); wireframe inset at the canvas's top-right, overhanging it.
