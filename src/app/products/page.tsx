import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Products — Installation & Retail | Green Engineering Systems",
  description:
    "GES supplies and installs premium renewable-energy products: solar panels (JA Solar, TW Solar), inverters (SAJ, Sunways, Solis), switchgears, cables, aluminum structures and enclosures.",
};

export default function ProductsPage() {
  return <ProductsClient />;
}
