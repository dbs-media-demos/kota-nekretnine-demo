import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { ListingsSearch } from "@/components/listings/ListingsSearch";
import { listingsPage as c } from "@/content/pages";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";

export function ListingsView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <>
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, url: pageHref(locale, "home") },
          { name: c.title[locale], url: pageHref(locale, "listings") },
        ]}
        label={c.label[locale]}
        kota={3.2}
        title={c.title[locale]}
        lead={c.lead[locale]}
      />
      <ListingsSearch locale={locale} dict={dict} contactHref={pageHref(locale, "contact")} />
      <CtaBand
        label={dict.nav.contact}
        title={c.alertTitle[locale]}
        text={c.alertText[locale]}
        primary={{ href: pageHref(locale, "contact"), label: c.tellUs[locale] }}
        secondary={{ href: pageHref(locale, "valuation"), label: dict.cta.valuation }}
        image={{ src: "/images/city/dunav-most-dusk.jpg", alt: "" }}
      />
    </>
  );
}
