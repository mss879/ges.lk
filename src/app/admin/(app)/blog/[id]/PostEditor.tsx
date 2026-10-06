"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import { Placeholder } from "@tiptap/extensions";
import { ExternalLink, ImagePlus, Loader2, Star, Trash2, X } from "lucide-react";
import { blogExtensions } from "@/lib/blog/extensions";
import { readingMinutes, slugify } from "@/lib/blog/text";
import { uploadBlogImage } from "@/lib/blog/upload";
import type { BlogMetric, BlogPost } from "@/lib/blog/types";
import { deletePost, savePost, type PostInput } from "../actions";
import EditorToolbar from "./EditorToolbar";

const field =
  "w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm font-semibold placeholder-stone-400 focus:border-[#00AC4E] focus:outline-none focus:ring-1 focus:ring-[#00AC4E]";
const label = "text-[11px] font-bold uppercase tracking-widest text-stone-500";
const card = "rounded-2xl border border-stone-200 bg-white p-5 shadow-sm";

/** ISO → value for <input type="datetime-local"> in the browser's time zone. */
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function Counter({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span className={`text-[10px] font-bold ${over ? "text-red-600" : "text-stone-400"}`}>
      {value.length}/{max}
    </span>
  );
}

export default function PostEditor({ initial, categories }: { initial: BlogPost; categories: string[] }) {
  const router = useRouter();
  const [post, setPost] = useState(initial);
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug.startsWith("untitled-") ? "" : initial.slug);
  const [slugTouched, setSlugTouched] = useState(!initial.slug.startsWith("untitled-"));
  const [excerpt, setExcerpt] = useState(initial.excerpt ?? "");
  const [category, setCategory] = useState(initial.category ?? "");
  const [cover, setCover] = useState({
    url: initial.cover_url,
    alt: initial.cover_alt ?? "",
    width: initial.cover_width,
    height: initial.cover_height,
  });
  const [authorName, setAuthorName] = useState(initial.author_name);
  const [authorRole, setAuthorRole] = useState(initial.author_role ?? "");
  const [metrics, setMetrics] = useState<BlogMetric[]>(() => {
    const rows = [...(initial.metrics ?? [])];
    while (rows.length < 3) rows.push({ label: "", value: "" });
    return rows.slice(0, 3);
  });
  const [publishedAt, setPublishedAt] = useState(toLocalInput(initial.published_at));
  const [featured, setFeatured] = useState(initial.featured);
  const [seoTitle, setSeoTitle] = useState(initial.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(initial.seo_description ?? "");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState<null | "draft" | "published">(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [minutes, setMinutes] = useState(initial.reading_minutes);
  const coverRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [...blogExtensions, Placeholder.configure({ placeholder: "Start writing the article…" })],
    content: initial.content,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: { attributes: { class: "blog-prose px-5 py-6 sm:px-8" } },
    onUpdate: ({ editor: e }) => {
      setDirty(true);
      setMinutes(readingMinutes(e.getJSON()));
    },
  });

  // Mark the form dirty on any field change after the first render.
  const touch = () => setDirty(true);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const effectiveSlug = slug || slugify(title);
  const isPublished = post.status === "published";

  const save = async (status: "draft" | "published") => {
    if (!editor) return;
    setSaving(status);
    setMessage(null);
    const input: PostInput = {
      title,
      slug: effectiveSlug,
      excerpt,
      content: editor.getJSON(),
      cover_url: cover.url,
      cover_alt: cover.alt,
      cover_width: cover.width,
      cover_height: cover.height,
      category,
      author_name: authorName,
      author_role: authorRole,
      metrics: metrics.filter((m) => m.label.trim() && m.value.trim()),
      status,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
      featured,
      seo_title: seoTitle,
      seo_description: seoDescription,
    };
    const result = await savePost(post.id, input);
    setSaving(null);
    if (!result.ok) {
      setMessage({ kind: "err", text: result.error });
      return;
    }
    const saved = result.data!.post;
    setPost(saved);
    setSlug(saved.slug);
    setSlugTouched(true);
    setPublishedAt(toLocalInput(saved.published_at));
    setDirty(false);
    setMessage({ kind: "ok", text: result.message ?? "Saved." });
    router.refresh();
  };

  const remove = async () => {
    if (!confirm("Delete this post and its uploaded images for good?")) return;
    const result = await deletePost(post.id);
    if (!result.ok) {
      setMessage({ kind: "err", text: result.error });
      return;
    }
    setDirty(false);
    router.push("/admin/blog");
    router.refresh();
  };

  const uploadCover = async (file: File | undefined) => {
    if (!file) return;
    setUploadingCover(true);
    setMessage(null);
    try {
      const uploaded = await uploadBlogImage(file, post.id, { cover: true });
      setCover((c) => ({ url: uploaded.url, alt: c.alt || title, width: uploaded.width, height: uploaded.height }));
      touch();
    } catch (error) {
      setMessage({ kind: "err", text: error instanceof Error ? error.message : "Couldn't upload the cover." });
    } finally {
      setUploadingCover(false);
      if (coverRef.current) coverRef.current.value = "";
    }
  };

  const previewTitle = useMemo(() => {
    const base = seoTitle || title || "Untitled post";
    return `${base} | GES Sri Lanka`;
  }, [seoTitle, title]);
  const previewDescription = seoDescription || excerpt || "Add an excerpt or SEO description so Google shows a good snippet.";

  return (
    <div className="mt-4">
      {/* Header / actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
              isPublished ? "bg-[#00AC4E]/10 text-[#007a37]" : "bg-stone-200 text-stone-600"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </span>
          {dirty && <span className="text-[11px] font-bold text-amber-600">Unsaved changes</span>}
          {isPublished && (
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 hover:text-stone-900"
            >
              View live <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={remove}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
          <button
            onClick={() => save("draft")}
            disabled={saving !== null || !editor}
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-700 hover:bg-stone-50 disabled:opacity-50 cursor-pointer"
          >
            {saving === "draft" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isPublished ? "Unpublish & save draft" : "Save draft"}
          </button>
          <button
            onClick={() => save("published")}
            disabled={saving !== null || !editor}
            className="inline-flex items-center gap-2 rounded-full bg-[#00AC4E] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#019544] disabled:opacity-50 cursor-pointer"
          >
            {saving === "published" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isPublished ? "Update" : "Publish"}
          </button>
        </div>
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

      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column: title + editor */}
        <div className="flex min-w-0 flex-col gap-4">
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug("");
              touch();
            }}
            placeholder="Post title"
            aria-label="Post title"
            className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 font-display text-2xl font-black tracking-tight text-stone-900 placeholder-stone-300 shadow-sm focus:border-[#00AC4E] focus:outline-none focus:ring-1 focus:ring-[#00AC4E]"
          />
          <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            {editor ? (
              <>
                <EditorToolbar editor={editor} postId={post.id} onError={(text) => setMessage({ kind: "err", text })} />
                <EditorContent editor={editor} />
              </>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center text-sm font-semibold text-stone-400">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading editor…
              </div>
            )}
          </div>
          <p className="text-[11px] font-semibold text-stone-400">
            About {minutes} min read. Use Heading 2 for main sections — they become anchor links (#section-name) automatically.
          </p>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4">
          <div className={card}>
            <span className={label}>Web address</span>
            <div className="mt-2 flex items-center rounded-xl border border-stone-200 bg-stone-50 focus-within:border-[#00AC4E] focus-within:ring-1 focus-within:ring-[#00AC4E]">
              <span className="pl-3 text-xs font-semibold text-stone-400">/blog/</span>
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                  setSlugTouched(true);
                  touch();
                }}
                placeholder={slugify(title) || "post-address"}
                aria-label="Slug"
                className="w-full bg-transparent px-1.5 py-2.5 text-sm font-semibold placeholder-stone-400 focus:outline-none"
              />
            </div>
            {isPublished && effectiveSlug !== post.slug && (
              <p className="mt-2 text-[11px] font-semibold text-stone-500">
                The old address will redirect here automatically.
              </p>
            )}

            <div className="mt-4">
              <span className={label}>Publish date</span>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => {
                  setPublishedAt(e.target.value);
                  touch();
                }}
                className={`${field} mt-2`}
              />
              <p className="mt-1 text-[11px] font-semibold text-stone-400">Leave empty to use the moment you publish. A future date schedules it.</p>
            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => {
                  setFeatured(e.target.checked);
                  touch();
                }}
                className="h-4 w-4 accent-[#00AC4E]"
              />
              <span className="inline-flex items-center gap-1 text-xs font-bold text-stone-700">
                <Star className="h-3.5 w-3.5 text-amber-500" /> Feature at the top of /blog
              </span>
            </label>
          </div>

          <div className={card}>
            <span className={label}>Cover image</span>
            <div className="relative mt-2 aspect-[16/10] w-full overflow-hidden rounded-xl border border-dashed border-stone-300 bg-stone-50">
              {cover.url ? (
                <>
                  <Image src={cover.url} alt={cover.alt} fill sizes="320px" className="object-cover" unoptimized={cover.url.startsWith("http")} />
                  <button
                    onClick={() => {
                      setCover({ url: null, alt: "", width: null, height: null });
                      touch();
                    }}
                    title="Remove cover"
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-stone-600 shadow hover:text-red-600 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => coverRef.current?.click()}
                  disabled={uploadingCover}
                  className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  {uploadingCover ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                  Upload cover
                </button>
              )}
            </div>
            {cover.url && (
              <button
                onClick={() => coverRef.current?.click()}
                disabled={uploadingCover}
                className="mt-2 text-[11px] font-bold text-[#007a37] hover:underline cursor-pointer"
              >
                {uploadingCover ? "Uploading…" : "Replace image"}
              </button>
            )}
            <input
              ref={coverRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) => uploadCover(e.target.files?.[0])}
            />
            <input
              value={cover.alt}
              onChange={(e) => {
                setCover((c) => ({ ...c, alt: e.target.value }));
                touch();
              }}
              placeholder="Cover alt text"
              aria-label="Cover alt text"
              className={`${field} mt-3`}
            />
            <p className="mt-1 text-[11px] font-semibold text-stone-400">Also used for the social-media preview image.</p>
          </div>

          <div className={card}>
            <div className="flex items-center justify-between">
              <span className={label}>Excerpt</span>
              <Counter value={excerpt} max={400} />
            </div>
            <textarea
              value={excerpt}
              onChange={(e) => {
                setExcerpt(e.target.value);
                touch();
              }}
              rows={4}
              placeholder="One or two sentences shown on cards and in search results."
              className={`${field} mt-2 resize-y`}
            />

            <span className={`${label} mt-4 block`}>Category</span>
            <input
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                touch();
              }}
              list="blog-categories"
              placeholder="e.g. Battery Storage"
              className={`${field} mt-2`}
            />
            <datalist id="blog-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>

            <span className={`${label} mt-4 block`}>Author</span>
            <input
              value={authorName}
              onChange={(e) => {
                setAuthorName(e.target.value);
                touch();
              }}
              placeholder="Green Engineering Systems"
              className={`${field} mt-2`}
            />
            <input
              value={authorRole}
              onChange={(e) => {
                setAuthorRole(e.target.value);
                touch();
              }}
              placeholder="Role, e.g. GES Engineering Board"
              className={`${field} mt-2`}
            />
          </div>

          <div className={card}>
            <span className={label}>Key figures (optional)</span>
            <p className="mt-1 text-[11px] font-semibold text-stone-400">Up to three highlight numbers shown on the article and cards.</p>
            <div className="mt-3 flex flex-col gap-2">
              {metrics.map((m, i) => (
                <div key={i} className="grid grid-cols-2 gap-2">
                  <input
                    value={m.label}
                    onChange={(e) => {
                      setMetrics((prev) => prev.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)));
                      touch();
                    }}
                    placeholder="Label"
                    className={field}
                  />
                  <input
                    value={m.value}
                    onChange={(e) => {
                      setMetrics((prev) => prev.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)));
                      touch();
                    }}
                    placeholder="Value"
                    className={field}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={card}>
            <span className={label}>Search engine listing</span>
            <div className="mt-3 rounded-xl border border-stone-200 bg-white p-3">
              <p className="truncate text-[11px] text-stone-500">www.ges.lk › blog › {effectiveSlug || "…"}</p>
              <p className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-[#1a0dab]">{previewTitle}</p>
              <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-stone-600">{previewDescription}</p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">SEO title (optional)</span>
              <Counter value={seoTitle} max={60} />
            </div>
            <input
              value={seoTitle}
              onChange={(e) => {
                setSeoTitle(e.target.value);
                touch();
              }}
              placeholder={title || "Defaults to the post title"}
              className={`${field} mt-1`}
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Meta description (optional)</span>
              <Counter value={seoDescription} max={160} />
            </div>
            <textarea
              value={seoDescription}
              onChange={(e) => {
                setSeoDescription(e.target.value);
                touch();
              }}
              rows={3}
              placeholder="Defaults to the excerpt"
              className={`${field} mt-1 resize-y`}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
