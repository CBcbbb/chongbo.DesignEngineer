import type { ReactNode } from "react";
import type { Project, Section } from "@content";
import { CaseMedia } from "@/components/casefile/blocks";
import { MediaSlot } from "@/components/media/MediaSlot";

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
