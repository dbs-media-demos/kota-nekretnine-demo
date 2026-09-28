import { ValuationView } from "@/views/ValuationView";
import { valuationPage } from "@/content/pages";
import { buildMetadata } from "@/lib/seo";
import { pageAlternates } from "@/lib/routes";

const L = "sr" as const;

export const metadata = buildMetadata({
  locale: L,
  title: valuationPage.metaTitle[L],
  description: valuationPage.metaDescription[L],
  alternates: pageAlternates("valuation"),
  eyebrow: valuationPage.label[L],
  ogImage: "/images/listings/l10/02.jpg",
});

export default function Page() {
  return <ValuationView locale={L} />;
}
