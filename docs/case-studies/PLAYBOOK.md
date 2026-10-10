# Case study playbook

The shared standard for rewriting and redesigning every project on the site. Each project is reworked in its own conversation; this file keeps them consistent. Read it in full before starting, and propose changes to it rather than drifting from it.

## 1. Who reads this and how

- **Readers.** Recruiters and hiring managers for Design Engineer roles first (Granola's [Design Engineer (Web & Brand)](https://www.granola.ai/jobs/design-engineer-web-brand) and [Design Engineer](https://www.granola.ai/jobs/design-engineer) are the reference JDs), then senior UX / product design roles.
- **How they read.** A few seconds on the cover. Then they scan headings and images. They read body text only if the headings have earned it. Design the page for those three depths:
  - **10 seconds:** cover. What it is, my role, the outcome, one strong image.
  - **1 minute:** headings, images and captions alone tell the whole story.
  - **5 minutes:** body text adds the reasoning, the trade-offs and the evidence.
- **What they're judging.** Judgement (good decisions, or at least sound reasoning), craft (visual and interaction detail), and whether I can ship. Hiring-manager advice converges on: show decisions, not process; make individual contribution unmistakable; show designs large enough to judge; cut anything you can't defend in an interview. Sources: [Leslie Yang, What a hiring manager looks for](https://leslieyang.substack.com/p/what-a-hiring-manager-looks-for-in), [Fountain Institute, What gets senior product designers hired in 2026](https://www.thefountaininstitute.com/blog/senior-product-designers-hired).

## 2. The capabilities the site has to prove

From the two Granola JDs. Each project plays one lead capability and one or two supporting ones; don't make every project prove everything.

| Code | Capability | JD evidence |
|---|---|---|
| A | Web and brand storytelling | "bring Granola's story to life"; typography, layout, hierarchy; landing pages, CTAs |
| B | Idea to production | "taking work from an initial idea into production"; React, TypeScript, Tailwind |
| C | Systems and reuse | design system in Figma and code; reusable components, page templates, publishing workflows |
| D | Craft and interaction | "nails the details", motion, microinteractions |
| E | Accessible, fast, findable | SEO, performance, accessibility |
| F | AI interaction | "invent new interaction patterns for AI-driven tools"; prototyping with AI tools |

Research and service design support the story but don't lead it on Design Engineer lenses.

| | A | B | C | D | E | F |
|---|---|---|---|---|---|---|
| HHCD Data Platform | ○ | ● | ○ | ● | ● | |
| Component Store | | ● | ● | ○ | ● | ○ |
| This site | ● | ● | ○ | ● | ● | ● |
| Nike Athletes Closet | ● | | ○ | ● | | |
| WildEcho | ○ | | | | | |

● lead or strong evidence, ○ supporting. This is the starting hypothesis; each conversation confirms or corrects it for its project.

## 3. Content model: evidence cards, lenses, and the AI

The site's printer prints different work for different readers. That only works if content is written as **evidence cards**, not as one long essay.

- **Evidence card.** One decision or one proof. A claim as the heading, at most three sentences, one image or demo, capability tags. Each card stands alone: it may be printed on its own, out of context.
- **Canonical case file** (`/work/<slug>`). All of a project's cards in their most natural order. One fixed story, written by me, never generated. Printed sheets are excerpts of it: the same words, deep-linking to the same card.
- **Lenses.** A small, fixed set of reading orders, written by me: `ux`, `engineer` (product Design Engineer), `web` (Web & Brand). A lens decides which card a project opens with and which cards get printed. It never changes the words.
- **The AI only selects and orders.** It picks a lens and card ids from what exists and may add one short line on why a card is relevant. It never writes facts about me. Arriving from the printer may highlight matched cards on the case file ("Printed for: accessibility"); it doesn't rewrite them.

Decision-led writing is lens-neutral: UX and engineering readers both want the decision, the reason and the proof. So a project needs **more cards covering different angles**, not several versions of its story.

Card inventory format (one row per card):

| id | Heading (the claim) | Capabilities | Lens role (`ux` / `engineer` / `web`) | Evidence (asset or demo) | Gaps `[ ]` |
|---|---|---|---|---|---|

Each lens role is `lead` (the project opens here on that lens), `in` (printed on that lens), or blank.

Expect 8 to 12 cards per main project and 4 to 6 for earlier work.

## 4. Narrative

**Structure by decision, not by process.** Don't use Research → Ideate → Test, the double diamond, or Brief → Challenge → Solution → Result as the skeleton.

> One line of context → the tension (what was wrong, for whom, why it mattered) → two to four decisions, each "I chose X over Y because Z", each with proof → the outcome → my role, and what I'd change.

- **The heading test.** Read only the headings and captions, top to bottom. The story must still make sense. Every heading is a claim, not a topic: "Making the stories shoppable", not "Solutions".
- **One decision, traced honestly.** Show what I tried first, what didn't work, what I traded away. The strongest cases have a turn in them.
- **Contribution is unmistakable.** Say what I did with "I". Use "we" only for genuine team work, and then say which part was mine.
- **Outcomes are concrete.** A number, a shipped thing, a live link, a real consequence. If there's no number, say what happened. Never invent one.
- **Cut** anything that doesn't support a decision: generic process photos, tool lists, "my contributions" bullet lists (fold them into the role line), and anything I couldn't defend in an interview.
- **Shipped beats concept.** Link to live work wherever it exists.

## 5. Language

Professional, plain and exact, in British English. Every sentence earns its place.

- **Say each thing once.** No restating a point in different words, no summary of what was just said, no heading repeated in the first sentence below it.
- **Paragraphs:** at most three sentences. **Sentences:** usually under 20 words.
- **Verbs** concrete: built, chose, cut, rebuilt, shipped, tested, dropped.
- **Banned words:** leverage, seamless, empower, robust, holistic, enhance, elevate, delightful, cutting-edge, "in today's world", "it's worth noting".
- **Facts over adjectives.** "Every entry has its own page" beats "highly discoverable".
- **Name the trade-off.** "I dropped X to keep Y."
- **Tone:** confident, warm, unshowy. Granola's own site is a good model.
- **Never fabricate.** Every claim must trace to a source: the original portfolio, a repo, the live product, or my own words in conversation. If something is missing, write `[what's missing]` in the copy and add it to the gaps list. Never smooth a gap over with plausible filler.

Example (Nike):

> Before: "This module bridges branded storytelling, user experience and commercial performance."
> After: "People read the stories but rarely tapped through to the products. I was the only UI designer, and closing that gap was the job."

## 6. Images and evidence

In order of value:

1. **The finished thing in use.** Screen recording or video first, then real screenshots at a readable size.
2. **Proof of a decision.** Before and after, alternatives compared, an annotated screen, a diagram that explains a structure.
3. **Process artefacts.** Sticky notes, journey maps, stakeholder maps. Cut by default. Keep one only if it carries a decision, and redraw it in the site's visual language.

Rules:

- **Every image has a caption that says what it proves**, not what it shows ("Product tags turn the photo into the shop", not "Product tags").
- **One point per image.** Large enough to judge without zooming; never thumbnails of whole flows.
- **Motion is video or Lottie, not GIF.** Respect reduced motion: show a poster frame and a play control.
- **Ratios:** 16:10 (desktop and wide), 4:5 (phone screens and portrait), 1:1 (details). Re-crop and re-export to these.
- **Each main project gets one signature interactive module**, something a reader can touch: an embedded live piece of the product, a before/after slider, an interactive diagram.
- **An inventory for every project:** keep / cut / redraw / missing, with the reason. Images I need to supply go into `docs/ASSETS.md`.

## 7. Visual system

**The concept.** A case file is the full document the printer prints: quiet, precise, paper-like, so the work itself is the colour. It must sit naturally next to the home page (photographed printer, warm studio grey, paper, red button).

**Shared (identical on every project):**

- **Type:** Geist Sans for everything, Geist Mono for metadata, labels, numbers and captions. One type scale for all projects; no project-specific fonts. The Wix fonts (`src/components/case/fonts.ts`) are retired once a project is rebuilt.
- **Surfaces:** existing tokens in `src/app/tokens.css`: `--studio`, `--paper`, `--ink`, `--paper-body`, `--rule`. Red (`--red`) stays reserved for actions, as on the printer.
- **Light and dark are both first-class.** Every page is designed and reviewed in both modes. Default to the system setting, and keep the manual override (`data-theme`). Photographed objects on the home page (the printer, the sheets it prints) keep their colours in both modes; reading surfaces, including the whole case file, follow the theme. A long page on bright paper is glaring in dark mode.
- **Grid:** a reading column of about 65 characters. Media can break out to a wide column or full bleed. Generous, consistent vertical rhythm.
- **Page skeleton:** cover → "What this shows" (two or three capability chips that jump to their cards) → cards in canonical order → outcome and role → next project. The parts rail (01…n) stays.
- **Block library:** every project is built from the same blocks:
  - text (heading + body)
  - media (image / video / Lottie, with caption)
  - decision pair (text beside media)
  - compare (before/after slider)
  - code
  - diagram
  - metric strip
  - quote
  - steps
  - gallery
  - demo embed

  A project may propose a new block. If accepted, it joins the library for everyone.

**Per project (its own character):** each project has its own palette, defined once with a light and a dark value for every token:

| Token | Use | Contrast rule (in its own mode) |
|---|---|---|
| `--accent` | links, chips, highlighted numbers, the parts rail marker | ≥ 4.5:1 on the paper surface |
| `--accent-strong` / `--on-accent` | filled chips and buttons, and the text on them | ≥ 4.5:1 between the two |
| `--accent-2` | colour fields, cover band, media mounts | ≥ 3:1 against the paper where it marks a boundary |
| `--accent-tint` | quiet backgrounds: highlighted cards ("Printed for…"), quotes | body text still ≥ 4.5:1 on it |

- **Dark is designed, not inverted.** Brand colours usually need a lighter, slightly desaturated value on dark surfaces; fields get deeper, not brighter. Keep the hue, so the project is recognisable in both modes.
- **Fixed brand colours** (HHCD) stay as marks. Where one fails contrast, add a text-safe variant per mode (the rebuild already does this for light: `--color-projects` / `--color-projects-text`).
- **Media in dark mode.** Bright screenshots get a mount on `--accent-2` so they don't punch a hole in the page. Use the product's own dark-mode screens where they exist. Never filter or invert screenshots; they're evidence.
- **Checks.** Every pairing goes into the contrast script (`npm run contrast`) in both modes. Prototypes show both modes side by side.
- **Starting proposals**, to be confirmed in prototypes:
  - HHCD: its fixed brand colours.
  - Nike: black + orange (from the original page).
  - Component Store: slate.
  - WildEcho: forest green.
  - This site: red.
- The cover image and the signature module carry the rest of the personality.

**References.** Study recent work, then form a view; don't copy any one site. Each conversation should look at some, verify links before citing them, and bring two or three specific observations ("X uses a live demo in place of a hero image") to the user, not a list of names. Look in particular at:

- design-engineer portfolios known for craft and inline interactive demos (Rauno Freiberg, Emil Kowalski, Paco Coursey and similar);
- product marketing sites with strong typographic systems (Granola, Linear, Vercel);
- senior product designer case studies that lead with decisions.

## 8. Process for each project

Work with me in conversation. Talk it through and confirm before building.

1. **Sources.** Read everything listed in the project prompt. Summarise what exists in 10 lines at most, and flag contradictions.
2. **Interview.** Ask me 5 to 8 sharp questions, a few at a time, about what only I know: the hardest decision, what I'd defend, what failed, real numbers, what I'd change now, exactly what I did versus others.
3. **Card inventory.** The table in §3, the canonical order, the image inventory (§6) and the gaps list. Wait for my approval.
4. **Copy.** Write every card to the rules in §4 and §5. Show it to me as plain text and revise with me until every line is right.
5. **Visual prototype.** A single-file HTML prototype of the case file in `docs/design/case-<slug>.html` (same approach as `docs/design/prototype.html`), using the real assets, at desktop and phone widths, in light and dark mode. Iterate with me. Publish it as an artifact so I can view it on any device.
6. **Build.** Move the approved design into the site (see §9), with tests passing and a Vercel preview.
7. **Review.** Heading test, read-aloud test for copy, contrast check in both modes, keyboard and screen-reader pass, phone check. Then I approve the merge.

## 9. Working in parallel without collisions

Several projects are reworked at the same time in separate conversations, all in `CBcbbb/chongbo.DesignEngineer`.

- **One branch per project:** `case/hhcd`, `case/nike`, and so on, each created from the latest `main`. Never commit to `main` directly. Merge only with my approval, one at a time, rebasing onto `main` first.
- **Steps 1 to 5 touch only project-owned files:**
  - `docs/case-studies/<slug>/` (inventory, copy, notes)
  - `docs/design/case-<slug>.html`
  - `public/assets/<slug>/`
- **Content files are project-owned.** Only that project's conversation edits `content/projects/<slug>.ts`.
- **Shared files** (`content/schema.ts`, `src/app/tokens.css`, `src/app/globals.css`, `src/app/components.css`, `src/app/work/[slug]/page.tsx`, the block library, `src/lib/ask/*`, this playbook):
  - **The HHCD conversation owns the shared case-file template and block library**, because HHCD is the richest project and sets the template.
  - Other conversations don't edit shared files. They write proposed changes to `docs/case-studies/SHARED-CHANGES.md` (what, why, which file), and I carry them across.
  - The AI pipeline (`src/lib/ask/*`) belongs to the AI conversation. When card ids, signals or lenses change, note it in `SHARED-CHANGES.md` so its eval set can be updated.
- **Don't touch:**
  - the `archive/red-ticket-printer` branch;
  - the original HHCD repo (`CBcbbb/Helen-Hamlyn-Centre-Platform`);
  - the HHCD platform rebuild repo (`CBcbbb/Helen-Hamlyn-Centre-for-Design-Data-Platform`), which is read-only from here and is being changed in another conversation.
- **Confidentiality:** never name my current employer, its products, its customers or its storage technology anywhere.
- **Respectful wording:** never call my engineer friend a "programmer" or "developer" in anything I might show; say "engineer" or avoid the word.
