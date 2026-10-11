# Components for Any Data: copy, as live (draft 2, approved 11 Oct)

Playbook §8 step 4. Every line traces to the facts in `inventory.md`. Nothing states status or progress (Chongbo, 11 Oct). The words live in `content/projects/components-for-any-data.ts`; this file is the readable copy of them.

**Story.** An infrastructure company can't design for its customers' data, so the components are designed for the shape of data, and the customer connects their own. Three parts: what a component is, the contract, connecting your own data. Each card pairs an engineering decision with what the user sees because of it.

**What this shows (labels, not links):** Systems and reuse · Idea to production · Craft and interaction

---

## Cover

Logistics infrastructure company

# Components for Any Data

A component library customers preview with their own data, before they build with it.

- **Role:** Design Engineer
  - (one person) Data model, interface, front end and server · on my own
- **Outcome:** One library serves every customer. Each component declares the shape of data it needs, and customers connect their own streams by choosing fields.

## The work

The preview panel, rebuilt on invented data. (Signature module.)

---

## 01 Components

### 01.1 Templates made of components

Customers build their own pages as templates: layouts made of components. Each component drew demo data from its settings, and couldn't be pointed at a real stream.

Every customer's data has a different shape. So I started from one question: what does a component need to know about the data it shows?

### 01.2 Sample data that follows the same rules as real data

Every component comes with sample data that fits its contract, tagged "Sample" wherever it appears. A component explains itself before anything is connected, and a real stream changes the data, not the component.

No chart makes data up.

### 01.3 Which components connect, and which ask the user

Charts and tables connect to a stream through its fields. Filters and search read the page instead, and forms send data out, so they wait for the user.

I made that split a filter in the store, so customers see what a component needs before they choose it. Search finds components by field name too.

---

## 02 Contracts

### 02.1 A component promises a shape, not field names

I based the model on ECharts' dataset: a chart names the roles it draws, and each page maps its data onto them. A contract lists those roles, their types, which are required and which one keys a row.

A bar chart asks for a category and a value. It never needs to know that a stream calls them "site" and "qty".

### 02.2 One contract per dataset

Contracts belong to the data, not to each component. Bar, pie, funnel, treemap and waterfall charts share one contract for totals by category.

A customer who maps a stream once can try every chart that fits it, and the mapping stays.

### 02.3 Data comes through the binding, never through settings

Components never subscribe to streams. An adapter turns each producer's format into flat rows, and a binding maps one slot's fields onto the contract's roles.

A new data format needs a new adapter, never a change to the components.

---

## 03 Connecting

### 03.1 Streams ranked by fit, not listed by size

The first answer was to list every stream in the organisation by row count. A test organisation already had 74, most didn't fit, and users found out after reading a stream's rows.

I grouped streams by fit instead: every field the component needs first, then "Partly fits · 3 of 5 fields", then the rest, collapsed and searchable. A stream with no data yet reads "Unknown", never "Doesn't fit".

### 03.2 Fit judged on the server

The browser can't judge fit: a stream record has a name and a row count, but no field names. So I moved fit onto the server: one endpoint, in two phases.

First, keep the field names from the entry the platform already reads, at no extra load. Later, a stored profile per stream, at the same cost for 50 streams or 5,000. The interface talks to the endpoint alone, so it doesn't change between phases.

### 03.3 Each field picked like a chart axis

The people connecting data aren't always engineers, so mapping can't read as configuration. Each role has a dropdown of the stream's fields, the way you pick a chart's axes.

The panel suggests a field for each role, using aliases and industry terms ("ccy" for currency), and marks how sure it is: exact, known or close. The picker and the panel share one matcher, so they never disagree.

---

## Close

### 04.1 From the data model to the interface

- **Role:** I designed the contract model, the store's interface and the preview, and built them, front end and server, with AI coding tools.
- **Design system:** Every component and the store's interface follow the design system I built.
- **Context:** Logistics infrastructure company. I'm its sole designer.

---

## Evidence notes

- The work: the preview panel rebuilt on invented delivery data (three depots' streams). Pick a stream, map fields, switch charts.
- 01.1: diagram, a template as a layout of component slots; the store sits beside the customer's own templates.
- 01.2: one chart with a Sample / My stream toggle, the "Sample" tag visible.
- 01.3: the store's filter and six components, rebuilt with invented content (Connects to a stream · Reads the page · Asks the user · Static), searchable by field.
- 02.1: code, a short contract written for the site.
- 02.2: one mapped dataset as bar, donut and treemap.
- 02.3: diagram, producer → adapter → binding → contract → component.
- 03.1: before / after picker, rebuilt.
- 03.2: diagram, one endpoint with two phases behind it.
- 03.3: the panel's role dropdowns with suggestions marked exact / known / close.

## Layouts (playbook §7: each card composed for its content)

`stack` for 01.1, 01.3, 02.2, 02.3, 03.2, 03.3 (evidence across the card, on the grid canvas); `pair` for 01.2, 02.1, 03.1 (narrow evidence beside the text); the closing card is a statement on the dark sheet.
