import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqs, faqGroups, type Faq } from "@/content/faq";
import { faqPage } from "@/content/pages-more";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { faqSchema, graph } from "@/lib/schema";
import { site } from "@/lib/site";

export function FaqView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const groups = Object.keys(faqGroups) as Faq["group"][];
  return (
    <>
      <JsonLd data={graph(faqSchema(faqs.map((f) => ({ q: f.q[locale], a: f.a[locale] }))))} />
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, url: pageHref(locale, "home") },
          { name: dict.nav.faq, url: pageHref(locale, "faq") },
        ]}
        label={faqPage.label[locale]}
        kota={3.2}
        title={faqPage.title[locale]}
        lead={faqPage.lead[locale]}
      />
      <section className="theme-light pb-24 md:pb-36" data-header="light">
        <div className="wrap grid gap-16">
          {groups.map((g, i) => (
            <div key={g} id={g} className="grid scroll-mt-28 gap-8 lg:grid-cols-[0.6fr_1.4fr]">
              <h2 className="t-h2">
                <span className="t-mono mr-3 align-top text-base text-accent">0{i + 1}</span>
                {faqGroups[g][locale]}
              </h2>
              <FaqList items={faqs.filter((f) => f.group === g)} locale={locale} />
            </div>
          ))}
        </div>
      </section>
      <CtaBand
        label={dict.nav.contact}
        title={locale === "sr" ? "Pitanje koje nije ovde?" : "A question that isn't here?"}
        text={locale === "sr" ? "Pozovite ili pišite; odgovaramo u roku od dva sata." : "Call or write; we reply within two hours."}
        primary={{ href: pageHref(locale, "contact"), label: dict.cta.contact }}
        secondary={{ href: `tel:${site.phone}`, label: site.phoneDisplay }}
      />
    </>
  );
}
