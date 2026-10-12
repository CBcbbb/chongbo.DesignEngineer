# Components for Any Data: copy, as live (draft 3, approved 11 Oct)

Playbook §8 step 4. Every line traces to the facts in `inventory.md`. Nothing states status or progress. The words live in `content/projects/components-for-any-data.ts`; this file is the readable copy of them.

**Story.** An infrastructure company can't see its customers' data, but customers build their own pages from its components, and every customer's data has a different shape. What looked like a preview problem was a data problem: each component declares the shape it needs, data reaches it through one pipeline, and customers connect their own streams by choosing fields, ranked by fit on the server and picked like chart axes.

**Draft 3 (11 Oct):** ten cards cut to five and a Takeaway; parts removed; most rebuilt screens cut (only the preview panel and the field pickers remain, plus diagrams); "What this shows" rewritten; no closing role card.

---

## Cover

Logistics infrastructure company

# Components for Any Data

One component library that draws any customer's data, from the stream to the chart.

- **Role:** Design Engineer · Data model, interface, front end and server · on my own
- **Outcome:** One library serves every customer. Each component declares the shape of data it needs, and customers connect their own streams by choosing fields.
- **What this shows:** Front-end architecture · Data contracts · Data-binding UX

## The work

The preview panel, rebuilt on invented data.

---

### 01.1 Every customer's data has a different shape

Customers build their own products on our platform, from our components. But each component showed the demo data written into its settings, and none could take a customer's real stream.

So I started from one question: what does a component need to know about the data it shows?

### 01.2 A component promises a shape, not field names

I based the model on ECharts' dataset: a chart names the roles it draws, and each page maps its data onto them. A contract lists those roles, their types and which are required.

Contracts belong to the data, not to each component, so bar, pie, treemap and waterfall charts share one. Sample data fits the same contract, so a component explains itself before anything is connected.

### 01.3 One pipeline from stream to chart

An adapter turns each producer's format into flat rows, a binding maps one slot's fields onto the contract's roles, and the component draws the roles. Components never subscribe to streams, and settings never carry data.

Not every component takes a stream: filters and search read the page, and forms wait for the user.

I wrote the front end and the server with Claude Code and Cursor.

### 01.4 Streams ranked by fit, judged on the server

The first answer was to list every stream in the organisation by row count. A test organisation already had 74, most didn't fit, and users found out after reading a stream's rows.

I grouped streams by fit instead: "Fits", then "Partly fits · 3 of 5 fields", then the rest, searchable. A stream record carries no field names, so one endpoint on the server judges fit, in two phases that never change the interface.

### 01.5 Each field picked like a chart axis

The people connecting data aren't always engineers, so mapping can't read as configuration. Each role has a dropdown of the stream's fields, the way you pick a chart's axes.

The panel suggests a field for each role from aliases and industry terms ("ccy" for currency), and says how sure it is: exact, known or close. The picker and the panel share one matcher, so they never disagree.

### 01.6 Takeaway

1. A preview problem turned out to be a data problem. Once each component declared its shape, the interface followed from it.
2. Every layer has one job, so a new data source needs a new adapter, and nothing else changes.
3. Each data decision came with the user behaviour it had to support, so the engineering and the interface were designed together.

---

## Evidence

- The work: the preview panel on invented delivery data. Pick a stream (ranked by fit), change a field, switch charts, or drop a CSV (read in the browser).
- 01.1: three invented streams, first row each: same meaning, different names, formats and fields.
- 01.2: code, a short contract written for the site.
- 01.3: the pipeline, one row per layer.
- 01.4: the picker asks one endpoint; both phases behind it.
- 01.5: the field pickers beside the chart (the panel's own components).
