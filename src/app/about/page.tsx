import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | Green Engineering Systems (Pvt) Ltd",
  description:
    "10+ years powering a sustainable future. Learn about Green Engineering Systems — our history, mission, vision, values, certifications, sustainability commitment and awards.",
};

export default function AboutPage() {
  return <AboutClient />;
}
