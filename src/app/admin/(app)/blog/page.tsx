import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/admin/result";
import type { BlogPost } from "@/lib/blog/types";
import BlogList from "./BlogList";

export const dynamic = "force-dynamic";

export type BlogListRow = Pick<
  BlogPost,
  "id" | "title" | "slug" | "status" | "published_at" | "updated_at" | "category" | "featured" | "cover_url" | "reading_minutes"
>;

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, status, published_at, updated_at, category, featured, cover_url, reading_minutes")
    .order("updated_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-black tracking-tight text-stone-900">Blog</h1>
      <p className="mt-1 text-sm font-medium text-stone-500">
        Write, edit and publish articles. Published posts appear on /blog, the homepage and the sitemap straight away.
      </p>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {friendlyError(error)}
        </p>
      ) : (
        <BlogList initial={(data ?? []) as BlogListRow[]} />
      )}
    </div>
  );
}
