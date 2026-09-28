import type { Locale, Localized } from "./i18n";

/** Deeply resolves every { sr, en } leaf of a copy object to one language. */
export type Picked<T> = T extends Localized<infer U> ? U : T extends readonly unknown[] ? { [K in keyof T]: Picked<T[K]> } : T extends object ? { [K in keyof T]: Picked<T[K]> } : T;

const isLocalized = (v: unknown): v is Localized<unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v) && Object.keys(v).length === 2 && "sr" in v && "en" in v;

export function pick<T>(value: T, locale: Locale): Picked<T> {
  if (isLocalized(value)) return value[locale] as Picked<T>;
  if (Array.isArray(value)) return value.map((v) => pick(v, locale)) as Picked<T>;
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, pick(v, locale)])) as Picked<T>;
  }
  return value as Picked<T>;
}
