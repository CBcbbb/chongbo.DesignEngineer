# Prompt: the home page's skills area (what I asked for, what we tried, what I decided)

Paste everything below the line into a new conversation.

---

I'm Chongbo. This conversation is about the first screen of my portfolio's home page ("Printed to order"): the headline, the line under it, the skills cards and the paper on the printer. Read `docs/HANDOFF.md`, `docs/case-studies/PLAYBOOK.md` and `src/components/PrintedToOrder.tsx` first. Use British English. If I write in Chinese, first give the natural British English version of what I said, then answer. Ask before building; show me before anything goes live.

## Where things stand (12 October 2026)

- **The live home page is unchanged, and it stays the starting point.** Headline "What skills are you looking for?", then "I'm Chongbo Ning, a design engineer in London. Pick the skills your role needs, describe what you're looking for, or paste the job description. The machine prints the parts of my work that match.", then the skills cards, then the paper on the printer.
- **"AI tools" is back.** Components for Any Data's pipeline card now says I wrote the front end and the server with Claude Code and Cursor, and carries the `ai-tools` signal. WildEcho and This site are hidden for now (`HIDDEN` in `content/index.ts`), and a skills card is only offered when a shown project has work for it (`shownTopics()` in `src/lib/cards.ts`).
- **A redesign was prototyped and I rejected it:** "算了，还不如原来" (forget it, the original was better). The record is `docs/design/home-prompts.html` (seven versions). Don't build from it; use it only to see what didn't work.

## What I want from the skills area

- Rethink the cards with both Granola JDs in mind (Design Engineer, and Design Engineer (Web & Brand); links in HANDOFF).
- From the visitor's side: give them hints, but not so they only click. They should feel they can write their own.
- Three ways in, all visible: pick, describe what you need, paste a job description.
- Fewer hints rather than more.

## My views, from reviewing the prototype

- **"What skills are you looking for?" is right.** I came back to it after trying the others.
- **"I'm Chongbo" must stay, and stay prominent.** It must not read as the answer to the question: "Who are you looking for? I'm Chongbo." sounds like "whoever you want, I'm Chongbo".
- **Question first, then me, then what I'll do for you.** Greeting first and then the question felt wrong. Example of the shape I want: "[question] I'm Chongbo… pick or describe what you need, and I'll pick the parts of my work that fit best."
- **Not blunt about hiring.** "Who are you hiring?" makes the portfolio look like it exists only to get a job.
- **The question and the paper must agree.** "What are you looking for?" answered by "Someone who…" doesn't fit; if the paper starts a sentence, it has to answer the headline.
- **No red dot for a selected state.**
- **Nothing on the page may move when I hover.** The printer bobbing up and down as the paper changed height was the last straw.
- **It has to look good**, to a senior UI designer's standard, and fit the site's existing look (studio grey, paper, the photographed printer, Geist).

## What we tried (so you don't repeat it)

1. Eight half-sentences above the printer that typed onto the paper ("We're looking for someone who…"). Too many; red dot disliked; "Who are you looking for?" followed by "I'm…" read badly.
2. Four shorter half-sentences in one row, a tick instead of the dot, "Who are you hiring?" without "I'm". Too blunt; "I'm Chongbo" missing.
3. Greeting above the question ("I'm Chongbo…", then "What are you looking for?"). Wrong order.
4. The hints moved onto the paper as an autocomplete list under "Someone who"; a picked one joins the sentence and leaves the list. I liked this direction ("很好") but wanted the unpicked hints to look better.
5. The hints drawn as branches from the sentence; hover previews the sentence with the new part highlighted.
6. Back to "What skills are you looking for?", with the paper answering in skills ("Owning the design system and designing from the data up.").
7. The paper reserved room so hovering didn't move the printer; picking still shifted it slightly. Then I stopped: the original was better.

## Constraints

- Never name my current employer, its products, customers or storage technology.
- The home page belongs to the shell; record shared changes in `docs/case-studies/SHARED-CHANGES.md`.
- The printer's matching (AI and fallback) reads both the typed words and the picked skills' signals; any change to the cards must keep sending signals.
- Accessibility: every control a native element, keyboard first, visible focus, reduced motion respected, axe clean in both themes.
