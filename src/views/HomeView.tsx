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

const FEATURED = ["l01", "l10", "l05", "l04", "l17", "l11", "l07"];

export function HomeView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const featured = FEATURED.map((id) => listingById(id)!);
  const pins = listings.map((l) => ({ id: l.id, at: l.at, label: priceLabel(l, locale, dict), href: detailHref(locale, "listings", l.slug) }));
  const guideHrefs = Object.fromEntries(guidedHoods.map((h) => [h.id, detailHref(locale, "hoods", h.slug!)])) as Partial<Record<HoodId, string>>;

  return (
    <>
      <HomeHero locale={locale} dict={dict} />
      <Elevator locale={locale} />
      <FeaturedRail
        locale={locale}
        dict={dict}
        items={featured}
        label={c.featuredLabel[locale]}
        title={c.featuredTitle[locale]}
        allLabel={c.featuredAll[locale]}
        allHref={pageHref(locale, "listings")}
      />
      <Manifesto locale={locale} />
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
      <ReviewsMarquee
        locale={locale}
        dict={dict}
        label={c.reviewsLabel[locale]}
        title={c.reviewsTitle[locale]}
        allLabel={c.reviewsAll[locale]}
        allHref={pageHref(locale, "reviews")}
      />
      <TeamStrip locale={locale} label={c.teamLabel[locale]} title={c.teamTitle[locale]} allLabel={c.teamAll[locale]} allHref={pageHref(locale, "about")} />
    </>
  );
}
