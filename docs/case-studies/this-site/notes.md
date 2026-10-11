# The shell: review notes (11 October 2026)

Scope: the portfolio's own shell (home, header, footer, `/work`, `/about`, 404), not the case files. Written from the live site, the repo and outside sources; the sources are listed at the end.

## 1. Narrative

**What works.** The concept is already a good AI-product story: the AI is a feature, not the product ("AI chat is not always the answer", NN/g); it only selects from content I wrote, which is the safest shape for provenance; the printer makes the latency honest (steps print while it thinks) and gives failure a voice ("Paper jam"). The home page answers "what do you do" in the header line and proves it in the first interaction. The h1 asks the recruiter's own question, which is rare and right.

**Where it was thin, and what changed.**

| Finding | Source | Change on this branch |
|---|---|---|
| The reader could not tell that the red button was the button. No label, no visible state; the paper's typed examples kept cycling even after a card was picked, so it read as if that text were about to be sent. | Chongbo's own review; HAX G1 "make clear what the system can do" | An engraved **PRINT** label under the button (grey at rest, red when there is something to print); the lamp turns green when ready and amber while printing; the examples stop and the paper says "Add a line about the role, or press the red button" once a card is picked; the button's invitation pulse is stronger; the machine takes a small knock when pressed. |
| The results did not say who chose them. A recruiter who distrusts AI portfolios needs to know the words are mine. | Shape of AI "Disclosure" (label the action, name the actor); PAIR "Explainability" | A provenance line under the results title: "Chosen by Claude from my case files, one section per project. The words are mine." (or "Matched by keyword…" when the model didn't answer). Footer: "Claude chooses which sections of my case files to print. It never writes them." |
| The non-AI path was a plain text line ("Or browse all work") that didn't look clickable. | PAIR "Mental models": always offer a non-AI path | A kraft pill with the asterisk icon. |
| The nav only changed colour. For a Design Engineer (Web & Brand) application, the shell itself is evidence of "nails the details". | Granola JDs; Rauno, Emil Kowalski on restraint | The pills below. |

**Still open (not changed here):**

- The results sit under the printer; the metaphor says they should come out of the tray. The deck already "deals" from above the title. A stronger version would feed the first sheet out of the tray and then fan the deck; worth a prototype, not a quick change.
- On a result, the picked cards reset. The title keeps the ask ("Three projects show accessibility."), so nothing is lost, but a "Printed for: Accessibility" chip row above the deck would keep the request in view on long decks.
- `missing` ("No work to show yet for A/B testing") is a plain line. PAIR suggests saying what the AI needs; the line could offer the nearest thing ("Nothing on A/B testing; the closest is conversion work in Nike →").

## 2. Interaction

The site's own interactions were correct but mute: hover changed colour, focus was an outline. The reference recording (Chongbo's, 11 October) shows what to aim for: icon and word act together, a little randomness, and a spring back.

Built in `src/components/nav/Pill.tsx`, plain Web Animations API (no library, so the README's "no animation library" stays true):

| Pill | On hover and keyboard focus | Why this action |
|---|---|---|
| Work (hammer) | The hammer strikes, up to six times; each strike knocks the letters a little (±1.4px, ±6°), every fifth strike harder; letters spring back. | Work is made by hitting things. |
| About (eyes) | The eyes blink and follow the pointer within 220px; on keyboard focus they glance left and right. | "About me" looks back at you. |
| Or browse all work (asterisk) | The asterisk turns half a circle, direction and overshoot random. | The asterisk means "everything". |
| All work / Back (arrow) | A hand-drawn line draws out to the left of the capsule (one of three lines, chosen at random); on leaving it draws back. | Going back is drawn as a line back. |

Also: a skills card tilts ±2.4° at random when picked and settles; the machine takes a 1.5–3px knock when the button is pressed. All ≤ 0.6 s, no layout change, `prefers-reduced-motion` stops everything, focus-visible triggers the same as hover (pointer-following is the one thing a keyboard can't do, so focus gets a glance instead).

Where they appear: the header on every page (the Work pill becomes "All work" with the drawn line on a case file), the home page's browse link, the 404's "Back to the machine". Case-file controls are untouched (playbook §7).

## 3. Visual

- **Kraft.** One new object colour, `--kraft` (#d9c59e), for the shell's capsules. It sits between the cream printer and the paper, reads as a tag or a manila folder (case files), and is the same in both themes like the paper, so the shell stays recognisable in dark mode. Pairs added to `npm run contrast` (ink on kraft 10:1; hovered 11:1).
- **The printer's lamp** now has three honest states: off, green (ready), amber blinking (working). The engraved PRINT label matches the name plate (mono, embossed shadow).
- **Icons** are hand-drawn: one stroke weight, round ends, slightly uneven lines, so they don't read as an icon font next to the photographed object.
- **Results head** has more room above the deck (the first sheet was touching the title) and a mono provenance line, so the title, the quote and the provenance read as three weights.
- Not changed: the skill cards (already good; the pressed state with the red dot matches the button), the sheets, the about ticket.

Suggestions for later, in order of value: (1) a faint paper grain on the paper and the kraft (one 2% noise PNG, `mix-blend-mode: multiply`), which the Granola site uses to make flat colour feel printed; (2) the `/work` cards are the plainest surface on the site: a thin colour strip per project in its palette colour would tie them to the case-file covers; (3) the about ticket's tear edge could repeat on the 404 ticket's top.

## 4. Language (recruiter's reading)

The shell copy is already in the playbook's voice: short, concrete, no adjectives. Checked line by line:

| Line | Verdict |
|---|---|
| "Design Engineer, London" / "What skills are you looking for?" | Keep. Confident, not showy. |
| "Printed to order" | Keep. It's the concept's name. |
| Footer, before: "Answers are chosen from my case files by Claude, with keyword matching as a fallback." | Engineer-speak ("fallback"). Now: "Claude chooses which sections of my case files to print. It never writes them." The second sentence is the one recruiters need. |
| "Or browse all work" | Keep; now visibly a control. |
| "Something jammed. Try again, or browse all work." / "The printer is offline." / "Paper jam" | Keep. In character, and they tell you what to do. |
| Steps: "Reading your request · Accessibility · Three projects · Printing" | Keep. |
| "New request" | Keep. |
| Profile summary: "brand work that has to earn a tap" | Fine, but it is the one phrase that is more clever than clear. Alternative: "and brand work measured by what people tap". Chongbo to decide (content file). |
| Profile: "I'm the only designer at a logistics infrastructure company" | Keep: states scope and ownership without naming the employer. |
| `this-site` section "The unglamorous parts" | Reads well and recruiters like it; keep. |

Nothing fabricated, nothing from the banned list, no "led" where it wasn't.

## Sources

- [Shape of AI: Disclosure](https://www.shapeof.ai/patterns/disclosure) · [Citations](https://www.shapeof.ai/patterns/citations)
- [Google PAIR: Explainability + Trust](https://pair.withgoogle.com/chapter/explainability-trust/) · [Mental Models](https://pair.withgoogle.com/chapter/mental-models/) · [Errors + Graceful Failure](https://pair.withgoogle.com/chapter/errors-failing/)
- [Microsoft HAX Design Library](https://www.microsoft.com/en-us/haxtoolkit/library/)
- [NN/g: AI Chat Is Not (Always) the Answer](https://www.nngroup.com/articles/ai-chat-not-the-answer/)
- [Granola: Design Engineer (Web & Brand)](https://www.granola.ai/jobs/design-engineer-web-brand) · [Design Engineer](https://www.granola.ai/jobs/design-engineer)
- [Vercel: Design Engineering at Vercel](https://vercel.com/blog/design-engineering-at-vercel)
- [Leslie Yang: What a hiring manager looks for](https://leslieyang.substack.com/p/what-a-hiring-manager-looks-for-in)
- [Emil Kowalski: You Don't Need Animations](https://emilkowal.ski/ui/you-dont-need-animations) · [Rauno Freiberg: Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design) · [web.dev: prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion)
