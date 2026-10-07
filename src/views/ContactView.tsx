import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { ViewingForm } from "@/components/forms/ViewingForm";
import { NoviSadMap } from "@/components/map/NoviSadMap";
import { OpenStatus } from "@/components/layout/OpenStatus";
import { SplitReveal } from "@/components/ui/Reveal";
import { contactPage } from "@/content/pages-more";
import { listingPage } from "@/content/pages";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { pick } from "@/lib/pick";
import { hours, site } from "@/lib/site";

export function ContactView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const c = pick(contactPage, locale);
  const v = pick(listingPage.viewing, locale);
  return (
    <>
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, url: pageHref(locale, "home") },
          { name: dict.nav.contact, url: pageHref(locale, "contact") },
        ]}
        label={c.label}
        kota={0}
        title={c.title}
        lead={c.lead}
      />

      <section className="theme-light pb-24 md:pb-32" data-header="light">
        <div className="wrap grid grid-cols-1 gap-16 border-t border-line pt-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="grid min-w-0 grid-cols-1 content-start gap-10">
            <div>
              <p className="t-label text-muted">{c.office}</p>
              <address className="mt-4 not-italic">
                <span className="font-serif text-3xl leading-tight">{site.street}</span>
                <br />
                <span className="text-muted">
                  {site.postalCode} {site.city} · {c.directions}
                </span>
              </address>
            </div>
            <div className="grid gap-2">
              <a href={`tel:${site.phone}`} className="t-mono link-u w-fit text-2xl">
                {site.phoneDisplay}
              </a>
              <a href={`mailto:${site.email}`} className="link-u w-fit">
                {site.email}
              </a>
            </div>
            <div>
              <OpenStatus dict={dict} />
              <dl className="t-mono mt-4 grid max-w-xs grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
                {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                  const h = hours.find((x) => x.day === d);
                  return (
                    <div key={d} className="contents">
                      <dt className="text-muted">{dict.days[d]}</dt>
                      <dd>{h ? `${h.open}–${h.close}` : "—"}</dd>
                    </div>
                  );
                })}
              </dl>
              <p className="mt-3 text-sm text-muted">{dict.sundayNote}</p>
            </div>
            <div className="bg-kamen p-3 text-dunav">
              <NoviSadMap
                locale={locale}
                title={c.mapTitle}
                pins={[{ id: "office", at: [538, 336], label: "Kota ▽ Modene 3" }]}
                activePin="office"
                activeHood="stari-grad"
                viewBox="330 200 440 300"
                animate={false}
              />
            </div>
          </div>
          <div>
            <p className="t-label text-accent">▽ {c.formLabel}</p>
            <div className="mt-6 bg-kreda p-6 md:p-10">
              <ContactForm locale={locale} copy={c} />
            </div>
          </div>
        </div>
      </section>

      <section id="razgledanje" className="theme-chalk scroll-mt-24 py-24 md:py-32" data-header="light">
        <div className="wrap grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <p className="t-label text-accent">▽ +3.20</p>
            <SplitReveal className="t-h1 mt-5 max-w-[12ch]">{v.title}</SplitReveal>
            <p className="t-lead mt-6 max-w-[42ch] text-muted">{listingPage.bookLead[locale]}</p>
          </div>
          <ViewingForm locale={locale} copy={v} subject="contact" />
        </div>
      </section>
    </>
  );
}
