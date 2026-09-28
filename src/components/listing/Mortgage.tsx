"use client";

import { useId, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { eur, num } from "@/lib/format";
import { useAnimatedNumber } from "@/components/ui/useAnimatedNumber";

type Copy = {
  title: string;
  price: string;
  down: string;
  rate: string;
  years: string;
  monthly: string;
  loan: string;
  interest: string;
  total: string;
  principal: string;
  note: string;
  yearsUnit: string;
};

export function monthlyPayment(principal: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function Slider({ label, value, display, min, max, step, onChange }: { label: string; value: number; display: string; min: number; max: number; step: number; onChange: (v: number) => void }) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="t-label text-muted">
          {label}
        </label>
        <span className="t-mono text-[0.95rem]">{display}</span>
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-fg" style={{ width: `${pct}%` }} />
        <input id={id} type="range" className="range relative" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      </div>
    </div>
  );
}

/** EUR mortgage calculator with an animated monthly payment and principal/interest split. */
export function Mortgage({ price, locale, copy }: { price: number; locale: Locale; copy: Copy }) {
  const [amount, setAmount] = useState(price);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(5.2);
  const [years, setYears] = useState(25);

  const { loan, monthly, interest } = useMemo(() => {
    const loan = Math.max(0, amount * (1 - down / 100));
    const monthly = monthlyPayment(loan, rate, years);
    return { loan, monthly, interest: monthly * years * 12 - loan };
  }, [amount, down, rate, years]);

  const shown = useAnimatedNumber(Math.round(monthly));
  const share = loan + interest > 0 ? (loan / (loan + interest)) * 100 : 100;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
      <div className="grid gap-7">
        <div>
          <label htmlFor="mg-price" className="t-label text-muted">
            {copy.price}
          </label>
          <input
            id="mg-price"
            type="number"
            inputMode="numeric"
            min={10000}
            step={1000}
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="field t-mono text-xl"
          />
        </div>
        <Slider label={copy.down} value={down} display={`${down}% · ${eur(amount * (down / 100), locale)}`} min={10} max={50} step={5} onChange={setDown} />
        <Slider label={copy.rate} value={rate} display={`${num(rate, locale, 1)}%`} min={3} max={8} step={0.1} onChange={(v) => setRate(Math.round(v * 10) / 10)} />
        <Slider label={copy.years} value={years} display={`${years} ${copy.yearsUnit}`} min={5} max={30} step={1} onChange={setYears} />
      </div>
      <div className="flex flex-col justify-between gap-8 bg-dunav p-7 text-kamen md:p-9">
        <div>
          <p className="t-label text-kamen/70">{copy.monthly}</p>
          <p className="t-mono mt-3 text-[clamp(2.8rem,6vw,4.6rem)] leading-none tracking-[-0.04em] text-kreda" aria-live="polite">
            {eur(shown, locale)}
          </p>
        </div>
        <div>
          <div className="flex h-2 overflow-hidden rounded-full bg-kamen/15" aria-hidden="true">
            <span className="h-full bg-mesing transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ width: `${share}%` }} />
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="flex items-center gap-2 text-kamen/70">
                <span className="h-2 w-2 rounded-full bg-mesing" /> {copy.principal}
              </dt>
              <dd className="t-mono mt-1 text-base">{eur(Math.round(loan), locale)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-kamen/70">
                <span className="h-2 w-2 rounded-full bg-kamen/30" /> {copy.interest}
              </dt>
              <dd className="t-mono mt-1 text-base">{eur(Math.round(interest), locale)}</dd>
            </div>
            <div className="col-span-2 border-t border-kamen/15 pt-4">
              <dt className="text-kamen/70">{copy.total}</dt>
              <dd className="t-mono mt-1 text-base">{eur(Math.round(loan + interest + amount * (down / 100)), locale)}</dd>
            </div>
          </dl>
          <p className="mt-6 text-xs leading-relaxed text-kamen/60">{copy.note}</p>
        </div>
      </div>
    </div>
  );
}
