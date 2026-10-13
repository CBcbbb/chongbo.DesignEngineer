# Asset prompts

The machine's look is GPT's job. What is fixed by the interface (proportions, where each part sits, how big it is) comes from `docs/design/visual-motion-machine-v2.html`. The drawn machine in that prototype is a layout stand-in only, not a style reference.

Everything that moves or lights up is built in code over the chosen render: the key cap (cut from the render), the display text and status dot, the reading light, the ready glow, the floor shadow and the dark-mode light pool. GPT is the wrong tool for any of the animation.

## Round 1: exploration (three retro directions)

One image per style, 1536 × 1024 landscape. Use the same prompt three times, changing only the last line. Optional reference: `docs/design/printer-cut.png`, for material and light only, never the shape.

### Prompt

```
A high-end product photograph of a desktop printer, designed as a refined retro object: premium, calm and precise, with real craft in the details.

Composition (keep exactly): a straight front view, the camera slightly above the machine with a long lens, so the front face shows almost no perspective and the top surface is visible as a shallow band. The whole machine is centred and fills about 90% of the width. It is low and wide, about 2.7 times as wide as it is tall. Plain warm light-grey studio background, soft contact shadow.

Layout (keep exactly):
- Top surface: one long, narrow paper slot running almost the full width, dark inside. Nothing else near it. No paper.
- Front, left: a wide display window, about 40% of the machine's width, dark tinted glass behind a bevelled frame. The display is switched off and completely blank.
- Front, right: one large round red push key (close to #c9372a), about 11% of the machine's width, in a chrome bezel. Nothing written on it.
- Front, centred below: a wide output slot with a short metal tray coming out of it.
- No other controls.

Fine details to get right: crisp shadow lines where parts meet, softly radiused edges that catch the light, a believable surface texture, small real-world imperfections in the finish, a clean highlight on the red key.

Lighting: one large softbox from the upper left, gentle falloff, no lens flare, sharp at every edge.

Style: [one of the three style lines]
```

### Style lines

1. `1960s German industrial design: an ivory body with a brushed aluminium front plate, fine engraved hairlines, matte, quiet and exact.`
2. `1970s Italian office machine: warm cream, softer rounded volumes, a satin finish, a ribbed dark rubber strip along the base.`
3. `1980s Japanese hi-fi component: a low aluminium front with fine brushing, the display behind dark green-tinted glass, small knurled chrome details.`

### Avoid (every time)

- any text, numbers or logos, including on the display and the key;
- a lit or coloured display; paper;
- extra buttons, knobs or a name plate;
- a three-quarter view or wide-angle distortion;
- a plastic toy look, a cartoon or icon style.

## Round 2: the final render

Chosen: the 1970s Italian study (`docs/design/printer-it-study.png`), with two details from the Japanese one. The study is already in the prototype (`docs/design/visual-motion-machine-v3.html`), cut out by hand; this round makes the clean master.

- **File:** `printer-v3.png`, for the home page machine and the Open Graph image.
- **Size:** the largest landscape size GPT offers; the machine fills about 94% of the width.
- **Format:** PNG with a transparent background (or flat #e9e7e2 if transparency isn't offered).
- **Upload as the image to edit:** `docs/design/printer-it-study.png`. Use edit mode, so the camera, light and materials stay as they are.

### Prompt

```
Edit the attached product photograph. Keep the camera, the lighting, the materials and the overall design exactly as they are: the warm cream body with softly rounded ends, the ribbed dark rubber base, the dark display window with its polished frame, the red key in its chrome ring, and the brushed steel tray.

Change only these things:

1. Make the output tray shorter: it should come out of the front slot by about a third of its current depth, a slim steel lip rather than a drawer. Keep its width and its rounded front edge.
2. Make the red key about 15% larger, and move it slightly to the left, so the space to its right is about the same as the space to the left of the display.
3. Give the chrome ring round the key a fine knurled edge, like a precision dial.
4. Give the display glass a very slight dark green tint. It stays switched off and completely blank: no text, no pixels, no glow.
5. Show a little more of the top surface, so the long paper slot on top reads clearly as an opening, with a fine highlight along its front lip. No paper.

Background: transparent. No floor and no shadow under the machine. Sharp at every edge.
```

### Avoid

- any text, numbers or logos, including on the display and the key;
- a lit display; paper in either slot;
- changing the camera angle, the proportions of the body or the materials;
- extra controls, vents, screws or labels;
- cropping any part of the machine.

### When it comes back

Send it to me. I'll cut it if needed, re-measure the overlay positions (display, key, top slot, front slot, the PRINT engraving) and swap it into the prototype. Only then does it go into the site, with the key cap cut from the same image.
