import Image from "next/image";
import { COVER_ART } from "./cover-art";

/**
 * A project's cover in the set (docs/case-studies/ux-proposals.md, 01): one 16:10 frame, the project's colour field
 * and the drawing its case file's cover already uses, centred. No text, no interface. Covers are objects: the same
 * colours in light and dark, like the printer. Decorative: the card or link around it carries the name.
 *
 * Its motion plays when an ancestor with `data-play-host` is hovered, or once in view on touch screens (PlayOnView).
 */
const FIELD: Record<string, "hhcd" | "any" | "ds" | "nike"> = {
  "hhcd-data-platform": "hhcd",
  "components-for-any-data": "any",
  "design-system": "ds",
  "nike-athletes-closet": "nike",
};

export function ProjectCover({ slug, sizes = "(min-width: 760px) 520px, 100vw", className }: { slug: string; sizes?: string; className?: string }) {
  const k = FIELD[slug];
  const cls = `pc${k ? ` pc-${k}` : " pc-plain"}${className ? ` ${className}` : ""}`;
  if (k === "nike")
    return (
      <span className={cls} aria-hidden="true">
        <Image src="/assets/nike/print/cover.jpg" alt="" width={2400} height={1500} sizes={sizes} draggable={false} />
      </span>
    );
  if (!k) return <span className={cls} aria-hidden="true" />;
  return <span className={cls} aria-hidden="true" dangerouslySetInnerHTML={{ __html: COVER_ART[k] }} />;
}
