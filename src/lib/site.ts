/**
 * Business facts for the fictional agency. Everything here is invented for the
 * Scale by Noon concept site; the phone number is an obvious placeholder.
 */
/** The agency that built this concept site. Single source for every credit link. */
export const agencyName = "Scale by Noon";
export const agencyUrl = "https://www.scalebynoon.com";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://kota-nekretnine-demo.vercel.app").replace(/\/$/, "");

/** Demos stay out of search engines unless explicitly switched on. */
export const noindex = process.env.NEXT_PUBLIC_NOINDEX !== "false";

export const site = {
  name: "Kota",
  legalName: "Kota nekretnine d.o.o.",
  nameLocalized: { sr: "Kota nekretnine", en: "Kota Real Estate" },
  url: siteUrl,
  email: "zdravo@kota-nekretnine.rs",
  phone: "+381210000000",
  phoneDisplay: "+381 21 000 0000",
  street: "Ulica Modene 3",
  postalCode: "21000",
  city: "Novi Sad",
  country: "RS",
  geo: { lat: 45.2559, lng: 19.8449 },
  timezone: "Europe/Belgrade",
  founded: 2014,
  registry: "RPN 000 (demo)",
  pib: "100000000 (demo)",
  commission: { sale: 2, rent: 50 },
  rating: { value: 4.9, count: 127 },
} as const;

/** Opening hours, 24h local time. Sunday: viewings by appointment only. */
export const hours: { day: number; open: string; close: string }[] = [
  { day: 1, open: "09:00", close: "19:00" },
  { day: 2, open: "09:00", close: "19:00" },
  { day: 3, open: "09:00", close: "19:00" },
  { day: 4, open: "09:00", close: "19:00" },
  { day: 5, open: "09:00", close: "19:00" },
  { day: 6, open: "10:00", close: "15:00" },
];

export const absoluteUrl = (path = "/") => `${siteUrl}${path === "/" ? "" : path}`;
