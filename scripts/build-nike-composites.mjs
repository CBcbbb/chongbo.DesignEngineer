/**
 * Build composite images for the Nike case file so the single-image media
 * slots can carry the multi-image story from the old Wix layout.
 *
 * Run:  node scripts/build-nike-composites.mjs
 */

import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, "..", "public", "assets", "nike");

const BG = { r: 243, g: 243, b: 239, alpha: 1 }; // matches the site's paper panel
const GAP = 28;
const PAD = 40;

/** Lay images out in a single row, scaled to a common height. */
async function row(paths, height, out) {
  const metas = await Promise.all(paths.map((p) => sharp(join(DIR, p)).metadata()));
  const widths = metas.map((m) => Math.round((m.width / m.height) * height));
  const totalW = widths.reduce((a, b) => a + b, 0) + GAP * (paths.length - 1) + PAD * 2;
  const totalH = height + PAD * 2;

  const composites = [];
  let x = PAD;
  for (let i = 0; i < paths.length; i++) {
    const buf = await sharp(join(DIR, paths[i]))
      .resize({ height, fit: "contain", background: BG })
      .toBuffer();
    composites.push({ input: buf, left: x, top: PAD });
    x += widths[i] + GAP;
  }

  await sharp({ create: { width: totalW, height: totalH, channels: 4, background: BG } })
    .composite(composites)
    .png()
    .toFile(join(DIR, out));
  console.log(`wrote ${out} (${totalW}x${totalH})`);
}

/** Lay images out in a grid, each scaled to fit a cell. */
async function grid(paths, cols, cellW, cellH, out) {
  const rows = Math.ceil(paths.length / cols);
  const totalW = cols * cellW + GAP * (cols - 1) + PAD * 2;
  const totalH = rows * cellH + GAP * (rows - 1) + PAD * 2;

  const composites = [];
  for (let i = 0; i < paths.length; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const buf = await sharp(join(DIR, paths[i]))
      .resize({ width: cellW, height: cellH, fit: "contain", background: BG })
      .toBuffer();
    composites.push({ input: buf, left: PAD + c * (cellW + GAP), top: PAD + r * (cellH + GAP) });
  }

  await sharp({ create: { width: totalW, height: totalH, channels: 4, background: BG } })
    .composite(composites)
    .png()
    .toFile(join(DIR, out));
  console.log(`wrote ${out} (${totalW}x${totalH})`);
}

async function main() {
  // Graphic system: the component overview, in a 2-row grid.
  await grid(
    [
      "gs-logo-lockup.png",
      "gs-header.png",
      "gs-key-message.png",
      "gs-text-simplified.png",
      "imagery-primary.png",
      "poster-card.png",
    ],
    3,
    520,
    760,
    "graphic-system.png",
  );

  // Product card: before / after, side by side.
  await row(["product-card-before.png", "product-card-after.png"], 900, "product-card.png");

  // Retouching: original vs retouched, twice.
  await row(
    ["retouch-1-original.png", "retouch-1-after.png", "retouch-2-original.png", "retouch-2-after.png"],
    700,
    "retouching.png",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
