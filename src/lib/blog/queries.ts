import "server-only";
import { cache } from "react";
import { BLOG_TAG, createPublicClient } from "@/lib/supabase/public";
import { POST_SUMMARY_COLUMNS, type BlogPost, type PostSummary } from "@/lib/blog/types";

/**
 * Public blog reads, through the cookie-less client cached under the "blog"
 * tag (refreshed when an admin saves). Row level security only ever returns
 * published posts whose publish time has passed.
 *
 * Errors are logged, not thrown: the public blog shows its empty state rather
 * than an error page if the table is missing or Supabase is unreachable.
 */

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

let warnedMissingTable = false;

function quiet(error: { message: string; code?: string } | null) {
  if (!error) return;
  // Before migrations 0010/0011 are run the table doesn't exist: say so once, not on every request.
  if (error.code === "PGRST205" || error.code === "42P01" || /could not find the table/i.test(error.message)) {
    if (!warnedMissingTable) {
      warnedMissingTable = true;
      console.warn("[blog] blog_posts table not found — run supabase/migrations/0010_blog.sql and 0011_seed_blog_posts.sql.");
    }
    return;
  }
  console.error("[blog]", error.message);
}

/** Published posts, newest first. */
export const getPublishedPosts = cache(async (limit = 100): Promise<PostSummary[]> => {
  const supabase = createPublicClient(BLOG_TAG);
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_SUMMARY_COLUMNS)
      .order("published_at", { ascending: false })
      .limit(limit);
    quiet(error);
    return (data as PostSummary[] | null) ?? [];
  } catch (error) {
    console.error("[blog] couldn't load posts", error);
    return [];
  }
});

/** The most recent `count` posts, for the homepage. */
export async function getRecentPosts(count = 3): Promise<PostSummary[]> {
  return (await getPublishedPosts()).slice(0, count);
}

/** A published post by slug — or, if the slug was renamed, where it moved to. */
export const getPostBySlug = cache(
  async (slug: string): Promise<{ post: BlogPost | null; movedTo: string | null }> => {
    const supabase = createPublicClient(BLOG_TAG);
    if (!supabase || !SLUG.test(slug) || slug.length > 120) return { post: null, movedTo: null };
    try {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
      quiet(error);
      if (data) return { post: data as BlogPost, movedTo: null };
      const { data: moved } = await supabase
        .from("blog_posts")
        .select("slug")
        .contains("previous_slugs", [slug])
        .limit(1)
        .maybeSingle();
      return { post: null, movedTo: (moved as { slug: string } | null)?.slug ?? null };
    } catch (error) {
      console.error("[blog] couldn't load a post", error);
      return { post: null, movedTo: null };
    }
  },
);

/** Up to three more posts: same category first, then the latest. */
export async function getRelatedPosts(post: Pick<BlogPost, "id" | "category">): Promise<PostSummary[]> {
  const all = await getPublishedPosts();
  const others = all.filter((item) => item.id !== post.id);
  const same = others.filter((item) => post.category && item.category === post.category);
  return [...same, ...others.filter((item) => !same.includes(item))].slice(0, 3);
}
