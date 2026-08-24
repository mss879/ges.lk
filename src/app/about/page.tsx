import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { getSiteImages } from "@/lib/siteImages";

export const metadata: Metadata = {
  title: "About Us | Green Engineering Systems (Pvt) Ltd",
  description:
    "10+ years powering a sustainable future. Learn about Green Engineering Systems — our history, mission, vision, values, certifications, sustainability commitment and awards.",
};

export default async function AboutPage() {
  const images = await getSiteImages("about");
  return <AboutClient images={images} />;
}
