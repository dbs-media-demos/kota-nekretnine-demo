import Link from "next/link";
import clsx from "clsx";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph } from "@/lib/schema";

export type Crumb = { name: string; url: string };

/** Visible breadcrumbs + BreadcrumbList JSON-LD. The last crumb is the current page. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className={clsx("t-label", className)}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((c, i) => {
            const last = i === items.length - 1;
            return (
              <li key={c.url} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.url} className="link-u">
                      {c.name}
                    </Link>
                    <span aria-hidden="true" className="opacity-50">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={graph(breadcrumbSchema(items))} />
    </>
  );
}
