import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { profile } from "@content";
import { SITE_URL } from "@/lib/site";
import { THEME_SCRIPT } from "@/components/nav/ThemeLamp";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} · ${profile.title}, ${profile.location}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.headline,
  applicationName: `${profile.name} portfolio`,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: profile.name,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { email: false, telephone: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ecece8" },
    { media: "(prefers-color-scheme: dark)", color: "#161617" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme is set by THEME_SCRIPT before the first paint, so React may find it already there
    <html lang="en-GB" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body>
        {/* The remembered light or dark choice, applied before anything in the body is parsed or painted (ThemeLamp). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <a className="skip sr-only-focusable" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
