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
  oneLiner: "A component library customers preview with their own data, before they build with it.",
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
    { capability: "C", label: "Systems and reuse", section: "contract" },
    { capability: "B", label: "Idea to production", section: "fit-on-server" },
    { capability: "D", label: "Craft and interaction", section: "axis-pickers", icon: "picker" },
  ],
  parts: [
    { id: "components", label: "Part 1", title: "Components" },
    { id: "contracts", label: "Part 2", title: "Contracts" },
    { id: "connecting", label: "Part 3", title: "Connecting" },
    { id: "close", label: "Part 4", title: "Role" },
  ],
  cover: { kind: "module", module: "any-data/demo" },
  sections: [
    {
      id: "templates",
      part: "components",
      kind: "problem",
      title: "Templates made of components",
      body: [
        "Customers build their own pages as templates: layouts made of components. Each component drew demo data from its settings, and couldn't be pointed at a real stream.",
        "Every customer's data has a different shape. So I started from one question: what does a component need to know about the data it shows?",
      ],
      signals: ["data", "design-eng-gap", "judgement"],
      capabilities: ["C"],
      lenses: { ux: "in", engineer: "in" },
      media: { kind: "module", module: "any-data/templates" },
    },
    {
      id: "sample-data",
      nav: "Sample data",
      part: "components",
      kind: "decision",
      layout: "pair",
      title: "Sample data that follows the same rules as real data",
      body: [
        "Every component comes with sample data that fits its contract, tagged \"Sample\" wherever it appears. A component explains itself before anything is connected, and a real stream changes the data, not the component.",
        "No chart makes data up.",
      ],
      signals: ["reusable-components", "prototyping", "data"],
      capabilities: ["C", "B"],
      lenses: { ux: "in", engineer: "in" },
      media: { kind: "module", module: "any-data/sample-data" },
    },
    {
      id: "three-kinds",
      nav: "What connects, what asks",
      part: "components",
      kind: "decision",
      title: "Which components connect, and which ask the user",
      body: [
        "Charts and tables connect to a stream through its fields. Filters and search read the page instead, and forms send data out, so they wait for the user.",
        "I made that split a filter in the store, so customers see what a component needs before they choose it. Search finds components by field name too.",
      ],
      signals: ["judgement", "reusable-components", "design-systems"],
      capabilities: ["C", "D"],
      lenses: { ux: "in", engineer: "in" },
      media: { kind: "module", module: "any-data/store" },
    },
    {
      id: "contract",
      nav: "A shape, not field names",
      part: "contracts",
      kind: "decision",
      layout: "pair",
      title: "A component promises a shape, not field names",
      body: [
        "I based the model on ECharts' dataset: a chart names the roles it draws, and each page maps its data onto them. A contract lists those roles, their types, which are required and which one keys a row.",
        "A bar chart asks for a category and a value. It never needs to know that a stream calls them \"site\" and \"qty\".",
      ],
      signals: ["design-eng-gap", "reusable-components", "judgement"],
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

// Bar, pie, funnel, treemap and waterfall
// all declare the same contract.
export const BarChart = component({
  contract: totalsByCategory,
  settings: { sort: "desc" },
});`,
      },
    },
    {
      id: "one-per-dataset",
      nav: "One contract per dataset",
      part: "contracts",
      kind: "decision",
      title: "One contract per dataset",
      body: [
        "Contracts belong to the data, not to each component. Bar, pie, funnel, treemap and waterfall charts share one contract for totals by category.",
        "A customer who maps a stream once can try every chart that fits it, and the mapping stays.",
      ],
      signals: ["design-systems", "reusable-components", "data"],
      capabilities: ["C"],
      lenses: { ux: "in", engineer: "in" },
      media: { kind: "module", module: "any-data/trio" },
    },
    {
      id: "binding-only",
      nav: "Through the binding",
      part: "contracts",
      kind: "decision",
      title: "Data comes through the binding, never through settings",
      body: [
        "Components never subscribe to streams. An adapter turns each producer's format into flat rows, and a binding maps one slot's fields onto the contract's roles.",
        "A new data format needs a new adapter, never a change to the components.",
      ],
      signals: ["design-eng-gap", "end-to-end", "reusable-components"],
      capabilities: ["B", "C"],
      lenses: { engineer: "in" },
      media: { kind: "module", module: "any-data/pipeline" },
    },
    {
      id: "stream-fit",
      nav: "Ranked by fit",
      part: "connecting",
      kind: "decision",
      layout: "pair",
      title: "Streams ranked by fit, not listed by size",
      body: [
        "The first answer was to list every stream in the organisation by row count. A test organisation already had 74, most didn't fit, and users found out after reading a stream's rows.",
        "I grouped streams by fit instead: every field the component needs first, then \"Partly fits · 3 of 5 fields\", then the rest, collapsed and searchable. A stream with no data yet reads \"Unknown\", never \"Doesn't fit\".",
      ],
      signals: ["judgement", "prototyping", "data"],
      capabilities: ["D", "B"],
      lenses: { ux: "lead", engineer: "in", web: "in" },
      media: { kind: "module", module: "any-data/picker" },
    },
    {
      id: "fit-on-server",
      nav: "Fit on the server",
      part: "connecting",
      kind: "decision",
      title: "Fit judged on the server",
      body: [
        "The browser can't judge fit: a stream record has a name and a row count, but no field names. So I moved fit onto the server: one endpoint, in two phases.",
        "First, keep the field names from the entry the platform already reads, at no extra load. Later, a stored profile per stream, at the same cost for 50 streams or 5,000. The interface talks to the endpoint alone, so it doesn't change between phases.",
      ],
      signals: ["end-to-end", "design-eng-gap", "judgement"],
      capabilities: ["B", "C"],
      lenses: { engineer: "in" },
      media: { kind: "module", module: "any-data/phases" },
    },
    {
      id: "axis-pickers",
      nav: "Fields like chart axes",
      part: "connecting",
      kind: "decision",
      title: "Each field picked like a chart axis",
      body: [
        "The people connecting data aren't always engineers, so mapping can't read as configuration. Each role has a dropdown of the stream's fields, the way you pick a chart's axes.",
        "The panel suggests a field for each role, using aliases and industry terms (\"ccy\" for currency), and marks how sure it is: exact, known or close. The picker and the panel share one matcher, so they never disagree.",
      ],
      signals: ["motion-interaction", "prototyping", "data"],
      capabilities: ["D"],
      lenses: { ux: "in", engineer: "in", web: "in" },
      media: { kind: "module", module: "any-data/axis-pickers" },
    },
    {
      id: "role",
      nav: "My role",
      part: "close",
      kind: "role",
      surface: "dark",
      title: "From the data model to the interface",
      body: [
        "I designed the contract model, the store's interface and the preview, and built them, front end and server, with AI coding tools.",
      ],
      facts: [
        { label: "Design system", text: "Every component and the store's interface follow the design system I built." },
        { label: "Context", text: "Logistics infrastructure company. I'm its sole designer." },
      ],
      signals: ["end-to-end", "ai-tools", "design-systems"],
      capabilities: ["B"],
      lenses: { ux: "in", engineer: "in", web: "in" },
    },
  ],
  prompts: [
    "How do you work between design and engineering?",
    "How would you let customers use their own data?",
    "Have you built a component library?",
  ],
};
