import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import type { Listing } from "@/content/listings";
import { coverSrc, listingKota } from "@/content/listings";
import { hoodById } from "@/content/neighbourhoods";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import { kota, perM2 } from "@/lib/format";
import { detailHref } from "@/lib/routes";
import { metaLine, priceLabel } from "./ListingCard";

/** Compact horizontal row for the list view. */
export function ListingRow({
  listing: l,
  locale,
  dict,
  active,
  onHover,
}: {
  listing: Listing;
  locale: Locale;
  dict: Dictionary;
  active?: boolean;
  onHover?: (id: string | null) => void;
}) {
  return (
    <article onPointerEnter={() => onHover?.(l.id)} onPointerLeave={() => onHover?.(null)}>
      <Link
        href={detailHref(locale, "listings", l.slug)}
        className={clsx(
          "group grid grid-cols-[7rem_1fr] items-center gap-5 border-b border-line py-5 transition-colors sm:grid-cols-[11rem_1fr_auto] sm:gap-8",
          active && "bg-surface",
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
          <Image src={coverSrc(l)} alt={l.photos[0][locale]} fill sizes="180px" quality={60} className="object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
        <div className="min-w-0">
          <p className="t-label text-muted">
            ▽ {kota(listingKota(l))} · {hoodById(l.hood).name[locale]} · {dict.type[l.type]}
            {l.badge && <span className="ml-2 text-accent">{dict.badge[l.badge]}</span>}
          </p>
          <h3 className="mt-2 font-serif text-[1.25rem] leading-tight sm:text-[1.6rem]">{l.title[locale]}</h3>
          <p className="t-mono mt-2 text-[0.82rem] text-muted">{metaLine(l, locale, dict)}</p>
          <p className="t-mono mt-2 text-[0.95rem] sm:hidden">{priceLabel(l, locale, dict)}</p>
        </div>
        <div className="hidden text-right sm:block">
          <p className="t-mono text-[1.15rem]">{priceLabel(l, locale, dict)}</p>
          {l.deal === "sale" && <p className="t-mono mt-1 text-[0.8rem] text-muted">{perM2(l.price, l.area, locale)}</p>}
          <span className="t-label mt-3 inline-block transition-transform duration-500 group-hover:translate-x-1">{dict.cta.view} →</span>
        </div>
      </Link>
    </article>
  );
}
