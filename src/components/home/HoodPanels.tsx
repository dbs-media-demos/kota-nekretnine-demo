import Link from "next/link";
import Image from "next/image";
import { guidedHoods } from "@/content/neighbourhoods";
import type { Locale } from "@/lib/i18n";
import { detailHref } from "@/lib/routes";
import { eur } from "@/lib/format";
import { SplitReveal } from "@/components/ui/Reveal";

/** Six neighbourhood panels; the hovered one opens up like a shutter (desktop). */
export function HoodPanels({ locale, label, title }: { locale: Locale; label: string; title: string }) {
  return (
    <section className="theme-dark py-24 md:py-36" data-header="dark" aria-labelledby="hoods-title">
      <div className="wrap">
        <p className="t-label text-accent">▽ {label}</p>
        <SplitReveal id="hoods-title" className="t-h1 mt-5 max-w-[16ch]">
          {title}
        </SplitReveal>
      </div>
      <div className="wrap mt-14">
        <ul className="grid gap-3 lg:flex lg:h-[74svh] lg:gap-2">
          {guidedHoods.map((h, i) => (
            <li
              key={h.id}
              className="group relative h-[52svh] overflow-hidden lg:h-full lg:flex-1 lg:transition-[flex-grow] lg:duration-[1s] lg:ease-[cubic-bezier(0.16,1,0.3,1)] lg:hover:flex-[3.2] lg:focus-within:flex-[3.2]"
            >
              <Link href={detailHref(locale, "hoods", h.slug!)} className="absolute inset-0 block" data-cursor={locale === "sr" ? "Vodič" : "Guide"}>
                <Image
                  src={h.hero!.src}
                  alt={h.hero!.alt[locale]}
                  fill
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  quality={70}
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,29,43,0)_40%,rgba(13,29,43,0.82)_100%)] transition-opacity duration-700 group-hover:opacity-90" />
                <span className="absolute left-5 top-5 t-label text-kamen/80">0{i + 1}</span>
                <span className="absolute inset-x-5 bottom-5 flex flex-col gap-3 text-kreda">
                  <span className="t-label text-mesing">{eur(h.pricePerM2, locale)}/m²</span>
                  <span className="font-serif text-[clamp(1.8rem,2.6vw,2.8rem)] leading-none lg:origin-bottom-left lg:transition-transform lg:duration-700">
                    {h.name[locale]}
                  </span>
                  <span className="max-w-[34ch] text-[0.95rem] leading-snug text-kamen/85 lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:transition-[max-height,opacity] lg:duration-700 lg:group-hover:max-h-24 lg:group-hover:opacity-100 lg:group-focus-within:max-h-24 lg:group-focus-within:opacity-100">
                    {h.tagline[locale]}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
