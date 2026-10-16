import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { withLegacy } from "../../src/lib/ask/schema";

type Captured = { event: string; props: Record<string, unknown> };
type TestWindow = Window & { __testAnalyticsEvents: Captured[] };
const picked = [
  "/work/design-system#three-layers", "/work/design-system#figma-library", "/work/design-system#in-code",
  "/work/nike-athletes-closet#graphic-system", "/work/hhcd-data-platform#contrast",
];

test.beforeEach(async ({ context }) => {
  // Local verification must never add visits to the real analytics project.
  await context.route("**/ingest/**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
});

test("Granola arrives at the idle home printer, with one optional selection and noindex", async ({ page, request }) => {
  const response = await request.get("/for/granola", { maxRedirects: 0 });
  expect(response.status()).toBe(200);
  expect(response.headers()["x-robots-tag"]).toBe("noindex, follow");
  await page.goto("/for/granola?ref=test");
  await expect(page).toHaveURL(/\/for\/granola\?ref=test$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("What are you looking for?");
  await expect(page.locator(".machine")).toHaveAttribute("data-state", "idle");
  await expect(page.locator(".topic")).toHaveCount(8);
  await expect(page.locator(".topic").last()).toHaveAccessibleName("Picked for Granola");
  await expect(page.getByRole("button", { name: "Picked for Granola", exact: true })).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("button", { name: "Research", exact: true })).toHaveCount(0);
  await expect(page.locator(".sheets")).toHaveCount(0);
  const axe = await new AxeBuilder({ page: page as never }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(axe.violations).toEqual([]);
});

test("the optional selection prints exactly the five approved cards without asking the model", async ({ page }) => {
  const requests: string[] = [];
  const errors: string[] = [];
  page.on("request", (request) => { if (new URL(request.url()).pathname === "/api/ask") requests.push(request.url()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/for/granola?ref=test");
  await page.getByRole("button", { name: "Picked for Granola", exact: true }).click();
  await page.getByRole("button", { name: "Print", exact: true }).click();
  await expect(page.locator("#r-title")).toHaveText("Picked for Granola", { timeout: 10_000 });
  await expect(page.locator("#r-title")).toBeFocused();
  await expect(page.locator(".provenance")).toHaveText("Picked by me for Granola.");
  await expect(page.locator(".sheets .full")).toHaveCount(5);
  expect(await page.locator(".sheets .full").evaluateAll((links) => links.map((link) => link.getAttribute("href")))).toEqual(picked);
  expect(requests).toEqual([]);
  await page.getByRole("button", { name: "New request" }).click();
  await page.getByRole("button", { name: "Accessibility", exact: true }).click();
  await page.getByRole("button", { name: "Print", exact: true }).click();
  await expect(page.locator("#r-title")).toHaveText("Accessibility", { timeout: 10_000 });
  expect(requests).toHaveLength(1);
  await expect(page.locator(".sheets .full").first()).toHaveAttribute("href", "/work/hhcd-data-platform#dual-view");
  await page.locator(".sheets .full").first().click();
  await expect(page).toHaveURL(/\/work\/hhcd-data-platform#dual-view$/);
  expect(errors).toEqual([]);
});

test("typing exits the exclusive selection and can print model-selected work outside it", async ({ page }) => {
  // Controlled model response verifies client/API wiring without an external model call.
  const modelAnswer = withLegacy({
    asked: ["data-architecture"], missing: [], source: "model", line: "A shared data contract.",
    sheets: [{ project: "components-for-any-data", section: "contract", signal: "data-architecture", reason: "A shared data contract." }],
  });
  let payload: unknown;
  await page.route("**/api/ask", (route) => {
    payload = route.request().postDataJSON();
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(modelAnswer) });
  });
  await page.goto("/for/granola?ref=test");
  const custom = page.getByRole("button", { name: "Picked for Granola", exact: true });
  const skill = page.getByRole("button", { name: "Design systems", exact: true });
  await skill.click();
  await custom.click();
  await expect(skill).toHaveAttribute("aria-pressed", "false");
  await expect(custom).toHaveAttribute("aria-pressed", "true");
  await skill.click();
  await expect(custom).toHaveAttribute("aria-pressed", "false");
  await custom.click();
  const brief = "Show me the shared data contract in your component library";
  await page.locator("#brief").fill(brief);
  await expect(custom).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Print", exact: true }).click();
  await expect(page.locator(".sheets .full")).toHaveCount(1, { timeout: 10_000 });
  expect(payload).toEqual({ brief, topics: [] });
  await expect(page.locator(".provenance")).toContainText("Picked by AI");
  await expect(page.locator(".sheets .full")).toHaveAttribute("href", "/work/components-for-any-data#contract");
});

test("the ordinary homepage keeps its original options and unknown companies go there", async ({ page }) => {
  await page.goto("/for/not-configured");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".topic")).toHaveCount(8);
  await expect(page.getByRole("button", { name: "Research", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Picked for Granola", exact: true })).toHaveCount(0);
});

test("home controls return an application visitor to Granola across work and about pages", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/for/granola?ref=test");
  await expect(page.locator(".who")).toHaveAttribute("href", "/for/granola?ref=test");
  await page.locator(".who").click();
  await expect(page).toHaveURL(/\/for\/granola\?ref=test$/);
  await page.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.locator(".who")).toHaveAttribute("href", "/for/granola?ref=test");
  await page.locator('a[href="/work/nike-athletes-closet"]').first().click();
  await expect(page.locator(".who")).toHaveAttribute("href", "/for/granola?ref=test");
  await page.locator(".who").click();
  await expect(page).toHaveURL(/\/for\/granola\?ref=test$/);
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(page.locator(".who")).toHaveAttribute("href", "/for/granola?ref=test");
  await page.locator(".who").click();
  await expect(page).toHaveURL(/\/for\/granola\?ref=test$/);
  await expect(page.getByRole("button", { name: "Picked for Granola", exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("a fresh ordinary visit still returns to the ordinary homepage", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page.locator(".who")).toHaveAttribute("href", "/");
  await page.locator(".who").click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("button", { name: "Picked for Granola", exact: true })).toHaveCount(0);
});

test("shared ask results report their cards and visible time with a request id", async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as TestWindow;
    w.__testAnalyticsEvents = [];
    const analytics = { capture: (event: string, props: Record<string, unknown>) => w.__testAnalyticsEvents.push({ event, props }) };
    Object.defineProperty(window, "__analytics", { get: () => analytics, set: () => {}, configurable: true });
  });
  await page.goto("/ask?topics=brand-storytelling&ref=qa-local");
  await expect.poll(() => page.evaluate(() => (window as unknown as TestWindow).__testAnalyticsEvents.filter(e => e.event === "printed").length)).toBe(1);
  const first = page.locator(".sheet-list > .sheet").first();
  await first.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  await page.locator(".sheet-list > .sheet").last().scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => (window as unknown as TestWindow).__testAnalyticsEvents.some(e => e.event === "sheet_viewed" && e.props.card === "nike-athletes-closet#graphic-system" && Number(e.props.seconds) >= 1.5))).toBe(true);
  const events = await page.evaluate(() => (window as unknown as TestWindow).__testAnalyticsEvents);
  const printed = events.find(e => e.event === "printed")!;
  expect(printed.props.cards).toHaveLength(await page.locator(".sheet-list > .sheet").count());
  expect(printed.props.brief_chars).toBe(0);
  expect(printed.props.request_id).toEqual(expect.any(String));
  const opened = events.find(e => e.event === "request_opened")!;
  expect(opened.props).toMatchObject({ request_id: printed.props.request_id, brief: "", input_origin: "url" });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("the sharing crawler receives the company URL, title and image", async ({ page, request }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Chongbo Ning · Design Engineer, London");
    const siteUrl = new URL((await page.locator('meta[property="og:url"]').getAttribute("content"))!);
    expect(siteUrl.pathname).toBe("/");
    const companyUrl = new URL("/for/granola", siteUrl).href;
    const response = await request.get("/for/granola?ref=test", { headers: { "user-agent": "LinkedInBot/1.0" }, maxRedirects: 0 });
    expect(response.status()).toBe(200);
    await page.setContent(await response.text());
    await expect(page).toHaveTitle("Picked for Granola · Chongbo Ning");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", companyUrl);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", companyUrl);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Picked for Granola · Chongbo Ning");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const imageUrl = new URL((await page.locator('meta[property="og:image"]').getAttribute("content"))!);
    expect(imageUrl.pathname).toMatch(/^\/for\/granola\/opengraph-image/);
    const image = await request.get(imageUrl.pathname);
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toBe("image/png");
    const png = await image.body();
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });

  test("the company page keeps the home printer's native text form", async ({ page }) => {
    await page.goto("/for/granola?ref=test");
    await expect(page.locator(".machine")).toBeVisible();
    await page.locator("#brief").fill("accessibility");
    await page.getByRole("button", { name: "Print", exact: true }).click();
    await expect(page).toHaveURL(/\/ask\?brief=accessibility/);
    await expect(page.locator(".sheet-list .full").first()).toHaveAttribute("href", "/work/hhcd-data-platform#keyboard");
  });
});
