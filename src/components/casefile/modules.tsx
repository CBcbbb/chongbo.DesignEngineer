import { ANY_DATA_MODULES } from "@/components/case/any-data";
import { DESIGN_SYSTEM_MODULES } from "@/components/case/design-system";

/**
 * Projects' own interactive evidence, by name (`Media` kind "module", `Project.work.module`). Each project keeps its
 * modules in its own folder under `src/components/case/<project>/` and registers them here.
 */
const MODULES: Record<string, () => React.ReactNode> = {
  ...ANY_DATA_MODULES,
  ...DESIGN_SYSTEM_MODULES,
};

export function CaseModule({ name }: { name: string }) {
  const M = MODULES[name];
  if (!M) throw new Error(`Unknown case-file module: ${name}`);
  return (
    <figure className="cf-figure cf-module">
      <M />
    </figure>
  );
}

/** A module without the evidence figure round it, e.g. a control on the cover (`Project.coverControl`). */
export function ProjectModule({ name }: { name: string }) {
  const M = MODULES[name];
  if (!M) throw new Error(`Unknown case-file module: ${name}`);
  return <M />;
}
