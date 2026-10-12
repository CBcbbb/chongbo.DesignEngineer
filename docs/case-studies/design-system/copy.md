# One Design System, Five Products: copy (draft 2, 12 Oct)

Playbook §8 step 4. Every line traces to "Facts and their sources" in `inventory.md`. `[Brackets]` mark what isn't confirmed yet. Nothing states status or progress.

**Draft 2 (Chongbo's review, 12 Oct):** the story starts from one main product whose tokens were carried into new products and drifted; shadcn is a reference, folded into the Figma card (the `extend-shadcn` card is cut); Figma is a library for sketching in the system, not a spec, and screen sizes aren't mentioned; Part 3 is about accessibility. 8 cards.

**Story.** The company began with one product. New products took only its first tokens, and were built fast by different teams, so each drifted further from the others. I moved the colours, roles and component styles into one shared package with layers for each product and each customer, and built the system in Figma so ideas are sketched in it before they're built in code. Accessibility sits in the colours themselves: text steps at almost one lightness on every hue, a dark mode tuned step by step, and the same rule applied to customer colours, which first passed straight through.

---

## Cover

Logistics infrastructure company

# One Design System, Five Products

The shared colours and components behind five products, and every customer's brand on top.

- **Role:** Design Engineer · Figma library, colour scales and CSS · on my own
- **Outcome:** Five products that read as one company again. Customers apply their own brand, and its text stays readable. `[second sentence once the fix ships]`
- **What this shows:** Design system (C) · Accessibility in the colours (E) · Figma to code (B)

## The work

The system, rebuilt on an invented brand.

---

## Part 1 · From one product to five

### 01.1 Five products, drifting from the first

The company began with one product, with its own colours and design tokens. New products took only those first tokens with them, and each needed things the first didn't have.

Built fast by different teams, much of it with AI coding tools, each product changed or dropped what didn't fit. With every release they looked less alike.

### 01.2 One shared package under every product

I moved the colours, roles and component styles into one shared package, so a fix there reaches every product. Each product overrides only what it needs, built from tokens rather than new colours.

Customers apply their own colour, font and button shape on top.

## Part 2 · Figma and code

### 02.1 From a Figma library to shared code

I built the system in Figma first, starting from the main product's shadcn components: colour variables with Light and Dark modes, and components with their variants and states.

I delivered it as code, not as a file to redraw from, so every team builds with the same parts and keeps up with each update.

I've since moved to building directly in code with AI coding tools. The Figma library keeps the foundations, so a sketch already uses the system's colours and parts.

## Part 3 · Accessibility built into the colours

### 03.1 Components ask for a role, not a colour

Every hue has five steps, each with one job: surfaces, borders, charts and icons, text on white, and text on a tint. Components ask for success or warning, never a hue and a step, so a hue can change without touching a component.

Amber is kept for warnings, so a warning never looks like a chart series.

### 03.2 The same lightness on every hue

I set the steps in OKLCH, where lightness is a number of its own. Each text step sits at almost the same lightness on all six hues, so a role stays readable whichever hue it uses.

### 03.3 Dark mode designed step by step

Each step was tuned again for dark surfaces rather than inverted. Borders keep low chroma so they don't glow, and text steps get lighter to hold contrast on near-black.

Tinted surfaces turn deep, so text on a tint still sits on something darker than itself.

### 03.4 Readable with any customer's colour

Customers could pick any colour, and the first version passed it straight through. A pale yellow put white text on it at 1.07:1, and a navy used as text on dark read at 2.99:1.

Now the system applies its own rule. The fill stays the customer's colour; text on it turns dark or light, and the colour used as text keeps its hue and moves in lightness until it reaches 4.5:1.

`[Written as done: only once the fix is live in the product. If it isn't, this card moves to the Outcome as "What I'd change", see below.]`

## Close

### Outcome

- **One package:** the products share their colours, roles and components, and read as one company again.
- **Figma and code:** one system in both, so new ideas start in the system instead of drifting from it.
- **Any brand:** customers rebrand the platform without losing its contrast. `[once the fix ships]`

As the company's only designer, I designed the system in Figma and wrote its CSS on my own.

**Fallback if the fix isn't live** (replaces "Any brand" and card 03.4):

> **What I'd change:** customer colours pass straight through, so a pale or dark brand can make text unreadable. I'd apply the scales' own rule to them: keep the customer's hue, and let the system set the lightness.

---

## Evidence

- **The work:** one panel of components (buttons, input, select, badges, alerts, pagination). Switch between three invented customers (colour, font, button shape), pick your own colour, switch Light / Dark; "Show ratios" puts the live contrast on every text pairing.
- **01.1:** one screen drawn as the first product, then as the new products: same tokens, each with its own radii, buttons, type and spacing, further apart release by release.
- **01.2:** diagram. Shared package → one product's overrides (e.g. a menu highlight mixed from the hover and active tokens) → a customer's colour, font and button shape.
- **02.1:** the rebuilt Figma file. Component sets with variants and states; a switch to the variables panel, Light and Dark modes; a quick sketch made from the library beside the same screen in code.
- **03.1:** colour specimens. Six hues × five steps, each step labelled with its job.
- **03.2:** numbers set large: **30 of 30** text pairings pass WCAG AA · **5.16:1** lowest · **2** modes.
- **03.3:** the specimens with a Light / Dark switch.
- **03.4:** the work's module on pale yellow, with a "Passed through" / "Derived" switch and the ratios shown.
