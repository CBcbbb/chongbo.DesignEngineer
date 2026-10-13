"use server";

import { projects } from "@content";
import { printedCards, type PrintedCard } from "@/components/PrintedCard";
import { buildCardIndex } from "@/lib/cards";

/** A print never has more sheets than this (README, "How ask works"). */
const MAX_SHEETS = 6;

/**
 * The printed form of the cards the printer chose, and nothing else. The home page used to carry every card of every
 * project in its first payload; now it asks for the few it prints, after the answer arrives. Keys come from the
 * client, so only real card keys are kept, each once, at most six.
 */
export async function printCards(keys: unknown): Promise<Record<string, PrintedCard>> {
  if (!Array.isArray(keys)) return {};
  const index = buildCardIndex();
  const wanted = new Set(keys.filter((k): k is string => typeof k === "string" && k in index).slice(0, MAX_SHEETS));
  if (!wanted.size) return {};
  return printedCards(projects, wanted);
}
