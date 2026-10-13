import Link from "next/link";
import type { Project } from "@content";
import { DrawnArrow } from "./DrawnArrow";
import { PlayOnView } from "./PlayOnView";
import { ProjectCover } from "./ProjectCover";

/**
 * The end of every case file (docs/case-studies/ux-proposals.md, 03): one control, the shell's, never the project's.
 * Wide screens: "Next case file" and a drawn arrow on the left, the next project's name in capitals on the right;
 * on hover the arrow draws itself most of the way to the name. Phones: no arrow; the next project's cover sits beside
 * the label and the name, and plays its motion once in view.
 * It sits outside the last card, on the studio, so it may move (playbook §7).
 */
export function NextCase({ next }: { next: Project }) {
  return (
    <nav aria-label="Next case file" className="nx-wrap">
      <Link href={`/work/${next.slug}`} className="nx" data-play-host="">
        <ProjectCover slug={next.slug} className="nx-cv" sizes="120px" />
        <span className="nx-lab">Next case file</span>
        <DrawnArrow kind="grow" className="nx-ga" />
        <span className="nx-ttl" data-arrow-to="">
          {next.title}
        </span>
        <PlayOnView />
      </Link>
    </nav>
  );
}
