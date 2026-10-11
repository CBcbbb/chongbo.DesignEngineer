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

18. **Cover.** The intro paragraph is gone; the line under the title says what the feature is, and two facts follow (after HHCD's cover): Role "UI Designer"; Outcome "Launched nationwide as a home-screen section of the official Nike App. Nike renewed the contract for the following seasons." The kicker is "Nike China". Team is off the cover (your call, 11:23); the brief and build credits stay on the printed outcome sheet. Full text in `copy.md` (draft 8).
19. **"Launched"** stays: the section is no longer in the app (you confirmed).
20. ~~The closing outcome card is gone~~: back, see 29.
21. **Card labels:** index only. The kind labels and capability pills repeated the evidence ("Before and after"), the heading ("Visual style") or each other ("Design system" + "Design systems"). The cover chips still map the three capabilities.
22. **Copy:** every body sentence that restated its heading is cut or rewritten (full list in `copy.md`). One heading changed: 02.2 is now "Products as part of the story" (was "Larger product cards", which the body then repeated). Star Voice's four-step loop (Preview, Ask, Vote, Answered live) is gone: the heading and body already say it.
23. **Recording:** heading "Screen recording"; the YouTube link sits under it (it was on the outcome card).
24. **Layout:** 01.1 is back to text on top and the tabs down the left of the canvas. The label-to-heading gap is fixed (a reset was zeroing it). The wireframe inset is pinned to the canvas's top-right corner and overhangs it. 02.2's phone screens are larger (tighter field, no width cap): about 274 × 538 px at 1440 × 900, the most a card one screen tall allows for two full phones side by side.

## Changes after your review (11 Oct, midday)

26. **Originals in.** From your "high-quality photos" folder: the five framing devices (3–4×), the three imagery templates and the poster card (3×), both rankings (3×), the four retouching photos (1332 × 2000, saved as quality-92 JPEG) and the Star Voice screen. Every image on the page is now at least twice its display size. The original retouching photos were 4 px wider than the retouched ones; I trimmed 2 px from each side so the slider lines up.
27. **Image quality 90.** `next.config.ts` now allows quality 90 (you approved it); every Nike image uses it.
28. **Star Voice.** The notes from your original image are back, set as text beside the screen so they stay sharp and readable. Heading "Star Voice Q&A"; the body is your original paragraph up to where the notes take over, plus the result. "Episodes" and "guest" read "volumes" and "influencer", to match the rest of the page.
29. **Openers** list their cards again. **The closing card** is back as 04.1; it adds the context and the team (the cover already gives the outcome). **The shoebox** plays once when it comes into view (not with reduced motion), and Replay plays it again.
30. **"Image and text"** in 01.1 is larger (the canvas has less padding); the retouching sliders are larger too.
31. **Sound.** The recording now has its sound (from your original file). It plays only when someone presses Play, a chapter or the screen; nothing plays on its own.
32. **Recording controls.** One play control: the screen itself, with a lit orange gradient button at its centre; pressed, the triangle morphs into pause and the button fades (it comes back on hover). In the phone's bezel: a progress bar you can drag (gradient fill, a dot per chapter, a thumb on hover), the time (0:19 / 0:50) and the sound. The section is no taller than before. The chapter now playing draws its progress line.
33. **Voice teaser.** A gradient play button on the bubble's record dot; a hint above it, "Tap to listen · 0:05", until the first play; while it plays, a ring round the button fills and the screenshot's own waveform turns orange. Starting it pauses the recording, and the other way round.
34. **No playful micro-interactions in the case file** (your call, 13:20): the reference you sent is for the portfolio's own shell. Removed: wobbling letters, scrambling times, the hand-drawn loop, the flying arrow, the looping Replay, sound rings. The playbook now says so (§7, Interaction and motion).
35. **What this shows** is one line of labels with small icons, not links: a capability spans several cards, so a jump to one misled. The playbook's cover rule now says the same, so HHCD's chips change too.

36. **04.1 is back to its first version** (your call, 13:33): "One season became several", with Outcome and Role. The YouTube link stays with the recording.
37. **Play buttons** are flat Nike orange, like the rest of the page (no 3D gradient or glow). The voice button has no progress ring: the waveform shows the progress. The "Tap to listen · 0:05" hint stays. The shoebox loops while it's in view (no Replay button); clicking it pauses it, and keyboards get a pause button when they reach it.

38. **Cover outcome reworded** (13:41): "Launched across China as a section of the Nike App's home screen. On the strength of the first season, Nike renewed the agency's contract for the seasons that followed." "Across China" in place of "nationwide" (an app isn't rolled out region by region); "official" dropped (the Nike App is Nike's own); "the agency's contract" says whose contract; "On the strength of the first season" carries your point that the renewal followed the work.

39. **The recording, re-timed from the footage.** Every moment now has a start and an end measured frame by frame (Opening video 0:04–0:10, Lock-up on the cover 0:13–0:16, Headline framing device 0:21–0:22, Several views 0:23–0:24, Product tag 0:24–0:26, Product cards 0:26, Headline typed in 0:26–0:28, Like 0:28–0:30, Poster card 0:40–0:42, Star Voice Q&A 0:42–0:48, Star Ranking 0:48–0:50). The list is in the order things happen, each marked Read, Shop or Return, and lights up only while that moment is on screen. The progress bar has no chapter dots.
40. **"See it at" opens a clip beside the card** instead of scrolling to the top: a small player plays that moment once (Play again at the end); Escape, the close button or a click outside closes it. 01.2 (Visual style) gained one, for the poster card at 0:40.
41. **01.4 leads with the wireframes again** (your call, 13:51), redrawn from the original slide: before, one long column with an arrow down; after, the views as pages with an arrow across and the next page at the edge. The app screens are the inset; pressing it swaps them, as in 02.1.

42. **04.1 is now the results card** (13:57), in our three parts' business terms, from your original case study's results: Delivery (Read), Conversion (Shop), Engagement (Return), then the role. Heading: "Design that helped win Nike's next seasons". The two result lines that sat in 01.5 and 03.2 moved here, so each result is said once. No numbers: the original page has none, and the figures in the Figma drafts aren't confirmed.
43. **"Sole designer", not "only designer"**: the same fact without the defensive tone you didn't want earlier.

44. **Round of 14:44:** the moments are grouped by Read / Shop / Return again (times stay as measured); in 01.4 the inset keeps the same place and size whichever image is large; "sole UI designer"; every clip plays at 0.75× speed; **04.2 (What I'd do now) is off the page for now.** Its text, kept for later: "What I'd do now: take motion from idea to production myself. I specified the like in four states and handed it over in Figma. It shipped as a plain red heart." (assets `like-states.png`, `like-shipped.jpg` stay in the repo).

45. **Cover at the shared scale** (15:33): the title, line under it and spacing now match the case-file template HHCD uses, so the covers look like one system. The whole cover fits in the first screen at 1280 × 720 and up (486 px tall at 1440 × 900).

46. **02.2 body back to your wording** (16:02), with the effect kept: "The old product cards were small tiles under the photo. I redesigned the layout and enlarged the product visuals, to make each item more visible and give it a clear role in the content flow, so products are more noticeable and click-worthy."

## Process## Process

12. **Going live.** You said it can go live once done, so after the tests passed I rebased onto `main` and merged. To undo: revert the merge commit on `main`.
