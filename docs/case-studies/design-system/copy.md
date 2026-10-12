# One Design System, Five Products: copy (draft 3, 12 Oct)

Playbook §8 step 4. Every line traces to "Facts and their sources" in `inventory.md`. `[Brackets]` mark what isn't confirmed yet. Nothing states status or progress.

**Draft 2 (Chongbo's review, 12 Oct):** the story starts from one main product whose tokens were carried into new products and drifted; shadcn is a reference, folded into the Figma card (the `extend-shadcn` card is cut); Figma is a library for sketching in the system, not a spec, and screen sizes aren't mentioned; Part 3 is about accessibility. 8 cards.

**Draft 3 (playbook §4–5 pass, 12 Oct):** two parts (building the system · accessibility); 02.1 merged into one claim about shipping code; bodies no longer restate headings; the cover's outcome and the closing card no longer repeat each other; "I" in every card that is my decision.

**Story.** The company began with one product. New products took only its first tokens, and were built fast by different teams, so each drifted further from the others. I moved the colours, roles and component styles into one shared package with layers for each product and each customer, and built the system in Figma so ideas are sketched in it before they're built in code. Accessibility sits in the colours themselves: text steps at almost one lightness on every hue, a dark mode tuned step by step, and the same rule applied to customer colours, which first passed straight through.

---

## Cover

Logistics infrastructure company

# One Design System, Five Products

The shared colours and components behind five products, and every customer's brand on top.

- **Role:** Design Engineer · Figma library, colour scales and code · on my own
- **Outcome:** Five products that read as one company again, in any customer's brand. `[the last clause once the fix ships]`
- **What this shows:** Design system (C) · Accessibility in the colours (E) · Figma to code (B)

## The work

The system, rebuilt on an invented brand.

---

## Part 1 · One system for five products

### 01.1 Five products, drifting from the first

The company began with one product and its own colours and design tokens. New products took only those first tokens with them, and each needed things the first didn't have.

Built fast by different teams, much of it with AI coding tools, each product changed or dropped what didn't fit. With every release they looked less alike.

### 01.2 From a Figma library to shared code

I built the system in Figma first, from the main product's shadcn components: colour variables with Light and Dark modes, and components with their variants and states.

Then I shipped it as a code package, so teams build with its parts instead of redrawing them from a file. I've since moved to building directly in code with AI coding tools; the Figma library keeps the foundations for quick sketches.

### 01.3 Three layers: shared, product, customer

The shared package holds the colours, roles and component styles, so a fix there reaches all five products. Each product overrides only what it needs, from tokens rather than new colours.

Customers add their own colour, font and button shape on top.

## Part 2 · Accessibility built into the colours

### 02.1 Components ask for a role, not a colour

Every hue has five steps, each with one job: surfaces, borders, charts and icons, text on white, and text on a tint. Components ask for success or warning, never a hue and a step, so a hue can change without touching a component.

I kept amber for warnings only, so a warning never reads as a chart series.

### 02.2 The same lightness on every hue

I set the steps in OKLCH, where lightness is a number of its own, close to how bright a colour looks. The text steps sit within a few hundredths of each other on all six hues, so a role stays readable whichever hue it uses.

### 02.3 Dark mode designed step by step

In dark mode I lowered the borders' chroma so they don't glow, and lightened the text steps to hold their contrast.

Tinted surfaces turn deep, so text on a tint still sits on something darker than itself.

### 02.4 Readable with any customer's colour

Customers could pick any colour, and the first version passed it straight through. A pale yellow put white text on it at 1.07:1, and navy text on the dark background read at 2.99:1.

I applied the scales' own rule to the customer's colour. The fill stays theirs, and text on it turns dark or light. Used as text, their colour keeps its hue and moves in lightness until it reaches 4.5:1.

`[Written as done: only once the fix is live in the product. If it isn't, this card moves to the Outcome as "What I'd change", see below.]`

## Close

### Outcome

- **Consistency:** five products built from one set of colours, roles and components.
- **Delivery:** teams build new screens from shared code instead of redrawing them.
- **Accessibility:** every role passes AA in light and dark, under any customer's brand. `[the last clause once the fix ships]`

As the company's only designer, I designed the system in Figma and shipped it as code on my own.

**Fallback if the fix isn't live** (replaces card 02.4 and the last clause above):

> **What I'd change:** customer colours pass straight through, so a pale or dark brand can make text unreadable. I'd apply the scales' own rule to them: keep the customer's hue, and let the system set the lightness.

---

## Evidence

- **The work:** one panel of components (buttons, input, select, badges, alerts, pagination). Switch between three invented customers (colour, font, button shape), pick your own colour, switch Light / Dark; "Show ratios" puts the live contrast on every text pairing.
- **01.1:** one screen drawn as the first product, then as the four later ones: same tokens, each with its own radii, buttons, type and spacing.
- **01.2:** the rebuilt Figma file (component sets, variables with Light and Dark modes) beside the same components as code.
- **01.3:** diagram. Shared package → one product's overrides (e.g. a menu highlight mixed from the hover and active tokens) → a customer's colour, font and button shape.
- **02.1:** colour specimens. Six hues × five steps, each step labelled with its job.
- **02.2:** numbers set large: **30 of 30** text pairings pass WCAG AA · **5.16:1** lowest · **2** modes.
- **02.3:** the specimens with a Light / Dark switch.
- **02.4:** the work's module on pale yellow, with a "Passed through" / "Derived" switch and the ratios shown.
