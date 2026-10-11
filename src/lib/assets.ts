import "server-only";
import fs from "node:fs";
import path from "node:path";

const ASSET_DIR = path.join(process.cwd(), "public", "assets");

/** Checked at build time: pages are static, so a newly added asset appears on the next build. */
export function assetExists(asset: string): boolean {
  try {
    return fs.statSync(path.join(ASSET_DIR, asset)).isFile();
  } catch {
    return false;
  }
}

/**
 * Intrinsic size of a PNG or JPEG in public/assets, read from its header, so screenshots render at their own
 * proportions inside a plate instead of being cropped. Returns null when the file is missing or unreadable.
 */
export function imageSize(asset: string): { width: number; height: number } | null {
  let buf: Buffer;
  try {
    buf = fs.readFileSync(path.join(ASSET_DIR, asset));
  } catch {
    return null;
  }
  // PNG: width and height are big-endian at bytes 16 and 20 of the IHDR chunk.
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // JPEG: walk the markers to the first start-of-frame.
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1]!;
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  return null;
}
