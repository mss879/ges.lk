"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightLeft, Loader2, Mail, Phone, Trash2, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Inquiry, InquiryStatus } from "@/lib/supabase/types";

const STATUS_STYLES: Record<InquiryStatus, string> = {
  new: "bg-[#00AC4E]/10 text-[#00AC4E]",
  read: "bg-stone-100 text-stone-600",
  converted: "bg-blue-50 text-blue-600",
  archived: "bg-stone-100 text-stone-400",
};

const FILTERS: { key: "all" | InquiryStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "read", label: "Read" },
  { key: "converted", label: "Converted" },
  { key: "archived", label: "Archived" },
];

export default function InquiriesClient({ initial }: { initial: Inquiry[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | InquiryStatus>("all");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter]
  );

  // Already-converted inquiries have a lead; converting again would be a no-op.
  const convertible = useMemo(
    () => [...selected].filter((id) => rows.find((r) => r.id === id)?.lead_id === null),
    [selected, rows]
  );

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === visible.length ? new Set() : new Set(visible.map((r) => r.id))
    );

  const moveToCrm = async () => {
    if (convertible.length === 0) return;
    setBusy(true);
    setMessage(null);
    const supabase = createClient();

    const results = await Promise.all(
      convertible.map((id) => supabase.rpc("convert_inquiry_to_lead", { p_inquiry_id: id }))
    );
    const failed = results.filter((r) => r.error);

    if (failed.length > 0) {
      setMessage({ kind: "err", text: failed[0].error?.message ?? "Could not move some inquiries." });
    } else {
      setRows((prev) =>
        prev.map((r) => (convertible.includes(r.id) ? { ...r, status: "converted" as InquiryStatus } : r))
      );
      setSelected(new Set());
      setMessage({
        kind: "ok",
        text: `Moved ${convertible.length} ${convertible.length === 1 ? "inquiry" : "inquiries"} into the CRM.`,
      });
      router.refresh();
    }
    setBusy(false);
  };

  const setStatus = async (id: string, status: InquiryStatus) => {
    const supabase = createClient();
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) {
      setMessage({ kind: "err", text: error.message });
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry permanently?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) {
      setMessage({ kind: "err", text: error.message });
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <div className="mt-6">
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                filter === f.key
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              {f.label}
              {f.key !== "all" && (
                <span className="ml-1.5 opacity-60">{rows.filter((r) => r.status === f.key).length}</span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={moveToCrm}
          disabled={busy || convertible.length === 0}
          className="inline-flex items-center gap-2 rounded-full bg-[#00AC4E] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#019544] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRightLeft className="h-3.5 w-3.5" />}
          Move to CRM
          {convertible.length > 0 && <span className="opacity-80">({convertible.length})</span>}
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

      {/* list */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-stone-100 px-4 py-2.5">
          <input
            type="checkbox"
            aria-label="Select all"
            checked={visible.length > 0 && selected.size === visible.length}
            onChange={toggleAll}
            className="h-4 w-4 cursor-pointer accent-[#00AC4E]"
          />
          <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
            {selected.size > 0 ? `${selected.size} selected` : `${visible.length} inquiries`}
          </span>
        </div>

        {visible.length === 0 && (
          <p className="px-4 py-10 text-center text-sm font-semibold text-stone-400">
            Nothing here yet.
          </p>
        )}

        <ul className="divide-y divide-stone-100">
          {visible.map((q) => {
            const open = expanded === q.id;
            return (
              <li key={q.id}>
                <div className="flex items-start gap-3 px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label={`Select ${q.name}`}
                    checked={selected.has(q.id)}
                    onChange={() => toggle(q.id)}
                    className="mt-1 h-4 w-4 cursor-pointer accent-[#00AC4E]"
                  />

                  <button
                    onClick={() => setExpanded(open ? null : q.id)}
                    className="flex min-w-0 flex-1 items-start justify-between gap-3 text-left cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-stone-900">{q.name}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${STATUS_STYLES[q.status]}`}
                        >
                          {q.status}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs font-semibold text-stone-500">
                        {q.subject || "No subject"} · {new Date(q.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronDown
                      className={`mt-1 h-4 w-4 shrink-0 text-stone-300 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {open && (
                  <div className="border-t border-stone-100 bg-stone-50/60 px-4 py-4 pl-11">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">{q.message}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <a
                        href={`mailto:${q.email}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#00AC4E]"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {q.email}
                      </a>
                      {q.phone && (
                        <a
                          href={`tel:${q.phone}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#00AC4E]"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          {q.phone}
                        </a>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {(["new", "read", "archived"] as InquiryStatus[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatus(q.id, s)}
                          disabled={q.status === s}
                          className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-bold capitalize text-stone-600 transition-colors hover:bg-stone-100 disabled:opacity-40 cursor-pointer"
                        >
                          Mark {s}
                        </button>
                      ))}
                      <button
                        onClick={() => remove(q.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1.5 text-[11px] font-bold text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
