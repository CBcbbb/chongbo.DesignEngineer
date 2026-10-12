import { expect, test } from "@playwright/test";

/** The engraved name plate and the word under the button are whole at every screen size. */
const WIDTHS = [320, 360, 390, 768, 1024, 1280, 1440, 1920];

test.describe("printer details", () => {
  test.skip(({ isMobile }) => isMobile, "sizes are set here");

  for (const width of WIDTHS) {
    test(`the plate and PRINT are never clipped at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const problems = await page.evaluate(() => {
        const out: string[] = [];
        const glyphs = (el: Element) => {
          const r = document.createRange();
          r.selectNodeContents(el);
          return r.getBoundingClientRect();
        };
        const machine = document.querySelector(".machine")!.getBoundingClientRect();
        const plate = document.querySelector(".plate")!;
        const p = plate.getBoundingClientRect();
        for (const line of plate.querySelectorAll("span")) {
          const g = glyphs(line);
          if (g.left < p.left - 0.5 || g.right > p.right + 0.5 || g.top < p.top - 0.5 || g.bottom > p.bottom + 0.5)
            out.push(`plate line "${line.textContent}" runs outside the plate`);
        }
        const word = glyphs(document.querySelector(".pk-label")!);
        // the photographed button is 10.4% of the machine wide, centred at 86.1% across and 59.8% down
        const bezelBottom = machine.top + machine.height * 0.598 + (machine.width * 0.104) / 2;
        if (word.top < bezelBottom) out.push(`PRINT starts ${(bezelBottom - word.top).toFixed(1)}px inside the button's bezel`);
        if (word.bottom > machine.bottom) out.push("PRINT runs off the machine");
        return out;
      });
      expect(problems, problems.join("\n")).toEqual([]);
    });
  }
});
