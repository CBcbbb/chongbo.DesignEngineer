import type { Project } from "../schema";

/**
 * Copy: docs/case-studies/components-for-any-data/copy.md (draft 2, approved 11 October 2026). Every fact traces to
 * docs/case-studies/components-for-any-data/inventory.md → "Facts and their sources".
 *
 * Confidentiality (playbook §9): never name the employer, its products (the store's real name included), its
 * customers or its storage technology anywhere in this file, the case file's modules or the AI's knowledge. Every
 * stream, field and value on the page is invented. No progress: the copy says what the system does.
 * One term per thing: stream, field, role, contract, binding, adapter, source system, store, component.
 */
export const anyData: Project = {
  slug: "components-for-any-data",
  title: "Components for Any Data",
  oneLiner: "One component library that draws any customer's data, from the stream to the chart.",
  context: "Logistics infrastructure company · current role",
  client: "Logistics infrastructure company",
  role: "Design Engineer",
  period: "Current role",
  roleSplit: [{ with: "solo", what: "Data model, interface, front end and server design", note: "on my own, with Claude Code and Cursor" }],
  outcome:
    "One library serves every customer. Each component declares the shape of data it needs, and customers connect their own streams by choosing fields.",
  stack: ["React", "TypeScript", "Tailwind", "ECharts"],
  links: [],
  tier: "main",
  tab: "slate",
  template: "case-file",
  work: { title: "The preview panel, rebuilt for this case study", module: "any-data/demo" },
  coverArt: "wires",
  shows: [
    { capability: "B", label: "Front-end architecture", section: "pipeline", icon: "pipeline" },
    { capability: "C", label: "Data contracts", section: "contract", icon: "contract" },
    { capability: "D", label: "Data-binding UX", section: "axis-pickers", icon: "binding" },
  ],
  cover: { kind: "module", module: "any-data/demo" },
  parts: [
    { id: "model", label: "Part 1", title: "The model" },
    { id: "interface", label: "Part 2", title: "The interface" },
    { id: "outcome", label: "Part 3", title: "Outcome" },
  ],
  sections: [
    {
      id: "shapes",
      nav: "Different shapes",
      kind: "problem",
      part: "model",
      layout: "stack",
      title: "Every customer's data has a different shape",
      asks: 1,
      body: [
        "Our platform carries customers' operational data as live streams, and customers build their own products on it, picking components from our component store. But the components only showed fixed values in their settings, so no customer could see what their own data would look like in one. One set of sample data couldn't cover every case either, as each customer names and formats the same data differently.",
        "So I started from two questions: Can we connect live streams to the store's components? What does a component need to know about its data?",
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
      part: "model",
      layout: "stack",
      title: "A component promises a shape, not field names",
      body: [
        "I based the model on ECharts' dataset and encode: a chart type has fixed dimensions it draws, and encode maps the data's columns onto them. A contract adds what ECharts leaves out: each role's type, and which are required.",
        "Each component declares one contract, and a stream can feed it once its fields map onto that contract's roles. Components that draw the same shape share one, so a bar chart, a donut, a treemap and a table all declare the same contract. Sample data fits it too, so a component explains itself before anything is connected.",
      ],
      signals: ["design-eng-gap", "data-architecture", "reusable-components", "design-systems"],
      capabilities: ["C", "B"],
      lenses: { ux: "in", engineer: "lead" },
      media: { kind: "module", module: "any-data/contract" },
    },
    {
      id: "pipeline",
      nav: "One pipeline",
      kind: "decision",
      part: "model",
      layout: "stack",
      surface: "dark",
      title: "One pipeline from stream to chart",
      body: [
        "An adapter turns each source system's format into flat rows, a binding maps the stream's fields onto the contract's roles, the contract checks their types, and the component draws the roles. Components never subscribe to streams, and settings hold configuration only, never data.",
        "Charts and tables read a stream, filters and search read the page, and forms wait for the user.",
      ],
      signals: ["data-architecture", "design-eng-gap", "end-to-end", "ai-tools"],
      capabilities: ["B", "C"],
      lenses: { engineer: "in" },
      media: { kind: "module", module: "any-data/pipeline" },
    },
    {
      id: "stream-fit",
      nav: "Grouped by fit",
      kind: "decision",
      part: "interface",
      layout: "stack",
      title: "Streams grouped by fit, judged on the server",
      body: [
        "The first answer listed every stream by row count. A test organisation already had 74, and most didn't fit: users only found out after reading the rows.",
        "I grouped the list by fit instead. The browser can't judge fit, as a stream record carries no field names, so I designed one endpoint on the server to judge it.",
      ],
      signals: ["data-architecture", "judgement", "end-to-end"],
      capabilities: ["B", "D"],
      lenses: { ux: "lead", engineer: "in", web: "in" },
      media: { kind: "module", module: "any-data/fit" },
    },
    {
      id: "axis-pickers",
      nav: "Fields like chart axes",
      kind: "decision",
      part: "interface",
      layout: "stack",
      title: "Each field picked like a chart axis",
      body: [
        "The people connecting data aren't always engineers, so connecting fields can't feel like configuration. Each role has a dropdown of the stream's fields, the way you pick a chart's axes.",
        "The store suggests a field for each role from aliases and industry terms. The stream list and the field suggestions share one matcher, so a stream marked \"Fits\" always fills its fields.",
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
      bodyStyle: "list",
      part: "outcome",
      surface: "dark",
      title: "Takeaway",
      body: [
        "The store couldn't preview a customer's data, which looked like an interface problem. The cause was in the data model, so I defined the shape each component needs before designing the panel.",
        "Judging fit on the server lets users see which streams fit before they pick, however many there are.",
        "Every layer has one job, so a new source system needs a new adapter, and nothing else changes.",
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
