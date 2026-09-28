import clsx from "clsx";
import type { Review } from "@/content/reviews";
import type { Locale } from "@/lib/i18n";

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span role="img" className={clsx("inline-flex gap-0.5 text-mesing", className)} aria-label={`${value} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={clsx("h-4 w-4", i >= Math.round(value) && "opacity-25")} aria-hidden="true">
          <path fill="currentColor" d="m10 1.5 2.6 5.5 6 .7-4.4 4.1 1.2 5.9L10 14.8l-5.4 2.9 1.2-5.9L1.4 7.7l6-.7Z" />
        </svg>
      ))}
    </span>
  );
}

export function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7Z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.8-3.8h-4v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8Z" />
    </svg>
  );
}

export function ReviewCard({ review, locale, className }: { review: Review; locale: Locale; className?: string }) {
  const date = new Intl.DateTimeFormat(locale === "sr" ? "sr-Latn-RS" : "en-GB", { month: "long", year: "numeric" }).format(new Date(review.date));
  return (
    <figure className={clsx("flex h-full flex-col gap-5 border border-line bg-surface p-7", className)}>
      <div className="flex items-center justify-between">
        <Stars value={review.rating} />
        <GoogleG className="h-5 w-5" />
      </div>
      <blockquote className="flex-1 text-[1.02rem] leading-relaxed">“{review.text[locale]}”</blockquote>
      <figcaption className="flex items-end justify-between gap-4 border-t border-line pt-4">
        <span>
          <span className="block font-medium">{review.name}</span>
          <span className="t-label mt-1 block text-muted">{review.context[locale]}</span>
        </span>
        <span className="t-mono shrink-0 text-xs text-muted">{date}</span>
      </figcaption>
    </figure>
  );
}
