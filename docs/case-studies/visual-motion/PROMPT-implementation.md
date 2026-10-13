# Implementation prompt: the printer, the lamp and the shell's finish

Paste everything below the line into a new coding conversation.

---

You are implementing an approved visual and motion pass on my portfolio, `CBcbbb/chongbo.DesignEngineer` (Next.js 16, TypeScript, Tailwind v4). Speak Chinese with me. Use British English in anything that goes on the site, and no em dashes.

## Ground rules

- Work on a new branch `shell/visual-motion` from the latest `main`. Never commit to or merge into `main`; I merge when I've seen it.
- First merge `origin/perf/printed-cards-on-demand` into your branch (already tested: the home page fetches printed cards per print through the `printCards` server action). Build on top of it, don't undo it.
- Read first: `AGENTS.md` (this Next.js has breaking changes: check `node_modules/next/dist/docs/` before using an API), `README.md`, `docs/case-studies/PLAYBOOK.md` §6 and §7, and `docs/case-studies/ux-proposals.md` (already on main: don't redo it).
- The approved design is in these prototypes. Match them; where this prompt and a prototype differ, this prompt wins:
  - `docs/design/visual-motion-assembled.html`: the whole home page (machine, analysis, sheets, lamp, backdrop, paper, jam, not-understood reply, receipt, icon, share images).
  - `docs/design/visual-motion-machine-v3.html`: the machine and the analysis sequence on its own.
  - `docs/design/visual-motion-theme-switch.html`: the lamp switch (idea 1, "pull cord").
- Never change wording on the site except the new copy listed under "Approved copy" below.
- Never change a case card. A printed sheet must still carry the case page's own card, unchanged (`tests/e2e/cards.spec.ts` must stay green). Anything new on a sheet goes on `.s-paper`, never inside `.s-card`.
- Never name my current employer's products, customers or storage technology.
- Respect `prefers-reduced-motion` everywhere; keep text at WCAG AA; a case card never goes past 40rem.

## Assets

Everything is ready in `docs/design/shell/` (the GPT originals are in `docs/design/shell/gpt-originals/`, for reference only). Copy into `public/shell/`:

| File | Use |
|---|---|
| `printer-v3.webp` (1979 × 595), `printer-v3-1x.webp` (990 × 298) | the machine, light mode |
| `printer-v3-night.webp`, `printer-v3-night-1x.webp` | the machine, dark mode (same geometry, lamp-lit) |
| `printer-v3-key.webp`, `printer-v3-night-key.webp` (182 × 182) | the key cap layer, cut from the same renders |
| `printer-v3-jam.webp` (1979 × 595) | the machine with jammed paper, same geometry |
| `studio-light.webp`, `studio-dark.webp`, `studio-light-tall.webp`, `studio-dark-tall.webp` | the page backdrop (tall ones for portrait windows) |
| `paper-grain.png` (512, seamless) | paper texture |
| `cut-edge-mask.png`, `cut-edge-mask-up.png` (240 × 11, alpha) | serrated edges, bottom and top |
| `key-icon-180.png`, `key-icon-32.png` | `src/app/apple-icon.png` and `src/app/icon.png` (keep `icon.svg` for 16px) |
| `og-studio.png` (1200 × 630), `og-printer.png` (912 × 274) | share images (`next/og` can't read WebP) |

The old `public/printer.webp` and `src/lib/og-printer.png` go once nothing uses them.

Serve the machine with `next/image` and both sizes (`sizes="(min-width: 760px) 720px, 100vw"`), `priority`, no layout shift (the box keeps `aspect-ratio: 1979 / 595`).

## 1. The machine (`src/components/PrintedToOrder.tsx`, `src/app/printer.css`)

Overlay positions, as percentages of the machine box (measured on the render; reuse them for the night and jam renders, which share the geometry):

| Part | left | top | width | height | Notes |
|---|---|---|---|---|---|
| paper box (`.paperbox`) | 10.7% | `bottom: calc(100% - 7.6%)` | 78.6% | | clipped at the slot so a sheet disappears into it |
| reading light at the top slot | 9.8% (right 9.6%) | 2.6% | | 7% | `mix-blend-mode: screen` |
| display (live text) | 6.55% | 31.1% | 46% | 24.4% | text over the render's own glass |
| key cap and socket | centre 82.72% | centre 45.38% | 9.2% | square | cap is the key image; socket a dark radial gradient under it |
| key touch target | | | | | at least 44px, round, centred on the key |
| PRINT engraving | centre 82.72% | 66.4% | | | mono, 600, `min(10px, 1.25cqi)`, tracking 0.24em, uppercase, `#8a8378`, red when ready |
| front slot (outfeed) | 23.9% | 64.6% | 52.2% | 40% | `clip-path: inset(0 -40% -400% -40%)` so the sheet shows only below the lip |

- The name plate, the old LED and `.pk`/`.pk-label` go. The name lives on the display; status is the dot on the display.
- Dark mode swaps the photo and the key cap to the night renders (`syncPhoto()` in the prototype), following the theme as set on `<html>`, including manual choice.
- The machine keeps its colours in both modes (it is an object, playbook §7); the night render only changes its lighting.

### The display

- Geist Mono 500, `min(13px, 1.95cqi)`, tracking 0.1em, uppercase, `#b9f5d2`, glow `0 0 0.3em` and `0 0 1.1em` of `rgba(110, 235, 170, 0.55)`; second line 0.84em at 62% opacity, no glow. A 2px dot-matrix screen over the letters and a faint diagonal reflection (see `.disp::before/::after`).
- Container query: below 560px wide the second line hides and the first is 10px.
- A status dot top-right: faint at idle, lit when ready, blinking (0.5s, `steps(2)`) while working.
- A four-segment progress bar under the text while working.
- Redraw: a new line wipes on left to right, `clip-path: inset(0 100% 0 0) → inset(0)`, 180ms, `steps(9, end)`. A line wider than the screen ticks once: hold 25%, slide to its end by 80%, hold; duration `900 + 22 × overflow px` ms, linear, 200ms delay. Counters update without the wipe.
- States: idle `CHONGBO NING / DESIGN ENGINEER`; ready `READY / PRESS PRINT`; then the analysis below; done `PRINTED: FOUR SHEETS / FROM TWO PROJECTS` (real numbers in words) for 3.2s, then back to ready or idle.

### The key

- Pointer down: cap moves down 4% of its size in 60ms, ease-out. Pointer up: back with a spring (stiffness 420, damping 16) sampled into CSS `linear()`; fallback `cubic-bezier(0.34, 1.4, 0.64, 1)`. Keyboard Enter/Space does the same, up after 110ms.
- The machine takes the knock: 380ms, `cubic-bezier(0.34, 1.56, 0.64, 1)`, down 1 to 2px and ±0.2° at 30%, random each time.
- Ready glow: two 1.8s breaths, then a steady faint ring (no endless loop).
- Pressing again while working stops the print: the request comes back from wherever it is, the display says `STOPPED / YOUR REQUEST IS BACK` for 2.2s.

### The analysis (five steps; drive them from the real answer)

1. **Read.** The request stays on the paper as text; the words the printer recognises are marked (`background: #d6f3e2; box-shadow: inset 0 -2px 0 #2f8f5b`), one every 90ms from 160ms. The reading light flickers (240ms, opacity 0.65 → 1 → 0.8, repeating). The sheet passes into the slot over 1600ms, `cubic-bezier(0.5, 0, 0.35, 1)`, keyframes `0 → 6px @ 0.08 → 8px @ 0.14 → 104%` (the rollers grab, then pull). Display: `READING YOUR REQUEST`, segment 1. The recognised words come from the same synonym list the fallback uses (`src/lib/ask/fallback.ts`); export it rather than duplicating it.
2. **Wait.** Only if the answer hasn't arrived when the sheet is in: the second line leafs through the shown projects' short names every 110ms. Skipped when the answer is quick.
3. **Understand.** Each asked capability locks onto the first line, 380ms apart (`MOTION`, then `MOTION, FRONT-END`); second line `UNDERSTOOD`; segment 2.
4. **Search.** `SEARCHING 41 CARDS` for 300ms, then a count rolls down in 9 steps of 40ms to `9 CARDS MATCH`, hold 380ms, then `CHOOSING FOUR` for 420ms; segment 3. Use real numbers: all cards in the card index, then the cards whose signals include any asked capability (add `signals` to `SheetCard` in `src/lib/cards.ts`), then the number printed.
5. **Print.** `FOUR SHEETS FROM TWO PROJECTS / PRINTING`, segment 4. The machine hums for 360ms (120ms, ±0.4px, `steps(4)`, repeating).

The steps must never make a print slower than today: start `/api/ask` and `printCards` as soon as the key is pressed, and let the steps take only as long as the answer needs, with the read step's 1.6s as the floor.

### The print

- **Feed.** The first sheet comes out of the front slot in visible steps: 900ms, `steps(16, end)`, to 97% out. Pause 200ms.
- **Lift and carry.** The sheet is picked up and flown to its place in the strip: 840ms, `cubic-bezier(0.3, 0.7, 0.1, 1)`, scale from the slot width to 1, rising 30px at the midpoint (0.45) with a random tilt of ±1.6° and a deeper shadow, landing flat. The page scrolls to the results at the same time over 840ms (ease-in-out cubic), so the title ends at the top.
- **Deal.** The other sheets slide out from under the first, each from the first sheet's position: spring (stiffness 170, damping 21), 90ms apart.
- **A fresh sheet** rises back out of the top slot: spring (stiffness 210, damping 22).
- The strip bleeds to the window's edges, the first sheet aligned with the column.
- With reduced motion: no steps, no flight; the results appear in place and the page jumps.

### Paper

- The input sheet: a clean, new sheet (no serrated edge), with `paper-grain.png` at 256px, `mix-blend-mode: soft-light`, opacity 0.55.
- Printed sheets (`.s-paper`) and the About receipt: serrated top and bottom edges, as cut from a roll (`cut-edge-mask-up.png` at the top and `cut-edge-mask.png` at the bottom, 105 × 6px, `repeat-x`, with a solid middle; see `.card` in the assembled prototype). Shadows move to `filter: drop-shadow()` on the parent, because a mask cuts a box-shadow off. Same grain on the paper. Nothing inside `.s-card` changes.

### When something goes wrong

- **Paper jam** (the request failed: network, server error, rate limit). The display says `PAPER JAM / TRY AGAIN IN A MOMENT`; the machine shakes (240ms, ±1.5px, `steps(4)`); the photo swaps to `printer-v3-jam.webp`; the request returns to the paper unchanged; a line appears under the machine (role `status`): *Something jammed. Try again in a moment, browse all work, or email me.* ("browse all work" links to `/work`; "email me" is a `mailto:` to the site email). It stays until the next print. Keep the existing rate-limit and offline wording where it is more specific.
- **Nothing understood** (`matched === "start-here"`, for example a name, "hello" or random letters). Not a jam: the machine shudders twice (420ms, ±1.2px then ±1px, `steps(6)`), the display says `NO ROLE OR SKILL FOUND / IN YOUR REQUEST` for 900ms, then `PRINTING WHERE TO START / THREE SHEETS`, and the three default sheets print as usual. Under the title "Where to start." a line says what happened: *I couldn't find a role or a skill in "{the first 60 characters}". Here are three places to start. For a closer match, pick a skill above or describe the role, for example "design systems for a fintech app".* If the brief is only one to three capitalised words (a name), the line starts *Nice to meet you, {first word}.* instead of the first sentence. The brief is never stored and never sent to analytics (the `printed` event keeps sending only its length).

## 2. The light/dark switch (lamp)

Put it in the header after About, as a third shell control, in `src/components/nav/` (a `ThemeLamp` client component next to `Pill.tsx`, styled with the pills in `components.css`).

- **Icon** (24 × 24 viewBox, stroke 1.8, round caps and joins, `currentColor`): a pendant shade on its cord, the bulb's lower edge showing under the shade, and a pull chain hanging from the shade's right side ending in a bead. Copy the paths from the assembled prototype's `#tsw`. In dark mode the shade fills solid, the bulb fills `#f6c35a`, a warm line runs along the rim, and a soft cone of light (`#f6c35a`, 55% → 0 opacity, top edge on the shade's rim) falls below.
- **Tap:** the chain pulls down 3.2px in 120ms (ease-in); at the bottom the theme switches; the chain springs back with a small overshoot (−1.2px at 55%), 380ms, `cubic-bezier(0.34, 1.56, 0.64, 1)`. Turning on, the bulb flickers on (260ms, `steps(4, end)`: 0.4 → 1 → 0.6 → 1) and the cone fades up the same way (300ms). Total under 0.6s.
- **Hover and keyboard focus:** a hint, never a switch: the chain dips 1.2px and springs back (360ms). Hover only for mouse pointers; nothing happens on touch except the tap.
- **Page:** `background-color` and `color` transition over 0.3s on the shell; images swap at once. Nothing at all with reduced motion.
- **State:** start from the system setting. A tap switches and stores the choice in `localStorage` under `theme` (every read and write in try/catch). Choosing the mode that matches the system clears the stored value, so the site follows the system again: two taps is "back to the system". Listen to `prefers-color-scheme` changes when nothing is stored.
- **After a tap,** a small note under the icon for 2.2s, and the same words in a polite live region: *Dark mode / until you switch back* or *Light mode / following your system*.
- **Accessible name** says what it will do: `Switch to dark mode` / `Switch to light mode`. A 44px target; focus behaves like hover; `outline: 2px solid` on focus-visible.
- **No flash:** an inline script as the first thing in `<head>` (in `src/app/layout.tsx`, before any stylesheet) reads `localStorage.theme` and sets `<html data-theme>` before the first paint. Mark `<html>` with `suppressHydrationWarning`. The `themeColor` metadata follows (light `#e9e7e2`, dark `#1a1918`).
- Everything themed already reads `data-theme` (`tokens.css`, `case-palettes.css`); check every component that only looks at `prefers-color-scheme` and make it respect `data-theme` both ways.

## 3. The shell's finish

- **Backdrop:** the studio photograph behind the first screen, `background: center top / cover`, masked to fade into `--studio` from 60% down; the tall versions when the window is narrower than 4 : 5. Dark mode uses the dark ones. Decorative only (`aria-hidden`), no layout shift.
- **About receipt:** the serrated bottom edge and the grain from the image assets, replacing the CSS zigzag; the receipt's text stays horizontal (if it's rotated now, rotate only a background layer, so the text isn't resampled).
- **Icons:** `src/app/icon.svg` stays for 16px; add `src/app/icon.png` (32) and `src/app/apple-icon.png` (180) from the key renders.
- **Share images** (`src/app/opengraph-image.tsx`, `src/app/work/[slug]/opengraph-image.tsx`, `src/app/about/opengraph-image.tsx`, `src/lib/og.ts`): compose with `next/og` from `og-studio.png` and `og-printer.png` and the site's own type (Geist, loaded from the `geist` package files), as in the assembled prototype. Home: eyebrow "Printed to order", title "What are you looking for?", the machine at the foot with `CHONGBO NING / DESIGN ENGINEER` on its display. Case: a sheet rising from the top slot carrying "Case file 0N", the project title and its one-liner, the machine below with the project name on its display. A small line top-left in every image: `CHONGBO NING · DESIGN ENGINEER · LONDON`. 1200 × 630, text never smaller than 18px at that size.

## Approved copy (new; nothing else changes)

Display: `READY`, `PRESS PRINT`, `READING YOUR REQUEST`, `UNDERSTOOD`, `SEARCHING {n} CARDS`, `{n} CARDS MATCH`, `CHOOSING {n in words}`, `{N} SHEETS FROM {n} PROJECTS`, `PRINTING`, `PRINTED: {N} SHEETS`, `FROM {n} PROJECTS`, `STOPPED`, `YOUR REQUEST IS BACK`, `PAPER JAM`, `TRY AGAIN IN A MOMENT`, `NO ROLE OR SKILL FOUND`, `IN YOUR REQUEST`, `PRINTING WHERE TO START`, `THREE SHEETS`, `WHERE TO START`.
Page: "Something jammed. Try again in a moment, browse all work, or email me."; "I couldn't find a role or a skill in "…". Here are three places to start. For a closer match, pick a skill above or describe the role, for example "design systems for a fintech app"."; "Nice to meet you, {name}."
Lamp: "Switch to dark mode", "Switch to light mode", "Dark mode", "Light mode", "until you switch back", "following your system".
Share images: "CHONGBO NING · DESIGN ENGINEER · LONDON", "Case file 0N".

## Tests (add to `tests/e2e/`, both projects, desktop and mobile)

- **The theme persists across pages:** tap the lamp on `/`, then visit `/work`, a case page and `/about`: `<html data-theme>` stays, the lamp's name says the opposite mode.
- **Back to the system:** with the system emulated light, tap twice: nothing is stored and `data-theme` is gone.
- **No flash on load:** with `localStorage.theme = "dark"` set by `addInitScript` and the system emulated light, record (in another `addInitScript`) the time `data-theme` first becomes `dark` and compare it with the first `paint` entry: it must come first. Also take a screenshot as early as possible and check the body background is the dark studio colour.
- **Reduced motion:** with `reducedMotion: "reduce"`, a print leaves no running animations, and the lamp switches without animating.
- **Keyboard:** Tab reaches the lamp, Enter switches, focus is visible; the target is at least 44px (the existing 44px test should cover it).
- **Jam:** route `/api/ask` to a 500: the jam image shows, the note is visible with both links, and the request is back on the paper. The next print clears it.
- **Nothing understood:** brief "Sarah Jones" prints three sheets, the title is "Where to start." and the line starts "Nice to meet you, Sarah."; brief "asdf qwer" gives the "I couldn't find" line.
- **Printed sheets** still carry their case cards unchanged (`cards.spec.ts`), now with serrated paper; the home page still ships no case cards (its guard test).
- **The engraving test** in `cards.spec.ts` checks `.plate` and `.pk-label`; rewrite it for the display's two lines and the PRINT engraving (never clipped from 320px to 1920px).
- **Share images:** each route returns a 1200 × 630 PNG.
- **Contrast:** add every new pairing to `scripts/contrast.ts` in both modes (display text and its second line on the glass, the note on its chip, the jam line and its links, the not-understood line, the lamp icon at rest on both studios) and keep `npm run contrast` at all pass.

Run before you hand back: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run contrast`, `npm run test:e2e`. Then check the pages in a real browser at 1440 × 900, 1280 × 720 and 390 × 844, light and dark, including a print, a jam (block the network), a name as the brief, and the lamp. Push the branch, tell me in Chinese what's done and what isn't, and don't merge.
