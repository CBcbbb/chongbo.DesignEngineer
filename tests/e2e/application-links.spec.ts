import { expect, test } from "@playwright/test";

type Captured = { event: string; props: Record<string, unknown> };
type TestWindow = Window & { __testAnalyticsEvents: Captured[] };

test.beforeEach(async ({ context }) => {
  // Local verification must never add visits to the real analytics project.
  await context.route("**/ingest/**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
});

test("Granola's link redirects, prints a brand-led selection, and remains noindex", async ({ page, request }) => {
  const redirect = await request.get("/for/granola", { maxRedirects: 0 });
  expect(redirect.status()).toBe(307);
  expect(redirect.headers()["x-robots-tag"]).toBe("noindex, follow");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/for/granola?ref=test");
  expect(new URL(page.url()).searchParams.get("ref")).toBe("test");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator(".sheet-list > .sheet")).toHaveCount(6);
  await expect(page.locator(".sheet-list > .sheet").first()).toHaveAttribute("data-sheet", "nike-athletes-closet#graphic-system");
  await expect(page.locator(".missing")).toHaveCount(0);
  await page.locator(".sheet-list .full").first().click();
  await expect(page).toHaveURL(/\/work\/nike-athletes-closet#graphic-system$/);
  expect(errors).toEqual([]);
});

test("unknown company links go home", async ({ page }) => {
  await page.goto("/for/not-configured");
  await expect(page).toHaveURL(/\/$/);
});

test("shared results report their cards and visible time without brief text", async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as TestWindow;
    w.__testAnalyticsEvents = [];
    const analytics = { capture: (event: string, props: Record<string, unknown>) => w.__testAnalyticsEvents.push({ event, props }) };
    Object.defineProperty(window, "__analytics", { get: () => analytics, set: () => {}, configurable: true });
  });
  await page.goto("/for/granola?ref=test");
  await expect.poll(() => page.evaluate(() => (window as unknown as TestWindow).__testAnalyticsEvents.filter(e => e.event === "printed").length)).toBe(1);
  const first = page.locator(".sheet-list > .sheet").first();
  await first.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  await page.locator(".sheet-list > .sheet").last().scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => (window as unknown as TestWindow).__testAnalyticsEvents.some(e => e.event === "sheet_viewed" && e.props.card === "nike-athletes-closet#graphic-system" && Number(e.props.seconds) >= 1.5))).toBe(true);
  const events = await page.evaluate(() => (window as unknown as TestWindow).__testAnalyticsEvents);
  const printed = events.find(e => e.event === "printed")!;
  expect(printed.props.cards).toHaveLength(6);
  expect(printed.props.brief_chars).toBe(0);
  expect(printed.props).not.toHaveProperty("brief");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("the company link still prints its selection", async ({ page }) => {
    await page.goto("/for/granola?ref=test");
    await expect(page.locator(".sheet-list > .sheet")).toHaveCount(6);
    await expect(page.locator(".sheet-list .full").first()).toHaveAttribute("href", "/work/nike-athletes-closet#graphic-system");
  });
});
