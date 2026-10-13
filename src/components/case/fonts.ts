import localFont from "next/font/local";

/* The old Wix pages set headings in Avenir Heavy and body text in Open Sans. Avenir is used where it
   is installed (Apple devices); Nunito Sans is the closest open stand-in elsewhere.

   Both are self-hosted from @fontsource-variable (the Google Fonts files, latin subset), so a build never
   fetches fonts.googleapis.com. Each weight the page used to ask Google for is its own face on the same
   variable file, so the browser renders the same instances as before. Font loader options must be literals.

   No preload: these faces belong to the [slug] route, so a preload would make every case page (and every
   printed sheet that prefetches one) download them, though only the hidden WildEcho page uses them. */
export const wixHeading = localFont({
  src: [
    { path: "../../../node_modules/@fontsource-variable/nunito-sans/files/nunito-sans-latin-wght-normal.woff2", weight: "700", style: "normal" },
    { path: "../../../node_modules/@fontsource-variable/nunito-sans/files/nunito-sans-latin-wght-normal.woff2", weight: "800", style: "normal" },
    { path: "../../../node_modules/@fontsource-variable/nunito-sans/files/nunito-sans-latin-wght-normal.woff2", weight: "900", style: "normal" },
  ],
  variable: "--wix-nunito",
  display: "swap",
  preload: false,
});
export const wixBody = localFont({
  src: [
    { path: "../../../node_modules/@fontsource-variable/open-sans/files/open-sans-latin-wght-normal.woff2", weight: "400", style: "normal" },
    { path: "../../../node_modules/@fontsource-variable/open-sans/files/open-sans-latin-wght-normal.woff2", weight: "600", style: "normal" },
    { path: "../../../node_modules/@fontsource-variable/open-sans/files/open-sans-latin-wght-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--wix-open",
  display: "swap",
  preload: false,
});

/** Class names that expose both font variables to a page's root element. */
export const wixFonts = `${wixHeading.variable} ${wixBody.variable}`;
