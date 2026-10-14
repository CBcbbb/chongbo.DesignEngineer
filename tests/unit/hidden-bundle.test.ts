import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { hiddenBundleLeaks } from "../../scripts/check-hidden-bundle";

const hidden = [{
  slug: "hidden-example",
  title: "Hidden project",
  oneLiner: "A project that must not ship.",
  sections: [{ id: "idea", kind: "decision" as const, title: "Idea", body: ['Keep the "unpublished" story here.'], signals: [] }],
}];
const directories: string[] = [];
function fixture(source: string) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "hidden-bundle-"));
  directories.push(directory);
  fs.mkdirSync(path.join(directory, "chunks"));
  fs.writeFileSync(path.join(directory, "chunks/app.js"), source);
  return directory;
}
afterEach(() => { for (const directory of directories.splice(0)) fs.rmSync(directory, { recursive: true, force: true }); });

describe("hidden content in client builds", () => {
  it("catches a hidden object even when it is filtered out at runtime", () => {
    const directory = fixture(`const projects = ${JSON.stringify(hidden)}.filter(p => p.slug !== "hidden-example");`);
    expect(hiddenBundleLeaks(directory, hidden)).toEqual([
      { file: "chunks/app.js", project: "hidden-example", field: "title" },
      { file: "chunks/app.js", project: "hidden-example", field: "oneLiner" },
      { file: "chunks/app.js", project: "hidden-example", field: "idea.body.0" },
    ]);
  });

  it("detects escaped text in minified JavaScript and source maps", () => {
    const directory = fixture(String.raw`const title = "\u0048idden project"; const body = 'Keep the \x22unpublished\x22 story here.';`);
    fs.writeFileSync(path.join(directory, "chunks/app.js.map"), JSON.stringify({ sourcesContent: ['const description = "A project that must not ship.";'] }));
    expect(hiddenBundleLeaks(directory, hidden).map((leak) => leak.field)).toEqual(["title", "idea.body.0", "oneLiner"]);
  });

  it("allows public content and hidden slug identifiers without their content", () => {
    expect(hiddenBundleLeaks(fixture('const hidden = ["hidden-example"]; const title = "Public project";'), hidden)).toEqual([]);
  });

  it("rejects a missing or empty build instead of reporting a false pass", () => {
    const directory = fixture("");
    fs.unlinkSync(path.join(directory, "chunks/app.js"));
    expect(() => hiddenBundleLeaks(directory, hidden)).toThrow("No client JavaScript found");
    expect(() => hiddenBundleLeaks(path.join(directory, "missing"), hidden)).toThrow();
  });
});
