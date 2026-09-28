import Link from "next/link";
import { reviews, ratingSummary } from "@/content/reviews";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import { num } from "@/lib/format";
import { ReviewCard, Stars, GoogleG } from "@/components/reviews/ReviewCard";

type Props = { locale: Locale; dict: Dictionary; label: string; title: string; allLabel: string; allHref: string };

/** Two rows of Google-style reviews drifting in opposite directions (pause on hover). */
export function ReviewsMarquee({ locale, dict, label, title, allLabel, allHref }: Props) {
  const rowA = reviews.slice(0, 5);
  const rowB = reviews.slice(4);
  return (
    <section className="theme-chalk overflow-hidden py-24 md:py-36" data-header="light" aria-labelledby="reviews-title">
      <div className="wrap flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="t-label text-accent">▽ {label}</p>
          <h2 id="reviews-title" className="t-h1 mt-5 max-w-[14ch]">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-5">
          <GoogleG className="h-9 w-9" />
          <div>
            <p className="flex items-center gap-3">
              <span className="font-serif text-5xl leading-none">{num(ratingSummary.value, locale, 1)}</span>
              <Stars value={ratingSummary.value} />
            </p>
            <p className="t-label mt-2 text-muted">
              {dict.reviewsSummary} {ratingSummary.count} {dict.reviewsWord}
            </p>
          </div>
        </div>
      </div>

      <div className="marquee-host mt-16 grid gap-4">
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
      <div className="wrap mt-12">
        <Link href={allHref} className="link-u t-label py-2">
          {allLabel} →
        </Link>
      </div>
    </section>
  );
}
