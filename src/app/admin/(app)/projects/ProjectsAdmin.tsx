"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Upload, Loader2, MapPin, Zap, ImageOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { MAX_PROJECT_IMAGES, PROJECT_IMAGES_BUCKET } from "@/lib/supabase/config";
import type { ProjectCategory, ProjectImage, ProjectWithImages } from "@/lib/supabase/types";

type Draft = {
  id: string | null;
  name: string;
  location: string;
  capacity: string;
  category: ProjectCategory;
  is_published: boolean;
};

const EMPTY: Draft = {
  id: null,
  name: "",
  location: "",
  capacity: "",
  category: "residential",
  is_published: true,
};

export default function ProjectsAdmin({ initial }: { initial: ProjectWithImages[] }) {
  const [projects, setProjects] = useState(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const openNew = () => {
    setDraft({ ...EMPTY });
    setImages([]);
    setError(null);
  };

  const openEdit = (p: ProjectWithImages) => {
    setDraft({
      id: p.id,
      name: p.name,
      location: p.location ?? "",
      capacity: p.capacity ?? "",
      category: p.category,
      is_published: p.is_published,
    });
    setImages([...p.project_images].sort((a, b) => a.position - b.position));
    setError(null);
  };

  const close = () => {
    setDraft(null);
    setImages([]);
  };

  /* --------------------------------------------------------------- save */

  const save = async () => {
    if (!draft || !draft.name.trim()) return;
    setBusy(true);
    setError(null);

    const payload = {
      name: draft.name.trim(),
      location: draft.location.trim() || null,
      capacity: draft.capacity.trim() || null,
      category: draft.category,
      is_published: draft.is_published,
    };

    if (draft.id) {
      const { error: e } = await supabase.from("projects").update(payload).eq("id", draft.id);
      if (e) {
        setError(e.message);
        setBusy(false);
        return;
      }
      setProjects((prev) =>
        prev.map((p) => (p.id === draft.id ? { ...p, ...payload, project_images: images } : p))
      );
    } else {
      const { data, error: e } = await supabase
        .from("projects")
        .insert({ ...payload, position: projects.length })
        .select("*, project_images(*)")
        .single();
      if (e || !data) {
        setError(e?.message ?? "Could not create the project.");
        setBusy(false);
        return;
      }
      setProjects((prev) => [...prev, data as ProjectWithImages]);
      // Keep the editor open so images can be attached to the new row.
      setDraft({ ...draft, id: (data as ProjectWithImages).id });
      setBusy(false);
      return;
    }

    setBusy(false);
    close();
  };

  const remove = async (p: ProjectWithImages) => {
    if (!confirm(`Delete "${p.name}" and its images?`)) return;

    // Uploaded files must be removed from storage too; seeded /public images
    // have no storage_path and are left alone.
    const paths = p.project_images.map((i) => i.storage_path).filter((x): x is string => Boolean(x));
    if (paths.length) await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove(paths);

    const { error: e } = await supabase.from("projects").delete().eq("id", p.id);
    if (e) {
      setError(e.message);
      return;
    }
    setProjects((prev) => prev.filter((x) => x.id !== p.id));
  };

  /* ------------------------------------------------------------- images */

  const upload = async (files: FileList | null) => {
    if (!files?.length || !draft?.id) return;

    const room = MAX_PROJECT_IMAGES - images.length;
    if (room <= 0) {
      setError(`A project can have at most ${MAX_PROJECT_IMAGES} images.`);
      return;
    }

    const batch = Array.from(files).slice(0, room);
    if (batch.length < files.length) {
      setError(`Only ${room} more image${room === 1 ? "" : "s"} can be added — extras were skipped.`);
    }

    setUploading(true);
    const added: ProjectImage[] = [];

    for (const [i, file] of batch.entries()) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${draft.id}/${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from(PROJECT_IMAGES_BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (upErr) {
        setError(upErr.message);
        break;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(PROJECT_IMAGES_BUCKET).getPublicUrl(path);

      const { data: row, error: rowErr } = await supabase
        .from("project_images")
        .insert({
          project_id: draft.id,
          url: publicUrl,
          storage_path: path,
          alt: draft.name,
          position: images.length + i,
        })
        .select()
        .single();

      if (rowErr) {
        // Row rejected (most likely the 7-image trigger) — do not orphan the file.
        await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove([path]);
        setError(rowErr.message);
        break;
      }
      if (row) added.push(row as ProjectImage);
    }

    if (added.length) {
      const next = [...images, ...added];
      setImages(next);
      setProjects((prev) =>
        prev.map((p) => (p.id === draft.id ? { ...p, project_images: next } : p))
      );
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = async (img: ProjectImage) => {
    const { error: e } = await supabase.from("project_images").delete().eq("id", img.id);
    if (e) {
      setError(e.message);
      return;
    }
    if (img.storage_path) {
      await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove([img.storage_path]);
    }
    const next = images.filter((i) => i.id !== img.id);
    setImages(next);
    setProjects((prev) => prev.map((p) => (p.id === draft?.id ? { ...p, project_images: next } : p)));
  };

  /* ------------------------------------------------------------- render */

  const field =
    "w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm font-semibold placeholder-stone-400 focus:border-[#00AC4E] focus:outline-none focus:ring-1 focus:ring-[#00AC4E]";

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
          {projects.length} project{projects.length === 1 ? "" : "s"}
        </p>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-[#00AC4E] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#019544] cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          New project
        </button>
      </div>

      {error && !draft && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
          {error}
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => {
          const cover = [...p.project_images].sort((a, b) => a.position - b.position)[0];
          return (
            <article
              key={p.id}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-stone-100">
                {cover ? (
                  <Image
                    src={cover.url}
                    alt={cover.alt ?? p.name}
                    fill
                    sizes="(min-width:1024px) 300px, 45vw"
                    className="object-cover"
                    unoptimized={cover.url.startsWith("http")}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-stone-300">
                    <ImageOff className="h-7 w-7" />
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-stone-700 backdrop-blur">
                  {p.category}
                </span>
                {!p.is_published && (
                  <span className="absolute right-3 top-3 rounded-full bg-stone-900/80 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                    Hidden
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="truncate text-sm font-black text-stone-900">{p.name}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  {p.location && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500">
                      <MapPin className="h-3 w-3 text-stone-400" />
                      {p.location}
                    </span>
                  )}
                  {p.capacity && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#00AC4E]">
                      <Zap className="h-3 w-3" />
                      {p.capacity}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    {p.project_images.length}/{MAX_PROJECT_IMAGES} images
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openEdit(p)} aria-label={`Edit ${p.name}`} className="cursor-pointer">
                      <Pencil className="h-3.5 w-3.5 text-stone-400 hover:text-stone-800" />
                    </button>
                    <button onClick={() => remove(p)} aria-label={`Delete ${p.name}`} className="cursor-pointer">
                      <Trash2 className="h-3.5 w-3.5 text-stone-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* editor */}
      {draft && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-950/50 p-4 sm:p-8">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3.5">
              <h2 className="text-sm font-black text-stone-900">
                {draft.id ? "Edit project" : "New project"}
              </h2>
              <button onClick={close} aria-label="Close" className="cursor-pointer">
                <X className="h-4 w-4 text-stone-400 hover:text-stone-800" />
              </button>
            </div>

            <div className="flex flex-col gap-3.5 p-5">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
                  Project name
                </span>
                <input
                  className={field}
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Mr. Perera"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
                    Location
                  </span>
                  <input
                    className={field}
                    value={draft.location}
                    onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                    placeholder="Kelaniya"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
                    System capacity
                  </span>
                  <input
                    className={field}
                    value={draft.capacity}
                    onChange={(e) => setDraft({ ...draft, capacity: e.target.value })}
                    placeholder="6 kW"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
                  Category
                </span>
                <div className="flex gap-2">
                  {(["residential", "commercial"] as ProjectCategory[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setDraft({ ...draft, category: c })}
                      className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-bold capitalize transition-colors cursor-pointer ${
                        draft.category === c
                          ? "border-[#00AC4E] bg-[#00AC4E]/10 text-[#00AC4E]"
                          : "border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={draft.is_published}
                  onChange={(e) => setDraft({ ...draft, is_published: e.target.checked })}
                  className="h-4 w-4 cursor-pointer accent-[#00AC4E]"
                />
                <span className="text-xs font-bold text-stone-600">Show on the public website</span>
              </label>

              {/* images */}
              <div className="mt-1 border-t border-stone-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
                    Photographs
                  </span>
                  <span className="text-[11px] font-bold text-stone-400">
                    {images.length}/{MAX_PROJECT_IMAGES}
                  </span>
                </div>

                {!draft.id ? (
                  <p className="mt-2.5 rounded-xl border border-dashed border-stone-300 px-4 py-4 text-center text-[11px] font-semibold text-stone-400">
                    Save the project first, then upload its photographs.
                  </p>
                ) : (
                  <>
                    <div className="mt-2.5 grid grid-cols-4 gap-2">
                      {images.map((img) => (
                        <div
                          key={img.id}
                          className="group relative aspect-square overflow-hidden rounded-lg border border-stone-200 bg-stone-100"
                        >
                          <Image
                            src={img.url}
                            alt={img.alt ?? ""}
                            fill
                            sizes="90px"
                            className="object-cover"
                            unoptimized={img.url.startsWith("http")}
                          />
                          <button
                            onClick={() => removeImage(img)}
                            aria-label="Remove image"
                            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-stone-900/70 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      ))}

                      {images.length < MAX_PROJECT_IMAGES && (
                        <button
                          onClick={() => fileRef.current?.click()}
                          disabled={uploading}
                          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-stone-300 text-stone-400 transition-colors hover:border-[#00AC4E] hover:text-[#00AC4E] disabled:opacity-50 cursor-pointer"
                        >
                          {uploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          <span className="text-[9px] font-bold uppercase">Upload</span>
                        </button>
                      )}
                    </div>

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/avif"
                      multiple
                      hidden
                      onChange={(e) => upload(e.target.files)}
                    />
                  </>
                )}
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700">
                  {error}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-stone-200 px-5 py-3.5">
              <button
                onClick={close}
                className="rounded-full border border-stone-200 px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
              >
                {draft.id ? "Done" : "Cancel"}
              </button>
              <button
                onClick={save}
                disabled={busy || !draft.name.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-[#00AC4E] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#019544] disabled:opacity-50 cursor-pointer"
              >
                {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {draft.id ? "Save changes" : "Create project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
