"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { NoviSadMap, type MapPin } from "@/components/map/NoviSadMap";
import { hoods, type HoodId } from "@/content/neighbourhoods";
import type { Locale } from "@/lib/i18n";
import { eur } from "@/lib/format";

type Props = {
  locale: Locale;
  label: string;
  title: string;
  lead: string;
  guideLabel: string;
  pins: MapPin[];
  guideHrefs: Partial<Record<HoodId, string>>;
  listingsHref: string;
};

export function MapTeaser({ locale, label, title, lead, guideLabel, pins, guideHrefs, listingsHref }: Props) {
  const [active, setActive] = useState<HoodId | null>(null);
  const [pin, setPin] = useState<string | null>(null);
  const sorted = [...hoods].sort((a, b) => b.pricePerM2 - a.pricePerM2);
  const max = sorted[0].pricePerM2;

  return (
    <section className="theme-chalk py-24 md:py-36" data-header="light" aria-labelledby="map-title">
      <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-center">
        <div>
          <p className="t-label text-accent">▽ {label}</p>
          <h2 id="map-title" className="t-h1 mt-5">
            {title}
          </h2>
          <p className="t-lead mt-6 max-w-[42ch] text-muted">{lead}</p>
          <ul className="mt-10 border-t border-line" onPointerLeave={() => setActive(null)}>
            {sorted.map((h) => {
              const href = guideHrefs[h.id];
              const isActive = active === h.id;
              const row = (
                <span className="flex items-center gap-4 py-3.5">
                  <span className={clsx("min-w-0 flex-1 font-serif text-[1.35rem] transition-colors sm:w-40 sm:flex-none", isActive && "text-accent")}>{h.name[locale]}</span>
                  <span className="relative hidden h-px flex-1 bg-line sm:block">
                    <span
                      className="absolute inset-y-0 left-0 origin-left bg-current transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ width: `${(h.pricePerM2 / max) * 100}%`, transform: isActive ? "scaleX(1)" : "scaleX(0.35)" }}
                    />
                  </span>
                  <span className="t-mono w-28 shrink-0 text-right text-sm">{eur(h.pricePerM2, locale)}/m²</span>
                  <span className={clsx("t-label w-14 shrink-0 text-right text-accent", !href && "opacity-0")}>{href ? `${guideLabel} →` : ""}</span>
                </span>
              );
              return (
                <li key={h.id} className="border-b border-line" onPointerEnter={() => setActive(h.id)}>
                  {href ? (
                    <Link href={href} onFocus={() => setActive(h.id)} onBlur={() => setActive(null)} className="block">
                      {row}
                    </Link>
                  ) : (
                    <Link href={`${listingsHref}?hood=${h.id}`} onFocus={() => setActive(h.id)} onBlur={() => setActive(null)} className="block">
                      {row}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="relative -mx-[var(--gutter)] bg-kamen p-3 text-dunav sm:mx-0 sm:p-6">
          <NoviSadMap
            locale={locale}
            title={title}
            pins={pins}
            activePin={pin}
            onPinHover={setPin}
            activeHood={active}
            onHoodHover={setActive}
            hoodHref={(id) => guideHrefs[id]}
          />
        </div>
      </div>
    </section>
  );
}
