import type { Project } from "../schema";

export const thisSite: Project = {
  slug: "this-site",
  title: "This site",
  oneLiner: "Prints the work you ask to see.",
  context: "Personal project · 2026",
  role: "Designed and built, working with AI coding tools",
  status: "Live",
  stack: ["Next.js", "TypeScript", "Tailwind", "CSS animation", "Claude API"],
  // Add { label: "Source", href: "https://github.com/CBcbbb/chongbo.DesignEngineer" } once the repo is public.
  links: [],
  tier: "main",
  tab: "ink",
  cover: {
    kind: "image",
    asset: "this-site/cover.png",
    alt: "The homepage: a printer with skill cards above it and a sheet of paper rising from its top slot.",
    need: "Generated automatically from the finished site.",
    ratio: "16:10",
  },
  sections: [
    {
      id: "idea",
      kind: "decision",
      title: "Ask, and it prints the matching work",
      body: [
        "Recruiters want different things, so the site lets them ask. A small model picks the sections of my work that show what they asked for, one per project, choosing only from content I wrote.",
        "I designed and built it with AI coding tools.",
      ],
      signals: ["prototyping", "ai-tools", "motion-interaction", "end-to-end"],
    },
    {
      id: "content",
      kind: "evidence",
      title: "Written once, shown three ways",
      body: [
        "Every project is a typed set of section cards. The same content feeds the browse view, the case files and the printed answers, so adding a project means adding one file.",
      ],
      signals: ["publishing-workflow", "reusable-components"],
    },
    {
      id: "foundations",
      kind: "evidence",
      title: "The unglamorous parts",
      body: [
        "Every page is static HTML with its own metadata, everything works by keyboard, and motion respects reduced-motion settings. If the AI is unavailable, the site still answers by matching the request against each section's topics.",
      ],
      signals: ["seo-performance", "accessibility", "judgement"],
    },
  ],
  prompts: ["How does this site work?", "What did you use to build this?"],
};
