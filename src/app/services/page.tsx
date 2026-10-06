import ServicesClient from "./ServicesClient";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdGraph, serviceSchema } from "@/lib/seo/schema";

export const metadata = pageMetadata({
  title: "Solar Maintenance, Cleaning & Repair Services",
  description:
    "Islandwide solar and generator maintenance from GES: 11-point inspections, panel cleaning, inverter servicing, fault troubleshooting and preventive maintenance — for GES and third-party systems.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          breadcrumbSchema([{ name: "Maintenance", path: "/services" }]),
          serviceSchema({
            name: "Solar system maintenance and repair",
            description:
              "Inspection, cleaning, inverter servicing, fault troubleshooting, performance monitoring and preventive maintenance for solar power systems and generators across Sri Lanka.",
            path: "/services",
            image: "/service_repair.webp",
            category: "Solar maintenance",
          }),
        )}
      />
      <ServicesClient />
    </>
  );
}
