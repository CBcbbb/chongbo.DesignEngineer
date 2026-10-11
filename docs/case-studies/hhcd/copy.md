# Helen Hamlyn Centre Data Platform: copy, draft 5

Playbook §8 step 4, brought up to the playbook of 11 October 2026 (the Nike review's standards). Every fact traces to `inventory.md` → "Facts and their sources". Use "we" for VOICE team work and "I" for Chongbo's own work.

One term per thing: **entries** (never points or records); the four types are **people, projects, methods and partners**; VOICE's consortium is **seven organisations**; the rebuild is **the Centre's version**.

No captions under evidence. Labels inside the evidence are listed with each card.

## Cover

- **Client:** Helen Hamlyn Centre for Design, Royal College of Art
- **Title:** Helen Hamlyn Centre Data Platform
- **Button (at the right of the one line, over "What this shows"):** Open the live platform
- **Cover art:** the map's four marks gather in the top-right corner, run off the sheet and fade before the title
- **One line:** A research repository that anyone can explore, with a mouse, a keyboard or on a phone.
- **Facts** (three columns under one rule):
    - **Role:** Research Assistant
        - (two people) Data collection and analysis / *with the VOICE team*
        - (one person) Data modelling, design and build / *on my own*
    - **Outcome:** Live and in use. Used to teach the Centre's summer interns. Paper on its accessibility approach accepted at DRS 2026.
    - **What this shows** (labels, not links): Accessibility · Idea to production · Craft and interaction

## The work

**The map today**

*Evidence:* the live map in a browser window (helen-hamlyn-centre-for-design-data.vercel.app). *Key:* Projects · Methods · People · Partners

## Part 1 · VOICE, the first version

### 01.1 `brief`: Accessibility as the starting point

VOICE was an EU-funded arts research project, run by seven organisations in several countries. Its audience was broad: artists, researchers, community groups and policy makers.

*Evidence:* the VOICE platform.

### 01.2 `no-borders`: A network instead of a geographical map

To show all the work together, we first placed communities and projects on a map of Europe, grouped by country. The work was diverse, and we didn't want geography to divide it. In the network, people, projects, partners and methods connect directly, whatever their country.

*Evidence:* two geographical prototypes. *Labels:* Prototype A · Prototype B

### 01.3 `sample-data`: Working prototypes on sample data

I coded each prototype idea, so people could try it rather than imagine it. That gave us a first round of testing before any real data existed. The workshop started from these prototypes.

*Evidence:* an early prototype with sample entries.

### 01.4 `workshop`: A 75-minute workshop with 14 stakeholders

I led the workshop with members of all seven organisations, and designed its process around the data the platform needed. Each took a stakeholder card, from eco-social artist to EU cluster coordinator, and judged the prototypes from that person's point of view.

*Evidence:* the stakeholder cards on the left; the three walls down the right, each photo (cropped to 2:1, sheet whole) beside its finding.

1. **Wall 1 · Content.** Every type got a consistent structure, and methods were linked to the projects and people that used them.
2. **Wall 2 · Scope.** Entries should touch at least two of three themes: technology, community and environment. The scope went beyond Europe.
3. **Wall 3 · Functionality.** Filters, search and visible connections ranked highest. Translation scored low, but participants argued it was essential for inclusion, so we kept it.

### 01.5 `four-types`: Why the data is collected by person but mapped by type

To make the survey easy to fill in, I started it from each person's own work: their projects, the methods they used and who supported them. Collecting was easy, but every row of the spreadsheet had a person at its centre. So I gave the map four linked types of equal weight, and decided what each entry stands for.

*Evidence:* the stepper diagram (sample labels).

1. Decide what the platform needs to know.
2. Survey each person about their own work.
3. Clean the first round of answers.
4. Split each row into people, projects, methods and partners.
5. Link the entries and load them into the prototype.

### 01.6 `dual-view`: A table view beside the network

A network graph is hard to use without a mouse or without sight. The table holds the same data, with the same search and filters, and a shortcut switches between the two.

*Keys:* Ctrl + E. *Evidence:* VOICE's table view.

## Part 2 · Helen Hamlyn Centre

### 02.1 `taken-up`: Taken up by the Helen Hamlyn Centre

VOICE soft-launched in September 2025. The Centre brought its own research data and fixed brand colours, and I rebuilt the platform for it in Next.js and TypeScript.

*Metric strip:* 17 Projects · 12 Methods · 10 People · 9 Partners · 104 Connections

### 02.2 `arrangements`: Two arrangements of the same map

The map opens as a free network, with every entry the same size. One switch moves the same entries into four columns by type, which are easier to scan and to follow by keyboard. Both layouts are calculated in advance, so the switch is a single animated move.

*Signature module:* the switch, in a browser window. *Labels:* Free network · By type

### 02.3 `guide`: A guide inside the map

On a first visit, one project pulses, and four short cards follow what you do: open it, follow a connection, step back, switch arrangement. Each card waits for the action it describes, never takes focus and can be skipped. The whole guide works by keyboard alone.

*Evidence:* the recording, in a browser window.

### 02.4 `keyboard`: Accessibility – keyboard navigation

The map is a single stop in the tab order. Arrow keys move to the nearest entry in that direction, in either arrangement, and the view pans to keep it in sight. Each entry is announced with its name, type and number of connections, shown on screen in this recording.

*Keys:* Tab ← ↑ → ↓ Enter Esc. *Evidence:* the recording, in a browser window.

### 02.5 `narrow-screens`: Responsive design

On a phone, details open as a sheet over the lower part of the map, and the selected entry pans into view above it. The map opens at a readable zoom, and its controls have 40px touch targets. Nothing scrolls sideways, down to 320px.

*Evidence:* two phone screens, side by side.

### 02.6 `contrast`: Accessibility – colour contrast

The Centre's brand colours are fixed, and two of them fail contrast as small text. Map names keep the original colours, set bold and large enough to pass; zoomed out, they switch to darker variants. A script reads the real CSS and checks all 27 colour pairings, and each type also has its own shape.

*Evidence:* the four colours as specimens. *Labels:* Type · Map name: bold, large · Small text

### 02.7 `testing`: Accessibility – testing

Automated checks gave VOICE a near-perfect score, but missed that its map entries and filters couldn't be reached by keyboard. In the Centre's version both work by keyboard, and axe found no issues on any main page at desktop and phone widths. It passed testing in Chrome, Safari and Firefox, and with the VoiceOver screen reader.

*Metric strip:* 99 Lighthouse accessibility score (VOICE) · 0 WAVE errors (VOICE) · 0 axe violations at 1440 and 390px (Centre's version)

### 02.8 `role`: Designed, specified and built alone

I made the design files, wrote the specification and built the platform. Doing both, I could turn each design straight into working code, which made the work faster.

- **Context:** Brunel University, on the VOICE project.

## Draft 5 (Chongbo's answers, 11 Oct afternoon)

- Role adds the job title, Research Assistant.
- The workshop: Chongbo led it (with one researcher) and designed its process around the data the platform needed. Only his part is told.
- The closing card keeps Context only: "say what I did".
- Part 1 is "VOICE, the first version".

## Cut in draft 4

- `results`: the cover's Outcome already says it (playbook §4: the cover and the ending don't repeat each other). "On its accessibility approach" moved to the cover.
- Every caption under evidence (§6).
- The stakeholder-card image in `workshop`: a process artefact that carries no decision; the body names the cards.
- "Three walls collected their answers, with sticky notes and dot votes": the photos show it.
- The walls' first sentences ("What each entry should contain." and so on): they restated the wall titles.
