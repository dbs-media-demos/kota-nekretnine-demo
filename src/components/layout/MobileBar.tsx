import Link from "next/link";
import { site } from "@/lib/site";

/** Phone-only action bar: call + book a viewing, always one thumb away. */
export function MobileBar({ callLabel, bookLabel, bookHref }: { callLabel: string; bookLabel: string; bookHref: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[180] grid grid-cols-2 gap-2 border-t border-dunav/10 bg-kreda/92 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <a
        href={`tel:${site.phone}`}
        className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-dunav/25 text-[0.95rem] font-medium text-dunav"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="currentColor"
            d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1Z"
          />
        </svg>
        {callLabel}
      </a>
      <Link href={bookHref} className="flex min-h-12 items-center justify-center rounded-full bg-dunav text-[0.95rem] font-medium text-kamen">
        {bookLabel}
      </Link>
    </div>
  );
}
