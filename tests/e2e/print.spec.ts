import { expect, test } from "@playwright/test";
import { projects } from "../../content";

/**
 * Printing a case file (src/app/case-print.css, CasePrint.tsx, lib/print.ts): Cmd+P loads what is still waiting to
 * be scrolled to, the printout is light whatever the theme, the site's navigation is left out, and every sheet is
 * one page, on A4 and on Letter. PDFs are made by Chromium only.
 */
test.describe("printing a case file", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "page.pdf is Chromium's");
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1000, "printed from a computer");

  for (const p of projects) {
    test(`${p.slug}: one sheet per page, nothing missing, no navigation`, async ({ browser }) => {
      test.setTimeout(90_000);
      const context = await browser.newContext({ colorScheme: "dark", viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`/work/${p.slug}`);
      await page.evaluate(() => {
        (window as unknown as { __ready: boolean }).__ready = false;
        window.print = () => ((window as unknown as { __ready: boolean }).__ready = true);
      });
      // the shortcut is the page's once it has hydrated; until then a press is the browser's own print
      const shortcut = process.platform === "darwin" ? "Meta+P" : "Control+P";
      await expect(async () => {
        await page.keyboard.press(shortcut);
        await page.waitForFunction(() => (window as unknown as { __ready: boolean }).__ready, null, { timeout: 8_000 });
      }).toPass({ timeout: 30_000 });

      const ready = await page.evaluate(() => ({
        theme: document.documentElement.getAttribute("data-theme"),
        waiting: [...document.querySelectorAll("main img")].filter((i) => !(i as HTMLImageElement).complete).length,
        sheets: [...document.querySelectorAll(".cf-sheets > *, .nk-sheets > *")].filter((e) => !e.matches(".nx-wrap")).length,
      }));
      expect(ready.theme, "prints light").toBe("light");
      expect(ready.waiting, "pictures still loading").toBe(0);

      await page.emulateMedia({ media: "print" });
      const shown = await page.evaluate(() =>
        ["header.bar", "footer.foot", ".cf-toc, .nk-toc", ".nx-wrap"].filter((sel) =>
          [...document.querySelectorAll(sel)].some((e) => getComputedStyle(e).display !== "none"),
        ),
      );
      expect(shown, "navigation in the printout").toEqual([]);
      await page.emulateMedia({ media: null });

      for (const format of ["A4", "Letter"] as const) {
        const pdf = (await page.pdf({ format, preferCSSPageSize: true, printBackground: true })).toString("latin1");
        const pages = pdf.match(/\/Type\s*\/Page(?!s)/g)?.length ?? 0;
        expect(pages, `${format}: pages for ${ready.sheets} sheets`).toBe(ready.sheets);
      }
      // the reader's own theme setting is back after printing
      expect(await page.evaluate(() => document.documentElement.getAttribute("data-theme"))).toBeNull();
      await context.close();
    });
  }
});
