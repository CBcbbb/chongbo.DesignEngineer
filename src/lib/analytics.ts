import type { PostHog } from "posthog-js";

/**
 * Visitor analytics (PostHog, EU cloud, cookieless). Everything here is a no-op unless NEXT_PUBLIC_POSTHOG_KEY is
 * set at build time, so local work, tests and previews without the key send nothing.
 *
 * What is recorded: page views, which skills cards are picked and printed, which sheets are looked at, which
 * case-file cards are read and for how long, and clicks on the email address, outbound links and "Read it in
 * context". What is never recorded: the words of a brief or a pasted job description (only their length), any
 * text typed on the site, or a session recording.
 */
export type AnalyticsEvent =
  | "skill_toggled"
  | "printed"
  | "sheet_viewed"
  | "case_card_viewed"
  | "contact_clicked"
  | "outbound_clicked"
  | "read_in_context_clicked";

type Props = Record<string, string | number | boolean | string[] | null | undefined>;

export const analyticsKey = (): string => process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";

/**
 * PostHog, once instrumentation-client.ts has loaded it (only when there is a key, so the library stays off the page
 * otherwise). Kept on window: instrumentation-client is bundled apart from the app, so a module variable could be two.
 */
export function setAnalytics(instance: PostHog): void {
  window.__analytics = instance;
}

/** Send one event. Safe to call anywhere on the client; does nothing without a key or before PostHog has loaded. */
export function track(event: AnalyticsEvent, props: Props = {}): void {
  if (typeof window === "undefined") return;
  const ph = window.__analytics;
  if (!ph) return;
  try {
    ph.capture(event, props);
  } catch {
    // analytics must never break the page
  }
}
