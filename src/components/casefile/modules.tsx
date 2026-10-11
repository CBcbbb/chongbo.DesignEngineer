import { ANY_DATA_MODULES } from "@/components/case/any-data";

/**
 * Projects' own interactive evidence, by name (`Media` kind "module", `Project.work.module`). Each project keeps its
 * modules in its own folder under `src/components/case/<project>/` and registers them here.
 */
const MODULES: Record<string, () => React.ReactNode> = {
  ...ANY_DATA_MODULES,
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
