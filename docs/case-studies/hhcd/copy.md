# Helen Hamlyn Centre Data Platform: copy, draft 3

Playbook §8 step 4. Every fact traces to `inventory.md` → "Facts and their sources". `[brackets]` are gaps. Use "we" for VOICE team decisions and "I" for Chongbo's own work.

## Cover

- **Title:** Helen Hamlyn Centre Data Platform
- **One line:** A research repository that anyone can explore, with a mouse, a keyboard or on a phone.
- **Context:** First built for VOICE, an EU-funded arts research project. Now used by the Helen Hamlyn Centre for Design, Royal College of Art.
- **Role:** Design, data model and build, alone, with AI coding tools.
- **Outcome:** Live and in use. Paper accepted at DRS 2026.
- **Link:** https://helen-hamlyn-centre-for-design-data.vercel.app/
- **What this shows:** Accessibility · Idea to production · Craft and interaction

## Part 1 · VOICE

### `brief`: Accessibility as the starting point

VOICE was an EU-funded arts research project with partners in several countries. Its platform was for artists, researchers, community groups and policy makers. With an audience that broad, accessibility was a goal from the first prototype.

*Image caption:* The VOICE platform at launch.

### `no-borders`: A network instead of a geographical map

To show all the work together, we first placed communities and projects on a map of Europe, grouped by country. The work was diverse, and we didn't want geography to divide it. So we moved to a network, where people, projects, organisations and methods connect directly.

*Image caption:* Grouped by country, the work looked divided by place.

### `sample-data`: Working prototypes on sample data

I coded the prototype ideas with sample data, so people could try them rather than imagine them. That gave us a first round of testing before any real data existed. The workshop started from these prototypes.

*Image caption:* An early prototype, running on sample entries.

### `workshop`: A 75-minute workshop with 14 stakeholders

We ran the workshop with members of the seven partner organisations, and I designed its process. Each took a stakeholder card, from eco-social artist to EU cluster coordinator, and judged the prototypes from that person's point of view. Three walls collected their answers, with sticky notes and dot votes.

*Steps:*

1. **Content.** What each entry should contain. Every type got a consistent structure, and methods were linked to the projects and people that used them.
2. **Scope.** What the platform should include. Entries should touch at least two of three themes: technology, community and environment. The scope went beyond Europe.
3. **Functionality.** Which features mattered most. Filters, search and visible connections ranked highest. Translation scored low, but participants argued it was essential for inclusion, so we kept it.

*Image caption:* Wall Three, where the features were ranked.

### `four-types`: Why the data is collected by person but mapped by type

To make the survey easy to fill in, I started it from each person's own work: their projects, the methods they used and who supported them. Collecting was easy, but every row of the spreadsheet had a person at its centre. After a first round of cleaning, I split it into four linked types of equal weight and decided what each point on the map stands for.

*Stepper (animated):*

1. Decide what the platform needs to know.
2. Survey each person about their own work.
3. Clean the first round of answers.
4. Split each row into people, projects, organisations and methods.
5. Link the records and load them into the prototype.

### `dual-view`: A table view beside the network

A network graph is hard to use without a mouse or without sight. So I added a table of the same data, with the same search and filters, and a shortcut to switch between them. The workshop also led to zoom buttons and a panel on accessibility and translation.

*Image caption:* The same entries as a table, for screen readers and keyboards.

## Part 2 · Helen Hamlyn Centre

### `taken-up`: Taken up by the Helen Hamlyn Centre

VOICE soft-launched in September 2025. The Helen Hamlyn Centre then took up the platform for its own research: 48 entries and 104 connections, in its fixed brand colours. I rebuilt it for the Centre in Next.js and TypeScript.

*Image caption:* The Centre's research as one map.

### `arrangements`: Two arrangements of the same map

The map opens as a free network, with every entry the same size. One switch moves the same entries into four columns by type, which are easier to scan and to follow by keyboard. Both layouts are calculated in advance, so the switch is a single animated move.

*Module caption:* Try the switch: the same 48 entries, rearranged.

### `guide`: A guide inside the map

On a first visit, one project pulses, and four short cards follow what you do: open it, follow a connection, step back, switch arrangement. Each card waits for the action it describes, never takes focus and can be skipped. The whole guide works by keyboard alone.

*Video caption:* Each step waits for the visitor to act.

### `keyboard`: Accessibility – keyboard navigation

The map is a single stop in the tab order. Arrow keys move to the nearest entry in that direction, in either arrangement, and the view pans to keep it in sight. Each entry is announced with its name, type and number of connections.

*Video caption:* "Chris McGinley, person, 10 connections."

### `narrow-screens`: Responsive design

On a phone, details open as a sheet over the lower part of the map, and the selected entry pans into view above it. The map opens at a readable zoom, and its controls have 40px touch targets. Nothing scrolls sideways, down to 320px.

*Image caption:* The map stays usable while details are open.

### `contrast`: Accessibility – colour contrast

The Centre's brand colours are fixed, and two of them fail contrast as small text. Map names keep the original colours, set bold and large enough to pass; zoomed out, they switch to darker variants. A script reads the real CSS and checks all 27 colour pairings, and each type also has its own shape.

*Code caption:* Orange passes as large text; small text uses the darker variant.

```css
--color-projects: #EB631A;      /* large text on white: 3.32:1 */
--color-projects-text: #A8470F; /* small text on white: 5.88:1 */
```

### `results`: Results

The platform is live and in use at the Helen Hamlyn Centre. A paper on the accessibility approach was accepted at DRS 2026.

*Metric strip:* Lighthouse accessibility 99 (VOICE) · WAVE 0 errors (VOICE) · axe 0 violations at 1440 and 390px (rebuild) · 27 of 27 contrast pairings pass

### `role`: Designed, specified and built alone

I made the design files, wrote the specification and wrote all of the code, with AI coding tools that at the start needed close direction. [Screen-reader, Safari and Firefox testing: done, or still to do?]
