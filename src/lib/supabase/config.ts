/**
 * Supabase environment configuration.
 *
 * These are read in one place so the rest of the app can ask
 * `isSupabaseConfigured()` instead of poking at process.env. The public site
 * uses that to fall back to its bundled content when the backend has not been
 * connected yet, rather than erroring.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}

/** Throws with an actionable message — use at points that genuinely require the backend. */
export function requireSupabaseEnv(): { url: string; anonKey: string } {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see .env.local.example)."
    );
  }
  return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
}

/** Storage bucket created by migration 0005. */
export const PROJECT_IMAGES_BUCKET = "project-images";

/** Matches the 7-image cap enforced by the trigger in migration 0004. */
export const MAX_PROJECT_IMAGES = 7;
