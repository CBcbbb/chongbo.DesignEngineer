import type { CaptureResult, PostHog } from "posthog-js";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { analyticsContext, beginAnalyticsRequest, prepareAnalyticsEvent, setAnalytics, track } from "@/lib/analytics";

function navigate(path: string) { Object.assign(window, { location: new URL(path, "https://www.chongboning.com") }); }
beforeEach(() => {
  vi.stubGlobal("window", Object.assign(new EventTarget(), { location: new URL("https://www.chongboning.com/") }));
  vi.stubGlobal("document", { referrer: "" });
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_unit_test");
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
const automatic = (event = "$pageview") => ({ uuid: crypto.randomUUID(), event, properties: { $current_url: window.location.href } }) as CaptureResult;

it("attributes the very first automatic event to the company and channel separately", () => {
  navigate("/for/granola?utm_source=linkedin&utm_medium=message&utm_campaign=web-brand");
  expect(prepareAnalyticsEvent(automatic())?.properties).toMatchObject({
    company: "granola", ref: "granola", channel: "linkedin", utm_source: "linkedin",
    utm_medium: "message", utm_campaign: "web-brand", request_id: null, visit_id: expect.any(String),
  });
  const visit = analyticsContext().visit_id;
  const request = beginAnalyticsRequest();
  navigate("/work/design-system");
  expect(prepareAnalyticsEvent(automatic())?.properties).toMatchObject({
    company: "granola", ref: "granola", channel: "linkedin", visit_id: visit, request_id: request,
  });
});

it("uses the LinkedIn referrer when available without pretending unknown arrivals came from LinkedIn", () => {
  Object.assign(document, { referrer: "https://www.linkedin.com/messaging/" });
  navigate("/for/granola");
  expect(analyticsContext()).toMatchObject({ company: "granola", channel: "linkedin", utm_source: null });
});

it("does not treat utm_source on the ordinary homepage as a company", () => {
  navigate("/?utm_source=newsletter");
  expect(analyticsContext()).toMatchObject({ company: null, ref: null, channel: "newsletter" });
});

it("drops test pageviews, pageleaves and custom events, including after internal navigation", () => {
  navigate("/for/granola?ref=test&utm_source=linkedin");
  const capture = vi.fn();
  setAnalytics({ capture } as unknown as PostHog);
  expect(analyticsContext()).toMatchObject({ company: "granola", is_test: true });
  expect(prepareAnalyticsEvent(automatic())).toBeNull();
  track("request_submitted", { brief: "synthetic test" });
  navigate("/about");
  track("contact_clicked");
  expect(prepareAnalyticsEvent(automatic("$pageleave"))).toBeNull();
  expect(capture).not.toHaveBeenCalled();
});

it("queues early events once with original request context, raw text and timestamp", () => {
  navigate("/for/granola?utm_source=linkedin");
  const id = beginAnalyticsRequest();
  const brief = "  Show accessibility\n中文 & <strong>contrast</strong>  ";
  track("request_submitted", { brief, topics: ["accessibility"] });
  navigate("/about");
  const laterId = beginAnalyticsRequest();
  const capture = vi.fn();
  setAnalytics({ capture } as unknown as PostHog);
  setAnalytics({ capture } as unknown as PostHog);
  expect(capture).toHaveBeenCalledExactlyOnceWith("request_submitted", expect.objectContaining({
    brief, topics: ["accessibility"], request_id: id, company: "granola", from: "/for/granola",
  }), { timestamp: expect.any(Date) });
  expect(laterId).not.toBe(id);
  // A delayed send must not overwrite a captured event's request id.
  const prepared = prepareAnalyticsEvent({ uuid: crypto.randomUUID(), event: "request_submitted", properties: capture.mock.calls[0]![1] } as CaptureResult);
  expect(prepared?.properties.request_id).toBe(id);
});

it("does not queue text when analytics is unconfigured", () => {
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
  track("request_submitted", { brief: "not collected" });
  const capture = vi.fn();
  setAnalytics({ capture } as unknown as PostHog);
  expect(capture).not.toHaveBeenCalled();
});

it("new company entry does not inherit the previous company's request", () => {
  navigate("/for/granola");
  beginAnalyticsRequest();
  navigate("/for/example");
  expect(analyticsContext()).toMatchObject({ company: "example", ref: "example", request_id: null });
});
