import Image from "next/image";

type Side = { src: string; width: number; height: number; alt: string; label: string };
type Mode = { label: string; a: "works" | "hard"; b: "works" | "hard" };

const Tick = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2.5 6.2 2.3 2.3 4.7-5" />
  </svg>
);
const Cross = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3.2 3.2l5.6 5.6M8.8 3.2 3.2 8.8" />
  </svg>
);
const Swap = () => (
  <svg viewBox="0 0 24 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5h17M16 1.5 20 5l-4 3.5M21 11H4M8 7.5 4 11l4 3.5" />
  </svg>
);

/**
 * The dual view as an accessibility decision: the two views of the same data side by side, joined by the shortcut
 * that switches between them. Under each view, how it works with a keyboard, a screen reader and a mouse, all shown
 * at once, so the reader sees why both views exist without having to switch anything.
 */
export function ViewToggle({ keys, a, b, modes }: { keys: string[]; a: Side; b: Side; modes: Mode[] }) {
  const pane = (s: Side, side: "a" | "b") => (
    <div className="cf-dual-pane">
      <p className="cf-dual-name">{s.label}</p>
      <div className="cf-dual-shot">
        <Image src={s.src} alt={s.alt} width={s.width} height={s.height} quality={90} sizes="(min-width: 1100px) 420px, 100vw" />
      </div>
      <ul className="cf-dual-modes" aria-label={`${s.label} view, by how it is used`}>
        {modes.map((md) => {
          const state = md[side];
          return (
            <li key={md.label} data-state={state}>
              <span className="cf-dual-mark">{state === "works" ? <Tick /> : <Cross />}</span>
              {md.label}
              <span className="sr-only">: {state === "works" ? "works" : "hard to use"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
  return (
    <figure className="cf-figure cf-dual">
      <div className="cf-dual-panes">
        {pane(a, "a")}
        <div className="cf-dual-join">
          <span className="sr-only">{keys.join(" + ")} switches between the two views.</span>
          <span className="cf-dual-keys" aria-hidden="true">
            {keys.map((k, i) => (
              <span key={k}>
                {i > 0 && <span className="plus">+</span>}
                <kbd>{k}</kbd>
              </span>
            ))}
          </span>
          <Swap />
        </div>
        {pane(b, "b")}
      </div>
    </figure>
  );
}
