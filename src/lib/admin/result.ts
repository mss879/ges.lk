/** Result shape every admin Server Action returns, so forms can show a message instead of crashing. */
export type ActionResult<T = undefined> = { ok: true; data?: T; message?: string } | { ok: false; error: string };

/** Turns a Supabase / Postgres error into a sentence an admin can act on. */
export function friendlyError(
  error: { code?: string; message: string } | null | undefined,
  fallback = "Something went wrong. Please try again.",
) {
  if (!error) return fallback;
  if (error.code === "42P01" || /relation .* does not exist|schema cache/i.test(error.message)) {
    return "The database isn't set up for this yet. Run the latest files in supabase/migrations.";
  }
  if (error.code === "23505") return "That already exists. Use a different value.";
  if (error.code === "23514") return "One of the values isn't allowed. Check the fields and try again.";
  if (error.code === "42501") return "You don't have permission to do that.";
  return error.message || fallback;
}
