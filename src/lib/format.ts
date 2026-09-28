import type { Locale } from "./i18n";

const nf = (locale: Locale, opts?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(locale === "sr" ? "sr-Latn-RS" : "en-GB", opts);

/** 198000 → "198.000 €" (sr) / "€198,000" (en) */
export const eur = (value: number, locale: Locale) =>
  locale === "sr" ? `${nf(locale, { maximumFractionDigits: 0 }).format(value)} €` : `€${nf(locale, { maximumFractionDigits: 0 }).format(value)}`;

export const num = (value: number, locale: Locale, digits = 0) =>
  nf(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);

/** Serbian room notation: 0.5 garsonjera, 1.5, 2.0 … always one decimal. */
export const rooms = (value: number) => value.toFixed(1);

/** Elevation label: 9.6 → "+9.60", 0 → "±0.00" */
export const kota = (value: number) => (value === 0 ? "±0.00" : `${value > 0 ? "+" : "−"}${Math.abs(value).toFixed(2)}`);

export const m2 = (value: number, locale: Locale) => `${num(value, locale)} m²`;

export const perM2 = (price: number, area: number, locale: Locale) => `${eur(Math.round(price / area), locale)}/m²`;
