import { analyticsKey, setAnalytics, track } from "@/lib/analytics";

/*
 * Client-side start-up (Next.js runs this before the app becomes interactive). Starts PostHog when
 * NEXT_PUBLIC_POSTHOG_KEY is set, and does nothing otherwise. See src/lib/analytics.ts for what is recorded.
 *
 * - Cookieless: no cookies, localStorage or sessionStorage; PostHog counts visitors with a privacy-preserving
 *   hash on its servers. "Cookieless server hash mode" must be switched on in the PostHog project's settings.
 * - Sent through /ingest on this site (next.config.ts rewrites it to PostHog's EU cloud), so blockers that drop
 *   third-party analytics domains don't skew the numbers.
 * - A link sent with an application carries ?ref=<name> (e.g. /ask?topics=accessibility&ref=granola): it is kept on
 *   every event of that visit, so each application's opens can be told apart.
 */
const key = analyticsKey();

async function start(key: string) {
  const { default: posthog } = await import("posthog-js");
  try {
    posthog.init(key, {
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      defaults: "2026-08-30",
      cookieless_mode: "always",
      person_profiles: "identified_only",
      capture_pageview: "history_change",
      capture_pageleave: true,
      autocapture: false,
      disable_session_recording: true,
      disable_surveys: true,
      mask_all_text: true,
      debug: process.env.NEXT_PUBLIC_POSTHOG_DEBUG === "1",
    });

    const params = new URLSearchParams(window.location.search);
    const ref = (params.get("ref") ?? params.get("utm_source") ?? "").trim().slice(0, 60);
    if (ref) posthog.register({ ref });
    setAnalytics(posthog);

    // Clicks that say a visitor wants more: the email address, links off the site, and a sheet's way into its case file.
    document.addEventListener(
      "click",
      (e) => {
        const a = (e.target as Element | null)?.closest?.("a");
        if (!a) return;
        const href = a.getAttribute("href") ?? "";
        if (href.startsWith("mailto:")) track("contact_clicked", { from: window.location.pathname });
        else if (a.classList.contains("full")) track("read_in_context_clicked", { card: href.replace(/^\/work\//, "") });
        else if (/^https?:\/\//.test(href) && new URL(href).host !== window.location.host)
          track("outbound_clicked", { host: new URL(href).host, from: window.location.pathname });
      },
      { capture: true },
    );
  } catch {
    // analytics must never break the page
  }
}

if (key && typeof window !== "undefined") void start(key);
