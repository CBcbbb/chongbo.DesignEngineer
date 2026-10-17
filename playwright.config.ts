import { existsSync } from "node:fs";
import { defineConfig, type Project } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
// Downloads are blocked in the build sandbox, so Chromium comes from the system there; anywhere else (a laptop, CI)
// Playwright's own browsers are used: `npx playwright install chromium webkit firefox`.
const systemChromium = process.env.PW_CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const chromiumLaunch = {
  ...(existsSync(systemChromium) ? { executablePath: systemChromium } : {}),
  args: ["--disable-background-networking", "--disable-component-update", "--no-first-run"],
};

const desktop = { viewport: { width: 1440, height: 1000 } };
const phone = { viewport: { width: 390, height: 844 }, hasTouch: true };

/** The same two sizes in each engine. Chromium keeps the names `desktop` and `mobile`; the others are prefixed. */
const engines: Project[] = [
  { name: "desktop", use: { browserName: "chromium", launchOptions: chromiumLaunch, ...desktop } },
  { name: "mobile", use: { browserName: "chromium", launchOptions: chromiumLaunch, ...phone } },
  // Safari's engine; the phone is an iPhone's size and pixel density
  { name: "webkit-desktop", use: { browserName: "webkit", ...desktop } },
  { name: "webkit-mobile", use: { browserName: "webkit", ...phone, isMobile: true, deviceScaleFactor: 3 } },
  // Firefox has no mobile emulation (isMobile); touch and a phone's width
  { name: "firefox-desktop", use: { browserName: "firefox", ...desktop } },
  { name: "firefox-mobile", use: { browserName: "firefox", ...phone } },
];

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  timeout: 45_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    ...engines.map((p) => ({ ...p, testIgnore: /screenshots/ })),
    { name: "screenshots", testMatch: /screenshots\.spec\.ts/, use: { browserName: "chromium", launchOptions: chromiumLaunch } },
  ],
  webServer: {
    // Uses the production build: run `npm run build` first.
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 60_000,
    // No key: tests exercise the fallback. A high limit keeps the suite from tripping the rate limiter.
    env: { ANTHROPIC_API_KEY: "", ASK_RATE_LIMIT: "1000" },
  },
});
