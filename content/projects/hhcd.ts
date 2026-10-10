import type { Project } from "../schema";

export const hhcd: Project = {
  slug: "hhcd-data-platform",
  title: "HHCD Data Platform",
  oneLiner: "A research archive you can explore as a network or read as a table.",
  context: "Helen Hamlyn Centre for Design, Royal College of Art",
  role: "Sole designer and developer, from data model to deployment",
  status: "Live",
  stack: ["Next.js", "TypeScript", "D3", "Tailwind", "Playwright", "axe"],
  links: [
    { label: "Live platform", href: "https://helen-hamlyn-centre-platform.vercel.app/" },
    // Add the rebuild's repo or preview URL here once it is public.
  ],
  tier: "main",
  tab: "moss",
  cover: {
    kind: "image",
    asset: "hhcd/cover.png",
    alt: "The platform's network map: partners, people, projects and methods in four columns, joined by fine lines.",
    need: "Screenshot of the rebuilt network map at 1440px (already in the rebuild repo: docs/screenshots/explore-1440.png).",
    ratio: "16:10",
  },
  sections: [
    {
      id: "problem",
      kind: "problem",
      title: "Years of research, kept in one spreadsheet",
      body: [
        "The centre wanted its past projects to be explorable by the people who could learn from them: artists, researchers and students looking for methods to adapt.",
        "The records had been collected person by person, in one long spreadsheet. Who worked on what, which methods they used and who funded it were all tangled into each person's row.",
      ],
      signals: ["data", "research"],
    },
    {
      id: "data-model",
      kind: "decision",
      title: "Re-modelling the data so nothing outranks anything else",
      body: [
        "Following the collection logic would have made people the centre of every view. Instead, I rebuilt the data as four equal kinds of profile: people, projects, partners and methods, with the relationships between them as first-class data.",
        "A conversion script turns the centre's spreadsheets into structured data and writes a quality report, flagging duplicates, missing fields and links that point nowhere.",
      ],
      signals: ["data", "judgement", "publishing-workflow"],
      media: {
        kind: "image",
        asset: "hhcd/data-model.png",
        alt: "Before and after: one person-first spreadsheet row, and the same information as four linked profiles.",
        need: "A simple before/after diagram of the data model. I can draw this in code if you prefer; just confirm.",
        ratio: "16:10",
      },
    },
    {
      id: "dual-view",
      kind: "decision",
      title: "Two views instead of a simpler graph",
      body: [
        "A node-link graph shows connections well but is hard to use without a mouse or sight. Rather than simplify it, I gave every entry a second home in an accessible table view, with the same search and filters.",
        "Keyboard shortcuts, managed focus and announced result counts were designed in from the start, because structural accessibility costs little early and a great deal later.",
      ],
      signals: ["accessibility", "judgement", "data"],
      media: {
        kind: "image",
        asset: "hhcd/table-view.png",
        alt: "The table view: one table per entity type, with search and type filters above it.",
        need: "Screenshot of /explore/table from the rebuild at 1440px.",
        ratio: "16:10",
      },
    },
    {
      id: "one-example-first",
      kind: "decision",
      title: "Overview first, turned around",
      body: [
        "Teaching data visualisation with the platform, I watched students navigate it. People learning from past research start from one real project, not the whole network; the connections only make sense once the pieces do.",
        "So the rebuilt homepage explains a single project, then steps outwards to its methods and people, and only then offers the full map.",
      ],
      signals: ["research", "judgement", "typography"],
      media: {
        kind: "image",
        asset: "hhcd/homepage.png",
        alt: "The rebuilt homepage, opening on one project with a rail marking each step outwards.",
        need: "Screenshot of the rebuilt homepage (docs/screenshots/home-1440.png in the rebuild repo).",
        ratio: "4:3",
      },
    },
    {
      id: "tokens-and-publishing",
      kind: "evidence",
      title: "One source for colour, one source for content",
      body: [
        "Every colour lives once, as a token. The brand palette was fixed, so I added darker text variants where a brand colour failed contrast, and a script checks every text and background pairing the site uses.",
        "An admin panel lets staff edit records without touching code, writing back to the spreadsheets rather than to generated files.",
      ],
      signals: ["design-systems", "accessibility", "publishing-workflow"],
      media: {
        kind: "code",
        language: "css",
        caption: "Brand colours stay as marks; darker variants carry text.",
        code: `--color-projects: #EB631A;      /* shape on white: 3.32:1 */
--color-projects-text: #A8470F; /* text on white: 5.88:1 */`,
      },
    },
    {
      id: "rebuild",
      kind: "outcome",
      title: "Rebuilt to be found, linked and shared",
      body: [
        "The first version drew everything in the browser under a single address, so search engines saw an empty page. The rebuild in Next.js and TypeScript gives each of its 48 entries its own static page, with real HTML, metadata and preview images.",
        "Automated accessibility checks pass on every main page at desktop and mobile widths. Screen reader and Safari testing are still to do.",
      ],
      signals: ["seo-performance", "end-to-end", "accessibility"],
    },
    {
      id: "origin",
      kind: "role",
      title: "A method that outlived its first project",
      body: [
        "The approach began on an EU-funded research project at Brunel University, where I was a research assistant. Brunel withdrew before it finished, but the method carried over: the centre's platform uses the same model with its own data.",
        "I designed and built both alone, working with AI coding tools, and later taught it to the centre's summer interns.",
      ],
      signals: ["end-to-end", "ai-tools", "reusable-components"],
    },
  ],
  prompts: [
    "How do you approach accessibility?",
    "Show me something you built end to end.",
    "How do you handle messy data?",
  ],
};
