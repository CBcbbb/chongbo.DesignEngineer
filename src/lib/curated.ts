import type { AskResponse } from "./ask/schema";
import type { CardIndex } from "./cards";

/** Only the current application's label and public card keys cross into the client. */
export type CuratedSelection = {
  id: string;
  company: string;
  label: string;
  replacesTopic: string;
  cards: string[];
  brand?: { color: string; logo: { src: string; width: number; height: number } };
};

export type PrintAnswer = Pick<AskResponse, "asked" | "matched" | "missing" | "sheets"> & {
  source: AskResponse["source"] | "curated";
};

/** Hand-picked cards keep their exact order and never enter the model's candidate-selection pipeline. */
export function curatedAnswer(selection: CuratedSelection, index: CardIndex): PrintAnswer | null {
  if (!selection.cards.length || selection.cards.length > 6 || new Set(selection.cards).size !== selection.cards.length) return null;
  const sheets: PrintAnswer["sheets"] = [];
  for (const key of selection.cards) {
    const card = index[key];
    const signal = card?.signals[0];
    if (!card || !signal) return null;
    sheets.push({ project: card.project, section: card.section, signal, reason: selection.label });
  }
  const asked = [...new Set(sheets.map((s) => s.signal))];
  return { asked, matched: asked[0]!, missing: [], sheets, source: "curated" };
}
