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

## Colour roles

- **Paper, ink and type:** shared by every project.
- **`--accent-2` (Nike: black):** evidence only. Every media mount and the recording sheet.
- **`--accent` (Nike: orange):** action and position only. Contents marker, part numbers, card index, tags, links, play and compare controls.
- A project changes only these tokens, its cover and its signature sheet.

## Images

- Never change an image's ratio: `height: auto` everywhere; rows size by `max-height`, not fixed boxes.
- Use the originals in `public/assets/<slug>/`. Crop only; never resize or re-encode an original for the page (the site's image pipeline does that at build).
- Don't render an image larger than its natural size.
