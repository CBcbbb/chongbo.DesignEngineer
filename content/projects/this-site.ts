import type { Project } from "../schema";

export const thisSite: Project = {
  slug: "this-site",
  title: "This site",
  oneLiner: "A portfolio you can ask questions, built to be read without asking any.",
  context: "Personal project · 2026",
  role: "Designed and built, working with AI coding tools",
  status: "Live",
  stack: ["Next.js", "TypeScript", "Tailwind", "Motion", "Claude API"],
  // Add { label: "Source", href: "https://github.com/CBcbbb/chongbo.DesignEngineer" } once the repo is public.
  links: [],
  tier: "main",
  tab: "ink",
  cover: {
    kind: "image",
    asset: "this-site/cover.png",
    alt: "The portfolio's homepage: an index-card drawer with a typed question card in front of it.",
    need: "Generated automatically from the finished site.",
    ratio: "16:10",
  },
  sections: [
    {
      id: "idea",
      kind: "decision",
      title: "Ask, and a card is pulled from the drawer",
      body: [
        "Recruiters care about different things, so the site lets you ask. A small model reads your question and picks the cards from my work that answer it; the interface does the rest.",
        "The model never writes the page. It can only choose from content I wrote, which keeps answers accurate and the design consistent.",
      ],
      signals: ["prototyping", "ai-tools", "motion-interaction"],
    },
    {
      id: "content",
      kind: "evidence",
      title: "Written once, shown two ways",
      body: [
        "Every project is a typed set of section cards. The same content powers the dealt cards, the full case files and the answers to questions, so adding a project means adding one file.",
      ],
      signals: ["publishing-workflow", "reusable-components"],
    },
    {
      id: "foundations",
      kind: "evidence",
      title: "The unglamorous parts",
      body: [
        "Every page is static HTML with its own metadata, everything works by keyboard, motion respects reduced-motion settings, and the site still works if the AI is unavailable: it falls back to matching your question against the cards' topics.",
      ],
      signals: ["seo-performance", "accessibility", "judgement"],
    },
  ],
  prompts: ["How does this site work?", "What did you use to build this?"],
};
