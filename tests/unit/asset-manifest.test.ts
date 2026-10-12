import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { buildManifest, MANIFEST_PATH, trackedAssets } from "../../scripts/asset-manifest.mjs";

// src/generated/asset-manifest.json is committed, and `prebuild` regenerates it from public/assets. If the two
// disagree, every fresh clone's build rewrites the file, so these tests keep them in step.
const committed = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as Record<string, unknown>;

describe("asset manifest", () => {
  it("matches what the generator writes for public/assets", () => {
    expect(committed, "run `node scripts/asset-manifest.mjs` and commit the result").toEqual(buildManifest());
  });

  it("lists exactly the assets git tracks", (ctx) => {
    const tracked = trackedAssets();
    if (!tracked) ctx.skip();
    const notInGit = Object.keys(committed).filter((rel) => !tracked!.includes(rel));
    const notListed = tracked!.filter((rel) => !Object.hasOwn(committed, rel));
    expect({ notInGit, notListed }, "the manifest must describe the committed assets, so a fresh clone builds the same file").toEqual({
      notInGit: [],
      notListed: [],
    });
  });
});
