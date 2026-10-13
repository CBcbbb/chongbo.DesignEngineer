import { expect, test, type Page } from "@playwright/test";

/*
 * The machine's shell: the light switch in the header, the jam, the hiccup when nothing is understood, and the share
 * images. The printing itself is covered in site.spec.ts.
 */

const lamp = (page: Page) => page.locator("header .lamp");
const theme = (page: Page) => page.evaluate(() => document.documentElement.dataset.theme ?? null);
const storedTheme = (page: Page) => page.evaluate(() => localStorage.getItem("theme"));

test.describe("light switch", () => {
  test("starts from the system, one tap switches and is remembered across pages", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(lamp(page)).toHaveAttribute("aria-label", "Switch to dark mode");
    expect(await theme(page)).toBeNull();
    await lamp(page).click();
    await expect.poll(() => theme(page)).toBe("dark");
    expect(await storedTheme(page)).toBe("dark");
    await expect(lamp(page)).toHaveAttribute("aria-label", "Switch to light mode");
    await expect(page.locator("header [role=status]")).toHaveText("Dark mode, until you switch back.");
    for (const route of ["/work", "/about", "/work/hhcd-data-platform"]) {
      await page.goto(route);
      expect(await theme(page)).toBe("dark");
      await expect(lamp(page)).toHaveAttribute("aria-label", "Switch to light mode");
    }
  });

  test("a second tap goes back to following the system, and nothing is stored", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(lamp(page)).toHaveAttribute("aria-label", "Switch to light mode");
    await lamp(page).click();
    await expect.poll(() => theme(page)).toBe("light");
    await lamp(page).click();
    await expect.poll(() => theme(page)).toBeNull();
    expect(await storedTheme(page)).toBeNull();
    await expect(page.locator("header [role=status]")).toHaveText("Dark mode, following your system.");
  });

  test("no flash: the stored theme is on <html> before the first paint", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.addInitScript(() => {
      try {
        localStorage.setItem("theme", "dark");
      } catch {}
      const w = window as unknown as { __themeAt?: number; __bgAtParse?: string };
      // <html> doesn't exist yet when this runs: watch the whole document for it and its data-theme
      new MutationObserver((_, obs) => {
        if (document.documentElement?.dataset.theme && w.__themeAt === undefined) {
          w.__themeAt = performance.now();
          obs.disconnect();
        }
      }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-theme"] });
      document.addEventListener("DOMContentLoaded", () => {
        w.__bgAtParse = getComputedStyle(document.body).backgroundColor;
      });
    });
    await page.goto("/");
    const { at, paint, bg, dark } = await page.evaluate(async () => {
      const w = window as unknown as { __themeAt?: number; __bgAtParse?: string };
      // the paint entries can arrive a little after load: wait for them (buffered), up to two seconds
      const fp = await new Promise<PerformanceEntry | undefined>((res) => {
        const find = () => performance.getEntriesByType("paint").find((e) => e.name === "first-paint");
        if (find()) return res(find());
        const obs = new PerformanceObserver(() => {
          if (find()) {
            obs.disconnect();
            res(find());
          }
        });
        obs.observe({ type: "paint", buffered: true });
        setTimeout(() => res(find()), 2000);
      });
      const root = document.documentElement;
      return {
        at: w.__themeAt,
        paint: fp?.startTime,
        bg: w.__bgAtParse,
        dark: getComputedStyle(root).getPropertyValue("--studio").trim(),
      };
    });
    expect(at).toBeDefined();
    expect(paint).toBeDefined();
    expect(at!).toBeLessThan(paint!);
    // the body was already dark when the document finished parsing
    const hex = (c: string) => `#${(c.match(/\d+/g) ?? []).slice(0, 3).map((n) => Number(n).toString(16).padStart(2, "0")).join("")}`;
    expect(hex(bg!)).toBe(dark.toLowerCase());
  });

  test("keyboard: Tab reaches the lamp and Enter switches", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
      if (await lamp(page).evaluate((el) => el === document.activeElement)) break;
    }
    await expect(lamp(page)).toBeFocused();
    await page.keyboard.press("Enter");
    await expect.poll(() => theme(page)).toBe("dark");
    await expect(lamp(page)).toBeFocused();
  });

  test("the lamp is a 44px target", async ({ page }) => {
    await page.goto("/");
    const box = await lamp(page).boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("storage blocked: the switch still works for the page", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("blocked");
        },
      });
    });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await lamp(page).click();
    await expect.poll(() => theme(page)).toBe("dark");
    await lamp(page).click();
    await expect.poll(() => theme(page)).toBeNull();
    expect(errors).toEqual([]);
  });
});

test.describe("reduced motion", () => {
  test("a print leaves nothing animating, and the lamp switches at once", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await page.goto("/");
    await page.fill("#brief", "accessibility");
    await page.press("#brief", "Enter");
    await expect(page.locator("#r-title")).toBeVisible({ timeout: 5_000 });
    await expect(page.locator(".fly-sheet, .feed-sheet")).toHaveCount(0);
    const running = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running")
        .map((a) => {
          const t = (a.effect as KeyframeEffect | null)?.target as Element | null;
          return `${t?.tagName}.${t?.getAttribute("class")} ${a instanceof CSSAnimation ? a.animationName : a instanceof CSSTransition ? a.transitionProperty : "waapi"}`;
        }),
    );
    expect(running).toEqual([]);
    await lamp(page).click();
    expect(await theme(page)).toBe("dark");
    const lampAnims = await lamp(page).evaluate((el) => el.getAnimations({ subtree: true }).length);
    expect(lampAnims).toBe(0);
  });
});

test.describe("paper jam", () => {
  test("a failed print jams the machine, gives the request back and a way out; the next print clears it", async ({ page }) => {
    let fail = true;
    await page.route("**/api/ask", (route) => (fail ? route.fulfill({ status: 500, contentType: "text/plain", body: "boom" }) : route.continue()));
    await page.goto("/");
    await page.fill("#brief", "accessibility");
    await page.press("#brief", "Enter");
    const note = page.locator(".jam-note");
    await expect(note).toContainText("Something jammed. Try again in a moment, browse all work, or email me.", { timeout: 10_000 });
    await expect(page.locator(".machine")).toHaveClass(/jammed/);
    await expect(page.locator(".machine .photo-jam:visible")).toHaveCount(1);
    await expect(note.getByRole("link", { name: "browse all work" })).toHaveAttribute("href", "/work");
    await expect(note.getByRole("link", { name: "email me" })).toHaveAttribute("href", /^mailto:/);
    await expect(page.getByRole("main").getByRole("status")).toContainText("Something jammed");
    // the request is back on the paper, ready to send again
    await expect(page.locator("#brief")).toHaveValue("accessibility");
    await expect(page.locator("#r-title")).toHaveCount(0);
    fail = false;
    await page.getByRole("button", { name: "Print" }).click();
    await expect(page.locator("#r-title")).toHaveText(/Accessibility/, { timeout: 10_000 });
    await expect(note).toHaveCount(0);
    await expect(page.locator(".machine")).not.toHaveClass(/jammed/);
  });

  test("offline: the jam says to check the connection", async ({ page }) => {
    await page.route("**/api/ask", (route) => route.abort("internetdisconnected"));
    await page.goto("/");
    await page.fill("#brief", "accessibility");
    await page.press("#brief", "Enter");
    await expect(page.locator(".jam-note")).toContainText("offline", { timeout: 10_000 });
  });
});

test.describe("nothing understood", () => {
  test("a name: a hello and where to start, not a jam", async ({ page }) => {
    await page.goto("/");
    await page.fill("#brief", "Sarah Jones");
    await page.press("#brief", "Enter");
    await expect(page.locator("#r-title")).toHaveText("Where to start.", { timeout: 10_000 });
    await expect(page.locator(".rhead .not-found")).toContainText("Nice to meet you, Sarah.");
    await expect(page.locator(".jam-note")).toHaveCount(0);
    expect(await page.locator(".sheets .sheet").count()).toBeGreaterThan(0);
  });

  test("random letters: says what it couldn't find", async ({ page }) => {
    await page.goto("/");
    await page.fill("#brief", "asdf qwer");
    await page.press("#brief", "Enter");
    await expect(page.locator("#r-title")).toHaveText("Where to start.", { timeout: 10_000 });
    await expect(page.locator(".rhead .not-found")).toContainText("I couldn’t find a role or a skill in “asdf qwer”");
  });

  test("without JavaScript, /ask says the same", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/ask?brief=Sarah%20Jones");
    await expect(page.locator(".not-found")).toContainText("Nice to meet you, Sarah.");
    await context.close();
  });
});

test.describe("share images", () => {
  for (const route of ["/", "/about", "/work/hhcd-data-platform"]) {
    test(`${route}: its share image is a 1200×630 PNG`, async ({ page, request }) => {
      await page.goto(route);
      const src = await page.locator('meta[property="og:image"]').first().getAttribute("content");
      expect(src).toBeTruthy();
      const res = await request.get(new URL(src!).pathname + new URL(src!).search);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/png");
      const buf = await res.body();
      // PNG signature, then the IHDR chunk's width and height
      expect(buf.subarray(1, 4).toString()).toBe("PNG");
      expect(buf.readUInt32BE(16)).toBe(1200);
      expect(buf.readUInt32BE(20)).toBe(630);
    });
  }
});
