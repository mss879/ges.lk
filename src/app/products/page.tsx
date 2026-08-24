import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Products — Installation & Retail | Green Engineering Systems",
  description:
    "GES supplies and installs premium renewable-energy products: SAJ inverters, Haitai Solar panels and Solen cables, plus switchgear, enclosures and aluminium accessories.",
};

export default function ProductsPage() {
  return <ProductsClient />;
}
