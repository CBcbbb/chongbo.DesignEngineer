# Case study playbook

The shared standard for rewriting and redesigning every project on the site. Each project is reworked in its own conversation; this file keeps them consistent. Read it in full before starting, and propose changes to it rather than drifting from it.

## 1. Who reads this and how

- **Readers.** Recruiters and hiring managers for Design Engineer roles first (Granola's [Design Engineer (Web & Brand)](https://www.granola.ai/jobs/design-engineer-web-brand) and [Design Engineer](https://www.granola.ai/jobs/design-engineer) are the reference JDs), then senior UX / product design roles.
- **How they read.** A few seconds on the cover. Then they scan headings and images. They read body text only if the headings have earned it. Design the page for those three depths:
  - **10 seconds:** cover. What it is, my role, the outcome, one strong image.
  - **1 minute:** headings and evidence alone tell the whole story.
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

- **Know what each card is for.** Before writing a card, say in one line what it proves on its own (which decision, which capability). If it proves nothing new, merge it or cut it.
- **Parts follow the reader, not the process.** Nike: Read → Shop → Return → Outcome. Each part has an opener; each card is one decision or one piece of evidence.
- **Lead with the product.** The work in use (a recording, the live site) comes straight after the cover.
- **The heading test.** Read only the headings and the evidence, top to bottom. The story must still make sense.
- **How headings work.**
  - A heading tells the reader what the section is about and which way the decision went, but doesn't sum it all up. The reason and the how stay in the body, so there's something to read on for.
  - Most headings are plain and calm: a short phrase or a direct label. "A network instead of a geographical map", "Responsive design", "Accessibility – keyboard navigation".
  - A few are written to draw the reader in, such as a question or a more memorable line. Use two or three per project at most, never two in a row, and only once the reader has the context. Don't open a case with questions.
  - No "I" in headings; "I" belongs in the body. No slogans: no wordplay, parallel phrasing, rhetorical contrasts or punchlines.
- **One decision, traced honestly.** Show what I tried first, what didn't work, what I traded away. The strongest cases have a turn in them.
- **Contribution is unmistakable.** Say what I did with "I". Use "we" only for genuine team work, and then say which part was mine.
- **Outcomes are concrete.** A number, a shipped thing, a live link, a real consequence. If there's no number, say what happened, in professional terms: "Launched across China as a section of the Nike App's home screen. On the strength of the first season, Nike renewed the agency's contract for the seasons that followed." Past tense if it's no longer live. Never invent a number.
- **Every card keeps its effect.** A card says the problem, what I did and what it achieved. Cutting for brevity never cuts the effect. The closing card sums the results up in the business's terms (Nike: Delivery, Conversion, Engagement, one per part) and states my contribution plainly ("As the agency's sole UI designer, …"), without repeating a card's own line.
- **The cover and the ending don't repeat each other.** The cover gives the role and the outcome in a line each; the closing card gives the results by part and the role in full.
- **Role:** on the cover, the job title ("UI Designer"); team and context at the end. Say "designed", never "led", unless I led. Where the work was partly shared, the job title is followed by up to three short lines saying what I did and with whom, each with a small icon: two people for work done with others ("Data collection with the VOICE team"), one person for work done on my own ("Analysis, modelling, design and build on my own"). The activity reads first, the "with whom" steps back in tone. Content field `roleSplit`.
- **Cut** anything that doesn't support a decision: generic process photos, tool lists, "my contributions" bullet lists (fold them into the role line), and anything I couldn't defend in an interview.
- **Shipped beats concept.** Link to live work wherever it exists.

## 5. Language

Professional, plain and exact, in British English. Every sentence earns its place.

- **Final, reader-facing text.** Nothing from our working discussions (what I nearly dropped, what I'd have liked, how we decided), no process narration.
- **No emotional or defensive words:** only, just, simply, unfortunately, "looks awful". Honest limits are stated as facts.
- **Say each thing once.** The heading makes the claim; the body adds what the heading doesn't say (the problem, the method, the result) and never restates it; the evidence shows it, so the body doesn't describe it. Labels don't repeat the heading, the evidence or each other. No lede and intro saying the same thing, no summary of what was just said.
- **Keep my wording when it's good.** When editing my original text, cut and harmonise; don't rewrite it into something that drifts from what I meant.
- **One term per thing across the page** (Nike: "volume" and "influencer" everywhere, never "episode" or "guest" in one card).
- **Don't over-stress one detail.** A date or label that matters appears once, where it explains something.
- **Paragraphs:** at most three sentences. **Sentences:** usually under 20 words.
- **Verbs** concrete: built, chose, cut, rebuilt, shipped, tested, dropped.
- **Banned words:** leverage, seamless, empower, robust, holistic, enhance, elevate, delightful, cutting-edge, "in today's world", "it's worth noting".
- **Facts over adjectives.** "Every entry has its own page" beats "highly discoverable".
- **Name the trade-off.** "I dropped X to keep Y."
- **Write decisions as my choices.** Avoid words that turn my judgement into someone else's instruction: requirement, the brief asked, had to, needed to. "Accessibility as the starting point", not "Accessibility was a requirement".
- **The design-review test.** Would I say this sentence aloud to a colleague in a design review, or in an interview? If it sounds like an advert or an aphorism, rewrite it.
- **Tone:** confident, warm, unshowy. Granola's own site is a good model.
- **Never fabricate.** Every claim must trace to a source: the original portfolio, a repo, the live product, or my own words in conversation. If something is missing, write `[what's missing]` in the copy and add it to the gaps list. Never smooth a gap over with plausible filler.

Example (Nike):

> Before: "This module bridges branded storytelling, user experience and commercial performance."
> After: "Readers engaged with the stories, but product click-through stayed low, because the stories didn't connect to the products. I added tappable product tags."

## 6. Images and evidence

In order of value:

1. **The finished thing in use.** Screen recording or video first, then real screenshots at a readable size.
2. **Proof of a decision.** Before and after, alternatives compared, an annotated screen, a diagram that explains a structure.
3. **Process artefacts.** Sticky notes, journey maps, stakeholder maps. Cut by default. Keep one only if it carries a decision, and redraw it in the site's visual language.

Rules:

- **No captions under evidence.** What an image proves goes in the card's heading or body. Labels inside the evidence stay (Before / After, Original / Retouched, Figma layer names, Specified / Shipped).
- **Annotations on an original are content.** If a screenshot's notes explain it, keep them, as live text beside it if that reads better.
- **One point per image.** Large enough to judge without zooming; never thumbnails of whole flows. Evidence takes as much of the card as it can, with tight padding. Two phone screens of different layouts sit side by side; a before/after slider only when both images share a frame (retouching).
- **Motion is video or Lottie, not GIF.** Short animations loop while in view (paused out of view; a click pauses them, and keyboards get a pause control) and sit at about 85% of their stage. With reduced motion: the last frame, still.
- **Recordings are never cropped:** shown whole in a device frame, with their sound and a sound toggle. One play control only, and controls never add height. Sound that tells the story gets its own control (Nike: the voice teaser, played from the screenshot like a voice message, with "Tap to listen · 0:05" until the first play). Only one thing plays at a time.
- **Moments in a recording are timed from the footage**, frame by frame, each with a start and an end, and grouped by the page's parts; a moment lights up only while it's on screen. A card's "See it at 0:24" opens that moment as a clip beside the card (once, at 0.75× speed, with Play again), never scrolling the reader away.
- **Never change an image's ratio, stretch it or crop an original.** Where a frame needs a different ratio, leave the space round it on the card; never pad it on a mount.
- **One edge per piece of evidence.** A screenshot, a diagram's sheet or a phone screen gets a hairline and a small radius, nothing more: no mounts, no drop shadows, no box inside a box. A browser window only for the live product, with one slim bar: the address on the left, any controls on the right (a switch, a scrubber); no fake window buttons. Photos and phone screens with more detail than the card can show open larger (the picture is the button, with a small enlarge badge; a native dialog; never past half the original's pixel width).
- **The canvas is the card, not a box.** Where a project wants a working surface (HHCD: a dot grid, like map paper), it runs under the evidence to the card's left, right and bottom edges and fades in under the text. Behind product screens, prototypes and diagrams only; photos, tables and numbers sit on plain paper.
- **Numbers are the picture.** A card whose evidence is figures sets them large (up to 9rem) at the card's foot. Where the figures are shares of one whole (HHCD: 17 projects, 12 methods, 10 people, 9 partners), each column is as wide as its share, under a bar in its colour, so the row is also the chart; a total stands apart.
- **A card without evidence** (the closing card) sets its body as a statement in large type at the foot, so the card isn't a heading over an empty field.
- **Originals, sharp:** at least twice their display size, screenshots served at quality 90. Check every image's pixels against its display size before building, and ask me for originals at the start (Figma exports at 3x). A composite is not an original: a set of posters is six files, not one picture of six. Never upscale.
- **Choose the evidence for the decision.** A structural decision leads with a wireframe or diagram, with the real screens as the inset; a layout change is two screens side by side; a photo edit is a slider; a set (posters, templates) is shown as separate items, side by side or in a strip swiped sideways with the next one at the edge.
- **Each main project gets one signature interactive module**, something a reader can touch: an embedded live piece of the product, a before/after slider, an interactive diagram.
- **An inventory for every project:** keep / cut / redraw / missing, with the reason. Images I need to supply go into `docs/ASSETS.md`.

## 7. Visual system

**The concept.** A case file is the full document the printer prints: quiet, precise, paper-like, so the work itself is the colour. It must sit naturally next to the home page (photographed printer, warm studio grey, paper, red button).

**Shared (identical on every project):**

- **Type:** Geist Sans for everything, Geist Mono for metadata, labels, numbers and captions. One type scale for all projects; no project-specific fonts. The Wix fonts (`src/components/case/fonts.ts`) are retired once a project is rebuilt.
- **Surfaces:** existing tokens in `src/app/tokens.css`: `--studio`, `--paper`, `--ink`, `--paper-body`, `--rule`. Red (`--red`) stays reserved for actions, as on the printer.
- **Light and dark are both first-class.** Every page is designed and reviewed in both modes. Default to the system setting, and keep the manual override (`data-theme`). Photographed objects on the home page (the printer, the sheets it prints) keep their colours in both modes; reading surfaces, including the whole case file, follow the theme. A long page on bright paper is glaring in dark mode.
- **Grid:** a reading column of about 65 characters. Media can break out to a wide column or full bleed. Generous, consistent vertical rhythm.
- **Page skeleton (every project, same system as Nike):**
  - Contents on the left on every project: the project, then each part with its cards; the card being read is marked (one marker, text centred in its highlight). Below 1000px it becomes a strip of parts.
  - On the right, a stack of sheets on the studio:
    - cover: the client, the title, one line saying what it is, then Role and Outcome under one rule, and "What this shows": two or three capability labels, each with a small still icon, on one line under them. Labels, not links: a capability usually spans several cards, so a jump to one of them misleads. Compact: the whole cover fits in the first screen (1280 × 720 and up), and every project uses the shared cover design, so covers match across projects:
      - type: title `clamp(2.25rem, 5vw, 4rem)`, weight 600, line-height 0.96, tracking −0.045em, at most 10em wide, broken where the name breaks; the line under it `clamp(1.0625rem, 1.6vw, 1.25rem)`, regular weight, in the field's secondary colour, at most 40ch; Role and Outcome at 0.9375rem;
      - space, not more rules: three groups (client and title · the line under it, with the live link · Role, Outcome and labels), tight inside a group and open between them. Padding `clamp(1.75rem, 4.2vw, 3rem)` top and bottom; client → title `clamp(1rem, 2.2vw, 1.5rem)`; title → line `clamp(0.9rem, 2vw, 1.5rem)`; line → the rule over Role and Outcome `clamp(1.75rem, 4.4vw, 3rem)`; Role and Outcome → labels `clamp(1rem, 2vw, 1.4rem)`;
      - the live link, where there is one, sits at the right of the line under the title, centred on it, its right edge on the end of the rule below. The title stands alone: nothing sits beside it. On tablets and phones the link goes under the line. Built in `case-file.css` (`.cf-cover`, a container query on the cover's width). A bespoke cover (Nike's `nike.css`, `.nk-cover`) copies these values and is re-checked whenever they change;
      - Role and Outcome side by side on tablets and computers, one column on phones; the labels on one line under them;
      - cover art, where a project has it, stays in the top-right corner, runs off the sheet and fades before the title; it never sits under text or the live link;
    - the work (the product itself);
    - then, for each part, an opener (big number, name, its cards) and one sheet per card;
    - then next project.
  - Card anatomy: the index (`01.2`) above the heading, with a clear gap; the claim on the left, the body on the right; evidence underneath at full sheet width. No kind label, no capability tags (the cover chips carry them), no caption. Text beside the evidence only where neither is cramped.
  - **One card, one screen** on tablets and computers: every card the same height, `min(100svh − 3rem, 58rem)` (`100svh − 7rem` at 761–1000px), so it is seen whole without scrolling. Evidence scales into the space under the text and keeps its ratio. Phones scroll as normal.
  - Each card is designed for its content, but sizes stay consistent: a switcher's canvas keeps one size whichever tab is open.
  - Three surfaces set the rhythm: paper for reading, the project's colour field for the cover, openers and interactive evidence, and the project's dark for the work in motion and results.
  - The skeleton is shared; the art direction is not. Each project decides, from what it has to say:
    - its surfaces: a colour field (`--field`), or none;
    - its dark (`--dark`);
    - its cover, for example art running off the sheet (`coverArt`);
    - its part openers: on the field, or on the studio as chapter pages (`openers`);
    - its canvas (a field under the evidence, or none);
    - its signature module.
  - Nike: orange field, black, full-bleed imagery. HHCD: no brand field; its identity is four equal colours on white, so colour lives only in the work and the four marks, with the evidence on a dot-grid canvas that is the card itself.
  - The project's colour is prominent where it has one; the quality bar is Granola's graphic design (textured backdrops, strong type, sure contrast).
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

  Built in `src/components/casefile/` (template `CaseFile.tsx`, blocks in `blocks.tsx`), styled by `src/app/case-file.css`, with per-project palettes in `src/app/case-palettes.css`. A project opts in with `template: "case-file"` in its content file.

**Interaction and motion:**

- **Playful micro-interactions belong to the site, not the case files.** Buttons that do more than change colour (letters knocked about, icons that act, a little randomness each time) are for the portfolio's own shell: the home page, navigation, the printer. Inside a case file they compete with the work.
- **In a case file, controls are serious and well made:** they work fully (a recording can be scrubbed, paused, muted; one thing plays at a time), look finished (Nike: a lit orange gradient on the play buttons, a gradient progress fill, a ring that fills as a clip plays), and guide where needed (a small hint, "Tap to listen · 0:05", until the first play).
- **Obvious affordances:** what can be pressed looks pressable (Nike's wireframe inset sits on the canvas's top-right corner and overhangs it). A swap keeps both boxes still: the inset has the same place and size whichever image is large.
- **Restraint and access:** transitions short (0.35s or less for controls); focus behaves like hover; everything stands still with reduced motion.

**Per project (its own character):** each project has its own palette, defined once with a light and a dark value for every token:

| Token | Use | Contrast rule (in its own mode) |
|---|---|---|
| `--accent` | links, tags, card indexes, the contents marker | ≥ 4.5:1 on the paper surface |
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
2. **Interview.** Ask me 5 to 8 sharp questions, a few at a time, about what only I know: the hardest decision, what I'd defend, what failed, real numbers, what I'd change now, exactly what I did versus others. Don't ask for small details (exact dates, volume numbers); think about the story, the capability each card shows, the layout and the effect.
3. **Card inventory.** The table in §3, the canonical order, the image inventory (§6) and the gaps list. Wait for my approval.
4. **Copy.** Write every card to the rules in §4 and §5. Show it to me as plain text, always the full text rather than a list of changes, and revise with me until every line is right.
5. **Visual prototype.** A single-file HTML prototype of the case file in `docs/design/case-<slug>.html` (same approach as `docs/design/prototype.html`), using the real assets, at desktop and phone widths, in light and dark mode. Iterate with me. Publish it as an artifact so I can view it on any device.
6. **Build.** Move the approved design into the site (see §9), with tests passing and a Vercel preview.
7. **Review.** Heading test, read-aloud test for copy, contrast check in both modes, keyboard and screen-reader pass, phone check, and every card at 1440 × 900, 1280 × 720, 1366 × 768, 1024 × 1366 and 768 × 1024 (no overflow, nothing distorted). Once I've said it can go live, merge when it's done and list anything uncertain in `docs/case-studies/<slug>/DECISIONS.md` for me to decide.
8. **Final check.** Re-read every card for its effect and for repetition; list everything we discussed that isn't done yet; regenerate `copy.md` from the content file so it matches the page; confirm every change is on the live site (a production deploy marked successful), since a change that isn't live isn't done.

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
