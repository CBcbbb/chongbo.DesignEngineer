/**
 * Job descriptions for the /ask eval harness (`npm run eval:ask`), with the cards a good print should show.
 *
 * Every JD is written for this eval: the companies are invented, and none is copied from a real advert. They cover the
 * roles the site is read for (playbook §1): design engineer, product designer, design systems, accessibility, data
 * visualisation, and brand and web.
 *
 * Expectations, per fixture:
 *  - `must`: the cards a good print includes. Recall is measured against these, capped at six (the printer's limit).
 *  - `ok`: cards that are fine to print. They don't count for recall or against precision.
 *  - any other printed card counts against precision.
 *  - `missing.expect`: labels the print should report as "No work to show yet for …"; `missing.never`: labels it must not.
 *
 * `reviewed` stays false until Chongbo has checked a fixture's expectations; the report marks unreviewed rows, so a
 * score against an unchecked expectation is never read as a fact. When card ids change (SHARED-CHANGES.md), update
 * these; tests/unit/eval-fixtures.test.ts fails on any id that no longer exists or belongs to a hidden project.
 */

export type CardId = `${string}#${string}`;

export type Family = "design-engineer" | "product-designer" | "design-systems" | "accessibility" | "data-visualisation" | "brand-web";

export type JdFixture = {
  id: string;
  family: Family;
  /** The role as advertised. */
  title: string;
  jd: string;
  must: CardId[];
  ok: CardId[];
  missing?: { expect?: string[]; never?: string[] };
  /** What a good print looks like, in a sentence, for the person reviewing the expectations. */
  note: string;
  reviewed: boolean;
};

const hh = (s: string): CardId => `hhcd-data-platform#${s}`;
const cad = (s: string): CardId => `components-for-any-data#${s}`;
const ds = (s: string): CardId => `design-system#${s}`;
const nk = (s: string): CardId => `nike-athletes-closet#${s}`;

export const JDS: JdFixture[] = [
  // Design engineer
  {
    id: "de-product",
    family: "design-engineer",
    title: "Design Engineer, Product",
    jd: `Design Engineer, Product (London, hybrid)

Northlight builds planning software for construction teams. We're hiring a design engineer to sit between our designers and engineers and take product work from an idea in Figma to production.

What you'll do
- Design and build product surfaces in React, TypeScript and Tailwind.
- Own our component library with the design team, and make sure what's in Figma is what ships.
- Close the gap between design and engineering: write the components yourself instead of handing over specs.
- Prototype new interactions quickly and test them with customers.
- Take features end to end, from the data they need to the last detail of the UI.

About you
- A portfolio of shipped product work, with the reasoning behind your decisions.
- Strong front-end skills and a good eye for detail.
- Comfortable working with engineers on APIs and data models.
- You use AI coding tools as part of your daily work.`,
    must: [ds("in-code"), cad("contract"), cad("pipeline"), hh("role"), ds("figma-library")],
    ok: [ds("three-layers"), ds("roles"), cad("axis-pickers"), cad("stream-fit"), cad("takeaway"), hh("taken-up"), hh("guide"), hh("sample-data"), nk("components")],
    note: "Code and contracts lead: the design system in code, the component contract and pipeline, HHCD's one-person role.",
    reviewed: false,
  },
  {
    id: "de-ai",
    family: "design-engineer",
    title: "Design Engineer, AI Interfaces",
    jd: `Design Engineer, AI Interfaces

At Fieldnote we're building an assistant for researchers. The interface is the product, and nobody has settled what a good AI interface looks like yet. We need a design engineer to invent and prototype new interaction patterns for AI-driven tools.

You will
- Prototype new interactions in code, fast, and throw most of them away.
- Design how people steer, correct and trust an assistant's output.
- Work with LLMs every day: Claude, GPT and Cursor are part of how we build.
- Ship the prototypes that work into production React.
- Care about motion and small details that make the product feel considered.

You have
- Shipped interactive work you can show and talk through.
- Experience prototyping with real or sample data before the backend exists.
- Good judgement about when a prototype has answered its question.`,
    must: [hh("sample-data"), hh("guide"), ds("in-code"), cad("pipeline")],
    ok: [cad("axis-pickers"), hh("arrangements"), nk("draw"), nk("star-voice"), nk("views"), hh("keyboard"), cad("stream-fit"), hh("no-borders")],
    missing: { never: ["Claude", "GPT", "Cursor", "React"] },
    note: "Prototyping and work with AI tools: the Obsidian prototype, the onboarding, the two cards that used AI coding tools.",
    reviewed: false,
  },
  {
    id: "de-web-brand",
    family: "design-engineer",
    title: "Design Engineer, Web and Brand",
    jd: `Design Engineer, Web and Brand

Marlow is a note-taking app with a small, design-led team. Our website is often the first thing people see, and we want it to tell our story as well as the product does.

The role
- Design and build our marketing website and landing pages in React and Next.js.
- Work with brand on typography, layout and hierarchy for launches and campaigns.
- Add motion and microinteractions that feel crafted, not decorative.
- Keep the site fast, accessible and well optimised for search.
- Build reusable page templates and a publishing workflow so marketing can ship pages without us.

You
- Have a portfolio that shows strong visual and typographic judgement.
- Have shipped websites, not only product UI.
- Sweat the details of interaction and motion.`,
    must: [nk("graphic-system"), nk("style"), nk("views"), nk("draw")],
    ok: [nk("star-voice"), nk("retouching"), nk("tags"), nk("product-card"), nk("components"), hh("arrangements"), hh("guide"), hh("narrow-screens"), hh("keyboard"), ds("three-layers"), ds("roles")],
    missing: { expect: ["SEO and performance", "Publishing workflows"], never: ["React", "Next.js"] },
    note: "Nike's brand and motion cards lead; SEO and publishing workflows are reported as missing, since no card shows them.",
    reviewed: false,
  },
  {
    id: "de-fullstack",
    family: "design-engineer",
    title: "Design Engineer (full stack)",
    jd: `Design Engineer, full stack

Relay builds scheduling software for clinics. Our interfaces sit on top of a lot of messy data, and the hard problems are usually in the data layer, not the pixels.

What you'll do
- Design the data layer between our backend and the UI: APIs, schemas and the contracts components rely on.
- Build front ends in React and TypeScript on top of Node services.
- Decide what the server should judge and what the browser should.
- Work across the stack, from the API endpoint to the component.

What we're looking for
- Experience designing APIs and data models for interfaces.
- Comfort with Postgres and SQL.
- A track record of owning features end to end.`,
    must: [cad("pipeline"), cad("stream-fit"), cad("contract")],
    ok: [cad("takeaway"), cad("shapes"), cad("axis-pickers"), hh("taken-up"), hh("role"), hh("four-types"), ds("in-code")],
    missing: { expect: ["databases"], never: ["React", "TypeScript", "APIs", "backend"] },
    note: "The three data-architecture cards, pipeline or stream fit first; databases are honestly missing.",
    reviewed: false,
  },

  // Product designer
  {
    id: "pd-b2b",
    family: "product-designer",
    title: "Senior Product Designer, B2B",
    jd: `Senior Product Designer, B2B platform

Quarry makes software that procurement teams use all day. Our users are experts, our workflows are complex, and our screens are full of data.

You'll
- Own the design of complex workflows end to end, from research to shipped UI.
- Make and defend trade-offs between power and simplicity.
- Design for people who aren't engineers but have to configure technical things.
- Work closely with engineering on what is feasible and what is worth building.
- Run research with customers and turn it into decisions.

You'll need
- 5+ years of product design, ideally on data-heavy B2B products.
- Clear thinking about the reasoning behind your decisions.
- Please include 2-3 case studies that show how you made your hardest decisions.`,
    must: [cad("stream-fit"), cad("axis-pickers"), hh("four-types"), hh("dual-view"), cad("shapes")],
    ok: [cad("takeaway"), cad("contract"), hh("no-borders"), hh("workshop"), hh("testing"), hh("brief"), ds("customer-colour"), ds("three-layers"), ds("drift"), hh("role")],
    note: "Judgement on complex data: stream fit, axis pickers, HHCD's four types and dual view. The 2-3 case studies line is not a request to print three projects.",
    reviewed: false,
  },
  {
    id: "pd-consumer",
    family: "product-designer",
    title: "Product Designer, Growth",
    jd: `Product Designer, Growth

Kitebag is a consumer shopping app with two million monthly users on iOS and Android. We're looking for a product designer to join our growth team.

You'll
- Design experiments that move conversion, engagement and retention.
- Run A/B tests with our analysts and read the results with them.
- Work on the moments that turn browsing into buying: product cards, recommendations, rewards.
- Keep the brand's voice and visual quality while you optimise.

You have
- Shipped consumer work with measurable results.
- Experience designing for native mobile apps.
- A feel for what makes people come back.`,
    must: [nk("tags"), nk("product-card"), nk("ranking"), nk("draw")],
    ok: [nk("outcome"), nk("star-voice"), nk("views"), nk("style"), nk("graphic-system"), nk("components")],
    missing: { expect: ["A/B testing", "native iOS or Android"] },
    note: "Nike's conversion cards; A/B testing and native mobile are honestly missing.",
    reviewed: false,
  },
  {
    id: "pd-research",
    family: "product-designer",
    title: "Product Designer, research-led",
    jd: `Product Designer (research-led)

Common Ground designs digital services for community organisations and charities. Our users range from volunteers to researchers, and many aren't confident with technology.

The role
- Plan and run research: interviews, workshops and usability testing.
- Turn what you learn into design decisions and explain them to partners.
- Design services that work for a broad, mixed audience, including people with access needs.
- Prototype early and test often with real people.

About you
- Experience running workshops with several stakeholders at once.
- You can show how research changed a design.
- You're comfortable working across organisations with different priorities.`,
    must: [hh("workshop"), hh("testing"), hh("no-borders"), hh("brief")],
    ok: [hh("four-types"), hh("sample-data"), hh("dual-view"), hh("keyboard"), hh("role"), hh("guide"), hh("narrow-screens")],
    note: "HHCD's research cards: the workshop with seven organisations, testing, the network decision and the brief.",
    reviewed: false,
  },

  // Design systems
  {
    id: "ds-designer",
    family: "design-systems",
    title: "Design Systems Designer",
    jd: `Design Systems Designer

Harbour runs several products for property managers, built by different teams over the years. They no longer look like one family. We're hiring a designer to own our design system.

You'll
- Build and maintain our Figma library: variables, components, variants and modes.
- Define design tokens for colour, type and spacing, with light and dark themes.
- Bring our products back into one consistent system without blocking the teams that use it.
- Support theming for customers who want their own brand on our product.
- Write guidance so designers and engineers use the system the same way.

You have
- Built or run a design system across more than one product.
- Deep Figma skills, including variables and component properties.
- A good understanding of how tokens become code.`,
    must: [ds("three-layers"), ds("figma-library"), ds("drift"), ds("client-looks"), ds("roles"), ds("in-code")],
    ok: [ds("fixed-lightness"), ds("dark"), ds("customer-colour"), ds("outcome"), nk("components"), nk("graphic-system"), hh("contrast"), cad("contract")],
    note: "The design system case file: three layers, the Figma library, drift, client looks, roles and code.",
    reviewed: false,
  },
  {
    id: "ds-engineer",
    family: "design-systems",
    title: "Design Systems Engineer",
    jd: `Design Systems Engineer

At Tessellate our component library is used by eight product teams. We want an engineer with a designer's eye to own it in code.

What you'll do
- Build and maintain our React component library and its design tokens.
- Ship tokens from Figma into code so a change in one place reaches every product.
- Define component APIs that are hard to misuse.
- Document components in Storybook.
- Make accessibility part of every component, not a later audit.

What you'll bring
- Strong React and TypeScript.
- Experience turning a Figma library into a code package.
- Opinions about how components should be composed and themed.`,
    must: [ds("in-code"), ds("three-layers"), ds("roles"), cad("contract")],
    ok: [ds("figma-library"), ds("drift"), ds("outcome"), ds("fixed-lightness"), ds("customer-colour"), ds("dark"), nk("components"), cad("pipeline"), hh("contrast")],
    missing: { never: ["React", "TypeScript", "Figma"] },
    note: "The system as a code package, its layers and roles, and the component contract as a component API.",
    reviewed: false,
  },
  {
    id: "ds-theming",
    family: "design-systems",
    title: "Product Designer, Theming and White-label",
    jd: `Product Designer, Theming

Brightwell sells a white-label booking product. Every customer puts their own brand on it, and every customer's brand breaks something: unreadable buttons, glowing borders in dark mode, colours nobody tested.

You'll
- Design a theming model that lets customers change colour, type and shape safely.
- Make sure any brand colour a customer picks keeps text readable, in light and dark mode.
- Design dark mode properly, not as an inversion.
- Work with engineering on how themes are applied in code.

You have
- Experience with multi-brand or white-label design systems.
- A strong understanding of colour, contrast and WCAG.`,
    must: [ds("customer-colour"), ds("client-looks"), ds("dark"), ds("fixed-lightness"), ds("three-layers")],
    ok: [ds("roles"), ds("outcome"), ds("in-code"), ds("drift"), hh("contrast")],
    note: "Readable with any customer's colour, client looks, dark mode, fixed lightness, the three layers.",
    reviewed: false,
  },

  // Accessibility
  {
    id: "a11y-specialist",
    family: "accessibility",
    title: "Accessibility Designer",
    jd: `Accessibility Designer

Ledger & Co is a bank that wants its digital products to work for everyone. We're hiring a designer who makes accessibility the starting point.

You'll
- Design to WCAG 2.2 AA and help teams understand what it means in practice.
- Make complex interfaces usable by keyboard and with screen readers.
- Audit products, and test them with disabled users, not only with automated tools.
- Pair with engineers on ARIA, focus order and colour contrast.

You'll have
- Shipped accessible work you can walk us through.
- Experience testing with assistive technology.
- An understanding of where automated checks fall short.`,
    must: [hh("keyboard"), hh("testing"), hh("contrast"), hh("dual-view")],
    ok: [hh("narrow-screens"), hh("brief"), hh("arrangements"), hh("guide"), hh("role"), ds("customer-colour"), ds("fixed-lightness"), ds("dark"), ds("roles"), ds("outcome")],
    note: "HHCD's accessibility cards: keyboard, testing (where automated checks missed), contrast and the dual view.",
    reviewed: false,
  },
  {
    id: "a11y-colour",
    family: "accessibility",
    title: "Visual Designer, Accessible Colour",
    jd: `Visual Designer, Colour and Accessibility

Ostrander's product has grown a dozen colour palettes over the years, and half of them fail contrast. We want a designer to rebuild our colour system so it is accessible by construction.

You'll
- Design colour scales where every step has a clear job and passes contrast.
- Handle fixed brand colours that fail as small text.
- Design a dark mode that holds its contrast.
- Check every pairing, in both modes, with tooling rather than by eye.

You have
- A deep understanding of colour spaces, contrast and WCAG.
- Experience working with brand colours you can't change.`,
    must: [ds("fixed-lightness"), ds("customer-colour"), hh("contrast"), ds("dark"), ds("roles")],
    ok: [ds("three-layers"), ds("outcome"), ds("client-looks"), hh("testing")],
    note: "OKLCH steps, any customer's colour, HHCD's fixed brand colours, dark mode, roles.",
    reviewed: false,
  },
  {
    id: "a11y-public",
    family: "accessibility",
    title: "Interaction Designer, public services",
    jd: `Interaction Designer, public services

We design digital services for a city council. Everyone has to be able to use them: on an old phone, with a screen reader, by keyboard, or with little confidence online.

You'll
- Design inclusive services, mobile first, that meet WCAG 2.2 AA.
- Make sure every journey works on narrow screens and by keyboard.
- Test with real residents, including people with access needs.
- Explain accessibility decisions to colleagues and partners.

You have
- Experience designing accessible, responsive interfaces.
- Experience of usability testing with a broad audience.`,
    must: [hh("narrow-screens"), hh("keyboard"), hh("testing"), hh("brief")],
    ok: [hh("dual-view"), hh("contrast"), hh("workshop"), hh("guide"), hh("arrangements"), hh("role"), ds("customer-colour"), ds("fixed-lightness"), ds("dark")],
    note: "HHCD: responsive design, keyboard, testing and the brief that put accessibility first.",
    reviewed: false,
  },

  // Data visualisation
  {
    id: "dv-engineer",
    family: "data-visualisation",
    title: "Data Visualisation Engineer",
    jd: `Data Visualisation Engineer

Atlas Lab publishes interactive data stories and tools. We're looking for someone who can design a visualisation and build it.

What you'll do
- Design and build interactive charts, maps and network graphs in D3 and React.
- Choose the right form for the data, and say why.
- Make visualisations that work by keyboard and with screen readers.
- Animate between views of the same data so readers keep their place.

What you'll bring
- A portfolio of interactive visualisations you designed and built.
- Strong JavaScript or TypeScript.
- Experience with messy real-world data.`,
    must: [hh("no-borders"), hh("arrangements"), hh("dual-view"), cad("contract"), cad("pipeline")],
    ok: [hh("four-types"), hh("keyboard"), hh("guide"), cad("axis-pickers"), cad("shapes"), cad("stream-fit"), hh("taken-up"), hh("narrow-screens"), hh("role")],
    note: "HHCD's network and its two arrangements and dual view; the chart components that draw any data.",
    reviewed: false,
  },
  {
    id: "dv-dashboards",
    family: "data-visualisation",
    title: "Product Designer, Dashboards",
    jd: `Product Designer, Analytics Dashboards

Signalhouse gives energy companies live dashboards over streams of meter readings. Every customer's data looks different, and our charts have to cope.

You'll
- Design dashboards and chart components that work with any customer's data.
- Design how users connect their data to a chart without writing configuration.
- Help users see quickly which data fits which chart.
- Work with engineering on the data model behind the components.

You have
- Experience designing data-heavy products and dashboards.
- An understanding of how charts map data onto axes.`,
    must: [cad("shapes"), cad("axis-pickers"), cad("stream-fit"), cad("contract"), cad("pipeline")],
    ok: [cad("takeaway"), hh("dual-view"), hh("four-types"), hh("arrangements")],
    missing: { never: ["analytics"] },
    note: "The whole Components for Any Data case file. 'Analytics dashboards' is dashboards, not missing analytics work.",
    reviewed: false,
  },
  {
    id: "dv-archive",
    family: "data-visualisation",
    title: "Digital Designer, Research Collections",
    jd: `Digital Designer, Research Collections

A university research institute wants to open its archive of projects, methods and partners to the public. The data is uneven, the audience is broad, and the result has to be accessible.

You'll
- Design how the collection is explored: as a map, a list or something new.
- Work with researchers to decide how the data is collected and structured.
- Make the platform accessible to everyone, on any device.
- Help the institute take the platform on and keep it going.

You have
- Experience with research data or digital collections.
- Experience designing interactive, accessible data interfaces.`,
    must: [hh("no-borders"), hh("four-types"), hh("dual-view"), hh("taken-up"), hh("arrangements")],
    ok: [hh("keyboard"), hh("workshop"), hh("testing"), hh("sample-data"), hh("brief"), hh("guide"), hh("narrow-screens"), hh("role"), hh("contrast")],
    note: "HHCD end to end: the network, four types, the dual view, its take-up by the Centre.",
    reviewed: false,
  },

  // Brand and web
  {
    id: "bw-campaign",
    family: "brand-web",
    title: "Digital Designer, Brand Campaigns",
    jd: `Digital Designer, Brand Campaigns

We're a creative agency working with sportswear and lifestyle brands. We need a digital designer for in-app campaigns and social content.

You'll
- Design campaign visuals, posters and in-app editorial features.
- Set typography, layout and art direction for a season's campaign.
- Retouch campaign photography to one consistent tone.
- Build a visual system that lets the campaign change each season without a redesign.

You have
- A strong portfolio of brand and campaign work.
- Excellent typography and image-making skills.
- Experience working with a client's brand guidelines.`,
    must: [nk("graphic-system"), nk("style"), nk("retouching")],
    ok: [nk("views"), nk("star-voice"), nk("draw"), nk("outcome"), nk("components"), nk("product-card"), nk("tags"), nk("ranking")],
    note: "Nike's creative system, the unified style and the retouching.",
    reviewed: false,
  },
  {
    id: "bw-motion",
    family: "brand-web",
    title: "Interaction and Motion Designer",
    jd: `Interaction and Motion Designer

Oriel makes a learning app for adults. We want the product to feel alive: transitions that explain where things went, onboarding that teaches by doing, rewards that feel earned.

You'll
- Design microinteractions, transitions and motion across the product.
- Design onboarding that waits for people to try things, rather than slides they skip.
- Prototype interactions in code or in tools like Framer and Lottie.
- Make sure motion respects reduced-motion settings.

You have
- A portfolio of interaction and motion work in shipped products.
- Strong prototyping skills.`,
    must: [hh("guide"), hh("arrangements"), nk("draw"), nk("views"), nk("star-voice")],
    ok: [cad("axis-pickers"), hh("keyboard"), hh("sample-data")],
    note: "Motion and interaction: the onboarding inside the map, the two arrangements, Nike's prize draw, views and Star Voice.",
    reviewed: false,
  },
];
