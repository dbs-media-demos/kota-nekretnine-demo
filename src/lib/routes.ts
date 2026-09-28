import type { Locale, Localized } from "./i18n";

/** Localized URL paths. Serbian lives at the root, English under /en. */
export const pagePaths = {
  home: { sr: "/", en: "/en" },
  listings: { sr: "/nekretnine", en: "/en/listings" },
  sell: { sr: "/prodajte-sa-nama", en: "/en/sell-with-us" },
  valuation: { sr: "/procena", en: "/en/valuation" },
  hoods: { sr: "/kraj-po-kraj", en: "/en/neighbourhoods" },
  about: { sr: "/o-nama", en: "/en/about" },
  reviews: { sr: "/utisci", en: "/en/reviews" },
  faq: { sr: "/cesta-pitanja", en: "/en/faq" },
  contact: { sr: "/kontakt", en: "/en/contact" },
  privacy: { sr: "/privatnost", en: "/en/privacy" },
} satisfies Record<string, Localized<string>>;

export type PageKey = keyof typeof pagePaths;
export type DetailKey = "listings" | "hoods";

export const pageHref = (locale: Locale, key: PageKey) => pagePaths[key][locale];

export const detailHref = (locale: Locale, key: DetailKey, slug: Localized<string>) =>
  `${pagePaths[key][locale]}/${slug[locale]}`;

export const pageAlternates = (key: PageKey): Localized<string> => pagePaths[key];

export const detailAlternates = (key: DetailKey, slug: Localized<string>): Localized<string> => ({
  sr: detailHref("sr", key, slug),
  en: detailHref("en", key, slug),
});
