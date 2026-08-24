import { createClient } from "@/lib/supabase/server";
import ContentClient from "./ContentClient";

export const dynamic = "force-dynamic";

export interface StoredSiteImage {
  id: string;
  page: "homepage" | "about";
  key: string;
  url: string;
  storage_path: string | null;
  alt: string | null;
}

export default async function AdminContentPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_images")
    .select("id, page, key, url, storage_path, alt");

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-2xl font-black tracking-tight text-stone-900">
        Homepage &amp; About
      </h1>
      <p className="mt-1 text-sm font-medium text-stone-500">
        Replace any image on the public Homepage or About page. Uploads take effect immediately.
      </p>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error.message}
          <span className="mt-1 block font-normal">
            Run <code className="rounded bg-red-100 px-1">0008_site_images.sql</code> and{" "}
            <code className="rounded bg-red-100 px-1">0009_seed_site_images.sql</code> if you have not yet.
          </span>
        </p>
      ) : (
        <ContentClient stored={(data ?? []) as StoredSiteImage[]} />
      )}
    </div>
  );
}
