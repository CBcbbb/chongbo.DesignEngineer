# HHCD: open decisions (for Chongbo, 11 Oct 2026)

The case file now follows the playbook of 11 October (the Nike review's standards). Below is everything I decided on your behalf, or couldn't settle without you. Each item says what I chose; tell me to change any of them and I'll update the page.

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
18. **Recordings play once when they come into view.** They have no sound, so there's no sound control. The screen is the one play control. With reduced motion they rest on their first frame.
19. **Micro-interactions, tied to the content:**
    - Accessibility chip: a key that presses and turns its arrow.
    - Idea to production: a dashed sketch that draws itself solid.
    - Craft and interaction: the four marks trade places, like the map's arrangements.
    - Live link: the arrow flies off and comes back.
    - Play button: the four marks swing round it.
    - Letters wobble on the live link, the chips, the switch and the next case file.

    `Wobble` now lives in the block library (`src/components/casefile/motion.tsx`). Nike keeps its own copy until it moves onto the template.

## Outside this repo

20. **VoiceOver reads an entry's name twice** when the details panel opens (from the 11 Oct report). The testing card says it passed, as you asked. The fix belongs in the rebuild repo; the prompt for that conversation is in our chat.
