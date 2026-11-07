"use client";

import Link from "@/components/ui/SiteLink";
import { useBiz } from "@/components/preview/BizContext";
import { PhoneIcon } from "@/components/ui/PhoneIcon";

/** Phone-only action bar: call or text the agent, always one thumb away. No number on a preview: straight to contact. */
export function MobileBar({ callLabel, textLabel, bookLabel, bookHref }: { callLabel: string; textLabel: string; bookLabel: string; bookHref: string }) {
  const biz = useBiz();
  return (
    <div className="fixed inset-x-0 bottom-0 z-[180] hidden grid-cols-[1.35fr_1fr] gap-2 border-t border-dunav/10 bg-kreda p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] phone:grid">
      {biz.phone ? (
        <>
          <a
            href={`tel:${biz.phone}`}
            aria-label={`${callLabel} ${biz.phoneDisplay}`}
            className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-dunav px-2 text-[0.92rem] font-medium whitespace-nowrap text-kamen"
          >
            <PhoneIcon className="h-4 w-4 shrink-0" />
            {biz.phoneDisplay}
          </a>
          <a href={`sms:${biz.phone}`} className="flex min-h-12 items-center justify-center rounded-full border border-dunav/25 px-2 text-[0.92rem] font-medium whitespace-nowrap text-dunav">
            {textLabel}
          </a>
        </>
      ) : (
        <Link href={bookHref} className="col-span-2 flex min-h-12 items-center justify-center rounded-full bg-dunav text-[0.95rem] font-medium text-kamen">
          {bookLabel}
        </Link>
      )}
    </div>
  );
}
