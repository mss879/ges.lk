"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/supabase/server";
import { PROJECTS_TAG, SITE_IMAGES_TAG, type PublicCacheTag } from "@/lib/supabase/public";

/**
 * Pushes an admin edit to the live site.
 *
 * Public pages are static and cache their Supabase reads for up to an hour, so
 * after the existing admin screens write through the browser client they call
 * this to expire the matching cache tag and pages immediately. It only accepts
 * known kinds — never arbitrary paths.
 */
const TARGETS: Record<"projects" | "site-images", { tag: PublicCacheTag; paths: string[] }> = {
  projects: { tag: PROJECTS_TAG, paths: ["/projects"] },
  "site-images": { tag: SITE_IMAGES_TAG, paths: ["/", "/about"] },
};

export async function refreshPublic(kind: "projects" | "site-images"): Promise<{ ok: boolean }> {
  await requireAdmin();
  const target = TARGETS[kind];
  if (!target) return { ok: false };
  updateTag(target.tag);
  for (const path of target.paths) revalidatePath(path);
  return { ok: true };
}
