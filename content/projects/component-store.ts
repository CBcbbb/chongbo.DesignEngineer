import type { Project } from "../schema";

// Confidentiality: never name the employer, its product names, its customers
// or its storage technology anywhere in this file or in the AI's knowledge.
export const componentStore: Project = {
  slug: "component-store",
  title: "Component Store",
  oneLiner: "Letting every customer preview our components with their own live data.",
  context: "Logistics infrastructure company · current role",
  role: "Only designer; designed and built it, working with AI coding tools",
  status: "In use",
  stack: ["React", "TypeScript", "Tailwind", "Design tokens"],
  links: [],
  tier: "main",
  tab: "slate",
  cover: {
    kind: "diagram",
    diagram: "data-contracts",
    caption: "Three layers, two contracts: streams become fields, fields meet components.",
  },
  sections: [
    {
      id: "problem",
      kind: "problem",
      title: "Components that only knew sample data",
      body: [
        "Our customers build their own logistics platforms from our components, and no two customers' data look alike. In the Component Store, every component could only show static sample data, so nobody could see how it would look with their own.",
        "It was a long-standing problem the front-end team hadn't solved.",
      ],
      signals: ["design-eng-gap", "data"],
    },
    {
      id: "contracts",
      kind: "decision",
      title: "Three layers joined by two data contracts",
      body: [
        "I proposed separating the problem into layers. The first contract turns any of the platform's live data streams into fields in a shared format: dates, numbers, names. Two unrelated streams that both carry an arrival time now look the same to everything downstream.",
        "The second contract lets each component declare the fields it needs. A pie chart asks for a label and a value; a timeline asks for dates.",
      ],
      signals: ["design-eng-gap", "reusable-components", "judgement"],
      media: { kind: "diagram", diagram: "data-contracts", caption: "Stream → fields → component." },
    },
    {
      id: "mapping",
      kind: "decision",
      title: "Mapping as a design problem, not a settings form",
      body: [
        "With the contracts in place, connecting data becomes a small, guided choice. You pick a stream, the component shows which fields it needs, you map each one, and a live preview updates as you go.",
        "The preview starts from sample data, so the component still explains itself before any data is connected.",
      ],
      signals: ["motion-interaction", "prototyping", "data"],
      media: {
        kind: "image",
        asset: "component-store/mapping.png",
        alt: "A component in the store with its required fields listed and mapped to fields from a chosen stream.",
        need: "OPTIONAL and only with permission: an anonymised screenshot of the field-mapping step, with company and customer names removed. Without it, the diagram carries this card.",
        ratio: "16:10",
      },
    },
    {
      id: "token-layers",
      kind: "evidence",
      title: "A design system in two layers",
      body: [
        "As the only designer, I also run the design system. It began in Figma, with components and palettes built for accessibility and every screen size, and now ships in code as a shared token package across five product lines.",
        "Each app imports it and retunes only what it needs, and customers can re-skin their platform with their own colours, fonts and button shapes.",
      ],
      signals: ["design-systems", "cross-platform", "reusable-components"],
      media: { kind: "diagram", diagram: "token-layers", caption: "Shared tokens, per-app overrides, per-customer themes." },
    },
    {
      id: "contrast-in-tokens",
      kind: "evidence",
      title: "Contrast rules built into the scales",
      body: [
        "Each colour scale has fixed roles: one step for surfaces, one for borders, one for text on white and one for text on tinted surfaces. Components use role names such as success or warning, never raw hues, so they stay readable whichever theme they're in.",
      ],
      signals: ["accessibility", "design-systems", "cross-platform"],
      media: {
        kind: "code",
        language: "css",
        caption: "Components use roles, not hue steps.",
        code: `/* Role families: components use these names, not hue steps */
--success: var(--green-500);
--success-container: var(--green-50);
--success-container-foreground: var(--green-700);
--success-text: var(--green-600); /* text on white */`,
      },
    },
    {
      id: "outcome",
      kind: "outcome",
      title: "In use across the platform",
      body: [
        "Customers can now preview any component with their own data before using it, and the design system keeps five product lines consistent while letting each one, and each customer, adapt it.",
      ],
      signals: ["end-to-end", "cross-platform"],
    },
  ],
  prompts: [
    "Have you built a design system?",
    "How do you work between design and engineering?",
    "How do you keep several products consistent?",
  ],
};
