import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { Gallery } from "@/components/listing/Gallery";
import { FloorPlan } from "@/components/listing/FloorPlan";
import { Mortgage } from "@/components/listing/Mortgage";
import { HoodPanel } from "@/components/listing/HoodPanel";
import { ViewingForm } from "@/components/forms/ViewingForm";
import { ListingCard, priceLabel } from "@/components/listings/ListingCard";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { listings, listingKota, type Listing } from "@/content/listings";
import { agentById } from "@/content/agents";
import { hoodById } from "@/content/neighbourhoods";
import { listingPage, listingsPage } from "@/content/pages";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { detailHref, pageHref } from "@/lib/routes";
import { eur, kota, num, perM2, rooms } from "@/lib/format";
import { graph, listingSchema } from "@/lib/schema";
import { pick } from "@/lib/pick";
import { site } from "@/lib/site";

function similarTo(l: Listing) {
  const score = (o: Listing) => (o.hood === l.hood ? 3 : 0) + (o.type === l.type ? 2 : 0) + (o.deal === l.deal ? 2 : 0) - Math.abs(o.price - l.price) / Math.max(l.price, 1);
  return listings
    .filter((o) => o.id !== l.id)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 3);
}

export function ListingView({ listing: l, locale }: { listing: Listing; locale: Locale }) {
  const dict = getDictionary(locale);
  const c = pick(listingPage, locale);
  const hood = hoodById(l.hood);
  const agent = agentById(l.agent);
  const url = detailHref(locale, "listings", l.slug);
  const registered = l.features.includes("registered");

  const facts: [string, string][] = [
    [c.area, `${num(l.area, locale)} m²`],
    [c.rooms, `${rooms(l.rooms)} · ${dict.type[l.type]}`],
    l.type === "house" ? [c.floors, l.floors === 2 ? "P+1" : `P+${l.floors - 1}`] : [c.floor, l.floor === 0 ? dict.units.ground : `${l.floor} / ${l.floors}`],
    [c.kota, `▽ ${kota(listingKota(l))}`],
    [c.year, `${l.year}${l.renovated ? ` · ${c.renovated} ${l.renovated}` : ""}`],
    [c.heating, dict.heating[l.heating]],
    ...(l.terrace ? ([[c.terrace, `${num(l.terrace, locale)} m²`]] as [string, string][]) : []),
    ...(l.plot ? ([[c.plot, `${num(l.plot, locale)} m²`]] as [string, string][]) : []),
    [c.status, registered ? `✓ ${c.registered}` : c.notRegistered],
  ];

  const utilities = Math.round(l.area * 1.6 + 20);

  return (
    <>
      <JsonLd data={graph(listingSchema(l, locale, url))} />

      <section className="theme-light pt-[calc(var(--header-h)+1.5rem)]" data-header="light">
        <div className="wrap">
          <Breadcrumbs
            className="anim-fade mb-8 text-muted"
            items={[
              { name: dict.breadcrumbHome, url: pageHref(locale, "home") },
              { name: listingsPage.title[locale], url: pageHref(locale, "listings") },
              { name: l.title[locale], url },
            ]}
          />
          <div className="grid gap-6 pb-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="anim-fade t-label flex flex-wrap items-center gap-x-3 gap-y-1 text-accent" style={{ ["--d" as string]: "0.1s" }}>
                <span>▽ {kota(listingKota(l))}</span>
                <span className="h-px w-6 bg-current" />
                <span>
                  {hood.name[locale]} · {l.street} · {dict.deal[l.deal]}
                </span>
                {l.badge && <span className="rounded-full bg-dunav px-2.5 py-1 text-kamen">{dict.badge[l.badge]}</span>}
              </p>
              <h1 className="anim-heading t-h1 mt-4 max-w-[20ch] !text-[clamp(2.2rem,5.2vw,5rem)]">{l.title[locale]}</h1>
            </div>
            <div className="anim-fade md:text-right" style={{ ["--d" as string]: "0.25s" }}>
              <p className="t-mono text-[clamp(1.8rem,3.4vw,3rem)] leading-none tracking-[-0.03em]">{priceLabel(l, locale, dict)}</p>
              {l.deal === "sale" && <p className="t-mono mt-2 text-sm text-muted">{perM2(l.price, l.area, locale)}</p>}
            </div>
          </div>
          <Gallery listing={l} locale={locale} labels={c.gallery} />
        </div>
      </section>

      <section className="theme-light pb-24 pt-16" data-header="light">
        <div className="wrap grid gap-16 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0">
            <Reveal>
              <p className="t-lead max-w-[60ch]">{l.summary[locale]}</p>
            </Reveal>

            <div className="mt-14">
              <h2 className="t-label text-muted">{c.facts}</h2>
              <dl className="mt-5 grid grid-cols-2 border-t border-line sm:grid-cols-3">
                {facts.map(([k, v]) => (
                  <div key={k} className="border-b border-line py-4 pr-4">
                    <dt className="t-label text-muted">{k}</dt>
                    <dd className="t-mono mt-2 text-[1.02rem]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-16">
              <h2 className="t-h3">{c.about}</h2>
              <div className="mt-6 grid max-w-[64ch] gap-5 text-[1.06rem] leading-relaxed text-muted">
                {l.description[locale].map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <ul className="mt-8 flex flex-wrap gap-2">
                {l.features.map((f) => (
                  <li key={f} className="rounded-full border border-line px-4 py-2 text-sm">
                    ✓ {dict.feature[f]}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-20">
              <div className="flex items-end justify-between gap-6">
                <h2 className="t-h3">{c.plan}</h2>
                <p className="t-mono text-sm text-muted">{num(l.area, locale)} m²</p>
              </div>
              <div className="mt-8 bg-kreda p-4 sm:p-8">
                <FloorPlan plan={l.plan} area={l.area} locale={locale} title={`${c.plan}: ${l.title[locale]}`} />
              </div>
              <p className="mt-3 text-xs text-muted">{c.planNote}</p>
            </div>

            <div className="mt-20">
              <HoodPanel listing={l} locale={locale} copy={{ hood: c.hood, walk: c.walk, min: c.min, guide: c.guide }} />
            </div>

            <div className="mt-20">
              <h2 className="t-h3">{l.deal === "sale" ? c.mortgage : c.rentCosts}</h2>
              <div className="mt-8">
                {l.deal === "sale" ? (
                  <Mortgage price={l.price} locale={locale} copy={c.mortgageCopy} />
                ) : (
                  <dl className="grid max-w-xl border-t border-line">
                    {(
                      [
                        [c.deposit, l.price],
                        [c.firstRent, l.price],
                        [c.commission, Math.round(l.price / 2)],
                      ] as [string, number][]
                    ).map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-line py-4">
                        <dt>{k}</dt>
                        <dd className="t-mono">{eur(v, locale)}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between border-b border-line py-4 text-muted">
                      <dt>{c.utilities}</dt>
                      <dd className="t-mono">≈ {eur(utilities, locale)}</dd>
                    </div>
                    <div className="flex justify-between py-5 text-lg">
                      <dt className="font-medium">{c.moveIn}</dt>
                      <dd className="t-mono">{eur(l.price * 2 + Math.round(l.price / 2), locale)}</dd>
                    </div>
                  </dl>
                )}
              </div>
            </div>
          </div>

          {/* Sticky agent sidebar */}
          <aside className="lg:relative">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <div className="border border-line bg-surface p-6">
                <p className="t-label text-muted">{c.agent}</p>
                <div className="mt-5 flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
                    <Image src={agent.image} alt={agent.name} fill sizes="80px" quality={70} className="object-cover" style={{ objectPosition: agent.focus }} />
                  </div>
                  <div>
                    <p className="font-serif text-xl leading-tight">{agent.name}</p>
                    <p className="mt-1 text-sm text-muted">{agent.role[locale]}</p>
                    <p className="t-label mt-2 text-muted">{agent.languages.join(" · ")}</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-2">
                  <a href="#zakazi" className="flex min-h-12 items-center justify-center rounded-full bg-dunav font-medium text-kamen transition-colors hover:bg-mesing hover:text-dunav">
                    {c.book}
                  </a>
                  <div className="grid grid-cols-2 gap-2">
                    <a href={`tel:${site.phone}`} className="flex min-h-12 items-center justify-center rounded-full border border-line text-sm hover:border-dunav">
                      {c.call}
                    </a>
                    <a
                      href={`mailto:${agent.email}?subject=${encodeURIComponent(l.title[locale])}`}
                      className="flex min-h-12 items-center justify-center rounded-full border border-line text-sm hover:border-dunav"
                    >
                      {c.write}
                    </a>
                  </div>
                </div>
              </div>
              <Link href={pageHref(locale, "listings")} className="link-u t-label mt-6 inline-block py-2" transitionTypes={["nav-back"]}>
                ← {c.back}
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section id="zakazi" className="theme-chalk scroll-mt-24 py-24 md:py-32" data-header="light">
        <div className="wrap grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <p className="t-label text-accent">▽ {kota(listingKota(l))}</p>
            <SplitReveal className="t-h1 mt-5 max-w-[12ch]">{c.book}</SplitReveal>
            <p className="t-lead mt-6 max-w-[42ch] text-muted">{c.bookLead}</p>
            <div className="mt-10 flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full">
                <Image src={agent.image} alt="" fill sizes="56px" quality={60} className="object-cover" style={{ objectPosition: agent.focus }} />
              </div>
              <p className="text-sm">
                <span className="block font-medium">{agent.name}</span>
                <a href={`tel:${site.phone}`} className="t-mono link-u text-muted">
                  {site.phoneDisplay}
                </a>
              </p>
            </div>
          </div>
          <ViewingForm locale={locale} copy={c.viewing} subject={l.id} />
        </div>
      </section>

      <section className="theme-light py-24 md:py-32" data-header="light">
        <div className="wrap">
          <h2 className="t-h2">{c.similar}</h2>
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {similarTo(l).map((o) => (
              <ListingCard key={o.id} listing={o} locale={locale} dict={dict} morph={false} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
