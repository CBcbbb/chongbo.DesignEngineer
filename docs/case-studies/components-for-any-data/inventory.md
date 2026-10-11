# Components for Any Data: card inventory

Playbook §8 step 3. Draft 1, 11 October 2026. Approved by Chongbo, 11 October 2026 (decisions below). Copy is in `copy.md`.

Title: **Components for Any Data** (was "Component Store", a product name, which §9 rules out). Proposed slug: `components-for-any-data` (see "Slug" below).

## Framing

- **One idea.** An infrastructure company can't design for its customers' data, because it never sees it. So the components are designed for the *shape* of data, and the customer connects their own.
- **The thread through every card:** an engineering decision, and what the user sees because of it. The project proves I solve engineering problems, and solve them from the user's side: when work is left to the user, I design how they do it.
- **The turn:** the engineering answer was to list every stream; the user wants to know which stream fits. Streams are ranked by fit, and fit is judged on the server.
- **No status, no progress.** The data connection hasn't launched. The copy describes what the system does and the decisions behind it, never how far along it is, how many components are connected, or that it's in use. Nothing implies it has shipped.
- **Design system: out.** It moves to its own project (`PROMPT-design-system.md`). `token-layers` and `contrast-in-tokens` leave this file.

## Never shown or named

The employer, its product names (including "Component Store", "Flow Lab", "FarPoint" and the other navigation items), customers, the storage technology, stream names, charge codes, component names that reveal the domain (port calls, vessels, charges, OD pairings), file paths, endpoint paths, internal document names, and real screenshots. The screenshot Chongbo shared on 11 Oct contains the company name, his work email, customer names and port codes: **reference only, never in the repo**.

## Cover

| Field | Draft |
|---|---|
| Client | Logistics infrastructure company |
| Title | Components for Any Data |
| Line | `[step 4]` What it is: a component library that customers preview with their own data before building with it |
| Role | Design Engineer (UX design and front end) |
| roleSplit | one person: data model, interface, front end and server, on my own |
| Outcome | `[step 4]` What the design achieves, not a status |
| What this shows | Systems and reuse (C) · Idea to production (B) · Craft and interaction (D) |

**The work** (sheet after the cover): the signature module, a working re-creation on invented data (see "Signature module").

## Cards, in canonical order

Lens roles: `lead` (opens here), `in` (printed), `·` (not printed).

| id | Heading (the claim) | Capabilities | ux | engineer | web | Evidence | Gaps |
|---|---|---|---|---|---|---|---|
| | **Part 1 · What a component is** | | | | | | |
| `templates` | Templates made of components | C | in | in | · | Diagram: a template as a layout of component slots; the store sits under Templates | |
| `sample-data` | Sample data that follows the same rules as real data | C, B | in | in | · | One chart, Sample / My stream toggle (from the demo) | |
| `three-kinds` | Which components connect, and which ask the user | C, D | in | in | · | Rebuilt store filter: connects to a stream · reads the page (filters, search) · user input (forms) · static; tags on the cards | |
| | **Part 2 · The contract** | | | | | | |
| `contract` | A component promises a shape, not field names | C, B | in | lead | · | Code: a short contract written for the site (roles, types, required, key) | |
| `one-per-dataset` | One contract per dataset | C | in | in | · | One mapped dataset drawn as bar, pie and treemap; the mapping stays when you switch | |
| `binding-only` | Data comes through the binding, never through settings | B, C | · | in | · | Diagram: producer → adapter → binding → contract → component, with sample and page draft feeding in | |
| | **Part 3 · Connecting your own data** | | | | | | |
| `stream-fit` | Streams ranked by fit, not listed by size | D, B | lead | in | in | Before / after picker, rebuilt: one long list by row count → Fits · Partly fits ("3 of 5 fields") · Other, collapsed and searchable | |
| `fit-on-server` | Fit judged on the server | B, C | · | in | · | Diagram: one endpoint, two phases behind it (the read the platform already makes → a stored field profile per stream) | |
| `axis-pickers` | Each field picked like a chart axis | D | in | in | in | Demo state: each role with its dropdown of stream fields, suggested matches marked exact / known / close | Reference screens of the side panel |
| | **Close** | | | | | | |
| `role` | `[step 4]` | B | in | in | · | Facts: context, what was mine | |

10 cards. `page-draft` cut (11 Oct): strong engineering, but the furthest from the user thread.

## Signature module

A small, working re-creation of the store's preview panel, written from scratch for the site, on invented data.

- Three invented streams with the same meaning and different field names and formats (e.g. `eta_ts`, `arrivalTime`, `ArrDate`).
- Pick a stream: fields are suggested for each role, marked exact / known / close; every role has a dropdown, like choosing a chart's axes.
- The picker ranks the streams by fit. One fits, one partly fits ("2 of 3 fields"), one doesn't.
- Switch between three charts on the same contract: the mapping stays.
- Optional: drop a CSV, read in the browser and never uploaded.
- Accessible: every control a native element, keyboard first; the chart has a table alternative; still with reduced motion.

Domain: invented deliveries from three depots (places, counts, dates). Chosen 11 Oct. Never ports, vessels, charges or real company names.

## Facts and their sources

Copy may only use these, or what Chongbo adds later.

**From Chongbo, in this conversation:**
- The contract model, the store's interface, the front-end code and the backend proposal were all his.
- It hasn't launched; it will soon. Don't say how far along it is.
- The hardest problem was defining the relationship between components and templates: what a component is; whether it holds sample or real data; with so many kinds of real data, which connect through fields, which can't, and which need the user to input or choose.
- A template is a layout made of components.
- From the engineering side, the team wanted to list every stream; the user wants to see which stream matches best.
- Users may not be technical: they need to understand what to do and what comes next.
- Every field has a dropdown, so picking data is like choosing the axes of a chart.
- Design system goes to a separate project.

**From the plan (11 Oct, Chongbo's own document):**
- Before: components drew their own demo data from props, with no way to point them at a real stream.
- The model follows a chart library's approach: a component promises a data shape; each page maps its stream's fields onto that shape.
- Six parts: contract, sample, binding, adapter, action, preset.
- One contract per dataset, not per component.
- Data comes only from the binding, never from props; props are for configuration. Components never subscribe to streams. No chart makes data up.
- Slots on the same dataset share one page draft: an edit in one table is what the summaries read.
- The store is a place to preview, with sample data or a stream you try; nothing in it is saved. Connecting data on live pages is a separate future project, out of scope on purpose.
- Some components stay static by design: forms and editors whose data goes out; controls read page state, not streams.
- Field matching uses aliases and industry vocabulary.

**From the backend proposal (8 Oct, Chongbo's own document):**
- The picker listed every stream in the org, sorted by row count; most don't fit the component being previewed, and users found out only after picking one.
- The browser can't judge fit: a stream record has a name, row count and timestamps, but no field names.
- Proposal: one fit endpoint, paged and searchable; phase 1 uses the entry the platform already reads (no extra load); phase 2 a stored field profile per stream, at the same cost for 50 streams or 5,000. The UI never changes between phases.
- Groups: Fits (every required field), Partly fits ("3 of 5 fields"), Other (collapsed, searchable). An empty stream shows "Unknown", never "doesn't fit".
- The picker and the field matching use the same matcher, so they never disagree.
- Private streams are filtered on the server.

**From the screenshot (11 Oct, reference only):**
- The store is a tab under Templates, beside the user's own and shared templates.
- Filters by type (tables, cards, charts, forms and search, flows) and by data (stream-ready, not connected yet, controls, inputs, static); search covers components and fields; each card carries a data tag and its base type.

## Image inventory

| Status | Image | Reason |
|---|---|---|
| Reference only | Store screenshot (11 Oct) | Names the company, customers and Chongbo's work email. Used to rebuild the filter and cards with invented content |
| Build | The signature module (the work sheet; states reused in `sample-data`, `one-per-dataset`, `axis-pickers`) | Product in use, without company data or code |
| Build | Rebuilt filter and cards (`three-kinds`), rebuilt picker before / after (`stream-fit`) | Same |
| Redraw | Templates and slots (`templates`); the pipeline (`binding-only`); two phases behind one endpoint (`fit-on-server`) | Structural decisions lead with a diagram (§6) |
| Write | Contract code for the site (`contract`) | Illustrative, not the real source |
| Cut | `DataContractsDiagram` ("three layers, two contracts") | Describes an earlier version of the model |
| Move | `TokenLayersDiagram`, the contrast code | To the design system project |
| Missing | Side panel with Sample / My stream and the field dropdowns; the current stream picker | Reference for the rebuild, never published |
| Missing | Dark-mode screens | Not needed: everything is rebuilt, so it's designed in both modes |

## Decisions (11 Oct)

- Role: Design Engineer; UX design and front end, defined from what Chongbo described.
- Demo domain: invented deliveries.
- ECharts may be named as the model the contract follows.
- Slug becomes `components-for-any-data`.
- Merge only with Chongbo's approval.
- Copy draft 2 approved: Outcome as written; 74 streams stays; no "what I'd do now".
- Closing card notes that every component and the store follow the design system he built (11 Oct). The ChatGPT summary's card-kinds split is not used.
- Stream fit is Chongbo's own work, server included; never "proposed to the backend team".

## Gaps

1. Reference screens: side panel, field dropdowns, stream picker (Chongbo to send).
2. ~~The closing card's "what I'd do now"~~: not for now (11 Oct).

## Slug

`component-store` names the product in the URL. Proposed `components-for-any-data`. This changes ids in shared files (`src/lib/ask/fallback.ts`, `src/lib/ask/model.ts`, `src/lib/site.ts`): to be noted in `SHARED-CHANGES.md` at the build. Section ids change too: `contracts` becomes `contract`; `problem`, `mapping`, `token-layers`, `contrast-in-tokens`, `outcome` go.
