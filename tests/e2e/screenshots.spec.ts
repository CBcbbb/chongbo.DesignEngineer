import { test, type Page } from "@playwright/test";

const OUT = "docs/screenshots";
const SIZES = [
  { name: "1440", width: 1440, height: 1000 },
  { name: "390", width: 390, height: 844 },
];

async function projectAccessibility(page: Page) {
  await page
    .getByRole("button", { name: "What matters most to us is accessibility.", exact: true })
    .click({ position: { x: 48, y: 16 } });
  await page.waitForTimeout(1200); // the card flies into the magazine
  await page.getByRole("button", { name: "Project", exact: true }).click();
  await page.locator("#r-title").waitFor({ timeout: 10_000 });
  await page.waitForTimeout(1200); // the room goes dark and the slide comes on
}

for (const s of SIZES) {
  test(`screenshots at ${s.name}`, async ({ page }) => {
    await page.setViewportSize({ width: s.width, height: s.height });
    await page.goto("/");
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/home-idle-${s.name}.png`, fullPage: true });
    await projectAccessibility(page);
    await page.screenshot({ path: `${OUT}/home-accessibility-${s.name}.png`, fullPage: true });
    await page.locator(".pj-area").screenshot({ path: `${OUT}/slides-${s.name}.png` });
    await page.goto("/work/hhcd-data-platform#dual-view");
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/case-rail-${s.name}.png` });
    await page.goto("/about");
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/about-${s.name}.png`, fullPage: true });
  });
}

test("dark mode home after projecting", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "dark", viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto("/");
  await projectAccessibility(page);
  await page.screenshot({ path: `${OUT}/home-accessibility-dark-1440.png`, fullPage: true });
  await context.close();
});
