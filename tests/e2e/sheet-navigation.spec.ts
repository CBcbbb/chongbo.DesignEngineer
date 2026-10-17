import { expect, test } from "@playwright/test";

test("the sheet counter follows paging on a wide, centred layout", async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 0) <= 1000, "only horizontal strips have a counter");
  await page.setViewportSize({ width: 2560, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Data", exact: true }).click();
  await page.getByRole("button", { name: "Print", exact: true }).click();
  await expect(page.locator("#r-title")).toBeFocused();
  const strip = page.locator(".sheets");
  const step = await strip.evaluate(el => el.children[1]!.getBoundingClientRect().left - el.children[0]!.getBoundingClientRect().left);
  const box = (await strip.boundingBox())!;
  await page.mouse.move(box.x + 40, box.y + 20);
  await page.mouse.wheel(step, 0);
  // Engines apply different momentum to a wheel gesture. Whichever sheet it lands on, the counter must agree.
  await expect.poll(() => strip.evaluate(el => {
    const left = el.getBoundingClientRect().left;
    const current = [...el.children].findIndex(sheet => Math.abs(sheet.getBoundingClientRect().left - left) < 2);
    const counter = Number(document.querySelector(".deckbar span")?.textContent?.split("/")[0]);
    return current > 0 && counter === current + 1;
  })).toBe(true);
});

test("arrow keys within an interactive card do not turn the printed sheet", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Research", exact: true }).click();
  await page.getByRole("button", { name: "Print", exact: true }).click();
  await expect(page.locator("#r-title")).toBeFocused();
  const hand = page.locator(".sheets").getByRole("radiogroup").first();
  await hand.scrollIntoViewIfNeeded();
  const radios = hand.getByRole("radio");
  const selected = hand.getByRole("radio", { checked: true });
  await selected.focus();
  const before = await selected.textContent();
  const scroll = await page.locator(".sheets").evaluate(el => el.scrollLeft);
  await page.keyboard.press("ArrowRight");
  await expect(selected).not.toHaveText(before!);
  await expect(selected).toBeFocused();
  // Let an unintended outer-strip scroll finish before checking it stayed put.
  await page.waitForTimeout(250);
  expect(await page.locator(".sheets").evaluate(el => el.scrollLeft)).toBe(scroll);
  expect(await radios.count()).toBeGreaterThan(1);
});
