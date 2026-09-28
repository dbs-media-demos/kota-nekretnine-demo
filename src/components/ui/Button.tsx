import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "brass";
  className?: string;
  magnetic?: boolean;
  external?: boolean;
};

const styles = {
  solid: "bg-fg text-bg hover:bg-accent-fill hover:text-dunav",
  outline: "border border-current hover:bg-fg hover:text-bg",
  brass: "bg-mesing text-dunav hover:bg-kreda",
};

/** Pill button with a sliding arrow. */
export function Button({ href, children, variant = "solid", className, magnetic = true, external }: Props) {
  const cls = clsx(
    "group inline-flex min-h-12 items-center gap-3 rounded-full px-6 text-[0.95rem] font-medium transition-colors duration-500",
    styles[variant],
    className,
  );
  const inner = (
    <>
      <span>{children}</span>
      <span className="relative block h-3 w-4 overflow-hidden" aria-hidden="true">
        <span className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full">→</span>
        <span className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0">→</span>
      </span>
    </>
  );
  const el =
    external || href.startsWith("tel:") || href.startsWith("mailto:") ? (
      <a href={href} className={cls}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
