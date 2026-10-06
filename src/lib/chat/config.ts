import "server-only";
import { isServiceRoleConfigured } from "@/lib/supabase/admin";

/**
 * Chat agent configuration, and the single source of truth for whether the
 * widget runs at all.
 */

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";

/**
 * `stub` swaps the language model for a deterministic scripted one, so the
 * whole pipeline — session, persistence, the estimate tool, the CRM write — can
 * be tested end to end without an API key. Never set this in production.
 */
export const CHAT_PROVIDER = process.env.CHAT_PROVIDER === "stub" ? "stub" : "openai";

export const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

/**
 * The chat needs BOTH a model and the service-role key. anon has no access to
 * the chat tables (see supabase/migrations/0012_ai_agent.sql), so without the
 * service-role key there is no less-private fallback: the chat switches off.
 */
export const isChatConfigured = isServiceRoleConfigured() && (CHAT_PROVIDER === "stub" || Boolean(OPENAI_API_KEY));

/** How many past messages are replayed to the model. Keeps prompts bounded. */
export const HISTORY_LIMIT = 24;

/** Hard ceiling on a single visitor message, mirrored by the DB CHECK (8000). */
export const MAX_MESSAGE_LENGTH = 2000;

/** Per-conversation limits. */
export const MAX_MESSAGES_PER_SESSION = 80;
export const MIN_SECONDS_BETWEEN_MESSAGES = 1.5;

/** New conversations allowed per visitor IP per hour. */
export const MAX_SESSIONS_PER_IP_PER_HOUR = 8;

/** Netlify's synchronous functions stop at 30s; give the model 25. */
export const MODEL_TIMEOUT_MS = 25_000;
