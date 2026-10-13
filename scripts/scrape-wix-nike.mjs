/**
 * 
 * 
 * Scrape the Nike case-study page from the old Wix site.
 *
 * - Downloads every unique image at its ORIGINAL size (the /v1/... crop
 *   parameters are stripped from the CDN URL).
 * - Saves the page's text content as Markdown.
 * - Retries each file up to 3 times; a file that keeps failing is recorded
 *   and skipped so the rest of the run continues.
 * - Writes a report (scrape-report.md) summarising what worked and what didn't.
 *
 * Run with:  node scripts/scrape-wix-nike.mjs
 */

import { mkdir, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const PAGE_URL = "https://ningchongbo.wixsite.com/homepage/nike";
const SLUG = "nike";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "src", "temp", SLUG);
const IMAGES_DIR = join(OUT_DIR, "images");

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;
const FETCH_TIMEOUT_MS = 30000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** fetch with an AbortController timeout. */
async function timedFetch(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        Accept: "*/*",
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Retry a binary download up to MAX_RETRIES times. Returns {ok, bytes, error}. */
async function downloadWithRetry(url) {
  let lastError = "unknown error";
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await timedFetch(url);
      if (!res.ok) {
        lastError = `HTTP ${res.status}`;
        throw new Error(lastError);
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.byteLength === 0) {
        lastError = "empty response";
        throw new Error(lastError);
      }
      return { ok: true, buffer: buf, bytes: buf.length };
    } catch (err) {
      lastError = err?.message || String(err);
      if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS * attempt);
    }
  }
  return { ok: false, buffer: null, bytes: 0, error: lastError };
}

/** Fetch the page HTML with retries. */
async function fetchPageHtml(url) {
  let lastError = "unknown error";
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await timedFetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      if (!html || html.length < 1000) throw new Error("suspiciously small HTML");
      return html;
    } catch (err) {
      lastError = err?.message || String(err);
      if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS * attempt);
    }
  }
  throw new Error(`Failed to fetch page after ${MAX_RETRIES} tries: ${lastError}`);
}

/** Turn a filename into a safe, readable name. */
function sanitiseName(name) {
  return name
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Extract unique image records from the HTML.
 * Each record: { fileId, originalFilename, ext, originalUrl }
 * The original URL is the fileId with NO /v1/ transformation appended.
 */
function extractImages(html) {
  // Match the full transformed URL so we can recover both the fileId and the
  // trailing original filename, e.g.
  //   https://static.wixstatic.com/media/<fileId>~mv2.png/v1/fill/.../phone-02.png
  const re =
    /https:\/\/static\.wixstatic\.com\/media\/([a-zA-Z0-9_~.-]+?~mv2\.(?:png|jpe?g|gif|webp|svg))(?:\/v1\/[^\s"')\\]*?\/([^/\s"')\\]+\.(?:png|jpe?g|gif|webp|svg)))?/gi;

  const seen = new Map(); // fileId -> record
  for (const m of html.matchAll(re)) {
    const fileId = m[1];
    const tail = m[2] || "";
    // original filename lives at the very end of the transformed path
    const decodedTail = decodeURIComponent(tail);
    const extFromFileId = fileId.split(".").pop().toLowerCase();
    const looksLikeImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(decodedTail);

    if (!seen.has(fileId)) {
      seen.set(fileId, {
        fileId,
        originalFilename: looksLikeImage ? decodedTail : fileId,
        ext: (looksLikeImage ? decodedTail.split(".").pop() : extFromFileId).toLowerCase(),
        originalUrl: `https://static.wixstatic.com/media/${fileId}`,
      });
    } else if (looksLikeImage && seen.get(fileId).originalFilename === fileId) {
      // A later reference gave us the real original filename; upgrade it.
      const rec = seen.get(fileId);
      rec.originalFilename = decodedTail;
      rec.ext = decodedTail.split(".").pop().toLowerCase();
    }
  }
  return [...seen.values()];
}

/** Convert the visible page text into Markdown (best effort). */
function htmlToMarkdown(html) {
  // Grab the <title>
  const title = (html.match(/<title>([^<]*)<\/title>/i)?.[1] || "").trim();

  // Work only on the body to avoid <head>/<script> noise.
  let body = html;
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) body = bodyMatch[1];

  // Remove script/style/noscript blocks.
  body = body
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");

  // Convert structural tags to text markers.
  body = body
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n\n# $1\n\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n\n## $1\n\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n\n### $1\n\n")
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n\n#### $1\n\n")
    .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "\n\n##### $1\n\n")
    .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "\n\n###### $1\n\n")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1")
    .replace(/<\/(p|div|section|article|tr|ul|ol)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n");

  // Strip all remaining tags.
  body = body.replace(/<[^>]+>/g, " ");

  // Decode a few common entities.
  const entities = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&rsquo;": "’",
    "&lsquo;": "‘",
    "&ldquo;": "“",
    "&rdquo;": "”",
    "&mdash;": "—",
    "&ndash;": "–",
    "&hellip;": "…",
  };
  body = body.replace(/&[a-z#0-9]+;/gi, (e) => entities[e] ?? e);

  // Collapse whitespace, keeping paragraph breaks.
  const lines = body
    .split("\n")
    .map((l) => l.replace(/[ \t\u00a0]+/g, " ").trim())
    .filter((l, i, arr) => l !== "" || arr[i - 1] !== "");

  let md = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  if (title) md = `# ${title}\n\n_Scraped from ${PAGE_URL}_\n\n${md}`;
  return md;
}

async function main() {
  console.log(`Fetching ${PAGE_URL} ...`);
  const html = await fetchPageHtml(PAGE_URL);
  console.log(`Got HTML (${html.length} bytes).`);

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(IMAGES_DIR, { recursive: true });

  // --- Save text ---
  const markdown = htmlToMarkdown(html);
  const markdownPath = join(OUT_DIR, "content.md");
  await writeFile(markdownPath, markdown, "utf8");
  console.log(`Saved text -> ${markdownPath}`);

  // --- Extract and download images ---
  const images = extractImages(html);
  console.log(`Found ${images.length} unique image(s).`);

  const results = { ok: [], failed: [] };
  const manifest = [];

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const num = String(i + 1).padStart(2, "0");
    const base = sanitiseName(img.originalFilename) || `${img.fileId}.${img.ext}`;
    const fileName = `${num}-${base}`;
    const dest = join(IMAGES_DIR, fileName);

    const outcome = await downloadWithRetry(img.originalUrl);
    if (outcome.ok) {
      await writeFile(dest, outcome.buffer);
      const record = {
        index: i + 1,
        file: fileName,
        url: img.originalUrl,
        bytes: outcome.bytes,
      };
      results.ok.push(record);
      manifest.push(record);
      console.log(`  [ok] ${fileName} (${outcome.bytes} bytes)`);
    } else {
      const record = {
        index: i + 1,
        file: fileName,
        url: img.originalUrl,
        error: outcome.error,
      };
      results.failed.push(record);
      console.log(`  [FAIL] ${fileName} — ${outcome.error}`);
    }
  }

  await writeFile(
    join(OUT_DIR, "manifest.json"),
    JSON.stringify({ page: PAGE_URL, scrapedAt: new Date().toISOString(), images: manifest }, null, 2),
    "utf8",
  );

  // --- Report ---
  const report = [
    `# Scrape report — ${SLUG}`,
    ``,
    `- Page: ${PAGE_URL}`,
    `- When: ${new Date().toISOString()}`,
    `- Images found: ${images.length}`,
    `- Downloaded: ${results.ok.length}`,
    `- Failed: ${results.failed.length}`,
    ``,
    `## Downloaded`,
    ``,
    ...results.ok.map((r) => `- \`${r.file}\` — ${r.bytes} bytes`),
    ``,
    `## Failed`,
    ``,
    ...(results.failed.length
      ? results.failed.map((r) => `- \`${r.file}\` — ${r.error} (${r.url})`)
      : ["- (none)"]),
    ``,
  ].join("\n");
  await writeFile(join(OUT_DIR, "scrape-report.md"), report, "utf8");

  console.log(`\nDone. Output in ${OUT_DIR}`);
  console.log(`  OK: ${results.ok.length}  FAILED: ${results.failed.length}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
