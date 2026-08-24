import { createPublicClient } from "@/lib/supabase/public";
import { defaultImageMap, type SiteImageMap, type SitePage } from "@/data/siteImageSlots";

/**
 * Resolves the editable image slots for a page.
 *
 * Always returns a complete map: it starts from the shipped defaults and
 * overlays whatever the CMS has stored. A missing table, missing row or an
 * unconfigured backend degrades to the defaults rather than a broken page.
 */
export async function getSiteImages(page: SitePage): Promise<SiteImageMap> {
  const defaults = defaultImageMap(page);
  const supabase = createPublicClient();
  if (!supabase) return defaults;

  try {
    const { data, error } = await supabase
      .from("site_images")
      .select("key, url")
      .eq("page", page);

    if (error || !data) return defaults;

    const resolved = { ...defaults };
    for (const row of data as { key: string; url: string }[]) {
      // Ignore keys the code no longer knows about, and blank URLs.
      if (row.key in resolved && row.url) resolved[row.key] = row.url;
    }
    return resolved;
  } catch {
    return defaults;
  }
}
