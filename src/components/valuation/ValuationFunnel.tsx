"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import clsx from "clsx";
import { hoods, type HoodId } from "@/content/neighbourhoods";
import type { valuationPage } from "@/content/pages";
import type { Locale } from "@/lib/i18n";
import type { Picked } from "@/lib/pick";
import { eur, kota, num } from "@/lib/format";
import {
  estimate,
  conditionFactor,
  floorFactor,
  featureFactor,
  unregisteredPenalty,
  type Condition,
  type FloorBand,
  type ValFeature,
} from "@/lib/valuation";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useAnimatedNumber } from "@/components/ui/useAnimatedNumber";

type Copy = Picked<typeof valuationPage>;

const FLOORS: FloorBand[] = ["ground", "low", "mid", "top", "topNoLift", "house"];
const CONDITIONS: Condition[] = ["renovate", "good", "renovated", "new"];
const EXTRAS: ValFeature[] = ["registered", "terrace", "parking", "elevator", "view", "garden"];
const pct = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : "±"}${Math.abs(Math.round(v * 100))}%`;

/** Five-step valuation with a live, animated estimate beside it. */
export function ValuationFunnel({ locale, copy }: { locale: Locale; copy: Copy }) {
  const [step, setStep] = useState(0);
  const [hood, setHood] = useState<HoodId | null>(null);
  const [area, setArea] = useState(60);
  const [floor, setFloor] = useState<FloorBand | null>(null);
  const [condition, setCondition] = useState<Condition | null>(null);
  const [features, setFeatures] = useState<ValFeature[]>(["registered"]);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean }>({});
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  // Prefill from ?kraj=&m2= (home teaser, guides).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const k = q.get("kraj") as HoodId | null;
    const m = Number(q.get("m2"));
    if (k && hoods.some((h) => h.id === k)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill from the URL after mount
      setHood(k);
      if (m >= 15 && m <= 400) {
        setArea(m);
        setStep(2);
      } else setStep(1);
    }
  }, []);

  const est = useMemo(
    () => estimate({ hood: hood ?? "grbavica", area, floor: floor ?? "low", condition: condition ?? "good", features }),
    [hood, area, floor, condition, features],
  );
  const low = useAnimatedNumber(est.low);
  const high = useAnimatedNumber(est.high);
  const perM2 = useAnimatedNumber(est.perM2);

  const prices = hoods.map((h) => h.pricePerM2);
  const minP = Math.min(...prices) * 0.8;
  const maxP = Math.max(...prices) * 1.25;
  const pos = Math.min(100, Math.max(0, ((est.perM2 - minP) / (maxP - minP)) * 100));

  const go = (n: number) => {
    setStep(n);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      if (panel.current && !prefersReducedMotion()) gsap.fromTo(panel.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" });
      const top = (panel.current?.closest("section")?.getBoundingClientRect().top ?? 0) + window.scrollY - 90;
      if (window.scrollY > top) window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    });
  };

  const canNext = [hood !== null, area >= 15 && area <= 400, floor !== null, condition !== null, true][step] ?? false;
  const adjustments: [string, number][] = [
    ...(condition ? ([[copy.conditions[condition][0], conditionFactor[condition]]] as [string, number][]) : []),
    ...(floor ? ([[copy.floors[floor], floorFactor[floor]]] as [string, number][]) : []),
    ...features.filter((f) => featureFactor[f] !== 0).map((f) => [copy.extras[f], featureFactor[f]] as [string, number]),
    ...(!features.includes("registered") ? ([[`${copy.extras.registered} ✕`, unregisteredPenalty]] as [string, number][]) : []),
  ];

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next = {
      name: String(data.get("name") ?? "").trim().length < 2,
      phone: String(data.get("phone") ?? "").replace(/\D/g, "").length < 8,
    };
    setErrors(next);
    if (next.name || next.phone) return;
    setSent(true);
  };

  const option = (active: boolean) =>
    clsx(
      "flex min-h-14 w-full items-center justify-between gap-4 border px-5 py-4 text-left transition-[background-color,border-color,color] duration-300",
      active ? "border-dunav bg-dunav text-kamen" : "border-line hover:border-dunav/60 hover:bg-surface",
    );

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
      {/* Steps */}
      <div>
        <ol className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Steps">
          {copy.steps.map((s, i) => (
            <li key={s} className={clsx("t-label flex items-center gap-2", i === step ? "text-fg" : i < step ? "text-accent" : "text-muted")}>
              <span className="t-mono">{kota(i * 3.2)}</span> {s}
            </li>
          ))}
        </ol>
        <div className="mt-4 h-px bg-line">
          <div className="h-full bg-mesing transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ width: `${(step / 5) * 100}%` }} />
        </div>

        <div ref={panel} className="mt-10">
          <h2 ref={heading} tabIndex={-1} className="t-h2 outline-none">
            {[copy.q.hood, copy.q.area, copy.q.floor, copy.q.condition, copy.q.extras, copy.q.result][step]}
          </h2>

          {step === 0 && (
            <div className="mt-8 grid gap-2 sm:grid-cols-2">
              {hoods.map((h) => (
                <button key={h.id} type="button" aria-pressed={hood === h.id} onClick={() => setHood(h.id)} className={option(hood === h.id)}>
                  <span className="font-serif text-xl">{h.name[locale]}</span>
                  <span className="t-mono text-sm opacity-75">{eur(h.pricePerM2, locale)}/m²</span>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="mt-8">
              <label htmlFor="val-area" className="sr-only">
                {copy.q.area}
              </label>
              <div className="flex items-end gap-3">
                <input
                  id="val-area"
                  type="number"
                  inputMode="numeric"
                  min={15}
                  max={400}
                  value={area || ""}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="t-mono w-48 border-b border-line bg-transparent pb-2 text-[clamp(3rem,7vw,5.5rem)] leading-none tracking-[-0.04em] focus:border-fg focus:outline-none"
                />
                <span className="t-mono mb-3 text-2xl">m²</span>
              </div>
              <input type="range" min={15} max={250} step={1} value={Math.min(area, 250)} onChange={(e) => setArea(Number(e.target.value))} className="range mt-6" aria-label={copy.q.area} />
              <p className="mt-3 text-sm text-muted">{copy.q.areaHint}</p>
            </div>
          )}

          {step === 2 && (
            <div className="mt-8 grid gap-2 sm:grid-cols-2">
              {FLOORS.map((f) => (
                <button key={f} type="button" aria-pressed={floor === f} onClick={() => setFloor(f)} className={option(floor === f)}>
                  <span>{copy.floors[f]}</span>
                  <span className="t-mono text-sm opacity-75">{pct(floorFactor[f])}</span>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="mt-8 grid gap-2">
              {CONDITIONS.map((cnd) => (
                <button key={cnd} type="button" aria-pressed={condition === cnd} onClick={() => setCondition(cnd)} className={option(condition === cnd)}>
                  <span>
                    <span className="block font-serif text-xl">{copy.conditions[cnd][0]}</span>
                    <span className="mt-1 block text-sm opacity-75">{copy.conditions[cnd][1]}</span>
                  </span>
                  <span className="t-mono text-sm opacity-75">{pct(conditionFactor[cnd])}</span>
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="mt-8 grid gap-2 sm:grid-cols-2">
              {EXTRAS.map((f) => {
                const on = features.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFeatures((fs) => (on ? fs.filter((x) => x !== f) : [...fs, f]))}
                    className={option(on)}
                  >
                    <span className="flex items-center gap-3">
                      <span className={clsx("grid h-5 w-5 place-items-center border text-xs", on ? "border-kamen" : "border-current")}>{on ? "✓" : ""}</span>
                      {copy.extras[f]}
                    </span>
                    <span className="t-mono text-sm opacity-75">{f === "registered" ? pct(-unregisteredPenalty) : pct(featureFactor[f])}</span>
                  </button>
                );
              })}
            </div>
          )}

          {step === 5 && (
            <div className="mt-8">
              {sent ? (
                <div role="status">
                  <p className="t-label text-accent">▽ ✓</p>
                  <p className="t-h3 mt-3">{copy.successTitle}</p>
                  <p className="mt-3 max-w-[44ch] text-muted">{copy.successText}</p>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="grid gap-6">
                  <p className="t-lead max-w-[48ch] text-muted">{copy.confirmText}</p>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="grid gap-1">
                      <span className="t-label text-muted">{locale === "sr" ? "Ime" : "Name"} *</span>
                      <input name="name" autoComplete="name" className="field" aria-invalid={!!errors.name} />
                      {errors.name && <span className="text-sm text-[#a4342a]">{locale === "sr" ? "Upišite ime." : "Please enter your name."}</span>}
                    </label>
                    <label className="grid gap-1">
                      <span className="t-label text-muted">{locale === "sr" ? "Telefon" : "Phone"} *</span>
                      <input name="phone" type="tel" autoComplete="tel" className="field t-mono" aria-invalid={!!errors.phone} />
                      {errors.phone && <span className="text-sm text-[#a4342a]">{locale === "sr" ? "Upišite broj telefona." : "Please enter a phone number."}</span>}
                    </label>
                  </div>
                  <div>
                    <button type="submit" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-dunav px-7 font-medium text-kamen hover:bg-mesing hover:text-dunav">
                      {copy.send} →
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <div className="mt-10 flex items-center gap-3">
            {step > 0 && step < 5 && (
              <button type="button" onClick={() => go(step - 1)} className="min-h-12 rounded-full border border-line px-6 hover:border-dunav">
                ← {copy.back}
              </button>
            )}
            {step < 5 && (
              <button
                type="button"
                onClick={() => canNext && go(step + 1)}
                aria-disabled={!canNext}
                className={clsx(
                  "min-h-12 rounded-full px-7 font-medium transition-colors",
                  canNext ? "bg-dunav text-kamen hover:bg-mesing hover:text-dunav" : "cursor-not-allowed bg-surface-2 text-muted",
                )}
              >
                {step === 4 ? copy.q.result : copy.next} →
              </button>
            )}
            {step === 5 && !sent && (
              <button type="button" onClick={() => go(4)} className="link-u t-label py-2">
                ← {copy.back}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live estimate */}
      <aside className="lg:relative" aria-live="polite">
        <div className="theme-dark bg-dunav p-7 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] md:p-9">
          <p className="t-label text-kamen/70">{copy.estimate}</p>
          <p className={clsx("t-mono mt-4 text-[clamp(1.9rem,3.3vw,3rem)] leading-[1.05] tracking-[-0.03em] text-kreda transition-opacity", !hood && "opacity-40")}>
            {eur(low, locale)}
            <br />– {eur(high, locale)}
          </p>
          <p className="t-mono mt-3 text-sm text-kamen/75">
            ≈ {eur(perM2, locale)} {copy.perM2} · {num(area, locale)} m²
          </p>

          <div className="mt-8">
            <p className="t-label text-kamen/70">{copy.cityScale}</p>
            <div className="relative mt-6 h-px bg-kamen/25">
              {hoods.map((h) => (
                <span key={h.id} className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-kamen/40" style={{ left: `${((h.pricePerM2 - minP) / (maxP - minP)) * 100}%` }} />
              ))}
              <span
                className="absolute -top-[22px] -translate-x-1/2 text-lg text-mesing transition-[left] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ left: `${pos}%` }}
                aria-hidden="true"
              >
                ▽
              </span>
            </div>
            <div className="t-label mt-3 flex justify-between text-kamen/60">
              <span>{copy.cheapest}</span>
              <span>{copy.priciest}</span>
            </div>
          </div>

          <dl className="mt-8 grid gap-2 border-t border-kamen/15 pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-kamen/70">
                {copy.base}
                {hood ? `: ${hoods.find((h) => h.id === hood)!.name[locale]}` : ""}
              </dt>
              <dd className="t-mono">{eur(est.base, locale)}/m²</dd>
            </div>
            {adjustments.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-kamen/70">{k}</dt>
                <dd className={clsx("t-mono", v > 0 ? "text-[#9fd3a8]" : v < 0 ? "text-[#f0a79c]" : "")}>{pct(v)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm font-medium text-mesing">▽ {copy.confirm}</p>
          <p className="mt-3 text-xs leading-relaxed text-kamen/55">{copy.disclaimer}</p>
        </div>
      </aside>
    </div>
  );
}
