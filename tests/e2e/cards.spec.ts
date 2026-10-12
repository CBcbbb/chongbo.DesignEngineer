import { expect, test, type Page } from "@playwright/test";
import { projects } from "../../content";

/**
 * The card rule. Every case-file card is --card-h tall (tokens.css), or shorter when it is sized to its content; none
 * may be taller, on its case page or printed on a home-page sheet, so a printed sheet always fits one screen under the
 * results title. A new card that breaks this fails here: tighten that card (or its short-window type), don't raise
 * --card-h.
 */

/** Laptop screens, as browser windows: the shortest (800 high) holds the tallest card exactly. */
const LAPTOPS = [
  { width: 1280, height: 800 },
  { width: 1440, height: 800 },
  { width: 1512, height: 860 },
  { width: 1440, height: 900 },
  { width: 1680, height: 1050 },
];

const CARD = ".cf-sheet.is-card, .nk-sheet.is-card";

/** --card-h in pixels, as the page resolves it. */
const cardHeight = (page: Page) =>
  page.evaluate(() => {
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;height:var(--card-h)";
    document.body.append(probe);
    const h = probe.getBoundingClientRect().height;
    probe.remove();
    return h;
  });

test.describe("the card rule", () => {
  test.skip(({ isMobile }) => isMobile, "laptop sizes only");

  for (const size of LAPTOPS) {
    test(`no case-file card is taller than --card-h at ${size.width}×${size.height}`, async ({ page }) => {
      await page.setViewportSize(size);
      const limit = await (async () => {
        await page.goto("/");
        return cardHeight(page);
      })();
      expect(limit, "--card-h resolves").toBeGreaterThan(400);
      const over: string[] = [];
      for (const p of projects) {
        await page.goto(`/work/${p.slug}`);
        await page.evaluate(() => document.fonts.ready);
        const cards = await page.locator(CARD).evaluateAll((els) =>
          els.map((el) => ({ id: el.id, h: el.getBoundingClientRect().height, hidden: el.scrollHeight - el.clientHeight })),
        );
        for (const c of cards) {
          if (c.h > limit + 1) over.push(`${p.slug}#${c.id} is ${Math.round(c.h)}px (limit ${Math.round(limit)})`);
          if (c.hidden > 1) over.push(`${p.slug}#${c.id} hides ${c.hidden}px of its content`);
        }
      }
      expect(over, over.join("\n")).toEqual([]);
    });
  }
});

test.describe("printed sheets", () => {
  test.skip(({ isMobile }) => isMobile, "laptop sizes only");

  for (const size of [LAPTOPS[1]!, LAPTOPS[3]!]) {
    test(`every printed sheet fits the screen and carries its case-page card unchanged, ${size.width}×${size.height}`, async ({ page, context }) => {
      test.setTimeout(120_000);
      await page.setViewportSize(size);
      const seen = new Map<string, { w: number; h: number }>();
      const problems: string[] = [];
      await page.goto("/");
      const topics = await page.locator(".topics button").evaluateAll((els) => els.map((el) => ({ id: el.getAttribute("data-topic")!, label: el.querySelector("b")!.textContent! })));
      expect(topics.length).toBeGreaterThan(0);
      for (const topic of topics) {
        await page.goto("/");
        await page.locator(`.topics button[data-topic="${topic.id}"]`).click();
        await page.getByRole("button", { name: "Print" }).click();
        await expect(page.locator("#r-title")).toBeVisible({ timeout: 10_000 });
        // the sheets deal in from a little higher up; measure where they come to rest
        await page.evaluate(() => Promise.all(document.getAnimations().filter((a) => a.effect?.getTiming().iterations !== Infinity).map((a) => a.finished.catch(() => undefined))));
        const n = await page.locator(".sheets > .sheet").count();
        for (let i = 0; i < n; i++) {
          // bring sheet i to the front of the strip, with the results title at the top of the screen as after a print
          const box = await page.evaluate((i) => {
            const strip = document.querySelector<HTMLElement>(".sheets")!;
            const sheet = strip.children[i] as HTMLElement;
            strip.scrollLeft = sheet.offsetLeft - parseFloat(getComputedStyle(strip).scrollPaddingInlineStart || "0");
            document.querySelector(".results")!.scrollIntoView({ block: "start" });
            const s = sheet.getBoundingClientRect();
            const head = document.querySelector(".rhead")!.getBoundingClientRect();
            const card = sheet.querySelector(".s-card > * > *")!.getBoundingClientRect();
            return { top: s.top, bottom: s.bottom, head: head.bottom, cardW: card.width, cardH: card.height, href: sheet.querySelector(".s-foot a")!.getAttribute("href")! };
          }, i);
          if (box.top < box.head) problems.push(`${topic.label} ${i + 1}: the sheet overlaps the title`);
          if (box.bottom > size.height) problems.push(`${topic.label} ${i + 1}: ${box.href} runs ${Math.round(box.bottom - size.height)}px off the screen`);
          if (!seen.has(box.href)) seen.set(box.href, { w: box.cardW, h: box.cardH });
        }
      }
      // the same card on its case page, at the same window size
      const casePage = await context.newPage();
      await casePage.setViewportSize(size);
      for (const [href, printed] of seen) {
        await casePage.goto(href);
        await casePage.evaluate(() => document.fonts.ready);
        const id = href.split("#")[1]!;
        const b = await casePage.locator(`[id="${id}"]`).evaluate((el) => el.getBoundingClientRect());
        if (Math.abs(b.width - printed.w) > 0.5 || Math.abs(b.height - printed.h) > 0.5)
          problems.push(`${href}: printed ${Math.round(printed.w)}×${Math.round(printed.h)}, case page ${Math.round(b.width)}×${Math.round(b.height)}`);
      }
      expect(problems, problems.join("\n")).toEqual([]);
    });
  }
});
