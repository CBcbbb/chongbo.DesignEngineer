import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <div className="wrap">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex justify-center py-16">
        <div className="paper-drop w-full max-w-[440px]">
          <div className="ticket torn">
            <div className="t-head">
              <span>No. 404</span>
              <span className="stamp">Not found</span>
            </div>
            <h1 className="t-num">404</h1>
            <p className="t-reply">This sheet was never printed. The page may have moved.</p>
            <div className="t-cta">
              <Link className="t-link" href="/">
                Back to the machine
              </Link>
              <Link className="t-link" href="/work">
                Browse all work
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
