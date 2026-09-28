import localFont from "next/font/local";
import { Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";

/**
 * Display serif: Bodoni Moda, self-hosted as the static opsz-96 cut (the high-contrast
 * display instance). ~20 KB per style instead of the ~100 KB variable files.
 */
export const bodoni = localFont({
  src: [
    { path: "../assets/webfonts/BodoniModa-96.woff2", weight: "400", style: "normal" },
    { path: "../assets/webfonts/BodoniModa-96-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-bodoni",
  display: "swap",
  fallback: ["Didot", "Bodoni 72", "Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

/** Grotesk for body copy and UI. */
export const hanken = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-hanken",
  display: "swap",
});

/** Architectural annotations: kotas, m², prices, room counts. */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  variable: "--font-plex",
  display: "swap",
  preload: false,
});

export const fontVariables = `${bodoni.variable} ${hanken.variable} ${plexMono.variable}`;
