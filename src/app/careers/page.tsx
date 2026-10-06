import CareersClient from "./CareersClient";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/seo/schema";

export const metadata = pageMetadata({
  title: "Careers in Solar Energy",
  description:
    "Build your career in clean energy with Green Engineering Systems. See the areas we hire for — engineering, installation, sales, project management and maintenance — and send us your CV.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <JsonLd data={jsonLdGraph(breadcrumbSchema([{ name: "Careers", path: "/careers" }]))} />
      <CareersClient />
    </>
  );
}
