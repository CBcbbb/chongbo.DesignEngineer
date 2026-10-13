/**
 * Printing a case file (case-print.css, CasePrint.tsx). Much of a case file waits for the reader to scroll to it:
 * lazy images, the recordings' posters, the hand of cards, the gift box. Before printing, everything is loaded and
 * set out as it would be once seen.
 *
 * Components register with `onPrint`. It runs on the browser's `beforeprint`, which can't wait for anything to
 * load (printing from the browser's menu), and on PRINT_EVENT, which `readyToPrint` sends before it waits for the
 * pictures and then opens the print dialog (Cmd+P or Ctrl+P on the page).
 */
export const PRINT_EVENT = "casefile:print";

export function onPrint(run: () => void) {
  window.addEventListener("beforeprint", run);
  window.addEventListener(PRINT_EVENT, run);
  return () => {
    window.removeEventListener("beforeprint", run);
    window.removeEventListener(PRINT_EVENT, run);
  };
}

const loaded = (img: HTMLImageElement) =>
  img.complete
    ? Promise.resolve()
    : new Promise<void>((done) => {
        img.addEventListener("load", () => done(), { once: true });
        img.addEventListener("error", () => done(), { once: true });
      });

/**
 * The original behind an optimised picture (/_next/image?url=…), when it is a JPEG. A PDF keeps a JPEG as it is but
 * stores an AVIF or WebP picture uncompressed, about a megabyte for a photo, so a printout uses the originals.
 */
function jpegOriginal(url: string) {
  try {
    const u = new URL(url, location.href);
    const original = u.pathname === "/_next/image" ? u.searchParams.get("url") : null;
    return original && /\.jpe?g$/i.test(original) ? original : null;
  } catch {
    return null;
  }
}

/** Loads everything a printout needs, for at most `timeout` ms. */
export async function readyToPrint(root: ParentNode = document, timeout = 6000) {
  // the components commit their updates within the event (flushSync), so the new elements are in place after it
  window.dispatchEvent(new Event(PRINT_EVENT));
  const images = Array.from(root.querySelectorAll("img"));
  for (const img of images) {
    if (img.loading === "lazy") img.loading = "eager";
    const original = jpegOriginal(img.currentSrc || img.src);
    if (original) {
      img.removeAttribute("srcset");
      img.src = original;
    }
  }
  const posters = Array.from(root.querySelectorAll<HTMLVideoElement>("video[poster]")).map((v) => {
    const original = jpegOriginal(v.poster);
    if (original) v.poster = original;
    const img = new Image();
    img.src = v.poster;
    return img;
  });
  await Promise.race([Promise.all([...images, ...posters].map(loaded)), new Promise((done) => setTimeout(done, timeout))]);
}
