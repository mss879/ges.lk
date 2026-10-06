import type { EstimateResult, TariffBlock } from "@/lib/solar/types";

/** Shared by the chat API, the widget and the admin screens (no server-only imports). */

export type ChatRole = "user" | "assistant";

export interface ChatTurn {
  role: ChatRole;
  content: string;
  created_at?: string;
  /** A solar estimate the agent produced on this turn, rendered as a card. */
  estimate?: EstimateResult | null;
  /** True when this turn saved the visitor's details to the CRM. */
  leadSaved?: boolean;
}

export interface ChatMessageMeta {
  estimate?: EstimateResult;
  leadCaptured?: boolean;
  leadId?: string;
  duplicateLead?: boolean;
}

/** What the widget needs to render before the first message. */
export interface ChatPublicConfig {
  enabled: boolean;
  agentName: string;
  greeting: string;
  suggestions: string[];
}

/** A row of public.ai_agent_settings (supabase/migrations/0012_ai_agent.sql). */
export interface AgentSettingsRow {
  id: number;
  is_enabled: boolean;
  agent_name: string;
  greeting: string;
  suggested_questions: string[];
  instructions: string;
  daily_message_cap: number;
  panel_watt: number;
  panel_length_m: number;
  panel_width_m: number;
  usable_roof_ratio: number;
  monthly_yield_per_kwp: number;
  tariff_blocks: TariffBlock[];
  avg_tariff_domestic: number;
  avg_tariff_commercial: number;
  export_rate: number | null;
  dc_ac_ratio: number;
  inverter_sizes_kw: number[];
  battery_unit_kwh: number;
  battery_dod: number;
  co2_kg_per_kwh: number;
  show_prices: boolean;
  pricing: {
    onGrid?: { min: number; max: number };
    hybrid?: { min: number; max: number };
    offGrid?: { min: number; max: number };
    batteryPerKwh?: { min: number; max: number };
  };
  updated_at?: string;
}

export interface KnowledgeRow {
  id: string;
  title: string;
  category: string;
  content: string;
  is_active: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ChatSessionRow {
  id: string;
  token: string;
  visitor_hash: string | null;
  ip_hash: string | null;
  started_path: string | null;
  user_agent: string | null;
  first_message: string | null;
  message_count: number;
  last_message_at: string | null;
  estimate: EstimateResult | null;
  lead_id: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  created_at: string;
}

export interface ChatMessageRow {
  id: string;
  session_id: string;
  role: ChatRole;
  content: string;
  meta: ChatMessageMeta | null;
  created_at: string;
}
