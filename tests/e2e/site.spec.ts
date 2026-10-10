import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { projects } from "../../content";

const ROUTES = ["/", "/ask?q=accessibility", "/about", ...projects.map((p) => `/work/${p.slug}`)];

async function axe(page: Page) {
  const results = await new AxeBuilder({ page: page as never })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    .analyze();
  const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
  expect(summary, summary.join("\n")).toEqual([]);
}

test.describe("accessibility", () => {
  for (const route of ROUTES) {
    test(`axe: ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main")).toHaveCount(1);
      await axe(page);
    });
  }

  test("axe after asking (fallback answer printed)", async ({ page }) => {
    await page.goto("/");
    await page.fill("#q", "What matters most to us is accessibility");
    await page.press("#q", "Enter");
    await expect(page.locator("#ans-title")).toBeVisible({ timeout: 10_000 });
    await page.waitForTimeout(400);
    await axe(page);
  });
});

test.describe("ask flow", () => {
  test("prints an answer, focuses it and announces the reply", async ({ page }) => {
    await page.goto("/");
    await page.fill("#q", "What matters most to us is accessibility");
    await page.press("#q", "Enter");
    const title = page.locator("#ans-title");
    await expect(title).toHaveText("A table view beside the graph", { timeout: 10_000 });
    await expect(page.locator(".stamp")).toContainText("Accessibility");
    await expect(page.locator("#ticket")).toBeFocused();
    await expect(page.getByRole("status")).toContainText("projects show accessibility");
    await expect(page.getByRole("link", { name: /Open the case file/ })).toHaveAttribute(
      "href",
      "/work/hhcd-data-platform#dual-view",
    );
    // Tear off and ask again
    await page.getByRole("button", { name: "Tear off and ask again" }).click();
    await expect(page.locator("#ticket")).toHaveCount(0);
    await expect(page.locator("#q")).toBeFocused();
  });

  test("keyboard only: tab to the machine, ask, open the case file", async ({ page }) => {
    await page.goto("/");
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      if (await page.locator("#q").evaluate((el) => el === document.activeElement)) break;
    }
    await expect(page.locator("#q")).toBeFocused();
    await page.keyboard.type("Have you built a design system?");
    await page.keyboard.press("Enter");
    await expect(page.locator("#ticket")).toBeFocused({ timeout: 10_000 });
    await expect(page.locator("#ans-title")).toBeVisible();
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toHaveText(/Open the case file/);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/work\/component-store#/);
    await expect(page.locator("h1")).toHaveText("Component Store");
  });

  test("suggestion chips print immediately; Escape clears the input", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "AI tools" }).click();
    await expect(page.locator("#ans-title")).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/\/$/);
    await page.locator("#q").focus();
    await page.keyboard.press("Escape");
    await expect(page.locator("#q")).toHaveValue("");
  });

  test("rate limited: a friendly error ticket is printed", async ({ page }) => {
    await page.route("**/api/ask", (route) =>
      route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ error: "rate_limited", message: "Slow down.", retryAfter: 30 }),
      }),
    );
    await page.goto("/");
    await page.fill("#q", "accessibility");
    await page.press("#q", "Enter");
    await expect(page.locator(".ticket-error")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("status")).toContainText("cool down");
  });

  test("reduced motion: the answer appears without the print animation", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await page.fill("#q", "accessibility");
    const t0 = Date.now();
    await page.press("#q", "Enter");
    await expect(page.locator("#ans-title")).toBeVisible({ timeout: 5_000 });
    expect(Date.now() - t0).toBeLessThan(2_000);
    const transition = await page.locator(".feed:not(.falling)").evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(parseFloat(transition)).toBeLessThan(0.05);
    await context.close();
  });
});

test.describe("without JavaScript", () => {
  test("the form GETs /ask and prints a server-rendered ticket", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await page.fill("#q", "accessibility");
    await page.press("#q", "Enter");
    await expect(page).toHaveURL(/\/ask\?q=accessibility/);
    await expect(page.locator("#ans-title")).toHaveText("A table view beside the graph");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    // Suggestion links also work without JS
    await page.goto("/");
    await page.getByRole("link", { name: "Design systems" }).click();
    await expect(page).toHaveURL(/\/ask\?q=/);
    await expect(page.locator("#ans-title")).toBeVisible();
    await context.close();
  });
});

test.describe("layout", () => {
  for (const route of ROUTES) {
    test(`no horizontal scroll at 320px: ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 720 });
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("case files deep-link to section anchors", async ({ page }) => {
    await page.goto("/work/hhcd-data-platform#dual-view");
    await expect(page.locator("section#dual-view h2")).toHaveText("A table view beside the graph");
    await expect(page.locator("section#dual-view .meta").first()).toHaveText(/Decision 02/);
  });

  test("interactive targets (outside running text) are at least 44px tall", async ({ page }) => {
    await page.goto("/");
    const small = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("main a, main button, header a, main input")]
        // Inline links inside running text are exempt (WCAG 2.5.8).
        .filter((el) => el.offsetParent !== null && !el.closest("p"))
        .map((el) => ({ el: el.textContent?.trim() || el.id, h: el.getBoundingClientRect().height }))
        .filter((x) => x.h < 44),
    );
    expect(small).toEqual([]);
  });
});
