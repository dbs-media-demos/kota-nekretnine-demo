import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kota nekretnine · Novi Sad",
    short_name: "Kota",
    description: "Butik agencija za nekretnine u Novom Sadu.",
    start_url: "/",
    display: "standalone",
    background_color: "#eee8df",
    theme_color: "#13283b",
    lang: "sr-Latn",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
