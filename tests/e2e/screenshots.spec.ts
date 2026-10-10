import { test, type Page } from "@playwright/test";

const OUT = "docs/screenshots";
const SIZES = [
  { name: "1440", width: 1440, height: 1000 },
  { name: "390", width: 390, height: 844 },
];

async function printAccessibility(page: Page) {
  await page.getByRole("button", { name: "Accessibility", exact: true }).click();
  await page.getByRole("button", { name: "Print" }).click();
  await page.locator("#r-title").waitFor({ timeout: 10_000 });
  await page.waitForTimeout(1200); // let the deck deal
}

for (const s of SIZES) {
  test(`screenshots at ${s.name}`, async ({ page }) => {
    await page.setViewportSize({ width: s.width, height: s.height });
    await page.goto("/");
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/home-idle-${s.name}.png`, fullPage: true });
    await printAccessibility(page);
    await page.screenshot({ path: `${OUT}/home-accessibility-${s.name}.png`, fullPage: true });
    await page.getByRole("button", { name: "Next sheet" }).click();
    await page.waitForTimeout(700);
    await page.locator(".results").screenshot({ path: `${OUT}/deck-next-${s.name}.png` });
    await page.goto("/work/hhcd-data-platform#dual-view");
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/case-rail-${s.name}.png` });
    await page.goto("/about");
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/about-${s.name}.png`, fullPage: true });
  });
}

test("dark mode home after printing", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "dark", viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto("/");
  await printAccessibility(page);
  await page.screenshot({ path: `${OUT}/home-accessibility-dark-1440.png`, fullPage: true });
  await context.close();
});
