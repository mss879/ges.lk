/**
 * Display helpers shared by server pages and client components.
 *
 * Dates are formatted in Sri Lanka time on both sides, so the server-rendered
 * HTML and the hydrated client always agree.
 */

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "Asia/Colombo",
});

/** "2026-06-09T00:00:00Z" → "June 9, 2026". */
export function formatPostDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : DATE_FORMAT.format(date);
}

/** "8 min read" */
export function formatReadTime(minutes: number | null | undefined): string {
  return `${Math.max(1, minutes ?? 1)} min read`;
}

/** "Green Engineering Systems" → "GE" for the author avatar. */
export function initials(name: string | null | undefined): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "GES";
  return words
    .slice(0, 3)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}
