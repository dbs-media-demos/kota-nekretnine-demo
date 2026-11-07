import type { Localized } from "@/lib/i18n";

export type HoodId =
  | "stari-grad"
  | "liman"
  | "grbavica"
  | "podbara"
  | "petrovaradin"
  | "sremska-kamenica"
  | "detelinara"
  | "novo-naselje";

/** What the map, price list and valuation need. Kept apart from the guides so their copy stays off the client. */
export type HoodGeo = {
  id: HoodId;
  name: Localized<string>;
  bank: "north" | "south";
  /** SVG map geometry, viewBox 0 0 1000 700 */
  shape: string;
  center: [number, number];
  pricePerM2: number;
};

export const hoodGeo: HoodGeo[] = [
  {
    id: "stari-grad",
    name: { sr: "Stari grad", en: "Stari grad" },
    bank: "north",
    shape: "M420 290 L560 250 L640 300 L622 440 L470 426 Z",
    center: [540, 352],
    pricePerM2: 3150,
  },
  {
    id: "liman",
    name: { sr: "Liman", en: "Liman" },
    bank: "north",
    shape: "M300 460 L470 426 L612 441 L602 478 L470 524 L340 562 Z",
    center: [455, 485],
    pricePerM2: 2950,
  },
  {
    id: "grbavica",
    name: { sr: "Grbavica", en: "Grbavica" },
    bank: "north",
    shape: "M250 305 L420 292 L470 426 L300 458 Z",
    center: [360, 372],
    pricePerM2: 2650,
  },
  {
    id: "podbara",
    name: { sr: "Podbara", en: "Podbara" },
    bank: "north",
    shape: "M560 250 L700 182 L850 250 L812 384 L700 442 L640 300 Z",
    center: [718, 316],
    pricePerM2: 2450,
  },
  {
    id: "petrovaradin",
    name: { sr: "Petrovaradin", en: "Petrovaradin" },
    bank: "south",
    shape: "M560 542 L660 500 L760 462 L860 420 L900 520 L760 602 L600 612 Z",
    center: [735, 540],
    pricePerM2: 2300,
  },
  {
    id: "sremska-kamenica",
    name: { sr: "Sremska Kamenica", en: "Sremska Kamenica" },
    bank: "south",
    shape: "M220 652 L360 612 L500 576 L540 642 L420 700 L230 700 Z",
    center: [385, 650],
    pricePerM2: 2100,
  },
  {
    id: "detelinara",
    name: { sr: "Detelinara", en: "Detelinara" },
    bank: "north",
    shape: "M230 152 L400 122 L420 292 L250 305 L240 300 Z",
    center: [325, 215],
    pricePerM2: 2250,
  },
  {
    id: "novo-naselje",
    name: { sr: "Novo naselje", en: "Novo naselje" },
    bank: "north",
    shape: "M60 252 L230 222 L250 305 L300 458 L90 420 Z",
    center: [175, 330],
    pricePerM2: 2200,
  },
];

/** Landmarks used for walk times and on the map. */
export const landmarks = [
  { id: "park", name: { sr: "Dunavski park", en: "Danube Park" }, at: [592, 382] as [number, number] },
  { id: "fortress", name: { sr: "Petrovaradinska tvrđava", en: "Petrovaradin Fortress" }, at: [690, 520] as [number, number] },
  { id: "spens", name: { sr: "SPENS", en: "SPENS" }, at: [505, 420] as [number, number] },
  { id: "promenada", name: { sr: "Promenada", en: "Promenada mall" }, at: [432, 418] as [number, number] },
] as const;

/** Map river centreline and bridges. */
export const river = "M-20 612 C 120 618, 260 610, 360 578 S 540 505, 640 472 S 790 410, 860 368 S 960 318, 1020 300";
export const bridges = [
  { name: { sr: "Most slobode", en: "Liberty Bridge" }, d: "M414 522 L432 590" },
  { name: { sr: "Varadinski most", en: "Varadin Bridge" }, d: "M630 448 L652 500" },
  { name: { sr: "Žeželjev most", en: "Žeželj Bridge" }, d: "M772 404 L800 452" },
];
