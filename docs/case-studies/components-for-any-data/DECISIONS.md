# Components for Any Data: decisions for Chongbo

Things built on a best guess, or still open. Each says what was done and what to decide.

1. **Status shown on the home tray and the share image: "In use".** The schema's options are Live / In use / Shipped / Concept. The store and its components are in the product; the data connection isn't launched yet. "In use" is the closest true value. Decide: keep, or add a status such as "In development" (would state progress, which the copy avoids).
2. **"74" streams (03.1).** Kept, as you asked. It's the dev organisation's count from the backend proposal.
3. **"Front end and server" (cover role line).** If the server side isn't finished when someone asks, say so in an interview.
4. **Old address.** `/work/component-store` now returns 404. Any link already sent out (CV, applications) breaks. A redirect would keep the product's name in a URL that resolves. Decide: add a redirect in `next.config.ts` (shared file), or leave it.
5. **ECharts named (02.1, and in the project's stack).** You approved naming it. The stack also lists React, TypeScript and Tailwind; it's only shown by the AI catalogue, not on the page.
6. **Design system:** no longer mentioned on this page (the closing role card became a Takeaway). It gets its own project (`PROMPT-design-system.md`).
7. **Printer routing.** "Have you built a design system?" now prints another project first; the test checks only that the sheet shows design systems. Back-end and API questions now route to the pipeline card (`data-architecture` signal, 12 Oct); only "databases" is still reported as missing.
8. **Hover-only values.** Exact chart values show on hover and in a table for screen readers; a sighted keyboard user sees the axis, the largest value and (donut, treemap) the labels. A "Show as table" switch would close that gap.
9. **Not tested here:** VoiceOver with Safari (playbook §8 step 7). The automated checks (axe, every text contrast pair, keyboard walk of the demo) pass.
10. **Site-wide, not this project:** there is no favicon (`/favicon.ico` returns 404 on every page).

## 12 October 2026

- **AI tools (01.3).** Chongbo: "I used Claude Code and Cursor to write the front end and the server." One sentence on the pipeline card, which covers both, and the `ai-tools` signal. The home page's "AI tools" card is offered again.
- **Status: none, on every project.** Chongbo: "不写状态，所有项目的状态都去掉" (no status on any project). The field is gone from the schema, the four content files, the case-file facts, the tray, the share image and the AI catalogue. Item 1 is closed.
- **Old address (item 4).** Nothing on the site links to `/work/component-store`; only old docs mention it. No redirect unless Chongbo has sent that link out (CV, applications).
- **"74" (item 2).** Kept; Chongbo will be ready to say where it comes from.
- **Table view (item 8).** The work sheet's chart switch has a fourth option, Table: the same totals with exact values, visible without hovering.

## 12 October 2026 · card redesign (branch `case/components-for-any-data`)

Words unchanged; layout and evidence redone. To decide:

- **Three parts, with openers** like Nike's: 01 The model (shapes, contract, pipeline), 02 The interface (fit, axis pickers), 03 Outcome (takeaway). The part titles are new copy; card numbers change (stream fit was 01.4, now 02.1).
- **01.1** Three streams as strips: each field that plays a role carries the role's colour, so the same meaning lands in different columns; the missing value is a dashed cell.
- **01.2** The code block became a Contract / Code switch: the contract's three roles across the top, the four components that declare it (bar, pie, treemap, waterfall) drawn from the sample data below. The code is unchanged, one tab away.
- **01.3** On the dark sheet: one record down five numbered layers, each role a coloured wire from the adapter to the chart, and a line for what charts, filters and forms read.
- **02.1** Before and after: "74 streams, by row count" beside "Grouped by fit", the server as one line under them. Stream names in this card are invented and new (telematics.pings, depot_b.scans and so on); counts add up to 74 (2 + 2 + 70).
- **02.2** On the blue field: the pickers sit on the chart's own axes (value by the y axis, category under the x axis, period top right), with a switch between three streams. partner_carrier.feed shows the empty state.
- **03.1** The takeaway's three points as three columns with large numbers; the empty gap under the title is gone.
- **Height.** At 1440 × 900 every card fits one screen. At 1280 × 720 the shapes, pipeline, fit and axis cards run 25 to 70px past it, mostly because of three-paragraph bodies; cutting a sentence from 01.3 and 02.1 would close it.
- **Not checked here:** the production build (Google Fonts can't be fetched from this sandbox, an existing WildEcho dependency), so the e2e suite didn't run. Typecheck, lint, unit tests, contrast (193 pairs) and axe in both modes pass.

### Second pass: each card composed for its content

Chongbo: the cards shouldn't all be "claim left, text right, evidence under". Each card is now placed on its own grid (`src/components/case/any-data/compositions.css`, project-owned; the shared head is unwrapped with `display: contents` on sheets 640px and wider):

- **01.1 poster.** Large claim; the question set as a pull line; the strips run off the card's right edge.
- **01.2 split sheet.** Reasoning on the left; the contract on a full-height datasheet pane on the right (roles as a spec table).
- **01.3 schematic.** The five layers now run left to right, with each role as a coloured lane from the adapter into the chart, on a band across the card. The reasoning sits at the foot; "Claude Code and Cursor" is a note beside the claim.
- **02.1 halves.** The card itself is split, before on a tint and after on paper. Each paragraph sits over its half, "74" is set large, and the server is a band across the foot.
- **02.2 field.** The whole card is on the blue field, the chart comes first, and the claim and two paragraphs sit in three columns underneath.

No words changed. At 1280 × 720 02.1 is 5px over one screen; every other card fits at every review size. Axe passes in light, dark and phone.

## 12 October 2026 · the work sheet

- **Panel redesigned as a component inspector.** Preview on the left (chart type, chart, rows as they arrive); settings on the right (Data: one radio list with Sample data first, then Fits / Partly fits / Other, CSV upload; Fields: one property row per role with its suggestion's confidence). Compact controls, sentence-case section headings, mono only for data. Fits one screen at 1440 × 900 and 1280 × 720.
- **Sheet on white with a fine blue grid** (dark mode: the dark paper with the same grid), instead of the blue field.
- **Title and the line under it.** Chongbo asked for plain portfolio wording on confidentiality. Title: "The preview panel, rebuilt for this case study". Line: "The product is confidential, so this is an independent rebuild of its preview panel, with invented data and no production code." (Phrasing follows the common advice to say once, plainly, that work under NDA is an independent rebuild on synthetic data.)
- `Roles.tsx` removed (only the old panel used it).
