import AboutClient from "./AboutClient";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/seo/schema";
import { getSiteImages } from "@/lib/siteImages";

export const metadata = pageMetadata({
  title: "About Us — Solar Engineering Company in Kelaniya",
  description:
    "10+ years and 1,200+ installations. Meet Green Engineering Systems (GES): our history, mission, values, ISO 9001:2015 and SLSEA credentials, and IESL engineering awards.",
  path: "/about",
});

export default async function AboutPage() {
  const images = await getSiteImages("about");
  return (
    <>
      <JsonLd data={jsonLdGraph(breadcrumbSchema([{ name: "About Us", path: "/about" }]))} />
      <AboutClient images={images} />
    </>
  );
}
