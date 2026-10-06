import { getPostBySlug, getPublishedPosts } from "@/lib/blog/queries";
import { loadOgPhoto, ogImage } from "@/lib/og/template";

// Pre-render a card for every published post at build time; new posts render on demand.
export async function generateStaticParams() {
  return (await getPublishedPosts()).map((post) => ({ slug: post.slug }));
}

export const alt = "GES blog article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { post } = await getPostBySlug(slug);
  // The cover photo when it's a JPEG/PNG (covers are stored as JPEG for this);
  // otherwise the branded ribbon card.
  const photo = await loadOgPhoto(post?.cover_url);
  return ogImage({
    eyebrow: post?.category || "Blog",
    title: post?.title || "Clean energy & engineering insights",
    photo,
    footnote: "Clean energy & engineering insights from GES",
  });
}
