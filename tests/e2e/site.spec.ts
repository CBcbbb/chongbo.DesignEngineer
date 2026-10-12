import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { projects } from "../../content";

const ROUTES = ["/", "/ask?topics=accessibility", "/work", "/about", ...projects.map((p) => `/work/${p.slug}`)];

async function axe(page: Page) {
  const results = await new AxeBuilder({ page: page as never })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    .analyze();
  const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
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
    await page.waitForTimeout(300);
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
    const slide = page.locator(".pj-slide[data-current]");
    await expect(slide).toHaveCount(1);
    await expect(slide).toContainText("Accessibility – keyboard navigation");
    await expect(slide.locator(".pj-full")).toHaveAttribute("href", "/work/hhcd-data-platform#keyboard");
    await expect(page.locator(".pj-quote")).toContainText(A11Y);
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

  test("one card at a time: loading another puts the first back in the hand", async ({ page }) => {
    await page.goto("/");
    const first = page.getByRole("button", { name: A11Y, exact: true });
    const second = page.getByRole("button", { name: "Show me brand or marketing work.", exact: true });
    await pickCard(page, A11Y);
    await expect(first).toHaveAttribute("aria-pressed", "true");
    await page.waitForTimeout(1200); // the card lands
    await pickCard(page, "Show me brand or marketing work.");
    await expect(second).toHaveAttribute("aria-pressed", "true");
    await expect(first).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator(".pj-slotcard")).toContainText("Show me brand or marketing work.", { timeout: 5_000 });
    // Writing on the blank card takes the printed one out.
    await page.fill("#brief", "motion");
    await expect(second).toHaveAttribute("aria-pressed", "false");
  });

  test("keyboard only: write on the blank card, Enter, the answer is focused, Tab reaches the slide's link", async ({ page }) => {
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
    await expect(page.locator(":focus")).toHaveText(/Full project/);
    const href = await page.locator(":focus").getAttribute("href");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${href!.replace(/[#/]/g, "\\$&")}$`));
    // Each case-file layout marks the part the link landed on (the parts rail, or Nike's section list).
    await expect(page.locator('a[aria-current="step"]')).toHaveCount(1);
  });

  test("arrow keys move along the slides; Escape brings the lights up", async ({ page }) => {
    await page.goto("/");
    await projectCard(page, "Show me something you built end to end.");
    await expect(page.locator(".pj-count")).toHaveText("01 / 03");
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(".pj-count")).toHaveText("02 / 03");
    await expect(page.getByRole("status")).toContainText("Slide 2 of 3");
    // The slides that aren't lit are out of reach.
    await expect(page.locator(".pj-slide:not([data-current])").first()).toHaveAttribute("aria-hidden", "true");
    await page.waitForTimeout(500);
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator(".pj-count")).toHaveText("01 / 03");
    await page.waitForTimeout(500);
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

  test("every slide is readable in full, with a link to its place in the case file", async ({ page }) => {
    await page.goto("/");
    await projectCard(page, "Show me something you built end to end.");
    const n = await page.locator(".pj-slide").count();
    expect(n).toBeGreaterThan(1);
    for (let i = 0; i < n; i++) {
      const slide = page.locator(".pj-slide[data-current]");
      await expect(slide.locator(".pj-slide-title")).toBeVisible();
      await expect(slide.locator(".pj-full")).toHaveAttribute("href", /^\/work\/[a-z-]+#[a-z-]+$/);
      if (i < n - 1) {
        await page.getByRole("button", { name: "Next slide" }).click();
        await expect(page.locator(".pj-count")).toHaveText(new RegExp(`^0${i + 2} /`));
        await page.waitForTimeout(450);
      }
    }
    await expect(page.getByRole("button", { name: "Next slide" })).toBeDisabled();
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
