import { expect, test, type Page } from "@playwright/test";
import { projects } from "../../content";

/**
 * Case-file cards and the sheets printed from them (playbook §7, "One card, one screen" and "Printed sheets").
 *
 * - On tablets and computers every card is at most 40rem (640px) tall, the same at every window height.
 * - A printed sheet carries the case page's own card, unchanged: same width, height and type.
 * - After printing, the results title sits at the top of the screen with the first sheet whole under it.
 */

const LIMIT = 640;

/**
 * Cards that are taller than the limit today, with their height at 1440px wide. Each is waiting for a tighter
 * composition (approved by Chongbo; never by changing the words or shrinking every card). The test fails when any
 * other card goes over the limit, when one of these grows, or when one of these fits and should leave the list.
 */
const OVER_LIMIT: Record<string, number> = {
  "hhcd-data-platform#workshop": 684,
  "hhcd-data-platform#four-types": 666,
  "components-for-any-data#shapes": 652,
  "design-system#three-layers": 815,
  "design-system#in-code": 774,
  "design-system#fixed-lightness": 740,
};

/** Every card on a case page, measured once its images have loaded. */
async function caseCards(page: Page, slug: string) {
  await page.goto(`/work/${slug}`);
  await page.evaluate(async () => {
    // lazy images load as each card comes into view
    for (const el of document.querySelectorAll("[data-card]")) {
      el.scrollIntoView({ block: "center" });
      await new Promise((r) => setTimeout(r, 60));
    }
    const loaded = Promise.all(
      [...document.images].map((img) =>
        img.complete
          ? null
          : new Promise((r) => {
              img.addEventListener("load", r, { once: true });
              img.addEventListener("error", r, { once: true });
            }),
      ),
    );
    await Promise.race([loaded, new Promise((r) => setTimeout(r, 4000))]);
  });
  await page.waitForTimeout(300);
  return page.evaluate(() =>
    Object.fromEntries(
      [...document.querySelectorAll<HTMLElement>("[data-card]")].map((el) => {
        const r = el.getBoundingClientRect();
        const h = el.querySelector("h3");
        return [el.dataset.card!, { w: r.width, h: r.height, type: h ? getComputedStyle(h).fontSize : "" }];
      }),
    ),
  );
}

async function print(page: Page, skill: string) {
  await page.goto("/");
  await page.getByRole("button", { name: skill, exact: true }).click();
  await page.getByRole("button", { name: "Print" }).click();
  await expect(page.locator("#r-title")).toBeVisible({ timeout: 10_000 });
  // the deal-in has finished (looping animations on the cards never do, so they are left out)
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => undefined)),
    ),
  );
  await page.waitForTimeout(600);
}

test.describe("case-file cards", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 761, "phones scroll as normal");

  test("no card is taller than 40rem (known exceptions listed in OVER_LIMIT)", async ({ page }) => {
    const over: string[] = [];
    const fits: string[] = [];
    for (const p of projects) {
      const cards = await caseCards(page, p.slug);
      for (const [id, c] of Object.entries(cards)) {
        const key = `${p.slug}#${id}`;
        const known = OVER_LIMIT[key];
        if (known === undefined && c.h > LIMIT + 0.5) over.push(`${key}: ${Math.round(c.h)}px`);
        if (known !== undefined && c.h > known + 0.5) over.push(`${key}: grew to ${Math.round(c.h)}px (was ${known}px)`);
        if (known !== undefined && c.h <= LIMIT + 0.5) fits.push(`${key} fits now: take it off OVER_LIMIT`);
      }
    }
    expect([...over, ...fits], [...over, ...fits].join("\n")).toEqual([]);
  });

  test("a card is the same card at every window height", async ({ page }) => {
    for (const slug of ["hhcd-data-platform", "nike-athletes-closet"]) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      const tall = await caseCards(page, slug);
      await page.setViewportSize({ width: 1440, height: 700 });
      const short = await caseCards(page, slug);
      for (const [id, c] of Object.entries(tall)) {
        expect(Math.abs(c.h - short[id]!.h), `${slug}#${id}`).toBeLessThan(1);
        expect(short[id]!.type, `${slug}#${id}`).toBe(c.type);
      }
    }
  });
});

test.describe("printed sheets", () => {
  for (const skill of ["Accessibility", "Design systems", "Web and brand"]) {
    test(`each sheet printed for ${skill} carries its case card unchanged`, async ({ page, browser }) => {
      await print(page, skill);
      const sheets = page.locator(".sheets .sheet");
      const n = await sheets.count();
      expect(n).toBeGreaterThan(0);
      const casePage = await browser.newPage({ viewport: page.viewportSize()! });
      const bySlug: Record<string, Awaited<ReturnType<typeof caseCards>>> = {};
      for (let i = 0; i < n; i++) {
        const sheet = sheets.nth(i);
        const href = (await sheet.locator(".full").getAttribute("href"))!;
        const [slug, id] = href.replace("/work/", "").split("#") as [string, string];
        await sheet.locator("[data-card]").scrollIntoViewIfNeeded();
        await page.waitForTimeout(250);
        const printed = await sheet.evaluate((li) => {
          const card = li.querySelector<HTMLElement>(".s-card [data-card]")!;
          const s = parseFloat(getComputedStyle(li).getPropertyValue("--s")) || 1;
          const r = card.getBoundingClientRect();
          return { id: card.dataset.card, w: r.width / s, h: r.height / s, type: getComputedStyle(card.querySelector("h3")!).fontSize };
        });
        bySlug[slug] ??= await caseCards(casePage, slug);
        const original = bySlug[slug][id]!;
        expect(printed.id, href).toBe(id);
        expect(Math.abs(printed.w - original.w), `${href} width`).toBeLessThan(1.5);
        expect(Math.abs(printed.h - original.h), `${href} height`).toBeLessThan(3);
        expect(printed.type, `${href} heading size`).toBe(original.type);
      }
      await casePage.close();
    });
  }

  for (const height of [760, 800, 900]) {
    test(`at 1440 × ${height} the title sits at the top with the first sheet whole under it`, async ({ page, viewport }) => {
      test.skip((viewport?.width ?? 0) < 1001, "laptop windows only");
      await page.setViewportSize({ width: 1440, height });
      // a print whose first card is within the limit
      await print(page, "Motion");
      const box = await page.evaluate(() => {
        const title = document.querySelector("#r-title")!.getBoundingClientRect();
        const paper = document.querySelector(".sheets .s-paper")!.getBoundingClientRect();
        const foot = document.querySelector(".sheets .s-foot")!.getBoundingClientRect();
        return { title: title.top, top: paper.top, bottom: paper.bottom, foot: foot.bottom, vh: innerHeight };
      });
      expect(box.title).toBeGreaterThanOrEqual(0);
      expect(box.title).toBeLessThan(80);
      expect(box.top).toBeGreaterThan(box.title);
      expect(box.bottom).toBeLessThanOrEqual(box.vh);
      expect(box.foot).toBeLessThanOrEqual(box.vh);
    });
  }
});

test.describe("the printer's engraving", () => {
  test("the name plate and the word PRINT are never clipped, from 320px to 1920px", async ({ page }) => {
    await page.goto("/");
    for (const width of [320, 340, 360, 375, 390, 414, 480, 600, 768, 900, 1024, 1280, 1440, 1680, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(100);
      const problems = await page.evaluate(() => {
        const out: string[] = [];
        const plate = document.querySelector<HTMLElement>(".plate")!;
        const p = plate.getBoundingClientRect();
        for (const line of plate.querySelectorAll<HTMLElement>("span")) {
          const r = document.createRange();
          r.selectNodeContents(line);
          const t = r.getBoundingClientRect();
          if (t.left < p.left - 0.5 || t.right > p.right + 0.5 || t.top < p.top - 0.5 || t.bottom > p.bottom + 0.5) out.push(`plate: ${line.textContent}`);
        }
        const machine = document.querySelector(".machine")!.getBoundingClientRect();
        const label = document.querySelector(".pk-label")!.getBoundingClientRect();
        if (label.left < machine.left || label.right > machine.right || label.bottom > machine.bottom) out.push("PRINT");
        if (label.right > innerWidth || p.right > innerWidth) out.push("off screen");
        return out;
      });
      expect(problems, `${width}px`).toEqual([]);
    }
  });
});
