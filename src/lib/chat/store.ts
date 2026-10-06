import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { EstimateResult } from "@/lib/solar/types";
import { HISTORY_LIMIT } from "./config";
import type { ChatMessageMeta, ChatMessageRow, ChatRole, ChatSessionRow, ChatTurn } from "./types";

/**
 * Every read and write of a chat conversation (ported from the Makro build).
 *
 * All of it runs on the SERVICE-ROLE client, because anon has no privileges on
 * these tables at all — see the security model at the top of
 * supabase/migrations/0012_ai_agent.sql. That places the entire burden of
 * authorisation on this module, so there is exactly one rule and it is not
 * optional:
 *
 *   Every function that acts on a visitor's behalf takes BOTH the session id
 *   and the token, and scopes its query with both. The id is public — it is in
 *   the admin URL. The token is the secret.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (value: unknown): value is string => typeof value === "string" && UUID.test(value);

function db() {
  const supabase = createAdminClient();
  if (!supabase) throw new Error("Chat requires SUPABASE_SERVICE_ROLE_KEY.");
  return supabase;
}

/** Creates a conversation and returns it with its freshly minted token. */
export async function createSession(input: {
  visitorHash: string | null;
  ipHash: string | null;
  startedPath: string | null;
  userAgent: string | null;
}): Promise<ChatSessionRow> {
  const { data, error } = await db()
    .from("ai_chat_sessions")
    .insert({
      visitor_hash: input.visitorHash,
      ip_hash: input.ipHash,
      started_path: input.startedPath,
      user_agent: input.userAgent,
    })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Could not start the conversation.");
  return data as ChatSessionRow;
}

/**
 * Loads a session for a visitor. Returns null when the id is unknown OR the
 * token does not match — deliberately the same answer for both, so probing ids
 * tells an attacker nothing.
 */
export async function getSessionForVisitor(sessionId: unknown, token: unknown): Promise<ChatSessionRow | null> {
  if (!isUuid(sessionId) || !isUuid(token)) return null;
  const { data } = await db()
    .from("ai_chat_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("token", token)
    .maybeSingle();
  return (data as ChatSessionRow | null) ?? null;
}

/** Saves a transcript line. A database trigger keeps the session's counters in step. */
export async function appendMessage(
  sessionId: string,
  role: ChatRole,
  content: string,
  meta: ChatMessageMeta | null = null,
): Promise<ChatMessageRow> {
  const { data, error } = await db()
    .from("ai_chat_messages")
    .insert({ session_id: sessionId, role, content: content.slice(0, 8000), meta })
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Could not save the message.");
  return data as ChatMessageRow;
}

/** The last `limit` turns, oldest first — what the model sees. */
export async function getHistory(sessionId: string, limit = HISTORY_LIMIT): Promise<ChatMessageRow[]> {
  // Newest-first with a limit, then reversed: taking the LAST n rows is the point.
  const { data } = await db()
    .from("ai_chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return ((data ?? []) as ChatMessageRow[]).slice().reverse();
}

/** The visitor-facing transcript (for restoring the widget after a reload). */
export function toTurn(row: ChatMessageRow): ChatTurn {
  return {
    role: row.role,
    content: row.content,
    created_at: row.created_at,
    ...(row.meta?.estimate ? { estimate: row.meta.estimate } : {}),
    ...(row.meta?.leadCaptured ? { leadSaved: true } : {}),
  };
}

export async function getTranscriptForVisitor(sessionId: unknown, token: unknown): Promise<ChatTurn[] | null> {
  const session = await getSessionForVisitor(sessionId, token);
  if (!session) return null;
  const { data } = await db()
    .from("ai_chat_messages")
    .select("*")
    .eq("session_id", session.id)
    .order("created_at", { ascending: true })
    .limit(200);
  return ((data ?? []) as ChatMessageRow[]).map(toTurn);
}

/** Remembers the latest estimate on the conversation, for the admin view and the CRM notes. */
export async function saveEstimate(sessionId: string, estimate: EstimateResult) {
  await db().from("ai_chat_sessions").update({ estimate }).eq("id", sessionId);
}

export interface CapturedLead {
  name: string;
  phone: string;
  email?: string | null;
  subject?: string | null;
  notes?: string | null;
}

export type CaptureResult =
  | { ok: true; leadId: string; duplicate: boolean }
  | { ok: false; reason: string };

/**
 * Turns a captured contact into a CRM lead through create_ai_lead(), which
 * locks the conversation (no duplicate leads from racing messages) and places
 * the lead at the end of the default pipeline's first stage, marked
 * source = 'ai_agent'.
 */
export async function captureLead(sessionId: string, lead: CapturedLead): Promise<CaptureResult> {
  const { data, error } = await db().rpc("create_ai_lead", {
    p_session_id: sessionId,
    p_name: lead.name,
    p_phone: lead.phone,
    p_email: lead.email ?? null,
    p_subject: lead.subject ?? null,
    p_notes: lead.notes ?? null,
  });
  if (error) return { ok: false, reason: error.message };
  const row = (Array.isArray(data) ? data[0] : data) as { lead_id: string; duplicate: boolean } | undefined;
  if (!row?.lead_id) return { ok: false, reason: "The lead could not be created." };
  return { ok: true, leadId: row.lead_id, duplicate: Boolean(row.duplicate) };
}
