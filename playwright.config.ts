import { defineConfig } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
// Downloads are blocked in this environment, so use the system Chromium when present.
const executablePath = process.env.PW_CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 2,
  reporter: [["list"]],
  timeout: 45_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    launchOptions: {
      executablePath,
      args: ["--disable-background-networking", "--disable-component-update", "--no-first-run"],
    },
  },
  projects: [
    { name: "desktop", testIgnore: /screenshots/, use: { viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", testIgnore: /screenshots/, use: { viewport: { width: 390, height: 844 }, hasTouch: true } },
    { name: "screenshots", testMatch: /screenshots\.spec\.ts/ },
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
