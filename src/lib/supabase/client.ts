"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseEnv } from "./config";

/** Supabase client for use inside Client Components. */
export function createClient() {
  const { url, anonKey } = requireSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
