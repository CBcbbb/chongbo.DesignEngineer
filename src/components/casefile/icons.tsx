import type { Capability } from "@content";

/*
 * Small, still icons for the cover's capability labels, one per capability and tied to what its cards show.
 * Case files keep their controls serious (playbook §7): these icons don't move.
 */

/** A keycap with an arrow: the map is used by keyboard. */
function KeyIcon() {
  return (
    <svg className="cf-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.5" y="3.5" width="17" height="15.5" rx="3.2" />
      <path d="M12 15.5V7.5m0 0-3.2 3.2M12 7.5l3.2 3.2" />
      <path d="M5.5 21h13" />
    </svg>
  );
}

/** A box with a tick: from an idea to the built thing. */
function BuiltIcon() {
  return (
    <svg className="cf-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="m8.6 12.2 2.4 2.4 4.6-5" />
    </svg>
  );
}

/** The platform's four marks: the same entries, arranged with care. */
function MarksIcon() {
  return (
    <svg className="cf-ico cf-ico-marks" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle className="m-people" cx="7" cy="7" r="3.2" />
      <rect className="m-projects" x="14.3" y="4.3" width="5.4" height="5.4" transform="rotate(45 17 7)" />
      <path className="m-methods" d="M17 13.6 20.6 20h-7.2z" />
      <rect className="m-partners" x="4" y="14" width="6" height="6" />
    </svg>
  );
}

/** One icon per capability. Capabilities without one show none. */
export function CapabilityIcon({ capability }: { capability: Capability }) {
  if (capability === "E") return <KeyIcon />;
  if (capability === "B") return <BuiltIcon />;
  if (capability === "D") return <MarksIcon />;
  return null;
}

/** The arrow on a link that opens in a new tab. */
export function OutArrow() {
  return (
    <svg className="cf-out" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
    </svg>
  );
}
