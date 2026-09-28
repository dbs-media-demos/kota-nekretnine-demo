import { hoods, type HoodId } from "@/content/neighbourhoods";

/**
 * Illustrative valuation model. Base €/m² per neighbourhood, adjusted for
 * floor, condition and features. Real valuations are confirmed by an agent.
 */
export type Condition = "renovate" | "good" | "renovated" | "new";
export type FloorBand = "ground" | "low" | "mid" | "top" | "topNoLift" | "house";
export type ValFeature = "terrace" | "parking" | "elevator" | "registered" | "view" | "garden";

export const conditionFactor: Record<Condition, number> = { renovate: -0.15, good: 0, renovated: 0.08, new: 0.12 };
export const floorFactor: Record<FloorBand, number> = { ground: -0.07, low: 0, mid: 0.03, top: 0.02, topNoLift: -0.05, house: 0 };
export const featureFactor: Record<ValFeature, number> = {
  terrace: 0.03,
  parking: 0.05,
  elevator: 0.02,
  registered: 0,
  view: 0.06,
  garden: 0.04,
};
/** Not registered in the land registry: banks won't lend, buyers discount heavily. */
export const unregisteredPenalty = -0.1;

export type ValuationInput = {
  hood: HoodId;
  area: number;
  floor: FloorBand;
  condition: Condition;
  features: ValFeature[];
};

export function estimate({ hood, area, floor, condition, features }: ValuationInput) {
  const base = hoods.find((h) => h.id === hood)?.pricePerM2 ?? 2400;
  let factor = 1 + conditionFactor[condition] + floorFactor[floor];
  for (const f of features) factor += featureFactor[f];
  if (!features.includes("registered")) factor += unregisteredPenalty;
  // Small flats sell for more per m², large ones for less.
  const sizeFactor = area < 40 ? 0.06 : area > 110 ? -0.05 : 0;
  factor += sizeFactor;
  const perM2 = Math.round(base * factor);
  const mid = perM2 * area;
  const round = (v: number) => Math.round(v / 1000) * 1000;
  return { perM2, low: round(mid * 0.94), mid: round(mid), high: round(mid * 1.06), base };
}
