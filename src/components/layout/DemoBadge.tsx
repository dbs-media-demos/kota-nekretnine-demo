"use client";

import { useEffect, useState } from "react";
import { agencyUrl } from "@/lib/site";

/** Small fixed pill marking this as a Scale by Noon concept site. Dismissal lasts for the session. */
export function DemoBadge({ label, dismiss }: { label: string; dismiss: string }) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem("kota-demo-pill") === "0";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read session storage after mount
    setHidden(dismissed);
  }, []);

  if (hidden) return null;

  return (
    <div className="theme-dark fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] left-3 z-[210] flex items-center rounded-full !bg-dunav/90 pl-4 pr-1 text-kamen shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur md:bottom-5 md:left-5">
      <a href={agencyUrl} target="_blank" rel="noopener" className="t-label py-2.5 !text-[0.62rem] hover:text-mesing">
        {label} ↗
      </a>
      <button
        type="button"
        onClick={() => {
          try {
            sessionStorage.setItem("kota-demo-pill", "0");
          } catch {}
          setHidden(true);
        }}
        className="ml-1 grid h-9 w-9 place-items-center rounded-full text-lg leading-none hover:bg-white/10"
        aria-label={dismiss}
      >
        ×
      </button>
    </div>
  );
}
