import { ScrubWords, Counter, DimLine } from "@/components/ui/Reveal";
import { homeCopy as c } from "@/content/home";
import type { Locale } from "@/lib/i18n";
import { openDays, type Biz } from "@/lib/biz-core";

export function Manifesto({ locale, biz }: { locale: Locale; biz?: Biz }) {
  const days = biz ? openDays(biz) : 0;
  const stats = biz
    ? [
        ...(biz.rating ? [{ value: biz.rating.value, suffix: "★", decimals: 1, label: { sr: `na ${biz.rating.count} Google utisaka`, en: `from ${biz.rating.count} Google reviews` } }] : []),
        ...(days ? [{ value: days, suffix: "", label: { sr: "dana nedeljno radimo", en: "days a week we're open" } }] : []),
        { value: 24, suffix: " h", label: { sr: "do potvrde procene", en: "to confirm a valuation" } },
        { value: 0, suffix: " €", label: { sr: "ako posao ne uspe", en: "if the deal doesn't close" } },
      ]
    : c.stats;
  return (
    <section className="theme-light py-28 md:py-40" data-header="light">
      <div className="wrap">
        <DimLine label={locale === "sr" ? "1 : 100" : "Scale 1 : 100"} className="mb-14 text-muted" />
        <ScrubWords
          text={c.manifesto[locale]}
          className="font-serif text-[clamp(1.9rem,4.4vw,4.4rem)] leading-[1.08] tracking-[-0.02em]"
        />
        <dl className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-line pt-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label.en} className="flex flex-col">
              <dt className="t-label order-2 mt-3 text-muted">{s.label[locale]}</dt>
              <dd className="order-1 font-serif text-[clamp(2.6rem,5vw,4.5rem)] leading-none tracking-[-0.03em]">
                <Counter value={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} locale={locale} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
