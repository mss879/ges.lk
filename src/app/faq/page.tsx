import FaqClient from "./FaqClient";
import JsonLd from "@/components/seo/JsonLd";
import { faqs } from "@/data/faqs";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqPageSchema, jsonLdGraph } from "@/lib/seo/schema";

export const metadata = pageMetadata({
  title: "Solar FAQ — Costs, Savings, Warranty & CEB Net Metering",
  description:
    "Answers to common questions about solar in Sri Lanka: how systems work, which type suits you, warranties, savings, payback, maintenance, blackouts and CEB/LECO net metering schemes.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <>
      <JsonLd data={jsonLdGraph(breadcrumbSchema([{ name: "FAQ", path: "/faq" }]), faqPageSchema(faqs))} />
      <FaqClient />
    </>
  );
}
