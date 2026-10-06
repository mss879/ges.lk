import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";

/** Cache tags for the public content admins edit. Admin saves expire them (src/app/admin/actions.ts). */
export const BLOG_TAG = "blog";
export const PROJECTS_TAG = "projects";
export const SITE_IMAGES_TAG = "site-images";

export type PublicCacheTag = typeof BLOG_TAG | typeof PROJECTS_TAG | typeof SITE_IMAGES_TAG;

/**
 * Cookie-less Supabase client for public, unauthenticated reads.
 *
 * Using the cookie-backed server client on a public page would call cookies()
 * and opt the route into per-request rendering. This client reads as `anon`,
 * so pages like /projects stay static while RLS still limits what comes back
 * to published rows.
 *
 * Its requests are cached under `tag` for an hour and expired on demand when an
 * admin saves, so edits reach the live site without a rebuild.
 */
export function createPublicClient(tag: PublicCacheTag) {
  if (!isSupabaseConfigured()) return null;
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, cache: "force-cache", next: { tags: [tag], revalidate: 3600 } }),
    },
  });
}
