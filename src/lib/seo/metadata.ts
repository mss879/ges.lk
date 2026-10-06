import type { Metadata } from "next";

/** Open Graph fields every page shares. Pages that set `openGraph` must spread this — Next replaces, not merges, that object. */
export const OG_BASE = {
  siteName: "GES — Green Engineering Systems",
  locale: "en_LK",
} as const;

/**
 * Standard metadata for a public page: title (the root layout appends
 * "| GES Sri Lanka"), description and canonical URL.
 *
 * Deliberately no `openGraph` here: the root layout's OG defaults and the
 * nearest opengraph-image file then apply, and Next copies the title and
 * description into the og:/twitter: tags automatically.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
  };
}
