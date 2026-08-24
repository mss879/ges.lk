import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";

/**
 * Cookie-less Supabase client for public, unauthenticated reads.
 *
 * Using the cookie-backed server client on a public page would call cookies()
 * and opt the route into per-request rendering. This client reads as `anon`,
 * so pages like /projects stay cacheable while RLS still limits what comes
 * back to published rows.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured()) return null;
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
