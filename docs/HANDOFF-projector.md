# Handoff: the projector (Chongbo Ning's portfolio home page)

Paste this into a new conversation. It carries everything decided on 11 October 2026 about the home page, so the new conversation can build it without re-exploring.

## Who I am and how to work with me

- Chongbo Ning, Design Engineer in London, applying to Granola's Design Engineer roles. Read `docs/HANDOFF.md`, `README.md` and `docs/case-studies/PLAYBOOK.md` in full first; they are still the source of truth for the site, the content model, the AI pipeline and the working rules.
- 这个对话里说中文。If I write in Chinese, first give the natural British English version of what I said (format: 🇬🇧 … 🪄, with a note on any native phrasing), then answer in Chinese.
- Talk it through and confirm before big changes. Work on a branch; Vercel builds a preview; merge to `main` only when I approve. Keep every check passing (`npm run lint`, `typecheck`, `test`, `build`, `contrast`, `test:e2e`).
- Several other conversations are rebuilding the case studies in parallel. This conversation owns the **shell only**: the home page, header, footer, `/work`, `/about`, 404. Don't touch `content/projects/*`, the case-file template or `src/lib/ask/*`; write proposed changes to `docs/case-studies/SHARED-CHANGES.md`.
- The home page's AI is already wired: `POST /api/ask` takes `{ brief }` (free text, up to 4,000 characters) and returns `{ line, sheets: [{ project, section, signal, reason }], missing, source }`. The AI only **selects** sections from my case files; it never writes them. That must stay visible to the visitor.

## Where things stand

- `main` is live at https://chongbo-design-engineer.vercel.app with the "Printed to order" home page (a photographed thermal printer, eight skill cards, a deck of printed sheets) plus a first round of shell changes from today that I've since decided against: kraft-coloured capsule nav links with hand-drawn icons (`src/components/nav/Pill.tsx`), a PRINT label on the printer, a provenance line under results. **Remove the kraft pills** when the new home page goes in. Keep: the lamp states on the machine, the provenance line, the footer wording "Claude chooses which sections of my case files to print. It never writes them."
- Branch `shell/v2` holds today's prototypes in `docs/design/` (all single-file HTML with real content): `shell-v2/v3/v4` (two-column hero with chips, requirement cards, role cartridges), `ask-v1`, `telex-v1`, `fax-v1`, `ask-machine-v1`, `cards-v1` and **`projector-v1.html`**, which is the one to build. Also `docs/case-studies/this-site/notes.md` (a review of the shell against AI-product UX research, with sources) and `DECISIONS.md` (open points, items 1–14).
- My creative-direction brief is in `Printfolio_Design_Requirements.docx` (I'll attach it). It still applies: interaction-led skeuomorphism, four connected stages, quality over quantity, nothing decorative.

## The concept, decided: Ask me anything, through a slide projector

The home page is a conversation with me, staged on a machine. The machine is a small vintage-style **slide projector** that doesn't exist in the real world; the image is mine (I'll attach the renders). Everything on it is a behaviour, not decoration:

1. **Request.** Headline "Ask me anything about my work." (first person). One line: "I'm Chongbo Ning, a design engineer in London. Put a card in the projector, or write your own, and the work that answers it is projected, one slide per project." A **hand of slide cards** fanned out: four printed with questions (today's `suggestedQuestions` in `content/index.ts`: "What matters most to us is accessibility." / "Show me something you built end to end." / "Have you built a design system?" / "Show me brand or marketing work.") and one **blank card** you can write on (that is the free-text input; the job description can be pasted there). Free text and examples are one system: they're all cards. Hover lifts a card; click flies it into the machine's magazine and it sits there; the indicator lamp turns green and the red button starts to invite. Only one card is loaded at a time; loading another ejects the first.
2. **Reading.** The red button (labelled "Project"). The machine takes a small knock, the lamp turns amber, a mono status line says "Reading your card… / Finding the work that answers it…", paced by the real API response, never a fake progress bar.
3. **Projecting.** The **room goes dark** (the page background fades to near-black, the hero copy fades out), the lens lights, a cone of warm light rises from the lens, and on the wall above the machine a bright **slide** appears: project name, section title, body, media, tags, "Full project →" (deep link to `/work/<slug>#<section>`). The machine shrinks and sits at the bottom with the card still in it. One slide per matching project (1–5), with "02 / 03" and arrows, keyboard left/right. Sections without media become text slides, still lit. The result's `line` ("Three projects show accessibility.") is the wall's heading; the card's text is quoted beside it; `missing` ("No work to show yet for A/B testing.") and the provenance line sit under the pager.
4. **Again.** "Change the card" brings the lights up and returns to the hand with the card ejected; "All work" goes to `/work`. Follow-ups are a physical act: change the card, project again.

Why this and not the alternatives (so we don't go round again):
- A printer is one-shot and one-way; a recruiter and I are in a dialogue. The output of a printer forced a "contents page + one page per project" that felt bound like a magazine. A projector's output is inherently a sequence of slides, so "several results" is natural, and "project again" is natural.
- Skill-filter buttons, tick boxes, requirement cards with counts ("3 projects") and role cartridges were all rejected: anything that tells you the result before the AI runs makes the AI pointless. The cards carry **questions**, never previews, never counts.
- "Only a slot, no machine" (the de-skeuomorphised direction) was tried and looked skeletal. The brief's rule is still right, but it means: extract the behaviours (card goes in, lamp, light cone, room darkens, slide appears), don't model a 3D scene. A rich, photographed machine as the hero is fine; what matters is that every part of it does something.

## Visual direction

- Page: warm off-white `#F3EFE8` (light); the dark room `#0F0E0D`. Ink `#1C1B19`, secondary `#6B6762`. Paper `#FBFAF7`. Warm light `#F07A2B` / `#FFD9A3` only where light comes from (lens, cone, slide glow). The red button is the one action colour, as on the site today.
- Type: Geist Sans and Geist Mono as the site uses; in `projector-v1.html` the display face is Instrument Serif (a high-contrast serif). **Open decision:** keep the serif for the shell's display type (headline, slide titles, result line) or stay Geist-only as the playbook says. Propose, show both, I'll choose.
- Cards: slide mounts, cream card stock, a thin inner window with the question in the serif, a small mono number; the blank one has faint ruled lines and a mono caret. Restrained: lift on hover, no colour change tricks.
- Slides: a lit rectangle with a soft vignette and warm outer glow, text left, media right (text-only variant centred), one per project.
- Nav: plain "Work" and "About". For About I like a pair of eyes whose pupils follow the pointer (blink on hover, glance on keyboard focus). For Work the metaphor is still open (a rubber stamp that inks the word was proposed; a hammer was rejected). No kraft capsules. All micro-interactions ≤ 0.6 s, a little randomness, spring back, focus-visible parity, still under `prefers-reduced-motion`.
- Dark mode: the light room follows the system theme as the site does; the dark room is dark in both.

## The machine image

I'll attach my own renders in the new conversation (don't use the Figma-generated one from today). What the UI needs from them:
- Straight on, slightly from above (about 12°), the whole machine, no hands, no props, no text, on a flat background or transparent. At least 2,000 px wide.
- An **empty** slide magazine on top (slots, no cards), so our cards can be shown going in; a lens at the front (off, dark glass); one small indicator lamp; a round red button; a blank name plate. Optional second render identical in framing with the lens lit.
- Overlays are positioned in percentages of the image (the card in the magazine, the lamp, the lens glow, the button, the status line), exactly as the current home page does with the printer. If the render has a backdrop, cut it out keeping the contact shadow as translucency (today's cutout method is in the `shell/v2` history: flood-fill the backdrop, treat low-saturation darkening as shadow alpha); save as WebP ~90 in `public/`.

## Build plan

1. On a new branch from `main`, replace the home page client (`src/components/PrintedToOrder.tsx`) with the projector flow from `docs/design/projector-v1.html`, as React with the Web Animations API (no animation library). Keep `/api/ask`, `src/lib/ask/*`, `Sheet` data (`buildCardIndex`) and `MediaSlot` for slide media. Cards send the card's text as `brief`; nothing else.
2. Keep the no-JS path (`/ask?brief=`) working; it can stay a plain list.
3. Accessibility: the hand of cards is a group of buttons; the blank card is a labelled textarea; the wall is a carousel region with `aria-roledescription`, slides `aria-hidden` when not current; focus moves to the wall heading after projecting; a live region announces the line; keyboard left/right; 44 px targets; everything still under reduced motion (room still darkens, instantly).
4. Remove `src/components/nav/Pill.tsx` and the kraft tokens; nav back to Work / About (eyes on About if you build it). Update `tests/e2e/site.spec.ts` and `screenshots.spec.ts` (the Print button becomes "Project"; the skill cards are gone), unit tests for `printed.ts`, the contrast pairs for the new colours in both rooms.
5. Vercel preview → my review on 1440 × 900, 1366 × 768, 1024 × 1366 and 390 × 844, light and dark → merge on my word → `docs/case-studies/this-site/DECISIONS.md` for anything uncertain, and a note in `SHARED-CHANGES.md` that the home page no longer sends `topics`, so the AI conversation's eval set reflects card text.

Start by reading the three docs, then `docs/design/projector-v1.html`, then the attached brief and renders. Then give me a short plan and the two or three things you need me to decide before you build.
