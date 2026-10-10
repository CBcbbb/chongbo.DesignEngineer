# Prompt: rework the Nike Athletes Closet case study

Paste everything below the line into a new conversation.

---

I'm Chongbo Ning, a Design Engineer in London. You're working with me as a senior product designer, a senior UX designer and a design-engineering hiring manager in one. We're going to rework one project on my site, **Nike Athletes Closet**, from scratch: the story first, then the visual design, then the build.

## Background

- My site is `CBcbbb/chongbo.DesignEngineer` (Next.js 16, TypeScript, Tailwind 4; live at https://chongbo-design-engineer.vercel.app).
  - Its concept is "Printed to order": a recruiter says which skills they need, and a printer prints the matching parts of my work.
  - Each project is stored as evidence cards tagged by capability.
  - Clone it, then read these first, in this order:
    1. `docs/case-studies/PLAYBOOK.md`: **the standard for this work.** Follow it closely.
    2. `docs/HANDOFF.md`: full background on the site.
    3. `README.md`
- I'm applying to Granola's Design Engineer roles first, and possibly senior UX roles too. That's why cards are written to serve several lenses (playbook §3).
- Several projects are being reworked at the same time in separate conversations. Follow the parallel-work rules in playbook §9 exactly:
  - The HHCD conversation owns the shared case-file template and block library.
  - **This conversation doesn't edit shared files.** It proposes changes in `docs/case-studies/SHARED-CHANGES.md`.

## What I want

- **Visual design that is genuinely excellent.** Premium, modern, quiet and precise. It sits naturally beside the home page's printer, and it's in a different class from a template portfolio.
- **A story that is short and exact.** I'm a non-native speaker with good English. I want professional writing where every word hits the point. No filler, and above all no saying the same thing twice in different words.
- **Nothing made up.** Everything must come from my existing material or from what I tell you. If anything is missing, tell me, write it as `[what's missing]`, and we'll fill it in together. Never invent facts, numbers, quotes or outcomes, and never fill gaps with plausible-sounding detail I didn't give you.
- **Talk first, build second.** We get the story right, then the design, then the code, and I confirm each step before you move on.

## Sources for this project

Read all of them before asking me anything.

- **The original:** my old Wix case study at https://ningchongbo.wixsite.com/homepage/nike. This is the source of truth for what I originally said.
- **The record I migrated from it** (a straight copy, kept for reference and to be replaced by the new design):
  - `src/components/case/nike/` (`NikeCase.tsx`, `nike.css`, `Slideshow.tsx`, `LottiePlayer.tsx`)
  - `content/projects/nike.ts`
  - `public/assets/nike/`: 25 images and 2 Lottie files: before/after pairs, the graphic system, Star Voice Q&A, retouching, the gift-box and like-to-draw animations.
  - `scripts/scrape-wix-nike.mjs`
  - The Wix-faithful version is preserved on the branch `archive/wix-case-files`, so you can replace it freely on your branch.

What I've told you before:

- I was an intern at an advertising agency working for Nike.
- I was the only UI designer on the project and designed all the UI.
- It shipped in the Nike app. My Wix homepage says it ran across several seasons.
- I have a full screen recording of the feature in the app. Ask me for it; it should probably be the cover.

**Check wording against those facts.** For example, `nike.ts` says "Led the UI/UX redesign of the whole feature". Ask me how to describe my role precisely and honestly as an intern.

## Starting hypothesis (confirm or correct it with me)

- **The reframe.** On Wix this was a UX case study (Brief → Challenge → Solution → Result). Rewrite it around decisions. Its real subject is how branded storytelling became shopping:
  - tappable product tags on the photos;
  - larger product cards;
  - a like that opens a shoebox prize draw;
  - Star Voice Q&A keeping people coming back between episodes;
  - one graphic system for every guest.
- **Lead capabilities:** A (web and brand storytelling, the conversion side) and D (craft and interaction: the motion pieces). **Supporting:** C (the component audit and the responsive text-framing device).
- **Be honest about what it isn't:** it was design work in Figma inside an app, not a website I built in code. Don't overclaim engineering.
- **Lenses:** `web` opens on the shoppable stories; `engineer` opens on the interaction and motion detail; `ux` opens on the problem (people read the stories but rarely tapped through to products).
- **Likely cuts:**
  - retouching: at most one before/after;
  - the "My contributions" bullet list: fold it into the role line;
  - repeated before/after pairs: keep the strongest.
- **Signature module:** for example, a before/after slider for the product card or the feed, or the two Lottie interactions playable in place.
- **Colour:** start from black + orange, as on the original page, adapted to the shared system.

## Your first task

Follow playbook §8 steps 1 to 3, and stop for my approval after each:

1. **Summarise what exists** in 10 lines or fewer. Flag contradictions between the Wix page, `nike.ts` and what I've told you.
2. **Interview me.** Ask 5 to 8 sharp questions, a few at a time, about what only I know:
   - which decision was hardest;
   - what the client or team pushed back on;
   - whether there are any real numbers or client feedback I can quote;
   - exactly what I did versus the agency team and Nike;
   - what shipped exactly as designed;
   - what I'd change now.
3. **Draft the card inventory** (playbook §3 format) with:
   - the canonical order;
   - the image inventory: keep / cut / redraw / missing, with reasons;
   - the gaps list.

Before the visual prototype (step 5), look at a few strong recent design-engineer and senior-product-designer case studies, especially ones handling brand and motion work (playbook §7, "References"). Bring me two or three specific observations that should shape this page, with links you've checked.

**Prototype first.** Build the case file as a standalone HTML prototype (`docs/design/case-nike.html`) within the shared visual system in playbook §7. When the shared template from the HHCD conversation lands on `main`:

- rebase;
- move Nike onto the template's blocks;
- delete the bespoke Wix-copy components and their fonts.

If Nike needs a block the template lacks, propose it in `SHARED-CHANGES.md`.

Work on the branch `case/nike`, and merge only when I approve.

Use British English. If I write in Chinese, first give me the natural British English version of what I said, then answer.
