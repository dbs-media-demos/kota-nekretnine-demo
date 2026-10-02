import { ViewTransition, type ReactNode } from "react";
import { otherLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { pageHref } from "@/lib/routes";
import { alternateMap } from "@/lib/alternates";
import { agencySchema, graph, websiteSchema } from "@/lib/schema";
import type { Biz } from "@/lib/biz-core";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header, type NavLink } from "./Header";
import { Footer } from "./Footer";
import { DemoBadge } from "./DemoBadge";
import { MobileBar } from "./MobileBar";

const menuImages: Record<string, string> = {
  home: "/images/city/hero-stari-grad-sunset.jpg",
  listings: "/images/listings/l01/01.jpg",
  hoods: "/images/city/tvrdjava-leto.jpg",
  sell: "/images/listings/l05/01.jpg",
  valuation: "/images/listings/l10/01.jpg",
  about: "/images/city/zmaj-jovina.jpg",
  reviews: "/images/life/kafic-terasa.jpg",
  faq: "/images/listings/l04/01.jpg",
  contact: "/images/city/trg-slobode.jpg",
};

/**
 * Header, the page, footer, the phone bar and the demo badge. Client parts read the business
 * from BizProvider; a personalised preview also passes `biz` for the server-rendered footer.
 */
export function SiteChrome({ locale, biz, children }: { locale: Locale; biz?: Biz; children: ReactNode }) {
  const dict = getDictionary(locale);
  const link = (key: keyof typeof dict.nav & keyof typeof menuImages): NavLink => ({
    key,
    label: dict.nav[key],
    href: pageHref(locale, key as Parameters<typeof pageHref>[1]),
    image: menuImages[key],
  });
  const primary = (["listings", "hoods", "sell", "valuation", "about"] as const).map(link);
  const menu = (["home", "listings", "hoods", "sell", "valuation", "about", "reviews", "faq", "contact"] as const).map(link);

  return (
    <>
      {!biz && <JsonLd data={graph(agencySchema(locale, dict.brandLine), websiteSchema(locale, dict.brandLine))} />}
      <Header
        locale={locale}
        dict={dict}
        primary={primary}
        menu={menu}
        homeHref={pageHref(locale, "home")}
        bookHref={pageHref(locale, "contact")}
        altMap={alternateMap(locale)}
        otherHome={pageHref(otherLocale(locale), "home")}
      />
      <ViewTransition>
        <main id="main">{children}</main>
      </ViewTransition>
      <Footer locale={locale} dict={dict} biz={biz} />
      <MobileBar callLabel={dict.cta.call} bookLabel={dict.cta.book} bookHref={pageHref(locale, "contact")} />
      <DemoBadge label={biz ? `Pregled za ${biz.shortName} · Scale by Noon` : dict.demoPill} dismiss={dict.dismiss} />
    </>
  );
}
