/** Foreground, visible time only. A view is a continuous interval of at least 1.5 seconds. */
export function observeVisibleTime(elements: HTMLElement[], onView: (element: HTMLElement, seconds: number) => void): () => void {
  if (typeof IntersectionObserver === "undefined") return () => {};
  const visible = new Set<HTMLElement>();
  const since = new Map<HTMLElement, number>();
  const send = (element: HTMLElement) => {
    const started = since.get(element);
    since.delete(element);
    if (started === undefined) return;
    const ms = performance.now() - started;
    if (ms >= 1500) onView(element, Math.round(ms / 100) / 10);
  };
  const resume = () => {
    if (document.visibilityState !== "visible") return;
    for (const element of visible) if (!since.has(element)) since.set(element, performance.now());
  };
  const flush = () => [...since.keys()].forEach(send);
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const element = entry.target as HTMLElement;
      const box = entry.boundingClientRect;
      // Half of a viewport also qualifies for a tall mobile card. Both axes matter in the horizontal strip.
      const enough = entry.isIntersecting
        && entry.intersectionRect.height >= Math.min(box.height, window.innerHeight) * 0.5
        && entry.intersectionRect.width >= Math.min(box.width, window.innerWidth) * 0.5
        && getComputedStyle(element).visibility === "visible";
      if (enough) visible.add(element);
      else { visible.delete(element); send(element); }
    }
    resume();
  }, { threshold: Array.from({ length: 101 }, (_, i) => i / 100) });
  elements.forEach(element => observer.observe(element));
  const visibility = () => document.visibilityState === "hidden" ? flush() : resume();
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("pagehide", flush);
  window.addEventListener("pageshow", resume);
  return () => {
    flush();
    observer.disconnect();
    document.removeEventListener("visibilitychange", visibility);
    window.removeEventListener("pagehide", flush);
    window.removeEventListener("pageshow", resume);
  };
}
