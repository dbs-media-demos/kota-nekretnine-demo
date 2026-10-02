"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { hours, site } from "@/lib/site";
import type { Dictionary } from "@/i18n/dictionary";
import { useBiz } from "@/components/preview/BizContext";
import { openStatus } from "@/lib/biz-core";

type Status = { open: boolean; text: string };

/** Current day/time in Novi Sad regardless of the visitor's timezone. */
function nowInNoviSad() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: site.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const wd = parts.find((p) => p.type === "weekday")!.value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
  const minutes = Number(parts.find((p) => p.type === "hour")!.value) * 60 + Number(parts.find((p) => p.type === "minute")!.value);
  return { day, minutes };
}

const toMin = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3));

export function computeStatus(dict: Dictionary): Status {
  const { day, minutes } = nowInNoviSad();
  const today = hours.find((h) => h.day === day);
  if (today && minutes >= toMin(today.open) && minutes < toMin(today.close)) {
    return { open: true, text: `${dict.open.now} · ${dict.open.until} ${today.close}` };
  }
  if (today && minutes < toMin(today.open)) {
    return { open: false, text: `${dict.open.closed} · ${dict.open.opens} ${dict.open.today} ${today.open}` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const next = hours.find((h) => h.day === d);
    if (next) {
      const when = i === 1 ? dict.open.tomorrow : `${dict.open.on} ${dict.days[d]} ${dict.open.at}`;
      return { open: false, text: `${dict.open.closed} · ${dict.open.opens} ${when} ${next.open}` };
    }
  }
  return { open: false, text: dict.open.closed };
}

/** Live "Open now / Closes at 19:00" badge. Renders a neutral placeholder on the server. */
export function OpenStatus({ dict, className }: { dict: Dictionary; className?: string }) {
  const biz = useBiz();
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(biz.preview ? openStatus(biz) : computeStatus(dict));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [dict, biz]);

  if (biz.preview && !biz.hours) return null;

  return (
    <span className={clsx("inline-flex items-center gap-2", className)} aria-live="polite">
      <span
        className={clsx("h-2 w-2 shrink-0 rounded-full", status?.open ? "pulse-dot bg-[#4f9a6a] text-[#4f9a6a]" : "bg-current opacity-40")}
      />
      <span className="t-label">{status ? status.text : dict.hoursLabel}</span>
    </span>
  );
}
