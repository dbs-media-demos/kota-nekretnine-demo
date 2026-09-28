import clsx from "clsx";

/**
 * The Kota mark: an architect's level symbol (▽ sitting on a datum line),
 * half filled — the half that's "built".
 */
export function Mark({ className, accent = "currentColor" }: { className?: string; accent?: string }) {
  return (
    <svg viewBox="0 0 40 28" className={className} aria-hidden="true" focusable="false">
      <path d="M7 4h22L18 22Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 4h11v18Z" fill={accent} />
      <path d="M0 22h40" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Logo({ className, sub, accent }: { className?: string; sub?: string; accent?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5 leading-none", className)}>
      <Mark className="h-[0.95em] w-auto shrink-0" accent={accent ?? "var(--mesing)"} />
      <span className="flex flex-col">
        <span className="font-serif text-[1.05em] tracking-[0.26em]" style={{ fontVariationSettings: '"opsz" 24' }}>
          KOTA
        </span>
        {sub && <span className="t-label mt-1 !text-[0.5em] !tracking-[0.3em] opacity-80">{sub}</span>}
      </span>
    </span>
  );
}
