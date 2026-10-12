# HHCD: open decisions (for Chongbo, 11 Oct 2026)

The case file now follows the playbook of 11 October (the Nike review's standards, including the later rule that case files keep their controls serious). Below is everything I decided on your behalf, or couldn't settle without you. Each item says what I chose; tell me to change any of them and I'll update the page.

## Copy

1. **"What I'd do now" is missing.** The playbook's closing card ends on it (§4). You said earlier there'd be no "what failed / what I'd change", so I left it out rather than invent one. Give me one line, or confirm it stays out.
2. **Cover Role is your description, not a job title.** §4 asks for the job title ("UI Designer"). I kept your line, "Data collection, analysis and modelling; design and build.", because the project spans two roles and I don't know a title for the Centre's version. Alternative: a title such as "Research Assistant, then Design Engineer"; tell me what's accurate.
3. **Brunel is named on the closing card.** Context: "Research assistant at Brunel University, on VOICE." This comes from what you told me in an earlier conversation, not this one. Check you're happy to name Brunel and the title.
4. **The closing card's Team line:** "VOICE's team ran the workshop and chose the network together." It's the only team work on the page; everything else is yours. Add anyone you'd like credited.
5. **`results` is cut.** The cover's Outcome already says all three points (§4: the cover and the ending don't repeat each other). "On its accessibility approach" moved to the cover: "Paper on its accessibility approach accepted at DRS 2026."
6. **Restated headings, rewritten.** Five bodies repeated their heading (§5, "say each thing once"). The biggest change is in `brief`: "With an audience that broad, accessibility was a goal from the first prototype." became "Its audience was broad: artists, researchers, community groups and policy makers." The heading now carries "accessibility first" on its own. Full text in `copy.md`.
7. **One term per thing.** The fourth type is "partners" everywhere (it was also "organisations" and "institutions"). VOICE's consortium is "seven organisations", so "partners" means only the entry type. Alt text still says "Institutions" where the screenshot shows that word.
8. **The keyboard recording's on-screen text** is now explained in the body ("shown on screen in this recording"), since captions are gone.

## Structure

9. **Parts stay chronological: VOICE, then the Centre.** §4 now says parts follow the reader, not the process. You chose these two parts, so I kept them. A reader-led alternative: 01 Explore (network, arrangements, guide) · 02 Access (table, keyboard, contrast, testing, phones) · 03 Data (survey, workshop, model). Say if you want it.
10. **The work sheet** ("The map today") follows the cover: the live map, whole, in a browser window, with the colour key. It's the same screenshot the switch in 02.2 starts on.
11. **The cover art is gone from the cover.** The cover has to be compact (§7), so the network moved to the work sheet. In dark mode both sheets are the platform's ink, with the product's white screen in a dark window, as before.

## Images

12. **Wall photos are your originals, whole** (IMG_0941–0943 at 1600×1200), replacing my crops: §6 says never crop an original. Wall 2 now shows the room's ceiling above the sheet.
13. **The stakeholder-card image is cut from the workshop card.** It's a process artefact with no decision (§6), and the card needed the room for the walls. The file is still in `public/assets/hhcd/workshop-cards.png` if you want it back.
14. **Two images are below twice their display size:** `voice-graph.png` (1386px) and `voice-simple-view.png` (1138px), both from the paper. Listed in `docs/ASSETS.md`; send the originals if you have them.

## Layout and motion

15. **Title size.** The cover title is a step smaller than Nike's (4.75rem at most), so "Helen Hamlyn Centre / Data Platform" sits on two lines with the live link beside the second. Nike's title is half the length.
16. **One card, one screen.** Every card is the same height on tablets and computers. At 1280 × 720 the stepper diagram and the wall photos are small but whole; they're larger at every other review size. The side layout (text beside evidence) is in the template, but no HHCD card uses it: every card's evidence came out larger stacked.
17. **On phones the cover runs to the bottom of a 390 × 844 screen** and is longer than smaller screens. Phones scroll as normal (§7); making it shorter would mean cutting cover content.
18. **Recordings play once when they come into view.** With reduced motion they rest on their first frame. The screen is the one play control. A scrubber and the time sit in the browser window's toolbar, so the controls add no height. The recordings have no sound, so there's no sound control.
19. **No playful micro-interactions in the case file**, following the playbook's latest rule (§7: they belong to the site's shell).
    - Capability labels have small still icons: a keycap, a ticked box and the four marks. They're labels, not links.
    - The live link and the switch change shade on hover, nothing more.

## After your review (11 Oct, lunch)

21. **One cover design for every project.** You asked for the cover to be less crowded and to set the size for all projects. The title is a step smaller (4rem at most). The line under it is regular weight, in the secondary colour and narrower. Space, not extra rules, separates three groups: name and live link · the line · the facts. The whole cover fits the first screen at 1280 × 720. The values are in the playbook (§7), and Nike is asked to follow in SHARED-CHANGES.md.
22. **The # after each heading is gone.** It copied a link to the card on hover, and wasn't clear.

## Outside this repo

20. **VoiceOver reads an entry's name twice** when the details panel opens (from the 11 Oct report). The testing card says it passed, as you asked. The fix belongs in the rebuild repo; the prompt for that conversation is in our chat.

## Your answers (11 Oct, 15:40, in the status doc)

- 1 "What I'd do now": not needed. Stays out.
- 2 Role: "Research Assistant: data collection, analysis and modelling; design and build." The closing card's Context is now "Brunel University, on the VOICE project." so the title isn't said twice.
- 3 Brunel: yes, named.
- 4 Team: you led the workshop (with one researcher) and designed its process around the data the platform needed. Only your part is told: "I led the workshop with members of all seven organisations, and designed its process around the data the platform needed." The Team line is gone.
- 9 Parts stay by time. Part 1 is now "VOICE, the first version": it was built, tested in the workshop and soft-launched, so "pilot" or "early concept" would undersell it. Say if you'd rather have "VOICE pilot".
- 6 Stakeholder cards: back in 01.4, beside the three walls. The cards sit on their own mount on the left; the walls run down the right as rows, each photo beside its finding. Phones stack them.
- 7 `brief`: approved as written.
- 8 Wall photos: cropped, as you asked, to one 2:1 ratio (1600 × 800) that keeps each whole sheet and drops the ceiling and the floor. The playbook says never crop an original; this is your call, noted here.
- Role, after your note at 16:05: "Research Assistant", then two lines with small icons: Data collection *with the VOICE team* (two people) and Analysis, modelling, design and build *on my own* (one person). Written into the playbook (§4) for every project; Nike is asked to follow if it fits.

## Cover art and role (11 Oct, evening)

- **Role corrected:** teamwork was data collection and analysis; from data modelling on, it was yours. The lines now read "Data collection and analysis *with the VOICE team*" and "Data modelling, design and build *on my own*".
- **Cover art, "network":** the map's four marks spill from the cover's top-right corner, run off the sheet and fade before the text. A short ink trail (like the platform's path of opened entries) runs down into "Open the live platform", so the button reads as the way into the map. It is illustrative: 48 marks in the platform's proportions (17 projects, 12 methods, 10 people, 9 partners), not a chart of the real links. The cover's height doesn't change, so it still fits the first screen. Hidden on phones, where it would crowd the title. Built as a template option (`coverArt: "network"`), so other projects can have their own cover art.

## Cover layout, second pass (11 Oct, night)

You said the button beside the title didn't sit comfortably and the cover was still cramped. What changed:

- **The title stands alone.** Nothing sits beside it, so it reads first and whole.
- **The live link moved to the right of the line under the title**, centred on it, with its right edge on the end of the rule below, so it lines up with something instead of floating. It's still on the first screen and adds no row. On tablets and phones it sits under the line.
- **The art is a corner piece.** 30 marks instead of 48 (same proportions), gathered in the top-right corner, running off the sheet and fading before the title. The ink trail into the button is gone, so the button has clean space round it. A check confirms no mark sits on the client line or the title at any size.
- **A little more space** between the title and the line, and between the line and the rule. The cover still fits the first screen at 1280 × 720 (it ends at 675px).
- **Role, Outcome and the labels are as they were.** I tried them as three columns (Role · Outcome · What this shows); you preferred the original, so it's back. One fix: on phones Role and Outcome now stack in one column (they had been squeezed side by side).
- Written into the playbook (§7); Nike is asked to follow in SHARED-CHANGES.md.

## Every card, redesigned (11 Oct, night)

You said some images had too many frames, the purple canvas made no sense, and it didn't look high-end. Each piece of evidence now has one edge, and the canvas is the card itself. Card by card:

- **01.1, 01.3, 01.6 (VOICE screens):** straight on the card with a hairline, on the dot canvas. No mount, no shadow. They're the paper's figures (1,100–1,600px wide), so they don't open larger: there's nothing more to see.
- **01.2 (two map prototypes):** side by side at one height, each as wide as its own ratio, with "Prototype A / B" above. Before, each floated small in a tall box.
- **01.4 (workshop):** the stakeholder cards with a hairline; the three wall photos without their boxes. **New:** each wall photo opens larger (800px wide), so the sticky notes can be read.
- **01.5 (stepper):** the steps are a ruled row (the current one has an ink line above it), and the diagram is a white sheet with one edge on the canvas. Before: a purple box, a white tab, and a box inside it.
- **02.1 (the Centre's version):** the numbers are the picture: each type's column is as wide as its share of the 48 entries, under a bar in its colour; 104 connections stands apart.
- **02.2 (two arrangements):** the switch moved into the window's own bar, where the product's controls would be, so the window is the whole figure. The window has no fake buttons; the address sits on the left.
- **02.3, 02.4 (recordings):** the same flat window; scrubber and time stay in the bar.
- **02.5 (phones):** larger, straight on the canvas. **New:** each screen opens larger.
- **02.6 (contrast):** unchanged: the white table is the product's surface, and it's already one layer.
- **02.7 (testing):** 99 · 0 · 0 set very large at the foot.
- **02.8 (closing card):** the body is set as a statement in large type at the foot, above Context.
- **The map today:** the same flat window on the canvas.
- Written into the playbook (§6–7) and SHARED-CHANGES.md.

## Each card on its own terms (11 Oct, late)

You said the project is text-heavy, so the Nike anatomy (claim on the left, body on the right, picture underneath) shouldn't be on every card; the first picture was too small, the data diagram wasn't readable, and 02.1 had too much empty space. Now:

- **Cards are as tall as their content.** No card is padded out to the screen; only the stacked windows and recordings (02.2, 02.3, 02.4) are a screen tall, because the product needs the room. Nothing is taller than the screen at 1280 × 720.
- **Four compositions, chosen per card:**
    - **Picture first** (`top`): 01.1 VOICE (the screen runs the card's full width, to its top and side edges), 01.6 table view, 02.3 guide.
    - **Text column beside the evidence** (`pair`): 01.2 the two maps stacked on the right; 01.4 text and stakeholder cards on the left, the walls down the right; 02.1 numbers; 02.5 phones; 02.6 table; 02.7 99 · 0 · 0 as a column of large figures.
    - **Claim across the card** (`wide`): 01.5, the reasoning in two columns over the diagram.
    - **Text, then evidence** (`stack`): 01.3 (its screen runs full width to the card's foot), 02.2 the switch, 02.4 keyboard.
- **01.5 redrawn as one diagram:** left, a survey row with Person A at its centre; right, the same kinds of entry as four types of equal weight, linked through the projects. The five steps sit under it, and their numbers sit on the diagram where each happens (01–03 the survey, 04 the split, 05 the map). Real text sizes, no stepping. Sample labels, as before.
- **01.6:** "Ctrl + E" is now a button that switches the picture between VOICE's table and its network, as the shortcut did in the product. It shows the network screenshot that 01.1 also shows; the table is shown first.
- **02.7 testing, coloured by what the numbers mean** (your note at 22:33): VOICE's 99 and 0 are red, because the automated checks looked perfect but missed that the map entries and filters couldn't be reached by keyboard (a red ✕ line says so). The Centre's version's 0 is green, with green ✓ lines for what passed: keyboard, Chrome, Safari and Firefox, VoiceOver. All of it is from the card's own text. The colours are new tokens (`--pass`, `--miss`), checked for contrast in both modes.

## After your review (12 Oct, past midnight)

- **01.2 and 01.3 no longer look pasted on.** 01.3's screenshot was taller than its white panel at some sizes and ran over the card's edge; it now narrows to fit, keeping its ratio, and the white panel stays round it. 01.2's two maps share one width, so their edges line up.
- **01.5 is stepped again, designed properly.** The same sample entries move through five stages, so you watch the data change shape: the four questions (each marked with the type its answers become) → Person A's answers → a table of one row per person, with the repeated row struck out and "workshop" corrected → four typed columns, where Project 2 and Workshops merge into one entry each → the network. Tabs across the top (Decide · Survey · Clean · Split · Link), the step's sentence and Next under them; real text sizes. On phones the stage scrolls sideways.
- **01.6 shows the dual view as the accessibility decision.** Pick how you're using it (Keyboard · Screen reader · Mouse) and each view says whether it works: by keyboard or screen reader the network is "Hard to use" (red, greyed) and the table "Works" (green); with a mouse both work. Ctrl + E sits between the two views, as the switch. The network is first, the table second.
- **The closing card is now the takeaway**, "One person, two points of view": *Bringing accessibility in at the start saved a lot of rework later.* Then: I helped collect the data, then designed and built the platform myself, so there was a lot to weigh at once. Because I could plan as the designer and the developer at the same time, accessibility shaped the data and the layout from the start, rather than being fixed afterwards. "Helped collect" matches the cover (with the VOICE team). Its contents label is "Takeaway". Tell me if you'd word it differently.

## The workshop card, laid out again (12 Oct, morning)

From the seven card originals you sent:

- **The role cards are a hand of cards** beside the text. When the card scrolls into view they are dealt from one stack into a fan (once; with reduced motion they are simply fanned). Point at a card, click it or use the arrow keys: it lifts and straightens, and its words are set beside or under the hand as live text, so it reads at any size ("04 / 07 · The Local Councillor wants to work with an artist…"). The middle card (The Local Councillor) is picked first, so the fan is symmetrical. The words are the cards' own, unchanged.
- **The three walls are back in a row across the foot**, as you preferred: photo, wall, finding. Each photo still opens larger.
- The cards have a soft shadow, since they overlap like real cards; everything else on the page keeps one edge.
- The originals are 362 × 602, so the cards are shown at most about 140px wide, sharp on high-density screens; the live text carries the reading.
- `workshop-cards.png` (the old composite) is no longer used; the file stays in `public/assets/hhcd`.

