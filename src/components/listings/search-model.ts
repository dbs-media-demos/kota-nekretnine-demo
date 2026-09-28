import type { Deal, Feature, Listing, PropertyType } from "@/content/listings";
import type { HoodId } from "@/content/neighbourhoods";

export type View = "grid" | "list" | "map";
export type Sort = "new" | "price-asc" | "price-desc" | "area-desc";

export type Filters = {
  deal: "all" | Deal;
  types: PropertyType[];
  hoods: HoodId[];
  min: number | null;
  max: number | null;
  area: number | null;
  rooms: string[];
  f: Feature[];
  sort: Sort;
  view: View;
};

export const DEFAULT_FILTERS: Filters = { deal: "all", types: [], hoods: [], min: null, max: null, area: null, rooms: [], f: [], sort: "new", view: "grid" };

export const PRICE_BOUNDS: Record<Deal, { min: number; max: number; step: number }> = {
  sale: { min: 50000, max: 800000, step: 5000 },
  rent: { min: 300, max: 1500, step: 50 },
};

export const ROOM_OPTIONS = ["0.5", "1.0", "1.5", "2.0", "2.5", "3.0", "4.0"];
export const AREA_OPTIONS = [30, 50, 70, 100, 150];
export const FILTER_FEATURES: Feature[] = ["terrace", "parking", "elevator", "registered"];

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);
const numOrNull = (v: string | null) => (v && !Number.isNaN(Number(v)) ? Number(v) : null);

export function parseFilters(search: string): Filters {
  const q = new URLSearchParams(search);
  const deal = q.get("deal");
  const sort = q.get("sort");
  const view = q.get("view");
  return {
    deal: deal === "sale" || deal === "rent" ? deal : "all",
    types: list(q.get("type")) as PropertyType[],
    hoods: list(q.get("hood")) as HoodId[],
    min: numOrNull(q.get("min")),
    max: numOrNull(q.get("max")),
    area: numOrNull(q.get("m2")),
    rooms: list(q.get("rooms")),
    f: list(q.get("f")) as Feature[],
    sort: sort === "price-asc" || sort === "price-desc" || sort === "area-desc" ? sort : "new",
    view: view === "list" || view === "map" ? view : "grid",
  };
}

export function serializeFilters(f: Filters): string {
  const q = new URLSearchParams();
  if (f.deal !== "all") q.set("deal", f.deal);
  if (f.types.length) q.set("type", f.types.join(","));
  if (f.hoods.length) q.set("hood", f.hoods.join(","));
  if (f.deal !== "all" && f.min !== null) q.set("min", String(f.min));
  if (f.deal !== "all" && f.max !== null) q.set("max", String(f.max));
  if (f.area !== null) q.set("m2", String(f.area));
  if (f.rooms.length) q.set("rooms", f.rooms.join(","));
  if (f.f.length) q.set("f", f.f.join(","));
  if (f.sort !== "new") q.set("sort", f.sort);
  if (f.view !== "grid") q.set("view", f.view);
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function matches(l: Listing, f: Filters) {
  if (f.deal !== "all" && l.deal !== f.deal) return false;
  if (f.types.length && !f.types.includes(l.type)) return false;
  if (f.hoods.length && !f.hoods.includes(l.hood)) return false;
  if (f.deal !== "all") {
    if (f.min !== null && l.price < f.min) return false;
    if (f.max !== null && l.price > f.max) return false;
  }
  if (f.area !== null && l.area < f.area) return false;
  if (f.rooms.length) {
    const r = l.rooms.toFixed(1);
    const ok = f.rooms.some((opt) => (opt === "4.0" ? l.rooms >= 4 : opt === r));
    if (!ok) return false;
  }
  if (f.f.length && !f.f.every((x) => l.features.includes(x))) return false;
  return true;
}

export function sortListings(items: Listing[], sort: Sort) {
  const copy = [...items];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "area-desc":
      return copy.sort((a, b) => b.area - a.area);
    default:
      return copy.sort((a, b) => b.listed.localeCompare(a.listed));
  }
}

export const activeCount = (f: Filters) =>
  (f.deal !== "all" ? 1 : 0) +
  f.types.length +
  f.hoods.length +
  (f.deal !== "all" && (f.min !== null || f.max !== null) ? 1 : 0) +
  (f.area !== null ? 1 : 0) +
  f.rooms.length +
  f.f.length;
