import ContactClient from "./ContactClient";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/seo/schema";

export const metadata = pageMetadata({
  title: "Contact Us — Kelaniya Office, Phone & Opening Hours",
  description:
    "Contact Green Engineering Systems (GES) at No 12, Thorana Junction, Kandy Rd, Kelaniya. Call 076 533 2332 or email info@ges.lk for a solar consultation and site assessment.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={jsonLdGraph(breadcrumbSchema([{ name: "Contact", path: "/contact" }]))} />
      <ContactClient />
    </>
  );
}
