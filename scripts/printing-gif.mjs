// Records the README's GIF (docs/screenshots/printing.gif): the home page, the Accessibility card, Print, the sheets.
// Needs a production server and ffmpeg:  npm run build && npx next start -p 3100 &  then  node scripts/printing-gif.mjs
// BASE_URL and PW_CHROMIUM override the defaults (the same Chromium as playwright.config.ts).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const OUT = path.join(process.cwd(), "docs", "screenshots", "printing.gif");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "printing-gif-"));

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  colorScheme: "light",
  recordVideo: { dir: tmp, size: { width: 1280, height: 800 } },
});
const page = await context.newPage();
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);
await page.getByRole("button", { name: "Accessibility", exact: true }).click();
await page.waitForTimeout(700);
await page.getByRole("button", { name: "Print" }).click();
await page.locator("#r-title").waitFor({ timeout: 10_000 });
await page.waitForTimeout(3800);
const video = await page.video()?.path();
await context.close();
await browser.close();
if (!video) throw new Error("no recording");

// Skip the first two seconds (the page and the printer photo loading), 10 fps, 800px wide, one shared palette.
execFileSync("ffmpeg", [
  "-v", "error", "-y", "-ss", "2.0", "-t", "10.3", "-i", video,
  "-vf", "fps=10,scale=800:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=full[p];[b][p]paletteuse=dither=bayer:bayer_scale=5",
  OUT,
]);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`printing-gif: ${path.relative(process.cwd(), OUT)} (${(fs.statSync(OUT).size / 1024 / 1024).toFixed(1)} MB)`);
