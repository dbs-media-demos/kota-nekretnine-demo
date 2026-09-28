import Link from "next/link";
import type { Listing } from "@/content/listings";
import { hoodById, landmarks, walkMinutes } from "@/content/neighbourhoods";
import type { Locale } from "@/lib/i18n";
import { detailHref } from "@/lib/routes";
import { eur } from "@/lib/format";
import { NoviSadMap } from "@/components/map/NoviSadMap";
import { Reveal } from "@/components/ui/Reveal";

const SOUTH = new Set(["fortress"]);

/** Where the home sits: zoomed map + walking minutes to the city's anchors. */
export function HoodPanel({ listing: l, locale, copy }: { listing: Listing; locale: Locale; copy: { hood: string; walk: string; min: string; guide: string } }) {
  const hood = hoodById(l.hood);
  const onSouth = hood.bank === "south";
  const times = landmarks.map((m) => ({
    id: m.id,
    name: m.name[locale],
    min: walkMinutes(l.at, m.at, onSouth !== SOUTH.has(m.id)),
  }));
  const max = Math.max(...times.map((t) => t.min), 30);
  // Crop the map around the listing.
  const w = 520;
  const h = 360;
  const x = Math.min(Math.max(l.at[0] - w / 2, -20), 1020 - w);
  const y = Math.min(Math.max(l.at[1] - h / 2, 60), 700 - h);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="t-h3">
          {copy.hood}: {hood.name[locale]}
        </h2>
        <p className="t-mono text-sm text-muted">≈ {eur(hood.pricePerM2, locale)}/m²</p>
      </div>
      <p className="mt-3 max-w-[56ch] text-muted">{hood.tagline[locale]}</p>
      <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="bg-kamen p-2 text-dunav">
          <NoviSadMap
            locale={locale}
            title={`${copy.hood}: ${hood.name[locale]}`}
            pins={[{ id: l.id, at: l.at, label: l.street }]}
            activePin={l.id}
            activeHood={l.hood}
            viewBox={`${x} ${y} ${w} ${h}`}
            animate={false}
          />
        </div>
        <div>
          <p className="t-label text-muted">{copy.walk}</p>
          <Reveal as="ul" stagger={0.08} className="mt-4 grid gap-4">
            {times.map((t) => (
              <li key={t.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <span>{t.name}</span>
                  <span className="t-mono text-sm">
                    {t.min} {copy.min}
                  </span>
                </div>
                <div className="mt-2 h-0.5 bg-line">
                  <div className="h-full bg-mesing" style={{ width: `${(t.min / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </Reveal>
          {hood.slug && (
            <Link href={detailHref(locale, "hoods", hood.slug)} className="link-u t-label mt-8 inline-block py-2 text-accent">
              {copy.guide}: {hood.name[locale]} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
