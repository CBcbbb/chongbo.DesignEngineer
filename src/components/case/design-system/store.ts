"use client";

import { useSyncExternalStore } from "react";

/**
 * "Seen as": which customer's brand the case file wears. One store, so the cover, the overview (01.3) and the theme
 * panel (Try it) follow the same choice. Every customer is invented.
 */
export type Customer = {
  id: string;
  name: string;
  colour: string;
  /** The face the case file and the theme panel take; Geist is the site's own. */
  font: string;
  weight: number;
  track: string;
  /** The panel's corner radius and button shape. */
  r: string;
  btn: string;
  mark: string;
};

const GEIST = 'var(--font-geist-sans), "Geist"';
export const CUSTOMERS: Customer[] = [
  { id: "courier", name: "Courier", colour: "#f2c94c", font: `"Archivo Variable", ${GEIST}`, weight: 700, track: "-0.035em", r: "0", btn: "0", mark: "C" },
  { id: "platform", name: "Platform", colour: "#3453d3", font: GEIST, weight: 600, track: "-0.045em", r: "0.5rem", btn: "0.5rem", mark: "P" },
  { id: "grocer", name: "Grocer", colour: "#2e7d3a", font: `"Fraunces Variable", Georgia, serif`, weight: 600, track: "-0.025em", r: "0.75rem", btn: "999px", mark: "G" },
  { id: "bank", name: "Bank", colour: "#1d2b5c", font: `"IBM Plex Sans Variable", ${GEIST}`, weight: 600, track: "-0.035em", r: "0.375rem", btn: "0.75rem", mark: "B" },
];
export const DEFAULT_CUSTOMER = CUSTOMERS[0]!;

type State = { id: string; own: string };
let state: State = { id: DEFAULT_CUSTOMER.id, own: "#e85d9a" };
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const SERVER: State = state;

export function setCustomer(id: string) {
  if (state.id === id) return;
  state = { ...state, id };
  listeners.forEach((fn) => fn());
}
export function setOwnColour(hex: string) {
  state = { id: "own", own: hex };
  listeners.forEach((fn) => fn());
}

/** The current choice and the customer it stands for ("own": Platform's face and shape, in the reader's colour). */
export function useSeenAs(): { state: State; customer: Customer } {
  const s = useSyncExternalStore(subscribe, () => state, () => SERVER);
  const customer =
    s.id === "own"
      ? { ...CUSTOMERS[1]!, id: "own", name: "Your own", colour: s.own, mark: "Y" }
      : (CUSTOMERS.find((c) => c.id === s.id) ?? DEFAULT_CUSTOMER);
  return { state: s, customer };
}
