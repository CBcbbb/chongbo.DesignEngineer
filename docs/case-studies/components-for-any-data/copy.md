# Components for Any Data: copy, as live (12 Oct)

Playbook §8 step 4. Every line traces to the facts in `inventory.md`. Nothing states status or progress. The words live in `content/projects/components-for-any-data.ts` (and the work's note in `src/components/case/any-data/Demo.tsx`); this file is the readable copy of them. When they change, change this file in the same commit.

**Story.** An infrastructure company can't see its customers' data, but customers build their own products from its component store, and every customer names and formats the same data differently. What looked like an interface problem was in the data model: each component declares the shape it needs, data reaches it through one pipeline, and customers connect their own streams by choosing fields, grouped by fit on the server and picked like chart axes.

**History.** Draft 3 (11 Oct) cut ten cards to five and a Takeaway. On 12 Oct Chongbo reworded 01.1, set its question as two questions, cut 02.1 to two short paragraphs and dropped "Simplified rebuild." from the work's note (see `DECISIONS.md`).

---

## Cover

Logistics infrastructure company

# Components for Any Data

One component library that draws any customer's data, from the stream to the chart.

- **Role:** Design Engineer · Data model, interface, front end and server design · on my own, with Claude Code and Cursor
- **Outcome:** One library serves every customer. Each component declares the shape of data it needs, and customers connect their own streams by choosing fields.
- **What this shows:** Front-end architecture · Data contracts · Data-binding UX

## The work

### The preview panel, rebuilt for this case study

The product is confidential, so this uses mock data and is for demonstration only.

---

## Part 1 · The model

### 01.1 Every customer's data has a different shape

Our platform carries customers' operational data as live streams, and customers build their own products on it, picking components from our component store. But the components only showed fixed values in their settings, so no customer could see what their own data would look like in one. One set of sample data couldn't cover every case either, as each customer names and formats the same data differently.

So I started from two questions: Can we connect live streams to the store's components? What does a component need to know about its data?

*(Set as the lead and two numbered questions, `Section.asks`.)*

### 01.2 A component promises a shape, not field names

I based the model on ECharts' dataset and encode: a chart type has fixed dimensions it draws, and encode maps the data's columns onto them. A contract adds what ECharts leaves out: each role's type, and which are required.

Each component declares one contract, and a stream can feed it once its fields map onto that contract's roles. Components that draw the same shape share one, so a bar chart, a donut, a treemap and a table all declare the same contract. Sample data fits it too, so a component explains itself before anything is connected.

### 01.3 One pipeline from stream to chart

An adapter turns each source system's format into flat rows, a binding maps the stream's fields onto the contract's roles, the contract checks their types, and the component draws the roles. Components never subscribe to streams, and settings hold configuration only, never data.

Charts and tables read a stream, filters and search read the page, and forms wait for the user.

## Part 2 · The interface

### 02.1 Streams grouped by fit, judged on the server

The first answer listed every stream by row count. A test organisation already had 74, and most didn't fit: users only found out after reading the rows.

I grouped the list by fit instead. The browser can't judge fit, as a stream record carries no field names, so I designed one endpoint on the server to judge it.

### 02.2 Each field picked like a chart axis

The people connecting data aren't always engineers, so connecting fields can't feel like configuration. Each role has a dropdown of the stream's fields, the way you pick a chart's axes.

The store suggests a field for each role from aliases and industry terms. The stream list and the field suggestions share one matcher, so a stream marked "Fits" always fills its fields.

## Part 3 · Outcome

### 03.1 Takeaway

1. The store couldn't preview a customer's data, which looked like an interface problem. The cause was in the data model, so I defined the shape each component needs before designing the panel.
2. Judging fit on the server lets users see which streams fit before they pick, however many there are.
3. Every layer has one job, so a new source system needs a new adapter, and nothing else changes.

---

## Evidence

All streams, fields and values are invented.

- **The work:** the preview panel. Chart types (bar, donut, treemap, table), the chart, the first three rows as they arrive; on the right, every stream grouped as Sample data / Fits / Partly fits / Other in a scrolling list, and one field per role.
- **01.1:** three streams, first row each (courier_app.deliveries, north_depot.scans, partner_carrier.feed): the same meaning under different names and formats; the role colours show which field plays which role, and the third has no number field for value.
- **01.2:** a Contract / Code switch. Contract: the roles (category · text · required, value · number · required) and the four components that declare it, drawn from the sample data. Code: the contract in TypeScript, `contracts/totals-by-category.ts`.
- **01.3:** one record through five layers, left to right (Source, Adapter, Binding, Contract, Component), each role a coloured lane; under it, what charts, filters and forms read.
- **02.1:** before and after: "74 streams, one list" by row count beside "Grouped by fit"; the server as a band under both (Picker · One endpoint · Phase 1 The newest entry · Phase 2 A stored field profile).
- **02.2:** the pickers on the chart's own axes, with a switch between three streams; partner_carrier.feed shows the empty state.
