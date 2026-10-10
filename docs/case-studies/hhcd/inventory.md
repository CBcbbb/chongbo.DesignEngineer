# Helen Hamlyn Centre Data Platform: card inventory

Title: **Helen Hamlyn Centre Data Platform**. Slug stays `hhcd-data-platform`.

Playbook §8 step 3. Approved headings, 10 October 2026. Body copy is step 4.

## Framing

- **One case, one tool.** An accessible map of a research network. It was first built for an EU-funded research project (VOICE), then taken up by the Helen Hamlyn Centre for Design with its own data and brand.
- **The focus is accessibility and responsive design.** Early work is kept short, apart from the data model.
- **It's a tool, not a website.** It opens straight on the map. The copy doesn't explain this choice.
- **Never mention:** the star-field wireframe, why VOICE is no longer online, or the paper's withdrawal. The interns are a side note at most.

## Cards, in canonical order

Capabilities follow playbook §2. Lens roles: `lead` (opens here), `in` (printed), `·` (not printed).

| id | Heading | Capabilities | ux | engineer | web | Evidence | Gaps |
|---|---|---|---|---|---|---|---|
| `brief` | Accessibility as the starting point | E | lead | in | · | VOICE graph view (paper fig. 15) | |
| `no-borders` | A network instead of a geographical map | D, research | in | · | · | Geographic prototypes A and B (paper figs 1, 4), then the network | |
| `workshop` | Features ranked by 14 stakeholders | research, E | in | · | · | Wall Three photo (paper fig. 12) and a redrawn ranking | [vote counts, optional] [higher-resolution Wall Three photo] |
| `four-types` | Why the data is collected by person but mapped by type | B, C | in | in | · | Redrawn diagram: one person-first row becomes four linked record types | |
| `three-views` | Three views of the same network | E, D | in | lead | in | **Signature module:** the Constellation / By type switch (animated move of the same entries), plus the table | |
| `keyboard` | Accessibility – keyboard navigation | E, D | · | in | · | Recording of arrow-key navigation in both arrangements | |
| `narrow-screens` | Responsive design | E, D | in | in | in | `path-390.png`: details as a sheet over the map | |
| `contrast` | Accessibility – colour contrast | E, C | · | in | in | Map names in the original brand colours as bold large text; darker variants when zoomed out. WAVE result cropped (paper fig. 22) | |
| `own-page` | A link for every person, project and method | E, B | · | in | lead | Rebuild project page (`project-1440.png`) | [public URL of the deployed rebuild] |
| `outcome` | Launched, then taken up by the Helen Hamlyn Centre | B | in | in | in | Metric strip: Lighthouse 99 · WAVE 0 errors · axe 0 violations · 27/27 contrast pairs | |
| `role` | Designed, specified and built alone | B, F | in | in | in | None needed | |

Dropped: `homepage-removed`. The turn isn't needed, and the map-first decision isn't written up.

Proposed, not yet agreed: a `guide` card for the first-visit guide inside the map (D, E).

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
- The Centre uses the platform now. No launch date in the copy.
- No teaching line, and no "what failed / what I'd change" in the copy.
- In the final design, the map is the homepage, because it's a tool, not a marketing site. The map is free by default, with an option to sort it into four columns.

**From the DRS 2026 paper (Chongbo's own unpublished record, VOICE):**

- EU / Innovate UK funded. Seven consortium partners.
- The workshop: 14 participants, a 75-minute sprint, three walls (content, scope, functionality), and role-play with seven stakeholder cards.
- The top three features were filters, search and visible connections. Translation got fewer votes, but participants argued for it and it was kept.
- Added after the workshop: zoom buttons, the table view ("Simple View") and a guidance sidebar.
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
- Not yet tested with a screen reader, in Safari or in Firefox (REPORT.md). Deployed by Chongbo [public URL].

## Image inventory

| Status | Image | Reason |
|---|---|---|
| Keep | Paper figs 1, 4 (geographic prototypes) | Shows what came before the network |
| Keep | Paper figs 15, 16 (VOICE graph and table views) | Proof that VOICE was built and launched |
| Keep | Paper fig. 12 (Wall Three: features ranked) | The one workshop photo that drove decisions |
| Keep | Paper fig. 22 (WAVE result, cropped to the summary) | Automated accessibility evidence |
| Keep | Rebuild `columns-1440`, `path-390`, `table-1440`, `project-1440` | Columns arrangement, phone sheet, table, entry page |
| Keep | Rebuild `home-1440` (guide's first card) | Only if the `guide` card is agreed |
| Cut | Paper figs 6–8 (star-field) | Not to be mentioned |
| Cut | Paper figs 2, 3, 5, 17–21 | Duplicates, or too much text to read |
| Cut | Paper figs 9–11, 23; rebuild `home-390`, `columns-390`, `path-1440`, `table-390`, `project-390` | Process material that carries no decision, or duplicates |
| Redraw | Paper figs 13, 14 (knowledge structure) | Becomes the `four-types` before / after, in the site's style |
| Capture | Constellation with no guide card, 1440px | Cover. Test capture works locally |
| Capture | Keyboard recording in both arrangements; the switch as video | Captured locally from the rebuild without changing it |
| Missing | Dark-mode screens | The product has none. Use a mount on `--accent-2` |

## Gaps

1. The public URL of the deployed rebuild. The link given is the Vercel dashboard, which needs a sign-in.
2. Does the Centre now use the rebuild, or still the original?
3. Has it been tested with a screen reader (for example VoiceOver)?
4. Should the guide get its own card?

## Id changes (for `SHARED-CHANGES.md` at build)

| Old ids | New ids |
|---|---|
| `problem`, `data-model`, `dual-view`, `one-example-first`, `tokens-and-publishing`, `rebuild`, `origin` | the cards above |

The AI conversation's eval set and the fallback defaults reference `dual-view`.
