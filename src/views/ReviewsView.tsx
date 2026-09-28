import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { ReviewCard, Stars, GoogleG } from "@/components/reviews/ReviewCard";
import { Reveal } from "@/components/ui/Reveal";
import { reviews, ratingSummary } from "@/content/reviews";
import { reviewsPage } from "@/content/pages-more";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { num } from "@/lib/format";
import { pick } from "@/lib/pick";

export function ReviewsView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const c = pick(reviewsPage, locale);
  const total = ratingSummary.distribution.reduce((a, b) => a + b, 0);
  return (
    <>
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, url: pageHref(locale, "home") },
          { name: dict.nav.reviews, url: pageHref(locale, "reviews") },
        ]}
        label={c.label}
        kota={6.4}
        title={c.title}
        lead={c.lead}
      />
      <section className="theme-light pb-24 md:pb-36" data-header="light">
        <div className="wrap grid gap-14 lg:grid-cols-[320px_1fr]">
          <aside>
            <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <div className="flex items-center gap-4">
                <GoogleG className="h-10 w-10" />
                <p className="font-serif text-7xl leading-none">{num(ratingSummary.value, locale, 1)}</p>
              </div>
              <Stars value={ratingSummary.value} className="mt-4" />
              <p className="t-label mt-3 text-muted">
                {dict.reviewsSummary} {ratingSummary.count} {dict.reviewsWord}
              </p>
              <p className="t-label mt-10 text-muted">{c.distribution}</p>
              <ul className="mt-4 grid gap-2">
                {ratingSummary.distribution.map((n, i) => (
                  <li key={i} className="grid grid-cols-[2rem_1fr_2.5rem] items-center gap-3 text-sm">
                    <span className="t-mono">{5 - i}★</span>
                    <span className="h-1.5 bg-line">
                      <span className="block h-full bg-mesing" style={{ width: `${(n / total) * 100}%` }} />
                    </span>
                    <span className="t-mono text-right text-muted">{n}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-xs text-muted">{c.note}</p>
            </div>
          </aside>
          <Reveal stagger={0.06} className="grid gap-4 md:grid-cols-2">
            {reviews.map((r) => (
              <ReviewCard key={r.name} review={r} locale={locale} />
            ))}
          </Reveal>
        </div>
      </section>
      <CtaBand
        label={dict.nav.listings}
        title={locale === "sr" ? "Sledeći utisak može biti vaš." : "The next review could be yours."}
        text={locale === "sr" ? "Pogledajte ponudu ili zakažite besplatnu procenu." : "Browse the listings or book a free valuation."}
        primary={{ href: pageHref(locale, "listings"), label: dict.cta.browse }}
        secondary={{ href: pageHref(locale, "valuation"), label: dict.cta.valuation }}
        image={{ src: "/images/life/kafic-terasa.jpg", alt: "" }}
      />
    </>
  );
}
