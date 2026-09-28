"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";
import { listings, type Feature, type PropertyType } from "@/content/listings";
import { hoods, type HoodId } from "@/content/neighbourhoods";
import { listingsPage as c } from "@/content/pages";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/i18n/dictionary";
import { eur, num } from "@/lib/format";
import { detailHref } from "@/lib/routes";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Flip } from "gsap/Flip";

if (typeof window !== "undefined") gsap.registerPlugin(Flip);
import { NoviSadMap } from "@/components/map/NoviSadMap";
import { ListingCard, priceLabel } from "./ListingCard";
import { ListingRow } from "./ListingRow";
import {
  DEFAULT_FILTERS,
  PRICE_BOUNDS,
  ROOM_OPTIONS,
  AREA_OPTIONS,
  FILTER_FEATURES,
  parseFilters,
  serializeFilters,
  matches,
  sortListings,
  activeCount,
  type Filters,
  type View,
  type Sort,
} from "./search-model";

const TYPES: PropertyType[] = ["apartment", "studio", "penthouse", "loft", "house"];

function Chip({ active, onClick, children, className }: { active: boolean; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[0.88rem] transition-[background-color,color,border-color] duration-300",
        active ? "border-dunav bg-dunav text-kamen" : "border-line hover:border-dunav/60",
        className,
      )}
    >
      {children}
    </button>
  );
}

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export function ListingsSearch({ locale, dict, contactHref }: { locale: Locale; dict: Dictionary; contactHref: string }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [hovered, setHovered] = useState<string | null>(null);
  const [more, setMore] = useState(false);
  const [copied, setCopied] = useState(false);
  const flipState = useRef<Flip.FlipState | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);

  // Read the shareable URL once mounted (the page itself is static).
  useEffect(() => {
    const parsed = parseFilters(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from the URL after mount
    setFilters(parsed);
    if (parsed.min !== null || parsed.max !== null || parsed.area !== null || parsed.rooms.length || parsed.f.length) setMore(true);
    setHydrated(true);
  }, []);

  // Keep the URL in sync without a navigation.
  useEffect(() => {
    if (!hydrated) return;
    const url = `${window.location.pathname}${serializeFilters(filters)}`;
    if (url !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(window.history.state, "", url);
      window.dispatchEvent(new Event("kota:query"));
    }
  }, [filters, hydrated]);

  const update = (patch: Partial<Filters>) => {
    if (gridRef.current && !prefersReducedMotion()) {
      flipState.current = Flip.getState(gridRef.current.querySelectorAll("[data-item]"));
    }
    setFilters((f) => ({ ...f, ...patch }));
  };

  // Animate cards from their old positions to the new ones.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !gridRef.current) return;
    flipState.current = null;
    Flip.from(state, {
      targets: gridRef.current.querySelectorAll("[data-item]"),
      duration: 0.8,
      ease: "expo.out",
      absolute: true,
      nested: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.1, ease: "expo.out" }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.35 }),
    });
  }, [filters]);

  const sorted = useMemo(() => sortListings(listings, filters.sort), [filters.sort]);
  const visible = useMemo(() => sorted.filter((l) => matches(l, filters)), [sorted, filters]);
  const visibleIds = new Set(visible.map((l) => l.id));
  const count = activeCount(filters);
  const bounds = filters.deal !== "all" ? PRICE_BOUNDS[filters.deal] : null;
  const lo = bounds ? (filters.min ?? bounds.min) : 0;
  const hi = bounds ? (filters.max ?? bounds.max) : 0;

  const pins = visible.map((l) => ({ id: l.id, at: l.at, label: priceLabel(l, locale, dict), href: detailHref(locale, "listings", l.slug) }));

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const setView = (view: View) => setFilters((f) => ({ ...f, view }));

  return (
    <section className="theme-light pb-24" data-header="light" aria-label={c.filters[locale]}>
      {/* ── Filters ── */}
      <div className="wrap">
        <div className="border-y border-line py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex rounded-full border border-line p-1" role="group" aria-label={dict.deal.sale}>
              {(["all", "sale", "rent"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={filters.deal === d}
                  onClick={() => update({ deal: d, min: null, max: null })}
                  className={clsx(
                    "min-h-10 rounded-full px-5 text-[0.9rem] transition-colors duration-300",
                    filters.deal === d ? "bg-dunav text-kamen" : "hover:bg-surface",
                  )}
                >
                  {d === "all" ? c.all[locale] : dict.dealVerb[d]}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="sr-only" htmlFor="sort">
                {c.sort[locale]}
              </label>
              <select
                id="sort"
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value as Sort })}
                className="min-h-10 rounded-full border border-line bg-transparent px-4 text-[0.88rem]"
              >
                {(Object.keys(c.sorts) as Sort[]).map((s) => (
                  <option key={s} value={s}>
                    {c.sorts[s][locale]}
                  </option>
                ))}
              </select>
              <div className="inline-flex rounded-full border border-line p-1" role="group" aria-label="View">
                {(["grid", "list", "map"] as View[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={filters.view === v}
                    onClick={() => setView(v)}
                    className={clsx("min-h-9 rounded-full px-4 text-[0.85rem] transition-colors", filters.view === v ? "bg-mesing text-dunav" : "hover:bg-surface")}
                  >
                    {c.views[v][locale]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="no-scrollbar -mx-[var(--gutter)] mt-5 flex gap-2 overflow-x-auto px-[var(--gutter)] md:mx-0 md:flex-wrap md:px-0">
            <span className="t-label mr-2 self-center text-muted">{c.type[locale]}</span>
            {TYPES.map((t) => (
              <Chip key={t} active={filters.types.includes(t)} onClick={() => update({ types: toggle(filters.types, t) })}>
                {dict.type[t]}
              </Chip>
            ))}
          </div>
          <div className="no-scrollbar -mx-[var(--gutter)] mt-3 flex gap-2 overflow-x-auto px-[var(--gutter)] md:mx-0 md:flex-wrap md:px-0">
            <span className="t-label mr-2 self-center text-muted">{c.hood[locale]}</span>
            {hoods.map((h) => (
              <Chip key={h.id} active={filters.hoods.includes(h.id)} onClick={() => update({ hoods: toggle(filters.hoods, h.id as HoodId) })}>
                {h.name[locale]}
              </Chip>
            ))}
          </div>

          <div className={clsx("grid overflow-hidden transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]", more ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
            <div className="min-h-0">
              <div className="grid gap-8 pt-8 md:grid-cols-2 xl:grid-cols-4">
                <fieldset>
                  <legend className="t-label mb-3 text-muted">{c.price[locale]}</legend>
                  {bounds ? (
                    <>
                      <p className="t-mono text-[0.95rem]">
                        {eur(lo, locale)} – {eur(hi, locale)}
                        {filters.deal === "rent" ? dict.units.perMonth : ""}
                      </p>
                      <div className="relative mt-1 h-11">
                        <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-line" />
                        <span
                          className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-dunav"
                          style={{
                            left: `${((lo - bounds.min) / (bounds.max - bounds.min)) * 100}%`,
                            right: `${100 - ((hi - bounds.min) / (bounds.max - bounds.min)) * 100}%`,
                          }}
                        />
                        <input
                          type="range"
                          className="range range-dual"
                          min={bounds.min}
                          max={bounds.max}
                          step={bounds.step}
                          value={lo}
                          aria-label={`${c.price[locale]} min`}
                          onChange={(e) => update({ min: Math.min(Number(e.target.value), hi - bounds.step) })}
                        />
                        <input
                          type="range"
                          className="range range-dual"
                          min={bounds.min}
                          max={bounds.max}
                          step={bounds.step}
                          value={hi}
                          aria-label={`${c.price[locale]} max`}
                          onChange={(e) => update({ max: Math.max(Number(e.target.value), lo + bounds.step) })}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted">{c.priceHint[locale]}</p>
                  )}
                </fieldset>

                <fieldset>
                  <legend className="t-label mb-3 text-muted">{c.area[locale]}</legend>
                  <div className="flex flex-wrap gap-2">
                    <Chip active={filters.area === null} onClick={() => update({ area: null })}>
                      {c.anyArea[locale]}
                    </Chip>
                    {AREA_OPTIONS.map((a) => (
                      <Chip key={a} active={filters.area === a} onClick={() => update({ area: a })}>
                        <span className="t-mono">{a}+</span>
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="t-label mb-3 text-muted">{c.rooms[locale]}</legend>
                  <div className="flex flex-wrap gap-2">
                    {ROOM_OPTIONS.map((r) => (
                      <Chip key={r} active={filters.rooms.includes(r)} onClick={() => update({ rooms: toggle(filters.rooms, r) })} className="!px-3">
                        <span className="t-mono">
                          {r}
                          {r === "4.0" ? "+" : ""}
                        </span>
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="t-label mb-3 text-muted">{c.features[locale]}</legend>
                  <div className="flex flex-wrap gap-2">
                    {FILTER_FEATURES.map((ft: Feature) => (
                      <Chip key={ft} active={filters.f.includes(ft)} onClick={() => update({ f: toggle(filters.f, ft) })}>
                        {dict.feature[ft]}
                      </Chip>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-5">
              <button type="button" onClick={() => setMore((m) => !m)} aria-expanded={more} className="link-u t-label py-2">
                {more ? c.less[locale] : c.more[locale]} {more ? "−" : "+"}
              </button>
              {count > 0 && (
                <button type="button" onClick={() => update({ ...DEFAULT_FILTERS, view: filters.view, sort: filters.sort })} className="link-u t-label py-2 text-accent">
                  {c.reset[locale]} ({count})
                </button>
              )}
            </div>
            <div className="flex items-center gap-5">
              <p className="t-label" aria-live="polite">
                {c.found[locale]}: <span className="t-mono text-[0.95rem] text-fg">{num(visible.length, locale)}</span> {c.results[locale]}
              </p>
              <button type="button" onClick={copyLink} className="link-u t-label hidden py-2 text-muted sm:inline">
                {copied ? `✓ ${c.copied[locale]}` : c.share[locale]}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="wrap mt-10">
        <h2 className="sr-only">
          {c.found[locale]}: {visible.length} {c.results[locale]}
        </h2>
        <div className={clsx(filters.view === "map" && "grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]")}>
          <div
            ref={gridRef}
            className={clsx(
              filters.view === "grid" && "grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3",
              filters.view === "map" && "grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:order-1",
              filters.view === "list" && "border-t border-line",
            )}
          >
            {sorted.map((l) =>
              filters.view === "list" ? (
                <div key={l.id} data-item data-flip-id={l.id} className={visibleIds.has(l.id) ? "" : "hidden"}>
                  <ListingRow listing={l} locale={locale} dict={dict} active={hovered === l.id} onHover={setHovered} />
                </div>
              ) : (
                <div key={l.id} data-item data-flip-id={l.id} className={visibleIds.has(l.id) ? "" : "hidden"}>
                  <ListingCard
                    listing={l}
                    locale={locale}
                    dict={dict}
                    aspect={filters.view === "map" ? "wide" : "tall"}
                    sizes={filters.view === "map" ? "(min-width: 1024px) 22vw, 90vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"}
                    active={hovered === l.id}
                    onHover={setHovered}
                  />
                </div>
              ),
            )}
          </div>

          {filters.view === "map" && (
            <div className="lg:order-2">
              <div className="sticky top-[calc(var(--header-h)+1rem)] bg-kamen p-3 text-dunav md:p-5">
                <NoviSadMap
                  locale={locale}
                  title={c.mapTitle[locale]}
                  pins={pins}
                  activePin={hovered}
                  onPinHover={setHovered}
                  showLandmarks
                  animate={false}
                />
              </div>
            </div>
          )}
        </div>

        {visible.length === 0 && (
          <div className="mx-auto max-w-xl py-24 text-center">
            <p className="t-label text-accent">▽ −0.00</p>
            <p className="t-h2 mt-4">{c.none[locale]}</p>
            <p className="mt-4 text-muted">{c.noneHint[locale]}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => update({ ...DEFAULT_FILTERS, view: filters.view })}
                className="min-h-12 rounded-full border border-dunav px-6 font-medium hover:bg-dunav hover:text-kamen"
              >
                {c.reset[locale]}
              </button>
              <Link href={contactHref} className="inline-flex min-h-12 items-center rounded-full bg-dunav px-6 font-medium text-kamen hover:bg-mesing hover:text-dunav">
                {c.tellUs[locale]}
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
