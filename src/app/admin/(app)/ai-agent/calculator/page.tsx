import { createClient } from "@/lib/supabase/server";
import { friendlyError } from "@/lib/admin/result";
import type { AgentSettingsRow } from "@/lib/chat/types";
import { DEFAULT_AGENT_SETTINGS } from "@/lib/solar/settings";
import CalculatorClient from "./CalculatorClient";

export const dynamic = "force-dynamic";

export default async function CalculatorPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("ai_agent_settings").select("*").eq("id", 1).maybeSingle();

  if (error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
        {friendlyError(error)}
      </p>
    );
  }

  return <CalculatorClient initial={{ ...DEFAULT_AGENT_SETTINGS, ...((data as Partial<AgentSettingsRow> | null) ?? {}) }} />;
}
