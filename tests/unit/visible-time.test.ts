import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { observeVisibleTime } from "@/lib/visible-time";

let entries: IntersectionObserverCallback;
let now: number;
let visibility: string;
const element = {} as HTMLElement;
const disconnect = vi.fn();
function intersect(width: number, height: number) {
  entries([{
    target: element, isIntersecting: width > 0 && height > 0,
    boundingClientRect: { width: 400, height: 1400 }, intersectionRect: { width, height },
  } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);
}
function hidden(value: boolean) {
  visibility = value ? "hidden" : "visible";
  document.dispatchEvent(new Event("visibilitychange"));
}
beforeEach(() => {
  now = 0; visibility = "visible"; disconnect.mockClear();
  vi.stubGlobal("window", Object.assign(new EventTarget(), { innerWidth: 390, innerHeight: 844 }));
  vi.stubGlobal("document", Object.defineProperty(new EventTarget(), "visibilityState", { get: () => visibility }));
  vi.stubGlobal("getComputedStyle", () => ({ visibility: "visible" }));
  vi.spyOn(performance, "now").mockImplementation(() => now);
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { entries = callback; }
    observe() {}
    disconnect = disconnect;
  });
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it("requires visible width and height, allows tall mobile cards, and ignores quick swipes", () => {
  const send = vi.fn();
  const stop = observeVisibleTime([element], send);
  intersect(10, 800); now = 2000; intersect(0, 0);
  expect(send).not.toHaveBeenCalled();
  intersect(390, 800); now = 2800; intersect(0, 0);
  expect(send).not.toHaveBeenCalled();
  intersect(390, 800); now = 5000; intersect(0, 0);
  expect(send).toHaveBeenCalledExactlyOnceWith(element, 2.2);
  stop();
  expect(send).toHaveBeenCalledTimes(1);
  expect(disconnect).toHaveBeenCalledOnce();
});

it("pauses in a background tab, resumes on return, and flushes pagehide/cleanup only once", () => {
  const send = vi.fn();
  const stop = observeVisibleTime([element], send);
  intersect(390, 800); now = 2000; hidden(true);
  expect(send).toHaveBeenLastCalledWith(element, 2);
  now = 62000; intersect(390, 800);
  hidden(false); now = 65000;
  window.dispatchEvent(new Event("pagehide"));
  stop();
  expect(send.mock.calls.map(call => call[1])).toEqual([2, 3]);
});

it("does not restart the clock on repeated intersections while still visible", () => {
  const send = vi.fn();
  const stop = observeVisibleTime([element], send);
  intersect(390, 800); now = 1000; intersect(390, 700); now = 2000;
  stop();
  expect(send).toHaveBeenCalledExactlyOnceWith(element, 2);
});
