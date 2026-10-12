/*
 * "What this shows": this project's own still icons, drawn bold and mostly solid with one open detail. Registered by
 * name in src/components/casefile/icons.tsx; styled in design-system.css (.ds-ico).
 */

/** Bricks on a plate: a design system. */
function SystemIcon() {
  return (
    <svg className="cf-ico ds-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect className="f" x="2.5" y="10" width="19" height="9.5" rx="1.8" />
      <rect className="f" x="5" y="5.6" width="5.2" height="5" rx="1.1" />
      <rect className="o" x="14.7" y="6.5" width="3.6" height="3.6" rx=".7" />
    </svg>
  );
}

/** A Figma diamond between code brackets: Figma to code. */
function CodeIcon() {
  return (
    <svg className="cf-ico ds-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path className="s" d="M7.2 6.8 2.6 12l4.6 5.2M16.8 6.8l4.6 5.2-4.6 5.2" />
      <path className="f" d="M12 7.9 16.1 12 12 16.1 7.9 12z" />
    </svg>
  );
}

/** Half a circle filled: contrast. */
function ContrastIcon() {
  return (
    <svg className="cf-ico ds-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle className="s" cx="12" cy="12" r="8.4" />
      <path className="f" d="M12 3.6a8.4 8.4 0 0 0 0 16.8z" />
    </svg>
  );
}

export const DESIGN_SYSTEM_ICONS = { system: SystemIcon, code: CodeIcon, contrast: ContrastIcon };
