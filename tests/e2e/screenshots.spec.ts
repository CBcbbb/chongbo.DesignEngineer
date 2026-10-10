import { test, type Page } from "@playwright/test";

const OUT = "docs/screenshots";
const SIZES = [
  { name: "1440", width: 1440, height: 1000 },
  { name: "390", width: 390, height: 844 },
];

async function ask(page: Page, q: string) {
  await page.fill("#q", q);
  await page.press("#q", "Enter");
  await page.locator("#ans-title").waitFor({ timeout: 10_000 });
  await page.waitForTimeout(2200); // let the print and stamp settle
}

for (const s of SIZES) {
  test(`screenshots at ${s.name}`, async ({ page }) => {
    await page.setViewportSize({ width: s.width, height: s.height });
    await page.goto("/");
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/home-${s.name}.png`, fullPage: true });
    await ask(page, "What matters most to us is accessibility");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${OUT}/home-asked-${s.name}.png`, fullPage: true });
    for (const slug of ["hhcd-data-platform", "component-store"]) {
      await page.goto(`/work/${slug}`);
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${OUT}/work-${slug}-${s.name}.png`, fullPage: true });
    }
    await page.goto("/about");
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/about-${s.name}.png`, fullPage: true });
  });
}

test("dark mode home", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "dark", viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto("/");
  await ask(page, "What matters most to us is accessibility");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${OUT}/home-asked-dark-1440.png`, fullPage: true });
  await context.close();
});
