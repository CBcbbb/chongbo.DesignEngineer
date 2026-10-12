import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Nothing inside a case-file card follows the window (playbook §7, tokens.css): a card is laid out on the artboard and
 * scaled as a whole. These are the style sheets cards are drawn with; a window unit or a window-height query in them
 * would make a card differ from one screen to the next again.
 */
const CARD_CSS = [
  "src/app/case-file.css",
  "src/components/case/nike/nike.css",
  "src/components/case/any-data/any-data.css",
  "src/components/case/any-data/cards.css",
  "src/components/case/any-data/compositions.css",
  "src/components/case/any-data/demo.css",
];

/** The enlarged-picture dialog is sized to the real screen on purpose. */
const ALLOWED = [/\.cf-lightbox figure/];

describe("card styles follow the artboard, not the window", () => {
  for (const file of CARD_CSS) {
    it(file, () => {
      const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      const problems: string[] = [];
      const rules = css.split("}");
      for (const rule of rules) {
        if (ALLOWED.some((re) => re.test(rule))) continue;
        for (const m of rule.matchAll(/(?<![\w.-])\d*\.?\d+(vw|vh|svh|dvh|lvh|vmin|vmax)\b/g))
          problems.push(`${m[0]} in: ${rule.trim().split("\n").pop()?.trim()}`);
        if (/@media[^{]*\b(min|max)-height/.test(rule)) problems.push(`window-height query: ${rule.match(/@media[^{]*/)![0]}`);
      }
      expect(problems, `use var(--vw) or px/rem instead\n${problems.join("\n")}`).toEqual([]);
    });
  }
});
