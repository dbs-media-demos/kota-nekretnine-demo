import Image from "next/image";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { homeCopy as c } from "@/content/home";
import { hoods } from "@/content/neighbourhoods";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { kota } from "@/lib/format";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/** Above-the-fold hero. Everything here animates with CSS only, so LCP never waits for JS. */
export function HomeHero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const ticks = [0, 3.2, 6.4, 9.6, 12.4];
  return (
    <section data-header="dark" className="theme-dark relative h-[100svh] min-h-[660px] overflow-hidden" aria-labelledby="hero-title">
      <div className="anim-mask absolute inset-0" style={d(0)}>
        <Image
          src="/images/city/hero-stari-grad-sunset.jpg"
          alt={c.heroPhoto[locale]}
          fill
          preload
          quality={75}
          sizes="100vw"
          className="object-cover object-[50%_40%]"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,29,43,0.55)_0%,rgba(13,29,43,0.05)_32%,rgba(13,29,43,0.2)_55%,rgba(13,29,43,0.88)_100%)]" />

      {/* Elevation ruler */}
      <div className="absolute bottom-[22%] left-[var(--gutter)] top-[20%] hidden w-24 md:block" aria-hidden="true">
        <span className="anim-draw-y absolute bottom-0 left-0 top-0 w-px bg-kamen/50 [transform-origin:bottom]" style={d(0.5)} />
        {ticks.map((t, i) => (
          <span
            key={t}
            className="anim-fade absolute left-0 flex items-center gap-2"
            style={{ ...d(0.7 + i * 0.12), bottom: `${(t / 12.4) * 100}%` }}
          >
            <span className="h-px w-3 bg-kamen/70" />
            <span className="t-label !text-[0.62rem] text-kamen/80">{kota(t)}</span>
          </span>
        ))}
      </div>

      <p className="anim-fade t-label absolute right-[var(--gutter)] top-[calc(var(--header-h)+1.5rem)] hidden text-right text-kamen/85 sm:block" style={d(0.9)}>
        ▽ ±0.00 · Trg slobode
        <br />
        45.2551° N · 19.8451° E
      </p>

      <div className="wrap relative flex h-full flex-col justify-end pb-10 md:pb-14">
        <div className="grid items-end gap-10 lg:grid-cols-[1.35fr_1fr]">
          <div className="md:pl-28">
            <p className="anim-fade t-label mb-6 text-kamen/85" style={d(0.35)}>
              {c.heroKicker[locale]}
            </p>
            <h1 id="hero-title" className="t-display text-kreda">
              <span className="hero-line">
                <span style={d(0.2)}>{c.heroLine1[locale]}</span>
              </span>
              <span className="hero-line">
                <span style={d(0.32)}>{c.heroLine2[locale]}</span>
              </span>
              <span className="hero-line">
                <span style={d(0.44)} className="italic text-mesing">
                  {c.heroLine3[locale]}
                </span>
              </span>
            </h1>
          </div>

          <div className="max-w-md lg:justify-self-end">
            <p className="t-lead text-kamen/90">{c.heroLead[locale]}</p>
            <form action={pageHref(locale, "listings")} method="get" className="mt-7 flex flex-wrap items-stretch gap-2" role="search" aria-label={c.quickSearch[locale]}>
              <label className="sr-only" htmlFor="qs-deal">
                {dict.deal.sale}
              </label>
              <select
                id="qs-deal"
                name="deal"
                defaultValue="sale"
                className="min-h-12 flex-1 rounded-full border border-kamen/35 bg-dunav/40 px-4 text-[0.92rem] text-kamen backdrop-blur-md"
              >
                <option value="sale">{dict.dealVerb.sale}</option>
                <option value="rent">{dict.dealVerb.rent}</option>
              </select>
              <label className="sr-only" htmlFor="qs-hood">
                {c.anyHood[locale]}
              </label>
              <select
                id="qs-hood"
                name="hood"
                defaultValue=""
                className="min-h-12 flex-[1.4] rounded-full border border-kamen/35 bg-dunav/40 px-4 text-[0.92rem] text-kamen backdrop-blur-md"
              >
                <option value="">{c.anyHood[locale]}</option>
                {hoods.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name[locale]}
                  </option>
                ))}
              </select>
              <button type="submit" className="min-h-12 rounded-full bg-mesing px-6 text-[0.92rem] font-medium text-dunav transition-colors hover:bg-kreda">
                {c.search[locale]}
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button href={pageHref(locale, "valuation")} variant="outline" className="!min-h-11 !text-[0.88rem]">
                {dict.cta.valuation}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-4 text-kamen/70" aria-hidden="true">
          <span className="anim-draw-x h-px flex-1 bg-current" style={d(0.9)} />
          <span className="anim-fade t-label flex items-center gap-2 whitespace-nowrap" style={d(1.1)}>
            <span className="inline-block animate-bounce">▽</span> {c.heroScroll[locale]}
          </span>
          <span className="anim-draw-x h-px flex-1 bg-current [transform-origin:right]" style={d(0.9)} />
        </div>
      </div>
    </section>
  );
}
