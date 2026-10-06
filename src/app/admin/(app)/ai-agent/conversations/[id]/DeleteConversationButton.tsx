"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DeleteConversationButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    if (!confirm("Delete this conversation and its transcript? Any CRM lead it created is kept.")) return;
    setBusy(true);
    const { error } = await createClient().from("ai_chat_sessions").delete().eq("id", id);
    setBusy(false);
    if (error) {
      alert(error.message);
      return;
    }
    router.push("/admin/ai-agent");
    router.refresh();
  };

  return (
    <button
      onClick={remove}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 cursor-pointer"
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      Delete conversation
    </button>
  );
}
