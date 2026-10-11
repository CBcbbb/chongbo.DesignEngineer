# Shared changes

Proposed changes to shared files (playbook §9), written by the project conversations that don't own them. Chongbo carries them across.

| Date | From | File | Change | Why | Status |
|---|---|---|---|---|---|
| 2026-10-10 | Nike | `docs/case-studies/PLAYBOOK.md` §5 | Add: "Write the final result for the reader. Nothing from our working discussions (what I nearly dropped, what I'd have liked), no emotional or defensive wording (\"only\", \"just\", \"looks awful\"). Honest limits are stated as facts." | Chongbo's review of Nike draft 1: the cover read like interview notes, not a portfolio. | Proposed |
| 2026-10-10 | Nike | `src/app/tokens.css` | Add reading-surface tokens for dark mode (case files follow the theme; `--paper` stays for photographed objects). Values used in `docs/design/case-nike.html`: page `#161513`, ink `#ecebe7`, body `#c9c6bf`, dim `#9b978f`, rule `#2e2c29`, studio `#0f0e0d`. | Playbook §7 makes dark first-class for case files; the shared tokens only define dark for the studio, not the paper surface. | Proposed |
| 2026-10-10 | Nike | block library | New block **chaptered video**: a phone-framed recording with chapter buttons grouped by part, a progress line, and a `seek` link any card can carry ("See it at 0:25") that scrolls to the player and jumps to that moment. Muted, no autoplay, poster at rest. | Nike's signature module; any project with a shipped-product recording can use it. | Proposed |
| 2026-10-10 | Nike | block library | New block **swap**: one image with a two-state toggle (e.g. Wireframe / Final), cross-fading in place. | Shows a decision's before and after where a slider doesn't fit (different layouts). | Proposed |
| 2026-10-10 | Nike | block library | **media** block: support Lottie with a Play button and a reduced-motion end frame (lottie-web from cdnjs). | Nike's shoebox animation; playbook §6 asks for Lottie, not GIF. | Proposed |
| 2026-10-10 | Nike | `src/app/work/[slug]/page.tsx`, block library | Case file layout: sticky contents on the left; one sheet per card on the studio ground; sheet anatomy (index, tags, claim, body, action, evidence mount, caption); colour roles (`--accent-2` = evidence, `--accent` = action and position); image rules (native ratio, originals, no upscaling). Full spec: `docs/case-studies/nike/case-file-system.md`. | Chongbo asked for a left contents list on every project, cards with a clear visual, and a consistent system across projects. | Proposed |
| 2026-10-11 | Nike | `src/lib/ask/*` eval set (AI conversation) | Nike card ids changed. Removed: `brief`, `imagery`, `delight`. New: `style`, `views`, `components`, `tags`, `ranking`, `draw`, `handoff`. Kept: `graphic-system` (still the fallback default), `retouching` (now its own card again), `product-card`, `star-voice`, `outcome`. Update any eval expectations that name the removed ids. | Nike case file rebuilt from the approved prototype. | Proposed |
| 2026-10-11 | Nike | block library | New block **side by side**: two phone screens on the project colour field, each labelled Before/After, no slider. Use the compare slider only when both images share a frame and differ in detail (retouching). | Chongbo's review: a slider suits photo edits; layout changes read better side by side. | Proposed |
| 2026-10-11 | Nike | block library | Card head: on wide screens the claim (index, kind, heading) sits left and the reasoning (body, tags, action) right, as on Granola's feature rows. Evidence backdrops may use a grain gradient in the project colours. | Granola study (granola.ai, 10 Oct 2026): serif claims left, body right; product UI floats on textured photographic backdrops. | Proposed |
| 2026-10-11 | Nike | block library, PLAYBOOK §6 | **One card, one screen** on tablets and up: every card the same height (`min(100svh - 3rem, 58rem)`), evidence scaled into the space under the text with `max-height`/`max-width` (container units where a box needs its ratio). Side layout (text left, evidence right) for long copy. No explanatory captions under evidence: anything worth saying goes in the card's heading or body; labels inside the evidence (Before/After, layer names) stay. | Chongbo's review of the live Nike page: cards of very different sizes, and captions under images read as stiff over-explanation. | Proposed |
| 2026-10-10 | HHCD | `docs/case-studies/PLAYBOOK.md` §4, §5 | New heading rules: plain by default, two or three drawing-in headings at most, none in a row, no "I", no slogans. Decisions written as choices, not requirements. Design-review test for copy. | Headings were reading as AI slogans. Applies to every project. | On `case/hhcd`, awaiting merge |
| 2026-10-11 | HHCD | `content/schema.ts` | Added, all optional: `CAPABILITIES` (A–F) and `LENSES` (`ux`, `engineer`, `web`); on `Section`: `part`, `capabilities`, `lenses` (`lead` / `in`), `layout` (`stack` / `pair`), `keys`; on `Step`: `title`, `label`, `image`; on `Project`: `template: "case-file"`, `parts`, `outcome`, `shows`. New media kinds: `compare`, `stepper`, `specimens`, `metrics`. Existing projects are unaffected. | Cards and lenses (playbook §3) and the block library (§7). | Done on `case/hhcd` |
| 2026-10-11 | HHCD | `src/components/casefile/*`, `src/app/case-file.css`, `src/app/work/[slug]/page.tsx` | The shared case-file template and block library. A project opts in with `template: "case-file"`. Blocks: text, media plate (screenshots at native ratio on `--accent-2`), video (poster, play button, never autoplays; WebM with MP4 fallback), decision pair (`layout: "pair"`), compare (two arrangements, with an optional recording of the move), stepper diagram, metric strip, steps with images, gallery (row, phones), colour specimens, code, keycaps. Contents rail on the left with reading position; parts with headings. Only HHCD uses it so far; Nike keeps its own page. | Playbook §7: HHCD sets the template. | Done on `case/hhcd` |
| 2026-10-11 | HHCD | `src/app/tokens.css`, `src/app/case-palettes.css` | Reading-surface tokens for the case file in light and dark: `--case-bg`, `--case-ink`, `--case-body`, `--case-dim`, `--case-rule`, `--case-line`, `--case-inset`, `--case-red`. Default `--accent`, `--accent-strong`, `--on-accent`, `--accent-2`, `--accent-tint`; per-project palettes in `case-palettes.css`, selected with `data-palette`. This covers Nike's proposal of 10 Oct for dark reading tokens (different names and values: Nike can adopt these or keep its own in `nike.css`). | Playbook §7: light and dark are first-class; per-project palettes. | Done on `case/hhcd` |
| 2026-10-11 | HHCD | `scripts/contrast.ts` | Also checks the case-file surface and every palette in `case-palettes.css`, in both modes (90 pairs). | Playbook §7 "Checks". | Done on `case/hhcd` |
| 2026-10-11 | HHCD | `src/lib/ask/*` (AI conversation) | HHCD card ids changed. Removed: `problem`, `data-model`, `one-example-first`, `tokens-and-publishing`, `rebuild`, `origin`. New: `brief`, `no-borders`, `sample-data`, `workshop`, `four-types`, `taken-up`, `arrangements`, `guide`, `keyboard`, `narrow-screens`, `contrast`, `results`, `role`. Kept: `dual-view` (now "A table view beside the network"). The fallback default is now `hhcd-data-platform/arrangements` (`fallback.ts`, `model.ts` prompt); unit and browser tests updated. Accessibility asked in words now prints `hhcd-data-platform#keyboard` first. Update the eval set. | HHCD case file rebuilt. | Done on `case/hhcd`; eval set to update |
| 2026-10-11 | HHCD | block library (response to Nike's proposals) | **swap** is covered by `compare` without a recording (cross-fade on a two-state control). **side by side** is `group` with `layout: "row"` (screens) or `ratio: "9:16"` (phones on the field). **chaptered video** and **Lottie** are not in the library yet: Nike keeps them in its own components until a second project needs them. Card layout differs: HHCD uses one continuous sheet with cards inside it; Nike's spec has one sheet per card. Chongbo to choose one for every project. | Keep one library, avoid two versions of the same block. | For Chongbo |
| 2026-10-11 | HHCD | `src/components/casefile/*`, `src/app/case-file.css`, `content/schema.ts`, `src/app/tokens.css`, `src/app/case-palettes.css`, `scripts/contrast.ts`, playbook §7 | The shared template now uses Nike's system, as Chongbo chose:<br>• contents on the left, one sheet per card;<br>• cover and part openers on the project's colour field;<br>• dark sheets for motion and results;<br>• card head with the claim on the left and the reasoning on the right.<br>New tokens per palette: `--field`, `--on-field`, `--on-field-2`, `--dark`, `--on-dark`, `--on-dark-body`, `--on-dark-2`, `--dark-rule`, `--dark-line`, `--dark-inset`, `--accent-on-dark`. New optional fields: `Section.nav`, `Section.surface`, `Project.client`, `Project.legend`. `CaseRail` is replaced by `CaseContents`. Nike can move onto the template whenever it suits: its blocks map to `compare`, `group` and `video`. | Chongbo: one consistent card layout across the portfolio. Resolves the "one sheet vs one sheet per card" question above. | Done on `case/hhcd` |
| 2026-10-11 | HHCD | template, `content/schema.ts`, `case-palettes.css`, playbook §7 | Same skeleton, project art direction. New optional fields: `Project.coverArt` (art running off the cover's sides and bottom; replaces the separate "the work" sheet) and `Project.openers` (`field` or `ground`). HHCD dropped its teal field: white product cover with the network spilling off it, chapter openers on the studio, ink accent, dot-grid evidence mounts. | Chongbo: consistent, but not identical. Each project's layout should express what it is about. | Done on `case/hhcd` |
| 2026-10-11 | Nike | `next.config.ts` | Add `qualities: [75, 90]` to `images`, so a case file can ask for `quality={90}` on screenshots with fine text. | The default 75 softens UI text in screenshots. | Done (approved by Chongbo, 11 Oct) |
| 2026-10-11 | Nike | PLAYBOOK §5 | Add: "Say each thing once. A heading makes the claim; the body adds what the heading doesn't say and never restates it; the evidence shows it, so the body doesn't describe it. Labels don't repeat the heading, the evidence or each other. If the cover gives the outcome, the page doesn't end on a second copy of it." | Chongbo's review of the Nike cover and cards. | Proposed |
| 2026-10-11 | HHCD | `src/lib/ask/*` eval set (AI conversation); `content/schema.ts` | New HHCD card `testing` ("Accessibility – testing"). `results` is now three short points. The `role` card's signals changed from `ai-tools` to `design-eng-gap`: HHCD no longer prints for "AI tools". New optional `Section.bodyStyle: "list"` (a numbered list set large). | Chongbo: tests are accessibility evidence, not results; the role card is about design and code together. | Done on `case/hhcd`; eval set to update |
| 2026-10-11 | Nike | PLAYBOOK §4–§8 | Adopt the standards below ("Case-file standards from the Nike review") for every project, and settle the four conflicts listed there. | Chongbo asked for everything he required across the Nike review to be written down, so HHCD and the other projects match. | Proposed |

---

## Case-file standards from the Nike review (Chongbo, 10–11 Oct 2026)

Everything Chongbo asked for while reviewing the Nike case file, written as rules for every project. Live example: `/work/nike-athletes-closet`. Where a rule differs from the playbook, it is listed under **Conflicts with the playbook** at the end; Chongbo decides which wins.

### 1. Story

- **Know what each card is for.** Before writing a card, say in one line what it proves on its own (which capability, which decision). If it proves nothing new, merge or cut it.
- **Parts follow the reader, not the process.** Nike: Read → Shop → Return → Outcome. Each part has an opener; each card is one decision or one piece of evidence.
- **Lead with the product.** The work in use (the recording) comes straight after the cover.
- **The cover and the ending don't repeat each other.** The cover gives the role and the outcome; the closing card adds what the cover doesn't (context, team), then "What I'd do now".
- **Outcomes in professional, concrete terms.** Say where it shipped and what followed: "Launched nationwide as a home-screen section of the official Nike App. Nike renewed the contract for the following seasons." Past tense if it's no longer live.
- **Role on the cover is the job title** ("UI Designer"). Team and context belong at the end, not on the cover. Say "designed", never "led", unless I led.

### 2. Copy

- **Final, reader-facing text.** Nothing from our working discussions (what I nearly dropped, what I'd have liked, how we decided). No process narration.
- **No emotional or defensive words:** "only", "just", "simply", "unfortunately", "looks awful". Honest limits are stated as facts.
- **Say each thing once.** The heading makes the claim; the body adds what the heading doesn't say (the problem, the method, the result) and never restates it; the evidence shows it, so the body doesn't describe it. Labels don't repeat the heading, the evidence or each other. No lede and intro paragraph saying the same thing.
- **No explanatory captions under evidence.** Anything worth saying goes in the card's heading or body. Labels inside the evidence stay (Before / After, Original / Retouched, Figma layer names, Specified / Shipped).
- **Keep my original wording when it's good.** When editing, cut and harmonise; don't rewrite into something that drifts from what I meant. If the original text on an image carries meaning (annotations), keep it.
- **One term per thing across the page** (Nike: "volume", "influencer", never "episode" or "guest" in one card and not the others).
- **Don't over-stress one detail.** A date or label that matters (VOL.4) appears once, where it explains something.
- **Headings:** mostly plain statements, a few livelier ones where earned, never negative. Mirror the job description's language where it fits the facts.
- **Never fabricate** facts, numbers, quotes or client feedback. British English.

### 3. Cover

- Kicker (the client, e.g. "Nike China"), the title, one line under it saying what the thing is, then a rule and two facts: **Role** and **Outcome**.
- "What this shows": two or three chips, each jumping to the card that proves it.
- Compact: the cover must not dominate the first screen.

### 4. Cards and layout

- **Contents on the left on every project:** the project, then each part with its cards; the card you're reading is marked (one marker, text centred in its highlight). Below 1000px it becomes a strip of parts.
- **One card, one screen** on tablets and computers: every card the same height, `min(100svh − 3rem, 58rem)` (761–1000px wide: `100svh − 7rem`), so a card is seen whole without scrolling, like a tablet screen. Evidence scales into the space under the text and keeps its ratio. Phones scroll as normal.
- **Card head:** the index (`01.2`) above the heading, with a clear gap between them; heading on the left, body on the right; evidence underneath. Text beside evidence only where it doesn't cramp either (Chongbo preferred text on top, with tabs down the left of the canvas, over a cramped two-column card).
- **No kind labels or capability pills on cards** (they repeated the evidence or each other); the cover chips carry the capabilities.
- **Openers:** on the project colour, a big number, the part name and its card list.
- **Each card is designed for its content**, but sizes stay consistent: a switcher's canvas keeps one size whichever tab is open.
- **Evidence as large as the card allows:** tight padding round it; two phone screens side by side for a before/after of different layouts; a slider only when both images share a frame (retouching).
- **The project's colour is prominent** (Nike orange on the cover, openers and evidence fields); paper and black sheets set the rhythm; Granola-quality graphic design (textured backdrops, strong type).

### 5. Images, video and sound

- **Never change an image's ratio, never stretch it, never crop an original.** Where a frame needs a different ratio, pad the original on a mount.
- **Use originals,** at least twice their display size; serve screenshots at quality 90. If a file is too small, list it and ask for the original; don't upscale.
- **Annotations on an original are content:** if a screenshot's notes explain it, keep them (as live text beside it if that reads better).
- **Recordings are never cropped:** shown whole in a device frame, with their sound and a sound toggle. One play control only (no second play button), and controls never add height.
- **Animations** play once when they come into view and can be replayed; they sit at about 85% of their stage, not edge to edge.
- **Sound that tells the story gets its own control** (Nike: the influencer's voice teaser, playable from the screenshot like a voice message). Only one thing plays at a time.

### 6. Interaction and motion

- **Buttons do more than change colour.** Icon and text both take part in a hover, with a little randomness each time: letters jolt and spring back, icons act (a swoosh draws itself, a heart beats, squares trade places, an arrow loops or flies off and comes back), times run like a scoreboard before they settle.
- **Tie each interaction to the content:** a voice message for a voice feature, a stadium scoreboard for timestamps, the brand's swoosh round a play button.
- **Obvious affordances:** something you can press should look pressable (the wireframe inset sits on the canvas's top-right corner and overhangs it).
- **Restraint:** small, quick (≤ 0.7s), springy; nothing loops forever except a gentle ring that invites a first tap. Everything stands still with reduced motion.
- **Accessibility holds:** contrast ≥ 4.5:1 in both modes, controls at least 44px outside running text (32px in the contents), keyboard focus triggers the same micro-interactions as hover.

### 7. Process

- **Don't ask me for small details** (exact dates, volume numbers). Think about the story, the capability each card shows, the layout and the effect.
- **Show me the full text** when copy changes, not a summary of changes.
- **Go live when it's done**, and list anything uncertain in the project's `DECISIONS.md` for me to decide.
- **Check the page the way I'll see it:** every card at 1440 × 900, 1280 × 720, 1366 × 768, 1024 × 1366 and 768 × 1024 (no overflow, nothing distorted), and on a phone.

### Conflicts with the playbook

| Playbook | Says | Nike review says |
|---|---|---|
| §5 example | "I was the only UI designer…" | No "only" anywhere; the example needs rewriting. |
| §6 rules | "Every image has a caption that says what it proves" | No captions under evidence; the point goes in the heading or body. |
| §6 ratios | "Re-crop and re-export to these" | Never crop an original or change its ratio; pad it on a mount instead. |
| §7 card anatomy | "index and kind … body and tags on the right … caption" | Index only; no kind label, no tags, no caption. |
