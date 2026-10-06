import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/admin/result";
import type { BlogPost } from "@/lib/blog/types";
import PostEditor from "./PostEditor";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const [{ data, error }, { data: categoryRows }] = await Promise.all([
    supabase.from("blog_posts").select("*").eq("id", id).maybeSingle(),
    supabase.from("blog_posts").select("category").not("category", "is", null),
  ]);

  if (error) {
    return (
      <div className="mx-auto max-w-6xl">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {friendlyError(error)}
        </p>
      </div>
    );
  }
  if (!data) notFound();

  const categories = Array.from(
    new Set(((categoryRows ?? []) as { category: string }[]).map((r) => r.category).filter(Boolean)),
  ).sort();

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All posts
      </Link>
      <PostEditor initial={data as BlogPost} categories={categories} />
    </div>
  );
}
