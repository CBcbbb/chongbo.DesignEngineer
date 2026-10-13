# Asset prompts (round 1: the master render)

Direction: printer v2, redesigned around the interface (prototype: `docs/design/visual-motion-machine-v2.html`). It replaces the earlier A+ prompt, which only edited the old render.

Only one image is needed from GPT in this round. Everything that moves or lights up is built from it in code, so the parts line up exactly:

- the key cap is cut out of this same render and sits on the socket that is part of the render;
- the display text, the status dot, the reading light, the ready glow and the PRINT word on the key are live HTML and CSS over the blank, switched-off parts of the render;
- the floor shadow and the dark-mode light pool are CSS.

GPT is the wrong tool for anything animated (the key travel, the paper feed, the display redraw, the word marking). That stays in code. A dark-mode render comes in round 2, only if the CSS light pool isn't enough.

---

## 1. `printer-v2.png`

- **Used for:** the home page machine (`public/printer.webp` once cut and exported) and the Open Graph image.
- **Size:** landscape, the largest size GPT offers (1536 × 1024 or larger). The machine is centred and fills about 92% of the width, about 1410px, enough for the 640px display width at 2x. Export to WebP at 1x (720px) and 2x (1440px).
- **Format:** PNG with a transparent background. If transparency isn't offered, a flat warm grey (#e9e7e2); I'll cut it out.
- **Upload as the reference:** `docs/design/printer-v2-blueprint.png`. It is the design drawing: every part's size and position is decided there. Ask GPT to render it, not to redesign it.
- **Second reference (optional):** `docs/design/printer-cut.png`, for the warm off-white material and the soft studio light only, never for the shape.
- **Ask for three versions** with the same layout and slightly different materials (see the last line of the prompt), so we can pick by eye.

### Prompt

```
Render the attached design drawing as a high-end product photograph. The drawing is final: keep every part exactly where it is and at the same size and proportions. Only the materials, light and fine detail change.

The object is a low, wide desktop printer, about 2.7 times as wide as it is tall. The camera is square-on to the front, slightly above it, with a long lens: the front face shows almost no perspective, and the top surface is visible as a shallow band behind the rounded front edge.

Parts, from top to bottom:
- Top surface: a long, narrow paper slot running almost the full width, dark inside, with a fine highlight on its front lip. No paper.
- The rounded edge between the top and the front catches a soft line of light along its whole length.
- Front panel: recessed by a few millimetres, one shade deeper than the body, with a crisp shadow line round its edge.
- On the left of the panel, a wide display window: dark smoked glass set flush into a slightly darker frame, with a thin chamfered lip that catches the light along the bottom. The display is switched off and completely blank: no text, no pixels, no glow, only a faint diagonal reflection.
- On the right of the panel, a large round red key (close to #c9372a): a glossy, gently domed cap sitting in a polished chrome bezel, with one clean highlight at its upper left. Nothing written on it.
- Below, centred, a wide front slot, dark inside, with a brushed stainless steel tray coming out of it: fine horizontal grain, a slightly rounded front edge.
- Two small dark rubber feet.

Materials: the body is powder-coated aluminium in warm off-white (close to #ece8e0) with a very fine bead-blasted texture and softly rounded corners. Calm, precise, premium; like a piece of modern studio equipment.

Lighting: one large softbox from the upper left, gentle falloff across the top, soft reflections, no hard specular streaks, no lens flare. Sharp at every edge, no depth-of-field blur.

Background: transparent. No floor and no shadow under the machine.

Make three versions with exactly this layout: one matte and soft, one with a slightly more satin finish, one with slightly crisper edges and shadow lines.
```

### Avoid

- any text, numbers, logos or icons anywhere, including on the display and the key;
- a lit or glowing display, a coloured lamp, paper in either slot;
- moving, resizing or adding parts: no extra buttons, knobs, dials, vents, screws, grilles, labels or a name plate;
- a three-quarter view, a wide-angle look or any change to the proportions;
- glossy plastic, a toy or retro-kitsch look, a cartoon or 3D-icon look, colour casts, vignetting;
- cropping any part of the machine.

### When it comes back

Send me the version you like. I'll check its pixels (sharpness, edges, the blank display), cut the background if needed, measure the overlay positions (display, key, top slot, front slot) against the blueprint and put the real render into the prototype, so you can feel it on your phone before anything goes into the site.

If GPT has shifted something, that's fine: it only means new coordinates, which I measure from the image.
