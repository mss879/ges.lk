"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AgentSettingsRow } from "@/lib/chat/types";
import { estimateSolarSystem } from "@/lib/solar/estimate";
import { toCalculatorSettings } from "@/lib/solar/settings";
import type { AreaUnit, PropertyType, SystemType } from "@/lib/solar/types";
import EstimateCard from "@/components/chat/EstimateCard";

const field =
  "w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold placeholder-stone-400 focus:border-[#00AC4E] focus:outline-none focus:ring-1 focus:ring-[#00AC4E]";
const labelCls = "text-[11px] font-bold uppercase tracking-widest text-stone-500";
const card = "rounded-2xl border border-stone-200 bg-white p-5 shadow-sm";

type Range = { min: string; max: string };
type Block = { upTo: string; rate: string; fixed: string };

/** Form state: numbers held as strings while typing. */
interface Form {
  panel_watt: string;
  panel_length_m: string;
  panel_width_m: string;
  usable_pct: string;
  monthly_yield_per_kwp: string;
  co2_kg_per_kwh: string;
  avg_tariff_domestic: string;
  avg_tariff_commercial: string;
  export_rate: string;
  tariff_blocks: Block[];
  dc_ac_ratio: string;
  inverter_sizes_kw: string;
  battery_unit_kwh: string;
  battery_dod_pct: string;
  show_prices: boolean;
  onGrid: Range;
  hybrid: Range;
  offGrid: Range;
  batteryPerKwh: Range;
}

const s = (n: unknown) => (n === null || n === undefined ? "" : String(n));
const rangeIn = (r?: { min: number; max: number }): Range => ({ min: s(r?.min), max: s(r?.max) });
const rangeOut = (r: Range) => {
  const min = Number(r.min);
  const max = Number(r.max);
  return r.min && r.max && min > 0 && max >= min ? { min, max } : undefined;
};

function toForm(row: AgentSettingsRow): Form {
  return {
    panel_watt: s(row.panel_watt),
    panel_length_m: s(row.panel_length_m),
    panel_width_m: s(row.panel_width_m),
    usable_pct: s(Math.round(Number(row.usable_roof_ratio) * 100)),
    monthly_yield_per_kwp: s(row.monthly_yield_per_kwp),
    co2_kg_per_kwh: s(row.co2_kg_per_kwh),
    avg_tariff_domestic: s(row.avg_tariff_domestic),
    avg_tariff_commercial: s(row.avg_tariff_commercial),
    export_rate: s(row.export_rate),
    tariff_blocks: (row.tariff_blocks ?? []).map((b) => ({ upTo: s(b.upTo), rate: s(b.rate), fixed: s(b.fixed ?? "") })),
    dc_ac_ratio: s(row.dc_ac_ratio),
    inverter_sizes_kw: (row.inverter_sizes_kw ?? []).join(", "),
    battery_unit_kwh: s(row.battery_unit_kwh),
    battery_dod_pct: s(Math.round(Number(row.battery_dod) * 100)),
    show_prices: Boolean(row.show_prices),
    onGrid: rangeIn(row.pricing?.onGrid),
    hybrid: rangeIn(row.pricing?.hybrid),
    offGrid: rangeIn(row.pricing?.offGrid),
    batteryPerKwh: rangeIn(row.pricing?.batteryPerKwh),
  };
}

function toRow(f: Form) {
  return {
    panel_watt: Number(f.panel_watt),
    panel_length_m: Number(f.panel_length_m),
    panel_width_m: Number(f.panel_width_m),
    usable_roof_ratio: Number(f.usable_pct) / 100,
    monthly_yield_per_kwp: Number(f.monthly_yield_per_kwp),
    co2_kg_per_kwh: Number(f.co2_kg_per_kwh),
    avg_tariff_domestic: Number(f.avg_tariff_domestic),
    avg_tariff_commercial: Number(f.avg_tariff_commercial),
    export_rate: f.export_rate.trim() === "" ? null : Number(f.export_rate),
    tariff_blocks: f.tariff_blocks
      .filter((b) => b.rate.trim() !== "")
      .map((b) => ({ upTo: b.upTo.trim() === "" ? null : Number(b.upTo), rate: Number(b.rate), fixed: b.fixed.trim() === "" ? 0 : Number(b.fixed) })),
    dc_ac_ratio: Number(f.dc_ac_ratio),
    inverter_sizes_kw: f.inverter_sizes_kw
      .split(/[,\s]+/)
      .map(Number)
      .filter((n) => Number.isFinite(n) && n > 0)
      .sort((a, b) => a - b),
    battery_unit_kwh: Number(f.battery_unit_kwh),
    battery_dod: Number(f.battery_dod_pct) / 100,
    show_prices: f.show_prices,
    pricing: Object.fromEntries(
      (["onGrid", "hybrid", "offGrid", "batteryPerKwh"] as const)
        .map((k) => [k, rangeOut(f[k])])
        .filter(([, v]) => v),
    ),
  };
}

function Num({
  label,
  value,
  onChange,
  suffix,
  hint,
  step = "any",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  hint?: string;
  step?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelCls}>{label}</span>
      <span className="relative">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${field} ${suffix ? "pr-14" : ""}`}
        />
        {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-stone-400">{suffix}</span>}
      </span>
      {hint && <span className="text-[11px] font-semibold leading-snug text-stone-400">{hint}</span>}
    </label>
  );
}

function Section({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <section className={card}>
      <h2 className="font-display text-base font-black text-stone-900">{title}</h2>
      {intro && <p className="mt-1 text-xs font-medium text-stone-500">{intro}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function CalculatorClient({ initial }: { initial: AgentSettingsRow }) {
  const [form, setForm] = useState<Form>(() => toForm(initial));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));

  // "Try it" inputs
  const [area, setArea] = useState("1200");
  const [unit, setUnit] = useState<AreaUnit>("sqft");
  const [units, setUnits] = useState("350");
  const [bill, setBill] = useState("");
  const [property, setProperty] = useState<PropertyType>("home");
  const [system, setSystem] = useState<SystemType>("on-grid");
  const [backup, setBackup] = useState("");
  const [load, setLoad] = useState("");

  const preview = useMemo(() => {
    const settings = toCalculatorSettings({ ...initial, ...toRow(form) } as AgentSettingsRow);
    return estimateSolarSystem(
      {
        roofArea: Number(area) || null,
        areaUnit: unit,
        monthlyUnits: Number(units) || null,
        monthlyBill: Number(bill) || null,
        propertyType: property,
        systemType: system,
        backupHours: Number(backup) || null,
        essentialLoadKw: Number(load) || null,
      },
      settings,
    );
  }, [form, initial, area, unit, units, bill, property, system, backup, load]);

  const save = async () => {
    const row = toRow(form);
    const invalid =
      !(row.panel_watt >= 100 && row.panel_watt <= 1000) ||
      !(row.panel_length_m >= 0.5 && row.panel_length_m <= 3.5) ||
      !(row.panel_width_m >= 0.3 && row.panel_width_m <= 2.5) ||
      !(row.usable_roof_ratio > 0 && row.usable_roof_ratio <= 1) ||
      !(row.monthly_yield_per_kwp >= 50 && row.monthly_yield_per_kwp <= 250) ||
      !(row.avg_tariff_domestic > 0 && row.avg_tariff_commercial > 0) ||
      !(row.dc_ac_ratio >= 0.8 && row.dc_ac_ratio <= 1.6) ||
      !(row.battery_unit_kwh > 0) ||
      !(row.battery_dod > 0 && row.battery_dod <= 1) ||
      row.inverter_sizes_kw.length === 0;
    if (invalid) {
      setMessage({ kind: "err", text: "Some values are out of range — check panel size (100–1000 W), yield (50–250), usable roof (1–100%) and that every field is filled." });
      return;
    }
    setSaving(true);
    setMessage(null);
    const { error } = await createClient().from("ai_agent_settings").upsert({ id: 1, ...row }, { onConflict: "id" });
    setSaving(false);
    if (error) return setMessage({ kind: "err", text: error.message });
    setMessage({ kind: "ok", text: "Saved. The assistant uses the new numbers within a minute." });
  };

  const rangeInputs = (key: "onGrid" | "hybrid" | "offGrid" | "batteryPerKwh", label: string, unitLabel: string) => (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="mt-1.5 grid grid-cols-2 gap-2">
        <Num label="Min" value={form[key].min} onChange={(v) => set(key, { ...form[key], min: v })} suffix={unitLabel} />
        <Num label="Max" value={form[key].max} onChange={(v) => set(key, { ...form[key], max: v })} suffix={unitLabel} />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-stone-500">
            The numbers the assistant sizes systems with. Every estimate it gives comes from these.
          </p>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[#00AC4E] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#019544] disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Save changes
          </button>
        </div>

        {message && (
          <p
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold ${
              message.kind === "ok"
                ? "border border-[#00AC4E]/20 bg-[#00AC4E]/10 text-[#007a37]"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </p>
        )}

        <Section title="Panels and roof" intro="Use the panel GES installs most often.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Num label="Panel power" value={form.panel_watt} onChange={(v) => set("panel_watt", v)} suffix="W" />
            <Num label="Panel length" value={form.panel_length_m} onChange={(v) => set("panel_length_m", v)} suffix="m" />
            <Num label="Panel width" value={form.panel_width_m} onChange={(v) => set("panel_width_m", v)} suffix="m" />
            <Num
              label="Usable roof"
              value={form.usable_pct}
              onChange={(v) => set("usable_pct", v)}
              suffix="%"
              hint="Share of a stated roof that can carry panels."
            />
          </div>
        </Section>

        <Section title="Generation">
          <div className="grid grid-cols-2 gap-3">
            <Num
              label="Monthly yield"
              value={form.monthly_yield_per_kwp}
              onChange={(v) => set("monthly_yield_per_kwp", v)}
              suffix="units/kWp"
              hint="Units one kWp makes per month on average (Sri Lanka: ~110–130)."
            />
            <Num
              label="Grid CO₂ factor"
              value={form.co2_kg_per_kwh}
              onChange={(v) => set("co2_kg_per_kwh", v)}
              suffix="kg/kWh"
              hint="Used for the CO₂-saved figure."
            />
          </div>
        </Section>

        <Section
          title="Electricity tariffs"
          intro="Used to turn a bill into units and to estimate savings. Update these when CEB/LECO tariffs change."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Num label="Average — homes" value={form.avg_tariff_domestic} onChange={(v) => set("avg_tariff_domestic", v)} suffix="LKR/unit" />
            <Num label="Average — businesses" value={form.avg_tariff_commercial} onChange={(v) => set("avg_tariff_commercial", v)} suffix="LKR/unit" />
            <Num
              label="Export rate (optional)"
              value={form.export_rate}
              onChange={(v) => set("export_rate", v)}
              suffix="LKR/unit"
              placeholder="Not quoted"
              hint="Leave empty and the assistant never quotes a buy-back rate."
            />
          </div>

          <div className="mt-5">
            <span className={labelCls}>Domestic block tariff (optional, more accurate)</span>
            <p className="mt-1 text-[11px] font-semibold text-stone-400">
              For households using more than 60 units a month. Leave the last row&apos;s &quot;up to&quot; empty for &quot;and above&quot;. Without blocks, the average tariff is used.
            </p>
            {form.tariff_blocks.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  <span>Up to (units)</span>
                  <span>Rate (LKR/unit)</span>
                  <span>Fixed charge (LKR)</span>
                  <span className="w-8" />
                </div>
                {form.tariff_blocks.map((b, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                    {(["upTo", "rate", "fixed"] as const).map((k) => (
                      <input
                        key={k}
                        type="number"
                        step="any"
                        value={b[k]}
                        placeholder={k === "upTo" ? "and above" : "0"}
                        onChange={(e) =>
                          set(
                            "tariff_blocks",
                            form.tariff_blocks.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)),
                          )
                        }
                        className={field}
                      />
                    ))}
                    <button
                      onClick={() => set("tariff_blocks", form.tariff_blocks.filter((_, j) => j !== i))}
                      title="Remove block"
                      className="flex w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => set("tariff_blocks", [...form.tariff_blocks, { upTo: "", rate: "", fixed: "" }])}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1.5 text-[11px] font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
            >
              <Plus className="h-3 w-3" /> Add block
            </button>
          </div>
        </Section>

        <Section title="Inverters and batteries">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Num label="DC/AC ratio" value={form.dc_ac_ratio} onChange={(v) => set("dc_ac_ratio", v)} hint="Panel kWp ÷ inverter kW." />
            <Num label="Battery module" value={form.battery_unit_kwh} onChange={(v) => set("battery_unit_kwh", v)} suffix="kWh" />
            <Num label="Usable depth" value={form.battery_dod_pct} onChange={(v) => set("battery_dod_pct", v)} suffix="%" hint="Depth of discharge." />
          </div>
          <label className="mt-3 flex flex-col gap-1.5">
            <span className={labelCls}>Inverter sizes offered (kW)</span>
            <input value={form.inverter_sizes_kw} onChange={(e) => set("inverter_sizes_kw", e.target.value)} className={field} placeholder="3, 5, 6, 8, 10…" />
          </label>
        </Section>

        <Section title="Price ranges" intro="Only quoted to visitors when switched on. Prices are per kWp of panels; batteries per kWh.">
          <label className="mb-4 flex cursor-pointer items-center gap-2.5">
            <input type="checkbox" checked={form.show_prices} onChange={(e) => set("show_prices", e.target.checked)} className="h-4 w-4 accent-[#00AC4E]" />
            <span className="text-sm font-bold text-stone-800">Let the assistant quote indicative price ranges</span>
          </label>
          <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${form.show_prices ? "" : "opacity-50"}`}>
            {rangeInputs("onGrid", "On-grid", "LKR/kWp")}
            {rangeInputs("hybrid", "Hybrid (excl. battery)", "LKR/kWp")}
            {rangeInputs("offGrid", "Off-grid (excl. battery)", "LKR/kWp")}
            {rangeInputs("batteryPerKwh", "Battery storage", "LKR/kWh")}
          </div>
        </Section>
      </div>

      {/* Try it */}
      <aside className="h-fit xl:sticky xl:top-6">
        <div className={card}>
          <h2 className="font-display text-base font-black text-stone-900">Try it</h2>
          <p className="mt-1 text-xs font-medium text-stone-500">
            Exactly what the assistant would tell a visitor — using the values on the left, including unsaved changes.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Num label="Roof area" value={area} onChange={setArea} />
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>Unit</span>
              <select value={unit} onChange={(e) => setUnit(e.target.value as AreaUnit)} className={field}>
                <option value="sqft">sq ft</option>
                <option value="sqm">m²</option>
              </select>
            </label>
            <Num label="Monthly units" value={units} onChange={setUnits} suffix="kWh" />
            <Num label="Monthly bill" value={bill} onChange={setBill} suffix="LKR" />
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>Property</span>
              <select value={property} onChange={(e) => setProperty(e.target.value as PropertyType)} className={field}>
                <option value="home">Home</option>
                <option value="business">Business</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelCls}>System</span>
              <select value={system} onChange={(e) => setSystem(e.target.value as SystemType)} className={field}>
                <option value="on-grid">On-grid</option>
                <option value="hybrid">Hybrid</option>
                <option value="off-grid">Off-grid</option>
              </select>
            </label>
            {system !== "on-grid" && (
              <>
                <Num label="Backup hours" value={backup} onChange={setBackup} placeholder={system === "off-grid" ? "12" : "4"} />
                <Num label="Essential load" value={load} onChange={setLoad} suffix="kW" placeholder={property === "home" ? "1" : "3"} />
              </>
            )}
          </div>

          <div className="mt-4">
            {preview.ok ? (
              <>
                <EstimateCard estimate={preview} />
                <details className="mt-3">
                  <summary className="cursor-pointer text-[11px] font-bold text-stone-500">Assumptions</summary>
                  <ul className="mt-2 list-disc pl-4 text-[11px] font-medium leading-relaxed text-stone-500">
                    {preview.assumptions.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </details>
              </>
            ) : (
              <p className="rounded-xl bg-stone-50 px-3 py-2.5 text-xs font-semibold text-stone-500">{preview.error}</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
