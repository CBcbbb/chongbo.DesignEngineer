import type { Project } from "../schema";

export const hhcd: Project = {
  slug: "hhcd-data-platform",
  title: "HHCD Data Platform",
  oneLiner: "A research archive you can browse as a network or a table.",
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
        "The centre wanted artists, researchers and students to explore its past projects and find methods to adapt.",
        "The records sat in one long spreadsheet, collected person by person, with who worked on what, the methods and the funders tangled into each person's row.",
      ],
      signals: ["data", "research"],
    },
    {
      id: "data-model",
      kind: "decision",
      title: "Re-modelling the data as four equal profiles",
      body: [
        "I rebuilt the data as four equal profile types: people, projects, partners and methods, with their links as data. The spreadsheet's structure would have put people at the centre of every view.",
        "A script converts the spreadsheets and reports duplicates, missing fields and broken links.",
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
      title: "A table view beside the graph",
      body: [
        "I kept the graph and added an accessible table with the same search and filters; a node-link graph is hard to use without a mouse or sight.",
        "Keyboard shortcuts, managed focus and announced result counts were built in early, while accessibility was cheap to add.",
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
      title: "Starting from one project, then the network",
      body: [
        "The rebuilt homepage explains one project, then steps out to its methods and people, and only then shows the full map.",
        "Teaching data visualisation with the platform, I watched [number of] students start from one real project; the connections only made sense once the pieces did.",
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
        "Every colour is a single token. Where a fixed brand colour failed contrast, I added a darker text variant; a script checks every text and background pairing.",
        "Staff edit records without code, in an admin panel that writes back to the spreadsheets.",
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
        "The rebuild gives all 48 entries a static page with metadata and preview images; the first version rendered in the browser, invisible to search engines.",
        "Automated accessibility checks pass on every main page, desktop and mobile. Screen reader and Safari testing are still to do.",
      ],
      signals: ["seo-performance", "end-to-end", "accessibility"],
    },
    {
      id: "origin",
      kind: "role",
      title: "A method that outlived its first project",
      body: [
        "The method began on an EU-funded Brunel project [project name and years], where I was a research assistant. Brunel withdrew early; the centre's platform reuses the model with its own data.",
        "I designed and built both alone with AI coding tools and taught it to the centre's summer interns.",
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
