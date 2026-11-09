import clsx from "clsx";
import Image, { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import { preload } from "react-dom";
import { Mark } from "@/components/brand/Logo";
import { GoogleG, Stars } from "@/components/reviews/ReviewCard";
import { Button } from "@/components/ui/Button";
import { PhoneIcon } from "@/components/ui/PhoneIcon";
import { agents } from "@/content/agents";
import { homeCopy as c } from "@/content/home";
import { coverSrc, listingById, listingKota } from "@/content/listings";
import { hoods } from "@/content/neighbourhoods";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { detailHref, pageHref } from "@/lib/routes";
import { eur, kota, num } from "@/lib/format";
import { DESK_MEDIA, PHONE_MEDIA } from "@/lib/phone";
import { site } from "@/lib/site";
import type { Biz } from "@/lib/biz-core";
import { HeroModel } from "./HeroModel";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/** The listing on show in the hero, on the model's third floor (+9.60). */
const FEATURED_ID = "l08";

/**
 * Above-the-fold hero. The heading, copy and buttons are there on first paint, never animated in.
 *
 * Desktop: an architect's model of a five-level building, cut open, in real-time 3D (HeroModel,
 * three.js behind lib/three-gate). A brass lift rides ±0.00 → +12.40 and lights each floor; the
 * third floor (+9.60) is the featured listing in the card beside it; scrolling separates the floors,
 * each carrying its elevation. A still rendered from that scene is in the server HTML underneath.
 *
 * Phones get their own crop of a still rendered from the same scene and their own first screen
 * (service + town, agent, rating, the number to call), with nothing faded in. Zero three.js.
 */
export function HomeHero({ locale, dict, biz }: { locale: Locale; dict: Dictionary; biz?: Biz }) {
  const ticks = [0, 3.2, 6.4, 9.6, 12.4];
  const alt = c.heroModel[locale];
  const levels = c.heroLevels.map((l) => l.kota);
  const featured = listingById(FEATURED_ID)!;
  const featuredLevel = levels.indexOf(listingKota(featured));
  const featuredAgent = agents.find((a) => a.id === featured.agent);
  const founder = agents[0];
  const rating = biz ? biz.rating : site.rating;
  const phone = biz ? { tel: biz.phone, display: biz.phoneDisplay } : { tel: site.phone, display: site.phoneDisplay };

  const { props: photo } = getImageProps({
    src: "/images/3d/hero-model.jpg",
    alt,
    fill: true,
    quality: 75,
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
    className: "object-cover object-[72%_40%] md:object-[69%_50%]",
  });
  const {
    props: { srcSet: phoneSrcSet, src: phoneSrc },
  } = getImageProps({
    src: "/images/3d/hero-model-phone.jpg",
    alt,
    width: 1260,
    height: 875,
    quality: 75,
    // cropped to cover a box taller than the photo's own shape, so it shows wider than the screen
    sizes: "130vw",
  });
  // Only the photo this screen will show is fetched early.
  preload(photo.src, { as: "image", imageSrcSet: photo.srcSet, imageSizes: "100vw", media: DESK_MEDIA, fetchPriority: "high" });
  preload(phoneSrc, { as: "image", imageSrcSet: phoneSrcSet, imageSizes: "130vw", media: PHONE_MEDIA, fetchPriority: "high" });

  return (
    <section data-header="dark" data-hero-dark className={clsx("group/hero theme-dark relative h-[100svh] min-h-[660px] overflow-hidden phone:h-auto phone:min-h-0 phone:[--hero-top:clamp(5.25rem,calc(100svh-39rem),11rem)]", biz ? "phone:[--later-h:calc(var(--hero-top)+395.6px)]" : "phone:[--later-h:calc(var(--hero-top)+451.6px)]")} aria-labelledby="hero-title">
      <div className="anim-mask absolute inset-0 phone:bottom-auto phone:h-[calc(var(--hero-top)+9.5rem)] phone:animate-none!" style={d(0)}>
        <picture>
          <source media={PHONE_MEDIA} srcSet={phoneSrcSet} sizes="130vw" />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- getImageProps supplies src and alt */}
          <img {...photo} />
        </picture>
      </div>
      <HeroModel levels={levels} names={c.heroLevels.map((l) => l.name[locale])} featured={featuredLevel} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,29,43,0.55)_0%,rgba(13,29,43,0.05)_32%,rgba(13,29,43,0.2)_55%,rgba(13,29,43,0.88)_100%)] md:bg-[linear-gradient(90deg,rgba(13,29,43,0.78)_0%,rgba(13,29,43,0.4)_34%,rgba(13,29,43,0)_56%),linear-gradient(180deg,rgba(13,29,43,0.55)_0%,rgba(13,29,43,0)_20%,rgba(13,29,43,0)_78%,rgba(13,29,43,0.7)_100%)] phone:bottom-auto phone:h-[calc(var(--hero-top)+9.5rem)] phone:bg-[linear-gradient(180deg,rgba(13,29,43,0.5)_0%,rgba(13,29,43,0.02)_30%,rgba(19,40,59,0.55)_68%,var(--dunav)_100%)]" />

      {/* Elevation ruler */}
      <div className="absolute bottom-[22%] left-[var(--gutter)] top-[20%] hidden w-24 transition-opacity duration-700 md:block group-data-live-3d/hero:opacity-0 phone:hidden!" aria-hidden="true">
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

      <p className="anim-fade t-label absolute right-[var(--gutter)] top-[calc(var(--header-h)+1.5rem)] hidden text-right text-kamen/85 sm:block phone:hidden!" style={d(0.9)}>
        ▽ <span data-hero-kota>±0.00</span> · Trg slobode
        <br />
        45.2551° N · 19.8451° E
      </p>

      <div className="wrap relative flex h-full flex-col justify-end pb-10 md:pb-14 phone:block phone:h-auto phone:pb-5 phone:pt-[var(--hero-top)]">
        <div className="grid items-end gap-10 md:max-w-[min(48rem,54vw)] md:gap-6 phone:block!">
          <div className="md:pl-28 phone:pl-0!">
            <div className="mb-3 flex items-center gap-3 desk:hidden">
              {biz ? (
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-kamen/30 bg-dunav">
                  <Mark className="w-6 text-kamen" accent="var(--mesing)" />
                </span>
              ) : (
                <Image src={founder.image} alt="" width={44} height={44} sizes="96px" quality={60} className="h-11 w-11 shrink-0 rounded-full object-cover" style={{ objectPosition: founder.focus }} />
              )}
              <span className="min-w-0">
                <span className="block text-[0.98rem] font-medium leading-tight text-kreda">{biz ? biz.name : founder.name}</span>
                <span className="t-label mt-1 block !text-[0.62rem] text-kamen/85">{biz ? `Agencija za nekretnine · ${biz.area}` : c.heroKicker[locale]}</span>
              </span>
            </div>
            <p className="t-label mb-6 text-kamen/85 [@media(max-height:820px)]:mb-3 phone:hidden">
              {biz ? `Agencija za nekretnine · ${biz.area}` : c.heroKicker[locale]}
            </p>
            <h1 id="hero-title" className="t-display text-kreda desk:text-[clamp(3.5rem,min(8.2vw,12.5svh),9.5rem)]!">
              <span className="block phone:hidden!">{c.heroLine1[locale]}</span>
              <span className="block phone:hidden!">{c.heroLine2[locale]}</span>
              <span className="block italic text-mesing phone:hidden!">{c.heroLine3[locale]}</span>
              <span className="block desk:hidden">{c.heroPhoneService[locale]}</span>
              <span className="block text-mesing [overflow-wrap:anywhere] desk:hidden">{biz ? `${biz.area}.` : c.heroPhoneTown[locale]}</span>
            </h1>
          </div>

          <div className="max-w-[34rem] md:pl-28 md:max-w-[41rem] phone:max-w-none phone:pl-0!">
            {rating && (
              <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.92rem] leading-tight text-kamen desk:hidden">
                <Stars value={rating.value} />
                <span>
                  {num(rating.value, locale, 1)} · {rating.count} {dict.reviewsWord}
                </span>
                <GoogleG className="h-4 w-4" />
              </p>
            )}
            <p className="t-lead text-kamen/90 phone:mt-3">
              {biz ? "Stanovi i kuće izmereni do centimetra, sa proverenim papirima i pravom cenom po kvadratu." : c.heroLead[locale]}
            </p>
            {phone.tel && (
              <a href={`tel:${phone.tel}`} className="mt-4 flex min-h-13 items-center justify-center gap-2.5 rounded-full bg-mesing px-5 text-[1.02rem] font-medium text-dunav desk:hidden">
                <PhoneIcon className="h-4 w-4 shrink-0" />
                {dict.cta.call} {phone.display}
              </a>
            )}
            {!biz && (
            <form action={pageHref(locale, "listings")} method="get" className="mt-7 flex flex-wrap items-stretch gap-2 phone:mt-2 phone:grid phone:grid-cols-[1fr_1.2fr_auto]" role="search" aria-label={c.quickSearch[locale]}>
              <label className="sr-only" htmlFor="qs-deal">
                {dict.deal.sale}
              </label>
              <select
                id="qs-deal"
                name="deal"
                defaultValue="sale"
                className="min-h-12 flex-1 rounded-full border border-kamen/35 bg-dunav/40 px-4 text-[0.92rem] text-kamen backdrop-blur-md phone:min-w-0 phone:pl-3 phone:pr-1 phone:text-base max-[340px]:text-[0.9rem]"
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
                className="min-h-12 flex-[1.4] rounded-full border border-kamen/35 bg-dunav/40 px-4 text-[0.92rem] text-kamen backdrop-blur-md phone:min-w-0 phone:pl-3 phone:pr-1 phone:text-base max-[340px]:text-[0.9rem]"
              >
                <option value="">{c.anyHood[locale]}</option>
                {hoods.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name[locale]}
                  </option>
                ))}
              </select>
              <button type="submit" className="min-h-12 rounded-full bg-mesing px-6 text-[0.92rem] font-medium text-dunav transition-colors hover:bg-kreda phone:border phone:border-kamen/35 phone:bg-kamen phone:px-4 phone:text-base max-[340px]:px-3 max-[340px]:text-[0.9rem]">
                {c.search[locale]}
              </button>
            </form>
            )}
            <div className="mt-4 flex flex-wrap gap-2 phone:mt-2">
              {phone.tel && (
                <a href={`tel:${phone.tel}`} className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-mesing px-5 text-[0.88rem] font-medium text-dunav transition-colors duration-500 hover:bg-kreda phone:hidden">
                  <PhoneIcon className="h-3.5 w-3.5 shrink-0" />
                  {dict.cta.call} {phone.display}
                </a>
              )}
              <Button href={pageHref(locale, "valuation")} variant="outline" className="!min-h-11 !text-[0.88rem]">
                {dict.cta.valuation}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-4 text-kamen/70 [@media(max-height:820px)]:mt-6 phone:hidden" aria-hidden="true">
          <span className="anim-draw-x h-px flex-1 bg-current" style={d(0.9)} />
          <span className="anim-fade t-label flex items-center gap-2 whitespace-nowrap" style={d(1.1)}>
            <span className="inline-block animate-bounce">▽</span> {c.heroScroll[locale]}
          </span>
          <span className="anim-draw-x h-px flex-1 bg-current [transform-origin:right]" style={d(0.9)} />
        </div>
      </div>

      {/* The listing lit on the model's third floor */}
      <a
        href={detailHref(locale, "listings", featured.slug)}
        className="group absolute bottom-[5.75rem] right-[var(--gutter)] z-10 hidden w-[25rem] items-stretch gap-4 rounded-[2px] border border-kamen/15 bg-dunav/75 p-2.5 pr-5 text-kamen shadow-[0_1px_2px_rgba(0,0,0,0.25),0_18px_40px_-12px_rgba(0,0,0,0.55)] backdrop-blur-md transition-colors duration-500 hover:border-mesing/60 lg:flex phone:hidden!"
        style={{ opacity: "calc(1 - var(--hero-p, 0) * 2.4)" }}
      >
        <span className="relative block w-28 shrink-0 overflow-hidden">
          <Image src={coverSrc(featured)} alt={featured.photos[0][locale]} fill sizes="112px" quality={75} className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col py-1">
          <span className="t-label !text-[0.62rem] text-mesing">
            ▽ {kota(listingKota(featured))} · {biz ? "Primer oglasa" : c.heroFeatured[locale]}
          </span>
          <span className="mt-1.5 font-serif text-[1.18rem] leading-[1.15] text-kreda">{biz ? "Dvosoban stan sa terasom" : featured.title[locale]}</span>
          <span className="t-mono mt-auto flex items-baseline justify-between gap-3 pt-2 text-[0.8rem] text-kamen/80">
            <span>
              {featured.area} m² · {featured.floor}/{featured.floors} {dict.units.floor}
            </span>
            <span className="text-[0.95rem] text-kreda">{eur(featured.price, locale)}</span>
          </span>
          {!biz && featuredAgent && (
            <span className="mt-1 text-[0.78rem] text-kamen/65">
              {featuredAgent.name} · {featuredAgent.role[locale]}
            </span>
          )}
        </span>
      </a>
    </section>
  );
}
