"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import clsx from "clsx";
import { hoods } from "@/content/neighbourhoods";
import { listings } from "@/content/listings";
import type { contactPage } from "@/content/pages-more";
import type { Locale } from "@/lib/i18n";
import type { Picked } from "@/lib/pick";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { kota } from "@/lib/format";

type Copy = Picked<typeof contactPage>;
type Topic = keyof Copy["topics"];
const TOPICS: Topic[] = ["buy", "sell", "rent", "viewing"];

/** Three-step enquiry: topic → details → contact. Validates and shows a success state; sends nothing. */
export function ContactForm({ locale, copy }: { locale: Locale; copy: Copy }) {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [hood, setHood] = useState("");
  const [budget, setBudget] = useState("");
  const [property, setProperty] = useState(listings[0].id);
  const [when, setWhen] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  // Deep link: /kontakt?tema=viewing&nekretnina=l01
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const t = q.get("tema") as Topic | null;
    const p = q.get("nekretnina");
    if (t && TOPICS.includes(t)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill from the URL after mount
      setTopic(t);
      if (p && listings.some((l) => l.id === p)) setProperty(p);
    }
  }, []);

  const go = (n: number) => {
    setStep(n);
    requestAnimationFrame(() => {
      if (panel.current && !prefersReducedMotion()) gsap.fromTo(panel.current, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.6, ease: "expo.out" });
      panel.current?.querySelector<HTMLElement>("h3")?.focus();
    });
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").replace(/\D/g, "");
    const email = String(data.get("email") ?? "").trim();
    const next: Record<string, string> = {};
    if (name.length < 2) next.name = copy.errors.name;
    if (phone.length < 8 && !email) next.contact = copy.errors.contact;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = copy.errors.email;
    setErrors(next);
    if (Object.keys(next).length) return;
    setDone(true);
  };

  if (done) {
    return (
      <div role="status" className="py-8">
        <p className="t-label text-accent">▽ ✓</p>
        <p className="t-h2 mt-4">{copy.successTitle}</p>
        <p className="mt-4 max-w-[44ch] text-muted">{copy.successText}</p>
        <p className="mt-3 text-xs text-muted">{copy.demoNote}</p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setStep(0);
            setTopic(null);
          }}
          className="link-u t-label mt-8 py-2"
        >
          {copy.again}
        </button>
      </div>
    );
  }

  return (
    <div>
      <ol className="flex gap-6" aria-label="Steps">
        {copy.steps.map((s, i) => (
          <li key={s} className={clsx("t-label flex items-center gap-2", i === step ? "text-fg" : i < step ? "text-accent" : "text-muted")}>
            <span className="t-mono">{kota(i * 3.2)}</span> {s}
          </li>
        ))}
      </ol>
      <div className="mt-3 h-px bg-line">
        <div className="h-full bg-mesing transition-[width] duration-700" style={{ width: `${((step + 1) / 3) * 100}%` }} />
      </div>

      <div ref={panel} className="mt-8">
        {step === 0 && (
          <div>
            <h3 tabIndex={-1} className="t-h3 outline-none">
              {copy.formTitle}
            </h3>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={topic === t}
                  onClick={() => setTopic(t)}
                  className={clsx(
                    "border px-5 py-4 text-left transition-colors",
                    topic === t ? "border-dunav bg-dunav text-kamen" : "border-line hover:border-dunav/60 hover:bg-surface",
                  )}
                >
                  <span className="block font-serif text-xl">{copy.topics[t][0]}</span>
                  <span className="mt-1 block text-sm opacity-75">{copy.topics[t][1]}</span>
                </button>
              ))}
            </div>
            {errors.topic && <p className="mt-3 text-sm text-[#a4342a]">{errors.topic}</p>}
            <button
              type="button"
              onClick={() => (topic ? go(1) : setErrors({ topic: copy.errors.topic }))}
              className="mt-8 min-h-12 rounded-full bg-dunav px-7 font-medium text-kamen hover:bg-mesing hover:text-dunav"
            >
              {copy.next} →
            </button>
          </div>
        )}

        {step === 1 && topic && (
          <div>
            <h3 tabIndex={-1} className="t-h3 outline-none">
              {copy.topics[topic][0]}
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {topic === "viewing" ? (
                <label className="grid gap-1 sm:col-span-2">
                  <span className="t-label text-muted">{copy.property}</span>
                  <select value={property} onChange={(e) => setProperty(e.target.value)} className="field">
                    {listings.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title[locale]}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <>
                  <label className="grid gap-1">
                    <span className="t-label text-muted">{copy.hood}</span>
                    <select value={hood} onChange={(e) => setHood(e.target.value)} className="field">
                      <option value="">{copy.anyHood}</option>
                      {hoods.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name[locale]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1">
                    <span className="t-label text-muted">{copy.budget}</span>
                    <input value={budget} onChange={(e) => setBudget(e.target.value)} inputMode="numeric" className="field t-mono" placeholder="150.000" />
                  </label>
                </>
              )}
              <fieldset className="sm:col-span-2">
                <legend className="t-label mb-3 text-muted">{copy.when}</legend>
                <div className="flex flex-wrap gap-2">
                  {copy.whenOptions.map((w, i) => (
                    <button
                      key={w}
                      type="button"
                      aria-pressed={when === i}
                      onClick={() => setWhen(i)}
                      className={clsx("min-h-10 rounded-full border px-4 text-sm transition-colors", when === i ? "border-dunav bg-dunav text-kamen" : "border-line hover:border-dunav/60")}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="mt-8 flex gap-3">
              <button type="button" onClick={() => go(0)} className="min-h-12 rounded-full border border-line px-6 hover:border-dunav">
                ← {copy.back}
              </button>
              <button type="button" onClick={() => go(2)} className="min-h-12 rounded-full bg-dunav px-7 font-medium text-kamen hover:bg-mesing hover:text-dunav">
                {copy.next} →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={submit} noValidate>
            <h3 tabIndex={-1} className="t-h3 outline-none">
              {copy.steps[2]}
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <label className="grid gap-1 sm:col-span-2">
                <span className="t-label text-muted">{copy.name} *</span>
                <input name="name" autoComplete="name" className="field" aria-invalid={!!errors.name} aria-describedby={errors.name ? "c-err-name" : undefined} />
                {errors.name && (
                  <span id="c-err-name" className="text-sm text-[#a4342a]">
                    {errors.name}
                  </span>
                )}
              </label>
              <label className="grid gap-1">
                <span className="t-label text-muted">{copy.phone}</span>
                <input name="phone" type="tel" autoComplete="tel" className="field t-mono" aria-invalid={!!errors.contact} />
              </label>
              <label className="grid gap-1">
                <span className="t-label text-muted">{copy.email}</span>
                <input name="email" type="email" autoComplete="email" className="field" aria-invalid={!!errors.email || !!errors.contact} />
                {errors.email && <span className="text-sm text-[#a4342a]">{errors.email}</span>}
              </label>
              {errors.contact && <p className="text-sm text-[#a4342a] sm:col-span-2">{errors.contact}</p>}
              <label className="grid gap-1 sm:col-span-2">
                <span className="t-label text-muted">{copy.message}</span>
                <textarea name="message" rows={4} className="field resize-none" />
              </label>
            </div>
            <div className="mt-8 flex gap-3">
              <button type="button" onClick={() => go(1)} className="min-h-12 rounded-full border border-line px-6 hover:border-dunav">
                ← {copy.back}
              </button>
              <button type="submit" className="min-h-12 rounded-full bg-dunav px-7 font-medium text-kamen hover:bg-mesing hover:text-dunav">
                {copy.submit} →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
