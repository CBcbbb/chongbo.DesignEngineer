# One Design System, Three Products: card inventory

Playbook §8 step 3. Draft 1, 12 October 2026. Chongbo's decisions of 12 October are under "Decisions". Headings are working claims, finished in step 4 (copy). Every fact traces to "Facts and their sources" below.

Capabilities: **C systems and reuse (lead)** · E accessible, fast, findable · B idea to production · D craft and interaction.

## Framing

- **One idea.** One company, three products, and customers who put their own brand on top. A colour system has to hold for all three, so the scales fix *lightness* per step and leave *hue* free: components ask for a role (success, warning), and the role stays readable whatever the hue.
- **The tension.** The three products shared only the brand colour; everything else had drifted apart.
- **The turn.** The customer layer first passed the chosen colour straight through. A pale yellow put white text on it at 1.07:1; a navy used as text on the dark background read at 2.99:1. The fix applies the scales' own rule to the customer's colour: their hue is kept, the system sets the lightness of anything used as text.
- **Size.** A short main project: 9 cards. It is the only project that leads on C, and Granola's JD names "a design system in Figma and code" outright, so it earns more than the 4–6 of earlier work. Two cards are merge candidates if it reads long (see "Merge candidates").
- **Evidence is rebuilt, never copied.** The company's files, screens and brand stay private. Every picture on the page is either code written for the site or a Figma file rebuilt on an invented brand (see "Rebuilt in Figma"). The work sheet says so once, in its title, as Components for Any Data does.

## Never shown or named

The employer, its products, customers, storage technology, package name, init script name, file paths, internal stylesheet names, the brand's hex or OKLCH values and its logo. Chongbo's Figma file (`Foundations / Tokens for Platform`) and the two CSS files in his Downloads folder are **reference only, never in the repo**.

## Cover

| Field | Draft |
|---|---|
| Client | Logistics infrastructure company |
| Title | One Design System, Three Products (alternatives below) |
| Line | `[step 4]` What it is: the colours, components and themes behind three products and every customer's brand |
| Role | Design Engineer |
| roleSplit | one person: Figma library, colour scales and CSS, on my own (the package and init script are not claimed) |
| Outcome | `[step 4]` Three products that look like one company; customers rebrand without losing contrast `[the second half only once the fix ships]` |
| What this shows | Systems and reuse (C) · Contrast by construction (E) · Figma to code (B) |

**The work** (sheet after the cover): the signature module, titled "The system, rebuilt on an invented brand".

### Name

1. **One Design System, Three Products**: plain, says the scale. Recommended.
2. **One Design System, Five Product Lines**: the prompt's version; longer, and "product lines" is less familiar to readers outside B2B.
3. **Readable in Any Brand**: leads with the turn; undersells the systems work, which is the lead capability.

Slug: `design-system`.

## Cards, in canonical order

Lens roles: `lead` (opens here), `in` (printed), `·` (not printed).

| # | id | Heading (the claim) | Caps | ux | engineer | web | Evidence | Gaps |
|---|---|---|---|---|---|---|---|---|
| | | **Part 1 · One system for three products** | | | | | | |
| 01.1 | `drift` | Three products, drifting from the first | C | in | in | · | Drawn: the first product, then the two later ones on the same tokens, each with its own radii, buttons, type and spacing | |
| 01.2 | `figma-to-code` | From a Figma library to shared code | C B | in | in | lead | Rebuilt Figma (component sets, variables Light / Dark) beside the same components as code | |
| 01.3 | `three-layers` | Three layers: shared, product, customer | C B | · | lead | in | Diagram: shared package → one product's overrides → a customer's colour, font and button shape | |
| | | **Part 2 · Accessibility built into the colours** | | | | | | |
| 02.1 | `roles` | Components ask for a role, not a colour | C E | in | in | in | Colour specimens: six hues × five steps, each step labelled with its job | |
| 02.2 | `fixed-lightness` | The same lightness on every hue | E | in | in | in | Numbers set large: 30 of 30 · 5.16:1 lowest · 2 modes | |
| 02.3 | `dark` | Dark mode designed step by step | E D | in | · | in | The specimens with a Light / Dark switch | |
| 02.4 | `customer-colour` | Readable with any customer's colour | D E B | lead | in | in | The signature module on pale yellow, "Passed through" / "Derived" switch, ratios shown | `[the fix ships]` |
| | | **Close** | | | | | | |
| — | `outcome` | `[step 4]` | C | in | in | · | Statement card: results by part, role in full (no numbers: what happened) | |

### What each card proves on its own

- `drift`: the problem is real and organisational, not cosmetic.
- `extend-shadcn`: judgement; the cheapest path that fixes the problem, chosen over a rewrite.
- `figma-to-code`: a design system built in Figma and shipped as shared code (the JD's "Figma and code").
- `three-layers`: architecture; each layer overrides only what it owns.
- `roles`: the naming decision that lets one component work in any theme.
- `fixed-lightness`: why the roles stay readable, with numbers.
- `dark`: dark mode as design work, not an inversion.
- `customer-colour`: the turn; the rule extended to colours the system doesn't control.
- `outcome`: results in the business's terms, and the role.

### Merge candidates

If 9 reads long in step 4: merge `fixed-lightness` into `roles` (numbers at the foot of the specimen), and `extend-shadcn` into `drift`. That gives 7. Keeping them apart helps the printer: each prints on its own for "accessibility" or "design systems".

## Signature module

**A theme switcher on one set of real components**, written for the site in React and Tailwind, on an invented brand.

- One panel of components: buttons (primary, outline, ghost), a text input with error state, a select, status badges and alerts (success, warning, error, info), pagination.
- Three invented customers, each with a colour, a font and a button shape (pill, soft, sharp), plus **Your colour**: a native colour input. Light / Dark switch.
- Every text pairing on screen shows its live contrast ratio on demand (a "Show ratios" toggle), so the claim is checkable.
- Your colour runs through the same derivation as the product fix: the fill stays yours, text on it switches between dark and light, text in your colour moves in lightness only until 4.5:1.
- The customer-colour card opens it on pale yellow, with a "Passed through" / "Derived" switch: the first version against the fix.
- Accessible: native inputs, keyboard first, still with reduced motion.

Invented customers (draft): a grocer in green, a courier in ochre, a bank in navy. Never real brands.

## Rebuilt in Figma

Chongbo's real Figma file can't be shown, and the Figma connector can't open it (view-only seat on the company team). So the evidence for `figma-to-code` is **the same system rebuilt in a new Figma file in his personal team**, through the Figma MCP, on the invented brand:

- **Colours page**: six hues × five steps with their roles; light and dark side by side.
- **Components page**: component sets with variants and states, matching what the original has (buttons in six styles × three states, text input default / focus / error, select and multi-select, pagination item and set, header, breadcrumb).
- **Variables** (the original used them): one collection with Light and Dark modes, using the same role names as the CSS.

Chongbo reviews and edits it in Figma, so it's his file to walk through in an interview. The page never presents it as the original; the work sheet's title says the system is rebuilt on an invented brand.

## Image inventory

| Asset | Decision | Reason |
|---|---|---|
| Chongbo's Figma file (components, brand guide, colours, theme reference) | **Cut** (reference only) | Company work; the brand guide shows the brand's colours |
| `tokens.css`, `globals.css` (Downloads) | **Cut** (reference only) | Names the company and package; the structure and rules are rebuilt |
| `TokenLayersDiagram.tsx` (old) | **Redraw** → `three-layers` | Its per-app examples (density, accent, type scale) are invented; the redraw uses the kinds of override the real file makes |
| Old CSS snippet (`--success: var(--green-500)` …) | **Redraw** → `extend-shadcn` code | Same idea, invented values, shadcn's tokens first |
| Three-products picture | **Missing → draw** | `drift` needs it; abstract frames, no real screens |
| Figma screenshots | **Missing → rebuild** (see above) | `figma-to-code` |
| Colour specimens, dark switch | **Build** in code | `roles`, `dark` (media `specimens`, `toggle`) |
| Contrast figures | **Build** (metric strip) | `fixed-lightness`; computed from the scales, re-checked by `npm run contrast` |
| Theme switcher | **Build** | The work and `customer-colour` |

Nothing for `docs/ASSETS.md`: every image is made for the site.

## Colour

Proposal: **ochre**. Blue is taken (Components for Any Data, and the company's own colour), and so are orange (Nike), red (actions), and HHCD's purple, magenta, orange and green.

Ochre is also the colour that broke the first version: the project's own colour is the proof that a pale, warm brand can stay readable.

| Token | Light | Dark | Check |
|---|---|---|---|
| `--field` | `#e0b12a` | deeper ochre `[step 5]` | ink on field 8.9:1 |
| `--accent` | `#7a5800` | `#e9c25a` | 6.5:1 on white, 5.8:1 on paper · 10.7:1 on dark paper |

To fix in step 5: the light field is 2.0:1 against white paper, below the 3:1 a boundary needs, so the cover band needs a rule or a deeper `--accent-2`.

Cover art: the scales themselves, six columns of five swatches running off the top-right corner and fading before the title.

## Facts and their sources

Copy may only use these, or what Chongbo adds later.

**From Chongbo, in conversation (12 Oct):**
- Three layers. Two internal: one shared by every product, one specific to each product. A third for customers, who apply their own colours; users within a customer can override it again.
- Before: one company, three products; only the brand colour was shared, everything else did its own thing.
- The decision he'd defend: building on shadcn, because the products were already using it.
- He designed the system in Figma (palettes, component library, light and dark) and wrote the CSS.
- Outcome: the products finally look like one company; the system is easier to control and to design for.
- Before, the colours were the same in every product, but corner radii, buttons, type and, most visibly, spacing differed: the same palette gave different-looking products.
- The original Figma file used variables.
- No numbers to state.
- He doesn't recall who wrote the package and the init script: not claimed.
- Responsive design was part of it (no specific evidence yet: body text only).
- He will ship the contrast fix (`customer-colour`).
- From Chongbo's check of the product code (12 Oct): both colour paths accept any colour; nothing checks contrast; the chosen colour is written straight into the primary tokens.

**From the CSS (reference copies, 12 Oct):**
- The shared file is the package; each product imports it and overrides only what it needs.
- Built on shadcn and Tailwind 4, colours in OKLCH.
- Six hues (brand, blue, green, red, purple, amber), five steps each: 50 surface, 200 border, 500 charts and icons, 600 text on white, 700 text on the 50 surface.
- Six role families: primary, success, warning, destructive, info, categorical. Amber is for warnings only.
- Dark scales are re-tuned per step (200 chroma held at 0.07 so borders don't glow; 600 and 700 lightness raised for text on dark).
- The product layer derives its fixes from tokens (e.g. a menu highlight mixed from the hover and active tokens), never raw values.
- The customer layer sets colour, font, button shape (pill, soft, square, sharp) and button style.

**Computed (12 Oct, from the CSS values):** 30 of 30 text pairings pass WCAG AA (600 on white, 700 on 50, and in dark mode 600 on the background and the card, 700 on 50); lowest 5.16:1. A pale yellow with white text: 1.07:1. Navy text on the dark background: 2.99:1. Re-check with `npm run contrast` at the build.

## Gaps

1. `[the fix ships]`: `customer-colour` and the Outcome's second half are written as done only once the derivation is live in the product. Until then, they're drafted both ways.
Resolved 12 Oct: what differed (radii, buttons, type, spacing); variables (yes); numbers (none); package and init script (not claimed). The guess that the three products drifted because each edited its own shadcn copies is **not used** (Chongbo: not right, or not sure).

### What extending shadcn cost (from the CSS, for `extend-shadcn`)

- shadcn's `--accent` is a quiet hover fill, not a brand accent. In dark mode a menu's highlight on `--secondary` was nearly invisible; the product layer re-derives it from the hover and active tokens.
- shadcn's components carry their own radii (the select menu's `rounded-2xl`); matching them meant overrides per component through `data-slot` selectors, a few with `!important`.
- shadcn has one status colour (`destructive`). Success, warning, info and categorical were added in its naming pattern (`-foreground`, plus `-container`, `-border`, `-text`), so the new roles read like shadcn's own.

## Draft 2 (Chongbo's review of the copy, 12 Oct)

- Story: one main product; new products took only its first tokens and drifted, built fast by different teams.
- `extend-shadcn` cut: shadcn was the main product's base, not every product's; it's a reference, mentioned in the Figma card.
- `figma-first` → `figma-library`: Figma is for sketching ideas in the system; he builds in code with AI tools. Show that he can build a design system in Figma, not that it's complete. No screen sizes.
- Part 3 is accessibility.
- 8 cards.
- Three products in all (Chongbo, 12 Oct; earlier "five"): the main one and two later ones. AI coding tools may be named in 01.1.
- 02.1 is about delivery: he shipped the system as shared code everyone builds with and that stays up to date, not as a Figma file. Whether Figma and CSS names match doesn't matter.

## Decisions (12 October 2026)

- **Name:** One Design System, Three Products. Slug `design-system`.
- **Colour:** ochre.
- **Size:** 9 cards, kept apart (no merges), so each prints on its own.
- **`extend-shadcn`:** the reason is that the products already used shadcn; its cost is the three points above, all from the CSS. No claim about why the products drifted.
- **Evidence:** rebuilt in a Figma file in Chongbo's personal team (variables, Light and Dark modes) and in code on the site, on an invented brand.

## Shared files (proposed in `SHARED-CHANGES.md` at the build)

- `content/index.ts`: import the project; place in the tray `[after Components for Any Data?]`.
- `src/lib/site.ts`: `TRAY_PLACE` label.
- `src/app/case-palettes.css`: palette `design-system` (ochre).
- `content/schema.ts` / `casefile/icons.tsx`: cover art `"scales"`; maybe a capability icon for E's "Contrast by construction".
- `src/lib/ask/*` (AI conversation): "Design systems" and "Consistency across platforms" now have a project; the printer should stop reporting "Consistency across platforms" as missing.
