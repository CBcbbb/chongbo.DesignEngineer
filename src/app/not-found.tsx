import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

/** An empty slot in the carousel: a lit slide with nothing on it but the way back. */
export default function NotFound() {
  return (
    <div className="wrap">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="nf">
        <article className="pj-slide is-text nf-slide" data-current>
          <div className="pj-slide-top">
            <span>404</span>
            <span>Empty slot</span>
          </div>
          <div className="pj-slide-main">
            <div className="pj-slide-text">
              <h1 className="pj-slide-title">There&apos;s no slide in this slot.</h1>
              <p>The page may have moved, or the link is missing a letter.</p>
              <div className="nf-links">
                <Link className="pj-full" href="/">
                  Back to the projector<span aria-hidden="true"> →</span>
                </Link>
                <Link className="nf-all" href="/work">
                  Browse all work
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
