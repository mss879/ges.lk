import "server-only";

import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  MAX_MESSAGES_PER_SESSION,
  MAX_SESSIONS_PER_IP_PER_HOUR,
  MIN_SECONDS_BETWEEN_MESSAGES,
} from "./config";
import type { ChatSessionRow } from "./types";

/**
 * Abuse limits, kept in the database rather than in memory: Netlify runs many
 * function instances, so an in-process counter would only ever see a slice of
 * the traffic. Every check is one indexed count.
 */

/** The visitor's IP as Netlify (or any proxy) reports it. */
export function clientIp(headers: Headers): string {
  return (
    headers.get("x-nf-client-connection-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Salted, day-rotating hashes: enough to rate-limit and group, never the raw IP. */
export function visitorHashes(headers: Headers) {
  const ip = clientIp(headers);
  const ua = headers.get("user-agent") ?? "";
  const salt = process.env.CHAT_HASH_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || "ges-chat";
  const day = new Date().toISOString().slice(0, 10);
  const hash = (v: string) => createHash("sha256").update(v).digest("hex").slice(0, 32);
  return { ipHash: hash(`${ip}|${salt}|${day}`), visitorHash: hash(`${ip}|${ua}|${salt}|${day}`) };
}

/** True when this IP has already opened too many conversations in the last hour. */
export async function tooManyNewSessions(ipHash: string): Promise<boolean> {
  const supabase = createAdminClient();
  if (!supabase) return false;
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("ai_chat_sessions")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  return (count ?? 0) >= MAX_SESSIONS_PER_IP_PER_HOUR;
}

/** A friendly reason when this conversation is going too fast or has run long. */
export function sessionLimitReason(session: ChatSessionRow): string | null {
  if (session.message_count >= MAX_MESSAGES_PER_SESSION) {
    return "This conversation has reached its limit. Please call 076 533 2332 or use the contact form and the team will help you directly.";
  }
  if (session.last_message_at) {
    const elapsed = (Date.now() - new Date(session.last_message_at).getTime()) / 1000;
    if (elapsed < MIN_SECONDS_BETWEEN_MESSAGES) return "You're sending messages very quickly — give it a moment.";
  }
  return null;
}

/** True once today's (Sri Lanka time) visitor messages reach the client's daily cap. */
export async function dailyCapReached(cap: number): Promise<boolean> {
  const supabase = createAdminClient();
  if (!supabase) return false;
  // Midnight in Asia/Colombo (UTC+5:30), expressed in UTC.
  const now = new Date();
  const colombo = new Date(now.getTime() + 330 * 60 * 1000);
  const midnight = new Date(Date.UTC(colombo.getUTCFullYear(), colombo.getUTCMonth(), colombo.getUTCDate()) - 330 * 60 * 1000);
  const { count } = await supabase
    .from("ai_chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("role", "user")
    .gte("created_at", midnight.toISOString());
  return (count ?? 0) >= cap;
}
