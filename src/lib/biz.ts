import { hours, site } from "./site";
import { type Biz, type DayHours } from "./biz-core";

export type { Biz } from "./biz-core";

/** The fictional agency as a Biz: what the concept site shows (previews swap in a real one). */
export const defaultBiz: Biz = {
  lang: "sr",
  name: site.legalName,
  shortName: site.name,
  tagline: null,
  area: site.city,
  phone: site.phone,
  phoneDisplay: site.phoneDisplay,
  address: { street: site.street, city: site.city, region: "", postal: site.postalCode, full: `${site.street}, ${site.postalCode} ${site.city}` },
  timezone: site.timezone,
  hours: [0, 1, 2, 3, 4, 5, 6].map((day): DayHours => {
    const h = hours.find((x) => x.day === day);
    return { day, open: h?.open ?? null, close: h?.close ?? null };
  }),
  hoursSummary: "",
  rating: { ...site.rating },
  preview: false,
};
