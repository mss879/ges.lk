import type { Metadata } from "next";
import SolutionsClient from "./SolutionsClient";

export const metadata: Metadata = {
  title: "Our Solutions | Green Engineering Systems (Pvt) Ltd",
  description:
    "Explore GES solutions: Solar (On-Grid, Off-Grid, Hybrid, BESS), Power Generation (MTG), Hydrogen Energy (Fuel Cell), Waste Management (Composting) and EV Charging (Moreday).",
};

export default function SolutionsPage() {
  return <SolutionsClient />;
}
