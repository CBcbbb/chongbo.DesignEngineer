"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/*
 * The light switch: a pendant lamp with a pull chain, in the header after About (one of the shell's controls, like the
 * hammer and the eyes in Pill.tsx). A tap pulls the chain; at the bottom of the pull the theme changes, and the lamp
 * is lit in dark mode (you switch a light on when it gets dark).
 *
 * The site starts from the system setting. A tap switches and remembers the choice (localStorage "theme"); choosing
 * the mode the system already uses forgets it, so two taps is "follow the system again". The choice is applied before
 * the first paint by the script in layout.tsx (THEME_SCRIPT), so a reload never flashes the other theme.
 * Under 0.6s, a little randomness-free spring, nothing changes layout, and with "reduce motion" it switches at once.
 */

export const THEME_KEY = "theme";
type Mode = "light" | "dark";

/** Runs in <head> before anything paints: the remembered choice, if there is one, onto <html>. */
export const THEME_SCRIPT = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;}}catch(e){}`;

const reduce = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const systemMode = (): Mode => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
/** Where the choice lives when storage is blocked (private windows, strict settings): this page only. */
let memo: Mode | null = null;
const stored = (): Mode | null => {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return memo;
  }
};
const store = (v: Mode | null) => {
  memo = v;
  try {
    if (v) localStorage.setItem(THEME_KEY, v);
    else localStorage.removeItem(THEME_KEY);
  } catch {
    /* private windows and blocked storage: the switch still works for this page */
  }
};
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

/**
 * The browser's own bar follows the theme too. Following the system, the page's two media-scoped colours stay as they
 * were served; with a choice, both show the chosen theme's studio colour. (color-scheme follows data-theme in tokens.css.)
 */
function syncThemeColor(chosen: Mode | null) {
  const root = document.documentElement;
  const colour = getComputedStyle(root).getPropertyValue("--studio").trim();
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
    m.dataset.served ??= m.content;
    m.content = chosen && colour ? colour : m.dataset.served;
  });
}

/** The mode in use: the choice, or else the system's. Changes with either (the "themechange" event, the media query). */
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  window.addEventListener("themechange", cb);
  return () => {
    mq.removeEventListener("change", cb);
    window.removeEventListener("themechange", cb);
  };
};
const current = (): Mode => stored() ?? systemMode();

/** The choice onto <html> and the browser's bar; tells anything listening (the printer's photographs). */
function apply() {
  const chosen = stored();
  const root = document.documentElement;
  if (chosen) root.dataset.theme = chosen;
  else delete root.dataset.theme;
  syncThemeColor(chosen);
  window.dispatchEvent(new CustomEvent("themechange", { detail: chosen ?? systemMode() }));
}

export function ThemeLamp() {
  const ref = useRef<HTMLButtonElement>(null);
  // null on the server and in the first render, so the label never mismatches on hydration
  const mode = useSyncExternalStore<Mode | null>(subscribe, current, () => null);
  const [note, setNote] = useState<{ head: string; tail: string } | null>(null);
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const switchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    apply();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => {
      if (!stored()) apply();
    };
    mq.addEventListener("change", onSystem);
    return () => {
      mq.removeEventListener("change", onSystem);
      if (noteTimer.current) clearTimeout(noteTimer.current);
      if (switchTimer.current) clearTimeout(switchTimer.current);
    };
  }, []);

  const flip = useCallback(() => {
    const next: Mode = (stored() ?? systemMode()) === "dark" ? "light" : "dark";
    // the page's colours ease over 0.3s, for this switch only (on load the theme is simply there)
    const root = document.documentElement;
    if (!reduce()) {
      root.dataset.switching = "";
      if (switchTimer.current) clearTimeout(switchTimer.current);
      switchTimer.current = setTimeout(() => delete root.dataset.switching, 400);
    }
    store(next === systemMode() ? null : next);
    apply();
    setNote({ head: next === "dark" ? "Dark mode" : "Light mode", tail: stored() ? "until you switch back" : "following your system" });
    if (noteTimer.current) clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => setNote(null), 2200);
    return next;
  }, []);

  const onClick = () => {
    const el = ref.current;
    const chain = el?.querySelector<SVGGElement>(".lamp-chain");
    if (!el || !chain || reduce()) {
      flip();
      return;
    }
    // down 3.2px in 120ms; the switch happens at the bottom of the pull; back up on a spring
    chain
      .animate([{ translate: "0 0" }, { translate: "0 3.2px" }], { duration: 120, easing: "ease-in", fill: "forwards" })
      .finished.then(() => {
        const next = flip();
        if (next === "dark") {
          el.querySelector(".lamp-bulb")?.animate([{ opacity: 0.4 }, { opacity: 1, offset: 0.3 }, { opacity: 0.6, offset: 0.5 }, { opacity: 1 }], {
            duration: 260,
            easing: "steps(4, end)",
          });
          el.querySelector(".lamp-cone")?.animate([{ opacity: 0 }, { opacity: 0.7, offset: 0.3 }, { opacity: 0.25, offset: 0.5 }, { opacity: 1 }], {
            duration: 300,
            easing: "steps(4, end)",
          });
        }
        chain.animate([{ translate: "0 3.2px" }, { translate: "0 -1.2px", offset: 0.55 }, { translate: "0 0" }], {
          duration: 380,
          easing: SPRING,
          fill: "forwards",
        });
      })
      .catch(() => flip());
  };

  /** Hover and keyboard focus: a hint of the pull, never a switch. */
  const hint = () => {
    if (reduce()) return;
    ref.current
      ?.querySelector(".lamp-chain")
      ?.animate([{ translate: "0 0" }, { translate: "0 1.2px" }, { translate: "0 0" }], { duration: 360, easing: SPRING });
  };

  const label = mode === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <span className="lamp-wrap">
      <button
        ref={ref}
        type="button"
        className="lamp"
        aria-label={label}
        onClick={onClick}
        onPointerEnter={(e) => e.pointerType === "mouse" && hint()}
        onFocus={(e) => e.currentTarget.matches(":focus-visible") && hint()}
      >
        <svg className="lamp-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="lamp-cone-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6c35a" stopOpacity="0.55" />
              <stop offset="1" stopColor="#f6c35a" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* the light: its top edge is the shade's rim, so the two always meet */}
          <path className="lamp-cone" d="M4.9 13c4.7.7 9.5.7 14.2 0l3.9 10.6H1z" />
          <path d="M12 .6c.1 1.5 0 3 .1 4.5" />
          <path d="M10.5 5.1h3.1c.2.4.2.9 0 1.3h-3.1c-.2-.4-.2-.9 0-1.3z" />
          <path className="lamp-bulb" d="M9.8 13.4c.1 1.3 1 2.1 2.2 2.1s2.1-.8 2.2-2.1" />
          <path className="lamp-shade" d="M4.9 13c.3-3.9 3.1-6.6 7.1-6.6s6.8 2.7 7.1 6.6c-4.8.7-9.5.7-14.2 0z" />
          <path className="lamp-rim" d="M6.2 13.9c3.9.5 7.7.5 11.6 0" />
          <g className="lamp-chain">
            <path d="M16.9 13.6c.1 1.2 0 2.5 0 3.7" />
            <circle className="lamp-bead" cx="16.9" cy="18.9" r="1.35" />
          </g>
        </svg>
      </button>
      <span className={`lamp-note${note ? " on" : ""}`} aria-hidden="true">
        {note?.head}
        <small>{note?.tail}</small>
      </span>
      <span className="sr-only" role="status" aria-live="polite">
        {note ? `${note.head}, ${note.tail}.` : ""}
      </span>
    </span>
  );
}
