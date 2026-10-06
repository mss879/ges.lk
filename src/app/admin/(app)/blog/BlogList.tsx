"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Eye, EyeOff, FileText, Loader2, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { formatPostDate } from "@/lib/blog/format";
import type { BlogListRow } from "./page";
import { createPost, deletePost, setPostStatus } from "./actions";

type Filter = "all" | "published" | "draft";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Drafts" },
];

export default function BlogList({ initial }: { initial: BlogListRow[] }) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, startCreate] = useTransition();
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (filter === "all" || r.status === filter) &&
        (!q || r.title.toLowerCase().includes(q) || (r.category ?? "").toLowerCase().includes(q)),
    );
  }, [rows, filter, query]);

  const toggleStatus = async (row: BlogListRow) => {
    setBusyId(row.id);
    setMessage(null);
    const next = row.status === "published" ? "draft" : "published";
    const result = await setPostStatus(row.id, next);
    setBusyId(null);
    if (!result.ok) {
      setMessage({ kind: "err", text: result.error });
      return;
    }
    const post = result.data!.post;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: post.status, published_at: post.published_at } : r)));
    setMessage({ kind: "ok", text: result.message ?? "Updated." });
  };

  const remove = async (row: BlogListRow) => {
    if (!confirm(`Delete "${row.title || "Untitled post"}"? This removes it and its uploaded images for good.`)) return;
    setBusyId(row.id);
    setMessage(null);
    const result = await deletePost(row.id);
    setBusyId(null);
    if (!result.ok) {
      setMessage({ kind: "err", text: result.error });
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setMessage({ kind: "ok", text: result.message ?? "Deleted." });
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                filter === f.key ? "bg-stone-900 text-white" : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              {f.label}
              <span className="ml-1.5 opacity-60">
                {f.key === "all" ? rows.length : rows.filter((r) => r.status === f.key).length}
              </span>
            </button>
          ))}
          <div className="relative ml-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts"
              aria-label="Search posts"
              className="w-48 rounded-full border border-stone-200 bg-white py-1.5 pl-8 pr-3 text-xs font-semibold placeholder-stone-400 focus:border-[#00AC4E] focus:outline-none focus:ring-1 focus:ring-[#00AC4E]"
            />
          </div>
        </div>

        <button
          onClick={() => startCreate(() => createPost())}
          disabled={creating}
          className="inline-flex items-center gap-2 rounded-full bg-[#00AC4E] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#019544] disabled:opacity-50 cursor-pointer"
        >
          {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          New post
        </button>
      </div>

      {message && (
        <p
          className={`mt-4 rounded-xl px-4 py-2.5 text-xs font-semibold ${
            message.kind === "ok"
              ? "border border-[#00AC4E]/20 bg-[#00AC4E]/10 text-[#007a37]"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        {visible.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <FileText className="mx-auto h-8 w-8 text-stone-300" />
            <p className="mt-3 text-sm font-semibold text-stone-400">
              {rows.length === 0 ? "No posts yet. Start with “New post”." : "No posts match."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {visible.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center gap-4 px-4 py-3 sm:flex-nowrap">
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  {row.cover_url && (
                    <Image src={row.cover_url} alt="" fill sizes="64px" className="object-cover" unoptimized={row.cover_url.startsWith("http")} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/blog/${row.id}`}
                      className="truncate text-sm font-extrabold text-stone-900 hover:text-[#00AC4E]"
                    >
                      {row.title || "Untitled post"}
                    </Link>
                    {row.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" aria-label="Featured" />}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-stone-400">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        row.status === "published" ? "bg-[#00AC4E]/10 text-[#007a37]" : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {row.status === "published" ? "Published" : "Draft"}
                    </span>
                    {row.category && <span>{row.category}</span>}
                    <span>·</span>
                    <span>
                      {row.status === "published" && row.published_at
                        ? formatPostDate(row.published_at)
                        : `Edited ${formatPostDate(row.updated_at)}`}
                    </span>
                    <span>· {row.reading_minutes} min</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {row.status === "published" && (
                    <a
                      href={`/blog/${row.slug}`}
                      target="_blank"
                      rel="noopener"
                      title="View on site"
                      className="rounded-full border border-stone-200 p-2 text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => toggleStatus(row)}
                    disabled={busyId === row.id}
                    title={row.status === "published" ? "Unpublish" : "Publish"}
                    className="rounded-full border border-stone-200 p-2 text-stone-500 hover:bg-stone-50 hover:text-stone-900 disabled:opacity-40 cursor-pointer"
                  >
                    {busyId === row.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : row.status === "published" ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <Link
                    href={`/admin/blog/${row.id}`}
                    title="Edit"
                    className="rounded-full border border-stone-200 p-2 text-stone-500 hover:bg-stone-50 hover:text-stone-900"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => remove(row)}
                    disabled={busyId === row.id}
                    title="Delete"
                    className="rounded-full border border-stone-200 p-2 text-stone-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
