import Link from "next/link";
import { Mark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { DimLine } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref, detailHref } from "@/lib/routes";
import { hours, site } from "@/lib/site";
import { guidedHoods } from "@/content/neighbourhoods";
import { OpenStatus } from "./OpenStatus";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const explore = (["listings", "hoods", "sell", "valuation", "about", "reviews", "faq", "contact"] as const).map((k) => ({
    label: dict.nav[k],
    href: pageHref(locale, k),
  }));
  const year = new Date().getFullYear();

  return (
    <footer className="theme-dark relative overflow-hidden" data-header="dark">
      <div className="wrap pb-10 pt-24 md:pt-32">
        <div className="grid gap-10 border-b border-line pb-16 md:grid-cols-[1.4fr_1fr] md:items-end">
          <p className="t-h1 max-w-[12ch]">
            {locale === "sr" ? (
              <>
                Vidimo se na <em className="italic-accent">razgledanju.</em>
              </>
            ) : (
              <>
                See you at the <em className="italic-accent">viewing.</em>
              </>
            )}
          </p>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button href={pageHref(locale, "contact")} variant="brass">
              {dict.cta.book}
            </Button>
            <Button href={`tel:${site.phone}`} variant="outline">
              {site.phoneDisplay}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:grid-cols-4">
          <div>
            <p className="t-label mb-5 text-muted">{dict.footer.explore}</p>
            <ul className="grid gap-2.5">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-u">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="t-label mb-5 text-muted">{dict.nav.hoods}</p>
            <ul className="grid gap-2.5">
              {guidedHoods.map((h) => (
                <li key={h.id}>
                  <Link href={detailHref(locale, "hoods", h.slug!)} className="link-u">
                    {h.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="t-label mb-5 text-muted">{dict.footer.visit}</p>
            <address className="not-italic leading-relaxed">
              {site.legalName}
              <br />
              {site.street}
              <br />
              {site.postalCode} {site.city}
            </address>
            <OpenStatus dict={dict} className="mt-5" />
          </div>
          <div>
            <p className="t-label mb-5 text-muted">{dict.hoursLabel}</p>
            <dl className="t-mono grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                const h = hours.find((x) => x.day === d);
                return (
                  <div key={d} className="contents">
                    <dt className="text-muted">{dict.daysShort[d]}</dt>
                    <dd>{h ? `${h.open}–${h.close}` : "—"}</dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-3 text-sm text-muted">{dict.sundayNote}</p>
            <div className="mt-6 grid gap-1.5 text-sm">
              <a href={`tel:${site.phone}`} className="link-u w-fit">
                {site.phoneDisplay}
              </a>
              <a href={`mailto:${site.email}`} className="link-u w-fit">
                {site.email}
              </a>
            </div>
          </div>
        </div>

        <div className="relative select-none" aria-hidden="true">
          <DimLine label="45°15′N · 19°50′E · Novi Sad" className="mb-4 text-muted" />
          <div className="flex items-end gap-[2vw] leading-none">
            <Mark className="w-[13vw] max-w-[220px] text-kamen" accent="var(--mesing)" />
            <span className="font-serif text-[clamp(5rem,24vw,24rem)] leading-[0.75] tracking-[0.12em]" style={{ fontVariationSettings: '"opsz" 96' }}>
              KOTA
            </span>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}. {dict.footer.rights} {dict.footer.registry}: {site.registry}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href={pageHref(locale, "privacy")} className="link-u">
              {locale === "sr" ? "Privatnost" : "Privacy"}
            </Link>
            <a href="https://dbs-media.com" target="_blank" rel="noopener" className="link-u text-kamen">
              {dict.footer.credit}
            </a>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted">{dict.footer.demo}</p>
      </div>
    </footer>
  );
}
