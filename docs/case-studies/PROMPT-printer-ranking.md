# Prompt: the printer picks cards by relevance, not one per project

Paste everything below the line into the conversation that owns the printer (the home page, printed sheets and `src/lib/ask/*`).

---

I'm Chongbo. The printer's AI is live now, but its answers don't give me what I ask for. I've decided how it should choose cards; please build it, test it against an eval set, and go live when the tests pass. Follow `docs/case-studies/PLAYBOOK.md` §9 and record what you change in `docs/case-studies/SHARED-CHANGES.md`.

## What happened on 12 October (already on `main`)

- The model path never ran: answers were cut off at `max_tokens: 800`, so every request fell back. Now `MODEL_MAX_TOKENS = 2000`, timeout 10 s, and the log says why the model gave up (never the brief).
- New signal `data-architecture` ("Data architecture and APIs"). Back end is no longer an example of a missing ask; only databases are.
- The catalogue lists each project's stack, and each card's **full text** (not its first sentence).
- A visitor who asks for a number of projects gets that many (`src/lib/ask/count.ts`, `limitTo` in `answer.ts`).
- Printed sheets leave off evidence that doesn't fit instead of "[… to come]".
- WildEcho and This site are hidden for now (`HIDDEN` in `content/index.ts`): they aren't in the catalogue, and the "AI tools" card isn't offered. `/ask` prints the same evidence as the home page.

## The problem

The printer prints **one card per project**. So:

- When a project has several cards that answer the ask, only one is shown. HHCD has three accessibility cards (`keyboard`, `contrast`, `testing`); the printer shows one of them.
- Every project that has anything near the ask gets a card, so weak matches fill the deck. Asking for design systems prints HHCD's colour-contrast card and Nike's creative system, neither of which is really about a design system.

## My decision

1. **Rank cards by how well they answer the ask, across all projects.** No longer one per project.
2. **No limit per project.** If three HHCD cards are the best answer, print all three.
3. **At most six cards in total.**
4. **Spread by capability, not by project.** When the visitor asks for several capabilities (a pasted job description), every asked capability gets its best card before any capability gets a second one. When they ask for one capability, the best cards for it, wherever they are.
5. **Never pad.** A card that doesn't answer the ask isn't printed, even if that means one or two cards. If nothing answers it, keep today's honest "No project shows X; here are … places to start."
6. **Keep honouring a requested count** ("give me 2 design systems projects": two cards, or two projects' cards if they ask for projects. Decide which reading is better and tell me).

## What this touches (please check each)

- `src/lib/ask/schema.ts`: `MAX_SHEETS` 5 → 6; sheets may repeat a project (never the same project + section twice).
- `src/lib/ask/sanitize.ts`: drop "one sheet per project"; dedupe by project + section; keep the id and signal checks.
- `src/lib/ask/model.ts`: the prompt's steps and rules (ranking, no per-project limit, spread by capability, never pad); the fallback defaults in the off-topic rule.
- `src/lib/ask/fallback.ts`: score sections across all projects, then apply the same spread rule; `lineFor` wording (e.g. "Three cards show accessibility." or "Four cards from two projects match your brief.").
- `src/lib/printed.ts` (`resultTitle`), the printed sheets and the results strip: several cards from one project in a row should read as a group (e.g. "Case file: HHCD Data Platform" once, or "1 of 3" on each), keys by project + section, the counter, the arrow keys.
- `/ask` (no-JS page): the same list.
- Tests (`tests/unit/*`, `tests/e2e/site.spec.ts`) and the eval set.

## Eval cases to include (expected, best first)

| Brief | Expect |
|---|---|
| "accessibility" | `hhcd-data-platform#keyboard`, `#contrast`, `#testing` (and nothing padded from other projects unless it truly shows accessibility) |
| "give me 2 design systems projects" | exactly two; whatever genuinely shows design systems |
| "Strong in API design and backend." | `components-for-any-data#pipeline`, `#stream-fit`, `#contract`; "databases" may be missing, back end isn't |
| "design the data layer between our backend and the UI" | `components-for-any-data#pipeline` first |
| Granola's Design Engineer JD, pasted whole | several capabilities, each with its best card first; at most six |
| "Do you know Kotlin?" | the honest missing line and the start-here cards |

## After that

Compare `claude-haiku-5-5` with a stronger model on the eval set (quality, latency, cost per request) and tell me whether the difference is worth it. The printing animation can absorb a few seconds.
