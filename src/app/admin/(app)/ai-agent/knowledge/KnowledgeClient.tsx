"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, BookOpen, Check, Loader2, Pencil, Plus, Sparkles, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { KnowledgeRow } from "@/lib/chat/types";

const CATEGORIES = ["Company", "Contact", "Products", "Pricing", "Process", "Grid connection", "Services", "Sales", "Policies", "General"];

const field =
  "w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm font-semibold placeholder-stone-400 focus:border-[#00AC4E] focus:outline-none focus:ring-1 focus:ring-[#00AC4E]";
const label = "text-[11px] font-bold uppercase tracking-widest text-stone-500";

type Draft = { id: string | null; title: string; category: string; content: string; is_active: boolean };
const EMPTY: Draft = { id: null, title: "", category: "General", content: "", is_active: true };

export default function KnowledgeClient({
  initial,
  automatic,
}: {
  initial: KnowledgeRow[];
  automatic: { label: string; detail: string }[];
}) {
  const [rows, setRows] = useState(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const supabase = createClient();

  const save = async () => {
    if (!draft) return;
    if (!draft.title.trim() || !draft.content.trim()) {
      setMessage({ kind: "err", text: "Give the entry a title and some content." });
      return;
    }
    setBusy(true);
    setMessage(null);
    const payload = {
      title: draft.title.trim().slice(0, 160),
      category: draft.category.trim().slice(0, 60) || "General",
      content: draft.content.trim().slice(0, 12000),
      is_active: draft.is_active,
    };
    if (draft.id) {
      const { data, error } = await supabase.from("ai_knowledge").update(payload).eq("id", draft.id).select("*").single();
      setBusy(false);
      if (error) return setMessage({ kind: "err", text: error.message });
      setRows((prev) => prev.map((r) => (r.id === draft.id ? (data as KnowledgeRow) : r)));
    } else {
      const position = rows.length ? Math.max(...rows.map((r) => r.position)) + 10 : 10;
      const { data, error } = await supabase.from("ai_knowledge").insert({ ...payload, position }).select("*").single();
      setBusy(false);
      if (error) return setMessage({ kind: "err", text: error.message });
      setRows((prev) => [...prev, data as KnowledgeRow]);
    }
    setDraft(null);
    setMessage({ kind: "ok", text: "Saved. The assistant uses it within a minute." });
  };

  const toggle = async (row: KnowledgeRow) => {
    const { error } = await supabase.from("ai_knowledge").update({ is_active: !row.is_active }).eq("id", row.id);
    if (error) return setMessage({ kind: "err", text: error.message });
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_active: !r.is_active } : r)));
  };

  const remove = async (row: KnowledgeRow) => {
    if (!confirm(`Delete “${row.title}”?`)) return;
    const { error } = await supabase.from("ai_knowledge").delete().eq("id", row.id);
    if (error) return setMessage({ kind: "err", text: error.message });
    setRows((prev) => prev.filter((r) => r.id !== row.id));
  };

  const move = async (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    const renumbered = next.map((r, i) => ({ ...r, position: (i + 1) * 10 }));
    setRows(renumbered);
    const changed = [renumbered[index], renumbered[target]];
    const results = await Promise.all(
      changed.map((r) => supabase.from("ai_knowledge").update({ position: r.position }).eq("id", r.id)),
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) setMessage({ kind: "err", text: failed.error.message });
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-stone-500">
            Facts the assistant must know — policies, offers, financing, service areas, anything visitors ask about.
          </p>
          <button
            onClick={() => setDraft({ ...EMPTY })}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#00AC4E] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#019544] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add entry
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

        {draft && (
          <div className="mt-4 rounded-2xl border border-[#00AC4E]/40 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_200px]">
              <label className="flex flex-col gap-1.5">
                <span className={label}>Title</span>
                <input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="e.g. Financing options"
                  className={field}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={label}>Category</span>
                <input
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  list="knowledge-categories"
                  className={field}
                />
                <datalist id="knowledge-categories">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </label>
            </div>
            <label className="mt-3 flex flex-col gap-1.5">
              <span className={label}>What the assistant should know</span>
              <textarea
                value={draft.content}
                onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                rows={8}
                placeholder="Write it plainly, as you'd brief a new salesperson. Facts, numbers and policies work best."
                className={`${field} resize-y font-medium leading-relaxed`}
              />
              <span className="text-right text-[10px] font-bold text-stone-400">{draft.content.length}/12000</span>
            </label>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-stone-700">
                <input
                  type="checkbox"
                  checked={draft.is_active}
                  onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
                  className="h-4 w-4 accent-[#00AC4E]"
                />
                Active (the assistant uses it)
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setDraft(null)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" /> Cancel
                </button>
                <button
                  onClick={save}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#00AC4E] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#019544] disabled:opacity-50 cursor-pointer"
                >
                  {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          {rows.length === 0 ? (
            <div className="px-4 py-14 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-stone-300" />
              <p className="mt-3 text-sm font-semibold text-stone-400">No knowledge entries yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {rows.map((row, i) => (
                <li key={row.id} className={`px-4 py-3.5 ${row.is_active ? "" : "opacity-60"}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col">
                      <button onClick={() => move(i, -1)} disabled={i === 0} title="Move up" className="rounded p-0.5 text-stone-400 hover:text-stone-900 disabled:opacity-20 cursor-pointer">
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => move(i, 1)} disabled={i === rows.length - 1} title="Move down" className="rounded p-0.5 text-stone-400 hover:text-stone-900 disabled:opacity-20 cursor-pointer">
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-extrabold text-stone-900">{row.title}</span>
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-stone-500">
                          {row.category}
                        </span>
                        {!row.is_active && (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-700">Off</span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 whitespace-pre-line text-xs font-medium leading-relaxed text-stone-500">{row.content}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => toggle(row)}
                        title={row.is_active ? "Switch off" : "Switch on"}
                        className={`relative h-5 w-9 rounded-full transition-colors cursor-pointer ${row.is_active ? "bg-[#00AC4E]" : "bg-stone-300"}`}
                      >
                        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${row.is_active ? "left-[18px]" : "left-0.5"}`} />
                      </button>
                      <button
                        onClick={() => setDraft({ id: row.id, title: row.title, category: row.category, content: row.content, is_active: row.is_active })}
                        title="Edit"
                        className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900 cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => remove(row)} title="Delete" className="rounded-full p-2 text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-stone-500">
          <Sparkles className="h-3.5 w-3.5 text-[#00AC4E]" /> Already known from the website
        </span>
        <p className="mt-2 text-xs font-medium text-stone-500">
          Read automatically and always up to date — edit these on the website, not here.
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          {automatic.map((a) => (
            <li key={a.label}>
              <p className="text-xs font-extrabold text-stone-800">{a.label}</p>
              <p className="text-[11px] font-semibold text-stone-500">{a.detail}</p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
