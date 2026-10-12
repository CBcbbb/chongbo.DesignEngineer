/**
 * How much a case-file card is scaled on this screen (tablets and computers). Every card is laid out on one artboard
 * (tokens.css: --card-w x --card-h) and the finished card is scaled as a whole, so it is the same card at every window
 * size, on its case page and printed on a home-page sheet. The scale fits the artboard into the screen under the home
 * sheet's frame and into the room across; it never enlarges, and never goes below MIN, so text stays readable (on a
 * screen shorter than that the page scrolls a little instead).
 */
export const ARTBOARD = { w: 836, h: 684, frame: 116, min: 0.8, max: 1, from: 761 } as const;

export function cardZoom(viewHeight: number, room: number): number {
  const fit = Math.min((viewHeight - ARTBOARD.frame) / ARTBOARD.h, room / ARTBOARD.w, ARTBOARD.max);
  return Math.round(Math.max(ARTBOARD.min, fit) * 1000) / 1000;
}

/**
 * Sets --card-zoom on the page before it paints, and again on resize. The room across is the width of the column the
 * cards sit in on a case page; elsewhere (the home page's sheets) it is the page less its gutters and the sheet's own
 * margins. Kept free of imports and outer names so it can be inlined in <head>.
 */
function install(a: typeof ARTBOARD) {
  const root = document.documentElement;
  const set = () => {
    if (window.innerWidth < a.from) {
      root.style.removeProperty("--card-zoom");
      return;
    }
    const card = document.querySelector(".cf-sheet.is-card, .nk-sheet.is-card");
    let room: number;
    if (card && card.parentElement && !card.closest(".s-card")) {
      const p = card.parentElement;
      const cs = getComputedStyle(p);
      room = p.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    } else {
      const gutter = Math.min(48, Math.max(16, window.innerWidth * 0.04));
      room = root.clientWidth - 2 * gutter - 28;
    }
    const fit = Math.min((window.innerHeight - a.frame) / a.h, room / a.w, a.max);
    root.style.setProperty("--card-zoom", String(Math.round(Math.max(a.min, fit) * 1000) / 1000));
  };
  set();
  window.addEventListener("resize", set);
  // and whenever the page's content changes (load, client-side navigation), at most once a frame
  let queued = false;
  const later = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      set();
    });
  };
  document.addEventListener("DOMContentLoaded", () => {
    set();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
  });
}

/** The inline <head> script. */
export const CARD_ZOOM_SCRIPT = `(${install.toString()})(${JSON.stringify(ARTBOARD)})`;
