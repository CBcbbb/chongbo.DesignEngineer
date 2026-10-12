import type { ReactNode } from "react";
import type { Project, Section } from "@content";
import { CaseMedia } from "@/components/casefile/blocks";
import { Card, cardIndexOf, paletteOf, workUrlOf } from "@/components/casefile/CaseFile";
import { MediaSlot } from "@/components/media/MediaSlot";
import { printedTitleId } from "@/lib/cards";

/**
 * A printed sheet's evidence, the same on the home page and on /ask. A case-file project's sheet carries the same
 * block its card has (compare, toggle, stepper, specimens, module, metrics, video, code); older projects use the
 * compact media slot.
 */
export function sheetEvidence(p: Project, s: Section, i: number): ReactNode {
  if (!s.media) return undefined;
  return p.template === "case-file" ? (
    <CaseMedia media={s.media} index={`sheet-${p.slug}-${i}`} url={p.work?.url ?? ""} />
  ) : (
    <MediaSlot media={s.media} compact />
  );
}

/**
 * A case-file project's section printed whole: the very card from its case file, composition, palette and all,
 * so a printed sheet is the card as he laid it out, not its parts re-flowed into another template.
 */
export function sheetCard(p: Project, s: Section, as: "h2" | "h3" = "h3"): ReactNode {
  if (p.template !== "case-file") return undefined;
  return (
    <div className="cf cf-print" data-palette={paletteOf(p)}>
      <Card section={s} idx={cardIndexOf(p, s)} url={workUrlOf(p)} titleId={printedTitleId(p.slug, s.id)} as={as} />
    </div>
  );
}

