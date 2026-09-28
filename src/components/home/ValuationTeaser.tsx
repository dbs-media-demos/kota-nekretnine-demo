"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { hoods, type HoodId } from "@/content/neighbourhoods";
import type { Locale } from "@/lib/i18n";
import { estimate } from "@/lib/valuation";
import { eur } from "@/lib/format";
import { Parallax, DimLine } from "@/components/ui/Reveal";
import { useAnimatedNumber } from "@/components/ui/useAnimatedNumber";

type Props = {
  locale: Locale;
  copy: { label: string; title: string; lead: string; area: string; hood: string; range: string; cta: string };
  href: string;
  photoAlt: string;
};

/** Live mini-estimate that hands off to the full valuation funnel. */
export function ValuationTeaser({ locale, copy, href, photoAlt }: Props) {
  const [hood, setHood] = useState<HoodId>("liman");
  const [area, setArea] = useState(62);
  const est = useMemo(
    () => estimate({ hood, area: Math.max(15, Math.min(400, area || 0)), floor: "mid", condition: "good", features: ["registered", "elevator"] }),
    [hood, area],
  );
  const low = useAnimatedNumber(est.low);
  const high = useAnimatedNumber(est.high);

  return (
    <section className="theme-light py-24 md:py-36" data-header="light" aria-labelledby="val-title">
      <div className="wrap grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="relative">
          <Parallax className="aspect-[4/5] w-full" amount={14}>
            <div className="absolute inset-0">
              <Image src="/images/listings/l10/02.jpg" alt={photoAlt} fill sizes="(min-width: 1024px) 45vw, 92vw" quality={70} className="object-cover" />
            </div>
          </Parallax>
          <DimLine label="7.00 m" className="mt-3 text-muted" />
        </div>
        <div>
          <p className="t-label text-accent">▽ {copy.label}</p>
          <h2 id="val-title" className="t-h1 mt-5 max-w-[12ch]">
            {copy.title}
          </h2>
          <p className="t-lead mt-6 max-w-[44ch] text-muted">{copy.lead}</p>

          <form
            className="mt-10 grid gap-6 sm:grid-cols-2"
            action={href}
            method="get"
          >
            <label className="grid gap-1">
              <span className="t-label text-muted">{copy.hood}</span>
              <select name="kraj" value={hood} onChange={(e) => setHood(e.target.value as HoodId)} className="field text-lg">
                {hoods.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name[locale]}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="t-label text-muted">{copy.area}</span>
              <input
                name="m2"
                type="number"
                inputMode="numeric"
                min={15}
                max={400}
                value={area || ""}
                onChange={(e) => setArea(Number(e.target.value))}
                className="field t-mono text-lg"
              />
            </label>
            <div className="border-t border-line pt-6 sm:col-span-2">
              <p className="t-label text-muted">{copy.range}</p>
              <p className="t-mono mt-3 text-[clamp(1.8rem,3.6vw,3rem)] leading-none tracking-[-0.03em]" aria-live="polite">
                {eur(low, locale)} – {eur(high, locale)}
              </p>
              <p className="t-mono mt-2 text-sm text-muted">≈ {eur(est.perM2, locale)}/m²</p>
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-dunav px-6 font-medium text-kamen transition-colors hover:bg-mesing hover:text-dunav">
                {copy.cta} <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
