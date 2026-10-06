import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import JsonLd from "@/components/seo/JsonLd";
import { getRecentPosts } from "@/lib/blog/queries";
import { homepageSchema } from "@/lib/seo/schema";
import { getSiteImages } from "@/lib/siteImages";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: site.defaultTitle },
  description: site.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [images, posts] = await Promise.all([getSiteImages("homepage"), getRecentPosts(3)]);
  return (
    <>
      <JsonLd data={homepageSchema()} />
      <HomeClient images={images} posts={posts} />
    </>
  );
}
