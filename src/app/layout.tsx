import { CARD_ZOOM_SCRIPT } from "@/lib/card-zoom";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { profile } from "@content";
import { SITE_URL } from "@/lib/site";
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
    <html lang="en-GB" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* the card scale is set before the first paint, so a card never jumps (src/lib/card-zoom.ts) */}
        <script dangerouslySetInnerHTML={{ __html: CARD_ZOOM_SCRIPT }} />
      </head>
      <body>
        <a className="skip sr-only-focusable" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
