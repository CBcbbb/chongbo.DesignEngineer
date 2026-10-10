# HHCD case study: card inventory

Playbook §8 step 3. Approved headings, 10 October 2026. Body copy is step 4.

## Framing

- **One case, one tool.** An accessible map of a research network. It was first built for an EU-funded research project (VOICE), then taken up by the Helen Hamlyn Centre for Design with its own data and brand.
- **The focus is accessibility and responsive design.** Early work is kept short, apart from the data model.
- **It's a tool, not a website.** It opens straight on the map.
- **Never mention:** the star-field wireframe, why VOICE is no longer online, or the paper's withdrawal. The interns are a side note at most.

## Cards, in canonical order

Capabilities follow playbook §2. Lens roles: `lead` (opens here), `in` (printed), `·` (not printed).

| id | Heading | Capabilities | ux | engineer | web | Evidence | Gaps |
|---|---|---|---|---|---|---|---|
| `brief` | Accessibility as the starting point | E | lead | in | · | VOICE graph view (paper fig. 15) | |
| `no-borders` | A network instead of a geographical map | D, research | in | · | · | Geographic prototypes A and B (paper figs 1, 4), then the network | |
| `workshop` | Features ranked by 14 stakeholders | research, E | in | · | · | Wall Three photo (paper fig. 12) and a redrawn ranking | [vote counts, optional] [higher-resolution Wall Three photo] |
| `four-types` | Why the data is collected by person but mapped by type | B, C | in | in | · | Redrawn diagram: one person-first row becomes four linked record types | |
| `three-views` | Three views of the same network | E, D | in | lead | in | **Signature module:** switch between the free network, four columns and the table | [is the free / columns switch built?] |
| `keyboard` | Accessibility – keyboard navigation | E, D | · | in | · | Recording of arrow-key navigation on the map | |
| `narrow-screens` | Responsive design | E, D | in | in | in | Rebuild map at 390px (`explore-390.png`) | |
| `contrast` | Accessibility – colour contrast | E, C | · | in | in | Code: brand colour and text variant; WAVE result cropped (paper fig. 22) | |
| `own-page` | A link for every person, project and method | E, B | · | in | lead | Rebuild project page (`project-1440.png`) | [rebuild link, if deployed] |
| `outcome` | Launched, then taken up by the Helen Hamlyn Centre | B | in | in | in | Metric strip: Lighthouse 99 · WAVE 0 errors · axe 0 violations · 27/27 contrast pairs | [HHCD launch date] [is the Centre using it?] |
| `role` | Designed, specified and built alone | B, F | in | in | in | None needed | [what failed first] [what I'd change now] |

Dropped: `homepage-removed`. The turn isn't needed. The map-first decision can be one sentence in `three-views` [confirm].

## Facts and their sources

Copy may only use these, or what Chongbo adds later.

**From Chongbo, in this conversation:**

- He made the decision to replace the geographical map with a network. A borderless, EU-funded arts research project shouldn't divide its people by region.
- The source data was one Excel sheet (VOICE) that started from people: each person's projects, the methods each project used, and the organisations that supported it.
- He decided to collect by person, because that is easiest to answer in a survey. He also decided to map by four linked types, because laying person-first data out as it is puts people at the centre.
- He ran the workshop and analysed its data.
- He made the design files, wrote the requirements document, built many of the early prototypes, and wrote all the code with AI coding tools. Those tools were weaker then, so it took a lot of work.
- Accessibility was his goal from the start, and it's why he knows the field well.
- The paper was accepted at DRS 2026. Write only that.
- In the final design, the map is the homepage, because it's a tool, not a marketing site. The map is free by default, with an option to sort it into four columns.

**From the DRS 2026 paper (Chongbo's own unpublished record, VOICE):**

- EU / Innovate UK funded. Seven consortium partners.
- The workshop: 14 participants, a 75-minute sprint, three walls (content, scope, functionality), and role-play with seven stakeholder cards.
- The top three features were filters, search and visible connections. Translation got fewer votes, but participants argued for it and it was kept.
- Added after the workshop: zoom buttons, the table view ("Simple View") and a guidance sidebar.
- Soft-launched in September 2025 with 55 nodes and 68 links.
- Lighthouse accessibility 99/100. WAVE found no errors.

**From the rebuild repo (`REPORT.md`, read-only):**

- HHCD data: 17 projects, 12 methods, 10 people, 9 partners, 103 connections (48 entries).
- Every entry has a static page, and pages work without JavaScript.
- axe found 0 violations on every main page at 1440px and 390px. All 27 contrast pairings pass. 49 unit tests and 40 browser tests pass.
- The map works by keyboard: a roving tabindex, arrow keys, and an announced name, type and connection count.
- At 320px, nothing scrolls sideways.
- Not yet tested with a screen reader, in Safari or in Firefox. Not deployed.

## Image inventory

| Status | Image | Reason |
|---|---|---|
| Keep | Paper figs 1, 4 (geographic prototypes) | Shows what came before the network |
| Keep | Paper figs 15, 16 (VOICE graph and table views) | Proof that VOICE was built and launched |
| Keep | Paper fig. 12 (Wall Three: features ranked) | The one workshop photo that drove decisions |
| Keep | Paper fig. 22 (WAVE result, cropped to the summary) | Automated accessibility evidence |
| Keep | Rebuild `explore-1440`, `explore-390`, `project-1440` | Column view, phone layout, entry page |
| Cut | Paper figs 6–8 (star-field) | Not to be mentioned |
| Cut | Paper figs 2, 3, 5, 17–21 | Duplicates, or too much text to read |
| Cut | Paper figs 9–11, 23; rebuild `home-*`, `project-390` | Process material that carries no decision, or an unused homepage |
| Redraw | Paper figs 13, 14 (knowledge structure) | Becomes the `four-types` before / after, in the site's style |
| Missing | HHCD free-network map | Cover |
| Missing | Table view; keyboard recording | Can be captured locally from the rebuild without changing it |
| Missing | Dark-mode screens | The product has none. Use a mount on `--accent-2` |

## Gaps

1. When did the HHCD original launch? Is the Centre using it now? This decides "taken up by" versus "reused by".
2. Is the free / columns switch built? Needed for the cover and the signature module.
3. Map-first decision: keep one sentence in `three-views`, or leave it out?
4. Does the teaching get one line (in `role`), or none?
5. Will the rebuild be deployed? Is there a link?
6. Has it been tested with a screen reader (for example VoiceOver)?
7. What failed first? What would you change now?
8. The case study's name. "HHCD Data Platform" doesn't cover VOICE. Keep the slug `hhcd-data-platform`.

## Id changes (for `SHARED-CHANGES.md` at build)

| Old ids | New ids |
|---|---|
| `problem`, `data-model`, `dual-view`, `one-example-first`, `tokens-and-publishing`, `rebuild`, `origin` | the 11 above |

The AI conversation's eval set and the fallback defaults reference `dual-view`.
