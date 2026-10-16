import { afterEach, expect, it, vi } from "vitest";
import { applicationHome, currentApplicationHome, rememberApplicationHome } from "@/lib/application-home";

afterEach(() => vi.unstubAllGlobals());

it("retains only safe attribution parameters in an application's return address", () => {
  expect(applicationHome("/for/granola", "?ref=test&brief=private&next=https://example.com")).toBe("/for/granola?ref=test");
  expect(applicationHome("/for/granola/", "")).toBe("/for/granola");
  expect(applicationHome("/for/granola", "?utm_source=mail")).toBe("/for/granola?utm_source=mail");
  expect(applicationHome("//example.com/for/granola", "")).toBeNull();
});

it("keeps the application home during in-page navigation and starts fresh for an ordinary visit", () => {
  const w = Object.assign(new EventTarget(), { location: new URL("https://www.chongboning.com/work") });
  vi.stubGlobal("window", w);
  expect(currentApplicationHome()).toBe("/");
  rememberApplicationHome("/for/granola", "?ref=test");
  rememberApplicationHome("/work", "");
  expect(currentApplicationHome()).toBe("/for/granola?ref=test");
  vi.stubGlobal("window", Object.assign(new EventTarget(), { location: new URL("https://www.chongboning.com/") }));
  expect(currentApplicationHome()).toBe("/");
});
