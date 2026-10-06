"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, MessagesSquare, Search, Trash2, UserCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ConversationRow } from "./page";

type Filter = "all" | "lead" | "today";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "lead", label: "With lead" },
  { key: "today", label: "Today" },
];

const TIME = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Colombo",
});

function isToday(iso: string | null) {
  if (!iso) return false;
  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { timeZone: "Asia/Colombo" });
  return fmt(new Date(iso)) === fmt(new Date());
}

export default function ConversationsClient({ initial }: { initial: ConversationRow[] }) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "lead" && !r.lead_id) return false;
      if (filter === "today" && !isToday(r.last_message_at ?? r.created_at)) return false;
      if (!q) return true;
      return [r.first_message, r.contact_name, r.contact_phone, r.started_path].some((v) => v?.toLowerCase().includes(q));
    });
  }, [rows, filter, query]);

  const remove = async (row: ConversationRow) => {
    if (!confirm("Delete this conversation and its transcript? Any CRM lead it created is kept.")) return;
    const { error } = await createClient().from("ai_chat_sessions").delete().eq("id", row.id);
    if (error) {
      setMessage({ kind: "err", text: error.message });
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setMessage({ kind: "ok", text: "Conversation deleted." });
  };

  const counts = {
    all: rows.length,
    lead: rows.filter((r) => r.lead_id).length,
    today: rows.filter((r) => isToday(r.last_message_at ?? r.created_at)).length,
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              filter === f.key ? "bg-[#00AC4E] text-white" : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            {f.label}
            <span className="ml-1.5 opacity-70">{counts[f.key]}</span>
          </button>
        ))}
        <div className="relative ml-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages, names, phones"
            aria-label="Search conversations"
            className="w-64 rounded-full border border-stone-200 bg-white py-1.5 pl-8 pr-3 text-xs font-semibold placeholder-stone-400 focus:border-[#00AC4E] focus:outline-none focus:ring-1 focus:ring-[#00AC4E]"
          />
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

      <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        {visible.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <MessagesSquare className="mx-auto h-8 w-8 text-stone-300" />
            <p className="mt-3 text-sm font-semibold text-stone-400">
              {rows.length === 0 ? "No conversations yet. They appear here as visitors chat on the website." : "No conversations match."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {visible.map((row) => (
              <li key={row.id} className="group flex items-center gap-3 px-4 py-3 hover:bg-stone-50/60">
                <Link href={`/admin/ai-agent/conversations/${row.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      row.lead_id ? "bg-[#00AC4E]/10 text-[#00AC4E]" : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    {row.lead_id ? <UserCheck className="h-4 w-4" /> : <MessagesSquare className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-bold text-stone-900">
                        {row.contact_name || row.first_message || "New conversation"}
                      </span>
                      {row.lead_id && (
                        <span className="shrink-0 rounded-full bg-[#00AC4E]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#007a37]">
                          Lead
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] font-semibold text-stone-400">
                      {row.contact_name && row.first_message && <span className="truncate max-w-[20rem]">“{row.first_message}”</span>}
                      {row.contact_phone && <span>{row.contact_phone}</span>}
                      <span>{row.message_count} messages</span>
                      {row.estimate && <span>· ~{row.estimate.systemKwp} kWp estimate</span>}
                      {row.started_path && <span>· from {row.started_path}</span>}
                    </span>
                  </span>
                  <span className="hidden shrink-0 text-[11px] font-bold text-stone-400 sm:block">
                    {TIME.format(new Date(row.last_message_at ?? row.created_at))}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-stone-300" />
                </Link>
                <button
                  onClick={() => remove(row)}
                  title="Delete conversation"
                  className="rounded-full p-2 text-stone-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
