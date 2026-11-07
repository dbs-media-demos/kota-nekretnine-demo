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
import { ListingCard, priceLabel } from "@/components/listings/ListingCard";
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
    // Phones read in a real-estate order (listings, experience + reviews, how we work, tools); desktop keeps the DOM order.
    <div className="phone:flex phone:flex-col">
      <div className="phone:order-1">
        <HomeHero locale={locale} dict={dict} biz={biz} />
      </div>
      <div className="phone-later phone:order-6 [--later-h:1916.5px] [--later-at:0.7s]">
        <Elevator locale={locale} />
      </div>
      <div className="phone-later phone:order-2 [--later-h:657.75px] [--later-at:0.05s]">
        <FeaturedRail label={biz ? "Primeri oglasa" : c.featuredLabel[locale]} title={c.featuredTitle[locale]} allLabel={biz ? "Pogledajte sve nekretnine" : c.featuredAll[locale]} allHref={pageHref(locale, "listings")}>
          {featured.map((l, i) => (
            <div key={l.id} data-card className="w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[24vw] phone:row-start-2 phone:w-auto!">
              <ListingCard listing={l} locale={locale} dict={dict} sizes="(min-width: 1024px) 24vw, (min-width: 768px) 44vw, 66vw" priority={false} morph={i < 6} place={biz?.area} />
            </div>
          ))}
        </FeaturedRail>
      </div>
      <div className="phone-later phone:order-3 [--later-h:424.25px] [--later-at:0.25s]">
        <Manifesto locale={locale} biz={biz} />
      </div>
      {biz && (
        <div className="phone-later phone:order-7 [--later-h:640px] [--later-at:0.85s]">
          <PreviewMap biz={biz} dict={dict} />
        </div>
      )}
      {!biz && (
        <>
          <div className="phone-later phone:order-7 [--later-h:858.5px] [--later-at:0.85s]">
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
          </div>
          <div className="phone-later phone:order-8 [--later-h:471.25px] [--later-at:1s]">
            <HoodPanels locale={locale} label={c.hoodsLabel[locale]} title={c.hoodsTitle[locale]} />
          </div>
          <div className="phone-later phone:order-9 [--later-h:682.25px] [--later-at:1.1s]">
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
          </div>
        </>
      )}
      <div className="phone-later phone:order-4 [--later-h:1287px] [--later-at:0.4s]">
        <ReviewsMarquee
          locale={locale}
          dict={dict}
          label={c.reviewsLabel[locale]}
          title={c.reviewsTitle[locale]}
          allLabel={c.reviewsAll[locale]}
          allHref={pageHref(locale, "reviews")}
          biz={biz}
        />
      </div>
      {!biz && (
        <div className="phone-later phone:order-5 [--later-h:579.75px] [--later-at:0.55s]">
          <TeamStrip locale={locale} label={c.teamLabel[locale]} title={c.teamTitle[locale]} allLabel={c.teamAll[locale]} allHref={pageHref(locale, "about")} />
        </div>
      )}
    </div>
  );
}
