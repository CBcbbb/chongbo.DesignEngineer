# Asset prompts (round 1: the master render)

Direction: A+ (the current printer, with a display window in place of the name plate and a reading light at the top slot).

Only one image is needed from GPT in this round. Everything that moves or lights up is built from it in code, so the parts line up exactly:

- the button cap is cut out of this same render and sits on a socket drawn in CSS (as in the prototype);
- the display text, the lamp's colours, the reading light and the ready glow are live HTML and CSS over the blank, switched-off parts of the render;
- the floor shadow and the dark-mode light pool are CSS.

GPT is the wrong tool for anything animated (the button travel, the paper feed, the display redraw). That stays in code. A dark-mode render comes in round 2, only if the CSS light pool isn't enough.

---

## 1. `printer-master.png`

- **Used for:** the home page machine (`public/printer.webp` once cut and exported) and the Open Graph image.
- **Size:** the largest landscape size GPT offers (1536 × 1024 or larger), the machine filling about 90% of the width. That gives about 1380px of machine, enough for the 680px display width at 2x. Export to WebP at 1x (760px) and 2x (1520px).
- **Format:** PNG with a transparent background. If transparency isn't offered, a flat pure black background like the reference; I'll cut it out.
- **Upload as the image to edit:** `docs/design/printer-cut.png` (the original render, on black). Use edit mode, not a fresh generation, so the camera and proportions stay put and the overlay positions barely move.
- **Ask for three versions** that differ only in the display's width (narrow, medium, wide), so we can pick by eye.

### Prompt

```
Edit the attached product render. Keep the camera, framing, proportions and the machine's position in the frame exactly as they are: a straight front view, very slightly from above, the whole machine centred at the same size. It is a compact desktop printer in warm off-white.

Change only these things:

1. Replace the small engraved rectangle on the left of the front panel with a recessed display window: dark smoked glass, set flush into the panel, with a thin chamfered edge that catches the light along its bottom lip. Make it about 27% of the machine's width and a little taller than the old rectangle, starting where the old rectangle starts. The screen is switched off and completely blank: no text, no icons, no lit pixels, no glow. Only a very faint diagonal reflection on the glass.

2. The small indicator lamp to the left of the display is switched off: a small domed lens of frosted clear plastic, no colour, no glow.

3. Materials, refined: the body is powder-coated aluminium in warm off-white (close to #ece8e0) with a very fine bead-blasted texture and softly rounded edges. The front panel is the same colour one shade deeper, recessed by a few millimetres, with a crisp shadow line where it meets the body. The output tray is brushed stainless steel with a fine horizontal grain and a slightly rounded front edge. The red button (close to #c9372a) is a glossy, gently domed cap in a polished chrome bezel, with one clean highlight at its upper left.

4. The top paper slot and the front opening are clean, dark and empty. No paper anywhere.

5. Lighting: soft studio light from the upper left, one large softbox, gentle falloff across the top surface, no hard reflections, no lens flare. Product photography quality, sharp at every edge, no depth-of-field blur.

Background: transparent. No floor and no shadow under the machine.

Make three versions that differ only in the display's width: about 22%, 27% and 32% of the machine's width.
```

### Avoid

- any text, numbers, logos or icons anywhere on the machine, including on the display;
- a lit or glowing display or lamp;
- changing the angle, the perspective or the machine's size in the frame;
- new parts: extra buttons, knobs, vents, screws, speaker grilles, labels;
- a glossy plastic or toy look, a cartoon or 3D-icon look, colour casts, vignetting;
- cropping any part of the machine.

### When it comes back

Send me the version you like. I'll check its pixels (sharpness, edges, the blank display), cut the background if needed, measure the new overlay positions (display, lamp, button, top slot, front opening, PRINT label) and update the prototype with the real render, so you can feel it on your phone before anything goes into the site.

If GPT has moved the camera or changed the proportions, that's fine too: it only means new coordinates, which I measure from the image.
