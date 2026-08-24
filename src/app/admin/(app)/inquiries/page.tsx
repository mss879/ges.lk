import { createClient } from "@/lib/supabase/server";
import type { Inquiry } from "@/lib/supabase/types";
import InquiriesClient from "./InquiriesClient";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-black tracking-tight text-stone-900">Inquiries</h1>
      <p className="mt-1 text-sm font-medium text-stone-500">
        Submissions from the website contact form. Select any and move them into the CRM.
      </p>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error.message}
        </p>
      ) : (
        <InquiriesClient initial={(data ?? []) as Inquiry[]} />
      )}
    </div>
  );
}
