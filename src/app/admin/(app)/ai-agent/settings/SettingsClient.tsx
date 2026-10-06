"use client";

import { useState } from "react";
import { Check, Loader2, TriangleAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AgentSettingsRow } from "@/lib/chat/types";

const field =
  "w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm font-semibold placeholder-stone-400 focus:border-[#00AC4E] focus:outline-none focus:ring-1 focus:ring-[#00AC4E]";
const labelCls = "text-[11px] font-bold uppercase tracking-widest text-stone-500";
const card = "rounded-2xl border border-stone-200 bg-white p-5 shadow-sm";

export default function SettingsClient({ initial, configured }: { initial: AgentSettingsRow; configured: boolean }) {
  const [enabled, setEnabled] = useState(initial.is_enabled);
  const [name, setName] = useState(initial.agent_name);
  const [greeting, setGreeting] = useState(initial.greeting);
  const [suggestions, setSuggestions] = useState<string[]>(() => {
    const list = [...(initial.suggested_questions ?? [])];
    while (list.length < 4) list.push("");
    return list.slice(0, 4);
  });
  const [instructions, setInstructions] = useState(initial.instructions ?? "");
  const [cap, setCap] = useState(String(initial.daily_message_cap ?? 1500));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const save = async () => {
    const dailyCap = Number(cap);
    if (!name.trim()) return setMessage({ kind: "err", text: "Give the assistant a name." });
    if (!(dailyCap >= 10 && dailyCap <= 100000)) return setMessage({ kind: "err", text: "The daily limit must be between 10 and 100,000 messages." });
    setSaving(true);
    setMessage(null);
    const { error } = await createClient()
      .from("ai_agent_settings")
      .upsert(
        {
          id: 1,
          is_enabled: enabled,
          agent_name: name.trim().slice(0, 60),
          greeting: greeting.trim().slice(0, 600),
          suggested_questions: suggestions.map((q) => q.trim()).filter(Boolean),
          instructions: instructions.trim().slice(0, 8000),
          daily_message_cap: Math.round(dailyCap),
        },
        { onConflict: "id" },
      );
    setSaving(false);
    if (error) return setMessage({ kind: "err", text: error.message });
    setMessage({ kind: "ok", text: "Saved. The website picks up changes within about a minute." });
  };

  return (
    <div className="flex max-w-3xl flex-col gap-5">
      {!configured && (
        <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          The chat is switched off on this server until OPENAI_API_KEY and SUPABASE_SERVICE_ROLE_KEY are set in the
          hosting environment variables (Netlify → Site configuration → Environment variables).
        </p>
      )}

      <div className={card}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-base font-black text-stone-900">Chat widget on the website</h2>
            <p className="mt-1 text-xs font-medium text-stone-500">
              When off, the chat button disappears from the site (within a minute). Saved conversations stay here.
            </p>
          </div>
          <button
            onClick={() => setEnabled((v) => !v)}
            role="switch"
            aria-checked={enabled}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors cursor-pointer ${enabled ? "bg-[#00AC4E]" : "bg-stone-300"}`}
          >
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${enabled ? "left-6" : "left-1"}`} />
          </button>
        </div>
      </div>

      <div className={card}>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Assistant name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} className={field} />
        </label>
        <label className="mt-4 flex flex-col gap-1.5">
          <span className={labelCls}>Welcome message</span>
          <textarea value={greeting} onChange={(e) => setGreeting(e.target.value)} rows={3} maxLength={600} className={`${field} resize-y`} />
          <span className="text-[11px] font-semibold text-stone-400">The first thing visitors see when they open the chat.</span>
        </label>
        <div className="mt-4">
          <span className={labelCls}>Suggested questions</span>
          <p className="mt-1 text-[11px] font-semibold text-stone-400">Shown as one-tap buttons before the visitor types anything. Leave a box empty to hide it.</p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {suggestions.map((q, i) => (
              <input
                key={i}
                value={q}
                maxLength={90}
                onChange={(e) => setSuggestions((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder={`Suggestion ${i + 1}`}
                className={field}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={card}>
        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>Extra instructions</span>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={6}
            maxLength={8000}
            placeholder="Tone, offers to mention, things never to say…"
            className={`${field} resize-y font-medium leading-relaxed`}
          />
          <span className="text-[11px] font-semibold text-stone-400">
            How the assistant should behave. Put facts (prices, policies, offers) in Knowledge instead.
          </span>
        </label>
        <label className="mt-4 flex max-w-xs flex-col gap-1.5">
          <span className={labelCls}>Daily message limit</span>
          <input type="number" value={cap} onChange={(e) => setCap(e.target.value)} className={field} />
          <span className="text-[11px] font-semibold text-stone-400">
            A safety cap on visitor messages per day (Sri Lanka time), to bound AI costs.
          </span>
        </label>
      </div>

      {message && (
        <p
          className={`rounded-xl px-4 py-2.5 text-xs font-semibold ${
            message.kind === "ok"
              ? "border border-[#00AC4E]/20 bg-[#00AC4E]/10 text-[#007a37]"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}

      <div>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-[#00AC4E] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#019544] disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Save settings
        </button>
      </div>
    </div>
  );
}
