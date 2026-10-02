import { Button } from "@/components/ui/Button";
import { OpenStatus } from "@/components/layout/OpenStatus";
import type { Dictionary } from "@/i18n/dictionary";
import { DAY_NAMES, dayRange, weekFromMonday, type Biz } from "@/lib/biz-core";

/** A preview's "where we are": the agency's real address on a Google map, hours and directions. */
export function PreviewMap({ biz, dict }: { biz: Biz; dict: Dictionary }) {
  const query = [biz.name, biz.address.full].filter(Boolean).join(", ");
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  return (
    <section className="theme-chalk py-24 md:py-36" data-header="light" aria-labelledby="visit-title">
      <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="t-label text-accent">▽ Kancelarija</p>
          <h2 id="visit-title" className="t-h1 mt-5 max-w-[14ch]">
            Vidimo se na <em className="italic-accent">razgledanju.</em>
          </h2>
          {biz.address.full && <p className="t-lead mt-8">{biz.address.full}</p>}
          <OpenStatus dict={dict} className="mt-6" />
          {biz.hours && (
            <dl className="t-mono mt-5 grid max-w-xs grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
              {weekFromMonday(biz.hours).map((h) => (
                <div key={h.day} className="contents">
                  <dt className="text-muted">{DAY_NAMES.sr[h.day]}</dt>
                  <dd className="text-right">{dayRange(h, "sr")}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="mt-10">
            <Button href={directions} variant="outline">
              Kako do nas
            </Button>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
          <iframe src={embed} title={`Mapa: ${query}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" />
        </div>
      </div>
    </section>
  );
}
