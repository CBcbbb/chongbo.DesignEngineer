// Writes src/generated/asset-manifest.json: every file under public/assets, with the intrinsic size of PNGs and JPEGs.
// Server code reads this manifest instead of touching public/ with fs, so Vercel does not bundle the
// whole asset folder (~80 MB) into every server function. Runs automatically before `dev` and `build`.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public", "assets");
const OUT = path.join(process.cwd(), "src", "generated", "asset-manifest.json");

function size(buf) {
  // PNG: width and height are big-endian at bytes 16 and 20 of the IHDR chunk.
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // JPEG: walk the markers to the first start-of-frame.
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  return null;
}

const manifest = {};
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile()) {
      const rel = path.relative(ROOT, full).split(path.sep).join("/");
      manifest[rel] = /\.(png|jpe?g)$/i.test(entry.name) ? size(fs.readFileSync(full)) : null;
    }
  }
}
if (fs.existsSync(ROOT)) walk(ROOT);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
console.log(`asset-manifest: ${Object.keys(manifest).length} files`);
