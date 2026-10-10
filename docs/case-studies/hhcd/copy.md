# Helen Hamlyn Centre Data Platform: copy, draft 1

Playbook §8 step 4. Every fact traces to `inventory.md` → "Facts and their sources". `[brackets]` are gaps.

## Cover

- **Title:** Helen Hamlyn Centre Data Platform
- **One line:** A map of a research network that anyone can explore, with a mouse, a keyboard or on a phone.
- **Context:** First built for VOICE, an EU-funded arts research project. Now used by the Helen Hamlyn Centre for Design, Royal College of Art.
- **Role:** Design, data model and build, alone, with AI coding tools.
- **Outcome:** Live and in use. Paper accepted at DRS 2026.
- **Link:** https://helen-hamlyn-centre-for-design-data.vercel.app/
- **What this shows:** Accessibility · Idea to production · Craft and interaction

## Cards

### `brief`: Accessibility as the starting point

The first version was for VOICE, an EU-funded arts research project. Its map was for artists, researchers, community groups and policy makers. Network maps are usually built for sighted mouse users, so I treated accessibility as the first design decision rather than a later fix.

*Image caption:* The VOICE map and its table view, launched together.

### `no-borders`: A network instead of a geographical map

My first prototypes placed communities of practice on a map of Europe, filtered by country. Grouping people by region suggested a separation the project set out to overcome. I moved to a network where people, projects, organisations and methods connect directly, with no centre.

*Image caption:* Placed by country, the communities looked separate.

### `workshop`: Features ranked by 14 stakeholders

I ran a 75-minute workshop with people from the seven partner organisations, each playing a different kind of user. They ranked filters, search and visible connections highest. Translation scored low, but several argued it was essential for inclusion, so I kept it.

*Image caption:* The ranking that set the tool's first features.

### `four-types`: Why the data is collected by person but mapped by type

I made people the entry point for collecting data: anyone can say what they worked on, with which methods, and who supported it. Drawn as collected, though, people would sit at the centre of every view. So I split the records into four linked types of equal weight: people, projects, organisations and methods.

*Image caption:* One person's row becomes four linked records.

### `three-views`: Three views of the same network

The map opens as a free network where every entry is the same size, so nothing ranks above anything else. One switch moves the same entries into four columns by type, which are easier to scan and to follow by keyboard. A table holds the same data for screen readers, with the same search and filters.

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

### `own-page`: A link for every person, project and method

The first version drew everything in the browser under one address, so no project could be linked to or found by search. Each of the 48 entries now has its own page, with its connections as ordinary links and a preview image for sharing. Pages load without JavaScript.

*Image caption:* Every page links on to what it is connected to.

### `outcome`: Launched, then taken up by the Helen Hamlyn Centre

The VOICE platform soft-launched in September 2025. The Helen Hamlyn Centre now uses the rebuilt version to map its research: 48 entries and 104 connections. A paper on the accessibility approach was accepted at DRS 2026.

*Metric strip:* Lighthouse accessibility 99 (VOICE) · WAVE 0 errors (VOICE) · axe 0 violations at 1440 and 390px (rebuild) · 27 of 27 contrast pairings pass

### `role`: Designed, specified and built alone

I made the design files, wrote the specification, built many of the early prototypes and ran the workshop. I wrote all of the code with AI coding tools, which at the start needed close direction. [Screen-reader, Safari and Firefox testing: done, or still to do?]
