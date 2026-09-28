import type { Localized } from "@/lib/i18n";

/** Illustrative floor plans in metres. Rooms are scaled so the total matches the listing's area. */
export type Room = { x: number; y: number; w: number; h: number; label: Localized<string>; outdoor?: boolean };
export type PlanKey = "studio" | "onehalf" | "two" | "twohalf" | "three" | "four" | "house" | "loft";

const L = (sr: string, en: string) => ({ sr, en });

export const plans: Record<PlanKey, { rooms: Room[]; note?: Localized<string> }> = {
  studio: {
    rooms: [
      { x: 0, y: 0, w: 6.2, h: 3.4, label: L("Dnevni boravak", "Living / sleeping") },
      { x: 0, y: 3.4, w: 2.6, h: 2.1, label: L("Kuhinja", "Kitchen") },
      { x: 2.6, y: 3.4, w: 2.0, h: 2.1, label: L("Kupatilo", "Bath") },
      { x: 4.6, y: 3.4, w: 1.6, h: 2.1, label: L("Ulaz", "Hall") },
    ],
  },
  onehalf: {
    rooms: [
      { x: 0, y: 0, w: 4.4, h: 3.6, label: L("Dnevna soba", "Living room") },
      { x: 4.4, y: 0, w: 3.0, h: 3.6, label: L("Polusoba", "Half room") },
      { x: 0, y: 3.6, w: 3.0, h: 2.2, label: L("Kuhinja", "Kitchen") },
      { x: 3.0, y: 3.6, w: 2.2, h: 2.2, label: L("Kupatilo", "Bath") },
      { x: 5.2, y: 3.6, w: 2.2, h: 2.2, label: L("Ulaz", "Hall") },
    ],
  },
  two: {
    rooms: [
      { x: 0, y: 0, w: 5.2, h: 4.0, label: L("Dnevna soba", "Living room") },
      { x: 5.2, y: 0, w: 4.0, h: 2.8, label: L("Kuhinja i trpezarija", "Kitchen & dining") },
      { x: 5.2, y: 2.8, w: 4.0, h: 3.8, label: L("Spavaća soba", "Bedroom") },
      { x: 0, y: 4.0, w: 2.4, h: 2.6, label: L("Kupatilo", "Bath") },
      { x: 2.4, y: 4.0, w: 2.8, h: 2.6, label: L("Hodnik", "Hall") },
      { x: 0, y: -1.6, w: 5.2, h: 1.6, label: L("Terasa", "Terrace"), outdoor: true },
    ],
  },
  twohalf: {
    rooms: [
      { x: 0, y: 0, w: 5.5, h: 4.2, label: L("Dnevna soba", "Living room") },
      { x: 5.5, y: 0, w: 4.5, h: 2.6, label: L("Kuhinja", "Kitchen") },
      { x: 5.5, y: 2.6, w: 4.5, h: 4.5, label: L("Spavaća soba", "Bedroom") },
      { x: 0, y: 4.2, w: 3.0, h: 2.9, label: L("Polusoba", "Half room") },
      { x: 3.0, y: 4.2, w: 2.5, h: 2.9, label: L("Kupatilo", "Bath") },
    ],
  },
  three: {
    rooms: [
      { x: 0, y: 0, w: 6.0, h: 4.4, label: L("Dnevna soba", "Living room") },
      { x: 6.0, y: 0, w: 5.4, h: 2.8, label: L("Kuhinja i trpezarija", "Kitchen & dining") },
      { x: 6.0, y: 2.8, w: 5.4, h: 4.4, label: L("Spavaća soba", "Main bedroom") },
      { x: 0, y: 4.4, w: 3.4, h: 2.8, label: L("Dečja soba", "Second bedroom") },
      { x: 3.4, y: 4.4, w: 2.6, h: 2.8, label: L("Kupatilo", "Bath") },
      { x: 0, y: -1.8, w: 6.0, h: 1.8, label: L("Terasa", "Terrace"), outdoor: true },
    ],
  },
  four: {
    rooms: [
      { x: 0, y: 0, w: 7.0, h: 5.0, label: L("Salon", "Salon") },
      { x: 7.0, y: 0, w: 4.0, h: 5.0, label: L("Trpezarija", "Dining room") },
      { x: 11.0, y: 0, w: 3.0, h: 5.0, label: L("Kuhinja", "Kitchen") },
      { x: 0, y: 5.0, w: 4.5, h: 4.2, label: L("Spavaća soba", "Bedroom") },
      { x: 4.5, y: 5.0, w: 3.6, h: 4.2, label: L("Radna soba", "Study") },
      { x: 8.1, y: 5.0, w: 2.4, h: 4.2, label: L("Kupatilo", "Bath") },
      { x: 10.5, y: 5.0, w: 3.5, h: 4.2, label: L("Hol", "Hall") },
    ],
  },
  house: {
    note: L("Prikazano prizemlje. Sprat ima tri spavaće sobe i dva kupatila.", "Ground floor shown. Upstairs has three bedrooms and two baths."),
    rooms: [
      { x: 0, y: 0, w: 7.0, h: 6.0, label: L("Dnevni boravak", "Living room") },
      { x: 7.0, y: 0, w: 5.0, h: 6.0, label: L("Kuhinja i trpezarija", "Kitchen & dining") },
      { x: 0, y: 6.0, w: 4.0, h: 4.0, label: L("Radna soba", "Study") },
      { x: 4.0, y: 6.0, w: 2.5, h: 4.0, label: L("Kupatilo", "Bath") },
      { x: 6.5, y: 6.0, w: 5.5, h: 4.0, label: L("Ulaz i stepenište", "Entry & stairs") },
      { x: 0, y: -3.0, w: 12.0, h: 3.0, label: L("Terasa ka bašti", "Garden terrace"), outdoor: true },
    ],
  },
  loft: {
    note: L("Iznad kuhinje i kupatila je galerija od 22 m² sa spavaćim delom.", "A 22 m² gallery with the sleeping area sits above the kitchen and bath."),
    rooms: [
      { x: 0, y: 0, w: 8.0, h: 8.0, label: L("Otvoreni prostor", "Open-plan living") },
      { x: 8.0, y: 0, w: 4.0, h: 4.0, label: L("Kuhinja", "Kitchen") },
      { x: 8.0, y: 4.0, w: 4.0, h: 4.0, label: L("Kupatilo", "Bath") },
    ],
  },
};

/** Indoor area of a template, in m². */
export const planArea = (key: PlanKey) =>
  plans[key].rooms.filter((r) => !r.outdoor).reduce((sum, r) => sum + r.w * r.h, 0);
