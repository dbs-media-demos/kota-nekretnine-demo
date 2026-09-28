import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { pagePaths, detailAlternates } from "@/lib/routes";
import { listings } from "@/content/listings";
import { guidedHoods } from "@/content/neighbourhoods";
import type { Localized } from "@/lib/i18n";

const SITE_UPDATED = new Date("2026-09-28");

type Entry = { pair: Localized<string>; lastModified: Date; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] };

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [
    ...Object.entries(pagePaths).map(([key, pair]) => ({
      pair,
      lastModified: SITE_UPDATED,
      priority: key === "home" ? 1 : ["listings", "valuation", "sell"].includes(key) ? 0.9 : key === "privacy" ? 0.2 : 0.7,
      changeFrequency: (["home", "listings"].includes(key) ? "daily" : "monthly") as Entry["changeFrequency"],
    })),
    ...listings.map((l) => ({ pair: detailAlternates("listings", l.slug), lastModified: new Date(l.listed), priority: 0.8, changeFrequency: "weekly" as const })),
    ...guidedHoods.map((h) => ({ pair: detailAlternates("hoods", h.slug!), lastModified: SITE_UPDATED, priority: 0.7, changeFrequency: "monthly" as const })),
  ];

  // One <url> per language version, each listing all alternates (hreflang).
  return entries.flatMap(({ pair, lastModified, priority, changeFrequency }) =>
    (["sr", "en"] as const).map((locale) => ({
      url: absoluteUrl(pair[locale]),
      lastModified,
      changeFrequency,
      priority: locale === "sr" ? priority : Math.max(0.1, +(priority - 0.1).toFixed(1)),
      alternates: { languages: { sr: absoluteUrl(pair.sr), en: absoluteUrl(pair.en), "x-default": absoluteUrl(pair.sr) } },
    })),
  );
}
