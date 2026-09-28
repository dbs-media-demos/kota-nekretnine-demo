"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Logo } from "@/components/brand/Logo";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { kota } from "@/lib/format";
import { site } from "@/lib/site";

export type NavLink = { key: string; label: string; href: string; image: string };

type Props = {
  locale: Locale;
  dict: Dictionary;
  primary: NavLink[];
  menu: NavLink[];
  homeHref: string;
  bookHref: string;
  altMap: Record<string, string>;
  otherHome: string;
};

export function Header({ locale, dict, primary, menu, homeHref, bookHref, altMap, otherHome }: Props) {
  const pathname = usePathname();
  const [onDark, setOnDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(0);
  const [query, setQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Which section sits under the header decides its colour; scroll direction decides visibility.
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const check = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 30);
      setHidden(y > 240 && y > lastY + 2);
      if (y < lastY - 2) setHidden(false);
      lastY = y;
      const probe = 36;
      let dark = false;
      document.querySelectorAll<HTMLElement>("[data-header]").forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) dark = s.dataset.header === "dark";
      });
      setOnDark(dark);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const t = window.setTimeout(check, 300);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Keep the query string when switching language (listing filters).
  useEffect(() => {
    const sync = () => setQuery(window.location.search);
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("kota:query", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("kota:query", sync);
    };
  }, [pathname]);

  // Close the menu on navigation.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- route changed, close overlay
    setOpen(false);
  }, [pathname]);

  // Menu: lock scroll, Escape to close, focus management.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    window.__lenis?.stop();
    document.body.style.overflow = "hidden";
    const first = menuRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && menuRef.current) {
        const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>("a,button"));
        const idx = items.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && idx <= 0) {
          e.preventDefault();
          items[items.length - 1].focus();
        } else if (!e.shiftKey && idx === items.length - 1) {
          e.preventDefault();
          items[0].focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  const altHref = (altMap[pathname] ?? otherHome) + (altMap[pathname] ? query : "");
  const light = (onDark && !open) || open;

  return (
    <>
      <header
        style={{ viewTransitionName: "site-header" }}
        className={clsx(
          "fixed inset-x-0 top-0 z-[200] transition-[transform,background-color,color,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          light ? "text-kamen" : "text-dunav",
          scrolled && !open && (onDark ? "bg-dunav/70 backdrop-blur-md" : "bg-kreda/80 shadow-[0_1px_0_rgba(19,40,59,0.08)] backdrop-blur-md"),
        )}
      >
        <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href={homeHref} className="relative z-10 text-[1.35rem]" aria-label={`${site.nameLocalized[locale]}, ${dict.nav.home}`}>
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {primary.map((l) => {
                const active = pathname === l.href || pathname.startsWith(l.href + "/");
                return (
                  <li key={l.key}>
                    <Link
                      href={l.href}
                      className={clsx("link-u py-2 text-[0.92rem]", active && "!bg-[length:100%_1px]")}
                      aria-current={active ? "page" : undefined}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2 sm:gap-4">
            <a href={altHref} hrefLang={locale === "sr" ? "en" : "sr"} className="t-label grid h-11 min-w-11 place-items-center rounded-full px-2 hover:text-mesing" aria-label={dict.lang}>
              {dict.langShort}
            </a>
            <Link
              href={bookHref}
              className={clsx(
                "hidden h-11 items-center rounded-full px-5 text-[0.9rem] font-medium transition-colors duration-500 md:inline-flex",
                light ? "bg-kamen text-dunav hover:bg-mesing" : "bg-dunav text-kamen hover:bg-mesing hover:text-dunav",
              )}
            >
              {dict.cta.book}
            </Link>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group flex h-11 items-center gap-3 rounded-full pl-2 pr-1"
            >
              <span className="t-label hidden sm:inline">{open ? dict.nav.close : dict.nav.menu}</span>
              <span className="relative block h-11 w-11 rounded-full border border-current/30">
                <span
                  className={clsx(
                    "absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 bg-current transition-transform duration-500",
                    open ? "rotate-45" : "-translate-y-[3px]",
                  )}
                />
                <span
                  className={clsx(
                    "absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 bg-current transition-transform duration-500",
                    open ? "-rotate-45" : "translate-y-[3px]",
                  )}
                />
                <span className="sr-only">{open ? dict.nav.close : dict.nav.menu}</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label={dict.nav.menu}
        className={clsx(
          "theme-dark fixed inset-0 z-[190] overflow-y-auto transition-[clip-path,visibility] duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
          open ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]",
        )}
      >
        <div className="wrap grid min-h-full grid-cols-1 gap-10 pb-12 pt-[calc(var(--header-h)+2rem)] lg:grid-cols-[1.2fr_1fr]">
          <nav aria-label={dict.nav.menu}>
            <ul className="border-t border-line">
              {menu.map((l, i) => (
                <li key={l.key} className="border-b border-line">
                  <Link
                    href={l.href}
                    onPointerEnter={() => setPreview(i)}
                    onFocus={() => setPreview(i)}
                    className="group flex items-baseline gap-5 py-3 sm:py-4"
                    tabIndex={open ? 0 : -1}
                  >
                    <span className="t-label w-16 shrink-0 text-muted transition-colors group-hover:text-accent">▽ {kota(i * 3.2)}</span>
                    <span
                      className={clsx(
                        "font-serif text-[clamp(2rem,5.4vw,4.4rem)] leading-[1.02] tracking-[-0.02em] transition-[transform,color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-hover:text-accent",
                        open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                      )}
                      style={{ transitionDelay: open ? `${120 + i * 45}ms` : "0ms", transitionProperty: "transform, opacity, color" }}
                    >
                      {l.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col justify-between gap-8">
            <div className="relative hidden aspect-[4/5] overflow-hidden lg:block">
              {menu.map((l, i) => (
                <Image
                  key={l.key}
                  src={l.image}
                  alt=""
                  fill
                  sizes="40vw"
                  quality={60}
                  loading="lazy"
                  className={clsx(
                    "object-cover transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                    preview === i ? "scale-100 opacity-100" : "scale-110 opacity-0",
                  )}
                />
              ))}
            </div>
            <div className="grid gap-2 text-sm">
              <a href={`tel:${site.phone}`} className="t-h3 hover:text-accent" tabIndex={open ? 0 : -1}>
                {site.phoneDisplay}
              </a>
              <a href={`mailto:${site.email}`} className="link-u w-fit text-muted" tabIndex={open ? 0 : -1}>
                {site.email}
              </a>
              <p className="text-muted">
                {site.street}, {site.postalCode} {site.city}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
