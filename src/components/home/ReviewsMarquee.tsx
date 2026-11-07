import Link from "@/components/ui/SiteLink";
import { reviews, ratingSummary } from "@/content/reviews";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import { num } from "@/lib/format";
import { ReviewCard, Stars, GoogleG } from "@/components/reviews/ReviewCard";
import type { Biz } from "@/lib/biz-core";

type Props = { locale: Locale; dict: Dictionary; label: string; title: string; allLabel: string; allHref: string; biz?: Biz };

/** Two rows of Google-style reviews drifting in opposite directions (pause on hover). Phones: three in full, the rest a swipe away. */
// Previews skip the buyer from Munich and drop places from each review's context ("Kupio stan na Limanu IV" → "Kupio stan")
const placeless = (s: string) => s.replace(/\s+(na|u|in|on|from)\s+[A-ZČĆŠŽĐ].*$/, "");

export function ReviewsMarquee({ locale, dict, label, title, allLabel, allHref, biz }: Props) {
  const list = biz ? reviews.filter((r) => r.name !== "Sanja M.").map((r) => ({ ...r, context: { sr: placeless(r.context.sr), en: placeless(r.context.en) } })) : reviews;
  const rowA = list.slice(0, 5);
  const rowB = list.slice(4);
  const rating = biz ? biz.rating : ratingSummary;
  return (
    <section data-tr-gate className="theme-chalk overflow-hidden py-24 md:py-36 phone:py-9" data-header="light" aria-labelledby="reviews-title">
      <div className="wrap flex flex-col gap-8 md:flex-row md:items-end md:justify-between phone:flex-col! phone:items-start! phone:gap-3">
        <div>
          <p className="t-label text-accent">▽ {label}</p>
          <h2 id="reviews-title" className="t-h1 mt-5 max-w-[14ch] phone:mt-2 phone:max-w-none">
            {title}
          </h2>
        </div>
        {rating && (
        <div className="flex items-center gap-5 phone:gap-3">
          <GoogleG className="h-9 w-9 phone:h-7 phone:w-7" />
          <div>
            <p className="flex items-center gap-3">
              <span className="font-serif text-5xl leading-none phone:text-[2rem]">{num(rating.value, locale, 1)}</span>
              <Stars value={rating.value} />
            </p>
            <p className="t-label mt-2 text-muted phone:mt-1">
              {dict.reviewsSummary} {rating.count} {dict.reviewsWord}
            </p>
          </div>
        </div>
        )}
      </div>

      <div className="wrap mt-5 grid gap-3 desk:hidden">
        {list.slice(0, 3).map((rv) => (
          <ReviewCard key={rv.name} review={rv} locale={locale} />
        ))}
      </div>
      <ul className="phone-rail mt-3 [--rail-w:min(76vw,380px)] desk:hidden">
        {list.slice(3).map((rv) => (
          <li key={rv.name}>
            <ReviewCard review={rv} locale={locale} />
          </li>
        ))}
      </ul>

      <div className="marquee-host mt-16 grid gap-4 phone:hidden">
        {[rowA, rowB].map((row, r) => (
          <div key={r} className="flex overflow-hidden">
            <ul
              className="marquee flex shrink-0 gap-4 pr-4"
              style={{ ["--marquee-d" as string]: r ? "70s" : "58s", animationDirection: r ? "reverse" : "normal" }}
            >
              {[...row, ...row].map((rv, i) => (
                <li key={i} className="w-[82vw] shrink-0 sm:w-[420px]" aria-hidden={i >= row.length ? true : undefined}>
                  <ReviewCard review={rv} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="wrap mt-12 phone:mt-4">
        <Link href={allHref} className="link-u t-label py-2">
          {allLabel} →
        </Link>
      </div>
    </section>
  );
}
