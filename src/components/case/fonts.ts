import { Nunito_Sans, Open_Sans } from "next/font/google";

/* The old Wix pages set headings in Avenir Heavy and body text in Open Sans. Avenir is used where it
   is installed (Apple devices); Nunito Sans is the closest open stand-in elsewhere. */
export const wixHeading = Nunito_Sans({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--wix-nunito", display: "swap" });
export const wixBody = Open_Sans({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--wix-open", display: "swap" });

/** Class names that expose both font variables to a page's root element. */
export const wixFonts = `${wixHeading.variable} ${wixBody.variable}`;
