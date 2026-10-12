import { expect, test, type Page } from "@playwright/test";
import { projects } from "../../content";

/**
 * The card rule. On tablets and computers every case-file card is laid out on one artboard (tokens.css: --card-w x
 * --card-h, 836 x 684) and scaled as a whole to fit the screen. So a card is the same card at every window size, and
 * none may be taller than the artboard: the tallest today, HHCD 01.4 (the workshop), is exactly --card-h. A new card
 * that breaks this fails here: tighten that card, don't raise --card-h.
 */

const CARD = ".cf-sheet.is-card, .nk-sheet.is-card";

/** Every card on every case page, as laid out on the artboard (the scale taken off). */
async function artboardCards(page: Page) {
  const out: { key: string; w: number; h: number; hidden: number }[] = [];
  for (const p of projects) {
    await page.goto(`/work/${p.slug}`, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: ":root { --card-zoom: 1 !important }" });
    // every picture loaded and every font in, so a card is measured as it finally stands
    await page.evaluate(async () => {
      for (const img of document.images) img.loading = "eager";
      await Promise.all([...document.images].map((img) => img.decode().catch(() => undefined)));
      await document.fonts.ready;
    });
    const cards = await page.locator(CARD).evaluateAll((els) =>
      els.map((el) => ({ id: el.id, w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height, hidden: el.scrollHeight - el.clientHeight })),
    );
    for (const c of cards) out.push({ key: `${p.slug}#${c.id}`, w: c.w, h: c.h, hidden: c.hidden });
  }
  return out;
}

test.describe("the card rule", () => {
  test.skip(({ isMobile }) => isMobile, "tablets and computers");

  test("no case-file card is taller than the artboard, and nothing hides inside one", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 800 });
    const over: string[] = [];
    for (const c of await artboardCards(page)) {
      if (Math.round(c.w) !== 836) over.push(`${c.key} is ${Math.round(c.w)}px wide (artboard 836)`);
      if (c.h > 684.5) over.push(`${c.key} is ${Math.round(c.h)}px tall (artboard 684)`);
      if (c.hidden > 1) over.push(`${c.key} hides ${c.hidden}px of its content`);
    }
    expect(over, over.join("\n")).toEqual([]);
  });

  test("a card is laid out the same at every window size", async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 1440, height: 800 });
    const base = new Map((await artboardCards(page)).map((c) => [c.key, c.h]));
    const moved: string[] = [];
    for (const size of [{ width: 1024, height: 700 }, { width: 1920, height: 1080 }]) {
      await page.setViewportSize(size);
      for (const c of await artboardCards(page)) {
        const h = base.get(c.key);
        if (h === undefined || Math.abs(h - c.h) > 1) moved.push(`${c.key} at ${size.width}×${size.height}: ${Math.round(c.h)}px tall, ${Math.round(h ?? 0)}px at 1440×800`);
      }
    }
    expect(moved, moved.join("\n")).toEqual([]);
  });
});

test.describe("printed sheets", () => {
  test.skip(({ isMobile }) => isMobile, "laptop sizes only");

  // laptop browser windows, from a short one (tabs, address and bookmarks bars, the dock) to a tall one
  for (const size of [{ width: 1440, height: 700 }, { width: 1440, height: 800 }, { width: 1512, height: 900 }]) {
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
