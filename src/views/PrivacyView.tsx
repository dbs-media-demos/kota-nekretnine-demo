import { PageHero } from "@/components/sections/PageHero";
import { privacyPage } from "@/content/pages-more";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { pick } from "@/lib/pick";

export function PrivacyView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const c = pick(privacyPage, locale);
  return (
    <>
      <PageHero
        crumbs={[
          { name: dict.breadcrumbHome, url: pageHref(locale, "home") },
          { name: c.title, url: pageHref(locale, "privacy") },
        ]}
        label={c.label}
        title={c.title}
        lead={c.updated}
      />
      <section className="theme-light pb-28" data-header="light">
        <div className="wrap">
          <div className="grid max-w-3xl gap-10 border-t border-line pt-10">
            {c.sections.map((s, i) => (
              <div key={s.h}>
                <h2 className="t-h3">
                  <span className="t-mono mr-3 text-base text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {s.h}
                </h2>
                <p className="mt-4 leading-relaxed text-muted">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
