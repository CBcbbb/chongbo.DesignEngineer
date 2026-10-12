# The projector: flow and material

How the home page plays, stage by stage, and the renders it needs. Built on `shell/projector`; the code is `src/components/projector/Projector.tsx` and `src/app/projector.css`.

## The flow

| # | Stage | What happens | Camera | Material |
|---|---|---|---|---|
| 0 | Arrive | Light room. Headline left; a file of five index cards (four questions, one blank); the machine front-on at the right, lamp off. | Front, eye level, whole machine | `machine.webp` (V5 front, off), `paper.webp` |
| 1 | Choose | Up to three cards: each lifts out of the file and flies to the magazine, the first into the front slot, the next behind it; lamp green, the red button breathes. Pressing a card that is in takes it out. Writing on the blank card opens it to ruled lines; it goes in last when you press. | Front | same |
| 2 | Press | The button goes in, the machine knocks, the card drops into the gate. The question is sent now. | Front | (optional) pressed-button crop |
| 3 | Lights down, move in | The room goes dark; we move in and round the machine until it is a close, sharp foreground at the left, lens facing the wall on the right. The lens lights; the beam reaches the wall. | Front → **¾ view** (cross-fade during the move) | **A** and **B** (¾ renders), **C** (beam) |
| 4 | Thinking | Top left, four steps: Reading your card → Finding the work that answers it → Choosing the sections to show → Projecting. The first two follow the request; the last two follow the answer. On the wall, the light is out of focus. At least about 2 s. | ¾, still | A, C, **D** (dust) |
| 5 | Selected for you (each card in turn) | A cut through the dark to behind the machine; the light comes into focus as a row of story cards; the one in the light faces us, the others turn away. Arrows, dots, keys, drag. | **behind**, still | rear render, rear beam, dust, v6 story panel |
| 6 | A story | The card grows into the full slide: claim, reasoning, evidence (full width for figures and diagrams), Open full project, Next story, Back to the selection. The machine darkens. | behind | `slide.webp` |
| 7 | Change the card | The wall goes, we move back out to the front view, the lights come up, the card comes back to the file. | behind → front | front |

## Material in use (the cream series pack)

| File | From | Used for |
|---|---|---|
| `machine.webp`, `machine-on.webp` | V5 front, off and lit | light room; the start of the move in |
| `machine-34-off.webp`, `machine-34-on.webp` | three-quarter, low-key, 2400 × 1600, cropped to 1620 × 775 | stages 3–4; lens at 92.6% / 45.2% |
| `beam.webp` | `01-beam-diagonal-right` | the light while it thinks |
| `machine-rear.webp` | `02-rear-quarter-on`, cropped to 1420 × 862 | stages 5–6; lens at 99.6% / 26.4% |
| `beam-rear.webp` | `v7-01-beam-diagonal-away` | the light from behind; apex (195, 893), far end (1390, 380) |
| `dust.webp` | `dust-only`, cropped and halved | dust, masked by whichever beam is showing |

Nice to have, not blocking: a rear render with a single card in the magazine (the pack's has five); a pressed-button crop of the front view for stage 2.

## Material that was asked for

All on a transparent background, the same V5 machine (cream body, narrow card magazine at top left, round red button, knurled silver lens ring, black vented base, blank brushed name plate), the same render style as the V5/v6 set.

**A. ¾ view, lens on.** `machine-34-on.png`, 2400 × 1600.
- The machine turned about 35–40° so its lens points to the right of the frame (towards the wall), a little towards us; camera about 12° above, a normal lens (no wide-angle distortion). The whole machine in frame, the lens at roughly 70–75% across.
- Lens lit: warm light inside the glass with a little bloom; the indicator lamp amber. One cream card standing in the magazine's front slot, about a quarter showing.
- Low-key lighting for a dark room: warm light falling on the front from the lens side, the far side in shadow. Sharp, no depth-of-field blur.
- Prompt: *"Product render of the same vintage-style cream slide projector (narrow card magazine on top left with one cream card in the front slot, round red push button, knurled silver lens ring, black vented base, blank brushed metal name plate), three-quarter view, rotated about 38 degrees so the lens points to the right of the frame, camera 12 degrees above, normal focal length. The lens is switched on: warm glowing light inside the glass, small bloom; amber indicator lamp on. Dark room, low-key warm lighting from the lens side, deep soft shadows on the far side. Sharp focus, photoreal, no text, transparent background, 2400×1600."*

**B. ¾ view, lens off.** `machine-34-off.png`. Exactly the framing of A (they must overlay pixel for pixel), lens dark, lamp off, the same card in the slot. Used where the move starts and when the lights come up.
- Prompt: *"Same render as before, identical camera and framing, but the projector is switched off: lens glass dark with faint reflections, indicator lamp off. Transparent background."*

**C. The beam for that lens.** `beam-34.png`, the same 2400 × 1600 canvas as A, so it lies on top without moving.
- Starts as a small bright disc exactly on A's lens; spreads to the right and slightly upwards in a cone of about 25°; volumetric haze, soft edges, fading out well before the right edge (no hard end).
- Prompt: *"Transparent overlay: a warm volumetric projector light beam starting as a small bright point at [the lens position of the previous image] and spreading to the right and slightly upwards in a soft 25-degree cone, hazy, faint dust, edges soft, fading out completely before the right edge. Only the light, nothing else, transparent background, 2400×1600."*

**D. Dust in the beam** (optional, but it brings the light to life). Either a 4–6 s seamless loop with transparency (WebM VP9 or MOV ProRes 4444), or three transparent PNG layers of sparse floating specks inside the same cone, which I'll drift at different speeds.

**E. Pressed button** (optional). A crop of the current front-view machine with the red button pushed in, aligned to `machine.webp`, for the press in stage 2.

## Notes

- The light room keeps the front-view render: the overlays (magazine, lamp, button, plate) are placed on it in % and it reads clearly at a glance.
- Stage 5 onwards is seen from behind the machine (rear-quarter render), not from the side: we cut to it through the dark when the light comes into focus.
