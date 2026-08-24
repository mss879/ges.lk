import { createClient } from "@/lib/supabase/server";
import type { Lead, Pipeline, PipelineStage } from "@/lib/supabase/types";
import CrmBoard from "./CrmBoard";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const supabase = await createClient();

  const [{ data: pipelines, error: pErr }, { data: stages }, { data: leads }] = await Promise.all([
    supabase.from("pipelines").select("*").order("position"),
    supabase.from("pipeline_stages").select("*").order("position"),
    supabase.from("leads").select("*").order("position"),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-black tracking-tight text-stone-900">CRM</h1>
      <p className="mt-1 text-sm font-medium text-stone-500">
        Drag leads between stages. Pipelines and stages are editable — the default pipeline and its
        &ldquo;New Leads&rdquo; stage are kept because converted inquiries land there.
      </p>

      {pErr ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {pErr.message}
        </p>
      ) : (
        <CrmBoard
          initialPipelines={(pipelines ?? []) as Pipeline[]}
          initialStages={(stages ?? []) as PipelineStage[]}
          initialLeads={(leads ?? []) as Lead[]}
        />
      )}
    </div>
  );
}
