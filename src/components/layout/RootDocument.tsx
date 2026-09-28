import { ViewTransition, type ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import { localeMeta, otherLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { pageHref } from "@/lib/routes";
import { alternateMap } from "@/lib/alternates";
import { agencySchema, graph, websiteSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header, type NavLink } from "./Header";
import { Footer } from "./Footer";
import { SmoothScroll } from "./SmoothScroll";
import { Cursor } from "./Cursor";
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

/** The <html> document shared by the Serbian and English root layouts. */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
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
    <html lang={localeMeta[locale].htmlLang} className={fontVariables} suppressHydrationWarning>
      <body className="theme-light min-h-screen pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0">
        <a
          href="#main"
          className="t-label fixed left-4 top-4 z-[300] -translate-y-24 rounded-full bg-mesing px-5 py-3 text-dunav focus:translate-y-0"
        >
          {dict.skip}
        </a>
        <JsonLd data={graph(agencySchema(locale, dict.brandLine), websiteSchema(locale, dict.brandLine))} />
        <SmoothScroll />
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
        <Footer locale={locale} dict={dict} />
        <MobileBar callLabel={dict.cta.call} bookLabel={dict.cta.book} bookHref={pageHref(locale, "contact")} />
        <DemoBadge label={dict.demoPill} dismiss={dict.dismiss} />
        <Cursor />
      </body>
    </html>
  );
}
