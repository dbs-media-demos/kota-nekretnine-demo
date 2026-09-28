import Link from "next/link";
import Image from "next/image";
import { ViewTransition } from "react";
import clsx from "clsx";
import type { Listing } from "@/content/listings";
import { coverSrc, photoSrc, listingKota } from "@/content/listings";
import { hoodById } from "@/content/neighbourhoods";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import { eur, kota, num, rooms } from "@/lib/format";
import { detailHref } from "@/lib/routes";
import { HoverPhoto } from "./HoverPhoto";

type Props = {
  listing: Listing;
  locale: Locale;
  dict: Dictionary;
  sizes?: string;
  aspect?: "tall" | "wide" | "square";
  className?: string;
  active?: boolean;
  onHover?: (id: string | null) => void;
  /** Participates in the card → gallery morph. Only one card per id on a page may set this. */
  morph?: boolean;
  priority?: boolean;
};

export function priceLabel(l: Listing, locale: Locale, dict: Dictionary) {
  return l.deal === "rent" ? `${eur(l.price, locale)}${dict.units.perMonth}` : eur(l.price, locale);
}

export function metaLine(l: Listing, locale: Locale, dict: Dictionary) {
  const parts = [`${num(l.area, locale)} m²`, `${rooms(l.rooms)}`];
  if (l.type === "house") parts.push(`${dict.units.plot} ${num(l.plot ?? 0, locale)} m²`);
  else parts.push(l.floor === 0 ? dict.units.ground : `${l.floor}/${l.floors} ${dict.units.floor}`);
  return parts.join(" · ");
}

export function ListingCard({ listing: l, locale, dict, sizes = "(min-width: 1024px) 30vw, 90vw", aspect = "tall", className, active, onHover, morph = true, priority }: Props) {
  const hood = hoodById(l.hood);
  const href = detailHref(locale, "listings", l.slug);
  const frame = (
    <div
      className={clsx(
        "relative overflow-hidden bg-surface-2",
        aspect === "tall" ? "aspect-[4/5]" : aspect === "wide" ? "aspect-[3/2]" : "aspect-square",
      )}
    >
      <Image
        src={coverSrc(l)}
        alt={l.photos[0][locale]}
        fill
        sizes={sizes}
        quality={75}
        preload={priority}
        className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
      />
      <HoverPhoto src={photoSrc(l, 1)} sizes={sizes} />
    </div>
  );

  return (
    <article
      className={clsx("group relative", className)}
      onPointerEnter={onHover ? () => onHover(l.id) : undefined}
      onPointerLeave={onHover ? () => onHover(null) : undefined}
    >
      <Link href={href} className="block" data-cursor={dict.cta.view} transitionTypes={["nav-forward"]}>
        <div className="relative">
          {morph ? (
            <ViewTransition name={`photo-${l.id}`} share="morph" default="none">
              {frame}
            </ViewTransition>
          ) : (
            frame
          )}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
            {l.badge ? (
              <span
                className={clsx(
                  "t-label rounded-full px-3 py-1.5 !text-[0.62rem]",
                  l.badge === "reserved" ? "bg-dunav text-kamen" : "bg-kreda text-dunav",
                )}
              >
                {dict.badge[l.badge]}
              </span>
            ) : (
              <span />
            )}
            <span className="t-label rounded-full bg-dunav/75 px-2.5 py-1.5 !text-[0.62rem] text-kamen backdrop-blur-sm">
              ▽ {kota(listingKota(l))}
            </span>
          </div>
          <span
            className={clsx(
              "pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left bg-mesing transition-transform duration-700",
              active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
            )}
          />
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <p className="t-label text-muted">
            {hood.name[locale]} · {dict.type[l.type]}
          </p>
          <p className="t-mono shrink-0 text-[1.02rem]">{priceLabel(l, locale, dict)}</p>
        </div>
        <h3 className="mt-2 font-serif text-[1.45rem] leading-[1.12] tracking-[-0.01em]" style={{ fontVariationSettings: '"opsz" 36' }}>
          {l.title[locale]}
        </h3>
        <p className="t-mono mt-2 text-[0.82rem] text-muted">{metaLine(l, locale, dict)}</p>
      </Link>
    </article>
  );
}
