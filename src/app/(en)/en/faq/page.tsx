import { FaqView } from "@/views/FaqView";
import { faqPage } from "@/content/pages-more";
import { buildMetadata } from "@/lib/seo";
import { pageAlternates } from "@/lib/routes";

const L = "en" as const;

export const metadata = buildMetadata({
  locale: L,
  title: faqPage.metaTitle[L],
  description: faqPage.metaDescription[L],
  alternates: pageAlternates("faq"),
  eyebrow: faqPage.label[L],
  ogImage: "/images/listings/l04/01.jpg",
});

export default function Page() {
  return <FaqView locale={L} />;
}
