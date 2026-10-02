import { ContactView } from "@/views/ContactView";
import { contactPage } from "@/content/pages-more";
import { buildMetadata } from "@/lib/seo";
import { pageAlternates } from "@/lib/routes";

const L = "en" as const;

export const metadata = buildMetadata({
  locale: L,
  title: contactPage.metaTitle[L],
  description: contactPage.metaDescription[L],
  alternates: pageAlternates("contact"),
  eyebrow: contactPage.label[L],
  ogImage: "/images/city/trg-slobode.jpg",
});

export default function Page() {
  return <ContactView locale={L} />;
}
