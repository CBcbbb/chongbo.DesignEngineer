# One Design System, Five Products: copy (draft 1, 12 Oct)

Playbook §8 step 4. Every line traces to "Facts and their sources" in `inventory.md`. `[Brackets]` mark what isn't confirmed yet. Nothing states status or progress.

**Story.** Five products shared one palette and still looked like five companies. I extended the shadcn they already used into one system: scales whose text steps sit at almost one lightness on every hue, components that ask for roles, a dark mode tuned step by step, and three layers from the shared package to each customer's brand. The turn: customer colours first passed straight through and could make text unreadable, so the system now applies its own lightness rule to them.

---

## Cover

Logistics infrastructure company

# One Design System, Five Products

The colours, components and themes behind five products, and behind every customer who rebrands them.

- **Role:** Design Engineer · Figma library, colour scales and CSS · on my own
- **Outcome:** Five products that read as one company. Customers apply their own brand, and its text stays readable. `[second sentence once the fix ships]`
- **What this shows:** Design system (C) · Contrast by construction (E) · Figma to code (B)

## The work

The system, rebuilt on an invented brand.

---

## Part 1 · Five products

### 01.1 The same colours, five different products

The company's five products shared one palette. Each had its own corner radii, buttons, type and spacing, so side by side they read as five companies.

As the company's only designer, I set out to make one system serve all five.

### 01.2 Extending shadcn instead of replacing it

All five products were built on shadcn, so I kept its components and token names and added what it lacks. Beside its one status colour, destructive, I added success, warning, info and categorical in its own naming pattern, so they read like shadcn's own.

Two of its defaults needed correcting: an accent that vanished in dark menus, and corner radii set inside each component.

## Part 2 · Figma to code

### 02.1 Components and colours drawn in Figma first

I designed the palettes and the component library in Figma first, for every screen size. Each component has its variants and states, in light and dark.

Colours are variables with a Light and a Dark mode. `[If confirmed: They use the CSS's role names, so a design reads as its code.]`

### 02.2 Three layers: shared, product, customer

The shared package holds the scales, roles and component styles, so a fix there reaches all five products. Each product overrides only what it needs, and builds its fixes from tokens rather than new colours.

Customers apply their own colour, font and button shape on top. `[optional: Their users can adjust it again.]`

## Part 3 · Readable in any theme

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

- **Five products:** one set of colours, components and roles, so the products read as one company.
- **Figma to code:** designs and CSS share one system, so new screens are easier to design and to keep consistent.
- **Any brand:** customers rebrand the platform without losing its contrast. `[once the fix ships]`

As the company's only designer, I designed the system in Figma and wrote its CSS on my own.

**Fallback if the fix isn't live** (replaces "Any brand" and card 03.4):

> **What I'd change:** customer colours pass straight through, so a pale or dark brand can make text unreadable. I'd apply the scales' own rule to them: keep the customer's hue, and let the system set the lightness.

---

## Evidence

- **The work:** one panel of components (buttons, input, select, badges, alerts, pagination). Switch between three invented customers (colour, font, button shape), pick your own colour, switch Light / Dark; "Show ratios" puts the live contrast on every text pairing.
- **01.1:** one screen drawn five times on the same palette, each with its own radii, buttons, type and spacing.
- **01.2:** code. shadcn's tokens first, then the added roles in its naming (`--success`, `--success-container`, `--success-border`, `--success-text` …), on invented values.
- **02.1:** the rebuilt Figma file. Component sets with variants and states; a switch to the variables panel, Light and Dark modes.
- **02.2:** diagram. Shared package → one product's overrides (e.g. a menu highlight mixed from the hover and active tokens) → a customer's colour, font and button shape.
- **03.1:** colour specimens. Six hues × five steps, each step labelled with its job.
- **03.2:** numbers set large: **30 of 30** text pairings pass WCAG AA · **5.16:1** lowest · **2** modes.
- **03.3:** the specimens with a Light / Dark switch.
- **03.4:** the work's module on pale yellow, with a "Passed through" / "Derived" switch and the ratios shown.
