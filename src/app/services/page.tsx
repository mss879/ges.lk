import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Service & Maintenance | Green Engineering Systems (Pvt) Ltd",
  description:
    "Comprehensive service and maintenance for solar power systems and generators — inspections, performance assessments, preventive maintenance and troubleshooting. Request service online.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}
