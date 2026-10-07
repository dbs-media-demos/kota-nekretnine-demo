import localFont from "next/font/local";
import { Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";

/**
 * Display serif: Source Serif 4, self-hosted as a static instance at the display optical
 * size (opsz 60) and weight 500, subset to Latin + Serbian Latin. ~23 KB per style instead
 * of the ~400 KB+ variable files. (Replaced Bodoni Moda on 2026-10-07: its hairlines were too thin.)
 */
export const displaySerif = localFont({
  src: [
    { path: "../assets/webfonts/SourceSerif4-Display-500.woff2", weight: "500", style: "normal" },
    { path: "../assets/webfonts/SourceSerif4-Display-500-Italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-display-serif",
  display: "swap",
  // Keep fallback names simple: next/font emits them unquoted.
  fallback: ["Georgia", "serif"],
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
});

export const fontVariables = `${displaySerif.variable} ${hanken.variable} ${plexMono.variable}`;
