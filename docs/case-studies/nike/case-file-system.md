# Case file layout: proposal from the Nike prototype

For the shared template (owned by the HHCD conversation). Shown in `docs/design/case-nike.html`.

## Page

- **Left: contents, the same on every project.** Sticky. Project name, then each part (`01 Read`) with its cards listed under it. The part and card in view are marked with the accent. Below 1000 px it becomes a sticky strip of parts under the top bar.
- **Right: a stack of sheets on the studio ground.** The cover sits on the ground; everything after it is a sheet.

## Units

- **Part:** a chapter of the story (Read, Shop, Return, Outcome). It is a heading and a contents entry, never a card.
- **Card = one sheet = one decision or proof.** It is what the printer prints, so it stands alone. A part holds two to four cards.

## Sheet anatomy

1. Meta row: index (`01.1`, accent, mono) on the left; capability tags (outlined accent pills) on the right.
2. Heading: the claim.
3. Body: at most three sentences, 62ch.
4. Optional action: "See it at 0:25" (jumps to the recording), "Play", "Drag to compare".
5. Evidence: on a mount in `--accent-2`, full sheet width.
6. Caption: mono, says what the evidence proves.

## Colour roles (v3)

Three sheet surfaces set the page rhythm: paper → black → orange.

- **Paper, ink and type:** shared by every project. Reading sheets.
- **Project colour field (Nike: orange):** the cover sheet, each part opener (huge part number + name + card list), and the field behind every interactive compare. Also every control and the contents marker.
- **Project dark (Nike: black):** evidence sheets where the work fills the card edge to edge (the recording, story images, motion), plus the outcome sheet.
- A project changes only these two colours, its cover and its signature module.

## Card types (same anatomy, different art direction)

| Type | Surface | Evidence treatment |
|---|---|---|
| Design system | paper | grid-paper spec board with component names; interactive switcher where there are variants |
| Before and after | paper | compare slider on the project colour field, labels on the image |
| Story | black | evidence full-bleed to the sheet edges; caption bar under it |
| Motion | black | playable stage, full-bleed, Play/Replay |
| Process loop | paper | numbered steps in tinted pills, the last one in the project colour |
| Reflection | paper | two black panels, "Specified" vs "Shipped" |

## Images

- Never change an image's ratio: `height: auto` everywhere; rows size by `max-height`, not fixed boxes.
- Use the originals in `public/assets/<slug>/`. Crop only; never resize or re-encode an original for the page (the site's image pipeline does that at build).
- Don't render an image larger than its natural size.
