import type { CSSProperties, ReactNode } from "react";

/**
 * A browser window round a screenshot or recording of a web product (playbook §6: recordings are shown whole in a
 * device frame). The frame keeps the content's own ratio (`ratio` = width / height); on tablets and computers it
 * scales to the space it is given. `bar` holds anything that lives in the window's toolbar, so controls never add height.
 */
export function BrowserFrame({ url, ratio, bar, children }: { url: string; ratio: number; bar?: ReactNode; children: ReactNode }) {
  return (
    <div className="cf-cq">
      <div className="cf-browser" style={{ "--ar": ratio } as CSSProperties}>
        <div className="cf-browser-bar">
          <span className="cf-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="cf-url">{url}</span>
          {bar}
        </div>
        <div className="cf-browser-screen">{children}</div>
      </div>
    </div>
  );
}
