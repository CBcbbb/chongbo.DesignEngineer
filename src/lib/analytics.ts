import type { CaptureResult, PostHog } from "posthog-js";

/**
 * Cookieless analytics. Submitted questions are recorded deliberately in request_submitted;
 * drafts, keystrokes and session recordings are not collected. All state is held in memory,
 * shared between the app and instrumentation bundles, and resets on a full page load.
 */
export type AnalyticsEvent =
  | "skill_toggled"
  | "request_submitted"
  | "request_opened"
  | "request_cancelled"
  | "printed"
  | "sheet_viewed"
  | "case_card_viewed"
  | "contact_clicked"
  | "outbound_clicked"
  | "read_in_context_clicked";

export type AnalyticsProps = Record<string, string | number | boolean | string[] | null | undefined>;
export const analyticsKey = (): string => process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
const clean = (value: string | null) => value?.trim().slice(0, 60) ?? "";

/** Company/ref and acquisition channel are independent: utm_source never becomes ref. */
export function attributionRef(search: string, pathname: string): string {
  return clean(new URLSearchParams(search).get("ref")) || pathname.match(/^\/for\/([a-z0-9-]+)\/?$/)?.[1] || "";
}

type Context = {
  visit_id: string;
  request_id: string | null;
  ref: string | null;
  company: string | null;
  channel: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  is_test: boolean;
};
type AnalyticsWindow = Window & {
  __analytics?: PostHog;
  __portfolioAnalytics?: {
    context: Context;
    url: string;
    pending: { event: AnalyticsEvent; props: AnalyticsProps; timestamp: Date }[];
  };
};
const READY_EVENT = "portfolio:analytics-ready";

function referringChannel(): string {
  try {
    const url = new URL(document.referrer);
    if (url.host === window.location.host) return "unknown";
    if (/(^|\.)linkedin\.com$/.test(url.hostname) || url.hostname === "lnkd.in") return "linkedin";
    return url.hostname;
  } catch {
    return "direct_or_unknown";
  }
}

/** Snapshot attribution now, including before the SDK's first automatic pageview. */
export function analyticsContext(): Context {
  const w = window as AnalyticsWindow;
  const state = w.__portfolioAnalytics ??= {
    context: {
      visit_id: crypto.randomUUID(), request_id: null, ref: null, company: null,
      channel: referringChannel(), utm_source: null, utm_medium: null, utm_campaign: null, is_test: false,
    },
    url: "", pending: [],
  };
  const url = window.location.pathname + window.location.search;
  if (state.url !== url) {
    state.url = url;
    const params = new URLSearchParams(window.location.search);
    const pathCompany = window.location.pathname.match(/^\/for\/([a-z0-9-]+)\/?$/)?.[1];
    const ref = attributionRef(window.location.search, window.location.pathname);
    const test = ref.toLowerCase() === "test";
    const company = pathCompany || (!test && ref) || null;
    if (company) {
      if (state.context.company && state.context.company !== company) state.context.request_id = null;
      state.context.company = company;
    }
    if (ref) state.context.ref = ref;
    // Once a visit is a self-test, later internal navigation cannot accidentally turn tracking back on.
    state.context.is_test ||= test;
    for (const key of ["utm_source", "utm_medium", "utm_campaign"] as const) {
      const value = clean(params.get(key));
      if (value) state.context[key] = value;
    }
    if (state.context.utm_source) state.context.channel = state.context.utm_source;
  }
  return { ...state.context };
}

/** A print/request correlation id, never a person id and never passed to identify(). */
export function beginAnalyticsRequest(): string {
  analyticsContext();
  const id = crypto.randomUUID();
  (window as AnalyticsWindow).__portfolioAnalytics!.context.request_id = id;
  return id;
}

/** Applies to automatic pageviews/pageleaves as well as custom events. */
export function prepareAnalyticsEvent(event: CaptureResult | null): CaptureResult | null {
  if (!event) return null;
  const context = analyticsContext();
  if (context.is_test || event.properties.is_test === true) return null;
  return { ...event, properties: { ...context, ...event.properties } };
}

export function setAnalytics(instance: PostHog): void {
  const w = window as AnalyticsWindow;
  w.__analytics = instance;
  const pending = w.__portfolioAnalytics?.pending.splice(0) ?? [];
  for (const { event, props, timestamp } of pending) {
    try { instance.capture(event, props, { timestamp }); } catch { /* analytics must never break the page */ }
  }
  window.dispatchEvent(new Event(READY_EVENT));
}

export function whenAnalyticsReady(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if ((window as AnalyticsWindow).__analytics) callback();
  else window.addEventListener(READY_EVENT, callback, { once: true });
  return () => window.removeEventListener(READY_EVENT, callback);
}

/** Queue early interactions while the optional SDK imports; preserve their original context/time. */
export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  if (!w.__analytics && !analyticsKey()) return;
  try {
    const context = analyticsContext();
    if (context.is_test || props.is_test === true) return;
    const snapshot = { ...context, from: window.location.pathname, ...props };
    if (w.__analytics) {
      // View intervals often end on pagehide, after the SDK's batch queue has already flushed.
      if (event === "sheet_viewed" || event === "case_card_viewed") {
        w.__analytics.capture(event, snapshot, { send_instantly: true });
      } else w.__analytics.capture(event, snapshot);
    } else {
      const pending = w.__portfolioAnalytics!.pending;
      if (pending.length < 100) pending.push({ event, props: snapshot, timestamp: new Date() });
    }
  } catch { /* analytics must never break the page */ }
}
