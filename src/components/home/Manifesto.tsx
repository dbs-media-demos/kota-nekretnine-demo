import { ScrubWords, Counter, DimLine } from "@/components/ui/Reveal";
import { homeCopy as c } from "@/content/home";
import type { Locale } from "@/lib/i18n";

export function Manifesto({ locale }: { locale: Locale }) {
  return (
    <section className="theme-light py-28 md:py-40" data-header="light">
      <div className="wrap">
        <DimLine label={locale === "sr" ? "1 : 100" : "Scale 1 : 100"} className="mb-14 text-muted" />
        <ScrubWords
          text={c.manifesto[locale]}
          className="font-serif text-[clamp(1.9rem,4.4vw,4.4rem)] leading-[1.08] tracking-[-0.02em] [font-variation-settings:'opsz'_72]"
        />
        <dl className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-line pt-12 md:grid-cols-4">
          {c.stats.map((s) => (
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
