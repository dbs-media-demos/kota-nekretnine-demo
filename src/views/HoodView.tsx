import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { ParallaxGallery } from "@/components/hood/ParallaxGallery";
import { ListingCard } from "@/components/listings/ListingCard";
import { NoviSadMap } from "@/components/map/NoviSadMap";
import { Counter, Parallax, Reveal, ScrubWords, SplitReveal } from "@/components/ui/Reveal";
import { guidedHoods, locativeSr, type Hood } from "@/content/neighbourhoods";
import { listings } from "@/content/listings";
import { hoodsPage } from "@/content/pages";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { detailHref, pageHref } from "@/lib/routes";
import { eur } from "@/lib/format";
import { pick } from "@/lib/pick";
import { priceLabel } from "@/components/listings/ListingCard";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function HoodView({ hood: h, locale }: { hood: Hood; locale: Locale }) {
  const dict = getDictionary(locale);
  const c = pick(hoodsPage, locale);
  const here = listings.filter((l) => l.hood === h.id);
  const idx = guidedHoods.findIndex((g) => g.id === h.id);
  const next = guidedHoods[(idx + 1) % guidedHoods.length];
  const url = detailHref(locale, "hoods", h.slug!);
  const stats = h.stats!;
  const [cx, cy] = h.center;
  const vb = `${Math.min(Math.max(cx - 300, -20), 420)} ${Math.min(Math.max(cy - 200, 60), 300)} 600 400`;

  return (
    <>
      {/* Hero */}
      <section data-header="dark" className="theme-dark relative h-[100svh] min-h-[640px] overflow-hidden">
        <div className="anim-mask absolute inset-0" style={d(0)}>
          <Image src={h.hero!.src} alt={h.hero!.alt[locale]} fill preload quality={75} sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,29,43,0.5)_0%,rgba(13,29,43,0)_35%,rgba(13,29,43,0.85)_100%)]" />
        <div className="wrap relative flex h-full flex-col justify-end pb-12 pt-[calc(var(--header-h)+2rem)]">
          <Breadcrumbs
            className="anim-fade absolute top-[calc(var(--header-h)+1.5rem)] text-kamen/85"
            items={[
              { name: dict.breadcrumbHome, url: pageHref(locale, "home") },
              { name: dict.nav.hoods, url: pageHref(locale, "hoods") },
              { name: h.name[locale], url },
            ]}
          />
          <p className="anim-fade t-label text-mesing" style={d(0.2)}>
            ▽ 0{idx + 1} / 0{guidedHoods.length} · {eur(h.pricePerM2, locale)}/m²
          </p>
          <h1 className="t-display mt-4 text-kreda">
            <span className="hero-line">
              <span style={d(0.15)}>{h.name[locale]}</span>
            </span>
          </h1>
          <p className="anim-fade t-lead mt-6 max-w-[40ch] text-kamen/90" style={d(0.4)}>
            {h.tagline[locale]}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="theme-light py-24 md:py-36" data-header="light">
        <div className="wrap grid gap-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)]">
          <ScrubWords text={h.intro![locale]} className="font-serif text-[clamp(1.6rem,3.2vw,3.1rem)] leading-[1.15] tracking-[-0.015em]" />
          <div>
            <p className="t-label text-muted">{c.character}</p>
            <ul className="mt-5 border-t border-line">
              {h.character![locale].map((ch) => (
                <li key={ch} className="flex items-center gap-3 border-b border-line py-3.5">
                  <span className="text-mesing">▽</span> {ch}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Life here stats */}
      <section className="theme-dark py-20 md:py-28" data-header="dark">
        <div className="wrap">
          <p className="t-label text-accent">▽ {c.lifeHere}</p>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-5">
            {(
              [
                [h.pricePerM2, c.avgPrice, "€"],
                [stats.schools, c.schools, ""],
                [stats.parks, c.parks, ""],
                [stats.cafes, c.cafes, "+"],
                [stats.toCenter, stats.toCenter === 0 ? c.center : c.toCenter, ""],
              ] as [number, string, string][]
            ).map(([v, label, suffix]) => (
              <div key={label} className="flex flex-col border-t border-line pt-5">
                <dt className="order-2 mt-3 text-sm text-muted">{label}</dt>
                <dd className="order-1 font-serif text-[clamp(2.6rem,4.6vw,4.4rem)] leading-none tracking-[-0.03em]">
                  <Counter value={v} suffix={suffix ? ` ${suffix}`.replace(" +", "+") : ""} locale={locale} />
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 text-xs text-muted">{c.statsNote}</p>
        </div>
      </section>

      {/* Chapters */}
      <section className="theme-light" data-header="light">
        {h.chapters!.map((ch, i) => (
          <article key={i} className="wrap grid items-center gap-10 py-20 md:py-32 lg:grid-cols-2 lg:gap-20">
            <div className={i % 2 ? "lg:order-2" : undefined}>
              <p className="t-label flex items-center gap-3 text-accent">
                <span className="t-mono">0{i + 1}</span>
                <span className="h-px w-8 bg-current" />
                {ch.kicker[locale]}
              </p>
              <SplitReveal as="h2" className="t-h1 mt-5 max-w-[12ch]">
                {ch.title[locale]}
              </SplitReveal>
              <Reveal>
                <p className="t-lead mt-7 max-w-[46ch] text-muted">{ch.text[locale]}</p>
              </Reveal>
            </div>
            <Parallax className={ch.image.portrait ? "mx-auto aspect-[3/4] w-full max-w-[520px]" : "aspect-[4/3] w-full"} amount={14}>
              <div className="absolute inset-0">
                <Image src={ch.image.src} alt={ch.image.alt[locale]} fill sizes="(min-width: 1024px) 45vw, 92vw" quality={70} className="object-cover" />
              </div>
            </Parallax>
          </article>
        ))}
      </section>

      {/* Gallery */}
      <section className="theme-chalk overflow-hidden py-24 md:py-36" data-header="light">
        <div className="wrap">
          <p className="t-label text-accent">▽ {c.gallery}</p>
          <SplitReveal className="t-h1 mt-5">{h.name[locale]}</SplitReveal>
          <div className="mt-14">
            <ParallaxGallery images={h.gallery!} locale={locale} />
          </div>
        </div>
      </section>

      {/* Map + listings */}
      <section className="theme-light py-24 md:py-36" data-header="light">
        <div className="wrap grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <p className="t-label text-accent">▽ {c.onMap}</p>
            <h2 className="t-h2 mt-5">{c.listingsHere}</h2>
            {here.length ? (
              <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2">
                {here.map((l) => (
                  <ListingCard key={l.id} listing={l} locale={locale} dict={dict} aspect="wide" sizes="(min-width: 1024px) 23vw, 46vw" />
                ))}
              </div>
            ) : (
              <p className="mt-6 max-w-[44ch] text-muted">{c.noneHere}</p>
            )}
          </div>
          <div className="bg-kamen p-3 text-dunav lg:sticky lg:top-[calc(var(--header-h)+1rem)] md:p-5">
            <NoviSadMap
              locale={locale}
              title={`${c.onMap}: ${h.name[locale]}`}
              activeHood={h.id}
              pins={here.map((l) => ({ id: l.id, at: l.at, label: priceLabel(l, locale, dict), href: detailHref(locale, "listings", l.slug) }))}
              viewBox={vb}
            />
          </div>
        </div>
      </section>

      {/* Next neighbourhood */}
      <section className="theme-dark" data-header="dark">
        <Link href={detailHref(locale, "hoods", next.slug!)} className="group relative block h-[70svh] overflow-hidden">
          <Image src={next.hero!.src} alt={next.hero!.alt[locale]} fill sizes="100vw" quality={65} className="object-cover opacity-60 transition-[transform,opacity] duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:opacity-80" />
          <div className="wrap relative flex h-full flex-col justify-end pb-14">
            <p className="t-label text-mesing">▽ {c.next}</p>
            <p className="t-display mt-4 text-kreda transition-transform duration-700 group-hover:translate-x-4">
              {next.name[locale]} <span className="inline-block transition-transform duration-700 group-hover:translate-x-4">→</span>
            </p>
          </div>
        </Link>
      </section>

      <CtaBand
        label={dict.nav.valuation}
        title={locale === "sr" ? `Imate nekretninu ${locativeSr[h.id]}?` : `Own a home in ${h.name.en}?`}
        text={
          locale === "sr"
            ? "Recite nam kvadraturu i sprat, a mi ćemo vam za 24 sata reći koliko vredi, na osnovu prodaja iz vaše ulice."
            : "Tell us the floor area and storey, and within 24 hours we'll tell you what it's worth, based on sales in your street."
        }
        primary={{ href: `${pageHref(locale, "valuation")}?kraj=${h.id}`, label: dict.cta.valuation }}
        secondary={{ href: pageHref(locale, "sell"), label: dict.nav.sell }}
      />
    </>
  );
}
