import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/admin/result";
import type { ChatSessionRow } from "@/lib/chat/types";
import ConversationsClient from "./ConversationsClient";

export const dynamic = "force-dynamic";

export type ConversationRow = Pick<
  ChatSessionRow,
  | "id"
  | "first_message"
  | "message_count"
  | "last_message_at"
  | "created_at"
  | "started_path"
  | "lead_id"
  | "contact_name"
  | "contact_phone"
  | "estimate"
>;

export default async function ConversationsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_chat_sessions")
    .select("id, first_message, message_count, last_message_at, created_at, started_path, lead_id, contact_name, contact_phone, estimate")
    .gt("message_count", 0)
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(300);

  if (error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
        {friendlyError(error)}
      </p>
    );
  }

  return <ConversationsClient initial={(data ?? []) as ConversationRow[]} />;
}
