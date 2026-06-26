import type { Metadata } from "next";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
  title: "Careers | Green Engineering Systems (Pvt) Ltd",
  description:
    "Build your career in clean energy with Green Engineering Systems. Explore the areas we hire for — engineering, installation, sales and more — and send us your CV.",
};

export default function CareersPage() {
  return <CareersClient />;
}
