import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleCheck, ExternalLink, Mail, Phone, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/admin/result";
import type { ChatMessageRow, ChatSessionRow } from "@/lib/chat/types";
import EstimateCard from "@/components/chat/EstimateCard";
import DeleteConversationButton from "./DeleteConversationButton";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TIME = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Colombo",
});

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const [{ data: session, error }, { data: messages }] = await Promise.all([
    supabase.from("ai_chat_sessions").select("*").eq("id", id).maybeSingle(),
    supabase.from("ai_chat_messages").select("*").eq("session_id", id).order("created_at", { ascending: true }),
  ]);

  if (error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
        {friendlyError(error)}
      </p>
    );
  }
  if (!session) notFound();
  const s = session as ChatSessionRow;
  const rows = (messages ?? []) as ChatMessageRow[];

  let lead: { name: string; stage: string | null } | null = null;
  if (s.lead_id) {
    const { data } = await supabase
      .from("leads")
      .select("name, pipeline_stages(name)")
      .eq("id", s.lead_id)
      .maybeSingle();
    if (data) {
      const stage = (data as { pipeline_stages: { name: string } | { name: string }[] | null }).pipeline_stages;
      lead = {
        name: (data as { name: string }).name,
        stage: Array.isArray(stage) ? (stage[0]?.name ?? null) : (stage?.name ?? null),
      };
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/ai-agent" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900">
          <ArrowLeft className="h-3.5 w-3.5" /> All conversations
        </Link>
        <DeleteConversationButton id={s.id} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Transcript */}
        <div className="rounded-2xl border border-stone-200 bg-[#f8f9fa] p-4 shadow-sm sm:p-6">
          {rows.length === 0 ? (
            <p className="py-10 text-center text-sm font-semibold text-stone-400">No messages.</p>
          ) : (
            <ol className="flex flex-col gap-3">
              {rows.map((m) => (
                <li key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={m.role === "user" ? "max-w-[80%]" : "w-full max-w-[88%]"}>
                    <div
                      className={`whitespace-pre-wrap break-words px-3.5 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "rounded-2xl rounded-tr-md bg-[#00AC4E] text-white"
                          : "rounded-2xl rounded-tl-md bg-white text-stone-700 shadow-sm ring-1 ring-stone-200/70"
                      }`}
                    >
                      {m.content}
                    </div>
                    {m.meta?.estimate && <EstimateCard estimate={m.meta.estimate} compact />}
                    {m.meta?.leadCaptured && (
                      <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#00AC4E]/10 px-2.5 py-1 text-[11px] font-bold text-[#007a37]">
                        <CircleCheck className="h-3.5 w-3.5" /> Lead saved to the CRM
                      </p>
                    )}
                    <p className={`mt-1 text-[10px] font-semibold text-stone-400 ${m.role === "user" ? "text-right" : ""}`}>
                      {m.role === "user" ? "Visitor" : "Assistant"} · {TIME.format(new Date(m.created_at))}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Details */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">Visitor</span>
            {s.contact_name || s.contact_phone || s.contact_email ? (
              <ul className="mt-3 flex flex-col gap-2 text-sm font-semibold text-stone-700">
                {s.contact_name && (
                  <li className="flex items-center gap-2">
                    <User className="h-4 w-4 text-stone-400" /> {s.contact_name}
                  </li>
                )}
                {s.contact_phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-stone-400" />
                    <a href={`tel:${s.contact_phone.replace(/[^\d+]/g, "")}`} className="hover:text-[#00AC4E]">
                      {s.contact_phone}
                    </a>
                  </li>
                )}
                {s.contact_email && (
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-stone-400" />
                    <a href={`mailto:${s.contact_email}`} className="hover:text-[#00AC4E]">
                      {s.contact_email}
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="mt-2 text-sm font-semibold text-stone-400">Anonymous — no contact details shared.</p>
            )}
            <dl className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <dt className="font-bold uppercase tracking-widest text-stone-400">Started</dt>
                <dd className="font-semibold text-stone-700">{TIME.format(new Date(s.created_at))}</dd>
              </div>
              <div>
                <dt className="font-bold uppercase tracking-widest text-stone-400">Messages</dt>
                <dd className="font-semibold text-stone-700">{s.message_count}</dd>
              </div>
              {s.started_path && (
                <div className="col-span-2">
                  <dt className="font-bold uppercase tracking-widest text-stone-400">Started on</dt>
                  <dd className="font-semibold text-stone-700">
                    <a href={s.started_path} target="_blank" rel="noopener" className="inline-flex items-center gap-1 hover:text-[#00AC4E]">
                      {s.started_path} <ExternalLink className="h-3 w-3" />
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">CRM</span>
            {lead ? (
              <div className="mt-2">
                <p className="text-sm font-bold text-stone-900">{lead.name}</p>
                {lead.stage && <p className="text-xs font-semibold text-stone-500">Stage: {lead.stage}</p>}
                <Link
                  href="/admin/crm"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#00AC4E] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-[#019544]"
                >
                  Open in CRM
                </Link>
              </div>
            ) : (
              <p className="mt-2 text-sm font-semibold text-stone-400">No lead captured in this conversation.</p>
            )}
          </div>

          {s.estimate && (
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">Latest estimate</span>
              <EstimateCard estimate={s.estimate} />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
