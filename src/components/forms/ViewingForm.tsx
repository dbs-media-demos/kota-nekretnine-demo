"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export type ViewingCopy = {
  title: string;
  day: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: string;
  submit: string;
  sending: string;
  errors: { name: string; phone: string; email: string; day: string; time: string; consent: string };
  successTitle: string;
  successText: string;
  again: string;
  sundayNote: string;
  demoNote: string;
};

const SLOTS = ["10:00", "12:00", "14:00", "17:00", "18:30"];
const SAT_SLOTS = ["10:00", "12:00", "14:00"];

type Errors = Partial<Record<keyof ViewingCopy["errors"], string>>;

/** "Zakaži razgledanje": pick a day and slot, leave a number. Validates, never sends (demo). */
export function ViewingForm({ locale, copy, subject }: { locale: Locale; copy: ViewingCopy; subject?: string }) {
  // Dates are computed on the client so the static HTML never disagrees with the visitor's "today".
  const [days, setDays] = useState<{ key: string; date: Date }[]>([]);
  useEffect(() => {
    const out: { key: string; date: Date }[] = [];
    const now = new Date();
    for (let i = 1; out.length < 8; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      out.push({ key: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`, date: d });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only calendar
    setDays(out);
  }, []);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const doneRef = useRef<HTMLDivElement>(null);
  const fmtDay = (d: Date, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale === "sr" ? "sr-Latn-RS" : "en-GB", opts).format(d);
  const selected = days.find((d) => d.key === day);
  const isSat = selected?.date.getDay() === 6;
  const isSun = selected?.date.getDay() === 0;
  const slots = isSat ? SAT_SLOTS : SLOTS;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    if (String(data.get("name") ?? "").trim().length < 2) next.name = copy.errors.name;
    if (String(data.get("phone") ?? "").replace(/\D/g, "").length < 8) next.phone = copy.errors.phone;
    const email = String(data.get("email") ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = copy.errors.email;
    if (!day) next.day = copy.errors.day;
    if (!time) next.time = copy.errors.time;
    if (!data.get("consent")) next.consent = copy.errors.consent;
    setErrors(next);
    if (Object.keys(next).length) {
      const first = e.currentTarget.querySelector<HTMLElement>("[aria-invalid='true'], [data-err]");
      first?.focus();
      return;
    }
    setState("sending");
    window.setTimeout(() => {
      setState("done");
      requestAnimationFrame(() => {
        const el = doneRef.current;
        if (!el) return;
        el.focus();
        if (!prefersReducedMotion()) gsap.fromTo(el.querySelectorAll("[data-a]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.9 });
      });
    }, 900);
  };

  if (state === "done" && selected && time) {
    return (
      <div ref={doneRef} tabIndex={-1} className="outline-none" role="status">
        <p data-a className="t-label text-accent">
          ▽ ✓
        </p>
        <p data-a className="t-h2 mt-4">
          {copy.successTitle}
        </p>
        <p data-a className="t-mono mt-5 text-lg">
          {fmtDay(selected.date, { weekday: "long", day: "numeric", month: "long" })} · {time}
        </p>
        <p data-a className="mt-4 max-w-[46ch] text-muted">
          {copy.successText}
        </p>
        <p data-a className="mt-3 text-xs text-muted">
          {copy.demoNote}
        </p>
        <button
          data-a
          type="button"
          onClick={() => {
            setState("idle");
            setDay(null);
            setTime(null);
          }}
          className="link-u t-label mt-8 py-2"
        >
          {copy.again}
        </button>
      </div>
    );
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p className="mt-2 text-sm text-[#a4342a]" id={`err-${k}`}>
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={submit} noValidate className="grid gap-7">
      {subject && <input type="hidden" name="subject" value={subject} />}
      <fieldset>
        <legend className="t-label mb-3 text-muted">{copy.day}</legend>
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" data-err={errors.day ? true : undefined} tabIndex={errors.day ? -1 : undefined}>
          {days.length === 0 &&
            Array.from({ length: 8 }, (_, i) => <span key={i} className="min-h-16 w-16 shrink-0 rounded-2xl border border-line opacity-40" aria-hidden="true" />)}
          {days.map((d) => {
            const active = day === d.key;
            return (
              <button
                key={d.key}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setDay(d.key);
                  setTime(null);
                }}
                className={clsx(
                  "flex min-h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border transition-colors",
                  active ? "border-dunav bg-dunav text-kamen" : "border-line hover:border-dunav/60",
                )}
              >
                <span className="t-label !text-[0.6rem]">{fmtDay(d.date, { weekday: "short" })}</span>
                <span className="t-mono text-lg leading-tight">{d.date.getDate()}</span>
              </button>
            );
          })}
        </div>
        {isSun && <p className="mt-2 text-sm text-muted">{copy.sundayNote}</p>}
        {err("day")}
      </fieldset>
      <fieldset>
        <legend className="t-label mb-3 text-muted">{copy.time}</legend>
        <div className="flex flex-wrap gap-2" data-err={errors.time ? true : undefined} tabIndex={errors.time ? -1 : undefined}>
          {slots.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={time === s}
              disabled={!day}
              onClick={() => setTime(s)}
              className={clsx(
                "t-mono min-h-11 rounded-full border px-4 text-sm transition-colors disabled:opacity-35",
                time === s ? "border-dunav bg-dunav text-kamen" : "border-line hover:border-dunav/60",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        {err("time")}
      </fieldset>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="t-label text-muted">{copy.name} *</span>
          <input name="name" autoComplete="name" className="field" aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined} />
          {err("name")}
        </label>
        <label className="grid gap-1">
          <span className="t-label text-muted">{copy.phone} *</span>
          <input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+381 6x xxx xxxx" className="field t-mono" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "err-phone" : undefined} />
          {err("phone")}
        </label>
        <label className="grid gap-1 sm:col-span-2">
          <span className="t-label text-muted">{copy.email}</span>
          <input name="email" type="email" autoComplete="email" className="field" aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined} />
          {err("email")}
        </label>
        <label className="grid gap-1 sm:col-span-2">
          <span className="t-label text-muted">{copy.message}</span>
          <textarea name="message" rows={3} className="field resize-none" />
        </label>
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input name="consent" type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[#13283b]" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "err-consent" : undefined} />
        <span className="text-muted">{copy.consent}</span>
      </label>
      {err("consent")}
      <div>
        <button
          type="submit"
          disabled={state === "sending"}
          className="group inline-flex min-h-13 items-center gap-3 rounded-full bg-dunav px-7 py-3.5 font-medium text-kamen transition-colors hover:bg-mesing hover:text-dunav disabled:opacity-70"
        >
          {state === "sending" ? copy.sending : copy.submit}
          <span className={clsx("transition-transform", state === "sending" ? "animate-spin" : "group-hover:translate-x-1")}>{state === "sending" ? "◌" : "→"}</span>
        </button>
      </div>
    </form>
  );
}
