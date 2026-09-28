import { PageHero } from "@/components/sections/PageHero";
import { ValuationFunnel } from "@/components/valuation/ValuationFunnel";
import { JsonLd } from "@/components/seo/JsonLd";
import { hoods } from "@/content/neighbourhoods";
import { valuationPage } from "@/content/pages";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { eur } from "@/lib/format";
import { pick } from "@/lib/pick";
import { conditionFactor, type Condition } from "@/lib/valuation";
import { graph, serviceSchema } from "@/lib/schema";

export function ValuationView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const c = pick(valuationPage, locale);
  const conds: Condition[] = ["renovate", "good", "renovated", "new"];
  return (
    <>
      <JsonLd data={graph(serviceSchema(locale, c.title, c.metaDescription, pageHref(locale, "valuation")))} />
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, url: pageHref(locale, "home") },
          { name: c.label, url: pageHref(locale, "valuation") },
        ]}
        label={c.label}
        kota={0}
        title={c.title}
        lead={c.lead}
      />
      <section className="theme-light pb-24 md:pb-36" data-header="light">
        <div className="wrap">
          <div className="border-t border-line pt-10">
            <ValuationFunnel locale={locale} copy={c} />
          </div>
        </div>
      </section>
      <section className="theme-chalk py-24 md:py-32" data-header="light">
        <div className="wrap">
          <h2 className="t-h2">{c.tableTitle}</h2>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-dunav">
                  <th scope="col" className="t-label py-3 pr-4 font-normal">
                    {c.tableHood}
                  </th>
                  {conds.map((k) => (
                    <th key={k} scope="col" className="t-label py-3 pr-4 text-right font-normal">
                      {c.conditions[k][0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...hoods]
                  .sort((a, b) => b.pricePerM2 - a.pricePerM2)
                  .map((h) => (
                    <tr key={h.id} className="border-b border-line">
                      <th scope="row" className="py-4 pr-4 font-serif text-lg font-normal">
                        {h.name[locale]}
                      </th>
                      {conds.map((k) => (
                        <td key={k} className="t-mono py-4 pr-4 text-right">
                          {eur(Math.round((h.pricePerM2 * (1 + conditionFactor[k])) / 10) * 10, locale)}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-sm text-muted">{c.tableNote}</p>
        </div>
      </section>
    </>
  );
}
