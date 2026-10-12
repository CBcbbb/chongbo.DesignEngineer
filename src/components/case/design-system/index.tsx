import { InCode } from "./Code";
import { CustomerColour, Lightness, Split, Wall } from "./Colours";
import { SeenAs } from "./Cover";
import { FigmaLibrary } from "./Figma";
import { Levels } from "./Levels";
import { Clients, Products } from "./Products";
import { TryIt } from "./TryIt";

/**
 * One Design System, Three Products, Any Brand: the project's interactive evidence, by the name its content file uses
 * (`media.kind: "module"`, `work.module`, `coverControl`). The four faces are the invented customers' and products'
 * own (self-hosted; the browser downloads one only when a customer or product that uses it is on screen).
 */
const MODULES = {
  "ds/seen-as": SeenAs,
  "ds/products": Products,
  "ds/clients": Clients,
  "ds/levels": Levels,
  "ds/figma": FigmaLibrary,
  "ds/code": InCode,
  "ds/wall": Wall,
  "ds/lightness": Lightness,
  "ds/split": Split,
  "ds/customer-colour": CustomerColour,
  "ds/try-it": TryIt,
} as const;

/** Each piece of evidence sits in `.dsm`, the scope of this project's styles (design-system.css). */
function scoped(M: () => React.ReactNode) {
  return function Scoped() {
    return (
      <div className="dsm">
        <M />
      </div>
    );
  };
}
export const DESIGN_SYSTEM_MODULES: Record<string, () => React.ReactNode> = Object.fromEntries(
  Object.entries(MODULES).map(([k, M]) => [k, k === "ds/seen-as" ? M : scoped(M)]),
);

export { CoverLayers } from "./Cover";
