import { cache } from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { requireSupabaseEnv } from "./config";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 *
 * Note: `cookies()` is async in Next 16, hence the await.
 */
export async function createClient() {
  const { url, anonKey } = requireSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot set cookies. Safe to ignore: proxy.ts
          // refreshes the session on every request, so the tokens stay current.
        }
      },
    },
  });
}

/** The signed-in user, or null. Never throws when the backend is unconfigured. */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}

/**
 * True when the signed-in user is listed in public.admin_users.
 * Mirrors the is_admin() check that guards every RLS policy.
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const { data, error } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", userData.user.id)
      .maybeSingle();

    return !error && data !== null;
  } catch {
    return false;
  }
}

/**
 * Guard for Server Actions and Route Handlers that act as an admin.
 *
 * Server Actions are plain POST endpoints anyone can call, so each one must
 * re-check access itself (the proxy only bounces anonymous page views).
 * Returns a Supabase client acting as the signed-in admin — its writes still
 * go through RLS — or throws. Memoised for the length of a request.
 */
export const requireAdmin = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You are signed out. Sign in again and retry.");

  const { data, error } = await supabase.from("admin_users").select("id").eq("id", user.id).maybeSingle();
  if (error || !data) throw new Error("This account doesn't have admin access.");

  return { supabase, user };
});
