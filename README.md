# Chongbo Ning — Design Engineer

The portfolio of Chongbo Ning, a design engineer in London. The home page is a conversation staged on a slide projector: put a card in it (four questions a recruiter might ask, or a blank one to write on or paste a job description into), press the red button, and the room goes dark while the parts of my work that answer it are projected, one slide per project. Every project is also a case file you can read without asking anything.

- `/` — the projector (`?type=serif` shows the display type in Instrument Serif, for review)
- `/ask?brief=…&topics=a,b` (or the older `?q=…`) — the same answer, server-rendered (works without JavaScript; shareable; `noindex`)
- `/work/<slug>` — a case file per project, every section deep-linkable (`/work/<slug>#<section-id>`)
- `/about` — profile, education and contact

## Stack

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 · Zod · Anthropic TypeScript SDK · Geist and Geist Mono (self-hosted via the `geist` package) · Vitest · Playwright + axe-core.

Motion is plain CSS and the Web Animations API (no animation library): the card's flight into the magazine, the machine stepping back into the dark room (FLIP) and the slide's flicker are `element.animate()`; the beam is an SVG polygon measured from the lens to the slide. The header's links (`src/components/nav/NavLink.tsx`) animate the same way, so the client bundle stays small.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional: add ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

Quality gates:

```bash
npm run lint
npm run typecheck
npm test            # unit tests (Vitest)
npm run build
npm run contrast    # WCAG AA check of every colour pairing in use
npm run test:e2e    # Playwright + axe at 1440 and 390 (needs `npm run build` first)
npm run screenshots # writes docs/screenshots/*.png
```

Playwright uses a system Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` by default. Elsewhere, run `npx playwright install chromium` and set `PW_CHROMIUM` to that binary (or remove `executablePath` from `playwright.config.ts`).

## Environment variables

| Name | Where | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | server only | Lets Claude choose the answer cards. Optional: without it the keyword fallback answers everything. |
| `NEXT_PUBLIC_SITE_URL` | build + server | Public URL for canonical links, sitemap and Open Graph images, e.g. `https://chongbo.dev`. Defaults to `http://localhost:3000`. |
| `ASK_RATE_LIMIT` | server, optional | Questions per IP per minute (default 12). |
| `ASK_DAILY_CAP` | server, optional | Best-effort daily cap on model calls per server instance (default 1500). Past the cap, answers come from the fallback. |

## How "ask" works

All content lives in `content/` (typed by `content/schema.ts`). Each project is an ordered list of section cards, and each card carries **signals** (accessibility, design systems, …). The ask feature never writes the page; it only **chooses** cards.

`POST /api/ask` with `{ "brief"?: "…", "topics"?: ["accessibility"] }` (brief 0–4,000 characters, 0–6 signal keys, at least one present; validated with Zod; the old `{ "question": "…" }` is still accepted as the brief) returns one sheet per project that shows what was asked:

```json
{
  "asked": ["accessibility"],
  "sheets": [{ "project": "hhcd-data-platform", "section": "dual-view", "signal": "accessibility", "reason": "≤90 chars" }],
  "missing": ["A/B testing"],
  "line": "Three projects show accessibility.",
  "source": "model",
  "reply": "…", "picks": [], "matched": "accessibility"
}
```

`asked` is 1–6 signal keys, most important first. `sheets` is 1–5, one per project, best first; each links to `/work/<project>#<section>`. `missing` lists requested things no work shows. `reply`, `picks` and `matched` are the old fields, derived from the new ones so the current home page keeps working.

The schema is shared by the API route, the `/ask` page and the client (`src/lib/ask/schema.ts`).

1. **Rate limit** (`src/lib/ask/rate-limit.ts`): a per-IP sliding window. Over the limit → `429` and the projector says on its status line that the lamp needs a minute to cool down. Question text is never logged.
2. **Model path** (`src/lib/ask/model.ts`): if `ANTHROPIC_API_KEY` is set and the daily cap allows, `claude-haiku-5-5` is called through the official SDK with structured JSON output (`output_config.format` via `zodOutputFormat`). The system prompt is a compact catalogue built from `content/` (project and section ids, titles, kinds, signals, one-sentence excerpts). The visitor's question is wrapped and treated as data. A 10-second timeout applies, and the answer may use up to 2,000 tokens; there are no retries. When the model path gives up, the server log says why (never the brief).
3. **Sanitising** (`src/lib/ask/sanitize.ts`): sheets that point at sections that don't exist are dropped, only the first sheet per project is kept, at most five, reasons clipped; unknown signal keys are dropped and a sheet's signal is repaired from its section; an invalid `line` is rebuilt from a template. Topics the visitor chose always count as asked. If no valid sheet remains, it falls back.
4. **Fallback** (`src/lib/ask/fallback.ts`): scores the brief against signal synonyms to find the capabilities asked for (chosen topics first), then picks each project's best section by signal match (the section's first-listed signal weighs most), then word overlap. A short list of common asks the content never mentions (A/B testing, native iOS or Android, Swift, Kotlin, backend and databases, analytics) is reported as `missing`. If nothing is understood, it prints three strong defaults (HHCD dual view, Component Store contracts, Nike layout system). Used for topic-only requests, and when there is no key, on error, timeout, refusal, or past the daily cap.

On the page (`src/components/projector/Projector.tsx`), the home page sends the card's text as `brief` and nothing else. While waiting, the lamp blinks amber, the card drops into the gate and the status line says what the machine is doing; the slides are projected when the answer arrives (at least ~1 s so the motion reads, no other artificial delay). Focus then moves to the wall's heading and the answer is announced in a polite live region. With reduced motion, everything is instant and the room still goes dark. Errors stay in the light room, on the machine's status line.

The projector's photographs (machine, paper card, lit slide, walls) are in `public/projector/`, made from the projector material pack; overlays are placed in % of `machine.webp` (1488 × 764), documented in `src/app/projector.css`.

### Swapping the rate limiter for a hosted store

The in-memory limiter is per server instance, so on Vercel each warm instance counts separately. To make it global, implement the `RateLimiter` interface with Upstash Redis (available through the Vercel Marketplace):

```ts
// src/lib/ask/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const upstash = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(12, "1 m") });
export const askLimiter: RateLimiter = {
  async limit(key) {
    const r = await upstash.limit(key);
    return { ok: r.success, remaining: r.remaining, retryAfterSec: Math.max(1, Math.ceil((r.reset - Date.now()) / 1000)) };
  },
};
```

Then `npm i @upstash/ratelimit @upstash/redis` and set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Nothing else changes. The daily cap can move to the same store with `INCR` on a key like `ask:2026-10-10` with a 24-hour expiry.

## Add a project

1. Create `content/projects/<slug>.ts` exporting a `Project` (copy an existing file for the shape).
2. Import it in `content/index.ts` and add it to `projects` (order = tray order). `tier: "main"` puts it in the tray; `"earlier"` puts it in the "Earlier work" line.
3. Add a short place label in `TRAY_PLACE` in `src/lib/site.ts` (optional).

The case file page, OG image, sitemap entry, AI catalogue and fallback scoring all pick it up automatically.

## Assets

Images and video referenced by content live in `public/assets/<path>`. Missing files show a labelled placeholder with the path and what to supply. The full checklist (with Chinese notes) is in [`docs/ASSETS.md`](docs/ASSETS.md).

## Deploy to Vercel

1. Push this repo to GitHub (already done: `CBcbbb/chongbo.DesignEngineer`).
2. In [vercel.com](https://vercel.com) → **Add New… → Project** → import the repo. Framework preset: **Next.js**. Leave build and output settings as default.
3. Under **Environment Variables** add:
   - `NEXT_PUBLIC_SITE_URL` = the final URL (e.g. `https://chongbo-designengineer.vercel.app`, or your domain).
   - `ANTHROPIC_API_KEY` = a key from the Claude Console (optional; see REPORT.md for setting a spend limit).
4. Click **Deploy**. When it finishes, open the URL on desktop and phone and ask a question. The line under the slides says in plain words who chose them; to be sure, check `source` in the browser's network tab (`model` or `fallback`).
5. If you add a custom domain later, update `NEXT_PUBLIC_SITE_URL` and redeploy so canonical links and OG images use it.

## Project layout

```
content/              typed content: the single source of truth
src/app/              routes, metadata, OG images, sitemap, robots
src/app/tokens.css    design tokens (light + dark)
src/app/components.css component styles (Tailwind components layer)
src/components/       projector/ (the home page), nav/, case files, MediaSlot, diagrams
src/lib/ask/          schema, catalogue, model, fallback, sanitise, rate limit
scripts/contrast.ts   WCAG contrast check
tests/unit/           Vitest
tests/e2e/            Playwright + axe, screenshots
docs/design/          the approved prototype and reference screens
```
