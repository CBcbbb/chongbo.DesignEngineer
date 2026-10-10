# Handoff: Printed to Order (Chongbo Ning's portfolio site)

Paste this into a new conversation. It gives the full background, then the first task.

## Who I am and how to work with me

- Chongbo Ning, Design Engineer in London. I'm applying to Granola's **Design Engineer (Web & Brand)** role (https://www.granola.ai/jobs/design-engineer-web-brand); their **Design Engineer** role (https://www.granola.ai/jobs/design-engineer) is closer to where I want to go. Both JDs are the source of truth for what the site must prove.
- Use British English. If I write in Chinese, first give the natural British English version of what I said, then answer.
- Copy rules: concise, say each thing once, no AI-style restating in different words. If content is missing, mark it `[like this]` instead of padding. Prefer interaction over instructional text.
- I may show documents to an engineer friend who's helping me. Never call him a "programmer" or "developer" in anything I might show him; say "engineer" or avoid the word.
- Talk it through and confirm with me before big changes. Work on a branch; Vercel builds a preview; merge to `main` (which deploys production) only when I approve.

## The site

- Repo: `CBcbbb/chongbo.DesignEngineer` (private). Next.js 16 App Router, TypeScript strict, Tailwind 4, Zod, Vitest, Playwright + axe. Read `README.md` first.
- Live: https://chongbo-design-engineer.vercel.app (Vercel project `chongbo-design-engineer`, Hobby plan). Pushing to `main` deploys production.
- Archived previous version (red ticket printer): branch `archive/red-ticket-printer`, and the Vercel deployment "Prototype: final headline copy" (`4ec33f9`). Don't modify or delete it.
- The HHCD data-platform rebuild (`CBcbbb/Helen-Hamlyn-Centre-for-Design-Data-Platform`) is being handled in another conversation. Don't touch it.

### Concept: "Printed to order"

Recruiters don't ask for a portfolio; they ask to see work. You tell the machine what skills you need, and it prints exactly that.

- Home: eyebrow "Printed to order", h1 "What skills are you looking for?", 8 skill cards (Accessibility, Design systems, Front‑end, Motion, Web and brand, AI tools, Research, Data), then a photographed cream printer (`public/printer.webp`, overlays positioned in % of the image).
- The paper rising from the printer's top slot is the input (type a brief or paste a JD; typed examples cycle). Selected skills show as chips on the paper. The red button prints.
- Processing: step lines print on the paper. Results: one sheet per project that shows the asked skill, each sheet being that project's best matching section, shown as an overlapping deck you can drag, click or arrow through.
- "Full project →" goes to `/work/<slug>#<section>`, a case file with a parts rail (01…n) that lands on that section.
- Approved design reference: `docs/design/prototype.html` (single-file prototype) and `docs/design/screens/`.

### Content model

- `content/schema.ts` (SIGNALS = capability tags), `content/projects/*.ts`: `hhcd` (HHCD Data Platform), `component-store`, `nike` (Nike Athletes Closet), `this-site`, `wildecho` (earlier work, RCA team project).
- Each project is a list of sections, each tagged with signals. That decomposition is what lets the machine pull, say, the accessibility part out of every project that has one.
- Confidentiality: Component Store is from my current employer. Never name the employer, its products, customers or Redis anywhere (code, copy, prompts).
- Open `[bracketed]` gaps for me to fill are listed in `docs/copy-changes.md`. Missing media is listed in `docs/ASSETS.md`.

## How the AI works today

- `POST /api/ask` with `{ brief?: string (≤4000), topics?: SignalKey[] }`. It returns `{ asked, sheets: [{ project, section, signal, reason }], missing, line, source: "model" | "fallback" }`. The no-JS page `/ask?brief=&topics=` uses the same code.
- Code is in `src/lib/ask/`: `schema.ts`, `catalogue.ts` (builds the section catalogue for the prompt), `model.ts` (`claude-haiku-5-5` via `@anthropic-ai/sdk` `messages.parse` + `zodOutputFormat`, 6 s timeout, no retries), `sanitize.ts` (drops unknown ids, one sheet per project, max 5, falls back if nothing valid), `fallback.ts` (deterministic keyword scorer), `rate-limit.ts` (in-memory per-IP sliding window behind an interface), `answer.ts`. The skill-card → signal mapping is in `src/lib/printed.ts`.
- Requests with skills only and no brief skip the model and go straight to the deterministic matcher.
- **No API key is set yet, so production always uses the fallback.**
- Architecture doc written for the engineer conversation: "Printed to Order: AI architecture" (a Claude Doc in my artifacts). Its open questions:
  - Is "the model only picks ids from a catalogue" safe enough?
  - One call or two for a pasted JD?
  - Stream the answer or print once it's complete?
  - Should the rate limit be in-memory or Upstash?
  - How should requested skills with no matching work ("missing") be shown?

## First task: make the AI genuinely work

Start by reading the repo (`README.md`, `src/lib/ask/*`, `content/`, the tests) and load the `product-self-knowledge` skill so SDK usage and model details come from current docs, not memory. Then propose a short plan and confirm it with me before building. Cover:

1. **Correctness review.** Check `model.ts` and the structured-output call against current Anthropic docs, then fix anything wrong.
2. **Turn it on.** Walk me through creating an API key in the Claude Console with a spend limit, adding `ANTHROPIC_API_KEY` in Vercel, redeploying, and confirming `"source": "model"` on the live site. Add a safe way to check which path answered, without exposing internals to visitors.
3. **Quality, measured.** Build a small eval set of realistic recruiter inputs (both Granola JDs pasted whole, short briefs like "design engineer for our marketing website, strong in React and motion", single skills, odd or off-topic inputs, prompt-injection attempts), each with the sheets a good answer should print.
   - Run the model and the fallback against it.
   - Tune the prompt and catalogue until the model clearly beats the fallback.
   - Report the results in a table.
4. **Decide the open questions** above, with a recommendation for each:
   - whether skills-only requests should also use the model;
   - how to show "missing";
   - the latency budget versus the printing animation, and whether to stream;
   - moving the rate limit to Upstash.
5. **Harden for launch.** Error and timeout states in the UI, a cost ceiling, no logging of question text, and tests for all of it.

Deliver on a branch with a Vercel preview, then merge after I approve. Finish with a short report: what changed, eval results, what it costs per request, and anything I need to decide.
