import type { Metadata, Viewport } from "next";
import { noindex, site, siteUrl } from "./site";
import type { Locale } from "./i18n";
import { getDictionary } from "@/i18n/dictionary";

export function rootMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  const brand = site.nameLocalized[locale];
  return {
    metadataBase: new URL(siteUrl),
    title: { default: brand, template: `%s | ${brand}` },
    description: dict.brandLine,
    applicationName: brand,
    authors: [{ name: "DBS Media", url: "https://dbs-media.com" }],
    creator: "DBS Media",
    publisher: site.legalName,
    category: "Real estate",
    formatDetection: { telephone: false, email: false, address: false },
    robots: noindex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    other: { "geo.region": "RS-VO", "geo.placename": "Novi Sad", "geo.position": `${site.geo.lat};${site.geo.lng}` },
  };
}

export const rootViewport: Viewport = {
  themeColor: "#eee8df",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};
