"use server";

import { getSchema, type JSONContent } from "@tiptap/core";
import { Node } from "@tiptap/pm/model";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { friendlyError, type ActionResult } from "@/lib/admin/result";
import { ALLOWED_LINK, blogExtensions } from "@/lib/blog/extensions";
import { BLOG_BUCKET, isBlogImage } from "@/lib/blog/images";
import { readingMinutes, slugify } from "@/lib/blog/text";
import type { BlogMetric, BlogPost, PostStatus } from "@/lib/blog/types";
import { BLOG_TAG } from "@/lib/supabase/public";
import { requireAdmin } from "@/lib/supabase/server";

/**
 * Blog admin writes. Every action re-checks admin access (Server Actions are
 * public POST endpoints), validates the article against the editor's schema,
 * writes through the signed-in admin's Supabase client (so RLS still applies),
 * then refreshes the public pages that show posts.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const schema = getSchema(blogExtensions);
const MAX_CONTENT = 600_000;
const DEFAULT_AUTHOR = "Green Engineering Systems";

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: JSONContent;
  cover_url: string | null;
  cover_alt: string;
  cover_width: number | null;
  cover_height: number | null;
  category: string;
  author_name: string;
  author_role: string;
  metrics: BlogMetric[];
  status: PostStatus;
  /** ISO time; empty means "now" when publishing. */
  published_at: string | null;
  featured: boolean;
  seo_title: string;
  seo_description: string;
};

const text = (value: unknown, max: number) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;

async function admin() {
  try {
    return await requireAdmin();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Not authorised.");
  }
}

/** The article must fit the editor's schema, link only to allowed places and use only uploaded images. */
function checkContent(content: unknown): string | null {
  if (JSON.stringify(content ?? null).length > MAX_CONTENT) return "The article is too long to save. Split it into two posts.";
  let doc: Node;
  try {
    doc = Node.fromJSON(schema, content);
    doc.check();
  } catch {
    return "The article couldn’t be read. Reload the editor and try again.";
  }
  let problem: string | null = null;
  doc.descendants((node) => {
    if (node.type.name === "image" && !isBlogImage(node.attrs.src)) problem = "Images must be uploaded through the editor.";
    for (const mark of node.marks) {
      if (mark.type.name === "link" && !ALLOWED_LINK.test(String(mark.attrs.href ?? ""))) {
        problem = "One of the links isn’t a web, email, phone or on-page link.";
      }
    }
    return problem === null;
  });
  return problem;
}

function cleanMetrics(metrics: unknown): BlogMetric[] {
  if (!Array.isArray(metrics)) return [];
  return metrics
    .map((m) => ({ label: text(m?.label, 40) ?? "", value: text(m?.value, 40) ?? "" }))
    .filter((m) => m.label && m.value)
    .slice(0, 3);
}

/** Refreshes everything that shows posts: the article (old and new address), the index, the homepage and the sitemap. */
function refreshPublic(...slugs: (string | null | undefined)[]) {
  updateTag(BLOG_TAG);
  revalidatePath("/blog");
  for (const slug of new Set(slugs.filter(Boolean))) revalidatePath(`/blog/${slug}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/blog");
}

/** "New post": an empty draft, opened straight away in the editor. */
export async function createPost() {
  const { supabase } = await admin();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ title: "", slug: `untitled-${crypto.randomUUID().slice(0, 8)}`, author_role: "GES Engineering Board" })
    .select("id")
    .single();
  if (error) throw new Error(friendlyError(error));
  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${(data as { id: string }).id}`);
}

export async function savePost(id: string, input: PostInput): Promise<ActionResult<{ post: BlogPost }>> {
  try {
    const { supabase } = await admin();
    if (!UUID.test(id)) return { ok: false, error: "Unknown post." };

    const title = text(input.title, 200) ?? "";
    const status: PostStatus = input.status === "published" ? "published" : "draft";
    if (status === "published" && !title) return { ok: false, error: "Give the post a title before publishing." };

    const slug = (text(input.slug, 120) ?? slugify(title)).toLowerCase();
    if (!SLUG.test(slug)) {
      return { ok: false, error: "The web address can only use lower-case letters, numbers and dashes." };
    }

    const problem = checkContent(input.content);
    if (problem) return { ok: false, error: problem };

    if (input.cover_url && !isBlogImage(input.cover_url)) {
      return { ok: false, error: "Upload the cover image through the editor." };
    }

    let publishedAt: string | null = null;
    if (input.published_at) {
      const when = new Date(input.published_at);
      if (Number.isNaN(when.getTime())) return { ok: false, error: "Pick a valid publish date." };
      publishedAt = when.toISOString();
    }

    const { data: before } = await supabase.from("blog_posts").select("slug, status").eq("id", id).maybeSingle();
    if (!before) return { ok: false, error: "This post was deleted." };

    // Only one post can be featured: clear the flag elsewhere first.
    if (input.featured) {
      const { error: unfeatureError } = await supabase
        .from("blog_posts")
        .update({ featured: false })
        .eq("featured", true)
        .neq("id", id);
      if (unfeatureError) return { ok: false, error: friendlyError(unfeatureError) };
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .update({
        title,
        slug,
        excerpt: text(input.excerpt, 400),
        content: input.content,
        cover_url: input.cover_url || null,
        cover_alt: text(input.cover_alt, 300),
        cover_width: input.cover_url && input.cover_width ? Math.round(input.cover_width) : null,
        cover_height: input.cover_url && input.cover_height ? Math.round(input.cover_height) : null,
        category: text(input.category, 60),
        author_name: text(input.author_name, 80) ?? DEFAULT_AUTHOR,
        author_role: text(input.author_role, 80),
        metrics: cleanMetrics(input.metrics),
        status,
        published_at: publishedAt,
        featured: Boolean(input.featured),
        seo_title: text(input.seo_title, 120),
        seo_description: text(input.seo_description, 300),
        reading_minutes: readingMinutes(input.content),
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      if (error.code === "23505") return { ok: false, error: "Another post already uses that web address. Change the slug." };
      return { ok: false, error: friendlyError(error) };
    }

    const post = data as BlogPost;
    // Drafts don't appear in public, so only touch the public pages when something visible could change.
    if (status === "published" || (before as { status: string }).status === "published") {
      refreshPublic((before as { slug: string }).slug, post.slug);
    } else {
      revalidatePath("/admin/blog");
    }
    return { ok: true, data: { post }, message: status === "published" ? "Saved and live." : "Draft saved." };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Couldn't save the post." };
  }
}

/** Quick publish / unpublish from the post list. */
export async function setPostStatus(id: string, status: PostStatus): Promise<ActionResult<{ post: BlogPost }>> {
  try {
    const { supabase } = await admin();
    if (!UUID.test(id)) return { ok: false, error: "Unknown post." };
    if (status === "published") {
      const { data: row } = await supabase.from("blog_posts").select("title").eq("id", id).maybeSingle();
      if (!(row as { title: string } | null)?.title?.trim()) {
        return { ok: false, error: "Give the post a title before publishing." };
      }
    }
    const { data, error } = await supabase
      .from("blog_posts")
      .update({ status: status === "published" ? "published" : "draft" })
      .eq("id", id)
      .select("*")
      .single();
    if (error) return { ok: false, error: friendlyError(error) };
    const post = data as BlogPost;
    refreshPublic(post.slug);
    return { ok: true, data: { post }, message: status === "published" ? "Published." : "Moved back to drafts." };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Couldn't update the post." };
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await admin();
    if (!UUID.test(id)) return { ok: false, error: "Unknown post." };
    const { data: post } = await supabase.from("blog_posts").select("slug, status").eq("id", id).maybeSingle();

    // Its uploaded images live in a folder named after the post.
    const { data: files } = await supabase.storage.from(BLOG_BUCKET).list(id, { limit: 1000 });
    if (files?.length) await supabase.storage.from(BLOG_BUCKET).remove(files.map((file) => `${id}/${file.name}`));

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return { ok: false, error: friendlyError(error) };
    const row = post as { slug: string; status: string } | null;
    if (row?.status === "published") refreshPublic(row.slug);
    else revalidatePath("/admin/blog");
    return { ok: true, message: "Post deleted." };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Couldn't delete the post." };
  }
}
