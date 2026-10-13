// Writes src/generated/asset-manifest.json: every file under public/assets, with the intrinsic size of PNGs and JPEGs.
// Server code reads this manifest instead of touching public/ with fs, so Vercel does not bundle the
// whole asset folder (~80 MB) into every server function. Runs automatically before `dev` and `build`.
//
// The manifest is committed, so it must describe the committed assets: a fresh clone's build has to write the
// same file. It is built from what is on disk, so a file that is on disk but not in git (an export not yet
// added, or one removed from git but left behind) would end up in it; the script warns about those, and
// tests/unit/asset-manifest.test.ts fails if the committed manifest and the committed assets disagree.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const ASSET_ROOT = path.join(process.cwd(), "public", "assets");
export const MANIFEST_PATH = path.join(process.cwd(), "src", "generated", "asset-manifest.json");

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

/** The manifest for the files under `root`, in a stable order (dotfiles such as .DS_Store are skipped). */
export function buildManifest(root = ASSET_ROOT) {
  const manifest = {};
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.name.startsWith(".")) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) {
        const rel = path.relative(root, full).split(path.sep).join("/");
        manifest[rel] = /\.(png|jpe?g)$/i.test(entry.name) ? size(fs.readFileSync(full)) : null;
      }
    }
  }
  if (fs.existsSync(root)) walk(root);
  return manifest;
}

/**
 * The asset paths git tracks (relative to public/assets, dotfiles skipped), or null where git is unavailable
 * (an exported tree, or a build without .git). Deleted-but-unstaged files still count as tracked.
 */
export function trackedAssets(root = ASSET_ROOT) {
  try {
    const out = execFileSync("git", ["ls-files", "-z", "--", "."], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return out
      .split("\0")
      .filter(Boolean)
      .filter((rel) => !rel.split("/").some((part) => part.startsWith(".")));
  } catch {
    return null;
  }
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isCli) {
  const manifest = buildManifest();
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`asset-manifest: ${Object.keys(manifest).length} files`);

  const tracked = trackedAssets();
  if (tracked) {
    const known = new Set(tracked);
    const untracked = Object.keys(manifest).filter((rel) => !known.has(rel));
    if (untracked.length) {
      console.warn(
        `asset-manifest: ${untracked.length} file(s) under public/assets are not in git, so a fresh clone's manifest will differ:\n` +
          untracked.map((rel) => `  ${rel}`).join("\n") +
          "\n  git add them, or remove them from public/assets, before committing the manifest.",
      );
    }
  }
}
