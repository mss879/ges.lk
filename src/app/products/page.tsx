import ProductsClient from "./ProductsClient";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/seo/schema";

export const metadata = pageMetadata({
  title: "Solar Panels, Inverters & Accessories — Supply and Installation",
  description:
    "GES supplies and installs Haitai Solar panels, SAJ on-grid, hybrid and three-phase inverters and Solen solar cables, plus switchgear, enclosures and aluminium mounting accessories across Sri Lanka.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <JsonLd data={jsonLdGraph(breadcrumbSchema([{ name: "Products", path: "/products" }]))} />
      <ProductsClient />
    </>
  );
}
