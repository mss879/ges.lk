import type { MetadataRoute } from "next";
import { categoriesDataList, solutionsDataList } from "@/data/solutions";
import { getPublishedPosts } from "@/lib/blog/queries";
import { absoluteUrl } from "@/lib/site";

// Rebuilt hourly, and immediately when a blog post is published (the blog
// admin revalidates /sitemap.xml). Admin, login and API routes are never listed.
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/solutions", priority: 0.9, changeFrequency: "monthly" },
  { path: "/products", priority: 0.8, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.8, changeFrequency: "weekly" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/careers", priority: 0.4, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();

  const pages: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const categories: MetadataRoute.Sitemap = categoriesDataList.map((category) => ({
    url: absoluteUrl(`/solutions/${category.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const solutions: MetadataRoute.Sitemap = solutionsDataList.map((solution) => ({
    url: absoluteUrl(`/solutions/${solution.slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
    ...(solution.image ? { images: [absoluteUrl(solution.image)] } : {}),
  }));

  const articles: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.updated_at,
    changeFrequency: "monthly",
    priority: 0.6,
    ...(post.cover_url
      ? { images: [post.cover_url.startsWith("http") ? post.cover_url : absoluteUrl(post.cover_url)] }
      : {}),
  }));

  return [...pages, ...categories, ...solutions, ...articles];
}
