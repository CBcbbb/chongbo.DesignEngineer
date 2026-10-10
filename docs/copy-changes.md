# Copy changes

Branch `printed-to-order`. Rule applied: concise, say each thing once, keep every fact, invent nothing.
Limits: one-liner ≤ 12 words, section title ≤ 8 words, section body ≤ 45 words in 1–2 paragraphs, first sentence carries the point. British English, first person, no em dashes, no "not X but Y".

Section ids are unchanged. Signals are unchanged except three additions where the text shows them (marked in the tables).

## Gaps for you to fill

Each `[bracket]` is live in the copy. Replace it with the fact, or delete it.

| Project | Section | Gap |
|---|---|---|
| HHCD Data Platform | `one-example-first` | `[number of]` students you watched (and how many sessions) |
| HHCD Data Platform | `origin` | `[project name and years]` of the Brunel project |
| Component Store | `outcome` | `[How many customers use live previews]` |
| Nike Athletes Closet | `problem` | `[engagement and tap-through figures]` before the redesign |
| Nike Athletes Closet | `product-card` | `[Change in product taps after launch, if known]` |
| Nike Athletes Closet | `outcome` | `[month and year]` it shipped |
| WildEcho | `problem` | `[source for this]`: the claim that photography makes tourists remember less |
| WildEcho | `prototype` | `[number of participants]` across the three rounds |
| WildEcho | `role` | `[team size]` |

Not bracketed, still worth supplying: the HHCD rebuild's public link, this site's source link once public, and an update to "Screen reader and Safari testing are still to do" once done.

## Capability map

What the machine prints for each capability on its own (fallback, one sheet per project, best first):

| Capability | Sheets (project#section) |
|---|---|
| End-to-end delivery (`end-to-end`) | hhcd-data-platform#origin, component-store#outcome, nike-athletes-closet#outcome, this-site#idea |
| Design systems (`design-systems`) | component-store#token-layers, hhcd-data-platform#tokens-and-publishing, nike-athletes-closet#graphic-system |
| Consistency across platforms (`cross-platform`) | component-store#token-layers |
| Closing design–engineering gaps (`design-eng-gap`) | component-store#contracts, nike-athletes-closet#graphic-system |
| Accessibility (`accessibility`) | hhcd-data-platform#dual-view, component-store#contrast-in-tokens, this-site#foundations |
| SEO and performance (`seo-performance`) | hhcd-data-platform#rebuild, this-site#foundations |
| Publishing workflows (`publishing-workflow`) | this-site#content, hhcd-data-platform#data-model |
| Reusable components (`reusable-components`) | nike-athletes-closet#graphic-system, component-store#contracts, this-site#content, hhcd-data-platform#origin |
| Brand and storytelling (`brand-storytelling`) | nike-athletes-closet#product-card |
| Conversion (`conversion`) | nike-athletes-closet#product-card |
| Motion and interaction (`motion-interaction`) | component-store#mapping, nike-athletes-closet#delight, this-site#idea |
| Typography and layout (`typography`) | nike-athletes-closet#graphic-system, hhcd-data-platform#one-example-first |
| Data and visualisation (`data`) | hhcd-data-platform#data-model, component-store#problem |
| Prototyping new interactions (`prototyping`) | this-site#idea, component-store#mapping, wildecho#prototype |
| Working with AI tools (`ai-tools`) | hhcd-data-platform#origin, this-site#idea, component-store#outcome |
| Research and testing (`research`) | hhcd-data-platform#one-example-first, wildecho#role |
| Judgement and trade-offs (`judgement`) | hhcd-data-platform#data-model, component-store#contracts, this-site#foundations, wildecho#prototype |

Brand is thin: only Nike shows it. A request for a website also maps to SEO and performance, which prints the HHCD rebuild and this site. Consistency across platforms is Component Store only.

## Dropped to fit the limits

These were examples or restatements, not new facts. Put any back if you miss it.

- Component Store `contracts`: the "two streams that both carry an arrival time" example and "a timeline asks for dates".
- HHCD `one-example-first`: "not the whole network" (the new first sentence already says the homepage starts from one project).
- HHCD `rebuild`: "in Next.js and TypeScript" and "real HTML" (the stack list and "static page" cover them).
- HHCD `dual-view`: "shows connections well"; the cost argument is shortened to "while accessibility was cheap to add".
- Nike `product-card`: "closing the gap between reading and shopping" (restates the sentence before it).
- This site `idea`: "the interface does the rest" and "keeps the design consistent".
- This site one-liner: "built to be read without asking any" (the `content` section names the browse view).

## Moved

- Component Store: "working with AI coding tools" moved from the role line into the `outcome` section, so a request for AI tools can print it.
- This site: "designed and built it with AI coding tools" now also appears in the `idea` section, so it prints for end-to-end and AI-tools requests.

## HHCD Data Platform

| Field | Before | After |
|---|---|---|
| oneLiner | A research archive you can explore as a network or read as a table. | A research archive you can browse as a network or a table. |
| `problem` body | The centre wanted its past projects to be explorable by the people who could learn from them: artists, researchers and students looking for methods to adapt.<br><br>The records had been collected person by person, in one long spreadsheet. Who worked on what, which methods they used and who funded it were all tangled into each person's row. | The centre wanted artists, researchers and students to explore its past projects and find methods to adapt.<br><br>The records sat in one long spreadsheet, collected person by person, with who worked on what, the methods and the funders tangled into each person's row. |
| `data-model` title | Re-modelling the data so nothing outranks anything else | Re-modelling the data as four equal profiles |
| `data-model` body | Following the collection logic would have made people the centre of every view. Instead, I rebuilt the data as four equal kinds of profile: people, projects, partners and methods, with the relationships between them as first-class data.<br><br>A conversion script turns the centre's spreadsheets into structured data and writes a quality report, flagging duplicates, missing fields and links that point nowhere. | I rebuilt the data as four equal profile types: people, projects, partners and methods, with their links as data. The spreadsheet's structure would have put people at the centre of every view.<br><br>A script converts the spreadsheets and reports duplicates, missing fields and broken links. |
| `dual-view` title | Two views instead of a simpler graph | A table view beside the graph |
| `dual-view` body | A node-link graph shows connections well but is hard to use without a mouse or sight. Rather than simplify it, I gave every entry a second home in an accessible table view, with the same search and filters.<br><br>Keyboard shortcuts, managed focus and announced result counts were designed in from the start, because structural accessibility costs little early and a great deal later. | I kept the graph and added an accessible table with the same search and filters; a node-link graph is hard to use without a mouse or sight.<br><br>Keyboard shortcuts, managed focus and announced result counts were built in early, while accessibility was cheap to add. |
| `one-example-first` title | Overview first, turned around | Starting from one project, then the network |
| `one-example-first` body | Teaching data visualisation with the platform, I watched students navigate it. People learning from past research start from one real project, not the whole network; the connections only make sense once the pieces do.<br><br>So the rebuilt homepage explains a single project, then steps outwards to its methods and people, and only then offers the full map. | The rebuilt homepage explains one project, then steps out to its methods and people, and only then shows the full map.<br><br>Teaching data visualisation with the platform, I watched [number of] students start from one real project; the connections only made sense once the pieces did. |
| `tokens-and-publishing` body | Every colour lives once, as a token. The brand palette was fixed, so I added darker text variants where a brand colour failed contrast, and a script checks every text and background pairing the site uses.<br><br>An admin panel lets staff edit records without touching code, writing back to the spreadsheets rather than to generated files. | Every colour is a single token. Where a fixed brand colour failed contrast, I added a darker text variant; a script checks every text and background pairing.<br><br>Staff edit records without code, in an admin panel that writes back to the spreadsheets. |
| `rebuild` body | The first version drew everything in the browser under a single address, so search engines saw an empty page. The rebuild in Next.js and TypeScript gives each of its 48 entries its own static page, with real HTML, metadata and preview images.<br><br>Automated accessibility checks pass on every main page at desktop and mobile widths. Screen reader and Safari testing are still to do. | The rebuild gives all 48 entries a static page with metadata and preview images; the first version rendered in the browser, invisible to search engines.<br><br>Automated accessibility checks pass on every main page, desktop and mobile. Screen reader and Safari testing are still to do. |
| `origin` body | The approach began on an EU-funded research project at Brunel University, where I was a research assistant. Brunel withdrew before it finished, but the method carried over: the centre's platform uses the same model with its own data.<br><br>I designed and built both alone, working with AI coding tools, and later taught it to the centre's summer interns. | The method began on an EU-funded Brunel project [project name and years], where I was a research assistant. Brunel withdrew early; the centre's platform reuses the model with its own data.<br><br>I designed and built both alone with AI coding tools and taught it to the centre's summer interns. |

## Component Store

| Field | Before | After |
|---|---|---|
| role | Only designer; designed and built it, working with AI coding tools | Only designer; designed and built it |
| `problem` body | Our customers build their own logistics platforms from our components, and no two customers' data look alike. In the Component Store, every component could only show static sample data, so nobody could see how it would look with their own.<br><br>It was a long-standing problem the front-end team hadn't solved. | Every component in the store showed only static sample data, so customers couldn't see it with their own. They build logistics platforms from our components, and no two customers' data look alike.<br><br>It was a long-standing problem the front-end team hadn't solved. |
| `contracts` body | I proposed separating the problem into layers. The first contract turns any of the platform's live data streams into fields in a shared format: dates, numbers, names. Two unrelated streams that both carry an arrival time now look the same to everything downstream.<br><br>The second contract lets each component declare the fields it needs. A pie chart asks for a label and a value; a timeline asks for dates. | I proposed three layers joined by two contracts. The first turns any live data stream into shared fields: dates, numbers, names.<br><br>The second lets each component declare the fields it needs; a pie chart asks for a label and a value. |
| `mapping` title | Mapping as a design problem, not a settings form | Connecting data as a guided choice |
| `mapping` body | With the contracts in place, connecting data becomes a small, guided choice. You pick a stream, the component shows which fields it needs, you map each one, and a live preview updates as you go.<br><br>The preview starts from sample data, so the component still explains itself before any data is connected. | The contracts make connecting data a short guided choice: pick a stream, see the fields the component needs, map each one and watch the live preview update.<br><br>The preview starts on sample data, so the component explains itself before anything is connected. |
| `token-layers` body | As the only designer, I also run the design system. It began in Figma, with components and palettes built for accessibility and every screen size, and now ships in code as a shared token package across five product lines.<br><br>Each app imports it and retunes only what it needs, and customers can re-skin their platform with their own colours, fonts and button shapes. | My design system began in Figma, built for accessibility and every screen size, and now ships as a shared token package across five product lines.<br><br>Each app overrides only what it needs, and customers apply their own colours, fonts and button shapes. |
| `contrast-in-tokens` body | Each colour scale has fixed roles: one step for surfaces, one for borders, one for text on white and one for text on tinted surfaces. Components use role names such as success or warning, never raw hues, so they stay readable whichever theme they're in. | Each colour scale has fixed roles: one step for surfaces, one for borders, one for text on white and one for text on tints. Components use role names such as success or warning, never raw hues, so they stay readable in any theme. |
| `outcome` body | Customers can now preview any component with their own data before using it, and the design system keeps five product lines consistent while letting each one, and each customer, adapt it. | Customers now preview any component with their own data before using it. Five product lines share the design system, and each line and customer adapts it.<br><br>I built it with AI coding tools. [How many customers use live previews] |
| `outcome` signals | end-to-end, cross-platform | end-to-end, cross-platform, **ai-tools** (added) |

## Nike Athletes Closet

| Field | Before | After |
|---|---|---|
| `problem` title | Readers loved the stories, not the products | Readers loved the stories but skipped the products |
| `problem` body | Athletes Closet is a members' feature in the Nike app, where athletes and stylists share looks and recommend products. Engagement with the stories was high, but few readers tapped through to the products in them.<br><br>Behind the scenes, inconsistent components were slowing every release. | Athletes Closet is a members' feature in the Nike app where athletes and stylists share looks and recommend products. Readers engaged with the stories, but few tapped through to the products [engagement and tap-through figures].<br><br>Inconsistent components were also slowing every release. |
| `system` body | I audited every element in the feature, unified sizes, spacing and naming, and rebuilt it as reusable components with documentation for the developers.<br><br>At its heart is a headline frame I designed to adapt to its content, so each season's stories could change without a redesign. | I audited every element, unified sizes, spacing and naming, and rebuilt the feature as reusable components with documentation for developers.<br><br>At its heart is a headline frame I designed to adapt to its content, so each season's stories could change without a redesign. |
| `system` signals | reusable-components, typography, design-eng-gap | reusable-components, typography, design-eng-gap, **design-systems** (added) |
| `product-card` body | I redesigned the product card so the item a story mentioned was large, clear and obviously tappable, closing the gap between reading and shopping. | I redesigned the product card so the item a story mentions is large, clear and obviously tappable. [Change in product taps after launch, if known] |
| `outcome` body | The feature shipped in the Nike app. Developers spent less time going back and forth, the client reported more interest in the products, and the agency kept the UI work for two more quarters. | The feature shipped in the Nike app in [month and year]. Developers spent less time going back and forth, the client reported more interest in the products, and the agency kept the UI work for two more quarters. |

## This site

| Field | Before | After |
|---|---|---|
| oneLiner | A portfolio you can ask questions, built to be read without asking any. | A portfolio that prints the work you ask to see. |
| `idea` title | Ask, and a ticket is printed | Ask, and it prints the matching work |
| `idea` body | Recruiters care about different things, so the site lets you ask. A small model reads your question and picks the cards from my work that answer it; the interface does the rest.<br><br>The model never writes the page. It can only choose from content I wrote, which keeps answers accurate and the design consistent. | Recruiters want different things, so the site lets them ask. A small model picks the sections of my work that show what they asked for, one per project, choosing only from content I wrote.<br><br>I designed and built it with AI coding tools. |
| `idea` signals | prototyping, ai-tools, motion-interaction | prototyping, ai-tools, motion-interaction, **end-to-end** (added) |
| `content` title | Written once, shown two ways | Written once, shown three ways |
| `content` body | Every project is a typed set of section cards. The same content powers the dealt cards, the full case files and the answers to questions, so adding a project means adding one file. | Every project is a typed set of section cards. The same content feeds the browse view, the case files and the printed answers, so adding a project means adding one file. |
| `foundations` body | Every page is static HTML with its own metadata, everything works by keyboard, motion respects reduced-motion settings, and the site still works if the AI is unavailable: it falls back to matching your question against the cards' topics. | Every page is static HTML with its own metadata, everything works by keyboard, and motion respects reduced-motion settings. If the AI is unavailable, the site still answers by matching the request against each section's topics. |

## WildEcho

| Field | Before | After |
|---|---|---|
| role | Shaped the project's structure and line of thinking in a close-knit team | Problem framing and research structure, in a team |
| `problem` body | Wildlife photography pushes tourists closer to animals and, often, makes them remember less. Guides already use sound to identify and explain species. | Wildlife photography pushes tourists closer to animals and often makes them remember less [source for this]. Guides already use sound to identify and explain species. |
| `prototype` body | We prototyped tours built around listening, with bone-conduction headphones, recording microphones and an app concept that turns a day's recordings into a personal sound journey.<br><br>Over three rounds of testing, listeners felt more immersed and remembered more. Testing also showed recording alone wasn't enough: guides were essential, so the next iteration built them in. | We prototyped listening tours with bone-conduction headphones, recording microphones and an app concept that turns a day's recordings into a personal sound journey.<br><br>Over three rounds of testing [number of participants], listeners felt more immersed and remembered more. Guides proved essential, so the next iteration built them in. |
| `role` body | In a close-knit RCA team, I shaped the project's structure: framing the problem, organising the research into a clear line of thinking and connecting it to the concept. | In a close-knit RCA team [team size], I framed the problem, organised the research into a clear line of thinking and connected it to the concept. |

## Profile (content/index.ts)

| Field | Before | After |
|---|---|---|
| summary 1 | I work across design and code: design systems that ship as packages, data-heavy interfaces that stay accessible, and brand work that has to earn a tap. | My work spans design systems that ship as code packages, data-heavy interfaces that stay accessible, and brand work that has to earn a tap. |
| summary 2 | I'm currently the only designer at a logistics infrastructure company, where I run the design system and build its front-end tools. Before that I built research platforms for the Royal College of Art and Brunel University, and later taught data visualisation to the Helen Hamlyn Centre's summer interns. | I'm the only designer at a logistics infrastructure company, where I run the design system and build front-end tools. Before that I built research platforms for Brunel University and the Royal College of Art, and taught data visualisation to the Helen Hamlyn Centre's summer interns. |
