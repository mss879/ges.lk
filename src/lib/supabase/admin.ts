import "server-only";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

/**
 * Service-role Supabase client — bypasses row level security.
 *
 * Used ONLY by the AI chat route (src/app/api/chat), whose tables have no anon
 * access at all. Everything it does for a visitor is scoped by that visitor's
 * (session id, token) pair in src/lib/chat/store.ts.
 *
 * The key is read here and nowhere else, never with a NEXT_PUBLIC_ prefix, and
 * `server-only` makes importing this from client code a build error.
 */
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function isServiceRoleConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SERVICE_ROLE_KEY.length > 0;
}

let cached: SupabaseClient | null = null;

export function createAdminClient(): SupabaseClient | null {
  if (!isServiceRoleConfigured()) return null;
  cached ??= createSupabaseClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    // Always fresh: chat data must never come from Next's fetch cache.
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
  return cached;
}
