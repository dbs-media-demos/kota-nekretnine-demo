import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { NoviSadMap } from "@/components/map/NoviSadMap";
import { Parallax, Reveal, ScrubWords, SplitReveal } from "@/components/ui/Reveal";
import { agents } from "@/content/agents";
import { hoodById } from "@/content/neighbourhoods";
import { aboutPage } from "@/content/pages-more";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { pick } from "@/lib/pick";
import { site } from "@/lib/site";

export function AboutView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const c = pick(aboutPage, locale);
  return (
    <>
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, url: pageHref(locale, "home") },
          { name: dict.nav.about, url: pageHref(locale, "about") },
        ]}
        label={c.label}
        kota={12.4}
        title={c.title}
        lead={c.lead}
      />

      <section className="theme-light pb-24 md:pb-36" data-header="light">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-end">
          <Parallax className="aspect-[4/5] w-full" amount={12}>
            <div className="absolute inset-0">
              <Image src="/images/city/zmaj-jovina.jpg" alt={locale === "sr" ? "Ulica Zmaj Jovina, dva minuta od naše kancelarije" : "Zmaj Jovina street, two minutes from our office"} fill sizes="(min-width: 1024px) 45vw, 92vw" quality={70} className="object-cover" />
            </div>
          </Parallax>
          <div>
            <p className="t-label text-accent">▽ {c.storyLabel}</p>
            <ScrubWords text={c.story} className="mt-6 font-serif text-[clamp(1.4rem,2.4vw,2.2rem)] leading-[1.25]" />
            <blockquote className="mt-10 border-l-2 border-mesing pl-6">
              <p className="t-h3 italic">{c.quote}</p>
              <footer className="t-label mt-4 text-muted">Jelena Marković · {agents[0].role[locale]}</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="theme-dark py-24 md:py-32" data-header="dark">
        <div className="wrap">
          <p className="t-label text-accent">▽ {c.valuesLabel}</p>
          <Reveal as="ol" stagger={0.1} className="mt-10 grid gap-10 md:grid-cols-3">
            {c.values.map((v, i) => (
              <li key={v.title} className="border-t border-line pt-6">
                <p className="t-mono text-accent">0{i + 1}</p>
                <h3 className="t-h2 mt-4">{v.title}</h3>
                <p className="mt-4 max-w-[36ch] text-kamen/80">{v.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="theme-light py-24 md:py-36" data-header="light">
        <div className="wrap">
          <p className="t-label text-accent">▽ {c.teamLabel}</p>
          <SplitReveal className="t-h1 mt-5">{c.teamTitle}</SplitReveal>
          <div className="mt-16 grid gap-y-20">
            {agents.map((a, i) => (
              <article key={a.id} className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-16" id={a.id}>
                <div className={i % 2 ? "md:order-2" : undefined}>
                  <Parallax className="aspect-[4/5] w-full max-w-[460px]" amount={10}>
                    <div className="absolute inset-0">
                      <Image src={a.image} alt={a.name} fill sizes="(min-width: 768px) 36vw, 92vw" quality={70} className="object-cover" style={{ objectPosition: a.focus }} />
                    </div>
                  </Parallax>
                </div>
                <div>
                  <p className="t-label text-muted">
                    0{i + 1} · {a.languages.join(" · ")}
                  </p>
                  <h3 className="t-h1 mt-4 !text-[clamp(2.2rem,4.6vw,4.4rem)]">{a.name}</h3>
                  <p className="t-label mt-3 text-accent">{a.role[locale]}</p>
                  <p className="t-lead mt-6 max-w-[48ch] text-muted">{a.bio[locale]}</p>
                  <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-5">
                    <div>
                      <dt className="t-label text-muted">{c.since}</dt>
                      <dd className="t-mono mt-1 text-lg">{a.since}</dd>
                    </div>
                    <div>
                      <dt className="t-label text-muted">{c.deals}</dt>
                      <dd className="t-mono mt-1 text-lg">{a.deals}</dd>
                    </div>
                    <div>
                      <dt className="t-label text-muted">{dict.nav.hoods}</dt>
                      <dd className="mt-1">{a.areas.map((h) => hoodById(h).name[locale]).join(", ")}</dd>
                    </div>
                  </dl>
                  <a href={`mailto:${a.email}`} className="link-u t-label mt-6 inline-block py-2">
                    {a.email}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="theme-chalk py-24 md:py-32" data-header="light">
        <div className="wrap">
          <p className="t-label text-accent">▽ {c.trustLabel}</p>
          <Reveal as="ul" stagger={0.08} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.trust.map((t) => (
              <li key={t.title} className="flex flex-col gap-4 border border-line bg-surface p-6">
                <svg viewBox="0 0 40 28" className="h-6 w-auto self-start text-dunav" aria-hidden="true">
                  <path d="M7 4h22L18 22Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M7 4h11v18Z" fill="#b8915a" />
                  <path d="M0 22h40" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <h3 className="font-serif text-xl">{t.title}</h3>
                <p className="text-sm text-muted">{t.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="theme-light py-24 md:py-32" data-header="light">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="t-label text-accent">▽ {c.officeLabel}</p>
            <h2 className="t-h1 mt-5 max-w-[12ch]">{c.officeTitle}</h2>
            <p className="t-lead mt-6 max-w-[44ch] text-muted">{c.officeText}</p>
            <p className="t-mono mt-6">
              {site.street}, {site.postalCode} {site.city}
            </p>
          </div>
          <div className="bg-kamen p-3 text-dunav md:p-5">
            <NoviSadMap
              locale={locale}
              title={c.officeTitle}
              pins={[{ id: "office", at: [538, 336], label: "Kota ▽ Modene 3" }]}
              activePin="office"
              activeHood="stari-grad"
              viewBox="300 180 520 360"
              animate={false}
            />
          </div>
        </div>
      </section>

      <CtaBand
        label={dict.nav.contact}
        title={locale === "sr" ? "Svratite na kafu." : "Come by for a coffee."}
        text={locale === "sr" ? "Bez zakazivanja radnim danima do 19h. Ili nas pozovite, pa dolazimo mi." : "No appointment needed on weekdays until 7 pm. Or call, and we'll come to you."}
        primary={{ href: pageHref(locale, "contact"), label: dict.cta.contact }}
        secondary={{ href: `tel:${site.phone}`, label: site.phoneDisplay }}
        image={{ src: "/images/city/gradska-kuca-noc.jpg", alt: "" }}
      />
    </>
  );
}
