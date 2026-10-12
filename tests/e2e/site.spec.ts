import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { projects } from "../../content";

const ROUTES = ["/", "/ask?topics=accessibility", "/work", "/about", ...projects.map((p) => `/work/${p.slug}`)];

async function axe(page: Page) {
  // Sheets deal in with a fade; mid-fade, axe blends text with the page and reports contrast that isn't there.
  // A cancelled animation rejects `finished`; it's over all the same.
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => undefined)),
    ),
  );
  const results = await new AxeBuilder({ page: page as never })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    .analyze();
  const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
  expect(summary, summary.join("\n")).toEqual([]);
}

async function printAccessibility(page: Page) {
  await page.getByRole("button", { name: "Accessibility", exact: true }).click();
  await page.getByRole("button", { name: "Print" }).click();
  await expect(page.locator("#r-title")).toBeVisible({ timeout: 10_000 });
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

  test("axe after printing (Accessibility card)", async ({ page }) => {
    await page.goto("/");
    await printAccessibility(page);
    await page.waitForTimeout(900);
    await axe(page);
  });
});

test.describe("printing", () => {
  test("a skills card prints the best cards across projects, focuses and announces the title", async ({ page }) => {
    await page.goto("/");
    const card = page.getByRole("button", { name: "Accessibility", exact: true });
    await card.click();
    await expect(card).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "Remove Accessibility" })).toBeVisible();
    await page.getByRole("button", { name: "Print" }).click();
    const title = page.locator("#r-title");
    await expect(title).toHaveText("Accessibility", { timeout: 10_000 });
    await expect(title).toBeFocused();
    await expect(page.getByRole("status")).toHaveText(await title.innerText());
    await expect(page.locator(".sheets .sheet").first()).toContainText("A dual view: the network and a list");
    await expect(page.locator(".sheets .sheet").first().locator(".full")).toHaveAttribute("href", "/work/hhcd-data-platform#dual-view");
    // Several HHCD cards print; all from one project, so the counter alone numbers them.
    const sheets = page.locator(".sheets .sheet");
    const n = await sheets.count();
    expect(n).toBeGreaterThan(1);
    expect(n).toBeLessThanOrEqual(6);
    await expect(page.locator(".sheets .s-run")).toHaveCount(0);
    await expect(page.locator(".deckbar span")).toHaveText(`01 / 0${n}`);
    // The cards reset after printing.
    await expect(card).toHaveAttribute("aria-pressed", "false");
    await page.getByRole("button", { name: "New request" }).click();
    await expect(page.locator("#r-title")).toHaveCount(0);
    await expect(page.locator("#brief")).toBeFocused();
  });

  test("sends the cards as signal keys the API accepts", async ({ page }) => {
    await page.goto("/");
    const req = page.waitForRequest("**/api/ask");
    await page.getByRole("button", { name: "Design systems", exact: true }).click();
    await page.getByRole("button", { name: "Print" }).click();
    expect((await req).postDataJSON()).toEqual({ brief: "", topics: ["design-systems", "cross-platform"] });
    await expect(page.locator("#r-title")).toHaveText("Design systems", { timeout: 10_000 });
  });

  test("cards from one project in a mixed print read as a group", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Design systems", exact: true }).click();
    await page.getByRole("button", { name: "Print" }).click();
    await expect(page.locator("#r-title")).toHaveText("Design systems", { timeout: 10_000 });
    const runs = page.locator(".sheets .s-run");
    expect(await runs.count()).toBeGreaterThan(1);
    await expect(runs.first()).toHaveText(/· 1 of \d$/);
  });

  test("keyboard only: type on the paper, Enter, results title focused, Tab reaches the first sheet's link", async ({ page }) => {
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
    await expect(page.locator("#r-title")).toHaveText(/Design systems/);
    // Tab reaches the strip of sheets, then the first sheet's link.
    await page.keyboard.press("Tab");
    await expect(page.locator(".sheets")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveText(/Read it in context/);
    const href = await page.locator(":focus").getAttribute("href");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${href!.replace(/[#/]/g, "\\$&")}$`));
    // Each case-file layout marks the part the link landed on (the parts rail, or Nike's section list).
    await expect(page.locator('a[aria-current="step"]')).toHaveCount(1);
  });

  test("Escape clears the paper; Print with nothing focuses the paper", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Print" }).click();
    await expect(page.locator("#brief")).toBeFocused();
    await page.keyboard.type("motion");
    await page.keyboard.press("Escape");
    await expect(page.locator("#brief")).toHaveValue("");
  });

  test("every sheet is readable in full, with its evidence and a link to the case file", async ({ page }) => {
    await page.goto("/");
    await printAccessibility(page);
    const sheets = page.locator(".sheets .sheet");
    expect(await sheets.count()).toBeGreaterThan(0);
    for (const sheet of await sheets.all()) {
      await expect(sheet.locator(".sheet-title")).toBeVisible();
      await expect(sheet.locator(".full")).toHaveAttribute("href", /^\/work\/[a-z-]+#[a-z-]+$/);
    }
  });

  test("missing capabilities are named", async ({ page }) => {
    await page.goto("/");
    await page.fill("#brief", "We need native iOS apps in Swift with an accessible design system");
    await page.press("#brief", "Enter");
    await expect(page.locator(".missing")).toHaveText(/^No work to show yet for .*Swift/, { timeout: 10_000 });
  });

  test("rate limited: the reason is printed as the title", async ({ page }) => {
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
    await expect(page.locator("#r-title")).toContainText("cool down", { timeout: 10_000 });
    await expect(page.getByRole("status")).toContainText("cool down");
  });

  test("reduced motion: the result appears without the print animation", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await page.fill("#brief", "accessibility");
    const t0 = Date.now();
    await page.press("#brief", "Enter");
    await expect(page.locator("#r-title")).toBeVisible({ timeout: 5_000 });
    expect(Date.now() - t0).toBeLessThan(1_500);
    const animation = await page.locator(".sheets .sheet").first().evaluate((el) => getComputedStyle(el).animationName);
    expect(animation).toBe("none");
    await context.close();
  });
});

test.describe("without JavaScript", () => {
  test("the paper form GETs /ask and prints the sheets as a list", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await page.fill("#brief", "accessibility");
    await page.getByRole("button", { name: "Print" }).click();
    await expect(page).toHaveURL(/\/ask\?brief=accessibility/);
    await expect(page.locator("h1")).toHaveText(/Accessibility/);
    await expect(page.locator(".sheet-list .sheet").first()).toContainText("Accessibility – keyboard navigation");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
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
    await expect(page.locator("section#dual-view h3")).toHaveText(/A dual view: the network and a list/);
    await expect(page.locator("section#dual-view")).toHaveClass(/is-current/);
    const cardLink = page.locator('.cf-toc a[href="#arrangements"]');
    if (await cardLink.isVisible()) {
      await expect(page.locator('.cf-toc a[aria-current="step"]')).toHaveText("Dual view");
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
    await page.getByRole("button", { name: "Accessibility", exact: true }).click();
    const small = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("main a, main button, header a, main input")]
        // Inline links inside running text are exempt (WCAG 2.5.8), as are the chips on the paper:
        // 28px tall (above the 24px minimum) and duplicates of the 84px skills cards.
        .filter((el) => el.offsetParent !== null && !el.closest("p") && !el.closest(".chips"))
        .map((el) => ({ el: el.textContent?.trim() || el.id, h: el.getBoundingClientRect().height }))
        .filter((x) => x.h < 44),
    );
    expect(small).toEqual([]);
  });
});
