# Helen Hamlyn Centre Data Platform: card inventory

Title: **Helen Hamlyn Centre Data Platform**. Slug stays `hhcd-data-platform`.

Playbook §8 step 3. Approved headings, 10 October 2026. Body copy is step 4.

## Framing

- **One case, one tool.** An accessible map of a research network. It was first built for an EU-funded research project (VOICE), then taken up by the Helen Hamlyn Centre for Design with its own data and brand.
- **The focus is accessibility and responsive design.** Early work is kept short, apart from the data model.
- **It's a tool, not a website.** It opens straight on the map. The copy doesn't explain this choice.
- **Never mention:** the star-field wireframe, why VOICE is no longer online, or the paper's withdrawal. The interns are a side note at most.

## Cards, in canonical order

Draft 2. The page is in two parts, so the order follows what happened.

Capabilities follow playbook §2. Lens roles: `lead` (opens here), `in` (printed), `·` (not printed).

| id | Heading | Capabilities | ux | engineer | web | Evidence | Gaps |
|---|---|---|---|---|---|---|---|
| | **Part 1 · VOICE** | | | | | | |
| `brief` | Accessibility as the starting point | E | lead | in | · | VOICE graph view (paper fig. 15) | |
| `no-borders` | A network instead of a geographical map | D, research | in | · | · | Geographic prototypes (paper figs 1, 4) | |
| `sample-data` | Working prototypes on sample data | B, D | in | in | · | Prototype with sample labels (paper fig. 5) | |
| `workshop` | A 75-minute workshop with 14 stakeholders | research, E | in | · | · | Steps block: the three walls (paper figs 10–12), stakeholder cards (fig. 9) | [higher-resolution wall photos] |
| `four-types` | Why the data is collected by person but mapped by type | B, C | in | in | · | Animated stepper: from what data is needed to linked records | |
| `dual-view` | A table view beside the network | E | in | in | · | VOICE table view (paper fig. 16) | |
| | **Part 2 · Helen Hamlyn Centre** | | | | | | |
| `taken-up` | Taken up by the Helen Hamlyn Centre | B, C | in | in | in | Cover-quality map of the Centre's data | |
| `arrangements` | Two arrangements of the same map | D, E | in | lead | in | **Signature module:** the free network / By type switch | |
| `guide` | A guide inside the map | D, E | in | in | in | Recording of the four steps; `home-1440.png` | |
| `keyboard` | Accessibility – keyboard navigation | E, D | · | in | · | Recording of arrow-key navigation in both arrangements | |
| `narrow-screens` | Responsive design | E, D | in | in | lead | `path-390.png`: details as a sheet over the map | |
| `contrast` | Accessibility – colour contrast | E, C | · | in | in | Code: brand colour and text variant | |
| `results` | Results | B | in | in | in | Metric strip: Lighthouse 99 · WAVE 0 errors · axe 0 violations · 27/27 contrast pairs | |
| `role` | Designed, specified and built alone | B, F | in | in | in | None needed | [screen-reader / Safari / Firefox testing] |

Dropped: `homepage-removed` (the turn isn't needed) and `own-page` (adds nothing). `web` now opens on `narrow-screens`.

## Facts and their sources

Copy may only use these, or what Chongbo adds later.

**From Chongbo, in this conversation:**

- The move from a geographical map to a network was a team decision: write "we". The work was diverse, and the team didn't want geography to divide it. Use "we" for VOICE team decisions; "I" for his own work.
- He coded the prototype ideas with sample data before the workshop. This was the first round of testing.
- VOICE had two views (graph and table), not three. The columns arrangement came with the HHCD rebuild.
- The source data was one Excel sheet (VOICE) that started from people: each person's projects, the methods each project used, and the organisations that supported it.
- He started the survey from each person's own work, so people would be willing to fill it in. After a first round of cleaning, he decided how the Excel rows became points, and what each point represents. He also decided to map by four linked types, because laying person-first data out as it is puts people at the centre.
- The team ran the workshop; he designed its process and analysed its data.
- The one-liner calls it a research repository (a resource library).
- Accessibility came first because the project was broad and international.
- He made the design files, wrote the requirements document, built many of the early prototypes, and wrote all the code with AI coding tools. Those tools were weaker then, so it took a lot of work.
- Accessibility was his goal from the start, and it's why he knows the field well.
- The paper was accepted at DRS 2026. Write only that.
- The Centre uses the platform now. No launch date in the copy.
- No teaching line, and no "what failed / what I'd change" in the copy.
- In the final design, the map is the homepage, because it's a tool, not a marketing site. The map is free by default, with an option to sort it into four columns.

**From the DRS 2026 paper (Chongbo's own unpublished record, VOICE):**

- EU / Innovate UK funded. Seven consortium partners.
- The workshop: 14 participants, a 75-minute sprint, three walls (content, scope, functionality), and role-play with seven stakeholder cards.
- The top three features were filters, search and visible connections. Translation got fewer votes, but participants argued for it and it was kept.
- The walls: (1) Content: what each entry should contain. Every type got a consistent structure, and methods were linked to projects and people. (2) Scope: inclusion criteria. Entries should touch at least two of three themes (technology, community, environment), and the scope went beyond Europe. (3) Functionality: features ranked, and new ones suggested.
- Participants used post-it notes and dot votes. The stakeholder cards were: Eco-Social Artist, Digital Artist, Student, Academic Researcher, Community Leader, Local Councillor, EU Cluster Coordinator.
- Added after the workshop: zoom buttons, the table view ("Simple View") and a guidance sidebar (introduction, how to use it, accessibility, translation).
- Soft-launched in September 2025 with 55 nodes and 68 links.
- Lighthouse accessibility 99/100. WAVE found no errors.

**From the rebuild repo (`REPORT.md`, read-only):**

- HHCD data: 17 projects, 12 methods, 10 people, 9 partners, 104 connections (48 entries). An ID typo that dropped one link was fixed.
- Every entry has a static page, and pages work without JavaScript.
- Second iteration (10 October 2026, merged to `main` as `dadfa80`). This section is current where it conflicts with older sections:
  - The map is the home page: a free constellation, with every entry the same size.
  - One control ("Constellation" / "By type") moves the same entries into four columns and back, with a staggered, animated move. Both layouts are computed at build time and share one frame. The move is instant with reduced motion.
  - A first-visit guide: one project pulses, and four cards follow what you do. It's skippable, remembered, and restartable. Its cards never take focus or block the page.
  - A path of the entries you've opened is drawn on the map.
  - The table (`/table`) is one table of every entry, sortable (`aria-sort`).
  - Map names are in the original brand colours, bold, at least 18.67px (WCAG large text, 3:1). They switch to darker variants when you zoom out below that.
  - Mobile: details open as a sheet over the lower part of the map, which stays usable. Map controls have 40px touch targets, and nothing scrolls sideways at 320px.
  - Arrow keys move to the nearest entry in either arrangement. The guide works by keyboard alone.
  - Checks: 57 unit and component tests, 43 Playwright tests at 1440px and 390px (including axe on the guide, the path and the columns), and 27 contrast pairings.
- Tested by Chongbo in Chrome, Safari and Firefox. Not yet tested with a screen reader.
- Chromium accessibility-tree check (10 Oct, local build): map entries announced as "name, type, n connections"; Enter moves focus to the details heading, Escape returns it; search results announced ("39 entries match 'design'."); the table has a caption, column and row headers. This is not a screen-reader test. Live at https://helen-hamlyn-centre-for-design-data.vercel.app/ (48 entries, 104 connections). The Centre uses this version.

## Image inventory

| Status | Image | Reason |
|---|---|---|
| Keep | Paper figs 1, 4 (geographic prototypes) | Shows what came before the network |
| Keep | Paper figs 15, 16 (VOICE graph and table views) | Proof that VOICE was built and launched |
| Keep | Paper figs 9–12 (stakeholder cards, the three walls) | The workshop steps block |
| Keep | Paper fig. 5 (prototype with sample labels) | Proof that the prototypes ran on sample data |
| Keep | Paper fig. 22 (WAVE result, cropped to the summary) | `results` |
| Keep | Rebuild `columns-1440`, `path-390` | Columns arrangement, phone sheet |
| Keep | Rebuild `home-1440` (guide's first card) | `guide` card |
| Cut | Paper figs 6–8 (star-field) | Not to be mentioned |
| Cut | Paper figs 2, 3, 17–21 | Duplicates, or too much text to read |
| Cut | Paper fig. 23; rebuild `home-390`, `columns-390`, `path-1440`, `table-390`, `project-390` | Process material that carries no decision, or duplicates |
| Redraw | Paper figs 13, 14 (knowledge structure) | Becomes the `four-types` before / after, in the site's style |
| Capture | Constellation with no guide card, 1440px | Cover. Test capture works locally |
| Capture | Keyboard recording in both arrangements; the switch as video | Captured locally from the rebuild without changing it |
| Missing | Dark-mode screens | The product has none. Use a mount on `--accent-2` |

## Gaps

1. VoiceOver test, run in a separate conversation (`PROMPT-voiceover.md`). Browsers are done: Chrome, Safari and Firefox.

## Id changes (for `SHARED-CHANGES.md` at build)

| Old ids | New ids |
|---|---|
| `problem`, `data-model`, `dual-view`, `one-example-first`, `tokens-and-publishing`, `rebuild`, `origin` | the cards above |

The AI conversation's eval set and the fallback defaults reference `dual-view`.
