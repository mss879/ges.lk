import type { AgentSettingsRow } from "@/lib/chat/types";
import type { CalculatorSettings, TariffBlock } from "./types";

/**
 * Defaults matching supabase/migrations/0013_seed_ai_agent.sql — used if the
 * settings row hasn't been created yet, so the agent still works.
 */
export const DEFAULT_AGENT_SETTINGS: AgentSettingsRow = {
  id: 1,
  is_enabled: true,
  agent_name: "GES Solar Assistant",
  greeting:
    "Hi! I'm the GES Solar Assistant. Ask me anything about solar for your home or business — or tell me your roof size or your monthly electricity units and I'll estimate the system you'd need.",
  suggested_questions: [
    "How many panels fit on a 1,200 sq ft roof?",
    "My bill is about Rs 15,000 a month — what system do I need?",
    "On-grid or hybrid: which is right for me?",
    "How does CEB net metering work?",
  ],
  instructions: "",
  daily_message_cap: 1500,
  panel_watt: 590,
  panel_length_m: 2.278,
  panel_width_m: 1.134,
  usable_roof_ratio: 0.7,
  monthly_yield_per_kwp: 120,
  tariff_blocks: [],
  avg_tariff_domestic: 45,
  avg_tariff_commercial: 48,
  export_rate: null,
  dc_ac_ratio: 1.1,
  inverter_sizes_kw: [3, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50],
  battery_unit_kwh: 5.12,
  battery_dod: 0.9,
  co2_kg_per_kwh: 0.7,
  show_prices: false,
  pricing: {},
};

const num = (v: unknown, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

function range(v: unknown) {
  if (!v || typeof v !== "object") return undefined;
  const r = v as { min?: unknown; max?: unknown };
  const min = Number(r.min);
  const max = Number(r.max);
  return Number.isFinite(min) && Number.isFinite(max) && min > 0 && max >= min ? { min, max } : undefined;
}

/** Maps a settings row (numeric columns may arrive as strings) to calculator inputs. */
export function toCalculatorSettings(row: Partial<AgentSettingsRow> | null | undefined): CalculatorSettings {
  const d = DEFAULT_AGENT_SETTINGS;
  const r = row ?? {};
  const blocks: TariffBlock[] = Array.isArray(r.tariff_blocks)
    ? r.tariff_blocks
        .map((b) => ({
          upTo: b?.upTo === null || b?.upTo === undefined || (b.upTo as unknown) === "" ? null : Number(b.upTo),
          rate: Number(b?.rate),
          fixed: b?.fixed === undefined || b?.fixed === null ? 0 : Number(b.fixed),
        }))
        .filter((b) => Number.isFinite(b.rate) && b.rate >= 0 && (b.upTo === null || Number.isFinite(b.upTo)))
    : [];
  const exportRate = r.export_rate === null || r.export_rate === undefined ? null : Number(r.export_rate);
  const pricing = (r.pricing ?? {}) as AgentSettingsRow["pricing"];

  return {
    panelWatt: num(r.panel_watt, d.panel_watt),
    panelLengthM: num(r.panel_length_m, d.panel_length_m),
    panelWidthM: num(r.panel_width_m, d.panel_width_m),
    usableRoofRatio: Math.min(1, num(r.usable_roof_ratio, d.usable_roof_ratio)),
    monthlyYieldPerKwp: num(r.monthly_yield_per_kwp, d.monthly_yield_per_kwp),
    tariffBlocks: blocks,
    avgTariffDomestic: num(r.avg_tariff_domestic, d.avg_tariff_domestic),
    avgTariffCommercial: num(r.avg_tariff_commercial, d.avg_tariff_commercial),
    exportRate: exportRate !== null && Number.isFinite(exportRate) && exportRate >= 0 ? exportRate : null,
    dcAcRatio: num(r.dc_ac_ratio, d.dc_ac_ratio),
    inverterSizesKw: (Array.isArray(r.inverter_sizes_kw) ? r.inverter_sizes_kw : d.inverter_sizes_kw)
      .map(Number)
      .filter((n) => Number.isFinite(n) && n > 0),
    batteryUnitKwh: num(r.battery_unit_kwh, d.battery_unit_kwh),
    batteryDod: Math.min(1, num(r.battery_dod, d.battery_dod)),
    co2KgPerKwh: Number.isFinite(Number(r.co2_kg_per_kwh)) ? Number(r.co2_kg_per_kwh) : d.co2_kg_per_kwh,
    showPrices: Boolean(r.show_prices),
    pricing: {
      onGrid: range(pricing.onGrid),
      hybrid: range(pricing.hybrid),
      offGrid: range(pricing.offGrid),
      batteryPerKwh: range(pricing.batteryPerKwh),
    },
  };
}
