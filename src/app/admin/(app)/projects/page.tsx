import { createClient } from "@/lib/supabase/server";
import type { ProjectWithImages } from "@/lib/supabase/types";
import ProjectsAdmin from "./ProjectsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .order("position")
    .order("position", { referencedTable: "project_images" });

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-black tracking-tight text-stone-900">Projects</h1>
      <p className="mt-1 text-sm font-medium text-stone-500">
        Everything shown on the public Projects page. Tag each one residential or commercial and upload up
        to seven photographs.
      </p>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error.message}
        </p>
      ) : (
        <ProjectsAdmin initial={(data ?? []) as ProjectWithImages[]} />
      )}
    </div>
  );
}
