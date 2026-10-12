import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { projects } from "../../content";

const ROUTES = ["/", "/ask?topics=accessibility", "/work", "/about", ...projects.map((p) => `/work/${p.slug}`)];

async function axe(page: Page) {
  const results = await new AxeBuilder({ page: page as never })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    .analyze();
  const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => `${n.target.join(" ")} (${n.failureSummary ?? ""})`).join(", ")}`);
  expect(summary, summary.join("\n")).toEqual([]);
}

const A11Y = "What matters most to us is accessibility.";

/** Cards overlap in the hand, so click the strip that shows, as a person would. */
async function pickCard(page: Page, question: string) {
  await page.getByRole("button", { name: question, exact: true }).click({ position: { x: 48, y: 16 } });
}

async function projectCard(page: Page, question = A11Y) {
  await pickCard(page, question);
  await page.getByRole("button", { name: "Project", exact: true }).click();
  // Focus moves to the answer once the slide is lit.
  await expect(page.locator("#r-title")).toBeFocused({ timeout: 10_000 });
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

  test("axe in the dark room, after projecting", async ({ page }) => {
    await page.goto("/");
    await projectCard(page);
    // the answer and the controls rise in over about a second; check them once they are all in
    await page.waitForTimeout(1300);
    await axe(page);
  });
});

test.describe("the projector", () => {
  test("a card goes in, the work is projected one slide per project, the answer is focused and announced", async ({ page }) => {
    await page.goto("/");
    const card = page.getByRole("button", { name: A11Y, exact: true });
    await pickCard(page, A11Y);
    await expect(card).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".pj-machine")).toHaveAttribute("data-lamp", "ready");
    await page.getByRole("button", { name: "Project", exact: true }).click();
    const title = page.locator("#r-title");
    await expect(title).toHaveText("One project shows accessibility.", { timeout: 10_000 });
    await expect(title).toBeFocused();
    await expect(page.getByRole("status")).toContainText("One project shows accessibility.");
    await expect(page.locator("html")).toHaveAttribute("data-room", "dark");
    const story = page.locator(".pj-story[data-current]");
    await expect(story).toHaveCount(1);
    await expect(story).toContainText("Accessibility – keyboard navigation");
    await expect(page.locator(".pj-quote")).toContainText(A11Y);
    // The card in the light opens as the full slide, with the way to its place in the case file.
    await story.click();
    const open = page.locator(".pj-open");
    await expect(open).toBeVisible();
    await expect(open.locator("#pj-open-title")).toBeFocused();
    await expect(open.locator(".pj-full")).toHaveAttribute("href", "/work/hhcd-data-platform#keyboard");
    await page.getByRole("button", { name: "Back to the selection" }).click();
    await expect(open).toHaveCount(0);
    await expect(story).toBeFocused();
    // Change the card: the lights come up and the card comes back to the hand.
    await page.getByRole("button", { name: "Change the card" }).click();
    await expect(page.locator("#r-title")).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveAttribute("data-room", "dark");
    await expect(card).toBeFocused({ timeout: 5_000 });
    await expect(card).toHaveAttribute("aria-pressed", "false");
  });

  test("sends the card's text as the brief, and nothing else", async ({ page }) => {
    await page.goto("/");
    const req = page.waitForRequest("**/api/ask");
    await projectCard(page, "Have you built a design system?");
    expect((await req).postDataJSON()).toEqual({ brief: "Have you built a design system?" });
  });

  test("the magazine holds three cards: another queues behind, pressing one in takes it out, a fourth is refused", async ({ page }) => {
    await page.goto("/");
    const qs = [A11Y, "Have you built a design system?", "Show me brand or marketing work.", "Show me something you built end to end."];
    const card = (q: string) => page.getByRole("button", { name: q, exact: true });
    for (const q of qs.slice(0, 3)) {
      await pickCard(page, q);
      await expect(card(q)).toHaveAttribute("aria-pressed", "true");
      await page.waitForTimeout(1200); // the card lands
    }
    await expect(page.locator(".pj-slotcard")).toHaveCount(3);
    await expect(page.locator(".pj-status")).toHaveText("3 cards in. Ready to project");
    // A fourth doesn't go in.
    await pickCard(page, qs[3]!);
    await expect(page.locator(".pj-status")).toHaveText("The magazine holds three cards. Take one out first.");
    await expect(card(qs[3]!)).toHaveAttribute("aria-pressed", "false");
    // Pressing a card that is in takes it back out; the others stay.
    await card(qs[1]!).click({ position: { x: 48, y: 16 } });
    await expect(card(qs[1]!)).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator(".pj-slotcard")).toHaveCount(2, { timeout: 5_000 });
    await expect(card(A11Y)).toHaveAttribute("aria-pressed", "true");
  });

  test("two cards: one request each, the wall shows each card's answer in turn", async ({ page }) => {
    await page.goto("/");
    const briefs: unknown[] = [];
    page.on("request", (r) => {
      if (r.url().endsWith("/api/ask")) briefs.push(r.postDataJSON());
    });
    await pickCard(page, A11Y);
    await page.waitForTimeout(1200);
    await pickCard(page, "Show me brand or marketing work.");
    await page.waitForTimeout(1200);
    await page.getByRole("button", { name: "Project", exact: true }).click();
    await expect(page.locator("#r-title")).toBeFocused({ timeout: 10_000 });
    expect(briefs).toEqual([{ brief: A11Y }, { brief: "Show me brand or marketing work." }]);
    await expect(page.locator(".pj-eyebrow")).toHaveText(/^Card 1 of 2/);
    await expect(page.locator("#r-title")).toHaveText("One project shows accessibility.");
    const n = await page.locator(".pj-story").count();
    for (let i = 1; i < n; i++) await page.keyboard.press("ArrowRight");
    await expect(page.locator(".pj-eyebrow")).toHaveText(/^Card 2 of 2/);
    await expect(page.getByRole("status")).toContainText("Card 2:");
    // Change the card: both come back to the hand.
    await page.getByRole("button", { name: "Change the card" }).click();
    await expect(page.getByRole("button", { name: A11Y, exact: true })).toHaveAttribute("aria-pressed", "false", { timeout: 5_000 });
    await expect(page.getByRole("button", { name: "Show me brand or marketing work.", exact: true })).toHaveAttribute("aria-pressed", "false");
  });

  test("keyboard only: write on the blank card, Enter, the answer is focused, Enter opens the story, Tab reaches its link", async ({ page }) => {
    await page.goto("/");
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("Tab");
      if (await page.locator("#brief").evaluate((el) => el === document.activeElement)) break;
    }
    await expect(page.locator("#brief")).toBeFocused();
    await page.keyboard.type("Someone to own our design system across web and mobile");
    await page.keyboard.press("Shift+Enter");
    await expect(page.locator("#brief")).toHaveValue(/mobile\n$/);
    await page.keyboard.press("Enter");
    await expect(page.locator("#r-title")).toBeFocused({ timeout: 10_000 });
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveClass(/pj-story/);
    await page.keyboard.press("Enter");
    await expect(page.locator("#pj-open-title")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveText(/Open full project/);
    const href = await page.locator(":focus").getAttribute("href");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${href!.replace(/[#/]/g, "\\$&")}$`));
    // Each case-file layout marks the part the link landed on (the parts rail, or Nike's section list).
    await expect(page.locator('a[aria-current="step"]')).toHaveCount(1);
  });

  test("arrow keys turn the row of stories; Escape closes a story, then brings the lights up", async ({ page }) => {
    await page.goto("/");
    await projectCard(page, "Show me something you built end to end.");
    const current = page.locator(".pj-story[data-current]");
    await expect(page.locator(".pj-count")).toHaveText("3 stories");
    await expect(current).toHaveAttribute("aria-label", /^1 of 3/);
    await page.keyboard.press("ArrowRight");
    await expect(current).toHaveAttribute("aria-label", /^2 of 3/);
    await expect(page.getByRole("status")).toContainText("Story 2 of 3");
    // Only the card in the light is in the tab order.
    await expect(page.locator(".pj-story:not([data-current])").first()).toHaveAttribute("tabindex", "-1");
    await page.keyboard.press("ArrowLeft");
    await expect(current).toHaveAttribute("aria-label", /^1 of 3/);
    await current.click();
    await expect(page.locator(".pj-open")).toBeVisible();
    await page.waitForTimeout(800);
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(".pj-open .pj-slide-top")).toContainText("02 / 03");
    await page.waitForTimeout(500);
    await page.keyboard.press("Escape");
    await expect(page.locator(".pj-open")).toHaveCount(0);
    await page.waitForTimeout(300);
    await page.keyboard.press("Escape");
    await expect(page.locator("#r-title")).toHaveCount(0);
  });

  test("Escape clears the blank card; Project with no card focuses it", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Project", exact: true }).click();
    await expect(page.locator("#brief")).toBeFocused();
    await page.keyboard.type("motion");
    await page.keyboard.press("Escape");
    await expect(page.locator("#brief")).toHaveValue("");
    await expect(page.locator("#r-title")).toHaveCount(0);
  });

  test("every story opens in full, with a link to its place in the case file", async ({ page }) => {
    await page.goto("/");
    await projectCard(page, "Show me something you built end to end.");
    const n = await page.locator(".pj-story").count();
    expect(n).toBeGreaterThan(1);
    await page.locator(".pj-story[data-current]").click();
    for (let i = 0; i < n; i++) {
      const open = page.locator(".pj-open");
      await expect(open.locator(".pj-slide-title")).toBeVisible();
      await expect(open.locator(".pj-slide-top")).toContainText(`0${i + 1} / 0${n}`);
      await expect(open.locator(".pj-full")).toHaveAttribute("href", /^\/work\/[a-z-]+#[a-z-]+$/);
      if (i < n - 1) {
        await page.getByRole("button", { name: /^Next story/ }).first().click();
        await page.waitForTimeout(600);
      }
    }
    await expect(page.locator(".pj-open .pj-next")).toHaveCount(0);
  });

  test("missing capabilities are named", async ({ page }) => {
    await page.goto("/");
    await page.fill("#brief", "We need native iOS apps in Swift with an accessible design system");
    await page.press("#brief", "Enter");
    await expect(page.locator(".pj-missing")).toHaveText(/^No work to show yet for .*Swift/, { timeout: 10_000 });
  });

  test("rate limited: the machine says so, and the room stays light", async ({ page }) => {
    await page.route("**/api/ask", (route) =>
      route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ error: "rate_limited", message: "Slow down.", retryAfter: 30 }),
      }),
    );
    await page.goto("/");
    await page.fill("#brief", "accessibility");
    await page.press("#brief", "Enter");
    await expect(page.getByRole("status")).toContainText("cool down", { timeout: 10_000 });
    await expect(page.locator(".pj-status")).toContainText("cool down");
    await expect(page.locator(".pj-machine")).toHaveAttribute("data-lamp", "fault");
    await expect(page.locator("#r-title")).toHaveCount(0);
  });

  test("reduced motion: the answer is projected at once; the room still goes dark", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await page.fill("#brief", "accessibility");
    const t0 = Date.now();
    await page.press("#brief", "Enter");
    await expect(page.locator("#r-title")).toBeVisible({ timeout: 5_000 });
    expect(Date.now() - t0).toBeLessThan(1_500);
    await expect(page.locator("html")).toHaveAttribute("data-room", "dark");
    const animations = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
    expect(animations).toBe(0);
    await context.close();
  });
});

test.describe("without JavaScript", () => {
  test("a card, or the blank one, GETs /ask and lists the slides", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await page.fill("#brief", "accessibility");
    await page.getByRole("button", { name: "Project", exact: true }).click();
    await expect(page).toHaveURL(/\/ask\?brief=accessibility/);
    await expect(page.locator("h1")).toHaveText(/Accessibility/);
    await expect(page.locator(".sheet-list .sheet").first()).toContainText("Accessibility – keyboard navigation");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await page.goto("/");
    await pickCard(page, "Have you built a design system?");
    await expect(page).toHaveURL(/\/ask\?brief=Have\+you\+built\+a\+design\+system/);
    await expect(page.locator(".sheet-list .sheet").first()).toBeVisible();
    await page.goto("/ask?topics=accessibility");
    await expect(page.locator("h1")).toHaveText("Accessibility");
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
    await expect(page.locator("section#dual-view h3")).toHaveText(/A table view beside the network/);
    await expect(page.locator("section#dual-view")).toHaveClass(/is-current/);
    const cardLink = page.locator('.cf-toc a[href="#arrangements"]');
    if (await cardLink.isVisible()) {
      await expect(page.locator('.cf-toc a[aria-current="step"]')).toHaveText("Table view");
      await cardLink.click();
      await expect(page.locator('.cf-toc a[aria-current="step"]')).toHaveText("Two arrangements");
    } else {
      // Narrow screens: the contents is a strip of parts.
      await page.locator('.cf-toc a[href="#hhcd"]').click();
      await expect(page.locator('.cf-toc-part[data-active="true"] > a')).toContainText("Helen Hamlyn Centre");
      await page.goto("/work/hhcd-data-platform#arrangements");
    }
    await expect(page.locator("section#arrangements")).toHaveClass(/is-current/);
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
