import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { MapTeaser } from "@/components/home/MapTeaser";
import { Reveal } from "@/components/ui/Reveal";
import { priceLabel } from "@/components/listings/ListingCard";
import { guidedHoods, type HoodId } from "@/content/neighbourhoods";
import { listings } from "@/content/listings";
import { homeCopy } from "@/content/home";
import { hoodsPage } from "@/content/pages";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { detailHref, pageHref } from "@/lib/routes";
import { eur } from "@/lib/format";
import { pick } from "@/lib/pick";

export function HoodsIndexView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const c = pick(hoodsPage, locale);
  const guideHrefs = Object.fromEntries(guidedHoods.map((h) => [h.id, detailHref(locale, "hoods", h.slug!)])) as Partial<Record<HoodId, string>>;
  const pins = listings.map((l) => ({ id: l.id, at: l.at, label: priceLabel(l, locale, dict), href: detailHref(locale, "listings", l.slug) }));

  return (
    <>
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, url: pageHref(locale, "home") },
          { name: dict.nav.hoods, url: pageHref(locale, "hoods") },
        ]}
        label={c.label}
        kota={6.4}
        title={c.title}
        lead={c.lead}
      />

      <section className="theme-light pb-24 md:pb-36" data-header="light">
        <Reveal as="ul" stagger={0.08} className="wrap grid gap-x-6 gap-y-16 md:grid-cols-12">
          {guidedHoods.map((h, i) => {
            const span = ["md:col-span-7", "md:col-span-5 md:mt-40", "md:col-span-5", "md:col-span-7 md:mt-24", "md:col-span-7", "md:col-span-5 md:mt-40"][i];
            const count = listings.filter((l) => l.hood === h.id).length;
            return (
              <li key={h.id} className={span}>
                <Link href={detailHref(locale, "hoods", h.slug!)} className="group block" data-cursor={c.read.split(" ")[0]}>
                  <div className={clsx("relative overflow-hidden", i % 3 === 0 ? "aspect-[4/3]" : "aspect-[4/5]")}>
                    <Image
                      src={h.hero!.src}
                      alt={h.hero!.alt[locale]}
                      fill
                      sizes="(min-width: 768px) 55vw, 92vw"
                      quality={70}
                      className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                    <span className="t-label absolute left-4 top-4 rounded-full bg-kreda px-3 py-1.5 text-dunav">0{i + 1}</span>
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h2 className="t-h2">{h.name[locale]}</h2>
                    <span className="t-mono shrink-0 text-sm">{eur(h.pricePerM2, locale)}/m²</span>
                  </div>
                  <p className="mt-3 max-w-[44ch] text-muted">{h.tagline[locale]}</p>
                  <p className="t-label mt-4 flex items-center gap-3">
                    <span className="link-u">{c.read} →</span>
                    <span className="text-muted">
                      · {count} {listingsWord(count, locale)}
                    </span>
                  </p>
                </Link>
              </li>
            );
          })}
        </Reveal>
      </section>

      <MapTeaser
        locale={locale}
        label={homeCopy.mapLabel[locale]}
        title={homeCopy.mapTitle[locale]}
        lead={`${homeCopy.mapLead[locale]} ${c.alsoCovered}.`}
        guideLabel={homeCopy.guide[locale]}
        pins={pins}
        guideHrefs={guideHrefs}
        listingsHref={pageHref(locale, "listings")}
      />

      <CtaBand
        label={dict.nav.listings}
        title={locale === "sr" ? "Znate kraj. Sad izaberite stan." : "You know the area. Now pick the home."}
        text={
          locale === "sr"
            ? "Filtrirajte ponudu po kraju, ceni i broju soba, ili nam recite šta tražite."
            : "Filter listings by neighbourhood, price and rooms, or tell us what you're after."
        }
        primary={{ href: pageHref(locale, "listings"), label: dict.cta.browse }}
        secondary={{ href: pageHref(locale, "contact"), label: dict.cta.contact }}
        image={{ src: "/images/city/pogled-sa-tvrdjave.jpg", alt: "" }}
      />
    </>
  );
}

function listingsWord(n: number, locale: Locale) {
  if (locale === "en") return n === 1 ? "listing" : "listings";
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "nekretnina";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "nekretnine";
  return "nekretnina";
}
