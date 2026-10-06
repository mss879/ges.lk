import BlogIndexClient from "./BlogIndexClient";
import JsonLd from "@/components/seo/JsonLd";
import { getPublishedPosts } from "@/lib/blog/queries";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, jsonLdGraph } from "@/lib/seo/schema";
import { absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Solar Energy Blog — Guides, Net Metering & Engineering Insights",
  description:
    "Practical guides from GES engineers on solar in Sri Lanka: CEB net metering, hybrid vs off-grid systems, battery storage, panel cleaning, inverters and commercial solar.",
  path: "/blog",
});

export default async function BlogListingPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <JsonLd
        data={jsonLdGraph(
          breadcrumbSchema([{ name: "Blog", path: "/blog" }]),
          {
            "@type": "Blog",
            "@id": `${absoluteUrl("/blog")}#blog`,
            name: "GES Engineering Insights",
            url: absoluteUrl("/blog"),
            inLanguage: "en-LK",
            blogPost: posts.slice(0, 20).map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: absoluteUrl(`/blog/${p.slug}`),
              ...(p.published_at ? { datePublished: p.published_at } : {}),
            })),
          },
        )}
      />
      <BlogIndexClient posts={posts} />
    </>
  );
}
