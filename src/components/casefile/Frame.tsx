import type { CSSProperties, ReactNode } from "react";

/**
 * A browser window round a screenshot or recording of the live product (playbook §6: recordings are shown whole in a
 * device frame). One edge and a slim bar: the address on the left, any controls on the right (`bar`), so controls
 * never add height. The frame keeps the content's own ratio (`ratio` = width / height) and scales to its space.
 */
export function BrowserFrame({ url, ratio, bar, children }: { url: string; ratio: number; bar?: ReactNode; children: ReactNode }) {
  return (
    <div className="cf-cq">
      <div className="cf-browser" style={{ "--ar": ratio } as CSSProperties}>
        <div className="cf-browser-bar">
          <span className="cf-url">{url}</span>
          {bar}
        </div>
        <div className="cf-browser-screen">{children}</div>
      </div>
    </div>
  );
}
