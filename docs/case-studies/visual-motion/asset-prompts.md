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

Written once a direction is chosen: the same camera, a transparent background, the largest size GPT offers, with the display blank and switched off. The overlay positions are then measured from the image.
