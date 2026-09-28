import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { StackCards } from "@/components/sections/StackCards";
import { FaqList } from "@/components/sections/FaqList";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Counter, Reveal, SplitReveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { sellPage } from "@/content/pages";
import { reviews } from "@/content/reviews";
import { faqs } from "@/content/faq";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { pick } from "@/lib/pick";
import { faqSchema, graph, serviceSchema } from "@/lib/schema";

export function SellView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const c = pick(sellPage, locale);
  const sellFaqs = faqs.filter((f) => f.group === "sell" || f.group === "fees");
  const sellerReviews = reviews.filter((r) => /Prodal|Sold|Procena/.test(r.context.sr + r.context.en)).slice(0, 3);

  return (
    <>
      <JsonLd
        data={graph(
          serviceSchema(locale, c.title, c.metaDescription, pageHref(locale, "sell")),
          faqSchema(sellFaqs.map((f) => ({ q: f.q[locale], a: f.a[locale] }))),
        )}
      />
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, url: pageHref(locale, "home") },
          { name: dict.nav.sell, url: pageHref(locale, "sell") },
        ]}
        label={c.label}
        kota={9.6}
        title={c.title}
        lead={c.lead}
        image={{ src: "/images/listings/l05/01.jpg", alt: locale === "sr" ? "Moderna kuća sa baštom" : "Modern house with a garden", position: "50% 60%" }}
      >
        <div className="anim-fade mt-8 flex flex-wrap gap-3" style={{ ["--d" as string]: "0.45s" }}>
          <Button href={pageHref(locale, "valuation")} variant="brass">
            {dict.cta.valuation}
          </Button>
          <Button href={pageHref(locale, "contact")} variant="outline">
            {dict.cta.contact}
          </Button>
        </div>
      </PageHero>

      <section className="theme-light py-20 md:py-28" data-header="light">
        <dl className="wrap grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {c.stats.map((s) => (
            <div key={s.label} className="flex flex-col border-t border-line pt-5">
              <dt className="order-2 mt-3 text-sm text-muted">{s.label}</dt>
              <dd className="order-1 font-serif text-[clamp(2.8rem,5vw,4.6rem)] leading-none tracking-[-0.03em]">
                <Counter value={s.value} suffix={s.suffix} locale={locale} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="theme-light pb-24 md:pb-36" data-header="light">
        <div className="wrap">
          <p className="t-label text-accent">▽ {c.processLabel}</p>
          <SplitReveal className="t-h1 mt-5 max-w-[14ch]">{c.processTitle}</SplitReveal>
          <div className="mt-14">
            <StackCards cards={c.steps} />
          </div>
        </div>
      </section>

      <section className="theme-dark py-24 md:py-36" data-header="dark">
        <div className="wrap grid gap-16 lg:grid-cols-2">
          <div>
            <p className="t-label text-accent">▽ {c.feeLabel}</p>
            <SplitReveal className="t-h1 mt-5 max-w-[12ch]">{c.feeTitle}</SplitReveal>
            <p className="t-lead mt-8 max-w-[52ch] text-kamen/85">{c.feeText}</p>
          </div>
          <div>
            <p className="t-label text-muted">{c.includedLabel}</p>
            <Reveal as="ul" stagger={0.05} className="mt-5 border-t border-line">
              {c.included.map((item) => (
                <li key={item} className="flex items-center gap-4 border-b border-line py-4">
                  <span className="text-mesing">▽</span> {item}
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="theme-chalk py-24 md:py-32" data-header="light">
        <div className="wrap">
          <p className="t-label text-accent">▽ {c.reviewsLabel}</p>
          <Reveal stagger={0.1} className="mt-10 grid gap-4 md:grid-cols-3">
            {sellerReviews.map((r) => (
              <ReviewCard key={r.name} review={r} locale={locale} />
            ))}
          </Reveal>
        </div>
      </section>

      <section className="theme-light py-24 md:py-32" data-header="light">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="t-h2 max-w-[12ch]">{c.faqLabel}</h2>
          <FaqList items={sellFaqs} locale={locale} />
        </div>
      </section>

      <CtaBand
        label={dict.nav.valuation}
        title={c.ctaTitle}
        text={c.ctaText}
        primary={{ href: pageHref(locale, "valuation"), label: dict.cta.valuation }}
        secondary={{ href: `tel:+381210000000`, label: dict.cta.call }}
        image={{ src: "/images/city/krovovi-zalazak.jpg", alt: "" }}
      />
    </>
  );
}
