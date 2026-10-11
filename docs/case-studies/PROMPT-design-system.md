# Prompt: a new project for the design system

Paste everything below the line into a new conversation.

---

I'm Chongbo Ning, a Design Engineer in London. You're working with me as a senior product designer, a senior UX designer and a design-engineering hiring manager in one. We're going to add one new, small project to my site: **the design system I built at my current job**. It used to be two sections of the component-library case; it's now its own project, and that case ("Components for Any Data") no longer covers it.

## Background

- My site is `CBcbbb/chongbo.DesignEngineer` (Next.js 16, TypeScript, Tailwind 4; live at https://chongbo-design-engineer.vercel.app).
  - Its concept is "Printed to order": a recruiter says which skills they need, and a printer prints the matching parts of my work.
  - Each project is stored as evidence cards tagged by capability.
  - Clone it, then read these first, in this order:
    1. `docs/case-studies/PLAYBOOK.md`: **the standard for this work.** Follow it closely.
    2. `docs/HANDOFF.md`: full background on the site.
    3. `README.md`
  - Use the Nike and HHCD case files as the reference for quality and structure (`content/projects/nike.ts`, `content/projects/hhcd.ts`, `docs/case-studies/nike/`, `docs/case-studies/hhcd/`).
- I'm applying to Granola's Design Engineer roles first, and possibly senior UX roles too.
- Several projects are being reworked at the same time in separate conversations. Follow the parallel-work rules in playbook §9 exactly. **Don't edit shared files**; propose changes in `docs/case-studies/SHARED-CHANGES.md`. Adding a new project touches `content/index.ts` and `src/lib/site.ts`: propose those there too.

## Confidentiality

Never name my employer, its products (the store included), its customers or its storage technology anywhere: code, copy, file names, prompts. Describe the employer as a "logistics infrastructure company". Never use real screenshots unless I say so and they're cleaned of every name.

## Sources

- The sections `token-layers` and `contrast-in-tokens` in `content/projects/component-store.ts` at commit `97022e0` (`git show 97022e0:content/projects/component-store.ts`): the last copy for this project. Also `src/components/media/TokenLayersDiagram.tsx`.
- What I've told you before:
  - I started the design system in Figma (components and palettes, designed for accessibility and every screen size), then moved it into code (Tailwind).
  - It has two tiers: a shared global stylesheet across five product lines, and a per-platform tokens file. Each app overrides only what it needs, and customers apply their own colours, fonts and button shapes.
  - Each colour scale has fixed roles: one step for surfaces, one for borders, one for text on white and one for text on tints. Components use role names (success, warning), never raw hues, so they stay readable in any theme.
  - It's in use.
  - I'm the only designer at the company and do most of the design-related front-end work.
- Ask me for anything else: Figma files, screenshots to rebuild from, numbers.

## Starting hypothesis (confirm or correct it with me)

- **Size:** a small project, 4 to 6 cards (playbook §3, earlier work), or a short main one. Your call, with reasons.
- **Lead capability:** C (systems and reuse). **Supporting:** E (contrast built into the scales) and B (Figma to code).
- **Name:** a plain name without the company, e.g. "One Design System, Five Product Lines". Propose two or three.
- **Signature module:** something the reader can touch, e.g. a theme switcher where one component set takes three customers' colours, fonts and button shapes and stays readable.
- **Colour:** not set. Propose one that sits apart from slate (Components for Any Data), Nike's orange and HHCD's brand colours.

## Your first task

Follow playbook §8 steps 1 to 3, and stop for my approval after each:

1. **Summarise what exists** in 10 lines or fewer, and flag contradictions.
2. **Interview me.** Ask 5 to 8 sharp questions, a few at a time, about what only I know: the hardest decision, what I tried first, what was mine versus others', and what happened because of it. Don't chase small details like dates.
3. **Draft the card inventory** (playbook §3 format), with the canonical order, the image inventory (keep / cut / redraw / missing) and the gaps list.

Work on the branch `case/design-system`, and merge only when I approve.

Use British English in everything on the site. Talk to me in Chinese. If I write in Chinese, first give me the natural British English version of what I said, then answer.
