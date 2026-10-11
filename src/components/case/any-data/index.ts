import { Demo } from "./Demo";
import { AxisPickers, Phases, Picker, Pipeline, SampleData, Store, Templates, Trio } from "./Modules";

/** Components for Any Data's interactive evidence, by the name its content file uses (`media.kind: "module"`). */
export const ANY_DATA_MODULES = {
  "any-data/demo": Demo,
  "any-data/templates": Templates,
  "any-data/sample-data": SampleData,
  "any-data/store": Store,
  "any-data/trio": Trio,
  "any-data/pipeline": Pipeline,
  "any-data/picker": Picker,
  "any-data/phases": Phases,
  "any-data/axis-pickers": AxisPickers,
} as const;

export { CoverWires } from "./CoverWires";
