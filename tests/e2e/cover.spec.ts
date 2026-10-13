import { expect, test } from "@playwright/test";

/**
 * Cover art stays clear of the cover's words (playbook §7: it "never sits under text or the live link"). Checked on
 * the design system's cover in every brand its "Seen as" control offers, since each brand sets the title in its own
 * typeface, at every width the art is shown (it is hidden below 1000px).
 */
test("the design system's cover art never sits under a word", async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 0) < 1000, "the cover art is hidden below 1000px");
  await page.goto("/work/design-system");
  const radios = page.locator('.ds-seen input[type="radio"][name="ds-seen"]:not([value="own"])');
  const brands = await radios.count();
  expect(brands).toBeGreaterThan(1);
  const problems: string[] = [];
  for (const width of [1000, 1100, 1180, 1280, 1366, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (let i = 0; i < brands; i++) {
      await radios.nth(i).check({ force: true });
      await page.waitForTimeout(150);
      const hits = await page.evaluate(() => {
        const cover = document.querySelector(".cf-cover")!;
        const art = cover.querySelector(".ds-cover-layers")!.getBoundingClientRect();
        const out: string[] = [];
        for (const el of cover.querySelectorAll(".cf-client, .cf-h1, .cf-lede, .ds-seen")) {
          const range = document.createRange();
          range.selectNodeContents(el);
          for (const r of range.getClientRects()) {
            if (r.right > art.left && r.left < art.right && r.bottom > art.top && r.top < art.bottom) out.push(el.className);
          }
        }
        return [...new Set(out)];
      });
      const brand = await radios.nth(i).getAttribute("value");
      for (const h of hits) problems.push(`${width}px, ${brand}: the art covers ${h}`);
    }
  }
  expect(problems, problems.join("\n")).toEqual([]);
});
