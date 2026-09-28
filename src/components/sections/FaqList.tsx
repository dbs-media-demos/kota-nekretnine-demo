import type { Faq } from "@/content/faq";
import type { Locale } from "@/lib/i18n";

/** Native <details> accordion: keyboard-accessible, works without JS. */
export function FaqList({ items, locale }: { items: Faq[]; locale: Locale }) {
  return (
    <div className="border-t border-line">
      {items.map((f) => (
        <details key={f.q.en} className="group border-b border-line">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
            <span className="font-serif text-[clamp(1.2rem,1.8vw,1.6rem)] leading-snug">{f.q[locale]}</span>
            <span className="relative block h-4 w-4 shrink-0" aria-hidden="true">
              <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
              <span className="absolute left-1/2 top-0 h-4 w-px bg-current transition-transform duration-500 group-open:rotate-90" />
            </span>
          </summary>
          <p className="max-w-[70ch] pb-7 leading-relaxed text-muted">{f.a[locale]}</p>
        </details>
      ))}
    </div>
  );
}
