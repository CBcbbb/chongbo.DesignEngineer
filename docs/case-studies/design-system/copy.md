# One Design System, Three Products: copy (draft 3, 12 Oct)

Playbook §8 step 4. Every line traces to "Facts and their sources" in `inventory.md`. `[Brackets]` mark what isn't confirmed yet. Nothing states status or progress.

**Draft 2 (Chongbo's review, 12 Oct):** the story starts from one main product whose tokens were carried into new products and drifted; shadcn is a reference, folded into the Figma card (the `extend-shadcn` card is cut); Figma is a library for sketching in the system, not a spec, and screen sizes aren't mentioned; Part 3 is about accessibility. 8 cards.

**Draft 3 (playbook §4–5 pass, 12 Oct):** two parts (building the system · accessibility); 02.1 merged into one claim about shipping code; bodies no longer restate headings; the cover's outcome and the closing card no longer repeat each other; "I" in every card that is my decision.

**Story.** The company began with one product. New products took only its first tokens, and were built fast by different teams, so each drifted further from the others. I moved the colours, roles and component styles into one shared package with layers for each product and each customer, and built the system in Figma so ideas are sketched in it before they're built in code. Accessibility sits in the colours themselves: text steps at almost one lightness on every hue, a dark mode tuned step by step, and the same rule applied to customer colours, which first passed straight through.

---

## Cover

Logistics infrastructure company

# One Design System, Three Products, Any Brand

Started in Figma, shipped as code, and layered so anyone can restyle it without breaking contrast.

- **Role:** Design Engineer · Figma library, colour scales and code · on my own
- **Outcome:** One design system across the company's products, which every client and user can customise on top.
- **What this shows:** Design system (C) · Accessibility in the colours (E) · Figma to code (B)

## Part 1 · One system for every product and client

### 01.1 Three products from one company, drifting apart

The company began with one product and its own colours and design tokens. New products took only those first tokens with them, and each needed things the first didn't have.

Built fast by different teams, much of it with AI coding tools, each product changed or dropped what didn't fit. With every release they looked less alike.

### 01.2 Every client wants its own look

Even within one product, our customers are companies with brands of their own, and each wants it to feel like theirs: their colour, their typeface, the shape of their buttons.

### 01.3 Each level overrides only what it needs

I split the system into levels. The shared package is the foundation: it sets every colour, role and component and runs through everything, so a fix there reaches all three products. What only one product needs sits in the second level, built from existing tokens rather than new colours.

Within one product, each client sets its own colour, font and button shape for all its users, and each user can adjust their own look again as they need.

## Part 2 · From Figma to code

### 02.1 It started as a Figma library

I built the system in Figma first, from the main product's shadcn components: colour variables with Light and Dark modes, and components with their variants and states.

### 02.2 Now it lives in code

In the end I shipped it as a code package, so teams build with its parts instead of redrawing them from a design file.

With AI coding tools I built one shared tokens file that sets every colour and role. Each product imports it, and its own globals.css overrides only what that product's interface needs.

## Part 3 · Accessibility that holds in any colours

### 03.1 Components ask for a role, not a colour

Every hue has five steps, each with one job: surfaces, borders, charts and icons, text on white, and text on a tint. Components ask for success or warning, never a hue and a step, so a hue can change without touching a component.

### 03.2 The same lightness on every hue

I set the steps in OKLCH, where lightness is a number of its own, close to how bright a colour looks. The text steps sit within a few hundredths of each other on all six hues, so a role stays readable whichever hue it uses.

### 03.3 Dark mode designed step by step

In dark mode I lowered the borders' chroma so they don't glow, and lightened the text steps to hold their contrast.

Tinted surfaces turn deep, so text on a tint still sits on something darker than itself.

### 03.4 Readable with any customer's colour

If customers can pick any colour, a pale yellow, say, can easily put white text on its button at 1.07:1, and navy text on the dark background reads at 2.99:1.

I applied the scales' own rule to the customer's colour. The fill stays theirs, and text on it turns dark or light. Used as text, their colour keeps its hue and moves in lightness until it reaches 4.5:1.

`[Written as done: only once the fix is live in the product. If it isn't, this card moves to the Outcome as "What I'd change", see below.]`

## Try it (after 03.4, before the outcome)

**Title:** Try it: the system, rebuilt with invented data

The real products are confidential, so this is a rebuild. Switch the brand, the light and dark modes and the contrast labels.

## Close

### Outcome

- **Consistency:** three products built from one set of role definitions, base colours and components, each keeping its own character.
- **Delivery:** teams build new screens from shared code instead of redrawing them.
- **Accessibility:** every role passes AA in light and dark, under any customer's brand. `[the last clause once the fix ships]`

I designed the system in Figma on my own and shipped it as code for different teams to use.

**Fallback if the fix isn't live** (replaces card 02.4 and the last clause above):

> **What I'd change:** customer colours pass straight through, so a pale or dark brand can make text unreadable. I'd apply the scales' own rule to them: keep the customer's hue, and let the system set the lightness.

---

## Evidence

- **The work:** one panel of components (buttons, input, select, badges, alerts, pagination). Switch between three invented customers (colour, font, button shape), pick your own colour, switch Light / Dark; "Show ratios" puts the live contrast on every text pairing.
- **01.1:** one screen drawn as the first product, then as the two later ones: same tokens, each with its own radii, buttons, type and spacing.
- **01.2:** the rebuilt Figma file (component sets, variables with Light and Dark modes) beside the same components as code.
- **Overview:** on a dark sheet, built from the bottom up in 3D: a gridded base (the shared package), three glass product slabs floating above it, brand-coloured client slabs above each product, user nodes above each client, linked by vertical pins; "Seen as" lights the path to one client and one user; levels labelled on the right with leader lines. Was: Shared package → one product's overrides (e.g. a menu highlight mixed from the hover and active tokens) → a customer's colour, font and button shape.
- **02.1:** colour specimens. Six hues × five steps, each step labelled with its job.
- **02.2:** numbers set large: **30 of 30** text pairings pass WCAG AA · **5.16:1** lowest · **2** modes.
- **02.3:** the specimens with a Light / Dark switch.
- **02.4:** the work's module on pale yellow, with a "Passed through" / "Derived" switch and the ratios shown.
