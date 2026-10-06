import SolutionsClient from "./SolutionsClient";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/seo/schema";

export const metadata = pageMetadata({
  title: "Solar & Clean Energy Solutions — On-Grid, Hybrid, Off-Grid & BESS",
  description:
    "Compare GES solutions for Sri Lanka: on-grid, hybrid and off-grid solar, battery energy storage (BESS), micro turbine generators, fuel cells, composting machines and Moreday EV chargers.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <>
      <JsonLd data={jsonLdGraph(breadcrumbSchema([{ name: "Solutions", path: "/solutions" }]))} />
      <SolutionsClient />
    </>
  );
}
