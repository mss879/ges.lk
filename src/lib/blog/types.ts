import type { JSONContent } from "@tiptap/core";

export type PostStatus = "draft" | "published";

export type BlogMetric = { label: string; value: string };

/** A row of public.blog_posts (supabase/migrations/0010_blog.sql). */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  previous_slugs: string[];
  excerpt: string | null;
  /** Tiptap (ProseMirror) JSON document. */
  content: JSONContent;
  cover_url: string | null;
  cover_alt: string | null;
  cover_width: number | null;
  cover_height: number | null;
  category: string | null;
  author_name: string;
  author_role: string | null;
  metrics: BlogMetric[];
  status: PostStatus;
  published_at: string | null;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  reading_minutes: number;
  created_at: string;
  updated_at: string;
}

/** What listings need (no article body). */
export type PostSummary = Pick<
  BlogPost,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "cover_url"
  | "cover_alt"
  | "cover_width"
  | "cover_height"
  | "category"
  | "author_name"
  | "author_role"
  | "metrics"
  | "published_at"
  | "updated_at"
  | "reading_minutes"
  | "featured"
>;

export const POST_SUMMARY_COLUMNS =
  "id, title, slug, excerpt, cover_url, cover_alt, cover_width, cover_height, category, author_name, author_role, metrics, published_at, updated_at, reading_minutes, featured";
