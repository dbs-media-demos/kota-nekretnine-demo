import { PrivacyView } from "@/views/PrivacyView";
import { privacyPage } from "@/content/pages-more";
import { buildMetadata } from "@/lib/seo";
import { pageAlternates } from "@/lib/routes";

const L = "en" as const;

export const metadata = buildMetadata({
  locale: L,
  title: privacyPage.metaTitle[L],
  description: privacyPage.metaDescription[L],
  alternates: pageAlternates("privacy"),
  eyebrow: privacyPage.label[L],
  ogImage: "/images/city/prolaz.jpg",
});

export default function Page() {
  return <PrivacyView locale={L} />;
}
