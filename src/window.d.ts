import type { PostHog } from "posthog-js";
declare global {
  interface Window { __analytics?: PostHog }
  interface WindowEventMap { "nk-clip": CustomEvent<number> }
}
