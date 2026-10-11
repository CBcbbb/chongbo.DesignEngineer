import type { Project } from "../schema";

/**
 * Copy: docs/case-studies/components-for-any-data/copy.md (draft 2, approved 11 October 2026). Every fact traces to
 * docs/case-studies/components-for-any-data/inventory.md → "Facts and their sources".
 *
 * Confidentiality (playbook §9): never name the employer, its products (the store's real name included), its
 * customers or its storage technology anywhere in this file, the case file's modules or the AI's knowledge. Every
 * stream, field and value on the page is invented. No status or progress: the copy says what the system does.
 * One term per thing: stream, field, role, contract, binding, adapter, store, template, component.
 */
export const anyData: Project = {
  slug: "components-for-any-data",
  title: "Components for Any Data",
  oneLiner: "One component library that draws any customer's data, from the stream to the chart.",
  context: "Logistics infrastructure company · current role",
  client: "Logistics infrastructure company",
  role: "Design Engineer",
  roleSplit: [{ with: "solo", what: "Data model, interface, front end and server", note: "on my own" }],
  outcome:
    "One library serves every customer. Each component declares the shape of data it needs, and customers connect their own streams by choosing fields.",
  status: "In use",
  stack: ["React", "TypeScript", "Tailwind", "ECharts"],
  links: [],
  tier: "main",
  tab: "slate",
  template: "case-file",
  work: { title: "The preview panel, rebuilt on invented data", module: "any-data/demo" },
  coverArt: "wires",
  shows: [
    { capability: "B", label: "Front-end architecture", section: "pipeline", icon: "layers" },
    { capability: "C", label: "Data contracts", section: "contract" },
    { capability: "D", label: "Data-binding UX", section: "axis-pickers", icon: "picker" },
  ],
  cover: { kind: "module", module: "any-data/demo" },
  sections: [
    {
      id: "shapes",
      nav: "Different shapes",
      kind: "problem",
      layout: "pair",
      title: "Every customer's data has a different shape",
      body: [
        "Customers build their own products on our platform, from our components. But each component showed the demo data written into its settings, and none could take a customer's real stream.",
        "So I started from one question: what does a component need to know about the data it shows?",
      ],
      signals: ["data", "design-eng-gap", "judgement"],
      capabilities: ["C"],
      lenses: { ux: "in", engineer: "in" },
      media: { kind: "module", module: "any-data/shapes" },
    },
    {
      id: "contract",
      nav: "A shape, not field names",
      kind: "decision",
      layout: "pair",
      title: "A component promises a shape, not field names",
      body: [
        "I based the model on ECharts' dataset: a chart names the roles it draws, and each page maps its data onto them. A contract lists those roles, their types and which are required.",
        "Contracts belong to the data, not to each component, so bar, pie, treemap and waterfall charts share one. Sample data fits the same contract, so a component explains itself before anything is connected.",
      ],
      signals: ["design-eng-gap", "data-architecture", "reusable-components", "design-systems"],
      capabilities: ["C", "B"],
      lenses: { ux: "in", engineer: "lead" },
      media: {
        kind: "code",
        language: "ts",
        code: `// A contract names the roles a component draws,
// not the fields a stream happens to have.
export const totalsByCategory = defineContract({
  id: "totals-by-category",
  key: "category",
  roles: {
    category: { type: "text",   required: true },
    value:    { type: "number", required: true },
    period:   { type: "date",   required: false },
  },
});

// Bar, pie, treemap and waterfall
// all declare the same contract.
export const BarChart = component({
  contract: totalsByCategory,
  settings: { sort: "desc" },
});`,
      },
    },
    {
      id: "pipeline",
      nav: "One pipeline",
      kind: "decision",
      title: "One pipeline from stream to chart",
      body: [
        "An adapter turns each producer's format into flat rows, a binding maps one slot's fields onto the contract's roles, and the component draws the roles. Components never subscribe to streams, and settings never carry data.",
        "Not every component takes a stream: filters and search read the page, and forms wait for the user.",
      ],
      signals: ["data-architecture", "design-eng-gap", "end-to-end"],
      capabilities: ["B", "C"],
      lenses: { engineer: "in" },
      media: { kind: "module", module: "any-data/pipeline" },
    },
    {
      id: "stream-fit",
      nav: "Ranked by fit",
      kind: "decision",
      title: "Streams ranked by fit, judged on the server",
      body: [
        "The first answer was to list every stream in the organisation by row count. A test organisation already had 74, most didn't fit, and users found out after reading a stream's rows.",
        "I grouped streams by fit instead: \"Fits\", then \"Partly fits · 3 of 5 fields\", then the rest, searchable. A stream record carries no field names, so one endpoint on the server judges fit, in two phases that never change the interface.",
      ],
      signals: ["data-architecture", "judgement", "end-to-end"],
      capabilities: ["B", "D"],
      lenses: { ux: "lead", engineer: "in", web: "in" },
      media: { kind: "module", module: "any-data/phases" },
    },
    {
      id: "axis-pickers",
      nav: "Fields like chart axes",
      kind: "decision",
      title: "Each field picked like a chart axis",
      body: [
        "The people connecting data aren't always engineers, so mapping can't read as configuration. Each role has a dropdown of the stream's fields, the way you pick a chart's axes.",
        "The panel suggests a field for each role from aliases and industry terms (\"ccy\" for currency), and says how sure it is: exact, known or close. The picker and the panel share one matcher, so they never disagree.",
      ],
      signals: ["motion-interaction", "prototyping", "data"],
      capabilities: ["D"],
      lenses: { ux: "in", engineer: "in", web: "in" },
      media: { kind: "module", module: "any-data/axis-pickers" },
    },
    {
      id: "takeaway",
      nav: "Takeaway",
      kind: "outcome",
      surface: "dark",
      bodyStyle: "list",
      title: "Takeaway",
      body: [
        "A preview problem turned out to be a data problem. Once each component declared its shape, the interface followed from it.",
        "Every layer has one job, so a new data source needs a new adapter, and nothing else changes.",
        "Each data decision came with the user behaviour it had to support, so the engineering and the interface were designed together.",
      ],
      signals: ["end-to-end", "judgement", "design-eng-gap"],
      capabilities: ["B", "C", "D"],
      lenses: { ux: "in", engineer: "in", web: "in" },
    },
  ],
  prompts: [
    "How do you work between design and engineering?",
    "How would you let customers use their own data?",
    "Have you designed a front-end architecture?",
  ],
};
