import type { Project } from "../schema";

// Confidentiality: never name the employer, its product names, its customers
// or its storage technology anywhere in this file or in the AI's knowledge.
export const componentStore: Project = {
  slug: "component-store",
  title: "Component Store",
  oneLiner: "Letting every customer preview our components with their own live data.",
  context: "Logistics infrastructure company · current role",
  role: "Only designer; designed and built it",
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
        "Every component in the store showed only static sample data, so customers couldn't see it with their own. They build logistics platforms from our components, and no two customers' data look alike.",
        "It was a long-standing problem the front-end team hadn't solved.",
      ],
      signals: ["design-eng-gap", "data"],
    },
    {
      id: "contracts",
      kind: "decision",
      title: "Three layers joined by two data contracts",
      body: [
        "I proposed three layers joined by two contracts. The first turns any live data stream into shared fields: dates, numbers, names.",
        "The second lets each component declare the fields it needs; a pie chart asks for a label and a value.",
      ],
      signals: ["design-eng-gap", "reusable-components", "judgement"],
      media: { kind: "diagram", diagram: "data-contracts", caption: "Stream → fields → component." },
    },
    {
      id: "mapping",
      kind: "decision",
      title: "Connecting data as a guided choice",
      body: [
        "The contracts make connecting data a short guided choice: pick a stream, see the fields the component needs, map each one and watch the live preview update.",
        "The preview starts on sample data, so the component explains itself before anything is connected.",
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
        "My design system began in Figma, built for accessibility and every screen size, and now ships as a shared token package across five product lines.",
        "Each app overrides only what it needs, and customers apply their own colours, fonts and button shapes.",
      ],
      signals: ["design-systems", "cross-platform", "reusable-components"],
      media: { kind: "diagram", diagram: "token-layers", caption: "Shared tokens, per-app overrides, per-customer themes." },
    },
    {
      id: "contrast-in-tokens",
      kind: "evidence",
      title: "Contrast rules built into the scales",
      body: [
        "Each colour scale has fixed roles: one step for surfaces, one for borders, one for text on white and one for text on tints. Components use role names such as success or warning, never raw hues, so they stay readable in any theme.",
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
        "Customers now preview any component with their own data before using it. Five product lines share the design system, and each line and customer adapts it.",
        "I built it with AI coding tools. [How many customers use live previews]",
      ],
      signals: ["end-to-end", "cross-platform", "ai-tools"],
    },
  ],
  prompts: [
    "Have you built a design system?",
    "How do you work between design and engineering?",
    "How do you keep several products consistent?",
  ],
};
