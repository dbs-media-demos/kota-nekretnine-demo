import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables } from "@/lib/fonts";
import { Logo, Mark } from "@/components/brand/Logo";
import { getDictionary } from "@/i18n/dictionary";

export const metadata: Metadata = {
  title: "404 | Kota",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  const sr = getDictionary("sr").notFound;
  const en = getDictionary("en").notFound;
  return (
    <html lang="sr-Latn" className={fontVariables}>
      <body className="theme-dark flex min-h-screen flex-col">
        <header className="wrap flex h-24 items-center">
          <Link href="/" aria-label="Kota" className="text-[1.35rem]">
            <Logo />
          </Link>
        </header>
        <main className="wrap flex flex-1 flex-col justify-center pb-20">
          <p className="t-label flex items-center gap-3 text-accent">
            <Mark className="h-3 w-auto" accent="var(--mesing)" /> −4.04
          </p>
          <h1 className="t-display mt-6">
            4<em className="italic text-mesing">0</em>4
          </h1>
          <div className="mt-12 grid max-w-4xl gap-10 sm:grid-cols-2">
            <div>
              <p className="t-h3">{sr.title}</p>
              <p className="mt-3 text-muted">{sr.text}</p>
              <Link href="/" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-mesing px-6 font-medium text-dunav hover:bg-kreda">
                {sr.home}
              </Link>
            </div>
            <div lang="en">
              <p className="t-h3">{en.title}</p>
              <p className="mt-3 text-muted">{en.text}</p>
              <Link href="/en" className="mt-6 inline-flex min-h-12 items-center rounded-full border border-line px-6 font-medium hover:border-kamen">
                {en.home}
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
