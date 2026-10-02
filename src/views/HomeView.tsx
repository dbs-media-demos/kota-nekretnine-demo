import { HomeHero } from "@/components/home/HomeHero";
import { Elevator } from "@/components/home/Elevator";
import { FeaturedRail } from "@/components/home/FeaturedRail";
import { MapTeaser } from "@/components/home/MapTeaser";
import { Manifesto } from "@/components/home/Manifesto";
import { HoodPanels } from "@/components/home/HoodPanels";
import { ValuationTeaser } from "@/components/home/ValuationTeaser";
import { ReviewsMarquee } from "@/components/home/ReviewsMarquee";
import { TeamStrip } from "@/components/home/TeamStrip";
import { homeCopy as c } from "@/content/home";
import { listings, listingById } from "@/content/listings";
import { guidedHoods, type HoodId } from "@/content/neighbourhoods";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { detailHref, pageHref } from "@/lib/routes";
import { priceLabel } from "@/components/listings/ListingCard";
import { PreviewMap } from "@/components/preview/PreviewMap";
import type { Biz } from "@/lib/biz-core";
import type { Listing } from "@/content/listings";

const FEATURED = ["l01", "l10", "l05", "l04", "l17", "l11", "l07"];

const ROOMS_SR: Record<number, string> = { 1: "Jednosoban", 1.5: "Jednoiposoban", 2: "Dvosoban", 2.5: "Dvoiposoban", 3: "Trosoban", 3.5: "Troiposoban", 4: "Četvorosoban", 5: "Petosoban" };

/** A preview's listing title without Novi Sad streets: "Trosoban stan sa terasom". */
function sampleTitle(l: Listing): string {
  const base =
    l.type === "house" ? "Kuća sa dvorištem" : l.type === "studio" ? "Garsonjera" : l.type === "penthouse" ? "Penthaus" : l.type === "loft" ? "Loft" : `${ROOMS_SR[l.rooms] ?? "Prostran"} stan`;
  return l.type !== "house" && l.features.includes("terrace") ? `${base} sa terasom` : base;
}

/**
 * The homepage. A personalised preview (/for/<token>, Serbian only) passes a real agency: its name,
 * rating, hours and a map of its address replace Kota's; listings become samples in its area, and
 * the Novi Sad map, neighbourhood guides, valuation tool and fictional team step aside.
 */
export function HomeView({ locale, biz }: { locale: Locale; biz?: Biz }) {
  const dict = getDictionary(locale);
  const featured = FEATURED.map((id) => listingById(id)!).map((l) => (biz ? { ...l, title: { sr: sampleTitle(l), en: sampleTitle(l) } } : l));
  const pins = listings.map((l) => ({ id: l.id, at: l.at, label: priceLabel(l, locale, dict), href: detailHref(locale, "listings", l.slug) }));
  const guideHrefs = Object.fromEntries(guidedHoods.map((h) => [h.id, detailHref(locale, "hoods", h.slug!)])) as Partial<Record<HoodId, string>>;

  return (
    <>
      <HomeHero locale={locale} dict={dict} biz={biz} />
      <Elevator locale={locale} />
      <FeaturedRail
        locale={locale}
        dict={dict}
        items={featured}
        label={biz ? "Primeri oglasa" : c.featuredLabel[locale]}
        title={c.featuredTitle[locale]}
        allLabel={biz ? "Pogledajte sve nekretnine" : c.featuredAll[locale]}
        allHref={pageHref(locale, "listings")}
        place={biz?.area}
      />
      <Manifesto locale={locale} biz={biz} />
      {biz && <PreviewMap biz={biz} dict={dict} />}
      {!biz && (
        <>
      <MapTeaser
        locale={locale}
        label={c.mapLabel[locale]}
        title={c.mapTitle[locale]}
        lead={c.mapLead[locale]}
        guideLabel={c.guide[locale]}
        pins={pins}
        guideHrefs={guideHrefs}
        listingsHref={pageHref(locale, "listings")}
      />
      <HoodPanels locale={locale} label={c.hoodsLabel[locale]} title={c.hoodsTitle[locale]} />
      <ValuationTeaser
        locale={locale}
        href={pageHref(locale, "valuation")}
        photoAlt={listingById("l10")!.photos[1][locale]}
        copy={{
          label: c.valLabel[locale],
          title: c.valTitle[locale],
          lead: c.valLead[locale],
          area: c.valArea[locale],
          hood: c.valHood[locale],
          range: c.valRange[locale],
          cta: c.valCta[locale],
        }}
      />
        </>
      )}
      <ReviewsMarquee
        locale={locale}
        dict={dict}
        label={c.reviewsLabel[locale]}
        title={c.reviewsTitle[locale]}
        allLabel={c.reviewsAll[locale]}
        allHref={pageHref(locale, "reviews")}
        biz={biz}
      />
      {!biz && <TeamStrip locale={locale} label={c.teamLabel[locale]} title={c.teamTitle[locale]} allLabel={c.teamAll[locale]} allHref={pageHref(locale, "about")} />}
    </>
  );
}
