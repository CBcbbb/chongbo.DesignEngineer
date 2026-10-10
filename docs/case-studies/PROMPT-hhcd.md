# Prompt: rework the HHCD Data Platform case study

Paste everything below the line into a new conversation.

---

I'm Chongbo Ning, a Design Engineer in London. You're working with me as a senior product designer, a senior UX designer and a design-engineering hiring manager in one. We're going to rework one project on my site, the **HHCD Data Platform**, from scratch: the story first, then the visual design, then the build.

## Background

- My site is `CBcbbb/chongbo.DesignEngineer` (Next.js 16, TypeScript, Tailwind 4; live at https://chongbo-design-engineer.vercel.app).
  - Its concept is "Printed to order": a recruiter says which skills they need, and a printer prints the matching parts of my work.
  - Each project is stored as evidence cards tagged by capability.
  - Clone it, then read these first, in this order:
    1. `docs/case-studies/PLAYBOOK.md`: **the standard for this work.** Follow it closely.
    2. `docs/HANDOFF.md`: full background on the site.
    3. `README.md`
- I'm applying to Granola's Design Engineer roles first, and possibly senior UX roles too. That's why cards are written to serve several lenses (playbook §3).
- Several projects are being reworked at the same time in separate conversations. Follow the parallel-work rules in playbook §9 exactly. **This conversation owns the shared case-file template and block library**, because HHCD sets the template the other projects will use.

## What I want

- **Visual design that is genuinely excellent.** Premium, modern, quiet and precise. It sits naturally beside the home page's printer, and it's in a different class from a template portfolio.
- **A story that is short and exact.** I'm a non-native speaker with good English. I want professional writing where every word hits the point. No filler, and above all no saying the same thing twice in different words.
- **Nothing made up.** Everything must come from my existing material or from what I tell you. If anything is missing, tell me, write it as `[what's missing]`, and we'll fill it in together. Never invent facts, numbers, quotes or outcomes, and never fill gaps with plausible-sounding detail I didn't give you.
- **Talk first, build second.** We get the story right, then the design, then the code, and I confirm each step before you move on.

## Sources for this project

Read all of them before asking me anything.

- `content/projects/hhcd.ts` in my site: the current copy. It's already tightened, and has open `[gaps]`.
- `docs/content-review.md` and `docs/copy-changes.md`: the HHCD entries.
- `CBcbbb/Helen-Hamlyn-Centre-for-Design-Data-Platform`: my rebuild of the platform in Next.js. Read `REPORT.md`, `README.md` and `docs/screenshots/`.
  - **Read-only here.** It's being changed in another conversation, so check its latest commits, and ask me what the current design is before describing it. For example, I've since decided the map is the homepage, with in-map onboarding.
- `CBcbbb/Helen-Hamlyn-Centre-Platform` and the live original at https://helen-hamlyn-centre-platform.vercel.app/: the first version. **Never modify this repo.**
- `CBcbbb/VOICE_Digital_Platform` and `CBcbbb/VOICE-Trail`: possibly the Brunel project where the method began. Confirm with me before using them.
- HHCD isn't on my old Wix portfolio. I wrote a LinkedIn post about it; ask me for the text.

What I've told you before:

- The platform's core idea is a non-hierarchical, rhizome-like network of people, projects, partners and methods. All nodes are equal.
- Full accessibility and responsive design are the main purpose. The brand colours are fixed.
- I designed and built it alone, with AI coding tools.
- I taught data visualisation with it to the Helen Hamlyn Centre's summer interns.

## Starting hypothesis (confirm or correct it with me)

- **Lead capabilities:** B (idea to production) and E (accessible, fast, findable), with D (craft and interaction) close behind. **Supporting:** C (tokens and publishing workflow) and A.
- **Lenses:** `engineer` opens on the build and accessibility; `web` opens on discoverability (static pages, metadata); `ux` opens on the problem (a spreadsheet nobody could explore) and the teaching insight.
- **Signature module:** something the reader can touch. For example, a live slice of the map, or the switch between the free network and the four-column view.

## Your first task

Follow playbook §8 steps 1 to 3, and stop for my approval after each:

1. **Summarise what exists** in 10 lines or fewer, and flag any contradictions between the sources. For example, the rebuild report versus my later decisions, or claims in `hhcd.ts` that the code doesn't support.
2. **Interview me.** Ask 5 to 8 sharp questions, a few at a time, about what only I know: the hardest decision, what failed first, real numbers, exactly what I did, and what I'd change now.
3. **Draft the card inventory** (playbook §3 format) with:
   - the canonical order;
   - the image inventory: keep / cut / redraw / missing, with reasons;
   - the gaps list.

Before the visual prototype (step 5), look at a few strong recent design-engineer and senior-product-designer case studies (playbook §7, "References"). Bring me two or three specific observations that should shape this page, with links you've checked.

When we reach the build, you'll also:

- turn the generic case-file page into the shared template and block library from playbook §7;
- add `--accent` / `--accent-2` per project;
- extend `content/schema.ts` for cards and lenses, and note the change in `docs/case-studies/SHARED-CHANGES.md` for the AI and Nike conversations.

Work on the branch `case/hhcd`, and merge only when I approve.

Use British English. If I write in Chinese, first give me the natural British English version of what I said, then answer.
