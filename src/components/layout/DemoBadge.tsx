"use client";

import { useEffect, useState } from "react";
import { agencyUrl } from "@/lib/site";

/**
 * Marks this as a Scale by Noon concept site. Desktop: a small fixed pill, dismissal lasts for the
 * session. Phones: a plain line at the very end of the page, so it can never sit on top of anything.
 */
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

  return (
    <>
      <a href={agencyUrl} target="_blank" rel="noopener" className="t-label block bg-dunav-2 px-[var(--gutter)] py-3 text-center !text-[0.62rem] text-kamen/85 desk:hidden">
        {label} ↗
      </a>
      {!hidden && (
        <div className="theme-dark fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] left-3 z-[210] flex items-center rounded-full !bg-dunav/90 pl-4 pr-1 text-kamen shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur md:bottom-5 md:left-5 phone:hidden">
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
      )}
    </>
  );
}
