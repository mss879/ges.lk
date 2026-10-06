import { SUPABASE_URL } from "@/lib/supabase/config";

export const BLOG_BUCKET = "blog-images";

/** Public URL prefix of the blog's storage bucket. */
export const blogImagePrefix = SUPABASE_URL
  ? `${SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/${BLOG_BUCKET}/`
  : null;

/**
 * Article and cover images may only come from the blog's own bucket, or from
 * /blogs/ in public/ (the images of the posts migrated from the old site).
 */
export function isBlogImage(src: unknown): src is string {
  if (typeof src !== "string" || src.includes("..")) return false;
  if (src.startsWith("/blogs/")) return true;
  return blogImagePrefix !== null && src.startsWith(blogImagePrefix);
}
