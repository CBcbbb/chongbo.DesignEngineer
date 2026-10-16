import { expect, test, type Page } from "@playwright/test";
import { withLegacy } from "../../src/lib/ask/schema";

type Captured = { event: string; properties: Record<string, unknown> };
type AnalyticsWindow = Window & {
  __events: Captured[];
  __analytics?: { on: (name: string, callback: (event: Captured) => void) => void; capture: (name: string) => unknown };
};
const events = (page: Page) => page.evaluate(() => (window as unknown as AnalyticsWindow).__events);
const matching = async (page: Page, name: string) => (await events(page)).filter(e => e.event === name);

// Opt in after building with a synthetic key (see README); ordinary keyless builds collect nothing.
test.skip(process.env.ANALYTICS_E2E !== "1", "Build with a fake PostHog key and set ANALYTICS_E2E=1");

test.use({
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
});
test.beforeEach(async ({ context, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Exercise the real SDK while ensuring all analytics requests stay local, regardless of the build's key.
  await context.route("**/ingest/**", route => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await context.route(/https?:\/\/(?!localhost:|127\.0\.0\.1:)/, route => route.abort());
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    Object.defineProperty(navigator, "userAgentData", { get: () => undefined });
    const w = window as unknown as AnalyticsWindow;
    w.__events = [];
    let instance: AnalyticsWindow["__analytics"];
    Object.defineProperty(window, "__analytics", {
      get: () => instance,
      set: value => {
        instance = value;
        instance!.on("eventCaptured", event => w.__events.push(event));
      }, configurable: true,
    });
  });
});
async function ready(page: Page) {
  await page.waitForFunction(() => Boolean((window as unknown as AnalyticsWindow).__analytics));
}

test("a submitted question links printed sheets, reading, case navigation, pageviews and contact", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const brief = "  Show me accessibility\nand keyboard work — 看看无障碍  ";
  let payload: unknown;
  await page.route("**/api/ask", route => {
    payload = route.request().postDataJSON();
    return route.fulfill({ json: withLegacy({
      asked: ["accessibility"], missing: [], source: "model", line: "Keyboard work.",
      sheets: [{ project: "hhcd-data-platform", section: "keyboard", signal: "accessibility", reason: "Keyboard work." }],
    }) });
  });
  await page.goto("/for/granola?utm_source=linkedin&utm_medium=message");
  await ready(page);
  await page.getByRole("button", { name: "Accessibility", exact: true }).click();
  await page.locator("#brief").fill(brief);
  expect(await matching(page, "request_submitted")).toHaveLength(0);
  await page.getByRole("button", { name: "Print", exact: true }).click();
  await expect(page.locator("#r-title")).toBeFocused();
  const submitted = (await matching(page, "request_submitted"))[0]!;
  expect(payload).toEqual({ brief, topics: ["accessibility"] });
  expect(submitted.properties).toMatchObject({
    brief, topics: ["accessibility"], selected_options: ["a11y"], skills: ["Accessibility"], company: "granola", ref: "granola",
    channel: "linkedin", utm_medium: "message", input_origin: "printer", request_id: expect.any(String),
  });
  await expect.poll(async () => (await matching(page, "printed")).length).toBe(1);
  expect((await matching(page, "printed"))[0]!.properties).toMatchObject({
    request_id: submitted.properties.request_id, cards: ["hhcd-data-platform#keyboard"], source: "model", ok: true,
  });
  await page.locator(".sheets .s-paper").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  await page.locator(".sheets .full").click();
  await expect(page).toHaveURL(/\/work\/hhcd-data-platform#keyboard$/);
  await expect.poll(async () => (await matching(page, "sheet_viewed")).length).toBeGreaterThan(0);
  await page.locator('[data-card="keyboard"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect.poll(async () => (await matching(page, "$pageview")).some(e => String(e.properties.$current_url).endsWith("/about"))).toBe(true);
  const aboutView = (await matching(page, "$pageview")).find(e => String(e.properties.$current_url).endsWith("/about"))!;
  expect(aboutView.properties).toMatchObject({ request_id: submitted.properties.request_id, company: "granola", channel: "linkedin" });
  // A contact click is measured without launching an email client or sending a message.
  await page.evaluate(() => document.addEventListener("click", e => {
    if ((e.target as Element)?.closest('a[href^="mailto:"]')) e.preventDefault();
  }));
  await page.locator('a[href^="mailto:"]').first().click();
  const captured = await events(page);
  for (const name of ["sheet_viewed", "read_in_context_clicked", "case_card_viewed", "contact_clicked"]) {
    const found = captured.filter(e => e.event === name);
    expect(found.length, name).toBeGreaterThan(0);
    for (const event of found) expect(event.properties).toMatchObject({
      request_id: submitted.properties.request_id, visit_id: submitted.properties.visit_id,
      company: "granola", channel: "linkedin",
    });
  }
  expect(captured.find(e => e.event === "sheet_viewed")!.properties.seconds).toBeGreaterThanOrEqual(1.5);
  expect(errors).toEqual([]);
});

test("ref=test suppresses the real SDK's automatic and custom events throughout navigation", async ({ page }) => {
  await page.goto("/for/granola?ref=test&utm_source=linkedin");
  await ready(page);
  await page.getByRole("button", { name: "Picked for Granola", exact: true }).click();
  await page.getByRole("button", { name: "Print", exact: true }).click();
  await expect(page.locator("#r-title")).toBeFocused();
  await page.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/\/work$/);
  const dropped = await page.evaluate(() => {
    const ph = (window as unknown as AnalyticsWindow).__analytics!;
    return [ph.capture("$pageview"), ph.capture("$pageleave"), ph.capture("qa_test_probe")].every(value => value == null);
  });
  expect(dropped).toBe(true);
  expect(await events(page)).toEqual([]);
});

test("a failed request keeps its question and the next print gets a new id", async ({ page }) => {
  await page.route("**/api/ask", route => route.fulfill({ status: 429, json: { message: "Rate limited" } }));
  await page.goto("/for/granola?utm_source=linkedin");
  await ready(page);
  await page.locator("#brief").fill("Synthetic request that hits the limit");
  await page.getByRole("button", { name: "Print", exact: true }).click();
  await expect.poll(async () => (await matching(page, "printed")).length).toBe(1);
  const failed = (await matching(page, "printed"))[0]!;
  const submitted = (await matching(page, "request_submitted"))[0]!;
  expect(failed.properties).toMatchObject({ request_id: submitted.properties.request_id, ok: false, error_kind: "limit" });
  await expect(page.locator(".machine")).not.toHaveAttribute("data-state", "busy");
  await page.getByRole("button", { name: "Picked for Granola", exact: true }).click();
  await page.getByRole("button", { name: "Print", exact: true }).click();
  await expect(page.locator("#r-title")).toBeFocused();
  const next = (await matching(page, "request_submitted"))[1]!;
  expect(next.properties.request_id).not.toBe(submitted.properties.request_id);
  expect(next.properties.brief).toBe("");
  expect((await matching(page, "printed"))[1]!.properties).toMatchObject({ request_id: next.properties.request_id, source: "curated", ok: true });
});

test("stopping a print records cancellation without claiming that cards printed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/for/granola?utm_source=linkedin");
  await ready(page);
  await page.getByRole("button", { name: "Picked for Granola", exact: true }).click();
  await page.getByRole("button", { name: "Print", exact: true }).click();
  await expect.poll(async () => (await matching(page, "request_submitted")).length).toBe(1);
  await page.locator("button.key").click();
  await expect.poll(async () => (await matching(page, "request_cancelled")).length).toBe(1);
  const submitted = (await matching(page, "request_submitted"))[0]!;
  expect((await matching(page, "request_cancelled"))[0]!.properties.request_id).toBe(submitted.properties.request_id);
  expect(await matching(page, "printed")).toHaveLength(0);
  expect(await matching(page, "sheet_viewed")).toHaveLength(0);
});


test("normal printer animation only starts visible-time measurement when sheets have emerged", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/for/granola?utm_source=linkedin");
  await ready(page);
  await page.getByRole("button", { name: "Picked for Granola", exact: true }).click();
  await page.getByRole("button", { name: "Print", exact: true }).click();
  await expect.poll(async () => (await matching(page, "printed")).length).toBe(1);
  expect(await matching(page, "sheet_viewed")).toHaveLength(0);
  await expect(page.locator("#r-title")).toBeFocused({ timeout: 15000 });
  await page.locator(".sheets .s-paper").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  await page.getByRole("link", { name: "About", exact: true }).click();
  await expect.poll(async () => (await matching(page, "sheet_viewed")).length).toBeGreaterThan(0);
  const printed = (await matching(page, "printed"))[0]!;
  for (const view of await matching(page, "sheet_viewed")) {
    expect(view.properties.request_id).toBe(printed.properties.request_id);
    expect(view.properties.seconds).toBeGreaterThanOrEqual(1.5);
  }
});
